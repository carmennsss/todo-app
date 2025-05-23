import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { TaskDB } from '../../interfaces/tasks/TaskDB';
import { TasksService } from '../../services/tasks.service';
import {
  GetTasksByStatus,
  CreateTask,
  DeleteTask,
  GetTasksCalendar,
  EditTask,
} from './tasks.actions';

export interface TasksStateModel {
  tasks: TaskDB[];
}

@State<TasksStateModel>({
  name: 'tasks',
  defaults: { tasks: [] },
})
@Injectable()
export class TasksStateHttp {
  constructor(private service: TasksService) {}

  @Selector()
  static tasks(state: TasksStateModel) {
    return state.tasks;
  }

  @Action(GetTasksByStatus)
  getByStatus(ctx: StateContext<TasksStateModel>, action: GetTasksByStatus) {
    return this.service
      .getTasksStatusClient(action.status)
      .pipe(tap((tasks) => ctx.patchState({ tasks })));
  }

  @Action(CreateTask)
  create(ctx: StateContext<TasksStateModel>, action: CreateTask) {
    console.log('create task', action.task);
    return this.service
      .createNewTask(action.task)
      .pipe(tap(() => ctx.dispatch(new GetTasksByStatus(action.task.status))));
  }

  @Action(DeleteTask)
  delete(ctx: StateContext<TasksStateModel>, action: DeleteTask) {
    return this.service
      .deleteTask(action.taskId)
      .pipe(tap(() => ctx.dispatch(new GetTasksByStatus('TODO'))));
  }

  @Action(GetTasksCalendar)
  getTasksCalendar(
    ctx: StateContext<TasksStateModel>,
    action: GetTasksCalendar
  ) {
    return this.service
      .getTasksDateClient(action.date)
      .pipe(tap((tasks) => ctx.patchState({ tasks })));
  }

  @Action(EditTask)
  edit(ctx: StateContext<TasksStateModel>, action: EditTask) {
    return this.service
      .editTask(action.task)
      .pipe(tap(() => ctx.dispatch(new GetTasksByStatus(action.task.status))));
  }
}
