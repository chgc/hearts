export class Game {
  players = [];

  constructor(private numOfPlayer, startCardsPerPlayer, public deck) {
    this.deck = this.shuffle(deck);
    this.set(startCardsPerPlayer);
  }

  private set(startCardsPerPlayer) {
    this.players = Array.from(Array(this.numOfPlayer), () => []);
    const maxCardCount = Math.min(this.numOfPlayer * startCardsPerPlayer, 52);
    for (let i = 0; i < maxCardCount; i++) {
      this.players[i % this.numOfPlayer].push(this.deck.shift());
    }
  }

  playCard() {}

  private shuffle(deck) {
    return deck.slice().sort(() => Math.random() - 0.5);
  }
}
