import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DividerModule } from 'primeng/divider';
import PageTemplateComponent from '../../components/page-template/page-template.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Client } from '../../../interfaces/Client';

import { NgxsModule, Select, Store } from '@ngxs/store';
import { StatusState } from '../../states/status.state';
import { Task } from '../../../interfaces/Task';
import {
  StatusNameAction,
  StatusTasksAction,
} from '../../states/status.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'main-status-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-status-page.component.html',
  styleUrl: './main-status-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class MainSatusPageComponen implements OnInit {
  localService = inject(LocalStorageService);

  @Select(StatusState.getStatus) status$!: Observable<string>;
  @Select(StatusState.getStatusTasks) statusTasks$!: Observable<Task[]>;

  pageTitle = 'Finished';
  constructor(private store: Store) {}
  ngOnInit() {
    this.store.select(StatusState.getStatus).subscribe((status) => {
      if (status === '') {
        this.store.dispatch(new StatusNameAction({ status_name: this.pageTitle }));
        this.store.dispatch(
          new StatusTasksAction({ statusTasks: this.localService.getCurrentClient().tasks })
        );
      }
      else {
        this.pageTitle = status;
      }
    });
  }

  getItemStatus() {
    const currentClient = this.localService.getCurrentClient();
    return currentClient.tasks.filter((task) => task.status === this.pageTitle.toLowerCase().replace(' ', '')).length;
  }
}
