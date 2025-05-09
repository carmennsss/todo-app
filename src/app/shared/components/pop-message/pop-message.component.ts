import { Message } from 'primeng/message';
import { Component, input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'pop-message',
  imports: [Toast, ButtonModule, AvatarModule],
  providers: [MessageService],
  templateUrl: './pop-message.component.html',
  styleUrl: './pop-message.component.css',
})
export class PopMessageComponent {
  visible: boolean = false;

  constructor(public messageService: MessageService) {}

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Show a confirmation message using the PrimeNG MessageService
   * @param message the error message to be displayed
   * @returns void
   */
  showConfirm(message: string) {
    if (!this.visible) {
      this.messageService.add({
        key: 'confirm',
        sticky: true,
        severity: 'error',
        summary: message,
      });
      this.visible = true;
    }
  }

  /**
   * Handles the confirmation action by clearing the confirmation message
   * and setting the visibility state to false.
   */

  onConfirm() {
    this.messageService.clear('confirm');
    this.visible = false;
  }

  onReject() {
    this.messageService.clear('confirm');
    this.visible = false;
  }
}
