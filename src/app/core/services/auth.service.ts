import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGIN_URL = 'http://localhost:3000/clients/login';
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) { }

  login(user: string, password: string): Observable<any> {
    return this.http.post<any>(this.LOGIN_URL, { password: password, username: user }).pipe(
      tap((res) => {
        
      })
    );
  }
}
