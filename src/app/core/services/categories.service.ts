import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';
import { map, Observable } from 'rxjs';
import { Category } from '../interfaces/tasks/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private CATEGORIES_URL = environment.apiClientUrl + '/categories/';
  client: ClientDB = { username: '' };

  constructor(private http: HttpClient, private store: Store) {}

  getCategoriesClient(): Observable<Category[]> {
    return this.http.get<any[]>(this.CATEGORIES_URL + 'user').pipe(
      map((categories) =>
        categories.map((category) => ({
          category_id: category.category_id,
          category_title: category.category_name,
        }))
      )
    );
  }

  getCategoryName(category_id: number): Observable<Category> {
    return this.http.get<any>(this.CATEGORIES_URL + category_id).pipe(
      map((category) => ({
        category_id: category.category_id,
        category_title: category.category_name,
      }))
    );
  }

  addCategory(category: Category) {
    return this.http.post<any>(this.CATEGORIES_URL, category).pipe(
      map((category) => ({
        category_id: category.category_id,
        category_name: category.category_name,
      }))
    );
  }
}
