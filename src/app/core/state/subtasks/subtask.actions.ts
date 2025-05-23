import { SubTask } from '../../interfaces/tasks/SubTask';

export class GetSubtasks {
  static readonly type = '[Subtasks] Get';
  constructor(public taskId: number) {}
}

export class AddSubtasks {
  static readonly type = '[Subtasks] Add';
  constructor(public subtasks: SubTask[], public taskId: number) {}
}

export class AddSubtaskToTask {
  static readonly type = '[Subtasks] Add To Task';
  constructor(public subtask: SubTask, public taskId: number) {}
}
