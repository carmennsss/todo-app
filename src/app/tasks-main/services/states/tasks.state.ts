import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  CalendarTasksAction,
  StatusNameAction,
  StatusTasksAction,
} from './tasks.actions';
import { Task } from '../../../interfaces/tasks/Task';

export interface TasksStateModel {
  status_name: string;
  statusTasks: Task[];
  calendarTasks: Task[];
}

@State<TasksStateModel>({
  name: 'status',
  defaults: {
    status_name: '',
    statusTasks: [],
    calendarTasks: [],
  },
})
@Injectable()
export class TasksState {
  
  //---------------------------------------
  // SELECTORS
  //---------------------------------------

  @Selector()
  static getStatus(state: TasksStateModel) {
    return state.status_name;
  }

  @Selector()
  static getStatusTasks(state: TasksStateModel) {
    return state.statusTasks;
  }

  @Selector()
  static getCalendarTasks(state: TasksStateModel) {
    return state.calendarTasks;
  }

  //---------------------------------------
  // ACTIONS
  //---------------------------------------

  @Action(StatusNameAction)
  /**
   * Set the status name for the TasksStateModel
   * @param ctx StateContext of the TasksStateModel
   * @param action StatusNameAction with the new status name
   */
  setStatus(ctx: StateContext<TasksStateModel>, action: StatusNameAction) {
    debugger;
    const state = ctx.getState();
    ctx.setState({
      ...state,
      status_name: action.payload.status_name,
    });
  }

  @Action(StatusTasksAction)
  /**
   * Set the statusTasks for the TasksStateModel
   * @param ctx StateContext of the TasksStateModel
   * @param action StatusTasksAction with the new status tasks
   *
   * It filters the given tasks and only keeps the ones
   * that match the current status name.
   */
  setStatusTasks(
    ctx: StateContext<TasksStateModel>,
    action: StatusTasksAction
  ) {
    const state = ctx.getState();
    debugger;
    const filteredTasks = action.payload.statusTasks.filter(
      (task: Task) =>
        task.status === state.status_name.toLowerCase().replace(' ', '')
    );
    ctx.setState({
      ...state,
      statusTasks: filteredTasks,
    });
  }

  @Action(CalendarTasksAction)
  /**
   * Set the calendarTasks for the TasksStateModel
   * @param ctx StateContext of the TasksStateModel
   * @param action CalendarTasksAction with the new calendar tasks and the date to filter by
   *
   * It filters the given tasks and only keeps the ones
   * that match the given date.
   */
  setCalendarTasks(
    ctx: StateContext<TasksStateModel>,
    action: CalendarTasksAction
  ) {
    const state = ctx.getState();
    const filteredTasks = action.payload.calendarTasks.filter(
      (task: Task) =>
        task.date === action.payload.task_date.toLocaleString().split(',')[0]
    );
    ctx.setState({
      ...state,
      calendarTasks: filteredTasks,
    });
  }
}
