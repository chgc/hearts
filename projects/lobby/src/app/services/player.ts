import { Card } from './dealer.service';

export class Player {
  cards: Card[] = [];

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
