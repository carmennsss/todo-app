import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { SubTask } from '../../interfaces/tasks/SubTask';
import { SubtasksService } from '../../services/subtasks.service';
import { AddSubtask, GetSubtasks } from './subtask.actions';

export interface SubtasksStateModel {
  subtasks: SubTask[];
}

@State<SubtasksStateModel>({
  name: 'subtasks',
  defaults: {
    subtasks: [],
  },
})
@Injectable()
export class SubtasksState {
  constructor(private subtasksService: SubtasksService) {}

  @Selector()
  static subtasks(state: SubtasksStateModel): SubTask[] {
    return state.subtasks;
  }

  @Action(GetSubtasks)
  getSubtasks(ctx: StateContext<SubtasksStateModel>, action: GetSubtasks) {
    return this.subtasksService.getSubtasksFromTask(action.taskId).pipe(
      tap((subtasks) => {
        ctx.patchState({ subtasks });
      })
    );
  }

  @Action(AddSubtask)
  addSubtask(ctx: StateContext<SubtasksStateModel>, action: AddSubtask) {
    return this.subtasksService.createSubtask(action.subtask, action.taskId).pipe(
      tap(() => {
        ctx.dispatch(new GetSubtasks(action.taskId));
      })
    );
  }
}
