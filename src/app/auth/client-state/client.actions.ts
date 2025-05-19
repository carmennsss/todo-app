import { Client } from "../../core/interfaces/clients/Client";
import { ClientDB } from "../../core/interfaces/clients/ClientDB";

export class changeCurrentClient {
  static readonly type = '[Client] Change user';
  constructor(public payload: { currentUser: ClientDB }) {}
}