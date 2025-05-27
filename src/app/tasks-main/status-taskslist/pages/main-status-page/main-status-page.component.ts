import { TasksStateHttp } from './../../../../core/state/tasks/tasks.state';

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DividerModule } from 'primeng/divider';
import { Observable } from 'rxjs';
import { StatusNameAction, StatusTasksAction } from '../../../states/status.actions';
import PageTemplateComponent from '../../components/page-template/page-template.component';
import { TasksService } from '../../../../core/services/tasks.service';
import { StatusState } from '../../../states/status.state';
import { GetTagsClient } from '../../../../core/state/tags/tags.actions';
import { GetCategories } from '../../../../core/state/categories/categories.actions';
import { GetAllTasks, GetTasksByStatus } from '../../../../core/state/tasks/tasks.actions';


@Component({
  selector: 'main-status-page',
  imports: [DividerModule, PageTemplateComponent],
  templateUrl: './main-status-page.component.html',
  styleUrl: './main-status-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class MainSatusPageComponent implements OnInit {
  tasksService = inject(TasksService);

  pageTitle = 'Finished';
  status_tasks = signal(0);

  constructor(private store: Store) {}
  ngOnInit() {
    this.store.select(StatusState.getStatus).subscribe((status) => {
      if (status === '') {
        this.store.dispatch(
          new StatusNameAction({ status_name: this.pageTitle })
        );
      } else {
        this.pageTitle = status;
      }
    });
    
    this.store.dispatch(new GetTasksByStatus(this.pageTitle.toLowerCase().replaceAll(' ', '')));
    this.store.dispatch(new GetAllTasks());
    this.getItemStatus();
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------


  /**
   * Fetches the number of tasks from the store and updates the status_tasks signal.
   * This method is called to keep track of the number of tasks in the current status.
   */
  getItemStatus() {
    this.store.select(TasksStateHttp.tasks).subscribe((status) => {
      this.status_tasks.set(status.length);
    }
    );
    return this.status_tasks;
  }
}

