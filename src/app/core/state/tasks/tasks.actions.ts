import { TaskDB } from "../../interfaces/tasks/TaskDB";

export class GetTasksByStatus {
  static readonly type = '[Tasks] Get By Status';
  constructor(public status: string) {}
}

export class CreateTask {
  static readonly type = '[Tasks] Create';
  constructor(public task: TaskDB) {}
}

export class DeleteTask {
  static readonly type = '[Tasks] Delete';
  constructor(public taskId: number) {}
}

export class GetTasksCalendar {
  static readonly type = '[Tasks] Get Calendar';
  constructor(public date: string) {}
}

export class EditTask {
  static readonly type = '[Tasks] Edit';
  constructor(public task: TaskDB) {}
}