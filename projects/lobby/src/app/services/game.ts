import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, mergeMap, scan, shareReplay, tap } from 'rxjs/operators';
import { Card } from './dealer.service';
import { Player } from './player';
export class Game {
  players = [];
  deck = [];
  pools: Card[] = [];
  currentTurn = 0;

  pool$ = new BehaviorSubject([]);

  process = tap((deck: Card[]) => {
    if (deck.length === 4) {
      this.pool$.next([]);
    }
  });

  gameHandler$ = this.pool$.asObservable().pipe(
    filter(v => v !== null),
    scan((acc, value) => {
      return value.length === 0 ? [] : [...acc, ...value];
    }, []),
    this.process,
    tap(v => console.log(v)),
    shareReplay()
  );

  constructor(private numOfPlayer, startCardsPerPlayer, deck) {
    this.initGame(startCardsPerPlayer, deck).subscribe(
      ({ initDeck, players, pools }) => {
        this.deck = initDeck;
        this.players = players;
        this.pools = pools;
        this.currentTurn = pools.length;
      }
    );
  }

  get currentPlayer() {
    return this.players[this.currentTurn % this.numOfPlayer];
  }

  initGame(startCardsPerPlayer, deck) {
    return of(deck).pipe(
      map(this.shuffle),
      map(shuffedDeck => this.set(startCardsPerPlayer, shuffedDeck)),
      mergeMap(({ initDeck, players }) =>
        this.gameHandler$.pipe(map(pools => ({ initDeck, players, pools })))
      )
    );
  }

  play(...card) {
    this.pool$.next(card);
  }

  legalPlay(player: Player, card: Card) {
    const rule1 = this.currentPlayer === player;
    const rule2 = [
      this.pools.length === 0,
      this.pools.length > 0 &&
        (this.pools[0].face === card.face ||
          player.cards.findIndex(x => x.face === this.pools[0].face) === -1)
    ].some(x => x);

    const rules = [rule1, rule2];
    return rules.every(x => x);
  }

  private set(startCardsPerPlayer, initDeck) {
    const players: Player[] = Array.from(
      Array(this.numOfPlayer),
      () => new Player()
    );
    const maxCardCount = Math.min(this.numOfPlayer * startCardsPerPlayer, 52);
    for (let i = 0; i < maxCardCount; i++) {
      players[i % this.numOfPlayer].take(initDeck.shift());
    }
    players.forEach(player => player.sort());
    return { initDeck, players };
  }

  private shuffle(deck) {
    return deck.slice().sort(() => Math.random() - 0.5);
  }
}
