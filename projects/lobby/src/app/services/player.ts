import { Rule, Card } from './game-rule';

export class Player {
  cards: Card[] = [];
  winDeck = [];

  score = 0;
  constructor(private rule: Rule) {}

  take(card) {
    this.cards.push(card);
  }

  play(card) {
    return this.cards.filter(x => x !== card);
  }

  win(deck: Card[]) {
    deck.forEach(card => {
      const face = this.rule.cardPoint[card.face];
      if (face) {
        this.score += face[card.number] || 0;
      }
    });
    this.winDeck.push(deck);
  }

  sort() {
    this.cards.sort((cardA, cardB) => {
      return cardA.face > cardB.face
        ? -1
        : cardA.face < cardB.face
        ? 1
        : cardA.value - cardB.value;
    });
  }
}
