/* IMPLEMENTANDO PARA OPTIMIZAR */
import { Injectable, model } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../core/interfaces/clients/Client';
import { Model } from '../../core/interfaces/Model';
import { TaskDB } from '../../core/interfaces/tasks/TaskDB';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  clientKey = 'currentClient';
  modelKey = 'model';
  statusKey = 'currentStatus';

  constructor() {}

  //---------------------------------------
  // METHODS
  //---------------------------------------

  // GETTERS
  getCurrentClient() {
    return JSON.parse(localStorage.getItem(this.clientKey) || '{}') as Client;
  }

  getModel() {
    return JSON.parse(localStorage.getItem(this.modelKey) || '{}') as Model;
  }

  // SETTERS
  setCurrentClient(currentClient: Client) {
    localStorage.setItem(this.clientKey, JSON.stringify(currentClient));
  }

  setModel(model: Model) {
    localStorage.setItem(this.modelKey, JSON.stringify(model));
  }

  // SAVE
  saveTaskToCurrentClient(selectedTask: TaskDB) {
    let currentClient = this.getCurrentClient();
    for (let i = 0; i < currentClient.tasks.length; i++) {
      if (currentClient.tasks[i].id === selectedTask.id) {
        currentClient.tasks[i] = selectedTask;
      }
    }
    localStorage.setItem(this.clientKey, JSON.stringify(currentClient));
  }

  saveCurrentClientCategoriesToModel(currentClient: Client) {
    let model = this.getModel();
    for (let i = 0; i < model.clients.length; i++) {
      if (model.clients[i].username === currentClient.username) {
        model.clients[i].categories = currentClient.categories;
      }
    }
    localStorage.setItem(this.modelKey, JSON.stringify(model));
  }

  saveCurrentClientTagsToModel(currentClient: Client) {
    let model = this.getModel();
    for (let i = 0; i < model.clients.length; i++) {
      if (model.clients[i].username === currentClient.username) {
        model.clients[i].tags = currentClient.tags;
      }
    }
    localStorage.setItem(this.modelKey, JSON.stringify(model));
  }

  saveCurrentClientTasksToModel(currentClient: Client) {
    let model = this.getModel();
    for (let i = 0; i < model.clients.length; i++) {
      if (model.clients[i].username === currentClient.username) {
        model.clients[i].tasks = currentClient.tasks;
      }
    }
    localStorage.setItem(this.modelKey, JSON.stringify(model));
  }
}
