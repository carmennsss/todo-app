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

  createSubtask(subtask: SubTask, id_task: number): Observable<SubTask> {
    console.log('Creating subtask:', subtask);
    return this.http.post<SubTask>(this.SUBTASKS_URL, {
      subtask_id: subtask.subtask_id,
      subtask_name: subtask.subtask_title,
      task_id: id_task
    });
  }
}
