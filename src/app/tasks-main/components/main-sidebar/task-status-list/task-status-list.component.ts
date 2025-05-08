import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Client } from '../../../../interfaces/Client';
import { Task } from '../../../../interfaces/Task';
import { Store } from '@ngxs/store';
import { StatusNameAction, StatusTasksAction } from '../../../services/states/tasks.actions';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';


@Component({
  selector: 'sidebar-task-status-list',
  imports: [PanelMenu, ToastModule, ButtonModule],
  templateUrl: './task-status-list.component.html',
  styleUrl: './task-status-list.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskStatusListComponent implements OnInit {
  localService = inject(LocalStorageService);
  items: MenuItem[] = [];
  currentItems: Task[] = [];
  currentClient: Client = this.localService.getCurrentClient();

  constructor(private router : Router, private store: Store) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Non Started',
        icon: 'pi pi-clock',
        badge: this.getItemsStatusCount('nonstarted').toString(),
        command: () => {
          this.goToPage('Non Started');
        },
      },
      {
        label: 'In Progress',
        icon: 'pi pi-spinner',
        badge: this.getItemsStatusCount('inprogress').toString(),
        command: () => {
          this.goToPage('In Progress');
        },
      },
      {
        label: 'Paused',
        icon: 'pi pi-pause',
        badge: this.getItemsStatusCount('paused').toString(),
        command: () => {
          this.goToPage('Paused');
        },
      },
      {
        label: 'Late',
        icon: 'pi pi-exclamation-triangle',
        badge: this.getItemsStatusCount('late').toString(),
        command: () => {
          this.goToPage('Late');
        },
      },
      {
        label: 'Finished',
        icon: 'pi pi-check',
        badge: this.getItemsStatusCount('finished').toString(),
        command: () => {
          this.goToPage('Finished');
        },
      },
    ];
  }
  
  goToPage(page: string) {
    this.store.dispatch(new StatusNameAction({ status_name: page }));
    this.store.dispatch(new StatusTasksAction({ statusTasks: this.currentClient.tasks }));

    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/main/status');
    });
  }

  getItemsStatusCount(label: string) {
    return this.currentClient.tasks.filter((task) => task.status === label).length;
  }
}
