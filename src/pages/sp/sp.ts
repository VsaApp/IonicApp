import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {strings} from '../../app/resources';
import {DayOfSp} from './day/day';
import {Http} from '@angular/http';

@Component({
  selector: 'page-sp',
  templateUrl: 'sp.html'
})
export class SpPage {
  title: string;
  days: Array<string>;
  dayRoot = DayOfSp;

  constructor(public navCtrl: NavController, public http: Http) {
    this.title = strings.sp;
    this.days = ['MO', 'DI', 'MI', 'DO', 'FR'];
  }

  spRowClicked(event, item, day) {
    // That's right, we're pushing to ourselves!
  }

  previousDay(event) {
    //TODO: DO something
  }

  nextDay(event) {
    //TODO: DO something
  }
}
