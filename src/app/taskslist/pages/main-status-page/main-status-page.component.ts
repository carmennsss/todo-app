import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from '../../components/page-template/page-template.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Client } from '../../../interfaces/Client';

@Component({
  selector: 'main-status-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-status-page.component.html',
  styleUrl: './main-status-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainSatusPageComponent {
  localService: LocalStorageService = new LocalStorageService();
  pageTitle = signal<string>(this.localService.getCurrentStatus());
  constructor() {}

  getItemStatus() {
    const currentClient = this.localService.getCurrentClient();
    let count = 0;
    for (let i = 0; i < currentClient.tasks.length; i++) {
      if (
        currentClient.tasks[i].status ===
        this.pageTitle().toLowerCase().replace(' ', '')
      ) {
        count++;
      }
    }
    return count;
  }
}
