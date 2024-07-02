import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/cards-list/cards-list.component').then(
            (c) => c.CardsListComponent
          ),
      },
      {
        path: 'card-page/:id',
        loadComponent: () =>
          import('./pages/card-page/card-page.component').then(
            (c) => c.CardPageComponent
          ),
      },
      {
        path: 'error-page',
        loadComponent: () =>
          import('./pages/error-page/error-page.component').then(
            (c) => c.ErrorPageComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'error-page',
      },
    ],
  },
];
