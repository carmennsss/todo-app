import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  InputSignal,
  signal,
  ViewChild,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { Task } from '../../../interfaces/Task';
import { Client } from '../../../interfaces/Client';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { CustomTag } from '../../../interfaces/CustomTag';
import { Model } from '../../../interfaces/Model';
import { Category } from '../../../interfaces/Category';
import { AddNewComponent } from '../add-new/add-new.component';
import { SubTask } from '../../../interfaces/SubTask';
import { LocalStorageService } from '../../services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'editing-sidebar',
  imports: [
    Dialog,
    DrawerModule,
    ButtonModule,
    MultiSelectModule,
    TagModule,
    CommonModule,
    AddNewComponent,
  ],
  templateUrl: './editing-sidebar.component.html',
  styleUrl: './editing-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EditingSidebarComponent {
  localService = inject(LocalStorageService);

  selectedTask = input.required<Task>();
  @Input() isDrawerVisible: boolean = false;
  visibleDialogTag: boolean = false;
  visibleDialogSub: boolean = false;

  currentClient = this.localService.getCurrentClient();

  newSubtasks: SubTask[] = [];
  selectedTags: CustomTag[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}
  showDialogTag() {
    this.selectedTags = this.selectedTask().taglist;
    if (
      this.currentClient.tags.length != this.selectedTask().taglist.length &&
      this.currentClient.tags.length != 0
    ) {
      this.visibleDialogTag = true;
    }
  }

  selectTag(tag: any) {
    this.selectedTags.push(tag);
    if (this.currentClient.tags.length <= this.selectedTags.length) {
      this.visibleDialogTag = false;
    }
  }

  saveItemsLocalStorage() {
    this.localService.saveTaskToCurrentClient(this.selectedTask());
    this.localService.saveCurrentClientTasksToModel(this.currentClient);
    this.newSubtasks = [];
  }

  changeCategory(category: string) {
    for (let i = 0; i < this.currentClient.categories.length; i++) {
      if (this.currentClient.categories[i].category_title === category) {
        this.selectedTask().list = this.currentClient.categories[i];
      }
    }
  }

  closeDrawer() {
    this.isDrawerVisible = false;
  }

  saveNewSubTask(title: string) {
    this.visibleDialogSub = false;
    this.newSubtasks.push({
      subtask_title: title,
    });
  }

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
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });

    alert('Changes saved');
  }
}
