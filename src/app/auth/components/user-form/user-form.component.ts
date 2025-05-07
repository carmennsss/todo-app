import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AskAccountComponent } from '../ask-account/ask-account.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ClientDB } from '../../../interfaces/ClientDB';
import { Client } from '../../../interfaces/Client';
import { Model } from '../../../interfaces/Model';
import { LocalStorageService } from '../../../taskslist/services/local-storage.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PopMessageComponent } from '../../../shared/components/pop-message/pop-message.component';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'auth-user-form',
  imports: [
    AskAccountComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopMessageComponent,
    ButtonModule,
    AvatarModule,
    ErrorMessageComponent,
  ],
  templateUrl: './user-form.component.html',
  providers: [MessageService],
  styleUrl: './user-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  localService = inject(LocalStorageService);
  title = input.required<string>();
  text = input.required<string>();
  authForm: FormGroup = new FormGroup({});

  model: Model = {
    clients: [],
  };

  newClient: Client = {
    username: '',
    password: '',
    tasks: [],
    tags: [],
    categories: [],
  };

  // @Select(ClientState.getClient) client$!: Observable<ClientDB>;
  @ViewChild(PopMessageComponent) child: PopMessageComponent | undefined;
  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // METHODS

  submitClient(form: FormGroup) {
    if (!(Object.keys(this.localService.getModel()).length === 0)) {
      this.model = this.localService.getModel();
    }

    if (this.title().toLowerCase() === 'login') {
      this.logClient(form);
    }

    if (this.title().toLowerCase() === 'sign up') {
      this.registerClient(form);
    }
  }

  logClient(form: FormGroup) {
    debugger;
    if (this.model.clients.length != 0) {
      let found = false;
      for (let i = 0; i < this.model.clients.length; i++) {
        if (
          this.model.clients[i].username === form.value.username &&
          this.model.clients[i].password === form.value.password
        ) {
          this.localService.setCurrentClient(this.model.clients[i]);
          this.router.navigate(['/main/status']);
          found = true;
        }
      }
      if (!found) {
        this.child?.showConfirm('User not found');
        return;
      }
    } else {
      this.child?.showConfirm('No users found');
      return;
    }

    /*
    this.authService.logClient(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Client logged successfully:', response);
        this.router.navigate(['/main/nonstarted']);
        const currentClient : ClientDB = {
          username: this.username,
          password: this.password,
          client_name: ''
        };
        
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

  registerClient(form: FormGroup) {
    debugger;
    if (
      form.value.username.trim() === '' ||
      form.value.password.trim() === ''
    ) {
      this.child?.showConfirm('Username or password cannot be empty');
      return;
    }

    if (this.model.clients.length != 0) {
      for (let i = 0; i < this.model.clients.length; i++) {
        if (this.model.clients[i].username === form.value.username) {
          this.child?.showConfirm('User already exists');
          return;
        }
      }
    }
    this.newClient = {
      username: form.value.username,
      password: form.value.password,
      tasks: [],
      tags: [],
      categories: [],
    };
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
}
