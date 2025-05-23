import { Injectable } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { StatusNameAction } from "./status.actions";


export interface StatusStateModel {
  status_name: string;
}

@State<StatusStateModel>({
  name: 'status',
  defaults: {
    status_name: '',
  },
})
@Injectable()
export class StatusState {
  
  //---------------------------------------
  // SELECTORS
  //---------------------------------------

  @Selector()
  static getStatus(state: StatusStateModel) {
    return state.status_name;
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
  setStatus(ctx: StateContext<StatusStateModel>, action: StatusNameAction) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      status_name: action.payload.status_name,
    });
  }
}
