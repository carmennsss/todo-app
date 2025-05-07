/* Estado para saber que cliente esta logueado y poder trabajar con ello */
/* EN INVESTIGACION / PAUSADO */

import { ClientDB } from "../../../interfaces/ClientDB";

export class changeClient {
  static readonly type = '[Client] Change';
  constructor(public payload: { currentUser: ClientDB }) {}
}