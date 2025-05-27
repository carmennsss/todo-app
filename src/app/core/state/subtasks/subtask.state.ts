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

  //---------------------------------------
  // SELECTORS
  //---------------------------------------

  @Selector()
  static subtasks(state: SubtasksStateModel): SubTask[] {
    return state.subtasks;
  }

  //---------------------------------------
  // ACTIONS
  //---------------------------------------

  @Action(GetSubtasks)
  /**
   * Retrieves the subtasks for a specific task.
   * It sends a GET request to the subtasks service and updates the state with the retrieved subtasks.
   * @param ctx StateContext of the SubtasksStateModel
   * @param action GetSubtasks with the task ID
   * @returns An Observable that emits the subtasks from the server.
   */
  getSubtasks(ctx: StateContext<SubtasksStateModel>, action: GetSubtasks) {
    return this.subtasksService.getSubtasksFromTask(action.taskId).pipe(
      tap((subtasks) => {
        ctx.patchState({ subtasks });
      })
    );
  }

  @Action(AddSubtask)
  /**
   * Adds a new subtask to a specific task.
   * It sends a POST request to the subtasks service with the subtask details and updates the state by fetching the updated list of subtasks.
   * @param ctx StateContext of the SubtasksStateModel
   * @param action AddSubtask with the subtask and task ID
   * @returns An Observable that emits the response from the server after adding the subtask.
   */
  addSubtask(ctx: StateContext<SubtasksStateModel>, action: AddSubtask) {
    return this.subtasksService.createSubtask(action.subtask, action.taskId).pipe(
      tap(() => {
        ctx.dispatch(new GetSubtasks(action.taskId));
      })
    );
  }
}
