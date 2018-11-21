import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {nameOfSubjects, storageKeys} from '../../../app/resources';
import {VpHolder} from '../../../holder/Vp';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'vp-day',
  templateUrl: 'day.html'
})

export class DayOfVp {
  public today: boolean;
  public items: any;
  public myItems: any;
  public otherItems: any;
  public undefItems: any;
  public meta: { date: string, time: string, update: string, weekday: string };
  public title: string;
  public sortVp = false;
  public objectKeys = Object.keys;

  constructor(navParams: NavParams, public translate: TranslateService, public navCtrl: NavController, public storage: Storage) {
    this.title = this.translate.instant('vp');
    this.today = navParams.data.today;
    this.storage.get(storageKeys.showFilteredVp).then((value => this.sortVp = value));

    this.items = {};
    this.myItems = {};
    this.otherItems = {};
    this.undefItems = {};

    if (VpHolder.vp[this.today ? 0 : 1] != undefined) {
      let vp = JSON.parse(JSON.stringify(VpHolder.vp[this.today ? 0 : 1]));
      delete vp.changes;
      this.meta = vp;
      JSON.parse(JSON.stringify(VpHolder.vp[this.today ? 0 : 1].changes)).map((change: any) => {
        change.color = 'orange';
        change.lesson = change.lesson.toUpperCase() in nameOfSubjects ? nameOfSubjects[change.lesson.toUpperCase()] : change.lesson;
        if (change.changed.room === change.room) {
          change.changed.room = '';
        }
        if (change.changed.teacher === change.teacher) {
          change.changed.teacher = '';
        }
        if (change.changed.info === this.translate.instant('free_lesson')) {
          change.color = 'green';
        }
        if (change.changed.info.includes(this.translate.instant('exam'))) {
          change.color = 'red';
        }
        if (change.changed.info.includes(this.translate.instant('make_up'))) {
          change.lesson = this.translate.instant('exam');
          change.changed.info = change.changed.info.replace(this.translate.instant('exam'), '').trim();
        }
        return change;
      }).forEach(item => {
        if (this.items[item.unit] === undefined) this.items[item.unit] = [];
        if (this.undefItems[item.unit] === undefined && item.myChange == undefined) this.undefItems[item.unit] = [];
        else if (this.myItems[item.unit] === undefined && item.myChange) this.myItems[item.unit] = [];
        else if (this.otherItems[item.unit] === undefined && !item.myChange) this.otherItems[item.unit] = [];

        this.items[item.unit].push(item);
        if (item.myChange == undefined) this.undefItems[item.unit].push(item);
        else if (item.myChange) this.myItems[item.unit].push(item);
        else this.otherItems[item.unit].push(item);
      })
    }
  }

  vpRowClicked(item) {
    // That's right, we're pushing to ourselves!
  }

  swipe(event) {
    let day = this.today;
    if (event.direction === 2 || event.direction === 4) {
      day = !day;
    }
    this.navCtrl.parent.select((day ? 0 : 1));
  }
}
