import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../core/interfaces/tasks/Task';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { CategoriesService } from '../../../../core/services/categories.service';
import { SubtasksService } from '../../../../core/services/subtasks.service';

@Component({
  selector: 'task-item',
  imports: [DividerModule, CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  subtasksService = inject(SubtasksService);
  categoriesService = inject(CategoriesService);
  task = input.required<TaskDB>();
  deleteMode = input.required<boolean>()
  visibleInput = false;
  selected = false
  subtaskCount = signal(0);
  list_title = signal('');

  getListToString() {
    if (this.task().list_id) {
      this.categoriesService.getCategoryName(this.task().list_id).subscribe({
        next: (res) => {
          this.list_title.set(res.category_title)
        }
      })
    }
    else {
      this.list_title.set("None")
    }
  }

  getSubtasksCount() {
    this.subtasksService.getSubtasksFromTask(this.task().id).subscribe({
      next: (res) => {
        this.subtaskCount.set(res.length)
      }
    })
  }
}