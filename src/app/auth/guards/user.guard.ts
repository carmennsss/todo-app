import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../taskslist/services/local-storage.service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localService = inject(LocalStorageService);

  if (localService.getCurrentClient().username != undefined) {
    return true;
  } else {
    return router.parseUrl('');
  }
};
