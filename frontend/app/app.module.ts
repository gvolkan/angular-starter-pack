import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app.routing';

import { AppFormService } from './services/app.form.service';
import { AppStateService } from './services/app.state.service';
import { AppLogService } from './services/app.log.service';
import { AppTranslateService } from './services/app.translate.service';
import { AppInfoService } from './services/app.info.service';

import { UserService } from './data/services/user.service';

export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    })
  ],
  declarations: [
    AppComponent,
    routedComponents,
  ],
  entryComponents: [],
  providers: [
    AppStateService,
    AppLogService,
    AppFormService,
    AppTranslateService,
    AppInfoService,

    UserService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
