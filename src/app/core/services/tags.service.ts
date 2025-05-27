import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomTag } from '../interfaces/tasks/CustomTag';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private TAGS_URL = environment.apiClientUrl + '/tags/';
  private TASKS_TAGS_URL = environment.apiClientUrl + '/tasks-tag/';
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  /**
   * Retrieves the tags associated with the current user.
   * It sends a GET request to the tags endpoint with the 'user' parameter.
   * @returns An Observable that emits an array of CustomTag objects.
   */
  public getTagsClient(): Observable<CustomTag[]> {
    return this.http.get<any[]>(this.TAGS_URL + 'user').pipe(
      map((tags) =>
        tags.map((tag) => ({
          tag_id: tag.tag_id,
          tag_title: tag.tag_name,
        }))
      )
    );
  }

  /**
   * Adds a new tag for the current user.
   * It sends a POST request to the tags endpoint with the tag details.
   * @param tag
   * @returns An Observable that emits the response from the server after adding a new tag.
   */
  public addTag(tag: string) {
    return this.http
      .post<any>(this.TAGS_URL, {
        tag_name: tag,
      })
      .pipe(
        tap((res) => {
          console.log(res, 'res');
        })
      );
  }

  /**
   * Gets the tags associated with a specific task.
   * It sends a GET request to the tasks-tag endpoint with the 'task/included-tags' path and the task ID as a parameter
   * @param id_task
   * @returns An Observable that emits an array of CustomTag objects that are associated with the specified task.
   */
  public getTagsTask(id_task: number) {
    if (id_task == undefined) {
      return new Observable<CustomTag[]>();
    }
    return this.http
      .get<any[]>(this.TASKS_TAGS_URL + 'task/included-tags', {
        params: {
          id_task: id_task,
        },
      })
      .pipe(
        map((tags) =>
          tags.map((tag) => ({
            tag_id: tag.tag_id,
            tag_title: tag.tag_name,
          }))
        )
      );
  }

  /**
   * Gets the tags that are not associated with a specific task.
   * It sends a GET request to the tasks-tag endpoint with the 'task/excluded-tags' path and the task ID as a parameter.
   * @param id_task 
   * @returns An Observable that emits an array of CustomTag objects that are not associated with the specified task.
   */
  public getTagsNotInTask(id_task: number) {
    if (id_task == undefined) {
      return new Observable<CustomTag[]>();
    }
    return this.http
      .get<any[]>(this.TASKS_TAGS_URL + 'task/excluded-tags', {
        params: {
          id_task: id_task,
        },
      })
      .pipe(
        map((tags) =>
          tags.map((tag) => ({
            tag_id: tag.tag_id,
            tag_title: tag.tag_name,
          }))
        )
      );
  }

  /**
   * Adds a tag to a specific task.
   * It sends a POST request to the tasks-tag endpoint with the task ID and tag ID.
   * @param id_task - The ID of the task to which the tag will be added.
   * @param id_tag - The ID of the tag to be added to the task.
   * @returns An Observable that emits the response from the server after adding the tag to the task.
   */
  public addTagToTask(id_task: number, id_tag: number) {
    return this.http.post<any>(this.TASKS_TAGS_URL, {
      task_id: id_task,
      tag_id: id_tag,
    });
  }
}
