import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @Input() cards = [];
  @Input() canPick: () => boolean;
  @Output() playCard = new EventEmitter<any>();

  play(idx) {
    if (!this.canPick()) {
      return;
    }
    const card = this.cards.splice(idx, 1)[0];
    this.playCard.emit(card);
  }
}
