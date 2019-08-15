import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../services/player';
import { Game } from '../services/game';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @Input() player: Player;
  @Input() game: Game;

  play(idx) {
    if (this.player !== this.game.currentPlayer) {
      return;
    }
    const card = this.player.cards.splice(idx, 1)[0];
    this.game.play(card);
  }
}
