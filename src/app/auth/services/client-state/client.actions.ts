/* PAUSED */

import { Client } from "../../../core/interfaces/clients/Client";

export class changeCurrentClient {
  static readonly type = '[Client] Change user';
  constructor(public payload: { currentUser: Client }) {}
}