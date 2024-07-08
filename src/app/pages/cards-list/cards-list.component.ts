import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterComponent } from '../../components/filter/filter.component';
import { CardComponent } from '../../components/card/card.component';
import { ResultsComponent } from '../../components/results/results.component';
import { CardsService } from '../../services/cards.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [FilterComponent, CardComponent, ResultsComponent, CommonModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent implements OnInit, OnDestroy {
  public suscripciones: Subscription[] = [];

  constructor(private cardsService: CardsService) {}

  get cartasServicio() {
    return this.cardsService.cards;
  }

  ngOnInit(): void {
    this.getAllCards();
  }

  ngOnDestroy(): void {
    //nos desuscribimos del las suscripciones de getAllCards
    this.suscripciones.forEach((item) => {
      item.unsubscribe;
    });
  }

  public getAllCards(): void {
    let peticionAllCards = this.cardsService.getAllCards().subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
      },
    });

    this.suscripciones.push(peticionAllCards);
  }
}
