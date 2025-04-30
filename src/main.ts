import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgxsModule, provideStore } from '@ngxs/store';
import { importProvidersFrom } from '@angular/core';
import { ClientState } from './app/auth/client-state/client.state';

bootstrapApplication(AppComponent,{
  providers: [
    provideStore(),
    appConfig.providers,
    importProvidersFrom(NgxsModule.forRoot([ClientState])),
  ],
});


