import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../interfaces/cards.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() public card!: Card;

  constructor(){}





}
