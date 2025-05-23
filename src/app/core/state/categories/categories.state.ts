import { Injectable } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { Category } from "../../interfaces/tasks/Category";
import { CategoriesService } from "../../services/categories.service";
import { GetCategories, AddCategory } from "./categories.actions";

export interface CategoriesStateModel {
  categories: Category[];
}

@State<CategoriesStateModel>({
  name: 'categories',
  defaults: { categories: [] },
})
@Injectable()
export class CategoriesState {
  constructor(private service: CategoriesService) {}

  @Selector()
  static categories(state: CategoriesStateModel) {
    return state.categories;
  }

  @Action(GetCategories)
  get(ctx: StateContext<CategoriesStateModel>) {
    return this.service.getCategoriesClient().pipe(
      tap((categories) => ctx.patchState({ categories }))
    );
  }

  @Action(AddCategory)
  add(ctx: StateContext<CategoriesStateModel>, action: AddCategory) {
    return this.service.addCategory(action.category).pipe(
      tap(() => ctx.dispatch(new GetCategories()))
    );
  }
}