import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { AddNewComponent } from '../../components/add-new/add-new.component';
import { DividerModule } from 'primeng/divider';
import { Task } from '../../../interfaces/Task';
import { EditingSidebarComponent } from '../editing-sidebar/editing-sidebar.component';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { LocalStorageService } from '../../services/local-storage.service';

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
})
export default class PageTemplateComponent {
  pageTitle = input.required<string>();
  localService: LocalStorageService = new LocalStorageService();

  currentClient = this.localService.getCurrentClient();

  statusTasks: Task[] = [];
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

  selectTask(task: Task) {
    this.selectedTask = task;
    this.isDrawerVisible = !this.isDrawerVisible;
  }
  getItemsStatus() {
    this.statusTasks = [];
    for (let i = 0; i < this.currentClient.tasks.length; i++) {
      if (
        this.currentClient.tasks[i].status ===
        this.pageTitle().toLowerCase().replace(' ', '')
      ) {
        this.statusTasks = [...this.statusTasks, this.currentClient.tasks[i]];
      }
    }
    return this.statusTasks;
  }

  saveItemsLocalStorage() {
    console.log(this.currentClient);
    this.localService.setCurrentClient(this.currentClient);
    this.localService.saveCurrentClientTasksToModel(this.currentClient);
  }

  createTask() {
    this.statusTasks = this.getItemsStatus(); // OBTIENE las tareas del estado
  
    this.newTask = {
      id: this.currentClient.tasks.length,
      title: 'Task ' + this.statusTasks.length,
      desc: '',
      status: this.pageTitle().toLowerCase().replace(' ', ''),
      date: new Date().toLocaleString().split(',')[0],
      list: this.currentClient.categories[0],
      taglist: [],
      subtasks: [],
    };
  
    this.currentClient.tasks = [...this.currentClient.tasks, this.newTask];
    this.saveItemsLocalStorage();
    this.statusTasks = this.getItemsStatus(); 
  }  
}
