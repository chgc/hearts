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

  play(card) {
    if (!this.game.legalPlay(this.player, card)) {
      return;
    }
    this.player.cards = this.player.cards.filter(x => x !== card);
    this.game.play(card);
  }
}
