import { Rule, Card } from './game-rule';

export class Player {
  cards: Card[] = [];
  winDeck: Card[] = [];
  specialCard: Card[] = [];
  score = 0;
  constructor(private rule: Rule) {}

  take(card) {
    this.cards.push(card);
  }

  play(card) {
    return this.cards.filter(x => x !== card);
  }

  win(deck: Card[]) {
    const isSpecial = card => {
      const face = this.rule.specialRule[card.face];
      return (face && face[card.number]) || false;
    };

    const hasPoint = card => {
      const face = this.rule.cardPoint[card.face];
      return (face && face[card.number]) || 0;
    };

    deck.forEach(card => {
      const score = hasPoint(card);
      if (score !== 0) {
        this.score += score;
        this.winDeck.push(card);
      }
      if (isSpecial(card)) {
        this.specialCard.push(card);
      }
    });
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
