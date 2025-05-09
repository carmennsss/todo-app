import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MethodsService {
  constructor(private router: Router) {}

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Reloads the current page.
   *
   * This method navigates to the root path ('/') with the skipLocationChange option set to true,
   * and then navigates back to the current URL.
   */
  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
}
