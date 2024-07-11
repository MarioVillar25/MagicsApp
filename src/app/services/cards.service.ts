import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card, Cards } from '../interfaces/cards.interface';
import { environments } from '../../environments/environments';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { CardId } from '../interfaces/cardId.interface';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  public baseUrl: string = environments.BASE_URL;

  public cards: Card[] = [];
  public currentPage: number = 1;
  public inputText: BehaviorSubject<string> = new BehaviorSubject<string>('');

  //! APUNTE IMPORTANTE SOBRE BehaviorSubject & Subject:

  //!public inputText: Subject<string> = new Subject<string>();
  //! Con Subject tiene el mismo efecto, solo que no tiene que llevar un valor inicial.


  //Nota:

  //Encapsulo el BehaviorSubject en una variable por motivos de seguridad y limpieza
  //Esto impedirá que a la hora de suscribirse a currentString no emita valores no deseados el BehaviorSubject
  public inputTextProtected = this.inputText.asObservable();

  constructor(private http: HttpClient) {}

  //* FUNCIONES

  //Funciones para llamadas a la API

  public getAllCards(page: number): Observable<Cards> {



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

  //Función para emitir el valor del BehaviorSubject y cambiar el input del searchBox

  public changeInputValue(value: string) {
    this.inputText.next(value);
  }
}
