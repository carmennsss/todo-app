import { Component } from '@angular/core';
import { TaskStatusListComponent } from './task-status-list/task-status-list.component';
import { SidebarFooterComponent } from './sidebar-footer/sidebar-footer.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { SidebarCategoriesComponent } from './categories/categories.component';

@Component({
  selector: 'sidebar',
  imports: [
    TaskStatusListComponent,
    SidebarFooterComponent,
    TagListComponent,
    SidebarCategoriesComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
})
export class SidebarComponent {}
