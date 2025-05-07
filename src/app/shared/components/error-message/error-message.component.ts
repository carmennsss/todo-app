import { Component, input } from '@angular/core';
import { Message } from 'primeng/message';

@Component({
  selector: 'error-message',
  imports: [Message],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css',
})
export class ErrorMessageComponent { 
  message = input.required<string>()
}
