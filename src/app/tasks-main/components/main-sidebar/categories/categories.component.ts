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
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TagModule } from 'primeng/tag';
import { Category } from '../../../../core/interfaces/tasks/Category';
import { MethodsService } from '../../../../shared/services/methods.service';
import { AddNewComponent } from '../../../status-taskslist/components/add-new/add-new.component';
import { DialogComponent } from '../dialog/dialog.component';
import { Store } from '@ngxs/store';
import { CategoriesService } from '../../../../core/services/categories.service';
import { TasksService } from '../../../../core/services/tasks.service';
import { CategoriesState } from '../../../../core/state/categories/categories.state';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { TasksStateHttp } from '../../../../core/state/tasks/tasks.state';
import { GetCategories } from '../../../../core/state/categories/categories.actions';

@Component({
  selector: 'sidebar-categories',
  imports: [
    TagModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    PanelMenuModule,
    AddNewComponent,
    DialogModule,
  ],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: './categories.component.css',
})

export class SidebarCategoriesComponent implements OnInit {
  methodsService = inject(MethodsService);
  categoriesService = inject(CategoriesService);
  tasksService = inject(TasksService);

  readonly dialog = inject(MatDialog);

  title = signal<string>('');
  visibleDialogCategory: boolean = false;

  categories = signal<Category[]>([]);

  constructor(private router: Router, private store: Store) {}

  ngOnInit() {
    this.store.select(CategoriesState.categories).subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Gets the amount of tasks in a specific category.
   * This method retrieves all tasks from the store and counts how many belong to the specified category.
   * It is used to display the number of tasks associated with each category in the sidebar.
   * @param category_id 
   * @returns The number of tasks in the category.
   */
  getCategoryItemCount(category_id: number) {
    var tasks: TaskDB[] = [];
    this.store.select(TasksStateHttp.allTasks).subscribe((tasksList) => {
      tasks = tasksList;
    });
    var count = 0;
    tasks.forEach((task) => {
      if (task.list_id === category_id) {
        count++;
      }
    });
    return count;
  }

  /**
   * Open a dialog to add a new category.
   * This method opens a dialog where the user can input the title of the new category.
   * After the dialog is closed, it checks if a title was provided.
   * If a title is given, it creates a new category object and calls the service to add it to the backend.
   * Finally, it dispatches an action to update the categories in the store.
   */
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
          this.categoriesService
            .addCategory(newCategory)
            .subscribe((category) => {
              console.log('Category created:', category);
              this.title.set('');
            });
          this.store.dispatch(new GetCategories());
        }
      }
    });
  }
}
