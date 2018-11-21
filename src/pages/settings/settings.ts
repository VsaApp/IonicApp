import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from "@ionic/storage";
import {grades, storageKeys} from "../../app/resources";
import {NavController} from "ionic-angular";
import {LoadingPage} from "../loading/loading";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  grade: string;
  showVpInSp: boolean;
  vpNotifications: boolean;
  showOnlyFilteredVP: boolean;

  grades: Array<string>;


  constructor(public navCtrl: NavController, public translate: TranslateService, public storage: Storage) {
    this.grades = grades;
    this.storage.get(storageKeys.grade).then(value => this.grade = value);
    this.storage.get(storageKeys.showVpInSp).then(value => this.showVpInSp = value);
    this.storage.get(storageKeys.showFilteredVp).then(value => this.showOnlyFilteredVP = value);
    this.storage.get(storageKeys.vpNotifications).then(value => this.vpNotifications = value);
  }

  valueChanged(){
    this.storage.set(storageKeys.showVpInSp, this.showVpInSp);
    this.storage.set(storageKeys.showFilteredVp, this.showOnlyFilteredVP);
    this.storage.set(storageKeys.vpNotifications, this.vpNotifications);
  }

  gradeSelected(){
    this.storage.set(storageKeys.grade, this.grade);
    this.navCtrl.setRoot(LoadingPage);
  }

  deleteCache(){
    this.storage.keys().then(keys => {
      keys.filter((key: string) => (key.startsWith('sp-') && key.length === 5) || key.startsWith('vp-')).forEach((key: string) => this.storage.remove(key));
      this.navCtrl.setRoot(LoadingPage);
    });
  }

  signOut(){
    this.storage.clear().then(() => {
      this.navCtrl.setRoot(LoadingPage);
    });
  }
}
