import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardsService } from '../../services/cards.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnDestroy {
  public searchInput = new FormControl('');
  public suscripciones: Subscription[] = [];

  constructor(private cardsService: CardsService) {}

  ngOnDestroy(): void {
    this.suscripciones.forEach((item) => {
      item.unsubscribe;
    });
  }

  public searchCard():void {
    const newTag: string = this.searchInput.value || '';

    //Por cada suscripción hacemos manejo de errores con error,
    //y recibimos el valor correcto con next.

    let peticionCardsByQuery = this.cardsService
      .getCardByQuery(newTag)
      .subscribe({
        next: (res) => {
          this.cardsService.cards = res.cards;
        },
        error: (err) => {
          alert('ocurrió un error en la petición de getCardByQuery');
        },
      });

    this.suscripciones.push(peticionCardsByQuery);

    this.searchInput.setValue('');
  }
}
