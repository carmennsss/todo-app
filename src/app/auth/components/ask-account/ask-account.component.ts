import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-ask-account',
  imports: [],
  templateUrl: './ask-account.component.html',
  styleUrl: './ask-account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AskAccountComponent {
  text = input.required<string>();

  constructor(private router: Router) {}

  // ------------------------------------------------------------------
  // ----------------------------  Methods  ----------------------------
  // ------------------------------------------------------------------

  /**
   * Redirects to the sign-up page if the text is "Don't have an account?" or
   * to the login page if the text is "Have an account?".
   */
  changePage() {
    if (this.text().toLowerCase().trim() === 'have an account?') {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['/signup']);
    }
  }
}
