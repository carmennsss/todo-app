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
import { AskAccountComponent } from '../ask-account/ask-account.component';
import { Model } from '../../../core/interfaces/Model';
import { AuthService } from '../../../core/services/auth.service';

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
  authService = inject(AuthService);
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
    if (!this.authService) {
      throw new Error('AuthService is null');
    }

    if (!form || !form.value) {
      throw new Error('Form is null or empty');
    }

    this.authService.login(form.value.username, form.value.password).subscribe({
      error: (error: any) => {
        if (!error) {
          throw new Error('Error is null');
        }

        console.error('Error logging client:', error);
        if (this.child) {
          this.child.showConfirm('User not found');
        } else {
          throw new Error('PopMessageComponent is null');
        }
      },
      complete: () => {
        if (!this.router) {
          throw new Error('Router is null');
        }

        this.router.navigate(['/main/status']).then(
          (success) => {
            if (!success) {
              throw new Error('Navigation failed');
            }
          },
          (error) => {
            console.error('Navigation error:', error);
          }
        );
      }
    });
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
    this.authService
      .signup(form.value.username, form.value.password)
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.error('Error registering client:', error);
        },
      });
    this.model.clients.push(this.newClient);
    this.localService.setModel(this.model);
    alert('User registered successfully, you can now log in');

    this.authForm.reset();
    this.changePageContent();
  }
}
