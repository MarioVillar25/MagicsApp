import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationStart,
  Route,
  Router,
  RouterLink,
} from '@angular/router';
import { CardsService } from '../../services/cards.service';
import { debounceTime, filter, Subject, Subscription, tap } from 'rxjs';
import { orderByAsc, unsubscribePetition } from '../../utils/utils';

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
  private debouncerSuscription?: Subscription;

  @Output() public onDebounce = new EventEmitter<string>();

  //* CONSTRUCTOR:

  constructor(private cardsService: CardsService, private router: Router) {}

  //* FUNCIONES:

  public ngOnInit(): void {
    this.toEmitDebounceSuscription();


    //Función para que cada vez que cambia la ruta se haga una movida
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.searchInputText = '';
      });


  }

  public ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe();
  }

  //Función para mandar el valor del input a la función debounce

  public onKeyPress() {
    //el subject emite un valor. En este caso el valor del input
    this.searchSubject.next(this.searchInputText);
  }

  //Función para hacer la búsqueda Debounce y emitir el valor del input

  public toEmitDebounceSuscription(): void {
    this.debouncerSuscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((res) => {
        this.onDebounce.emit(res);
      });
  }

  //Función para encapsular la petición a AllCards

  public callToAllCards(value: number): Subscription {
    let peticionAllCards = this.cardsService.getAllCards(value).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
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

  //? Mala UX?

  public resetPagination() {
    this.cardsService.currentPage = 1;
    this.callToAllCards(1);
  }
}
