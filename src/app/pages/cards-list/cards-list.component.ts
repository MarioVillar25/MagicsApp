import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterComponent } from '../../components/filter/filter.component';
import { CardComponent } from '../../components/card/card.component';
import { CardsService } from '../../services/cards.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Card } from '../../interfaces/cards.interface';
import { orderByAsc, unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [FilterComponent, CardComponent, CommonModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  private suscripciones: Subscription[] = [];

  //* CONSTRUCTOR:

  constructor(private cardsService: CardsService) {}

  //* LIFE CYCLE HOOKS:

  public ngOnInit(): void {
    this.getAllCards(this.cardsService.currentPage);
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscripciones);
  }

  //* GETTERS:

  public get currentPage() {
    return this.cardsService.currentPage;
  }

  public get cartasServicio() {
    return this.cardsService.cards;
  }

  //* FUNCIONES:

  public getAllCards(value: number): void {
    let peticionAllCards = this.cardsService.getAllCards(value).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        orderByAsc(this.cardsService.cards);
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
      },
    });

    this.suscripciones.push(peticionAllCards);
  }
}
