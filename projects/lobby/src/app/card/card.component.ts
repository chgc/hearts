import { Component, Input } from '@angular/core';
import { Card } from '../services/dealer.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  styleClass = new Set();
  @Input()
  set card(value: Card) {
    if (!!value) {
      this.styleClass.add(value.face);
      this.styleClass.add(value.number);
    }
  }
}
