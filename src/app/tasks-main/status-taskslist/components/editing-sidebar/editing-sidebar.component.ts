import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomTag } from '../../../../core/interfaces/tasks/CustomTag';
import { SubTask } from '../../../../core/interfaces/tasks/SubTask';
import { Task } from '../../../../core/interfaces/tasks/Task';
import { PopMessageComponent } from '../../../../shared/components/pop-message/pop-message.component';
import { MethodsService } from '../../../../shared/services/methods.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { AddNewComponent } from '../add-new/add-new.component';
import { Client } from '../../../../core/interfaces/clients/Client';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { TagsService } from '../../../../core/services/tags.service';
import { Category } from '../../../../core/interfaces/tasks/Category';
import { CategoriesService } from '../../../../core/services/categories.service';
import { SubtasksService } from '../../../../core/services/subtasks.service';

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
    DialogModule,
  ],
  templateUrl: './editing-sidebar.component.html',
  styleUrl: './editing-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EditingSidebarComponent {
  localService = inject(LocalStorageService);
  methodsService = inject(MethodsService);
  tagsService = inject(TagsService);
  subtasksService = inject(SubtasksService);
  categoriesService = inject(CategoriesService);

  selectedTask = input.required<TaskDB>();
  @Input() isDrawerVisible: boolean = false;
  visibleDialogTag: boolean = false;
  visibleDialogSub: boolean = false;

  @ViewChild(PopMessageComponent) child: PopMessageComponent | undefined;

  newSubtasks = signal<SubTask[]>([]);
  selectedSubtasks = signal<SubTask[]>([]);
  excludedTags = signal<CustomTag[]>([]);
  selectedTags = signal<CustomTag[]>([]);
  selectedTaskCategories = signal<Category[]>({} as Category[]);

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.getCategoriesClient();
    this.getTagsClient();
    this.getSubtasksTask();
  }

  //---------------------------------------
  // METHODS
  //---------------------------------------

  /**
   * Show the dialog for selecting tags.
   * If the selectedTask's taglist already contains all the tags from the currentClient,
   * show a confirmation message saying that you cannot add more tags.
   */
  showDialogTag() {
    var tags_client = this.getTagsClient();
    this.tagsService.getTagsTask(this.selectedTask().id).subscribe((tags) => {
      this.selectedTags.update((tags_task) => (tags_task = tags));
    });

    this.tagsService
      .getTagsNotInTask(this.selectedTask().id)
      .subscribe((tags) => {
        this.excludedTags.update((tags_task) => (tags_task = tags));
      });

    if (
      tags_client.length != this.selectedTags.length &&
      tags_client.length != 0
    ) {
      this.visibleDialogTag = true;
    } else {
      this.child?.showConfirm('You cannot add more tags');
    }
  }

  getCategoriesClient() {
    this.categoriesService.getCategoriesClient().subscribe((categories) => {
      this.selectedTaskCategories.update(
        (categories) => (categories = categories)
      );
    });
  }

  getListToString() {
    if (this.selectedTask().list_id) {
      this.categoriesService
        .getCategoryName(this.selectedTask().list_id)
        .subscribe({
          next: (res) => {
            return res.category_title;
          },
        });
    }
    return 'None';
  }

  getSubtasksTask() {
    this.subtasksService
      .getSubtasksFromTask(this.selectedTask().id)
      .subscribe((subtasks) => {
        this.selectedSubtasks.update(
          (subtasks_task) => (subtasks_task = subtasks)
        );
      });
  }

  getTagsClient() {
    var tags_client = signal<CustomTag[]>([]);
    this.tagsService.getTagsClient().subscribe((tags) => {
      tags_client.update((tags) => (tags = tags));
    });
    return tags_client;
  }

  selectTag(tag: CustomTag) {
    var tags_client = this.getTagsClient();
    this.selectedTags.update((tags) => [...tags, tag]);

    this.tagsService
      .getTagsNotInTask(this.selectedTask().id)
      .subscribe((tags) => {
        this.excludedTags.update((tags_task) => (tags_task = tags));
      });

    if (tags_client.length <= this.selectedTags.length) {
      this.visibleDialogTag = false;
    }
  }

  changeCategory(category_id: string) {
    this.selectedTask().list_id = parseInt(category_id, 10);
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
    /*
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
  }*/
    console.log(this.selectedTask());
  }
}
