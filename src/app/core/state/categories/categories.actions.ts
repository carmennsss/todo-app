import { Category } from "../../interfaces/tasks/Category";

export class GetCategories {
  static readonly type = '[Categories] Get';
}

export class AddCategory {
  static readonly type = '[Categories] Add';
  constructor(public category: Category) {}
}