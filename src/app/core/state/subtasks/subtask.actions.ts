import { SubTask } from '../../interfaces/tasks/SubTask';

export class GetSubtasks {
  static readonly type = '[Subtasks] Get';
  constructor(public taskId: number) {}
}

export class AddSubtask {
  static readonly type = '[Subtasks] Add';
  constructor(public subtask: SubTask, public taskId: number) {}
}
