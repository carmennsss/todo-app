import { MethodsService } from './../../../../shared/services/methods.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { CategoriesService } from '../../../../core/services/categories.service';
import { SubtasksService } from '../../../../core/services/subtasks.service';
import { TasksService } from '../../../../core/services/tasks.service';
import { Store } from '@ngxs/store';
import {
  DeleteTask,
  GetTasksByStatus,
} from '../../../../core/state/tasks/tasks.actions';
import { GetSubtasks } from '../../../../core/state/subtasks/subtask.actions';
import { SubtasksState } from '../../../../core/state/subtasks/subtask.state';

@Component({
  selector: 'task-item',
  imports: [DividerModule, CommonModule, Dialog],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements OnChanges {
  methodsService = inject(MethodsService);
  subtasksService = inject(SubtasksService);
  categoriesService = inject(CategoriesService);
  tasksService = inject(TasksService);
  task = input.required<TaskDB>();
  visibleInput = false;
  selected = false;
  subtaskCount = signal(0);
  list_title = signal('');
  visible: boolean = false;

  constructor(private store: Store) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.getListToString();
      this.getSubtasksCount();
    }
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Searches the task's list title based on its list_id.
   * Fetches the category name from the categoriesService and updates
   * the list_title signal. If the task has no list_id, sets the list title to 'None'.
   */

  getListToString() {
    if (this.task().list_id) {
      this.categoriesService.getCategoryName(this.task().list_id).subscribe({
        next: (res) => {
          this.list_title.set(res.category_title);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.list_title.set('None');
    }
  }

  /**
   * Deletes the task and then fetches the updated list of tasks
   * from the server using the GetTasksByStatus action.
   */
  deleteTask() {
    this.visible = false;
    this.tasksService.deleteTask(this.task().id).subscribe({
      next: (res) => {
        this.store.dispatch(new GetTasksByStatus(this.task().status));
        // this.methodsService.reloadPage();
      },
    });
  }

  /**
   * Gets the subtasks associated with the current task
   * and updates the subtaskCount signal with the number of subtasks.
   */

  getSubtasksCount() {
    this.subtasksService
      .getSubtasksFromTask(this.task().id)
      .subscribe((res) => {
        this.subtaskCount.set(res.length);
      });
  }
}
