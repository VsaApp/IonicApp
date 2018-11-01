import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { strings } from "../../app/resources";

@Component({
  selector: 'page-sp',
  templateUrl: 'sp.html'
})
export class SpPage {
  items: Array<{unit: number, lesson: string, teacher: string, time: string, room: string}>;
  title: string;
  day: string;

  constructor(public navCtrl: NavController) {
    this.title = strings.sp;
    this.day = "Montag";
    this.items = [];
    this.items.push({
      unit: 1,
      lesson: 'Deutsch',
      teacher: 'EGL',
      time: '10:30 - 11:30',
      room: '225'
    })
    this.items.push({
      unit: 2,
      lesson: 'Englisch',
      teacher: 'MAR',
      time: '11:40 - 12:40',
      room: '512'
    })
  }

  spRowClicked(event, item) {
    // That's right, we're pushing to ourselves!
  }

  previousDay(event){
    //TODO: DO something
  }

  nextDay(event){
    //TODO: DO something
  }
}
