import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Client } from '../../../core/interfaces/clients/Client';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { PopMessageComponent } from '../../../shared/components/pop-message/pop-message.component';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { AskAccountComponent } from '../ask-account/ask-account.component';
import { Model } from '../../../core/interfaces/Model';
import { changeCurrentClient } from '../../services/client-state/client.actions';
import { ClientState } from '../../services/client-state/client.state';

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
  title = 'Login';
  text = "Don't have an account?";
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
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Submits the form and attempts to log in or register the user based on the form title.
   *
   * It checks if the model is empty and sets it to the current model if not.
   * Then it checks if the title is 'login' or 'sign up' and calls the respective method.
   * @param form The FormGroup containing the form values.
   */
  submitClient(form: FormGroup) {
    if (!(Object.keys(this.localService.getModel()).length === 0)) {
      this.model = this.localService.getModel();
    }

    if (this.title === 'Login') {
      this.logClient(form);
    } else {
      this.registerClient(form);
    }
  }

  /**
   * Attempts to log in the user using the provided form data.
   *
   * Checks if there are existing clients in the model and compares
   * the form's username and password with each client's credentials.
   *
   * If a match is found, sets the current client in local storage
   * and navigates to the main status page. If no match is found,
   * displays a "User not found" message. If no clients exist,
   * displays a "No users found" message.
   *
   * @param form The FormGroup containing the login form values.
   */

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

          this.store.dispatch(
            new changeCurrentClient({ currentUser: this.model.clients[i] })
          ); // IN PROGRESS

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

  /**
   * Toggles the page content between login and sign up.
   * Resets the form and updates the text
   */
  changePageContent() {
    this.authForm.reset();
    if (this.title === 'Login') {
      this.title = 'Sign Up';
      this.text = 'Already have an account?';
    } else {
      this.title = 'Login';
      this.text = "Don't have an account?";
    }
  }

  /**
   * Registers a new client and logs them in.
   *
   * Checks if the provided username and password are not empty,
   * and if the username does not already exist in the model.
   * If the checks pass, adds the new client to the model and local storage,
   * and navigates to the main status page.
   * @param form The FormGroup containing the registration form values.
   */
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

    this.authForm.reset();
    this.changePageContent();
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
