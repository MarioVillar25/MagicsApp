import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../../components/filter/filter.component';
import { CardComponent } from '../../components/card/card.component';
import { ResultsComponent } from '../../components/results/results.component';
import { CardsService } from '../../services/cards.service';
import { Card, Cards } from '../../interfaces/cards.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [FilterComponent, CardComponent, ResultsComponent, CommonModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent implements OnInit {
  public cards: Card[]= [] ;

  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.getAllCards();
  }

  public getAllCards(): void {
    this.cardsService.getAllCards().subscribe((cardsData) => {
      this.cards = cardsData.cards;
      //console.log(cardsData.cards);
    });
  }
}
