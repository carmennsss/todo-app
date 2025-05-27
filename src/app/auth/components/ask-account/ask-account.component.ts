import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-ask-account',
  imports: [],
  templateUrl: './ask-account.component.html',
  styleUrl: './ask-account.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AskAccountComponent {
  text = input.required<string>();

  constructor(private router: Router) {}
}
