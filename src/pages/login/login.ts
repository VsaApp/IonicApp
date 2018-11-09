import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {SpPage} from "../sp/sp";
import { strings } from "../../app/resources";
import { grades } from "../../app/resources";
import jsSHA from 'jssha';
import {Http} from "@angular/http";
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import {Storage} from "@ionic/storage";
import {VsaApp} from "../../app/app.component";
import {SplashScreen} from "@ionic-native/splash-screen";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  wrong = false;
  username = '';
  password = '';
  grade = '';
  grades: Array<string>;
  information = strings.wrongValues;

  constructor(public navCtrl: NavController, public http: Http, public splashScreen: SplashScreen, public storage: Storage) {
    this.grades = grades;
    this.splashScreen.hide();
  }

  static getHash(text: string){
    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(text);
    return shaObj.getHash("HEX");
  }

  login() {
    let hashName = LoginPage.getHash(this.username);
    let hashPassword = LoginPage.getHash(this.password);
    let url = "https://api.vsa.lohl1kohl.de/validate?username=" + hashName + "&password=" + hashPassword;
    this.http.get(url).timeout(5000).map(res => res.json()).subscribe((data) => {
      console.log("Login: ", data);
        if (data == "0") {
          this.wrong = false;
          this.splashScreen.show();
          this.storage.set('username', hashName).then(() =>{
            this.storage.set('password', hashPassword).then(() =>{
              this.storage.set('grade', this.grade).then(() =>{
                VsaApp.loadAll(this.http, this.storage, () : void => {
                  this.navCtrl.setRoot(SpPage);
                });
              });
            });
          });
        }
        else {
          this.wrong = true;
          this.password = '';
        }
      }, (error) => {
        this.wrong = true;
        this.information  = strings.noConnection;
      }
    );
  }
}
