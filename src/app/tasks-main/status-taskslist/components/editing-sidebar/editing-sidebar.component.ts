import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  ViewChild,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomTag } from '../../../../interfaces/CustomTag';
import { SubTask } from '../../../../interfaces/SubTask';
import { Task } from '../../../../interfaces/Task';
import { PopMessageComponent } from '../../../../shared/components/pop-message/pop-message.component';
import { MethodsService } from '../../../../shared/services/methods.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { AddNewComponent } from '../add-new/add-new.component';


@Component({
  selector: 'editing-sidebar',
  imports: [
    DrawerModule,
    ButtonModule,
    MultiSelectModule,
    TagModule,
    CommonModule,
    AddNewComponent,
    PopMessageComponent,
    DialogModule
  ],
  templateUrl: './editing-sidebar.component.html',
  styleUrl: './editing-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EditingSidebarComponent {
  localService = inject(LocalStorageService);
  methodsService = inject(MethodsService);

  selectedTask = input.required<Task>();
  @Input() isDrawerVisible: boolean = false;
  visibleDialogTag: boolean = false;
  visibleDialogSub: boolean = false;

  @ViewChild(PopMessageComponent) child: PopMessageComponent | undefined;
  currentClient = this.localService.getCurrentClient();

  newSubtasks: SubTask[] = [];
  selectedTags: CustomTag[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  // ------------------------------------------------------------------
  // ----------------------------  Methods  ---------------------------
  // ------------------------------------------------------------------

  /**
   * Show the dialog for selecting tags.
   * If the selectedTask's taglist already contains all the tags from the currentClient,
   * show a confirmation message saying that you cannot add more tags.
   */
  showDialogTag() {
    this.selectedTags = this.selectedTask().taglist;
    if (
      this.currentClient.tags.length != this.selectedTask().taglist.length &&
      this.currentClient.tags.length != 0
    ) {
      this.visibleDialogTag = true;
    } else {
      this.child?.showConfirm('You cannot add more tags');
    }
  }

  /**
   * Add a tag to the selectedTask's taglist.
   * If the number of tags in the selectedTask's taglist is equal to the number of tags in the currentClient,
   * close the dialog.
   * @param tag The tag to add to the selectedTask's taglist.
   */
  selectTag(tag: any) {
    this.selectedTags.push(tag);
    if (this.currentClient.tags.length <= this.selectedTags.length) {
      this.visibleDialogTag = false;
    }
  }

  /**
   * Save the selectedTask in the currentClient and in the model.
   * Then reset the newSubtasks array.
   */
  saveItemsLocalStorage() {
    this.localService.saveTaskToCurrentClient(this.selectedTask());
    this.localService.saveCurrentClientTasksToModel(this.currentClient);
    this.newSubtasks = [];
  }

  /**
   * Changes the selectedTask's list to the category with the given title.
   * @param category The title of the category to change to.
   */
  changeCategory(category: string) {
    for (let i = 0; i < this.currentClient.categories.length; i++) {
      if (this.currentClient.categories[i].category_title === category) {
        this.selectedTask().list = this.currentClient.categories[i];
      }
    }
  }

  /**
   * Close the editing sidebar.
   */
  closeDrawer() {
    this.isDrawerVisible = false;
  }

  /**
   * Adds a new subtask to the selectedTask's subtasks list.
   * @param title The title of the new subtask.
   */
  saveNewSubTask(title: string) {
    this.visibleDialogSub = false;
    this.newSubtasks.push({
      subtask_title: title,
    });
  }

  /**
   * Save changes made to the selected task in the current client.
   * Ensures the selected tags and subtasks are updated for the selected task.
   * If no tags are selected, uses the existing tag list from the task.
   * Concatenates any new subtasks to the existing subtasks of the task.
   * Updates the task in local storage and shows a confirmation message.
   * Refreshes the current page to reflect the changes.
   */
  saveChanges() {
    if (!this.selectedTags || this.selectedTags.length === 0) {
      this.selectedTags = this.selectedTask().taglist;
    }
    if (this.selectedTask().taglist) {
      this.selectedTask().taglist = this.selectedTags;
    }
    if (this.selectedTask().subtasks) {
      this.selectedTask().subtasks = this.selectedTask().subtasks.concat(
        this.newSubtasks
      );
    }

    this.saveItemsLocalStorage();
    this.child?.showConfirm('Changes saved');

    setTimeout(() => {
      this.methodsService.reloadPage();
    }, 1000);
  }
}
