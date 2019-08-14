import { Component } from '@angular/core';
import { CardGameFactoryService } from './services/dealer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lobby';
  cards = [];
  players = [[], [], [], []];
  pool = [];
  currentTurn = 0;

  constructor(private dealer: CardGameFactoryService) {
    this.newGame();
  }

  condition(idx) {
    return function() {
      return this.currentTurn % this.players.length === idx;
    }.bind(this);
  }

  newGame() {
    this.pool = [];
    const game = this.dealer.newGame({
      numOfPlayer: 4
    });
    this.players = game.players;
    this.cards = game.deck;
  }

  sendToPool(card) {
    this.pool.push(card);
    this.currentTurn += 1;
  }
}
