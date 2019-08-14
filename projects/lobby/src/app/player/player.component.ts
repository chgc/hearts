import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @Input() cards = [];
  @Input() canPick: () => boolean;
  @Output() pickCard = new EventEmitter<any>();

  pick(idx) {
    console.log(this.canPick());
    if (!this.canPick()) {
      return;
    }
    const card = this.cards.splice(idx, 1)[0];
    this.pickCard.emit(card);
  }
}
