

export class GetTagsClient {
  static readonly type = '[Tags] Get';
}

export class AddTag {
  static readonly type = '[Tags] Add';
  constructor(public tagTitle: string) {}
}

export class GetTaskTags{
  static readonly type = '[TagsTask] Get';
  constructor(public taskId: number) {}
}

export class GetExcludedTags{
  static readonly type = '[TagsTask] GetExcluded';
  constructor(public taskId: number) {}
}

export class AddTagToTask{
  static readonly type = '[TagsTask] Add';
  constructor(public taskId: number, public tagId: number) {}
}