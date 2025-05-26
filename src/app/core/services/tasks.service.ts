import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { environment } from '../../../environments/environment.development';
import { Client } from '../interfaces/clients/Client';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';
import { map, Observable, tap } from 'rxjs';
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

  editTask(edited_task: TaskDB): Observable<TaskDB> {
    return this.http.put<TaskDB>(this.TASKS_URL + '/edit/' + edited_task.id, {
      task_id: edited_task.id,
      task_name: edited_task.title,
      task_desc: edited_task.desc,
      task_due_date: edited_task.date,
      state_name: edited_task.status,
      list_id: edited_task.list_id,
    });
  }

  deleteTask(task_id: number): Observable<TaskDB> {
    return this.http.delete<TaskDB>(this.TASKS_URL, {
      params: {
        id: task_id,
      },
    });
  }

  getAllTasksClient(): Observable<TaskDB[]> {
    return this.http
      .get<any[]>(this.TASKS_URL + '/user')
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
      task_name: task.title,
      task_desc: task.desc,
      task_due_date: null,
      state_name: task.status,
      list_id: null,
    });
  }

  getTasksFromCategory(category_id: number): Observable<TaskDB[]> {
    return this.http
      .get<any[]>(this.TASKS_URL + '/user/category/' + category_id, {
        params: {
          category_id: category_id,
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

  getTasksDateClient(date: string): Observable<TaskDB[]> {
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
