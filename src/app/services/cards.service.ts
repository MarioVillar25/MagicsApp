import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cards } from '../interfaces/cards.interface';
import { environments } from '../../environments/environments';
import { Observable, catchError, of } from 'rxjs';
import { CardId } from '../interfaces/cardId.interface';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  public baseUrl: string = environments.BASE_URL;

  constructor(private http: HttpClient) {}

  //* FUNCIONES PARA LLAMADAS A LA API

  public getAllCards(): Observable<Cards> {
    return this.http.get<Cards>(`${this.baseUrl}`);
  }

  public getCardById(id: string): Observable<CardId | undefined> {
    return this.http
      .get<CardId>(`${this.baseUrl}/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }
}
