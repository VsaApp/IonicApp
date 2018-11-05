import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { VsaApp } from './app.component';
import { SpPage } from '../pages/sp/sp';
import { VpPage } from '../pages/vp/vp';
import { DayOfSp } from '../pages/sp/day/day';

import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    VsaApp,
    SpPage,
    DayOfSp,
    VpPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(VsaApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    VsaApp,
    SpPage,
    DayOfSp,
    VpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
