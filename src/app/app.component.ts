import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';

import {SpPage} from '../pages/sp/sp';
import {VpPage} from '../pages/vp/vp';
import {Http} from '@angular/http';
import {LoadingPage} from '../pages/loading/loading';

@Component({
  templateUrl: 'app.html'
})
export class VsaApp {
  static loadOld: boolean;
  @ViewChild(Nav) nav: Nav;
  grade: string;
  rootPage: any;
  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public http: Http, public storage: Storage, public translate: TranslateService) {
    this.translate.setDefaultLang('de');
    this.initializeApp();

    const interval = setInterval(() => {
      if (this.translate.instant('sp') !== 'sp') {
        clearInterval(interval);
        this.pages = [
          {title: this.translate.instant('sp'), icon: 'clipboard', component: SpPage},
          {title: this.translate.instant('vp'), icon: 'list-box', component: VpPage}
        ];
      }
    }, 10);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = LoadingPage;
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#67a744');
      } else if (!(this.platform.is('core') || this.platform.is('mobileweb'))) {
        this.statusBar.styleLightContent();
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
