import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AskAccountComponent } from '../ask-account/ask-account.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ClientDB } from '../../../interfaces/ClientDB';
import { Client } from '../../../interfaces/Client';
import { Model } from '../../../interfaces/Model';
import { LocalStorageService } from '../../../taskslist/services/local-storage.service';

@Component({
  selector: 'auth-user-form',
  imports: [AskAccountComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  localService : LocalStorageService = new LocalStorageService();
  title = input.required<string>();
  text = input.required<string>();
  model : Model = {
    clients: []
  }
  newClient : Client = {
    username: '',
    password: '',
    tasks: [],
    tags: [],
    categories: []
  }

  // Select para obtener el estado del cliente
  // @Select(ClientState.getClient) client$!: Observable<ClientDB>;

  constructor(private router: Router,private authService: AuthService, private store: Store) {}
  username = '';
  password = '';

  // Metodos para cambiar el usuario y la contraseña
  changeUser(username: string) {
    this.username = username;
  }
  changePassword(password: string) {
    this.password = password;
  }

  // Metodo para la accion del boton, dependera de si el formulario es de login o de registro
  submitClient() {
    this.getItemsLocal();

    if (this.title().toLowerCase() === 'login') {
      this.logClient();
    }

    if (this.title().toLowerCase() === 'sign up') {
      this.registerClient();
    }
  }

  // Metodo para el log in
  logClient() {
    console.log('Submitting client:', this.username, this.password);

    if (this.model.clients.length != 0) {
      let found = false;
      for (let i = 0; i < this.model.clients.length; i++) {
        if (this.model.clients[i].username === this.username && this.model.clients[i].password === this.password) {
          this.localService.setCurrentClient(this.model.clients[i]);
          this.router.navigate(['/main/status']);
          found = true;
        }
      }
      if (!found) {
        alert('Incorrect username or password');
        return;
      }
    }
    else {
      alert('No users registered');
      return;
    }
    
    /*
    this.authService.logClient(this.username, this.password).subscribe({
      // Si sale bien redigire a la pagina principal
      next: (response: any) => {
        console.log('Client logged successfully:', response);
        this.router.navigate(['/main/nonstarted']);
        const currentClient : ClientDB = {
          username: this.username,
          password: this.password,
          client_name: ''
        };
        
        // CAMBIA EL ESTADO PARA GUARDAR EL USUARIO
        this.store.dispatch(new changeClient({ currentUser: currentClient })).subscribe(() => {
          this.store.select(ClientState.getClient).subscribe(client => {
            console.log('Client state updated:', client);
          });
        });
        
      },
      error: (error: any) => {
        console.error('Error logging client:', error);
      },
    });*/
  }

  // Metodo para el registro
  registerClient() {
    console.log('Submitting client:', this.username, this.password);

    if (this.username === '' || this.password === '') {
      alert('Please fill in all fields');
      return;
    }
    
    if (this.model.clients.length != 0) {
      for (let i = 0; i < this.model.clients.length; i++) {
        if (this.model.clients[i].username === this.username) {
          alert('Username already exists');
          return;
        }
      }
      
    }
    this.newClient = {
      username: this.username,
      password: this.password,
      tasks: [],
      tags: [],
      categories: []
    }
    this.model.clients.push(this.newClient);
    this.localService.setModel(this.model);
    alert('User registered successfully, you can now log in');
    this.router.navigate(['']);
    /*
    this.authService.addClient(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Client added successfully:', response);
      },
      error: (error: any) => {
        console.error('Error adding client:', error);
      },
    });
    */
  }

  getItemsLocal() {
    if (this.localService.getModel()) {
      this.model = this.localService.getModel();
    }
  }
}
