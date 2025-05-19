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
import { Client } from '../../../../core/interfaces/clients/Client';
import { Task } from '../../../../core/interfaces/tasks/Task';
import { Store } from '@ngxs/store';
import { ClientState } from '../../../../auth/client-state/client.state';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { MethodsService } from '../../../../shared/services/methods.service';
import { StatusNameAction, StatusTasksAction } from '../../../states/tasks.actions';


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

  items: MenuItem[] = [];
  currentItems: Task[] = [];
  currentClient: Client = {
    username: '',
    password: '',
    tasks: [],
    tags: [],
    categories: [],
  };
  // currentClient = signal<Client>();

  constructor(private router: Router, private store: Store) {}
  ngOnInit() {
    this.currentClient = this.localService.getCurrentClient();
    // this.currentClient = this.store.selectSignal(ClientState.getCurrentClient);

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

  /**
   * Navigates to a specified status page and updates the store with the current status and tasks.
   *
   * @param page - The name of the status page to navigate to. This also updates the store
   * with the corresponding status name.
   *
   * Dispatches two actions to the store:
   * 1. StatusNameAction to update the current status name.
   * 2. StatusTasksAction to update the current tasks.
   *
   * After dispatching the actions, it reloads the current page.
   */
  goToPage(page: string) {
    debugger;
    let currentUrl = this.router.url;
    if (currentUrl.includes(page.toLowerCase().replace(' ', ''))) {
      return;
    }
    if (currentUrl.includes('status')) {
      this.store.dispatch(new StatusNameAction({ status_name: page }));
      this.store.dispatch(
        new StatusTasksAction({ statusTasks: this.currentClient.tasks })
      );
      this.methodsService.reloadPage();
    } else {
      this.router.navigate(['main', page.toLowerCase().replace(' ', '')]);
    }
  }

  /**
   * Returns the number of tasks in the current client that have a given status.
   *
   * @param label - The status of the tasks to count.
   * @returns The number of tasks with the given status.
   */
  getItemsStatusCount(label: string) {
    const currentClient = this.localService.getCurrentClient();
    return currentClient.tasks.filter((task) => task.status === label)
      .length;
  }
}
