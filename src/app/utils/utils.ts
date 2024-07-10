import { Subscription } from 'rxjs';
import { Card } from '../interfaces/cards.interface';

//Función para establecer orden ASCENDENTE de cards;

export const orderByAsc = (data: Card[]) => {
  data.sort((a: Card, b: Card): number => {
    let num = 0;

    if (a.name < b.name) {
      num = -1;
    }
    if (a.name > b.name) {
      num = 1;
    }

    return num;
  });
};

//Función para establecer orden DESCENDENTE de cards;

export const orderByDesc = (data: Card[]) => {
  data.sort((a: Card, b: Card): number => {
    let num = 0;

    if (a.name < b.name) {
      num = 1;
    }
    if (a.name > b.name) {
      num = -1;
    }

    return num;
  });
};

//Función para desuscribirse de todo el array de suscripciones

export const unsubscribePetition = (data: Subscription[]) => {
  data.forEach((item) => {
    item.unsubscribe();
  });

  data = [];
};
