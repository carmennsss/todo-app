import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { SubTask } from '../interfaces/tasks/SubTask';

@Injectable({
  providedIn: 'root',
})
export class SubtasksService {
  private SUBTASKS_URL = environment.apiClientUrl + '/subtasks';

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  /**
   * Retrieves subtasks associated with a specific task ID.
   * @param id_task - The ID of the task for which subtasks are to be retrieved.
   * @returns An Observable that emits an array of SubTask objects.
   */
  getSubtasksFromTask(id_task: number): Observable<SubTask[]> {
    if (id_task === undefined) {
      return new Observable<SubTask[]>();
    }
    return this.http
      .get<any[]>(this.SUBTASKS_URL+'/task/'+id_task, {
        params: {
          id_task: id_task,
        },
      })
      .pipe(
        map((subtasks) =>
          subtasks.map((subtask) => ({
            subtask_id: subtask.subtask_id,
            subtask_title: subtask.subtask_name,
          }))
        )
      );
  }

  /**
   * Creates a new subtask associated with a specific task ID.
   * @param subtask 
   * @param id_task 
   * @returns An Observable that emits the created SubTask object.
   */
  createSubtask(subtask: SubTask, id_task: number): Observable<SubTask> {
    console.log('Creating subtask:', subtask);
    return this.http.post<SubTask>(this.SUBTASKS_URL, {
      subtask_id: subtask.subtask_id,
      subtask_name: subtask.subtask_title,
      task_id: id_task
    });
  }
}
