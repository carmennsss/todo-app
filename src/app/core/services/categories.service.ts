import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private CATEGORIES_URL = environment.apiClientUrl + 'categories/';
  constructor() { }



}
