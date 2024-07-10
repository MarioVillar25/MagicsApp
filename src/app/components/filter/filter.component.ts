import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Card } from '../../interfaces/cards.interface';
import {
  orderByAsc,
  orderByDesc,
  unsubscribePetition,
} from '../../utils/utils';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public suscripciones: Subscription[] = [];
  public orderBy: string = 'ASC';

  //* CONSTRUCTOR:

  constructor(private cardsService: CardsService) {}

  //* FUNCIONES:

  //Funciones para el ciclo de vida del componente:

  public ngOnInit(): void {
    orderByAsc(this.cardsService.cards);
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscripciones);
  }

  //Funciones para cambiar de páginas:

  public nextPage(): void {
    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length > 0) {
      unsubscribePetition(this.suscripciones);
    }

    let valor;

    //validamos para que el usuario no supere el límite de última página

    if (this.cardsService.currentPage >= 937) {
      valor = 937;
    } else {
      this.cardsService.currentPage++;
      valor = this.cardsService.currentPage;
      this.callToAllCards(valor);
    }
  }

  public previousPage(): void {
    //hacemos comprobación si existen subscripciones

    if (this.suscripciones.length > 0) {
      unsubscribePetition(this.suscripciones);
    }

    let valor;

    if (this.cardsService.currentPage <= 1) {
      valor = 1;
    } else {
      this.cardsService.currentPage--;
      valor = this.cardsService.currentPage;
      this.callToAllCards(valor);
    }
  }

  public firstPage(): void {
    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length !== 0) {
      unsubscribePetition(this.suscripciones);
    }

    if (this.cardsService.currentPage !== 1) {
      this.cardsService.currentPage = 1;
      this.callToAllCards(this.cardsService.currentPage);
    }
  }

  public lastPage(): void {
    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length !== 0) {
      unsubscribePetition(this.suscripciones);
    }

    if (this.cardsService.currentPage !== 937) {
      this.cardsService.currentPage = 937;
      this.callToAllCards(this.cardsService.currentPage);
    }
  }

  //Función para desuscribirse de todo el array de suscripciones

  //Función para encapsular la petición a AllCards

  public callToAllCards(value: number): Subscription {
    let peticionAllCards = this.cardsService.getAllCards(value).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        this.toGetOrderPersistence();
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
        unsubscribePetition(this.suscripciones);
      },
    });

    //pusheamos al array de suscripciones

    this.suscripciones.push(peticionAllCards);

    return peticionAllCards;
  }

  //Función para mantener la persistencia del orden ASC/DESC;

  public toGetOrderPersistence() {
    if (this.orderBy === 'ASC') {
      orderByAsc(this.cardsService.cards);
    }

    if (this.orderBy === 'DESC') {
      orderByDesc(this.cardsService.cards);
    }
  }

  //Función para intercalar orden ASC/DESC de cards;

  public handleSelect(event: Event): void {
    let selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case 'ASC':
        orderByAsc(this.cardsService.cards);

        this.orderBy = 'ASC';

        break;

      case 'DESC':
        orderByDesc(this.cardsService.cards);

        this.orderBy = 'DESC';

        break;
    }
  }
}
