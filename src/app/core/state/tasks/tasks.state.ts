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
  GetAllTasks,
} from './tasks.actions';

export interface TasksStateModel {
  tasks: TaskDB[];
  allTasks: TaskDB[];
}

@State<TasksStateModel>({
  name: 'tasks',
  defaults: { tasks: [], allTasks: [] },
})
@Injectable()
export class TasksStateHttp {
  constructor(private service: TasksService) {}

  //---------------------------------------
  // SELECTORS
  //---------------------------------------

  @Selector()
  static tasks(state: TasksStateModel) {
    return state.tasks;
  }
  @Selector()
  static allTasks(state: TasksStateModel) {
    return state.allTasks;
  }

  //---------------------------------------
  // ACTIONS
  //---------------------------------------

  @Action(GetTasksByStatus)
  /**
   * Retrieves tasks by their status.
   * It sends a GET request to the tasks service with the specified status and updates the state with the retrieved tasks.
   * @param ctx StateContext of the TasksStateModel
   * @param action GetTasksByStatus with the status to filter by
   * @returns An Observable that emits the tasks from the server.
   */
  getByStatus(ctx: StateContext<TasksStateModel>, action: GetTasksByStatus) {
    return this.service
      .getTasksStatusClient(action.status)
      .pipe(tap((tasks) => ctx.patchState({ tasks })));
  }

  
  @Action(GetAllTasks)
  /**
   * Retrieves all tasks for the current user.
   * It sends a GET request to the tasks endpoint and updates the state with the retrieved tasks.
   * @param ctx StateContext of the TasksStateModel
   * @returns An Observable that emits the tasks from the server.
   */
  getAll(ctx: StateContext<TasksStateModel>) {
    return this.service
      .getAllTasksClient()
      .pipe(tap((tasks) => ctx.patchState({ allTasks: tasks })));
  }

  @Action(CreateTask)
  /**
   * Creates a new task.
   * It sends a POST request to the tasks endpoint with the task details and updates the state by fetching the updated list of tasks.
   * @param ctx StateContext of the TasksStateModel
   * @param action CreateTask with the task details
   * @returns An Observable that emits the response from the server after creating the task.  
   */
  create(ctx: StateContext<TasksStateModel>, action: CreateTask) {
    console.log('create task', action.task);
    return this.service.createNewTask(action.task).pipe(
      tap(
        () => ctx.dispatch(new GetTasksByStatus(action.task.status)),
        () => ctx.dispatch(new GetAllTasks())
      )
    );
  }

  @Action(DeleteTask)
  /**
   * Deletes a task.
   * It sends a DELETE request to the tasks service with the task ID and updates the state by fetching the updated list of tasks.
   * @param ctx StateContext of the TasksStateModel
   * @param action DeleteTask with the task ID
   * @returns An Observable that emits the response from the server after deleting the task.
   */
  delete(ctx: StateContext<TasksStateModel>, action: DeleteTask) {
    return this.service
      .deleteTask(action.taskId)
      .pipe(tap(() => ctx.dispatch(new GetAllTasks())));
  }

  @Action(GetTasksCalendar)
  /**
   * Retrieves the tasks for a specific date.
   * It sends a GET request to the tasks service and updates the state with the retrieved tasks.
   * @param ctx StateContext of the TasksStateModel
   * @param action GetTasksCalendar with the date to filter by
   * @returns An Observable that emits the tasks from the server.
   */
  getTasksCalendar(
    ctx: StateContext<TasksStateModel>,
    action: GetTasksCalendar
  ) {
    return this.service
      .getTasksDateClient(action.date)
      .pipe(tap((tasks) => ctx.patchState({ tasks })));
  }

  @Action(EditTask)
  /**
   * Edits an existing task.
   * It sends a PUT request to the tasks endpoint with the updated task details and updates the state with the new task.
   * @param ctx StateContext of the TasksStateModel
   * @param action EditTask with the updated task details
   * @return An Observable that emits the response from the server after editing the task.
   */
  edit(ctx: StateContext<TasksStateModel>, action: EditTask) {
    return this.service
      .editTask(action.task)
      .pipe(tap(() => ctx.dispatch(new GetTasksByStatus(action.task.status))));
  }
}