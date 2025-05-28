import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomTag } from '../../../../core/interfaces/tasks/CustomTag';
import { SubTask } from '../../../../core/interfaces/tasks/SubTask';
import { PopMessageComponent } from '../../../../shared/components/pop-message/pop-message.component';
import { MethodsService } from '../../../../shared/services/methods.service';
import { AddNewComponent } from '../add-new/add-new.component';
import { Client } from '../../../../core/interfaces/clients/Client';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { TagsService } from '../../../../core/services/tags.service';
import { Category } from '../../../../core/interfaces/tasks/Category';
import { CategoriesService } from '../../../../core/services/categories.service';
import { SubtasksService } from '../../../../core/services/subtasks.service';
import { PopConfirmMessageComponent } from '../../../../shared/components/pop-confirm-message/pop-confirm-message.component';
import { TasksService } from '../../../../core/services/tasks.service';
import { Store } from '@ngxs/store';
import {
  AddTagToTask,
  GetExcludedTags,
  GetTaskTags,
} from '../../../../core/state/tags/tags.actions';
import { TagsState } from '../../../../core/state/tags/tags.state';
import { CategoriesState } from '../../../../core/state/categories/categories.state';
import { EditTask } from '../../../../core/state/tasks/tasks.actions';
import { InputMask } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { GetSubtasks } from '../../../../core/state/subtasks/subtask.actions';
import { SubtasksState } from '../../../../core/state/subtasks/subtask.state';

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
    DatePickerModule,
    PopConfirmMessageComponent,
    InputMask,
  ],
  templateUrl: './editing-sidebar.component.html',
  styleUrl: './editing-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EditingSidebarComponent implements OnInit, OnChanges {
  methodsService = inject(MethodsService);
  tagsService = inject(TagsService);
  subtasksService = inject(SubtasksService);
  categoriesService = inject(CategoriesService);
  tasksService = inject(TasksService);

  @Input() selectedTask: TaskDB = {} as TaskDB;
  @Input() isDrawerVisible: boolean = false;
  visibleDialogTag: boolean = false;
  visibleDialogSub: boolean = false;

  @ViewChild(PopMessageComponent) child: PopMessageComponent | undefined;
  @ViewChild(PopConfirmMessageComponent) childConfirm:
    | PopConfirmMessageComponent
    | undefined;

  category_name = signal<string>('None');
  selectedSubtasks = signal<SubTask[]>([]);
  combineExcludedTags = signal<CustomTag[]>([]);
  selectedTags = signal<CustomTag[]>([]);
  combinedSubtasks = signal<SubTask[]>([]);
  combinedNewTags = signal<CustomTag[]>([]);
  selectedTaskCategories = signal<Category[]>({} as Category[]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTask']) {
      if (changes['selectedTask'].currentValue != undefined) {
        this.selectedTask = changes['selectedTask'].currentValue;

        this.getTagsFromTask();
        this.getSubtasksTask();
        this.getListToString();

        this.visibleDialogTag = false;
        this.visibleDialogSub = false;
      }
    }
  }
  ngOnInit(): void {
    this.getCategoriesClient();

    this.selectedTags.set([]);
    this.combineExcludedTags.set([]);
    this.combinedNewTags.set([]);
    this.combinedSubtasks.set([]);
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
    this.store.select(TagsState.tags).subscribe((tags) => {
      if (tags.length > this.selectedTags().length) {
        this.visibleDialogTag = true;
      } else {
        this.child?.showConfirm('You cannot add more tags');
      }
    });
  }

  /**
   * Gets the categories from the backend and
   * sets them to the selectedTaskCategories signal.
   */
  getCategoriesClient() {
    this.categoriesService.getCategoriesClient().subscribe((categories) => {
      this.selectedTaskCategories.set(categories);
    });
    /*
    this.store.select(CategoriesState.categories).subscribe((categories) => {
      this.selectedTaskCategories.set(categories);
    });
    */
  }

  /**
   * Gets the tags associated with the selectedTask.
   * It dispatches actions to get task tags and excluded tags,
   * and updates the combinedNewTags and combineExcludedTags signals accordingly.
   */
  getTagsFromTask() {
    this.store.dispatch(new GetTaskTags(this.selectedTask.id));
    this.store.select(TagsState.taskTags).subscribe((tags) => {
      this.combinedNewTags.set(tags);
    });

    this.store.dispatch(new GetExcludedTags(this.selectedTask.id));
    this.store
      .select(TagsState.excludedTags)
      .subscribe((tags) => this.combineExcludedTags.set(tags));
  }

  /**
   * Converts the selectedTask's list_id to a category name
   * and sets it to the category_name signal.
   * If the task has no list_id, it sets the category_name to 'None'.
   */
  getListToString() {
    if (this.selectedTask.list_id) {
      this.categoriesService
        .getCategoryName(this.selectedTask.list_id)
        .subscribe({
          next: (res) => {
            this.category_name.set(res.category_title);
          },
        });
    }
  }

  /**
   * Gets the subtasks associated with the selectedTask
   * and updates the selectedSubtasks and combinedSubtasks signals.
   * It uses the SubtasksService to fetch the subtasks from the backend.
   */
  getSubtasksTask() {
    this.subtasksService
      .getSubtasksFromTask(this.selectedTask.id)
      .subscribe((subtasks) => {
        this.selectedSubtasks.set(subtasks);
        this.combinedSubtasks.set(subtasks);
      });
    /*
    this.store.dispatch(new GetSubtasks(this.selectedTask.id));
    this.store.select(SubtasksState.subtasks).subscribe((subtasks) => {
      this.combinedSubtasks.set(subtasks);
    });
    */
  }

  /**
   * Retrieves the tags available for the client.
   * It uses the TagsService to fetch the tags from the backend.
   * @returns An array of CustomTag objects representing the tags available for the client.
   */
  getTagsClient() {
    var tagsSignal: CustomTag[] = [];
    this.tagsService.getTagsClient().subscribe((tags) => {
      tagsSignal = tags;
    });

    /*
    this.store.select(TagsState.tags).subscribe((tags) => {
      tagsSignal = tags;
    });
    */
    return tagsSignal;
  }

  /**
   * Gets a tag by its ID.
   * Adds the tag to the selectedTags signal,
   * removes it from the combineExcludedTags signal,
   * and adds it to the combinedNewTags signal.
   * This method is used to select a tag for the current task.
   * @param tag The tag to be added.
   */
  selectTag(tag: CustomTag) {
    this.selectedTags.update((tags) => [...tags, tag]);
    this.combineExcludedTags.update((tags) =>
      tags.filter((t) => t.tag_id !== tag.tag_id)
    );
    this.combinedNewTags.update((tags) => [...tags, tag]);
    /*
    this.store.select(TagsState.tags).subscribe((tags) => {
      if (tags.length <= this.selectedTags().length) {
        this.visibleDialogTag = false;
      }
    });
    */
  }

  /**
   * Changes the category of the selected task.
   * It updates the selectedTask's list_id to the new category ID.
   * This method is called when the user selects a new category from the dropdown.
   * @param category_id The ID of the category to change to.
   */
  changeCategory(category_id: string) {
    this.selectedTask.list_id = parseInt(category_id, 10);
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
    if (title.replaceAll(' ', '') == '') {
      this.child?.showConfirm('You cannot add an empty subtask');
      return;
    }
    let newSubtask: SubTask = {
      subtask_id: 0,
      subtask_title: title,
    };
    this.combinedSubtasks.update((subtasks) => [...subtasks, newSubtask]);
    this.selectedSubtasks.update((subtasks) => [...subtasks, newSubtask]);
    this.visibleDialogSub = false;
  }

  /**
   * Saves the changes made to the selected task.
   * It adds the selected tags to the task and creates new subtasks.
   * After saving, it dispatches actions to update the task in the store.
   * It also shows a confirmation message indicating that the changes have been saved.
   * If no tags or subtasks are selected, it simply updates the task in the store.
   */
  saveChanges() {
    const selectedTagsList = this.selectedTags();

    if (this.selectedTask.date != '' || this.selectedTask.date != null) {
      var date = this.selectedTask.date.split('T')[0];
      if (
        parseInt(date.split('-')[1]) > 12 ||
        parseInt(date.split('-')[2]) > 31
      ) {
        this.child?.showConfirm('Invalid date');
        return;
      }
    }

    if (selectedTagsList.length != 0) {
      for (const tag of selectedTagsList) {
        this.tagsService
          .addTagToTask(this.selectedTask.id, tag.tag_id)
          .subscribe();
      }
    }

    const selectedSubtasksList = this.selectedSubtasks();
    if (selectedSubtasksList.length != 0) {
      for (const subtask of selectedSubtasksList) {
        this.subtasksService
          .createSubtask(subtask, this.selectedTask.id)
          .subscribe();
      }
    }
    /*
    this.store.dispatch(new GetSubtasks(this.selectedTask.id));
    this.store.dispatch(new GetTaskTags(this.selectedTask.id));
    this.store.dispatch(new GetExcludedTags(this.selectedTask.id));
    */

    this.store.dispatch(new EditTask(this.selectedTask));
    this.childConfirm?.showConfirm('Changes saved');
  }
}
