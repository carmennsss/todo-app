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
import {
  AddTag,
  GetTagsClient,
} from '../../../../core/state/tags/tags.actions';
import { DialogModule } from 'primeng/dialog';
import { TagsState } from '../../../../core/state/tags/tags.state';

@Component({
  selector: 'sidebar-tag-list',
  imports: [TagModule, CommonModule, FormsModule, MatButtonModule, DialogModule],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  localService = inject(LocalStorageService);
  methodsService = inject(MethodsService);
  readonly dialog = inject(MatDialog);

  title = signal<string>('');
  visibleDialogTag : boolean = false;
  tags = signal<CustomTag[]>([]);
  newTag: CustomTag = {
    tag_id: 0,
    tag_title: '',
  };

  constructor(
    private tagsService: TagsService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.select(TagsState.tags).subscribe((tags) => {
      this.tags.set(tags);
    });
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  addTag() {
    debugger;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.title() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
      if (result !== undefined) {
        this.title.set(result);
        if (this.title() !== '') {
          this.tagsService
            .addTag(this.title())
            .subscribe((response) => {
              console.log('Tag added:', response);
            })
          this.store.dispatch(new GetTagsClient());
          this.methodsService.reloadPage();
        }
      }
    });
  }
}
