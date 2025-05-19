
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

  currentClient = this.localService.getCurrentClient();

  statusTasks: Task[] = [];
  deleteMode: boolean = false;
  pageTitle = 'Finished';
  newTask: Task = {
    id: 0,
    title: '',
    desc: '',
    status: '',
    list: { category_title: 'None' },
    taglist: [],
    date: '',
    subtasks: [],
  };

  isDrawerVisible: boolean = false;
  selectedTask: Task = this.newTask;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}
  ngOnInit(): void {
    debugger;

    this.store.select(TasksState.getStatus).subscribe((status) => {
      this.pageTitle = status;
    });
    // this.pageTitle = this.store.selectSignal(TasksState.getStatus)
    this.updateTasks();
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Updates the statusTasks array with tasks from the current client.
   *
   * This method dispatches a StatusTasksAction to update the store with the current client's tasks.
   * It then subscribes to the store to retrieve the updated list of tasks with the current status
   * and assigns them to the statusTasks array.
   */

  updateTasks() {
    this.store.dispatch(
      new StatusTasksAction({ statusTasks: this.currentClient.tasks })
    );
    this.store.select(TasksState.getStatusTasks).subscribe((tasks) => {
      this.statusTasks = tasks;
    });
    // this.statusTasks = this.store.selectSignal(TasksState.getStatusTasks)
  }


/**
 * Selects a task for editing or deletion.
 * 
 * If delete mode is enabled, the task is deleted.
 * Otherwise, the task is selected for editing, and the editing drawer visibility is toggled.
 * 
 * @param task The task to select or delete.
 */

  selectTask(task: Task) {
    if (this.deleteMode) {
      this.deleteTask(task);
    } else {
      this.selectedTask = task;
      this.isDrawerVisible = !this.isDrawerVisible;
    }
  }

/**
 * Deletes a specified task from the current client's tasks list.
 *
 * This method filters out the task with the given id from the current client's
 * tasks. After deletion, it updates the local storage with the current client's
 * tasks and refreshes the status tasks list to reflect the changes.
 *
 * @param task - The task to be deleted.
 */

  deleteTask(task: Task) {
    this.currentClient.tasks = this.currentClient.tasks.filter(
      (t) => t.id !== task.id
    );
    this.saveItemsLocalStorage();
    this.updateTasks();
  }

  /**
   * Saves the currentClient's tasks to the model and updates the local storage.
   */
  saveItemsLocalStorage() {
    this.localService.setCurrentClient(this.currentClient);
    this.localService.saveCurrentClientTasksToModel(this.currentClient);
  }

  /**
   * Creates a new task and saves it to the current client's tasks list.
   *
   * This method creates a new task with the following properties:
   * - id: The next available id in the current client's tasks list.
   * - title: 'Task ' + the length of the current client's tasks list.
   * - desc: An empty string.
   * - status: The status of the page in lower case, with spaces removed.
   * - date: The current date, formatted as 'MMMM d, yyyy'.
   * - list: The default category with title 'None'.
   * - taglist: An empty array.
   * - subtasks: An empty array.
   *
   * It then adds the new task to the current client's tasks list, reloads the page, updates the status tasks list, and saves the current client to local storage.
   */
  createTask() {
    this.newTask = {
      id: Math.floor(Math.random() * 1000),
      title: 'Task ' + this.statusTasks.length,
      desc: '',
      status: this.pageTitle.toLowerCase().replace(' ', ''),
      date: new Date().toLocaleString().split(',')[0],
      list: { category_title: 'None' },
      taglist: [],
      subtasks: [],
    };

    this.currentClient.tasks = [...this.currentClient.tasks, this.newTask];
    this.methodsService.reloadPage();
    this.updateTasks();
    this.saveItemsLocalStorage();
  }
}