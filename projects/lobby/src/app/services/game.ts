import { Subject, BehaviorSubject, merge, of } from 'rxjs';
import { scan, tap, filter, shareReplay, map, mergeMap } from 'rxjs/operators';
import { Player } from './player';
export class Game {
  players = [];
  deck = [];
  currentTurn = 0;

  pool$ = new BehaviorSubject([]);
  newRound = new Subject<boolean>();

  pool = merge(this.pool$, this.newRound).pipe(
    filter(v => v !== null),
    scan<any[]>((acc, value: any[] | boolean) => {
      return typeof value === 'boolean' ? [] : [...acc, ...value];
    }, []),
    tap(v => console.log(v)),
    shareReplay()
  );

  constructor(private numOfPlayer, startCardsPerPlayer, deck) {
    this.initGame(startCardsPerPlayer, deck).subscribe(
      ({ initDeck, players, pools }) => {
        this.deck = initDeck;
        this.players = players;
        this.currentTurn = pools.length;
      }
    );
  }

  initGame(startCardsPerPlayer, deck) {
    return of(deck).pipe(
      map(this.shuffle),
      map(shuffedDeck => this.set(startCardsPerPlayer, shuffedDeck)),
      mergeMap(({ initDeck, players }) =>
        this.pool.pipe(map(pools => ({ initDeck, players, pools })))
      )
    );
  }

  play(...card) {
    this.pool$.next(card);
  }

  condition(idx) {
    return () => this.currentTurn % this.players.length === idx;
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
