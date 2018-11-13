import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

import {SpPage} from '../sp/sp';
import {grades, strings} from '../../app/resources';
import jsSHA from 'jssha';
import {Http} from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';
import {VsaApp} from '../../app/app.component';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LoadingPage} from "../loading/loading";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  @ViewChild('passwordInput') passwordInput;

  wrong = false;
  username = '';
  password = '';
  grade = '';
  grades: Array<string>;
  information = '';

  constructor(public navCtrl: NavController, public http: Http, public storage: Storage) {
    this.grades = grades;
  }

  static getHash(text: string) {
    let shaObj = new jsSHA('SHA-256', 'TEXT');
    shaObj.update(text);
    return shaObj.getHash('HEX');
  }

  login() {
    if (this.grade === '') {
      this.wrong = true;
      this.information = strings.noGradeSet;
      return;
    }
    if (this.information === strings.noGradeSet) {
      this.wrong = false;
      this.information = '';
    }
    let hashName = LoginPage.getHash(this.username);
    let hashPassword = LoginPage.getHash(this.password);
    let url = 'https://api.vsa.lohl1kohl.de/validate?username=' + hashName + '&password=' + hashPassword;
    this.http.get(url).timeout(5000).map(res => res.json()).subscribe((data) => {
        try {
          data = parseInt(data);
        } catch (e) {

        }
        console.log('Login: ', data);
        if (data === 0) {
          this.wrong = false;
          this.storage.set('username', hashName).then(() => {
            this.storage.set('password', hashPassword).then(() => {
              this.storage.set('grade', this.grade).then(() => {
                this.navCtrl.setRoot(LoadingPage);
              });
            });
          });
        } else {
          this.wrong = true;
          this.password = '';
          this.information = strings.wrongValues;
        }
      }, () => {
        this.wrong = true;
        this.information = strings.noConnection;
      }
    );
  }
}
