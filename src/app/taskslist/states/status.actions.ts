export class StatusAction {
  static readonly type = '[Status] Get status';
  constructor(public payload: { status_name: string }) {}
}
