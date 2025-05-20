import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ClientDB } from '../interfaces/clients/ClientDB';
import { ClientState } from '../../auth/client-state/client.state';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private CATEGORIES_URL = environment.apiClientUrl + '/categories/';
  client: ClientDB = { username: '' };

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  getCategoriesClient() {
    this.store.select(ClientState.getCurrentClient).subscribe((client) => {
      this.client = client as ClientDB;
    });
    return this.http.get(this.CATEGORIES_URL + 'user', {
      params: {
        username: this.client.username,
      },
    });
  }
}