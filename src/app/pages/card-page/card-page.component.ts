import { Component, Input, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CardClass } from '../../interfaces/cardId.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-page.component.html',
  styleUrl: './card-page.component.scss',
})
export class CardPageComponent implements OnInit {

  @Input() public card: CardClass| undefined;

  constructor(
    private cardsService: CardsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCardById();
  }

  getCardById() {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.cardsService.getCardById(id)))
      .subscribe((res) => {
        if (!res) return this.router.navigate(['']);
        console.log("res",res.card);
        return this.card = res.card;
      });
  }
}
