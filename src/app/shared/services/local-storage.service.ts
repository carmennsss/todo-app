/* IMPLEMENTANDO PARA OPTIMIZAR */
import { Injectable, model } from '@angular/core';
import { Client } from '../../interfaces/Client';
import { Model } from '../../interfaces/Model';
import { Task } from '../../interfaces/Task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  clientKey = 'currentClient';
  modelKey = 'model';
  statusKey = 'currentStatus';

  constructor() {}

  // ------------------------------------------------------------------
  // ----------------------------  Methods  ---------------------------
  // ------------------------------------------------------------------

  getCurrentClient() {
    return JSON.parse(localStorage.getItem(this.clientKey) || '{}') as Client;
  }

  saveTaskToCurrentClient(selectedTask: Task) {
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

  setCurrentClient(currentClient: Client) {
    localStorage.setItem(this.clientKey, JSON.stringify(currentClient));
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

  setModel(model: Model) {
    localStorage.setItem(this.modelKey, JSON.stringify(model));
  }

  getModel() {
    return JSON.parse(localStorage.getItem(this.modelKey) || '{}') as Model;
  }
}
