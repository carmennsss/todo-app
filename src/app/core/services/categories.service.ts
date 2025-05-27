import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { map, Observable } from 'rxjs';
import { Category } from '../interfaces/tasks/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private CATEGORIES_URL = environment.apiClientUrl + '/categories/';
  client: ClientDB = { username: '' };

  constructor(private http: HttpClient, private store: Store) {}

  /**
   * Gets the categories for the client.
   * It sends a GET request to the categories endpoint with the 'user' parameter.
   * The response is mapped to an array of Category objects.
   * @returns An Observable that emits an array of Category objects.
   */
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

  /**
   * Gets the name of a category by its ID.
   * It sends a GET request to the categories endpoint with the category ID.
   * The response is mapped to a Category object.
   * @param category_id - The ID of the category.
   * @returns An Observable that emits the Category object.
   */
  getCategoryName(category_id: number): Observable<Category> {
    return this.http.get<any>(this.CATEGORIES_URL + category_id).pipe(
      map((category) => ({
        category_id: category.category_id,
        category_title: category.category_name,
      }))
    );
  }

  /**
   * Adds a new category.
   * It sends a POST request to the categories endpoint with the category details.
   * @param category 
   * @returns An Observable that emits the response from the server after adding a new category.
   */
  addCategory(category: Category) {
    return this.http.post<any>(this.CATEGORIES_URL, {
      category_id: category.category_id,
      category_name: category.category_title,
    });
  }
}
