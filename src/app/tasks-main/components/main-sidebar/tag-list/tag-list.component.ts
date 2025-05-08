import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomTag } from '../../../../interfaces/CustomTag';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MethodsService } from '../../../../shared/services/methods.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { TagsService } from '../../../status-taskslist/services/tags.service';

@Component({
  selector: 'sidebar-tag-list',
  imports: [TagModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  localService = inject(LocalStorageService);
  methodsService = inject(MethodsService);
  readonly dialog = inject(MatDialog);

  currentClient = this.localService.getCurrentClient();

  title = signal<string>('Tag');
  tags: CustomTag[] = this.currentClient.tags || [];

  constructor(private tagsService: TagsService, private router: Router) {}

  // ------------------------------------------------------------------
  // ----------------------------  Methods  ---------------------------
  // ------------------------------------------------------------------

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
          this.methodsService.reloadPage();
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
