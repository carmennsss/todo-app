import { Task } from './../interfaces/tasks/Task';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { environment } from '../../../environments/environment.development';
import { Client } from '../interfaces/clients/Client';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';
import { map, Observable } from 'rxjs';
import { TaskDB } from '../interfaces/tasks/TaskDB';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private TASKS_URL = environment.apiClientUrl + '/tasks';
  client: ClientDB = { username: '' };

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  getTasksStatusClient(status: string): Observable<TaskDB[]> {
    return this.http
      .get<any[]>(this.TASKS_URL + '/user/status/' + status, {
        params: {
          state_name: status,
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
            list_id: task.list_id,
          }))
        )
      );
  }

  

  createNewTask(task: TaskDB): Observable<TaskDB> {
    return this.http.post<TaskDB>(this.TASKS_URL, {
      params: {
        task_name: task.title,
        task_desc: task.desc,
        task_due_date: task.date,
        state_name: task.status,
        list_id: task.list_id,
      },
    });
  }

  getTasksDateClient(date: string): Observable<TaskDB[]> {
    debugger;
    return this.http
      .get<any[]>(this.TASKS_URL + '/user/date/' + date, {
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
            list_id: task.list_id,
          }))
        )
      );
  }
}
