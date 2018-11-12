import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {nameOfSubjects, strings} from '../../../app/resources';
import {VpHolder} from '../../../holder/Vp';

@Component({
  selector: 'vp-day',
  templateUrl: 'day.html'
})

export class DayOfVp {
  today: boolean;
  items: any = {};
  meta: { date: string, time: string, update: string, weekday: string };
  title: string;
  objectKeys = Object.keys;

  constructor(navParams: NavParams, public navCtrl: NavController) {
    this.title = strings.vp;
    this.today = navParams.data.today;
    console.log('Passed params', this.today);

    if (VpHolder.getDay((this.today ? 0 : 1)) != undefined) {
      let vp = JSON.parse(JSON.stringify(VpHolder.getDay((this.today ? 0 : 1))));
      delete vp.changes;
      this.meta = vp;
      JSON.parse(JSON.stringify(VpHolder.getDay((this.today ? 0 : 1)).changes)).map((change: any) => {
        change.color = 'orange';
        change.lesson = change.lesson in nameOfSubjects ? nameOfSubjects[change.lesson] : change.lesson;
        if (change.changed.room === change.room){
          change.changed.room = '';
        }
        if (change.changed.teacher === change.teacher){
          change.changed.teacher = '';
        }
        if (change.changed.info === 'Freistunde') {
          change.color = 'green';
        }
        if (change.changed.info.includes('Klausur')) {
          change.color = 'red';
        }
        if (change.changed.info.includes('Nachschreiber')) {
          change.lesson = 'Klausur';
          change.changed.info = change.changed.info.replace('Klausur', '').trim();
        }
        return change;
      }).forEach(item => {
        if (this.items[item.unit] === undefined) {
          this.items[item.unit] = [];
        }
        this.items[item.unit].push(item);
      })
    }
  }

  vpRowClicked(event, item) {
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
