import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { CustomTag } from '../../interfaces/tasks/CustomTag';
import { TagsService } from '../../services/tags.service';
import {
  GetTagsClient,
  AddTag,
  GetTaskTags,
  GetExcludedTags,
  AddTagToTask,
} from './tags.actions';

export interface TagsStateModel {
  tags: CustomTag[];
  taskTags: CustomTag[];
  excludedTags: CustomTag[];
}

@State<TagsStateModel>({
  name: 'tags',
  defaults: { tags: [], taskTags: [], excludedTags: [] },
})
@Injectable()
export class TagsState {
  constructor(private service: TagsService) {}

  //---------------------------------------
  // SELECTORS
  //---------------------------------------

  @Selector()
  static tags(state: TagsStateModel) {
    return state.tags;
  }
  @Selector()
  static excludedTags(state: TagsStateModel) {
    return state.excludedTags;
  }
  @Selector()
  static taskTags(state: TagsStateModel) {
    return state.taskTags;
  }

  //---------------------------------------
  // ACTIONS
  //---------------------------------------

  @Action(GetTagsClient)
  /**
   * Retrieves the tags for the current user.
   * It sends a GET request to the tags endpoint and updates the state with the retrieved tags.
   * @param ctx StateContext of the TagsStateModel
   * @returns An Observable that emits the tags from the server.
   */
  get(ctx: StateContext<TagsStateModel>) {
    return this.service
      .getTagsClient()
      .pipe(tap((tags) => ctx.patchState({ tags })));
  }

  @Action(AddTag)
  /**
   * Adds a new tag for the current user.
   * It sends a POST request to the tags endpoint with the tag details and updates the state with the new tag.
   * @param ctx StateContext of the TagsStateModel
   * @param action AddTag with the new tag details
   * @returns An Observable that emits the response from the server after adding a new tag.
   */
  add(ctx: StateContext<TagsStateModel>, action: AddTag) {
    return this.service.addTag(action.tagTitle).pipe(
      tap(
        () => console.log('Tag added'),
        (error) => console.error('Error adding tag:', error)
      )
    );
  }

  @Action(GetTaskTags)
  /**
   * Retrieves the tags associated with a specific task.
   * It sends a GET request to the tasks-tag endpoint with the 'task/included-tags' path and the task ID as a parameter
   * @param ctx StateContext of the TagsStateModel
   * @param action GetTaskTags with the task ID
   * @returns An Observable that emits the tags from the server.
   */
  getTaskTags(ctx: StateContext<TagsStateModel>, action: GetTaskTags) {
    return this.service
      .getTagsTask(action.taskId)
      .pipe(tap((tags) => ctx.patchState({ taskTags: tags })));
  }

  @Action(GetExcludedTags)
  /**
   * Retrieves the tags that are not associated with a specific task.
   * It sends a GET request to the tasks-tag endpoint with the 'task/excluded-tags' path and the task ID as a parameter
   * @param ctx StateContext of the TagsStateModel
   * @param action GetExcludedTags with the task ID
   * @returns An Observable that emits the tags from the server.
   */
  getExcludedTags(ctx: StateContext<TagsStateModel>, action: GetExcludedTags) {
    return this.service
      .getTagsNotInTask(action.taskId)
      .pipe(tap((tags) => ctx.patchState({ excludedTags: tags })));
  }

  @Action(AddTagToTask)
  addTagToTask(ctx: StateContext<TagsStateModel>, action: AddTagToTask) {
    /**
     * Adds a tag to a specific task.
     * It sends a POST request to the tasks-tag endpoint with the task ID and tag ID,
     * and updates the state by fetching the updated task tags and excluded tags.
     * @param ctx StateContext of the TagsStateModel
     * @param action AddTagToTask with the task ID and tag ID
     * @returns An Observable that emits the response from the server after adding the tag to the task.
     */
    return this.service.addTagToTask(action.taskId, action.tagId).pipe(
      tap(() => {
        ctx.dispatch(new GetTaskTags(action.taskId));
        ctx.dispatch(new GetExcludedTags(action.taskId));
      })
    );
  }
}
