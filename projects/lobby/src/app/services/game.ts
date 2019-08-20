import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  scan,
  shareReplay,
  tap,
  finalize,
  takeWhile
} from 'rxjs/operators';
import { Player } from './player';
import { Rule, CARD_SCORE, Card, CARD_SPECIAL } from './game-rule';

export class Game {
  players: Player[] = [];
  deck = [];
  pools: Card[] = [];
  currentTurn = 0;
  lastWinner = 0;
  scoreCard = [];

  pool$ = new BehaviorSubject([]);

  findWinner = tap((deck: Card[]) => {
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
    }
    this.currentTurn =
      deck.length === 0 || deck.length === 4
        ? this.lastWinner
        : (this.currentTurn + 1) % this.numOfPlayer;
  });

  gameFinish = finalize<Card[]>(() => {
    const playerHasAllHearts = this.players.find(
      x => x.winDeck.filter(card => card.face === 'hearts').length === 13
    );

    const hasCards = (face, cardNumber) => cards =>
      cards.filter(x => x.face === face && x.number === cardNumber).length > 0;

    const hasJack = (cards: Card[]) => hasCards('diamonds', 'hack')(cards);

    const hasPig = (cards: Card[]) => hasCards('spades', 'queen')(cards);

    const hasDouble = (cards: Card[]) => hasCards('clubs', 'ten')(cards);

    this.players.forEach((player, index) => {
      if (playerHasAllHearts) {
        if (player === playerHasAllHearts) {
          if (hasJack(player.specialCard)) {
            player.score -= 100;
          }
          if (hasPig(player.specialCard)) {
            player.score += 100;
          }
          // 豬羊變色
          player.score *= -1;
        }
        if (hasJack(player.specialCard)) {
          player.score -= 100;
        }
        if (hasPig(player.specialCard)) {
          player.score += 100;
        }
      }
      if (hasDouble(player.specialCard)) {
        if (player.winDeck.length === 0) {
          player.score = 50;
        } else {
          player.score *= 2;
        }
      }
      this.scoreCard[index] = player.score;
    });
    console.log('game finish', this.scoreCard);
  });

  endGame = takeWhile<Card[]>(() => {
    return (
      this.players.length === 0 ||
      this.players.some(player => player.cards.length > 0)
    );
  }, true);

  gameHandler$ = this.pool$.asObservable().pipe(
    filter(v => v !== null),
    scan((acc, value) => (value.length === 0 ? [] : [...acc, ...value]), []),
    this.findWinner,
    this.endGame,
    this.gameFinish,
    shareReplay()
  );

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

  constructor(private numOfPlayer, startCardsPerPlayer, deck) {
    this.initGame(startCardsPerPlayer, deck).subscribe(
      ({ initDeck, players, pools }) => {
        this.deck = initDeck;
        this.players = players;
        this.pools = pools;
      }
    );
  }

  private gameRule(): Rule {
    return {
      cardPoint: CARD_SCORE,
      specialRule: CARD_SPECIAL
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
