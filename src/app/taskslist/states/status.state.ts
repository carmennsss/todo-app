import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { StatusNameAction, StatusTasksAction } from './status.actions';
import { Task } from '../../interfaces/Task';

export interface StatusStateModel {
  status_name: string;
  statusTasks: Task[];
}

@State<StatusStateModel>({
  name: 'status',
  defaults : {
    status_name: '',
    statusTasks: [],
  }
})
@Injectable()
export class StatusState {

  @Selector()
  static getStatus(state: StatusStateModel) {
    return state.status_name;
  }

  @Selector()
  static getStatusTasks(state: StatusStateModel) {
    return state.statusTasks;
  }

  @Action(StatusNameAction)
  
  setStatus(
    { patchState }: StateContext<StatusStateModel>,
    { payload }: StatusNameAction) {
    patchState({ status_name: payload.status_name });
  }
 /*
  setStatus( ctx: StateContext<StatusStateModel>, action: StatusNameAction) {
    debugger;
    const state = ctx.getState();
    ctx.setState({
      ...state,
      status_name: action.payload.status_name,
    });
  }*/

  @Action(StatusTasksAction)
  /*
  setStatusTasks(
    { patchState }: StateContext<StatusStateModel>,
    { payload }: StatusTasksAction) {
      debugger;
      console.log(payload.statusTasks);
    patchState({ statusTasks: payload.statusTasks });
  }*/
  setStatusTasks( ctx: StateContext<StatusStateModel>, action: StatusTasksAction) {
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
}
