import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TagModule } from 'primeng/tag';
import { Category } from '../../../../core/interfaces/tasks/Category';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { MethodsService } from '../../../../shared/services/methods.service';
import { AddNewComponent } from '../../../status-taskslist/components/add-new/add-new.component';
import { DialogComponent } from '../dialog/dialog.component';
import { Task } from '../../../../core/interfaces/tasks/Task';
import { Store } from '@ngxs/store';
import { CategoriesService } from '../../../../core/services/categories.service';
import { TasksService } from '../../../../core/services/tasks.service';

@Component({
  selector: 'sidebar-categories',
  imports: [
    TagModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    PanelMenuModule,
    AddNewComponent,
  ],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: './categories.component.css',
})
export class SidebarCategoriesComponent implements OnInit {
  localService = inject(LocalStorageService);
  methodsService = inject(MethodsService);
  categoriesService = inject(CategoriesService);
  tasksService = inject(TasksService);

  readonly dialog = inject(MatDialog);

  title = signal<string>('');

  categories = signal<Category[]>([]);

  constructor(private router: Router, private store: Store) {}

  ngOnInit() {
    this.getCategoriesClient();
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  getCategoriesClient() {
    this.categoriesService.getCategoriesClient().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  getCategoryItemCount(category_id: number) {
    this.tasksService
      .getTasksFromCategory(category_id)
      .subscribe((tasks) => {
        return tasks.length;
      }
    );
    return 0
  }

  addCategory() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.title() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.title.set(result);
        if (this.title() !== '') {
          const newCategory: Category = {
            category_title: this.title(),
            category_id: 0,
          };
          this.categoriesService.addCategory(newCategory).subscribe(() => {
            this.getCategoriesClient();
          });
        }
      }
    });
  }
}
