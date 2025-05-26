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

  @Action(GetTagsClient)
  get(ctx: StateContext<TagsStateModel>) {
    return this.service
      .getTagsClient()
      .pipe(tap((tags) => ctx.patchState({ tags })));
  }

  @Action(AddTag)
  add(ctx: StateContext<TagsStateModel>, action: AddTag) {
    return this.service.addTag(action.tagTitle).pipe(
      tap(
        () => console.log('Tag added'),
        (error) => console.error('Error adding tag:', error)
      )
    );
  }

  @Action(GetTaskTags)
  getTaskTags(ctx: StateContext<TagsStateModel>, action: GetTaskTags) {
    return this.service
      .getTagsTask(action.taskId)
      .pipe(tap((tags) => ctx.patchState({ taskTags: tags })));
  }

  @Action(GetExcludedTags)
  getExcludedTags(ctx: StateContext<TagsStateModel>, action: GetExcludedTags) {
    return this.service
      .getTagsNotInTask(action.taskId)
      .pipe(tap((tags) => ctx.patchState({ excludedTags: tags })));
  }

  @Action(AddTagToTask)
  addTagToTask(ctx: StateContext<TagsStateModel>, action: AddTagToTask) {
    return this.service.addTagToTask(action.taskId, action.tagId).pipe(
      tap(() => {
        ctx.dispatch(new GetTaskTags(action.taskId));
        ctx.dispatch(new GetExcludedTags(action.taskId));
      })
    );
  }
}
