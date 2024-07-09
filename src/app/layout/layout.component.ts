import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { CardsService } from '../services/cards.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnDestroy {
  private suscripciones: Subscription[] = [];

  constructor(private cardsService: CardsService) {}

  public ngOnDestroy(): void {
    this.suscripciones.forEach((item) => {
      item.unsubscribe;
    });
  }

  public getCardsByQuery(value: string): void {
    //Por cada suscripción hacemos manejo de errores con error,
    //y recibimos el valor correcto con next.

    let peticionCardsByQuery = this.cardsService
      .getCardByQuery(value)
      .subscribe({
        next: (res) => {
          this.cardsService.cards = res.cards;
        },
        error: (err) => {
          alert('ocurrió un error en la petición de getCardByQuery');
        },
      });

    this.suscripciones.push(peticionCardsByQuery);
  }
}
