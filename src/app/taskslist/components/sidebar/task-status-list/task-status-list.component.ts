import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Client } from '../../../../interfaces/Client';
import { Task } from '../../../../interfaces/Task';

@Component({
  selector: 'sidebar-task-status-list',
  imports: [PanelMenu, ToastModule, ButtonModule],
  templateUrl: './task-status-list.component.html',
  styleUrl: './task-status-list.component.css',
})
export class TaskStatusListComponent implements OnInit {
  items: MenuItem[] = [];
  currentItems: Task[] = [];

  constructor(private router : Router) {}

  currentClient: Client = JSON.parse(
    localStorage.getItem('currentClient') || '{}'
  ) as Client;

  goToPage(page: string) {
    this.router.navigate(['/main/', page.toLowerCase().trim()]);
    this.items.forEach((item) => {
      if (item.label === page) {
        item.styleClass = 'active';
      } else {
        item.styleClass = '';
      }
    });
  }

  getItemsStatusCount(label: string) {
    this.currentItems = [];
    for (let i = 0; i < this.currentClient.tasks.length; i++) {
      if (this.currentClient.tasks[i].status.toLowerCase().replace(' ', '') === label) {
        this.currentItems.push(this.currentClient.tasks[i]);
      }
    }
    return this.currentItems.length;
  }



  ngOnInit() {
    this.items = [
      {
        label: 'Non Started',
        icon: 'pi pi-clock',
        badge: this.getItemsStatusCount('nonstarted').toString(),
        command: () => {
          this.goToPage('nonstarted');
        },
      },
      {
        label: 'In Progress',
        icon: 'pi pi-spinner',
        badge: this.getItemsStatusCount('inprogress').toString(),
        command: () => {
          this.goToPage('inprogress');
        },
      },
      {
        label: 'Paused',
        icon: 'pi pi-pause',
        badge: this.getItemsStatusCount('paused').toString(),
        command: () => {
          this.goToPage('paused');
        },
      },
      {
        label: 'Late',
        icon: 'pi pi-exclamation-triangle',
        badge: this.getItemsStatusCount('late').toString(),
        command: () => {
          this.goToPage('late');
        },
      },
      {
        label: 'Finished',
        icon: 'pi pi-check',
        badge: this.getItemsStatusCount('finished').toString(),
        command: () => {
          this.goToPage('finished');
        },
      },
    ];
  }
}
