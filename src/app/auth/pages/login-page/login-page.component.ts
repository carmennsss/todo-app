import { Component } from '@angular/core';
import { AskAccountComponent } from "../../components/ask-account/ask-account.component";
import { UserFormComponent } from "../../components/user-form/user-form.component";

@Component({
  selector: 'app-login',
  imports: [UserFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent {
  title = 'Login';
  text = 'Don\'t have an account?';
}
