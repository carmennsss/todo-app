import { Component, OnInit, Signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Category } from '../../../../interfaces/Category';
import { Router } from '@angular/router';
import { AddNewComponent } from '../../add-new/add-new.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { DialogComponent } from '../dialog/dialog.component';

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
  readonly dialog = inject(MatDialog);

  title = signal<string>('Category');
  items: MenuItem[] = [];
  currentClient = this.localService.getCurrentClient();
  categories: Category[] = this.currentClient.categories || [];
  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Add New List',
        icon: 'pi pi-plus',
      },
    ];
  }

  saveItemsLocalStorage() {
    this.localService.setCurrentClient(this.currentClient);
    this.localService.saveCurrentClientCategoriesToModel(this.currentClient);
  }

  getCategoryItemCount(category: string) {
    let count = 0;
    for (let i = 0; i < this.currentClient.tasks.length; i++) {
      if (this.currentClient.tasks[i].list.category_title === category) {
        count++;
      }
    }
    return count;
  }

  addCategory() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.title() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.title.set(result);
        if (this.title() !== '') {
          const newCategory: Category = {
            category_title: this.title(),
          };
          this.currentClient.categories.push(newCategory);
          this.categories = this.currentClient.categories;
          this.saveItemsLocalStorage();
          const currentUrl = this.router.url;
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl(currentUrl);
            });
        }
      }
    });
  }
}
