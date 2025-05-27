import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AddNewComponent } from '../add-new/add-new.component';
import { DividerModule } from 'primeng/divider';
import { EditingSidebarComponent } from '../editing-sidebar/editing-sidebar.component';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { MethodsService } from '../../../../shared/services/methods.service';
import { StatusState } from '../../../states/status.state';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { TasksService } from '../../../../core/services/tasks.service';
import { Dialog } from 'primeng/dialog';
import {
  GetTasksByStatus,
  DeleteTask,
  CreateTask,
} from '../../../../core/state/tasks/tasks.actions';
import { TasksStateHttp } from '../../../../core/state/tasks/tasks.state';

@Component({
  selector: 'tasks-page-template',
  imports: [
    AddNewComponent,
    DividerModule,
    EditingSidebarComponent,
    CommonModule,
    TaskItemComponent,
    Dialog,
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
  isVisible = false;
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
    this.store.select(StatusState.getStatus).subscribe((status) => {
      this.pageTitle = status.toLowerCase().replaceAll(' ', '');
    });

    this.store
      .select(TasksStateHttp.tasks)
      .subscribe((tasks) => this.statusTasks.set(tasks));
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

  selectTask(task_selected: TaskDB) {
    this.selectedTask.set(task_selected);
    this.isDrawerVisible = !this.isDrawerVisible;
  }

  createTask() {
    this.isVisible = false;
    this.newTask.status = this.pageTitle.toLowerCase().replace(' ', '');
    this.tasksService.createNewTask(this.newTask).subscribe((task) => {
      console.log('Task created:', task);
    });

    this.methodsService.reloadPage();

    this.store.dispatch(new GetTasksByStatus(this.pageTitle));
  }
}
