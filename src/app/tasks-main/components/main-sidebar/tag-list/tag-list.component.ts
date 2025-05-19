import { Component } from '@angular/core';
import { Tag, TagModule } from 'primeng/tag';
import { ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomTag } from '../../../../core/interfaces/tasks/CustomTag';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MethodsService } from '../../../../shared/services/methods.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { TagsService } from '../../../../core/services/tags.service';
import { Client } from '../../../../core/interfaces/clients/Client';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

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
  // currentClient = signal<Client>();

  title = signal<string>('');
  tags: CustomTag[] = [];

  constructor(
    private tagsService: TagsService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.tagsService.getTagsClient().subscribe((data) => {
      this.tags = data as CustomTag[];
    });
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Saves the currentClient's tags to the model and updates the local storage.
   */
  saveItemsLocalStorage() {
    this.localService.setCurrentClient(this.currentClient);
    // this.store.dispatch(new changeCurrentClient({ currentUser : this.currentClient }));
    this.localService.saveCurrentClientTagsToModel(this.currentClient);
  }

  /**
   * Opens a dialog to add a new tag. If the dialog is confirmed and the
   * result is not empty, creates a new CustomTag with the given title,
   * adds it to the currentClient's tags, and saves the currentClient
   * to local storage. Then reloads the page to reflect the change.
   */
  addTag() {
    debugger;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.title() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.title.set(result);
        if (this.title() !== '') {
          this.tagsService.addTag(this.title()).subscribe((response) => {
            console.log('Tag added successfully:', response);
          });
        }
      }
    });
  }
}
