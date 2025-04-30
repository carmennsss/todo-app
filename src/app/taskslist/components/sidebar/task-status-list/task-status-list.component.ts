import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar-task-status-list',
  imports: [PanelMenu, ToastModule, ButtonModule],
  templateUrl: './task-status-list.component.html',
  styleUrl: './task-status-list.component.css',
})
export class TaskStatusListComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router : Router) {}

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

  ngOnInit() {
    this.items = [
      {
        label: 'Non Started',
        icon: 'pi pi-clock',
        command: () => {
          this.goToPage('nonstarted');
        },
      },
      {
        label: 'In Progress',
        icon: 'pi pi-spinner',
        command: () => {
          this.goToPage('inprogress');
        },
      },
      {
        label: 'Paused',
        icon: 'pi pi-pause',
        command: () => {
          this.goToPage('paused');
        },
      },
      {
        label: 'Late',
        icon: 'pi pi-exclamation-triangle',
        command: () => {
          this.goToPage('late');
        },
      },
      {
        label: 'Finished',
        icon: 'pi pi-check',
        command: () => {
          this.goToPage('finished');
        },
      },
    ];
  }
}
