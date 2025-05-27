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
  /**
   * Handles user login by calling the AuthService.
   * On successful login, it stores the token in localStorage and updates the state.
   * @param ctx - The state context to update the state.
   * @param action - The Login action containing username and password.
   * @return An observable that emits the login response.
   */
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
  /**
   * Handles user logout by calling the AuthService.
   * It clears the token from localStorage and updates the state to reflect the logged-out status.
   * @param ctx - The state context to update the state.
   */
  logout(ctx: StateContext<AuthStateModel>) {
    this.authService.logout();
    ctx.setState({
      token: null,
      loggedIn: false,
    });
  }

  @Action(Signup)
  /**
   * Handles user signup by calling the AuthService.
   * @param ctx - The state context to update the state.
   * @param action - The Signup action containing username and password.
   * @return An observable that emits the signup response.
   */
  signup(ctx: StateContext<AuthStateModel>, action: Signup) {
    return this.authService.signup(action.username, action.password);
  }
}
