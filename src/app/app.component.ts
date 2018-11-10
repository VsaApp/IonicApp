import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';

import {SpPage} from '../pages/sp/sp';
import {VpPage} from '../pages/vp/vp';
import {strings} from './resources';
import {SpHolder} from '../holder/Sp';
import {Http} from '@angular/http';
import {VpHolder} from '../holder/Vp';
import {LoginPage} from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class VsaApp {
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
    // Fist load sp...
    SpHolder.load(http, storage, (error): void => {
      if (error) {
        finished(false);
        return;
      }
      VpHolder.load(http, storage, (error): void => {
        if (error) {
          finished(false);
          return;
        }
        finished();
      })
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.login((): void => {
        this.storage.get('grade').then((grade) => {
          this.grade = grade;
        });
        VsaApp.loadAll(this.http, this.storage, (error): void => {
          if (error) {
            let toast = this.toastCtrl.create({
              message: strings.noConnection,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
          this.rootPage = SpPage;
          this.statusBar.styleDefault();
        });
      });
    });
  }

  login(callback: Function) {
    this.storage.keys().then(keys => {
      console.log('Saved keys: ', keys);
      if (keys.indexOf('username') > -1 && keys.indexOf('password') > -1 && keys.indexOf('grade') > -1) {
        // Get saved login data...
        this.storage.get('username').then(username => {
          this.storage.get('password').then(password => {
            // Control saved login data...
            let url = 'https://api.vsa.lohl1kohl.de/validate?username=' + username + '&password=' + password;
            this.http.get(url).timeout(5000).map(res => res.json()).subscribe((data) => {
              console.log('Login: ', data);
              if (data == '0') {
                callback()
              } else {
                this.rootPage = LoginPage;
              }
            }, (error) => {
              callback();
            });
          });
        });

      } else {
        this.rootPage = LoginPage;
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
