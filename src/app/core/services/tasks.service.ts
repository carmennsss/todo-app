import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { environment } from '../../../environments/environment.development';
import { ClientDB } from '../interfaces/clients/ClientDB';
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

  /**
   * Gets the tasks for the client based on their status.
   * It sends a GET request to the tasks endpoint with the 'user/status' path and the status as a parameter.
   * The response is mapped to an array of TaskDB objects.
   * @param status
   * @returns An Observable that emits an array of TaskDB objects filtered by the specified status.
   */
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

  /**
   * Edits an existing task.
   * It sends a PUT request to the tasks endpoint with the 'edit' path and the task ID.
   * The request body contains the updated task details.
   * @param edited_task
   * @returns An Observable that emits the updated TaskDB object after editing the task.
   */
  editTask(edited_task: TaskDB): Observable<TaskDB> {
    console.log('Editing task:', edited_task);
    return this.http.put<TaskDB>(this.TASKS_URL + '/edit/' + edited_task.id, {
      task_id: edited_task.id,
      task_name: edited_task.title,
      task_desc: edited_task.desc,
      task_due_date: edited_task.date,
      state_name: edited_task.status,
      list_id: edited_task.list_id,
    });
  }

  /**
   * Deletes a task by its ID.
   * It sends a DELETE request to the tasks endpoint with the task ID as a parameter.
   * @param task_id
   * @returns An Observable that emits the deleted TaskDB object after deleting the task.
   */
  deleteTask(task_id: number): Observable<TaskDB> {
    return this.http.delete<TaskDB>(this.TASKS_URL, {
      params: {
        id: task_id,
      },
    });
  }

  /**
   * Gets all tasks associated with the client.
   * It sends a GET request to the tasks endpoint with the 'user' path.
   * @returns An Observable that emits an array of TaskDB objects for all tasks associated with the client.
   */
  getAllTasksClient(): Observable<TaskDB[]> {
    return this.http.get<any[]>(this.TASKS_URL + '/user').pipe(
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

  /**
   * Creates a new task.
   * It sends a POST request to the tasks endpoint with the task details.
   * @param task
   * @returns An Observable that emits the created TaskDB object after creating a new task.
   */
  createNewTask(task: TaskDB): Observable<TaskDB> {
    return this.http.post<TaskDB>(this.TASKS_URL, {
      task_name: task.title,
      task_desc: task.desc,
      task_due_date: null,
      state_name: task.status,
      list_id: null,
    });
  }

  /**
   * Gets tasks from a specific category.
   * It sends a GET request to the tasks endpoint with the 'user/category' path and the category ID as a parameter.
   * @param category_id
   * @returns An Observable that emits an array of TaskDB objects associated with the specified category ID.
   */
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

  /**
   * Gets tasks for a specific date.
   * It sends a GET request to the tasks endpoint with the 'user/date' path and the date as a parameter.
   * @param date
   * @returns An Observable that emits an array of TaskDB objects for tasks associated with the specified date.
   */
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
