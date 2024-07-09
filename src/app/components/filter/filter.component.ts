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
  @Input() public currentPage!: number;
  @Output() public emisionCurrentPage = new EventEmitter<number>();

  public suscripciones: Subscription[] = [];

  constructor(private cardsService: CardsService) {}

  ngOnDestroy(): void {
    this.unsubscribePetition();
  }

  public nextPage(): void {
    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length > 0) {
      this.unsubscribePetition();
    }

    let valor;

    //validamos para que el usuario no supere el límite de última página

    if (this.currentPage >= 937) {
      valor = 937;
    } else {
      valor = this.currentPage + 1;
    }

    this.callToAllCards(valor);
  }

  public previousPage(): void {
    let valor;

    //hacemos comprobación si existen subscripciones

    if (this.suscripciones.length > 0) {
      this.unsubscribePetition();
    }

    if (this.currentPage <= 1) {
      valor = 1;
    } else {
      valor = this.currentPage - 1;
    }

    this.callToAllCards(valor);
  }

  public firstPage(): void {
    this.currentPage = 1;

    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length !== 0) {
      this.unsubscribePetition();
    }

    this.callToAllCards(this.currentPage);
  }

  public lastPage(): void {
    this.currentPage = 937;

    //hacemos comprobación si existen subscripciones
    if (this.suscripciones.length !== 0) {
      this.unsubscribePetition();
    }

    this.callToAllCards(this.currentPage);
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
        this.emisionCurrentPage.emit(value);
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
}
