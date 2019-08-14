import { Component } from '@angular/core';

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
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lobby';
  cards = [];
  players = [[], [], [], []];

  constructor() {
    this.newGame();
  }

  newpack() {
    this.cards = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        this.cards.push({ face: FACES[i], number: CARD_NUM[j] });
      }
    }
  }

  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  deal() {
    this.players = this.cards.reduce(
      (players, card, index) => {
        players[index % 4].push(card);
        return players;
      },
      [[], [], [], []]
    );
  }

  newGame() {
    this.newpack();
    this.shuffle();
    this.deal();
  }
}
