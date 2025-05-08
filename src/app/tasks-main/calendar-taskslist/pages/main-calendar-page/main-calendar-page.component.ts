import { Store } from '@ngxs/store';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { TaskItemComponent } from "../../../status-taskslist/components/task-item/task-item.component";
import { Router } from '@angular/router';
import { Task } from '../../../../interfaces/Task';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { CalendarTasksAction } from '../../../services/states/tasks.actions';
import { TasksState } from '../../../services/states/tasks.state';

@Component({
  selector: 'main-calendar-page',
  imports: [FormsModule, DatePicker, TaskItemComponent, TaskItemComponent, CommonModule, DividerModule],
  templateUrl: './main-calendar-page.component.html',
  styleUrl: './main-calendar-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainCalendarPageComponent {
  localService = inject(LocalStorageService);

  task_date: Date = new Date();
  dateTasks: Task[] = [];

  constructor(private router : Router, private store : Store) {}

  onDateSelect() {
    this.store.dispatch(new CalendarTasksAction({ calendarTasks: this.localService.getCurrentClient().tasks, task_date: this.task_date }));
    this.store.select(TasksState.getCalendarTasks).subscribe((tasks) => {
      this.dateTasks = tasks
    })
  }
}
