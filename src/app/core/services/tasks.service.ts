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
        map((tasks) =>
          tasks.map((task) => ({
            id: task.task_id,
            title: task.task_name,
            desc: task.task_desc,
            date: task.task_due_date,
            status: task.state_name,
            list: { category_title: 'None' },
            taglist: [],
            subtasks: [],
          }))
        )
      );
  }
}
