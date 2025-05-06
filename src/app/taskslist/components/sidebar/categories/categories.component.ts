import { Component, Signal } from '@angular/core';
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
import { CustomTag } from '../../../../interfaces/CustomTag';
import { Client } from '../../../../interfaces/Client';
import { Model } from '../../../../interfaces/Model';
import { MenuItem } from 'primeng/api';
import { Category } from '../../../../interfaces/Category';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar-categories',
  imports: [
    TagModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    PanelMenuModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class SidebarCategoriesComponent {
  items: MenuItem[] = [];
  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Add New List',
        icon: 'pi pi-plus',
      },
    ];
  }

  currentClient = JSON.parse(
    localStorage.getItem('currentClient') || '{}'
  ) as Client;

  title = signal<string>('');
  categories: Category[] = this.currentClient.categories || [];
  readonly dialog = inject(MatDialog);

  saveItemsLocalStorage() {
    localStorage.setItem('currentClient', JSON.stringify(this.currentClient));

    let model = JSON.parse(localStorage.getItem('model') || '{}') as Model;

    for (let i = 0; i < model.clients.length; i++) {
      if (model.clients[i].username === this.currentClient.username) {
        model.clients[i].categories = this.currentClient.categories;
      }
    }

    localStorage.setItem('model', JSON.stringify(model));
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
    const dialogRef = this.dialog.open(DialogCategoriesComponent, {
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

@Component({
  selector: 'sidebar-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrl: './categories.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogCategoriesComponent {
  readonly dialogRef = inject(MatDialogRef<DialogCategoriesComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly title = model(this.data.title);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
