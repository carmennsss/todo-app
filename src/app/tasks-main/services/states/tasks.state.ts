import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CalendarTasksAction, StatusNameAction, StatusTasksAction } from './tasks.actions';
import { Task } from '../../../interfaces/Task';

export interface TasksStateModel {
  status_name: string;
  statusTasks: Task[];
  calendarTasks: Task[];
}

@State<TasksStateModel>({
  name: 'status',
  defaults : {
    status_name: '',
    statusTasks: [],
    calendarTasks: []
  }
})
@Injectable()
export class TasksState {

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

  @Action(StatusNameAction)
  setStatus( ctx: StateContext<TasksStateModel>, action: StatusNameAction) {
    debugger;
    const state = ctx.getState();
    ctx.setState({
      ...state,
      status_name: action.payload.status_name,
    });
  }

  @Action(StatusTasksAction)
  setStatusTasks( ctx: StateContext<TasksStateModel>, action: StatusTasksAction) {
    const state = ctx.getState();
    debugger;
    const filteredTasks = action.payload.statusTasks.filter(
      (task : Task) => task.status === state.status_name.toLowerCase().replace(' ', '')
    )
    ctx.setState({
      ...state,
      statusTasks: filteredTasks,
    });
  }

  @Action(CalendarTasksAction)
  setCalendarTasks( ctx: StateContext<TasksStateModel>, action: CalendarTasksAction) {
    const state = ctx.getState();
    const filteredTasks = action.payload.calendarTasks.filter(
      (task : Task) => task.date === action.payload.task_date.toLocaleString().split(',')[0]
    )
    ctx.setState({
      ...state,
      calendarTasks: filteredTasks,
    });
  }
}
