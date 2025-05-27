import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Login, Logout, Signup } from './user.actions';

export interface AuthStateModel {
  token: string | null;
  loggedIn: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: localStorage.getItem('token'),
    loggedIn: !!localStorage.getItem('token'),
  },
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  //---------------------------------------
  // SELECTORS
  //---------------------------------------
  
  @Selector()
  static isLoggedIn(state: AuthStateModel): boolean {
    return state.loggedIn;
  }

  @Selector()
  static getToken(state: AuthStateModel): string | null {
    return state.token;
  }

  //---------------------------------------
  // ACTIONS
  //---------------------------------------

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.username, action.password).pipe(
      tap((res) => {
        const token = res.token;
        localStorage.setItem('token', token);
        ctx.patchState({
          token,
          loggedIn: true,
        });
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    this.authService.logout(); // maneja router internamente
    ctx.setState({
      token: null,
      loggedIn: false,
    });
  }

  @Action(Signup)
  signup(ctx: StateContext<AuthStateModel>, action: Signup) {
    return this.authService.signup(action.username, action.password);
  }
}
