import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { CardsService } from '../../services/cards.service';
import { debounceTime, filter, Subject, Subscription, tap } from 'rxjs';
import { orderByAsc, unsubscribePetition } from '../../utils/utils';
import { Card } from '../../interfaces/cards.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public searchInputText = '';
  public searchSubject: Subject<string> = new Subject<string>();
  public suscripciones: Subscription[] = [];
  public cardsBackUp: Card[] = [];
  public colorRoutes = [
    {
      route: 'black_color.png',
      type: 'B',
    },
    {
      route: 'green_color.png',
      type: 'G',
    },
    {
      route: 'blue_color.png',
      type: 'U',
    },
    {
      route: 'red_color.png',
      type: 'R',
    },
    {
      route: 'white_color.png',
      type: 'W',
    },
  ];

  @Output() public onDebounce = new EventEmitter<string>();

  //* CONSTRUCTOR:

  constructor(private cardsService: CardsService, private router: Router) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.callToAllCards(this.cardsService.currentPage);
    this.toEmitDebounceSuscription();
    this.resetSearchInputText();
    this.subscribeToInputText();
    this.subscribeBackUpNavbar();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscripciones);
  }

  //* FUNCIONES:

  //Función para subscribirse al BehaviorSubject para el BackUpNavbar

  public subscribeBackUpNavbar(): void {
    let suscripcionSubject = this.cardsService.backUpNavbarProtected.subscribe(
      (res) => {
        this.cardsBackUp = res;
      }
    );

    this.suscripciones.push(suscripcionSubject);
  }

  //Función para subscribirse al BehaviorSubject para el InputTextValue

  public subscribeToInputText(): void {
    let suscripcionSubject = this.cardsService.inputTextProtected.subscribe(
      (res) => {
        this.searchInputText = res;
      }
    );

    this.suscripciones.push(suscripcionSubject);
  }

  //Función para que cada vez que cambia la ruta se resetea el valor del input

  public resetSearchInputText(): void {
    let suscripcionURL = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.searchInputText = '';
      });
    this.suscripciones.push(suscripcionURL);
  }

  //Función para mandar el valor del input a la función debounce

  public onKeyPress(): void {
    //el subject emite un valor. En este caso el valor del input (Debounce)
    this.searchSubject.next(this.searchInputText);
  }

  //Función para hacer la búsqueda Debounce y emitir el valor del input

  public toEmitDebounceSuscription(): void {
    let debouncerSuscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((res) => {
        this.onDebounce.emit(res);
      });

    this.suscripciones.push(debouncerSuscription);
  }

  //Función para encapsular la petición a AllCards

  public callToAllCards(value: number): Subscription {
    let peticionAllCards = this.cardsService.getAllCards(value).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        this.cardsBackUp = res.cards;
        orderByAsc(this.cardsService.cards);
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

  //Función para resetear la paginación

  public resetPagination(): void {
    this.cardsService.currentPage = 1;
    this.callToAllCards(1);
  }

  //Función para cambiar de filtro de Colores

  public changeColorType(color: string): void {
    let data: Card[] = [];

    //Este If recarga el array del backUp

    if (this.cardsService.cards.length < 100) {
      this.cardsService.cards = this.cardsBackUp;
    }

    switch (color) {
      case 'B':
        this.filterColorType(data, 'B');

        break;
      case 'G':
        this.filterColorType(data, 'G');

        break;
      case 'U':
        this.filterColorType(data, 'U');

        break;
      case 'R':
        this.filterColorType(data, 'R');

        break;
      case 'W':
        this.filterColorType(data, 'W');

        break;
    }

    if (this.cardsService.cards.length === 0) {
      this.cardsService.cards = this.cardsBackUp;
      alert(`No existen cartas en esta página con ese color: "${color}" `);
    }
  }

  //Función para filtrar el array por Colores

  public filterColorType(data: Card[], color: string) {
    data = this.cardsService.cards.filter(
      (elem) => elem.colorIdentity[0] === color
    );
    this.cardsService.cards = data;

    //console.log(`${color}`, data);
  }
}
