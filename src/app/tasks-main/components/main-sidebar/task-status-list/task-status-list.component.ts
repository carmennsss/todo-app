import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { MethodsService } from '../../../../shared/services/methods.service';
import {
  StatusNameAction,
  StatusTasksAction,
} from '../../../states/status.actions';
import { TasksService } from '../../../../core/services/tasks.service';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { TasksStateHttp } from '../../../../core/state/tasks/tasks.state';
import { GetTasksByStatus } from '../../../../core/state/tasks/tasks.actions';

@Component({
  selector: 'sidebar-task-status-list',
  imports: [PanelMenu, ToastModule, ButtonModule],
  templateUrl: './task-status-list.component.html',
  styleUrl: './task-status-list.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusListComponent implements OnInit {
  localService = inject(LocalStorageService);
  methodsService = inject(MethodsService);
  tasksService = inject(TasksService);

  items: MenuItem[] = [];
  currentItems: TaskDB[] = [];
  // currentClient = signal<Client>();

  constructor(private router: Router, private store: Store) {}
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

  //---------------------------------------
  // METHODS
  //---------------------------------------

  goToPage(page: string) {
    debugger;
    let currentUrl = this.router.url;
    if (currentUrl.includes(page.toLowerCase().replace(' ', ''))) {
      return;
    }
    if (currentUrl.includes('status')) {
      this.store.dispatch(new StatusNameAction({ status_name: page }));
      this.methodsService.reloadPage();
    } else {
      this.router.navigate(['main', page.toLowerCase().replace(' ', '')]);
    }
  }

  getItemsStatusCount(label: string) {
    let tasks_length = 0;
    this.store.select(TasksStateHttp.allTasks).subscribe((tasks) => {
      tasks_length = tasks.filter(
        (task) => task.status === label.toLowerCase().replace(' ', '')
      ).length;
    });
    return tasks_length || 0;
  }
}
