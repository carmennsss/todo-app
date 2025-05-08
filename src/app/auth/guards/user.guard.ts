import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';


/**
 * This guard checks if the user is logged in, if not, redirects to the root of the app.
 * It takes the current route and state as parameters and returns a boolean or an url.
 * @param route The route for the current location.
 * @param state The state of the router.
 * @returns Boolean or an url.
 */
export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localService = inject(LocalStorageService);

  if (localService.getCurrentClient().username === '' || localService.getCurrentClient().username === undefined || localService.getCurrentClient().username === null) {
    return router.parseUrl('');
  }
  if (Object.keys(localService.getCurrentClient().username).length === 0) {
    return router.parseUrl('');
  } else {
    return true;
  }
};
