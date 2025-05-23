import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { SubTask } from '../../interfaces/tasks/SubTask';
import { SubtasksService } from '../../services/subtasks.service';
import { AddSubtasks, AddSubtaskToTask, GetSubtasks } from './subtask.actions';

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

  @Action(AddSubtasks)
  addSubtask(ctx: StateContext<SubtasksStateModel>, action: AddSubtasks) {
    for (const subtask of action.subtasks) {
      this.subtasksService.createSubtask(subtask).pipe(
        tap(() => {
          ctx.dispatch(new AddSubtaskToTask(subtask, action.taskId));
        })
      );
    }
  }

  @Action(AddSubtaskToTask)
  addSubtaskToTask(
    ctx: StateContext<SubtasksStateModel>,
    action: AddSubtaskToTask
  ) {
    return this.subtasksService
      .addSubtaskToTask(action.taskId, action.subtask)
      .pipe(
        tap(() => {
          ctx.dispatch(new GetSubtasks(action.taskId));
        })
      );
  }
}
