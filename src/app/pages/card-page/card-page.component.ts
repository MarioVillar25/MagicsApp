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
  //* VARIABLES:

  public suscripciones: Subscription[] = [];
  public localLanguage: string = 'English';

  @Input() public card?: CardClass;

  public cardInfo = {
    name: '',
    type: '',
    description: '',
    language: '',
    imageUrl: '',
  };
  //* CONSTRUCTOR:

  constructor(
    private cardsService: CardsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.getCardById();
  }
  public ngOnDestroy(): void {
    this.suscripciones.forEach((item) => {
      item.unsubscribe;
    });
  }

  //* FUNCIONES:

  //Función para conseguir carta por ID

  public getCardById() {
    let peticionCardById = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.cardsService.getCardById(id)))
      .subscribe({
        next: (res) => {
          if (!res) return this.router.navigate(['']);
          this.cardInfo = {
            name: res.card.name,
            type: res.card.type,
            description: res.card.text,
            language: 'English',
            imageUrl: res.card.imageUrl,
          };
          return (this.card = res.card);
        },
        error: (err) => {
          alert('ocurrió un error en la petición getCardById');
        },
      });

    this.suscripciones.push(peticionCardById);
  }

  //Función para cambiar Idioma

  public changeLanguage(language: string) {
    switch (language) {
      case 'English':
        this.cardInfo = {
          name: this.card!.name,
          type: this.card!.type,
          description: this.card!.text,
          language: 'English',
          imageUrl: this.card!.imageUrl,
        };
        break;

      case this.card?.foreignNames[0].language:
        this.changeCardLanguage(0);

        break;
      case this.card?.foreignNames[1].language:
        this.changeCardLanguage(1);

        break;
      case this.card?.foreignNames[2].language:
        this.changeCardLanguage(2);

        break;
      case this.card?.foreignNames[3].language:
        this.changeCardLanguage(3);

        break;
      case this.card?.foreignNames[4].language:
        this.changeCardLanguage(4);

        break;

      case this.card?.foreignNames[5].language:
        this.changeCardLanguage(5);

        break;
      case this.card?.foreignNames[6].language:
        this.changeCardLanguage(6);

        break;

      case this.card?.foreignNames[7].language:
        this.changeCardLanguage(7);

        break;
    }
  }

  //Función para cambiar el idioma de la carta

  public changeCardLanguage(value: number): void {
    this.cardInfo = {
      name: this.card!.foreignNames[value].name,
      type: this.card!.foreignNames[value].type,
      description: this.card!.foreignNames[value].text,
      language: this.card!.foreignNames[value].language,
      imageUrl: this.card!.foreignNames[value].imageUrl,
    };
  }
}
