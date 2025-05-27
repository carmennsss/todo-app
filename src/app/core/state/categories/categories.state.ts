import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { Category } from '../../interfaces/tasks/Category';
import { CategoriesService } from '../../services/categories.service';
import { GetCategories, AddCategory } from './categories.actions';

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

  //---------------------------------------
  // SELECTORS
  //---------------------------------------

  @Selector()
  static categories(state: CategoriesStateModel) {
    return state.categories;
  }

  //---------------------------------------
  // ACTIONS
  //---------------------------------------

  @Action(GetCategories)
  /**
   * Retrieves the categories for the current user.
   * It sends a GET request to the categories endpoint and updates the state with the retrieved categories.
   * @param ctx StateContext of the CategoriesStateModel
   * @returns An Observable that emits the categories from the server.
   */
  get(ctx: StateContext<CategoriesStateModel>) {
    return this.service
      .getCategoriesClient()
      .pipe(tap((categories) => ctx.patchState({ categories })));
  }

  @Action(AddCategory)
  /**
   * Adds a new category for the current user.
   * It sends a POST request to the categories endpoint with the category details and updates the state with the new category.
   * @param ctx StateContext of the CategoriesStateModel
   * @param action AddCategory with the new category
   * @return An Observable that emits the response from the server after adding a new category.
   */
  add(ctx: StateContext<CategoriesStateModel>, action: AddCategory) {
    return this.service
      .addCategory(action.category)
      .pipe(tap(() => ctx.dispatch(new GetCategories())));
  }
}
