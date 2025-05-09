/* PAUSED */

import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { changeClient } from './client.actions';
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
