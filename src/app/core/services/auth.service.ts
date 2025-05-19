import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import { Client } from '../interfaces/clients/Client';
import { changeCurrentClient } from '../../auth/client-state/client.actions';
import { ClientDB } from '../interfaces/clients/ClientDB';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LOGIN_URL = environment.apiClientUrl + '/auth/';
  private tokenKey = 'token';
  currentClient : ClientDB = { username: '' };

  constructor(private http: HttpClient, private router: Router, private store: Store) {}

  login(user: string, password: string): Observable<any> {
    debugger;
    return this.http
      .post<any>(this.LOGIN_URL + 'login', {
        username: user,
        password: password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, JSON.stringify(res.token));
          this.currentClient.username = user;
          this.store.dispatch(new changeCurrentClient({ currentUser: this.currentClient }));
        })
      )
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/']);
  }

  signup(user: string, password: string) {
    return this.http.post<any>(this.LOGIN_URL + 'register', {
      password: password,
      username: user,
    });
  }
}
