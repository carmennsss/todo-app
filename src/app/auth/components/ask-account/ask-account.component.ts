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

  // METHODS
  
  changePage() {
    if (this.text().toLowerCase().trim() === 'have an account?') {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['/signup']);
    }
  }
}
