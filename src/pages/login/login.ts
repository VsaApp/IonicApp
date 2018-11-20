import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {grades} from '../../app/resources';
import jsSHA from 'jssha';
import {Http} from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';
import {LoadingPage} from '../loading/loading';
import {TranslateService} from '@ngx-translate/core';
import crypto from 'crypto';

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

  constructor(public translate: TranslateService, public navCtrl: NavController, public http: Http, public storage: Storage) {
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
      this.information = this.translate.instant('login_grade_not_set');
      return;
    }
    if (this.information === this.translate.instant('login_grade_not_set')) {
      this.wrong = false;
      this.information = '';
    }
    let hashName = LoginPage.getHash(this.username);
    let hashPassword = LoginPage.getHash(this.password);
    let url = 'https://api.vsa.lohl1kohl.de/validate?username=' + hashName + '&password=' + hashPassword + '&v=' + crypto.randomBytes(8).toString('hex');
    this.http.get(url).timeout(5000).map(res => res.json()).subscribe((data) => {
        try {
          data = parseInt(data);
        } catch (e) {

        }
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
          this.information = this.translate.instant('login_wrong_values');
        }
      }, () => {
        this.wrong = true;
      this.information = this.translate.instant('connection_offline');
      }
    );
  }
}
