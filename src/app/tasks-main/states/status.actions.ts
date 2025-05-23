import { TaskDB } from "../../core/interfaces/tasks/TaskDB";

export class StatusNameAction {
  static readonly type = '[StatusName] Set status';
  constructor(public payload: { status_name: string }) {}
}

export class StatusTasksAction {
  static readonly type = '[StatusTasks] Set status tasks';
  constructor(public payload: { statusTasks: TaskDB[] }) {}
}

export class CalendarTasksAction {
  static readonly type = '[CalendarTasks] Set calendar tasks';
  constructor(public payload: { calendarTasks: TaskDB[]; task_date: Date }) {}
}
