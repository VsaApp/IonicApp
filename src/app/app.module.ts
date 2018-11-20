import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {VsaApp} from './app.component';
import {SpPage} from '../pages/sp/sp';
import {VpPage} from '../pages/vp/vp';
import {DayOfSp} from '../pages/sp/day/day';
import {DayOfVp} from '../pages/vp/day/day';
import {LoginPage} from '../pages/login/login';

import {ChangeComponent} from '../components/change/change';

import {HttpModule} from '@angular/http';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';
import {LessonComponent} from '../components/lesson/lesson';
import {LoadingPage} from '../pages/loading/loading';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HeaderColor} from '@ionic-native/header-color';


@NgModule({
  declarations: [
    VsaApp,
    SpPage,
    DayOfSp,
    VpPage,
    DayOfVp,
    LoginPage,
    LoadingPage,
    LessonComponent,
    ChangeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(VsaApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    VsaApp,
    SpPage,
    DayOfSp,
    VpPage,
    DayOfVp,
    LoginPage,
    LoadingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HeaderColor,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
