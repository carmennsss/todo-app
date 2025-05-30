import { changeCurrentClient } from './../../../../auth/services/client-state/client.actions';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DividerModule } from 'primeng/divider';
import { Observable } from 'rxjs';
import { Task } from '../../../../core/interfaces/tasks/Task';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import {
  StatusNameAction,
  StatusTasksAction,
} from '../../../services/states/tasks.actions';
import { TasksState, TasksStateModel } from '../../../services/states/tasks.state';
import PageTemplateComponent from '../../components/page-template/page-template.component';
import { ClientState } from '../../../../auth/services/client-state/client.state';

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

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Returns the number of tasks in the current client that have a given status.
   * This method is used to display the number of tasks in the current client
   * that have the status that corresponds to the current page.
   *
   * @returns The number of tasks with the given status.
   */
  getItemStatus() {
    const currentClient = this.localService.getCurrentClient();

    // const changeCurrentClient = this.store.selectSignal(ClientState.getCurrentClient);
    
    return currentClient.tasks.filter(
      (task: Task) =>
        task.status === this.pageTitle.toLowerCase().replace(' ', '')
    ).length;
  }
}

