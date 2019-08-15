import { Rule, Card } from './game-rule';

export class Player {
  cards: Card[] = [];
  winDeck = [];

  score = 0;
  constructor(private rule: Rule) {}

  take(card) {
    this.cards.push(card);
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
