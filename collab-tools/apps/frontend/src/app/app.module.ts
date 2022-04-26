import {
  HttpClient,
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ServicesModule } from '@collab-tools/services';
import { effects, reducers } from '@collab-tools/store';
import { FrontendLayoutModule } from '@collab-tools/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { DateHttpInterceptor } from './interceptors/date-http-interceptor';
import { GlobalErrorHandler } from './interceptors/global-error-handler';
import { JwtHttpInterceptor } from './interceptors/jwt-http-interceptor';
import { AppInitService } from './services/app-init.service';

export function init_app(appInitService: AppInitService) {
  return () => appInitService.initializeApp();
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    FrontendLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
    }),
    EffectsModule.forRoot(effects),
    HttpClientXsrfModule.withOptions(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      regidrawionStrategy: 'registerImmediately',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    ConfirmationService,
    DialogService,
    ServicesModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateHttpInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppInitService],
      multi: true,
    },
    {
      provide: 'environment',
      useValue: environment,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
