import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { environment } from '../../../environments/environment.development';
import { Client } from '../interfaces/clients/Client';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';
import { Task } from '../interfaces/tasks/Task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private TASKS_URL = environment.apiClientUrl + '/tasks/';
  client : ClientDB = { username: '' };
  
  constructor(private http: HttpClient, private router: Router, private store: Store) { }
  getTasksStatusClient(status : string) {
    this.store.select(ClientState.getCurrentClient).subscribe((client) => {
      this.client = client as ClientDB;
    })
    return this.http.get<any>(this.TASKS_URL + 'user/status', {
        params: {
          status: status,
          username: this.client.username,
        }
      })
    ;
  }

  getTasksDateClient(date : string) {
    this.store.select(ClientState.getCurrentClient).subscribe((client) => {
      this.client = client as ClientDB;
    })
    return this.http.get<Task[]>(this.TASKS_URL + 'user/date', {
        params: {
          date: date,
          username: this.client.username,
        }
      })
    ;
  }
}
