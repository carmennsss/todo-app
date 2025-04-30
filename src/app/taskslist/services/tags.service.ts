import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor() {}
  private http = inject(HttpClient);
  private apiUrl = environment.apiClientUrl;


  public getTags() {
    return this.http.get<any>(this.apiUrl + '/tags');
  }
  public addTag(tag: string){
    return this.http.post<any>(this.apiUrl + '/tags', {
      tag_name: tag,
    });
  }
}
