import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
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

@Component({
  selector: 'task-item',
  imports: [DividerModule, CommonModule, Dialog],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements OnChanges {
  subtasksService = inject(SubtasksService);
  categoriesService = inject(CategoriesService);
  tasksService = inject(TasksService);
  task = input.required<TaskDB>();
  visibleInput = false;
  selected = false;
  subtaskCount = signal(0);
  list_title = signal('');
  visible: boolean = false;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.getSubtasksCount();
      this.getListToString();
    }
  }

  getListToString() {
    if (this.task().list_id) {
      this.categoriesService.getCategoryName(this.task().list_id).subscribe({
        next: (res) => {
          console.log(res);
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
        console.log(res);
      },
    });
  }

  getSubtasksCount() {
    this.subtasksService.getSubtasksFromTask(this.task().id).subscribe({
      next: (res) => {
        this.subtaskCount.set(res.length);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
