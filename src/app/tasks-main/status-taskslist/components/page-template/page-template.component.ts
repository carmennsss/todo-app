import {
  StatusNameAction,
  StatusTasksAction,
} from '../../../services/states/tasks.actions';
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
import { TasksState } from '../../../services/states/tasks.state';
import { MethodsService } from '../../../../shared/services/methods.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

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
  pageTitle = 'Finished';
  newTask: Task = {
    id: 0,
    title: '',
    desc: '',
    status: '',
    list: this.currentClient.categories[0],
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
  }

  /**
   * Toggles the visibility of the editing sidebar and sets the selected task.
   *
   * This method assigns the provided task to the `selectedTask` property.
   * It also toggles the `isDrawerVisible` property to show or hide the editing sidebar.
   *
   * @param task - The task to be set as the selected task.
   */

  selectTask(task: Task) {
    this.selectedTask = task;
    this.isDrawerVisible = !this.isDrawerVisible;
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
   * - list: The first category in the current client's categories list, or a default category with title 'None'.
   * - taglist: An empty array.
   * - subtasks: An empty array.
   *
   * It then adds the new task to the current client's tasks list, reloads the page, updates the status tasks list, and saves the current client to local storage.
   */
  createTask() {
    this.newTask = {
      id: this.currentClient.tasks.length,
      title: 'Task ' + this.statusTasks.length,
      desc: '',
      status: this.pageTitle.toLowerCase().replace(' ', ''),
      date: new Date().toLocaleString().split(',')[0],
      list: this.currentClient.categories[0] || { category_title: 'None' },
      taglist: [],
      subtasks: [],
    };

    this.currentClient.tasks = [...this.currentClient.tasks, this.newTask];
    this.methodsService.reloadPage();
    this.updateTasks();
    this.saveItemsLocalStorage();
  }
}
