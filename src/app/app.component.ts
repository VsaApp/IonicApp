import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';

import {SpPage} from '../pages/sp/sp';
import {VpPage} from '../pages/vp/vp';
import {strings} from './resources';
import {Http} from '@angular/http';
import {LoadingPage} from "../pages/loading/loading";

@Component({
  templateUrl: 'app.html'
})
export class VsaApp {
  static loadOld: boolean;
  @ViewChild(Nav) nav: Nav;
  grade: string;
  rootPage: any;
  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform, public toastCtrl: ToastController, public statusBar: StatusBar, public splashScreen: SplashScreen, public http: Http, public storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: strings.sp, icon: 'clipboard', component: SpPage},
      {title: strings.vp, icon: 'list-box', component: VpPage}
    ];
  }

  static loadAll(http: Http, storage: Storage, finished: Function) {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = LoadingPage;
      this.statusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
