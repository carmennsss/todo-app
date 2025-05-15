import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../core/interfaces/tasks/Task';

@Component({
  selector: 'task-item',
  imports: [DividerModule, CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  task = input.required<Task>();
  deleteMode = input.required<boolean>()
  visibleInput = false;
  selected = false
}