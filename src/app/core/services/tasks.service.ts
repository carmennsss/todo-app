import { Task } from './../interfaces/tasks/Task';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { environment } from '../../../environments/environment.development';
import { Client } from '../interfaces/clients/Client';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';
import { map } from 'rxjs';
import { TaskDB } from '../interfaces/tasks/TaskDB';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private TASKS_URL = environment.apiClientUrl + '/tasks/';
  client: ClientDB = { username: '' };

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}
  getTasksStatusClient(status: string) {
    return this.http.get<any>(this.TASKS_URL + 'user/status', {
      params: {
        status: status,
      },
    });
  }

  getTasksDateClient(date: string) {
    debugger;
    return this.http
      .get<any[]>(this.TASKS_URL + 'user/date/' + date, {
        params: {
          date: date,
        },
      })
      .pipe(
        map((tasks : TaskDB[]) =>
          tasks.map((task : TaskDB) => ({
            id: task.id || 0,
            title: task.title || '',
            desc: task.desc,
            date: task.date,
            status: task.status,
            list_id: task.list_id,
          }))
        )
      );
  }
}
