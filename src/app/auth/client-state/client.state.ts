/* Estado para saber que cliente esta logueado y poder trabajar con ello */
/* EN INVESTIGACION */

import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { changeClient } from './client.actions';
import { ClientDB } from '../../interfaces/ClientDB';

export class ClientStateModel {
  items: ClientDB = {
    username: '',
    password: '',
    client_name: '',
  };
}

@State<ClientStateModel>({
  name: 'client',
  defaults: { items: { username: '', password: '', client_name: '' } }
})

@Injectable()
export class ClientState {
  @Selector()
  static getClient(state: ClientStateModel) {
    return state.items;
  }
  @Action(changeClient)
  setClient(ctx: StateContext<ClientStateModel>, action: changeClient) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      items: action.payload.currentUser,
    });
  }
}
