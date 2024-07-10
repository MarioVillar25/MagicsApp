import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { CardClass } from '../../interfaces/cardId.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-page.component.html',
  styleUrl: './card-page.component.scss',
})
export class CardPageComponent implements OnInit, OnDestroy {
  @Input() public card: CardClass | undefined;

  public suscripciones: Subscription[] = [];


  constructor(
    private cardsService: CardsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCardById();
  }
  ngOnDestroy(): void {
    this.suscripciones.forEach((item) => {
      item.unsubscribe;
    });
  }

  getCardById() {
    let peticionCardById = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.cardsService.getCardById(id)))
      .subscribe({
        next: (res) => {
          if (!res) return this.router.navigate(['']);
          return (this.card = res.card);
        },
        error: (err) => {
          alert('ocurrió un error en la petición getCardById');
        },
      });

      this.suscripciones.push(peticionCardById);
    }
}
