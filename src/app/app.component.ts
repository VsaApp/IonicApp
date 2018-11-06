import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SpPage} from '../pages/sp/sp';
import {VpPage} from '../pages/vp/vp';
import {strings} from './resources';
import {SpHolder} from '../holder/Sp';
import {Http} from '@angular/http';
import {VpHolder} from '../holder/Vp';

@Component({
  templateUrl: 'app.html'
})
export class VsaApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public http: Http) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: strings.sp, icon: 'clipboard', component: SpPage},
      {title: strings.vp, icon: 'list-box', component: VpPage}
    ];

  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.loadAll((): void => {
        this.rootPage = SpPage;
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    });
  }

  loadAll(finished: Function) {
    // Fist load sp...
    SpHolder.load(this.http, (): void => {
      VpHolder.load(this.http, (): void => {
        finished();
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
