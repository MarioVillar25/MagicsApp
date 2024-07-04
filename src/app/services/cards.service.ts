import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card } from '../interfaces/cards.interface';
import { environments } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  public baseUrl: string = environments.BASE_URL;

  constructor(private http: HttpClient) {}

  //* FUNCIONES PARA LLAMADAS A LA API

  public getAllCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.baseUrl}`);
  }
}
