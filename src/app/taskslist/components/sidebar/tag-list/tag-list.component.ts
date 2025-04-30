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
import { TagsService } from '../../../services/tags.service';
import { CustomTag } from '../../../../interfaces/CustomTag';
import { Client } from '../../../../interfaces/Client';
import { Model } from '../../../../interfaces/Model';

@Component({
  selector: 'sidebar-tag-list',
  imports: [TagModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css',
})
export class TagListComponent {
  currentClient = JSON.parse(
    localStorage.getItem('currentClient') || '{}'
  ) as Client;

  title = signal<string>('');
  tags : CustomTag[] = this.currentClient.tags || [];
  readonly dialog = inject(MatDialog);

  newTag: CustomTag = {
    tag_title: this.title(),
  };

  constructor(private tagsService: TagsService) {}

  saveItemsLocalStorage() {
    localStorage.setItem(
      'currentClient',
      JSON.stringify(this.currentClient)
    );

    let model = JSON.parse(
      localStorage.getItem('model') || '{}'
    ) as Model;

    for (let i = 0; i < model.clients.length; i++) {
      if (model.clients[i].username === this.currentClient.username) {
        model.clients[i].tags = this.currentClient.tags;
      }
    }

    localStorage.setItem(
      'model',
      JSON.stringify(model)
    );
  }

  addTag() {
    const dialogRef = this.dialog.open(DialogTagListComponent, {
      data: { title: this.title() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.title.set(result);
        if (this.title() !== '') {
          /*
          this.tagsService.addTag(this.title()).subscribe((response) => {
            console.log('Tag added successfully:', response);
          });
          */
          this.newTag.tag_title = this.title();
          this.currentClient.tags.push(this.newTag);
          this.tags = this.currentClient.tags;
          this.saveItemsLocalStorage();
        }
      }
    });

    
    // this.getTags();
  }

  /*
  getTags() {
    this.tagsService.getTags().subscribe((response) => {
      this.tags.set(response.map((tag: any) => tag.tag_name));
    });
  }

  ngOnInit() {
    this.getTags();
  }
  */
}

@Component({
  selector: 'sidebar-tag-list-dialog',
  templateUrl: './tag-list-dialog.component.html',
  styleUrl: './tag-list.component.css',
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
export class DialogTagListComponent {
  readonly dialogRef = inject(MatDialogRef<DialogTagListComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly title = model(this.data.title);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
