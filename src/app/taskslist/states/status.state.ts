import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { StatusAction } from './status.actions';

export class StatusStateModel {
  public status_name!: string;
}

const defaults = {
  status_name: '',
};

@State<StatusStateModel>({
  name: 'status',
  defaults,
})
@Injectable()
export class StatusState {
  @Action(StatusAction)
  setStatus(
    { getState, setState }: StateContext<StatusStateModel>,
    { payload }: StatusAction
  ) {
    setState({ status_name: payload.status_name });
  }
}
