import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnDestroy {
  public suscripciones: Subscription[] = [];

  constructor(private cardsService: CardsService) {}

  public ngOnDestroy(): void {
    this.unsubscribePetition();
  }

  //Funciones para cambiar de páginas:

  public nextPage(): void {
    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length > 0) {
      this.unsubscribePetition();
    }

    let valor;

    //validamos para que el usuario no supere el límite de última página

    if (this.cardsService.currentPage >= 937) {
      valor = 937;
    } else {
      this.cardsService.currentPage++;
      valor = this.cardsService.currentPage;
      console.log('valor', valor);
      this.callToAllCards(valor);
    }
  }

  public previousPage(): void {
    //hacemos comprobación si existen subscripciones

    if (this.suscripciones.length > 0) {
      this.unsubscribePetition();
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
      this.unsubscribePetition();
    }

    if (this.cardsService.currentPage !== 1) {
      this.cardsService.currentPage = 1;
      this.callToAllCards(this.cardsService.currentPage);
    }
  }

  public lastPage(): void {
    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length !== 0) {
      this.unsubscribePetition();
    }

    if (this.cardsService.currentPage !== 937) {
      this.cardsService.currentPage = 937;
      this.callToAllCards(this.cardsService.currentPage);
    }
  }

  //Función para desuscribirse de todo el array de suscripciones

  public unsubscribePetition(): void {
    this.suscripciones.forEach((item) => {
      item.unsubscribe();
    });

    this.suscripciones = [];
  }

  //Función para encapsular la petición a AllCards

  public callToAllCards(value: number): Subscription {
    let peticionAllCards = this.cardsService.getAllCards(value).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
        this.unsubscribePetition();
      },
    });

    //pusheamos al array de suscripciones

    this.suscripciones.push(peticionAllCards);

    return peticionAllCards;
  }


  public sortDesc():void{

    this.cardsService.cards.sort();

    this.cardsService.cards.reverse();


  }





}
