import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, mergeMap, scan, shareReplay, tap } from 'rxjs/operators';
import { Player } from './player';
import { Rule, CARD_SCORE, Card } from './game-rule';

export class Game {
  players: Player[] = [];
  deck = [];
  pools: Card[] = [];
  currentTurn = 0;
  lastWinner = 0;

  pool$ = new BehaviorSubject([]);

  process = tap((deck: Card[]) => {
    if (deck.length === 4) {
      const xdeck = deck
        .filter(x => x.face === deck[0].face)
        .map(x => (x.value === 1 ? 14 : x.value));

      const largestNum = Math.max(...xdeck);
      this.lastWinner =
        (deck.findIndex(
          x =>
            x.face === deck[0].face &&
            x.value === (largestNum === 14 ? 1 : largestNum)
        ) +
          this.lastWinner) %
        this.numOfPlayer;
      this.players[this.lastWinner].win(deck);

      setTimeout(() => {
        this.pool$.next([]);
      }, 500);
    } else {
      this.currentTurn =
        deck.length === 0
          ? this.lastWinner
          : (this.currentTurn + 1) % this.numOfPlayer;
    }
  });

  gameHandler$ = this.pool$.asObservable().pipe(
    filter(v => v !== null),
    scan((acc, value) => (value.length === 0 ? [] : [...acc, ...value]), []),
    this.process,
    shareReplay()
  );

  constructor(private numOfPlayer, startCardsPerPlayer, deck) {
    this.initGame(startCardsPerPlayer, deck).subscribe(
      ({ initDeck, players, pools }) => {
        this.deck = initDeck;
        this.players = players;
        this.pools = pools;
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

  private gameRule(): Rule {
    return {
      cardPoint: CARD_SCORE,
      specialRule: {}
    };
  }

  private set(startCardsPerPlayer, initDeck) {
    const players: Player[] = Array.from(
      Array(this.numOfPlayer),
      () => new Player(this.gameRule())
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
