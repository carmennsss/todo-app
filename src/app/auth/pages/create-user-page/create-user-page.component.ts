import { Component } from '@angular/core';
import { UserFormComponent } from "../../components/user-form/user-form.component";

@Component({
  selector: 'app-sign-up',
  imports: [UserFormComponent],
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.css'],
})
export default class CreateUserPageComponent {
  title = 'Sign Up';
  text = 'Have an account?';
}
