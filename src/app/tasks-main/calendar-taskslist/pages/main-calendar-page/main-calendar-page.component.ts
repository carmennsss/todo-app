import { Store } from '@ngxs/store';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { TaskItemComponent } from '../../../status-taskslist/components/task-item/task-item.component';
import { Router } from '@angular/router';
import { Task } from '../../../../core/interfaces/tasks/Task';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { TasksState } from '../../../states/tasks.state';
import { CalendarTasksAction } from '../../../states/tasks.actions';
import { TasksService } from '../../../../core/services/tasks.service';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';

@Component({
  selector: 'main-calendar-page',
  imports: [
    FormsModule,
    DatePicker,
    TaskItemComponent,
    TaskItemComponent,
    CommonModule,
    DividerModule,
  ],
  templateUrl: './main-calendar-page.component.html',
  styleUrl: './main-calendar-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class MainCalendarPageComponent {
  localService = inject(LocalStorageService);
  tasksService = inject(TasksService);

  task_date: Date = new Date();
  dateTasks: Task[] = [];
  // dateTasks = signal<Task[]>([]);

  constructor(private router: Router, private store: Store) {}

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Updates the dateTasks array with tasks from the current client that have
   * the same date as the date selected in the date picker.
   */
  onDateSelect() {
    debugger;
    if (this.task_date === null) {
      console.error('onDateSelect: task_date is null');
      return;
    }
    debugger;
    this.tasksService
      .getTasksDateClient(this.task_date.toISOString().split('T')[0])
      .subscribe((tasks: any[]) => {
        if (tasks === null) {
          console.error('onDateSelect: tasks is null');
          return;
        }
        this.dateTasks = tasks;
      });
  }
}
