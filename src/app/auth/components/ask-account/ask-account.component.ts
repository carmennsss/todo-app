import {
  ChangeDetectionStrategy,
  Component,
  input,
  Output,
} from '@angular/core';
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
}
