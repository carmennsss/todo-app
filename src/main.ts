import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgxsModule, provideStore } from '@ngxs/store';
import { importProvidersFrom } from '@angular/core';
import { ClientState } from './app/auth/client-state/client.state';
import { TasksStateHttp } from './app/core/state/tasks/tasks.state';
import { CategoriesState } from './app/core/state/categories/categories.state';
import { TagsState } from './app/core/state/tags/tags.state';
import { SubtasksState } from './app/core/state/subtasks/subtask.state';
import { StatusState } from './app/tasks-main/states/status.state';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore(),
    appConfig.providers,
    importProvidersFrom(
      NgxsModule.forRoot([
        StatusState,
        ClientState,
        TasksStateHttp,
        CategoriesState,
        TagsState,
        SubtasksState
      ])
    ),
  ],
});
