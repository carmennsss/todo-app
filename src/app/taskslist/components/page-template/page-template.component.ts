import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { AddNewComponent } from '../../components/add-new/add-new.component';
import { DividerModule } from 'primeng/divider';
import { PanelMenu } from 'primeng/panelmenu';
import { Client } from '../../../interfaces/Client';
import { Model } from '../../../interfaces/Model';
import { Task } from '../../../interfaces/Task';
import { MenuItem } from 'primeng/api';
import { EditingSidebarComponent } from "../editing-sidebar/editing-sidebar.component";

@Component({
  selector: 'tasks-page-template',
  imports: [AddNewComponent, DividerModule, PanelMenu, EditingSidebarComponent],
  templateUrl: './page-template.component.html',
  styleUrl: './page-template.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageTemplateComponent {
  visible = signal(false);
  pageTitle = input.required<string>();

  currentClient = JSON.parse(
    localStorage.getItem('currentClient') || '{}'
  ) as Client;

  statusTasks : Task[] = [];
  items: MenuItem[] = []
  newTask : Task = {
    id: 0,
    title: '',
    desc: '',
    status: '',
    list: this.currentClient.categories[0],
    taglist: [],
    date: '',
  }

  getItemsStatus() {
    for (let i = 0; i < this.currentClient.tasks.length; i++) {
      if (this.currentClient.tasks[i].status === this.pageTitle().toLowerCase().replace(' ', '')) {
        this.statusTasks.push(this.currentClient.tasks[i]);
      }
    }
  }

  saveItemsLocalStorage() {
    localStorage.setItem('currentClient', JSON.stringify(this.currentClient));

    let model = JSON.parse(localStorage.getItem('model') || '{}') as Model;

    for (let i = 0; i < model.clients.length; i++) {
      if (model.clients[i].username === this.currentClient.username) {
        model.clients[i].tasks = this.currentClient.tasks;
      }
    }

    localStorage.setItem('model', JSON.stringify(model));
  }
  ngOnInit() {
    this.statusTasks = [];
    this.getItemsStatus();
    this.items = this.statusTasks.map(task => ({
      label: task.title,
      icon: 'pi-ellipsis-h',
      command: () => {
        this.visible.set(true);
        this.newTask = task;
      }
    }));
  }

  createTask() {
    this.getItemsStatus();
    this.newTask = {
      id: this.currentClient.tasks.length,
      title: 'Task '+this.statusTasks.length,
      desc: '',
      status: this.pageTitle().toLowerCase().replace(' ', ''),
      date: '',
      list: this.currentClient.categories[0],
      taglist: []
    }
    
    this.currentClient.tasks.push(this.newTask);
    this.ngOnInit();
    this.saveItemsLocalStorage();
  }
}
