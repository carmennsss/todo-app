import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * This guard checks if the user is logged in, if not, redirects to the root of the app.
 *
 * It takes the current route and state as parameters and returns a boolean or an url.
 * @param route The route for the current location.
 * @param state The state of the router.
 * @returns Boolean or an url.
 */
export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (
    localStorage.getItem('token') == null ||
    localStorage.getItem('token') == undefined ||
    localStorage.getItem('token') == ''
  ) {
    return router.parseUrl('');
  } else {
    return true;
  }
};