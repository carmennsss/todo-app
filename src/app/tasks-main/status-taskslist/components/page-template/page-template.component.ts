import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { AddNewComponent } from '../add-new/add-new.component';
import { DividerModule } from 'primeng/divider';
import { Task } from '../../../../core/interfaces/tasks/Task';
import { EditingSidebarComponent } from '../editing-sidebar/editing-sidebar.component';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { MethodsService } from '../../../../shared/services/methods.service';
import { StatusTasksAction } from '../../../states/tasks.actions';
import { TasksState } from '../../../states/tasks.state';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { TasksService } from '../../../../core/services/tasks.service';

@Component({
  selector: 'tasks-page-template',
  imports: [
    AddNewComponent,
    DividerModule,
    EditingSidebarComponent,
    CommonModule,
    TaskItemComponent,
  ],
  templateUrl: './page-template.component.html',
  styleUrl: './page-template.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class PageTemplateComponent implements OnInit {
  localService = inject(LocalStorageService);
  methodsService = inject(MethodsService);
  tasksService = inject(TasksService);

  statusTasks = signal<TaskDB[]>([]);
  deleteMode: boolean = false;
  pageTitle = 'Finished';
  newTask: TaskDB = {
    id: 0,
    title: '',
    desc: '',
    status: '',
    list_id: 0,
    date: '',
  };

  isDrawerVisible: boolean = false;
  selectedTask = signal<TaskDB>({} as TaskDB);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}
  ngOnInit(): void {
    this.store.select(TasksState.getStatus).subscribe((status) => {
      this.pageTitle = status;
    });

    this.tasksService
      .getTasksStatusClient(this.pageTitle)
      .subscribe((tasks) => {
        this.statusTasks.set(tasks);
      });
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Selects a task for editing or deletion.
   *
   * If delete mode is enabled, the task is deleted.
   * Otherwise, the task is selected for editing, and the editing drawer visibility is toggled.
   *
   * @param task The task to select or delete.
   */

  selectTask(task: TaskDB) {
    if (this.deleteMode) {
      this.deleteTask(task);
    } else {
      this.selectedTask.update((task) => (task = task));
      this.isDrawerVisible = !this.isDrawerVisible;
    }
  }

  deleteTask(task: TaskDB) {}

  createTask() {
    this.newTask = {
      id: 0,
      title: 'New Task',
      desc: '',
      status: this.pageTitle.toLowerCase().replace(' ', ''),
      date: new Date().toLocaleString().split(',')[0],
      list_id: 0,
    };
    this.tasksService.createNewTask(this.newTask).subscribe(() => {
      this.tasksService
        .getTasksStatusClient(this.pageTitle)
        .subscribe((tasks) => {
          this.statusTasks.update((tasks_status) => (tasks_status = tasks));
        });
    });
  }
}
