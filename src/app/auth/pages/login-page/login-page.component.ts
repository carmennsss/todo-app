import { Component, ViewChild } from '@angular/core';
import { UserFormComponent } from "../../components/user-form/user-form.component";

@Component({
  selector: 'app-login',
  imports: [UserFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent {}