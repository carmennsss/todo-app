import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'task-add-new',
  imports: [PanelMenu, ToastModule, ButtonModule],
  templateUrl: './add-new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AddNewComponent implements OnInit {
  items: MenuItem[] = [];
  ngOnInit() {
    this.items = [
      {
        label: 'Add New',
        icon: 'pi pi-plus',
      },
    ];
  }
}
