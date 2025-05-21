
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
import { Task } from '../../../../core/interfaces/tasks/Task';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { StatusNameAction, StatusTasksAction } from '../../../states/tasks.actions';
import { TasksState } from '../../../states/tasks.state';
import PageTemplateComponent from '../../components/page-template/page-template.component';
import { TasksService } from '../../../../core/services/tasks.service';


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
  tasksService = inject(TasksService);

  pageTitle = 'Finished';
  status_tasks = signal(0);

  constructor(private store: Store) {}
  ngOnInit() {
    this.store.select(TasksState.getStatus).subscribe((status) => {
      if (status === '') {
        this.store.dispatch(
          new StatusNameAction({ status_name: this.pageTitle })
        );
      } else {
        this.pageTitle = status;
      }
    });
    this.getItemStatus();
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------


  getItemStatus() {
    this.tasksService
      .getTasksStatusClient(this.pageTitle)
      .subscribe((tasks) => {
        this.status_tasks.set(tasks.length);
      });
    return this.status_tasks;
  }
}

