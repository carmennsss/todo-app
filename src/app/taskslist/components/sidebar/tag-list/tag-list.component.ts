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
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'sidebar-tag-list',
  imports: [TagModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css',
})
export class TagListComponent {
  localService : LocalStorageService = new LocalStorageService();
  currentClient = this.localService.getCurrentClient();

  title = signal<string>('Tag');
  tags: CustomTag[] = this.currentClient.tags || [];
  readonly dialog = inject(MatDialog);

  constructor(private tagsService: TagsService, private router: Router) {}

  saveItemsLocalStorage() {
    this.localService.setCurrentClient(this.currentClient);
    this.localService.saveCurrentClientTagsToModel(this.currentClient);
  }

  addTag() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.title() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.title.set(result);
        if (this.title() !== '') {
          const newTag: CustomTag = {
            tag_title: this.title(),
          };
          /*
          this.tagsService.addTag(this.title()).subscribe((response) => {
            console.log('Tag added successfully:', response);
          });
          */
          newTag.tag_title = this.title();
          this.currentClient.tags.push(newTag);
          this.tags = this.currentClient.tags;
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