import { Component, ViewChild } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomTag } from '../../../../core/interfaces/tasks/CustomTag';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MethodsService } from '../../../../shared/services/methods.service';
import { TagsService } from '../../../../core/services/tags.service';
import { Store } from '@ngxs/store';
import { GetTagsClient } from '../../../../core/state/tags/tags.actions';
import { DialogModule } from 'primeng/dialog';
import { TagsState } from '../../../../core/state/tags/tags.state';
import { PopConfirmMessageComponent } from '../../../../shared/components/pop-confirm-message/pop-confirm-message.component';
import { PopMessageComponent } from '../../../../shared/components/pop-message/pop-message.component';

@Component({
  selector: 'sidebar-tag-list',
  imports: [
    TagModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    DialogModule,
    PopConfirmMessageComponent,
    PopMessageComponent
],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  methodsService = inject(MethodsService);
  readonly dialog = inject(MatDialog);

  title = signal<string>('');
  visibleDialogTag: boolean = false;
  tags = signal<CustomTag[]>([]);

  @ViewChild(PopMessageComponent) child: PopMessageComponent | undefined;
  @ViewChild(PopConfirmMessageComponent) childConfirm:
    | PopConfirmMessageComponent
    | undefined;

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

  /**
   * Opens a dialog to add a new tag.
   * The dialog allows the user to input a title for the tag.
   * After the dialog is closed, if a title is provided,
   * the tag is added to the backend and the page is reloaded.
   */
  addTag() {
    debugger;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.title() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
      if (result !== undefined) {
        this.title.set(result);
        if (this.title().replaceAll(' ', '') == '') {
          this.child?.showConfirm('Tag title cannot be empty!');
        } else {
          this.tagsService.addTag(this.title()).subscribe((response) => {
            console.log('Tag added:', response);
          });
          this.store.dispatch(new GetTagsClient());
          this.childConfirm?.showConfirm('Tag added successfully!');
        }
      }
    });
  }
}
