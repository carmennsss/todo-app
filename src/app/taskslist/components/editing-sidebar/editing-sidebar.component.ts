import {
  ChangeDetectionStrategy,
  Component,
  input,
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

@Component({
  selector: 'editing-sidebar',
  imports: [
    Dialog,
    DrawerModule,
    ButtonModule,
    MultiSelectModule,
    TagModule,
    CommonModule,
  ],
  templateUrl: './editing-sidebar.component.html',
  styleUrl: './editing-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditingSidebarComponent {
  selectedTask = input.required<Task>();
  visible = input.required<boolean>();
  visibleDialog: boolean = false;

  currentClient = JSON.parse(
    localStorage.getItem('currentClient') || '{}'
  ) as Client;

  titleAux = '';
  descAux = '';
  selectedTags: CustomTag[] = [];

  showDialog() {
    this.selectedTags = this.selectedTask().taglist;
    if (
      this.currentClient.tags.length != this.selectedTask().taglist.length &&
      this.currentClient.tags.length != 0
    ) {
      this.visibleDialog = true;
    }
  }

  selectTag(tag: any) {
    this.selectedTags.push(tag);
    if (this.currentClient.tags.length <= this.selectedTags.length) {
      this.visibleDialog = false;
    }
  }

  saveItemsLocalStorage() {
    for (let i = 0; i < this.currentClient.tasks.length; i++) {
      if (this.currentClient.tasks[i].id === this.selectedTask().id) {
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

    localStorage.setItem('model', JSON.stringify(model));
  }

  changeTitle(title: string) {
    this.titleAux = title;
  }

  changeDesc(desc: string) {
    this.descAux = desc;
  }

  saveChanges() {
    if (this.titleAux === '') {
      this.titleAux = this.selectedTask().title;
    }
    if (this.descAux === '') {
      this.descAux = this.selectedTask().desc;
    }
    if (this.selectedTags.length === 0) {
      this.selectedTags = this.selectedTask().taglist;
    }

    this.selectedTask().taglist = this.selectedTags;
    this.selectedTask().title = this.titleAux;
    this.selectedTask().desc = this.descAux;

    this.saveItemsLocalStorage();
    alert('Changes saved');
  }
}
