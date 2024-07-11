import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { filter, Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  orderByAsc,
  orderByDesc,
  unsubscribePetition,
} from '../../utils/utils';
import { Card, Cards } from '../../interfaces/cards.interface';

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
  public rarity: string = '';
  public orderRarity: string = '';
  public cardsBackUp: Card[] = this.cardsService.cards;

  //* CONSTRUCTOR:

  constructor(private cardsService: CardsService) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    orderByAsc(this.cardsService.cards);
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscripciones);
  }

  //* FUNCIONES:

  //Funcion para cambiar el valor que va a emitir el BehaviorSubject

  public updateInputText(value: string) {
    this.cardsService.changeInputValue(value);
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

  //Función para encapsular la petición a AllCards

  public callToAllCards(value: number): Subscription {
    let peticionAllCards = this.cardsService.getAllCards(value).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        this.cardsBackUp = res.cards;
        this.toGetOrderPersistence();
        this.toGetRarityPersistence();
        this.toGetRarityOrderPersistence();
        this.updateInputText('');
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

  //Función para mantener la persistencia de Rarity;

  public toGetRarityPersistence(): void {
    let datos: Card[] = [];

    this.filterByRarity(datos, this.rarity);

    if (this.cardsService.cards.length === 0) {
      this.cardsService.cards = this.cardsBackUp;
      this.rarity = 'Common';
    }
  }

  //Función para mantener la persistencia de Rarity Order;

  public toGetRarityOrderPersistence(): void {
    this.orderRarity = 'Normal';
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

  //Función para cambiar Rareza Básica

  public changeRarity(event: Event) {
    let selectedValue = (event.target as HTMLSelectElement).value;
    let datos: Card[] = [];
    this.rarity = selectedValue;

    //Este If recarga el array del backUp

    if (this.cardsService.cards.length < 100) {
      this.cardsService.cards = this.cardsBackUp;
    }

    switch (selectedValue) {
      case 'All':
        this.cardsService.cards = this.cardsBackUp;
        break;

      case 'Common':
        this.filterByRarity(datos, 'Common');

        break;

      case 'Uncommon':
        this.filterByRarity(datos, 'Uncommon');

        break;
      case 'Rare':
        this.filterByRarity(datos, 'Rare');

        break;
      case 'Special':
        this.filterByRarity(datos, 'Special');

        break;
      case 'Mythic':
        this.filterByRarity(datos, 'Mythic');

        break;
    }

    if (this.cardsService.cards.length === 0) {
      this.cardsService.cards = this.cardsBackUp;
      (event.target as HTMLSelectElement).value = '';
      this.rarity = '';
      alert(
        `No existen cartas en esta página con el filtro: "${selectedValue}" `
      );
    }
  }

  //Función para cambiar rareza compleja

  public changeRarityOrder(event: Event) {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Special', 'Mythic'];
    let selectedValue = (event.target as HTMLSelectElement).value;
    let data: Card[] = [];
    let orderedCards: Card[] = [];

    for (let i = 0; i < rarities.length; i++) {
      data = this.cardsService.cards.filter((elem) => {
        if (elem.rarity === rarities[i]) {
          orderedCards.push(elem);
        }
      });
    }

    switch (selectedValue) {
      case 'Normal':
        this.cardsService.cards = this.cardsBackUp;

        break;

      case 'Common to Mythic':
        this.cardsService.cards = orderedCards;

        break;

      case 'Mythic to Common':
        this.cardsService.cards = orderedCards.reverse();

        break;
    }
  }

  //Función para filtrar array según Rareza

  public filterByRarity(data: Card[], rarity: string): void {
    data = this.cardsService.cards.filter((elem) => elem.rarity === rarity);
    this.cardsService.cards = data;
  }
}
