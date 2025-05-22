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
import { PopConfirmMessageComponent } from '../../../../shared/components/pop-confirm-message/pop-confirm-message.component';
import { TasksService } from '../../../../core/services/tasks.service';

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
  ],
  templateUrl: './editing-sidebar.component.html',
  styleUrl: './editing-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EditingSidebarComponent implements OnInit, OnChanges {
  localService = inject(LocalStorageService);
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

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTask']) {
      if (changes['selectedTask'].currentValue != undefined) {
        this.selectedTask = changes['selectedTask'].currentValue;
        this.getTagsFromTask();
        this.getSubtasksTask();
        this.getListToString();
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
    this.tagsService.getTagsClient().subscribe((data) => {
      const tags_client: CustomTag[] = data.map((item: any) => ({
        tag_id: item.tag_id,
        tag_title: item.tag_name,
      }));

      if (tags_client.length > this.selectedTags().length) {
        this.visibleDialogTag = true;
      } else {
        this.child?.showConfirm('You cannot add more tags');
      }
    });
  }

  getCategoriesClient() {
    this.categoriesService.getCategoriesClient().subscribe((categories) => {
      this.selectedTaskCategories.set(categories);
    });
  }

  getTagsFromTask() {
    this.tagsService
      .getTagsTask(this.selectedTask.id)
      .subscribe((tagsFromTask) => {
        this.combinedNewTags.set(tagsFromTask);
      });

    this.tagsService
      .getTagsNotInTask(this.selectedTask.id)
      .subscribe((tagsExcluded) => {
        this.combineExcludedTags.set(tagsExcluded);
      });
  }

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

  getSubtasksTask() {
    this.subtasksService
      .getSubtasksFromTask(this.selectedTask.id)
      .subscribe((subtasks) => {
        this.combinedSubtasks.set(subtasks);
      });
  }

  getTagsClient() {
    var tagsSignal: CustomTag[] = [];

    this.tagsService.getTagsClient().subscribe((data) => {
      tagsSignal = data.map((item: any) => ({
        tag_id: item.tag_id,
        tag_title: item.tag_name,
      }));
    });
    return tagsSignal;
  }

  selectTag(tag: CustomTag) {
    this.selectedTags.update((tags) => [...tags, tag]);
    this.combineExcludedTags.update((tags) =>
      tags.filter((t) => t.tag_id !== tag.tag_id)
    );
    this.combinedNewTags.update((tags) => [...tags, tag]);

    this.tagsService.getTagsClient().subscribe((data) => {
      const tags_client: CustomTag[] = data.map((item: any) => ({
        tag_id: item.tag_id,
        tag_title: item.tag_name,
      }));

      if (tags_client.length <= this.selectedTags().length) {
        this.visibleDialogTag = false;
      }
    });
  }

  changeCategory(category_id: string) {
    this.selectedTask.list_id = parseInt(category_id, 10);
  }

  /**
   * Close the editing sidebar.
   */
  closeDrawer() {
    this.selectedTags.set([]);
    this.combineExcludedTags.set([]);
    this.combinedNewTags.set([]);
    this.combinedSubtasks.set([]);
    this.isDrawerVisible = false;
  }

  /**
   * Adds a new subtask to the selectedTask's subtasks list.
   * @param title The title of the new subtask.
   */
  saveNewSubTask(title: string) {
    let newSubtask: SubTask = {
      subtask_id: 0,
      subtask_title: title,
    };
    this.combinedSubtasks.update((subtasks) => [...subtasks, newSubtask]);
    this.selectedSubtasks.update((subtasks) => [...subtasks, newSubtask]);
    this.visibleDialogSub = false;
  }

  saveChanges() {
    const selectedTagsList = this.selectedTags();

    if (selectedTagsList.length != 0) {
      for (let i = 0; i < selectedTagsList.length; i++) {
        this.tagsService
          .addTagToTask(this.selectedTask.id, this.selectedTags()[i].tag_id)
          .subscribe(
            (res) => {
              console.log(res);
            },
            (error) => {
              console.log(error);
            }
          );
      }

      this.getTagsFromTask();
    }

    const selectedSubtasksList = this.selectedSubtasks();
    if (selectedSubtasksList.length != 0) {
      for (let i = 0; i < selectedSubtasksList.length; i++) {
        this.subtasksService.createSubtask(selectedSubtasksList[i]).subscribe(
          (res) => {
            this.subtasksService
              .addSubtaskToTask(this.selectedTask.id, res)
              .subscribe(
                (res) => {
                  console.log(res);
                },
                (error) => {
                  console.log(error);
                }
              );
          },
          (error) => {
            console.log(error);
          }
        );

        this.tasksService.editTask(this.selectedTask).subscribe(
          (res) => {
            console.log(res);
          },
          (error) => {
            console.log(error);
          }
        );

        this.childConfirm?.showConfirm('Changes saved');
      }
    }
  }
}
