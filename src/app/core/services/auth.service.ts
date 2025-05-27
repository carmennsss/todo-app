import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LOGIN_URL = environment.apiClientUrl + '/auth/';
  private tokenKey = 'token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  /**
   * Logs in the user with the provided username and password.
   * It sends a POST request to the login endpoint and stores the token in local storage.
   * @param user - The username of the user.
   * @param password - The password of the user.
   * @returns An Observable that emits the response from the server.
   */
  login(user: string, password: string): Observable<any> {
    return this.http
      .post<any>(this.LOGIN_URL + 'login', {
        username: user,
        password: password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, JSON.stringify(res.token));
        })
      );
  }

  /**
   * Logs out the user by removing the token from local storage and navigating to the login page.
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['']);
  }

  /**
   * Signs up a new user with the provided username and password.
   * It sends a POST request to the register endpoint.
   * @param user
   * @param password
   * @returns An Observable that emits the response from the server.
   */
  signup(user: string, password: string) {
    return this.http.post<any>(this.LOGIN_URL + 'register', {
      password: password,
      username: user,
    });
  }
}
