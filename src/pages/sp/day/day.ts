import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { strings } from "../../../app/resources";
import { times } from "../../../app/resources";
import { nameOfSubjects } from "../../../app/resources";
import {SpHolder} from "../../../holder/Sp";

@Component({
  selector: 'sp-day',
  templateUrl: 'day.html'
})

export class DayOfSp {
  name: string;
  items: Array<{unit: number, lesson: string, teacher: string, time: string, room: string}>;
  title: string;

  constructor(navParams: NavParams) {
    this.title = strings.sp;
    this.name = navParams.data.name;
    console.log('Passed params', this.name);
    this.items = [];

    if (SpHolder.sp != undefined) {
      let lessons = SpHolder.sp[["MO", "DI", "MI", "DO", "FR"].indexOf(this.name)].lessons;
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
          this.items.splice(5, 0,{
            unit: 6,
            lesson: strings.lunch,
            teacher: "",
            time: "",
            room: ""
          })
        }
    }
  }

  spRowClicked(event, item) {
    // That's right, we're pushing to ourselves!
  }
}
