import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../taskslist/services/local-storage.service';

export const userGuard: CanActivateFn = (route, state) => {
  debugger;
  const router = inject(Router);
  const localService: LocalStorageService = new LocalStorageService();
  console.log(localService.getCurrentClient().username);
  if (localService.getCurrentClient().username != undefined) {
    return true;
  } else {
    return router.parseUrl('');
  }
};