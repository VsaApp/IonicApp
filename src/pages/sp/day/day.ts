import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {nameOfSubjects, strings, times} from '../../../app/resources';
import {SpHolder} from '../../../holder/Sp';

@Component({
  selector: 'sp-day',
  templateUrl: 'day.html'
})

export class DayOfSp {
  name: string;
  items: Array<{ unit: number, lesson: string, teacher: string, time: string, room: string }>;
  title: string;

  constructor(navParams: NavParams, public navCtrl: NavController) {
    this.title = strings.sp;
    this.name = navParams.data.name;
    console.log('Passed params', this.name);
    this.items = [];

    if (SpHolder.sp != undefined) {
      let lessons = SpHolder.sp[['MO', 'DI', 'MI', 'DO', 'FR'].indexOf(this.name)].lessons;
      let i: number;
      for (i = 0; i < lessons.length; i++) {
        let unit = lessons[i];
        if (unit.length > 0) {
          let lesson = unit[0];
          this.items.push({
            unit: i + 1,
            lesson: nameOfSubjects[lesson.lesson],
            teacher: lesson.teacher,
            time: times[i],
            room: lesson.room
          });
        }
      }
      if (this.items.length > 5) {
        this.items.splice(5, 0, {
          unit: 6,
          lesson: strings.lunch,
          teacher: '',
          time: '',
          room: ''
        })
      }
    }
  }

  spRowClicked(event, item) {
    // That's right, we're pushing to ourselves!
  }

  swipe(event) {
    let day: number = ['MO', 'DI', 'MI', 'DO', 'FR'].indexOf(this.name);
    if (event.direction === 2) {
      day++;
    }
    if (event.direction === 4) {
      day--;
    }
    if (day < 0) {
      day = 4;
    }
    if (day > 4) {
      day = 0;
    }
    this.navCtrl.parent.select(day);
  }
}
