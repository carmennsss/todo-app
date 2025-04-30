/* Control de APIs para la base de datos de clientes y su autenticacion */
/* EN PAUSA */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private apiUrl = environment.apiClientUrl;

  // Agrega el cliente mandando un post a la API
  public addClient(user: string, password: string) {
    return this.http.post<any>(this.apiUrl + '/clients/signup', { password: password, username: user });
  }  

  // Logea el cliente mandando un post a la API
  // Alli comprobara si el usuario y la contraseña son correctos (coinciden con la base de datos)
  public logClient(user: string, password: string) {
    return this.http.post<any>(this.apiUrl + '/clients/login', { password: password, username: user });
  }  
}
