import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Task } from '../../../interfaces/Task';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'task-item',
  imports: [DividerModule, CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  task = input.required<Task>();
  visibleInput = false;
  selected = false
}