import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MethodsService } from '../../../../shared/services/methods.service';
import { StatusNameAction } from '../../../states/status.actions';
import { TasksService } from '../../../../core/services/tasks.service';
import { TaskDB } from '../../../../core/interfaces/tasks/TaskDB';
import { TasksStateHttp } from '../../../../core/state/tasks/tasks.state';

@Component({
  selector: 'sidebar-task-status-list',
  imports: [PanelMenu, ToastModule, ButtonModule],
  templateUrl: './task-status-list.component.html',
  styleUrl: './task-status-list.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusListComponent implements OnInit {
  methodsService = inject(MethodsService);
  tasksService = inject(TasksService);

  items: MenuItem[] = [];
  currentItems: TaskDB[] = [];

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

  /**
   * Goes to a specified page and updates the store with the current status and tasks.
   * If the current URL already includes the specified page,
   * it does nothing to avoid unnecessary navigation.
   * @param page
   * @returns void
   */
  goToPage(page: string) {
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

  /**
   * Retrieves the count of tasks with a specific status.
   * This method subscribes to the tasks in the store and filters them based on the provided status label.
   * It returns the count of tasks that match the status label.
   * If no tasks are found, it returns 0.
   * @param label
   * @returns number of tasks with the specified status
   */
  getItemsStatusCount(label: string) {
    let tasks_length = 0;
    this.store.select(TasksStateHttp.allTasks).subscribe((tasks) => {
      tasks_length = tasks.filter(
        (task) =>
          task.status.toLowerCase().replaceAll(' ', '') ===
          label.toLowerCase().replaceAll(' ', '')
      ).length;
    });
    return tasks_length || 0;
  }
}