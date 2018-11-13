import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Http} from "@angular/http";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SpHolder} from "../../holder/Sp";
import {VpHolder} from "../../holder/Vp";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {SpPage} from "../sp/sp";
import {strings} from "../../app/resources";

@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  public percent = 0;
  public operation: string;
  private toLoad = 3;
  private loaded = 0;
  private loadOrder = ['Login', 'Stundenplan', 'Vertretungsplan', 'start app'];

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public http: Http, public splashScreen: SplashScreen, public storage: Storage) {
    this.splashScreen.hide();

    // Load all data...
    this.operation = this.loadOrder[0];

    this.login(() => {
      this.nextLoaded();
      SpHolder.load(http, storage, (error1): void => {
        this.nextLoaded();
        VpHolder.load(http, storage, (error2): void => {
          this.nextLoaded();
          this.finished(error1 || error2);
        })
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
    this.percent = this.loaded / this.toLoad * 100;
  }

  finished(loadOld: boolean) {
    this.percent = 100;
    if (loadOld) {
      let toast = this.toastCtrl.create({
        message: strings.noConnection,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
    this.navCtrl.setRoot(SpPage);
  }

}
