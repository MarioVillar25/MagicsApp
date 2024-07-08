import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card, Cards } from '../interfaces/cards.interface';
import { environments } from '../../environments/environments';
import { Observable, catchError, of } from 'rxjs';
import { CardId } from '../interfaces/cardId.interface';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  public baseUrl: string = environments.BASE_URL;

  public cards: Card[] = [];

  constructor(private http: HttpClient) {}

  //* FUNCIONES PARA LLAMADAS A LA API

  public getAllCards(page: number): Observable<Cards> {
    console.log(`${this.baseUrl}?page=${page}`);
    console.log("DFSAFASOHFASF");

    return this.http.get<Cards>(`${this.baseUrl}?page=${page}`);
  }

  public getCardById(id: string): Observable<CardId | undefined> {
    return this.http
      .get<CardId>(`${this.baseUrl}/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  public getCardByQuery(query: string): Observable<Cards> {
    return this.http.get<Cards>(`${this.baseUrl}?name=${query}`);
  }


}
