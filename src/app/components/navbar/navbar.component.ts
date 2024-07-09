import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardsService } from '../../services/cards.service';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public searchInput = '';
  public searchSubject: Subject<string> = new Subject<string>();
  private debouncerSuscription?: Subscription;

  @Output() public onDebounce = new EventEmitter<string>();

  //* CONSTRUCTOR:

  constructor(private cardsService: CardsService) {}

  //* FUNCIONES:

  public ngOnInit(): void {
    this.toEmitDebounceSuscription();
  }

  public ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe();
  }

  public onKeyPress() {
    //el subject emite un valor. En este caso el valor del input
    this.searchSubject.next(this.searchInput);
  }

  public toEmitDebounceSuscription(): void {
    this.debouncerSuscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((res) => {
        this.onDebounce.emit(res);
      });
  }
}
