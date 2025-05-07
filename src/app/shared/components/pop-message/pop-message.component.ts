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

  constructor(public messageService: MessageService) {}

  visible: boolean = false;

    showConfirm(message: string) {
        if (!this.visible) {
            this.messageService.add({ key: 'confirm', sticky: true, severity: 'error', summary: message });
            this.visible = true;
        }
    }

    onConfirm() {
        this.messageService.clear('confirm');
        this.visible = false;
    }

    onReject() {
        this.messageService.clear('confirm');
        this.visible = false;
    }
}
