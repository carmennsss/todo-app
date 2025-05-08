import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DividerModule } from 'primeng/divider';
import { Observable } from 'rxjs';
import { Task } from '../../../../interfaces/Task';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import {
  StatusNameAction,
  StatusTasksAction,
} from '../../../services/states/tasks.actions';
import { TasksState } from '../../../services/states/tasks.state';
import PageTemplateComponent from '../../components/page-template/page-template.component';

@Component({
  selector: 'main-status-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-status-page.component.html',
  styleUrl: './main-status-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class MainSatusPageComponent implements OnInit {
  localService = inject(LocalStorageService);

  @Select(TasksState.getStatus) status$!: Observable<string>;
  @Select(TasksState.getStatusTasks) statusTasks$!: Observable<Task[]>;

  pageTitle = 'Finished';

  constructor(private store: Store) {}
  ngOnInit() {
    this.store.select(TasksState.getStatus).subscribe((status) => {
      if (status === '') {
        this.store.dispatch(
          new StatusNameAction({ status_name: this.pageTitle })
        );
        this.store.dispatch(
          new StatusTasksAction({
            statusTasks: this.localService.getCurrentClient().tasks,
          })
        );
      } else {
        this.pageTitle = status;
      }
    });
  }

  // ------------------------------------------------------------------
  // ----------------------------  Methods  ---------------------------
  // ------------------------------------------------------------------

  getItemStatus() {
    const currentClient = this.localService.getCurrentClient();
    return currentClient.tasks.filter(
      (task) => task.status === this.pageTitle.toLowerCase().replace(' ', '')
    ).length;
  }
}
