import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Checks if the user is logged in, if not, redirects to the root of the app.
 * Checks if the user is redirecting to the root of the app
 * without signing out, if so, removes the token.
 * 
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
  }

  if (router.url === '' && localStorage.getItem('token') != null) {
    localStorage.removeItem('token');
    return true;
  }

  return true;
};
