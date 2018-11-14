import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Http} from "@angular/http";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SpHolder} from "../../holder/Sp";
import {VpHolder} from "../../holder/Vp";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {SpPage} from "../sp/sp";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  public percent = 0;
  public targetPercent = 0;
  public operation: string;
  private toLoad = 3;
  private loaded = 0;
  private loadOrder;
  private error1: boolean;
  private error2: boolean;

  constructor(public translate: TranslateService, public navCtrl: NavController, public toastCtrl: ToastController, public http: Http, public splashScreen: SplashScreen, public storage: Storage) {
    const interval = setInterval(() => {
      if (this.translate.instant('sp') === require('../../assets/i18n/de.json').sp) {
        clearInterval(interval);
        this.splashScreen.hide();

        this.loadOrder = [this.translate.instant('loading_login'), this.translate.instant('loading_sp'), this.translate.instant('loading_vp'), this.translate.instant('loading_app')];

        // Load all data...
        this.operation = this.loadOrder[0];
        this.progressAnimation();

        this.login(() => {
          this.nextLoaded();
          SpHolder.load(http, storage, (error1): void => {
            this.nextLoaded();
            VpHolder.load(http, storage, (error2): void => {
              this.nextLoaded();
              this.error1 = error1;
              this.error2 = error2;
            });
          });
        });
      }
    }, 10);
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
                this.navCtrl.setRoot(LoginPage);
              }
            }, (error) => {
              callback();
            });
          });
        });

      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  nextLoaded() {
    this.loaded++;
    this.operation = this.loadOrder[this.loaded] + '...';
    this.targetPercent = (this.loaded + 1) / this.toLoad * 100;
  }

  finished(loadOld: boolean) {
    if (loadOld) {
      let toast = this.toastCtrl.create({
        message: this.translate.instant('connection_offline'),
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
    this.navCtrl.setRoot(SpPage);
  }

  progressAnimation() {
    setInterval(() => {
      if (this.percent < this.targetPercent) {
        this.percent += 5;
        if (this.percent > this.targetPercent) this.percent = this.targetPercent;
        if (this.percent === this.targetPercent) {
          this.finished(this.error1 || this.error2);
        }
      }
    }, 25);
  }
}
