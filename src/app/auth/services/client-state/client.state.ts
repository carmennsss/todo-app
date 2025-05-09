/* IN PROGRESS */

import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { changeCurrentClient } from './client.actions';
import { Client } from '../../../core/interfaces/clients/Client';



export class ClientStateModel {
  items : Client = {
    username: '',
    password: '',
    tasks: [],
    tags: [],
    categories: [],
  };
}

@State<ClientStateModel>({
  name: 'client',
  defaults: { items: { username: '', password: '', tasks: [], tags: [], categories: []} }
})

@Injectable()
export class ClientState {

  @Selector()
  static getCurrentClient(state: ClientStateModel) {
    return state.items;
  }

  @Action(changeCurrentClient)
  setCurrentClient(ctx: StateContext<ClientStateModel>, action: changeCurrentClient) {
    debugger;
    const state = ctx.getState();
    ctx.setState({
      ...state,
      items: action.payload.currentUser,
    });
  }
}
