import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/main-sidebar/sidebar.component';
import { Store } from '@ngxs/store';
import { GetCategories } from '../../../core/state/categories/categories.actions';
import { GetTagsClient } from '../../../core/state/tags/tags.actions';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: true,
})
export default class MainPageComponent implements OnInit {
  constructor(private store: Store) {}
  ngOnInit() {
    this.store.dispatch(new GetTagsClient());
    this.store.dispatch(new GetCategories());
  }
}
