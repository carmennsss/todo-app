
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../components/sidebar/sidebar/sidebar.component";

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './main-page.component.html',
})
export default class MainPageComponent {
}
