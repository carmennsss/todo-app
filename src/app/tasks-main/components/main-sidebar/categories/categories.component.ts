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
  readonly dialog = inject(MatDialog);

  title = signal<string>('');
  items: MenuItem[] = [];
  currentClient = this.localService.getCurrentClient();
  // currentClient = signal<Client>();
  categories: Category[] = this.currentClient.categories || [];

  constructor(private router: Router, private store: Store) {}

  ngOnInit() {
    // this.currentClient = this.store.selectSignal(ClientState.getCurrentClient);
    this.items = [
      {
        label: 'Add New List',
        icon: 'pi pi-plus',
      },
    ];
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Save the selectedTask in the currentClient and in the model.
   */
  saveItemsLocalStorage() {
    this.localService.setCurrentClient(this.currentClient);
    this.localService.saveCurrentClientCategoriesToModel(this.currentClient);
  }

  /**
   * Returns the number of tasks in the currentClient that have the given category.
   * 
   * @param category The title of the category to count.
   * @returns The number of tasks with the given category title.
   */
  getCategoryItemCount(category: string) {
    return this.currentClient.tasks.filter(
      (task : Task) => task.list.category_title === category
    ).length;
  }

  /**
   * Opens a dialog to add a new category.
   * 
   * If the dialog is confirmed, set the title signal to the user's input.
   * If the title is not empty, create a new Category with the given title,
   * add it to the currentClient's categories, and save the currentClient to local storage.
   * Then reload the page to reflect the change.
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
          this.currentClient.categories.push(newCategory);
          this.categories = this.currentClient.categories;
          this.saveItemsLocalStorage();
          this.methodsService.reloadPage();
        }
      }
    });
  }
}
