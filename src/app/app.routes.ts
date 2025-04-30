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
        path: 'inprogress',
        loadComponent: () =>
          import(
            './taskslist/pages/main-progress-page/main-progress-page.component'
          ),
      },
      {
        path: 'finished',
        loadComponent: () =>
          import(
            './taskslist/pages/main-finished-page/main-finished-page.component'
          ),
      },
      {
        path: 'nonstarted',
        loadComponent: () =>
          import(
            './taskslist/pages/main-nonstarted-page/main-nonstarted-page.component'
          ),
      },
      {
        path: 'paused',
        loadComponent: () =>
          import(
            './taskslist/pages/main-paused-page/main-paused-page.component'
          ),
      },
      {
        path: 'late',
        loadComponent: () =>
          import('./taskslist/pages/main-late-page/main-late-page.component'),
      },
      {
        path: '**',
        redirectTo: 'in-progress',
      },
    ],
  },
];
