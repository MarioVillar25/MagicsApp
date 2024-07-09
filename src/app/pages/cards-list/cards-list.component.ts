import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterComponent } from '../../components/filter/filter.component';
import { CardComponent } from '../../components/card/card.component';
import { CardsService } from '../../services/cards.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [FilterComponent, CardComponent, CommonModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent implements OnInit, OnDestroy {
  public suscripciones: Subscription[] = [];
  //public currentPage: number = this.cardsService.currentPage;

  constructor(private cardsService: CardsService) {}

  get currentPage() {
    return this.cardsService.currentPage;
  }

  get cartasServicio() {
    return this.cardsService.cards;
  }

  public ngOnInit(): void {
    this.getAllCards(this.cardsService.currentPage);
  }

  public ngOnDestroy(): void {
    //nos desuscribimos del las suscripciones de getAllCards
    this.suscripciones.forEach((item) => {
      item.unsubscribe;
    });
  }

  public getAllCards(value: number): void {
    let peticionAllCards = this.cardsService.getAllCards(value).subscribe({
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
