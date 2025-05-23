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
export class TaskItemComponent implements OnChanges, OnInit {
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
      this.getSubtasksCount();
      this.getListToString();
    }
  }

  ngOnInit(): void {
    this.getSubtasksCount();
  }

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

  deleteTask() {
    this.visible = false;
    this.tasksService.deleteTask(this.task().id).subscribe({
      next: (res) => {
        this.store.dispatch(new GetTasksByStatus(this.task().status));
      },
    });
  }

  getSubtasksCount() {
    this.subtasksService
      .getSubtasksFromTask(this.task().id)
      .subscribe((res) => {
        this.subtaskCount.set(res.length);
      });
  }
}
