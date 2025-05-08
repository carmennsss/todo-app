import {
  StatusNameAction,
  StatusTasksAction,
} from './../../states/status.actions';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { AddNewComponent } from '../../components/add-new/add-new.component';
import { DividerModule } from 'primeng/divider';
import { Task } from '../../../interfaces/Task';
import { EditingSidebarComponent } from '../editing-sidebar/editing-sidebar.component';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { StatusState } from '../../states/status.state';

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
  
  currentClient = this.localService.getCurrentClient();

  statusTasks : Task[] = [];
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
    this.store.select(StatusState.getStatus).subscribe((status) => {
      this.pageTitle = status;
    });
    this.updateTasks();
  }

  updateTasks() {
    this.store.dispatch(new StatusTasksAction({ statusTasks: this.currentClient.tasks }));
    this.store.select(StatusState.getStatusTasks).subscribe((tasks) => {
      this.statusTasks = tasks;
    })
  }

  selectTask(task: Task) {
    this.selectedTask = task;
    this.isDrawerVisible = !this.isDrawerVisible;
  }

  saveItemsLocalStorage() {
    this.localService.setCurrentClient(this.currentClient);
    this.localService.saveCurrentClientTasksToModel(this.currentClient);
  }

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
    this.updateTasks();
    this.saveItemsLocalStorage();
  }
}
