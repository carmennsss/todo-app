/* PAUSED */

import { ClientDB } from "../../../interfaces/clients/ClientDB";

export class changeClient {
  static readonly type = '[Client] Change';
  constructor(public payload: { currentUser: ClientDB }) {}
}