import { Task } from "../../core/interfaces/tasks/Task";


export class StatusNameAction {
  static readonly type = '[StatusName] Set status';
  constructor(public payload: { status_name: string }) {}
}

export class StatusTasksAction {
  static readonly type = '[StatusTasks] Set status tasks';
  constructor(public payload: { statusTasks: Task[] }) {}
}

export class CalendarTasksAction {
  static readonly type = '[CalendarTasks] Set calendar tasks';
  constructor(public payload: { calendarTasks: Task[]; task_date: Date }) {}
}
