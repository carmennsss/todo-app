/* IN PROGRESS */

import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { changeCurrentClient } from './client.actions';
import { Client } from '../../core/interfaces/clients/Client';
import { ClientDB } from '../../core/interfaces/clients/ClientDB';

export class ClientStateModel {
  items : ClientDB = {
    username: '',
  };
}

@State<ClientStateModel>({
  name: 'client',
  defaults: { items: { username: ''} }
})

@Injectable()
export class ClientState {

  @Selector()
  static getCurrentClient(state: ClientStateModel) {
    return state.items;
  }

  @Action(changeCurrentClient)
  setCurrentClient(ctx: StateContext<ClientStateModel>, action: changeCurrentClient) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      items: action.payload.currentUser,
    });
  }
}
