import { Component } from '@angular/core';
import { CardGameFactoryService } from './services/dealer.service';
import { Game } from './services/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  game: Game;

  constructor(private dealer: CardGameFactoryService) {
    this.newGame();
  }

  newGame() {
    this.game = this.dealer.newGame({
      numOfPlayer: 4
    });
  }
}
