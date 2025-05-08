import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

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
