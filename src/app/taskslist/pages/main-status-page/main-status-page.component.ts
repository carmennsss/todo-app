import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from '../../components/page-template/page-template.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Client } from '../../../interfaces/Client';
import { StatusStore } from '../../states/status.store';
import { NgxsModule, Select, Store } from '@ngxs/store';
import { StatusState } from '../../states/status.state';
import { Task } from '../../../interfaces/Task';
import { StatusNameAction, StatusTasksAction } from '../../states/status.actions';

@Component({
  selector: 'main-status-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-status-page.component.html',
  styleUrl: './main-status-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainSatusPageComponent {

  @Select(StatusState.getStatus) status$ : string = '';
  @Select(StatusState.getStatusTasks) statusTasks$ : Task[] = [];

  statusStore = inject(StatusStore);
  localService = inject(LocalStorageService);
  pageTitle = signal<string>(this.localService.getCurrentStatus());
  constructor(private store : Store) {}

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

  ngOnInit() {
    debugger;
    this.store.dispatch(new StatusNameAction({ status_name: this.localService.getCurrentStatus() }));
    this.store.dispatch(new StatusTasksAction({ statusTasks: this.localService.getCurrentClient().tasks }));

    this.store.select(StatusState.getStatus).subscribe(status => {
      console.log('State updated:', status);
    });
    this.store.select(StatusState.getStatusTasks).subscribe(status => {
      console.log('State updated:', status);
    });
    
  }  
}
