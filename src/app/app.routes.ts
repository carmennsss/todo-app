import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/pages/login-page/login-page.component'),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/pages/create-user-page/create-user-page.component'),
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./taskslist/pages/main-page/main-page.component'),
    children: [
      {
        path: 'status',
        loadComponent: () =>
          import(
            './taskslist/pages/main-status-page/main-status-page.component'
          ),
      },
      {
        path: '**',
        redirectTo: 'status',
      },
    ],
  },
];
