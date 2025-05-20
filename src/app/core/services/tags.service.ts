import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';
import { tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private TAGS_URL = environment.apiClientUrl + '/tags/';
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}
  client: ClientDB = { username: '' };

  public getTagsClient() {
    return this.http.get<any[]>(this.TAGS_URL + 'user').pipe(
      map((tags) =>
        tags.map((tag) => ({
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
          console.log(res);
        })
      );
  }
}
