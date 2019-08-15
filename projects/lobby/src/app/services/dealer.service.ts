import { Injectable } from '@angular/core';
import { Game } from './game';

export interface Card {
  face: string;
  number: string;
  value: number;
}
const FACES = ['clubs', 'hearts', 'spades', 'diamonds'];
const CARD_NUM = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'jack',
  'queen',
  'king'
];

@Injectable({
  providedIn: 'root'
})
export class CardGameFactoryService {
  newGame({ numOfPlayer, startCardsPerPlayer = 13 }) {
    return new Game(numOfPlayer, startCardsPerPlayer, this.newDeck());
  }

  private newDeck() {
    const deck = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        deck.push({ face: FACES[i], number: CARD_NUM[j], value: j + 1 });
      }
    }
    return deck;
  }
}
