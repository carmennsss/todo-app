import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngxs/store';
import { LocalStorageService } from '../services/local-storage.service';
import { pipe, switchMap, tap } from 'rxjs';
import { Task } from '../../interfaces/Task';

const initialState: { statusTasks: Task[]} = {
  statusTasks: [],
};

export const StatusStore = signalStore(
    { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      localService: LocalStorageService = inject(LocalStorageService)
    ) => ({
      loadStatusTasks: (statusName: string) => {
        debugger;
        const currentClient = localService.getCurrentClient();
        statusName = statusName.toLowerCase().replace(' ', '');
        const filteredTasks = currentClient.tasks.filter(
          (task : Task) => task.status === statusName
        );
        patchState(store, { statusTasks: filteredTasks });
      },
    })
  )
);
