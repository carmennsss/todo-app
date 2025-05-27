import { ClientState } from './../../../../../../todo-app - copia/src/app/auth/services/client-state/client.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/main-sidebar/sidebar.component';
import { Store } from '@ngxs/store';
import { GetCategories } from '../../../core/state/categories/categories.actions';
import { GetTagsClient } from '../../../core/state/tags/tags.actions';
import { Logout } from '../../../core/state/user/user.actions';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: true,
})
export default class MainPageComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}
  ngOnInit() {
    this.store.dispatch(new GetTagsClient());
    this.store.dispatch(new GetCategories());
  }

  ngOnDestroy(): void {
    this.store.dispatch(new Logout());
  }

  /**
   * Toggles the sidebar open or closed.
   * This method is used to control the visibility of the sidebar.
   */
  openSidebar() {
    const sidebar = document.querySelector('#sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }
}
