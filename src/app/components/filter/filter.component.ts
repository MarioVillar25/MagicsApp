import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  @Input() public currentPage!: number;
  @Output() public emisionCurrentPage = new EventEmitter<number>();

  constructor(private cardsService: CardsService) {}

  nextPage(): void {
    let valor;

    if (this.currentPage >= 937) {
      valor = 937;
    } else {
      valor = this.currentPage + 1;
    }

    console.log(valor);

    this.cardsService.getAllCards(valor).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        this.emisionCurrentPage.emit(valor);
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
      },
    });
  }

  previousPage(): void {
    let valor;

    if (this.currentPage <= 1) {
      valor = 1;
    } else {
      valor = this.currentPage - 1;
    }

    console.log(valor);

    this.cardsService.getAllCards(valor).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        this.emisionCurrentPage.emit(valor);
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
      },
    });
  }

  firstPage(): void {
    this.currentPage = 1;

    this.cardsService.getAllCards(this.currentPage).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        this.emisionCurrentPage.emit(this.currentPage);
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
      },
    });
  }

  lastPage(): void {
    this.currentPage = 937;

    this.cardsService.getAllCards(this.currentPage).subscribe({
      next: (res) => {
        this.cardsService.cards = res.cards;
        this.emisionCurrentPage.emit(this.currentPage);
      },
      error: (err) => {
        alert('ocurrió un error en la petición getAllCards');
      },
    });
  }
}
