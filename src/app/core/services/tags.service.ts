import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';
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

  public addTagToTask(id_task: number, id_tag: number) {
    return this.http.post<any>(this.TASKS_TAGS_URL, {
      task_id: id_task,
      tag_id: id_tag,
    });
  }
}
