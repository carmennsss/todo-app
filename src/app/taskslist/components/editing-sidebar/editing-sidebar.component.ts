import {
  ChangeDetectionStrategy,
  Component,
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
import { AddNewComponent } from "../add-new/add-new.component";
import { SubTask } from '../../../interfaces/SubTask';

@Component({
  selector: 'editing-sidebar',
  imports: [
    Dialog,
    DrawerModule,
    ButtonModule,
    MultiSelectModule,
    TagModule,
    CommonModule,
    AddNewComponent
],
  templateUrl: './editing-sidebar.component.html',
  styleUrl: './editing-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditingSidebarComponent {
  selectedTask = input.required<Task>();
  visibleDialogTag: boolean = false;
  visibleDialogSub: boolean = false;

  currentClient = JSON.parse(
    localStorage.getItem('currentClient') || '{}'
  ) as Client;

  newSubtasks: SubTask[] = [];
  selectedTags: CustomTag[] = [];

  constructor() {}

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
    for (let i = 0; i < this.currentClient.tasks.length; i++) {
      console.log(this.currentClient.tasks[i].id);
      console.log(this.selectedTask().id);
      if (this.currentClient.tasks[i].id === this.selectedTask().id) {
        console.log(this.selectedTask());
        this.currentClient.tasks[i] = this.selectedTask();
      }
    }

    localStorage.setItem('currentClient', JSON.stringify(this.currentClient));

    let model = JSON.parse(localStorage.getItem('model') || '{}') as Model;

    for (let i = 0; i < model.clients.length; i++) {
      if (model.clients[i].username === this.currentClient.username) {
        model.clients[i].tasks = this.currentClient.tasks;
      }
    }

    this.newSubtasks = [];
    localStorage.setItem('model', JSON.stringify(model));
  }

  changeCategory(category: string) {
    for (let i = 0; i < this.currentClient.categories.length; i++) {
      if (this.currentClient.categories[i].category_title === category) {
        this.selectedTask().list = this.currentClient.categories[i];
      }
    }
  }

  saveNewSubTask(title: string) {
    this.visibleDialogSub = false;
    this.newSubtasks.push({
      subtask_title : title,
    });
  }

  saveChanges() {
    if (this.selectedTags.length === 0) {
      this.selectedTags = this.selectedTask().taglist;
    }
    this.selectedTask().taglist = this.selectedTags;
    this.selectedTask().subtasks = this.selectedTask().subtasks.concat(this.newSubtasks);

    this.saveItemsLocalStorage();

    alert('Changes saved');
  }
}
