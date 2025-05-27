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
  authService = inject(AuthService);
  title = 'Login';
  text = "Don't have an account?";
  authForm: FormGroup = new FormGroup({});

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
   * Submits the form based on the page content.
   * @param form The FormGroup containing the form values.
   */
  submitClient(form: FormGroup) {
    if (this.title === 'Login') {
      this.logClient(form);
    } else {
      this.registerClient(form);
    }
  }

  /**
   * Logs in the user with the provided credentials.
   * 
   * Checks if the username and password are correct, using the AuthService.
   * If the credentials are valid, navigates to the main status page.
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
        this.child?.showConfirm('User not found');
      },
      complete: () => {
        this.router.navigate(['/main/status']);
      },
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
    if (
      form.value.username.trim() === '' ||
      form.value.password.trim() === ''
    ) {
      this.child?.showConfirm('Username or password cannot be empty');
      return;
    }

    this.authService
      .signup(form.value.username, form.value.password)
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['']);
        },
        error: (error: any) => {
          this.child?.showConfirm('Username already exists');
        },
      });
    alert('User registered successfully, you can now log in');

    this.authForm.reset();
    this.changePageContent();
  }
}
