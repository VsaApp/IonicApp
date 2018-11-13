import {Component} from '@angular/core';

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

  constructor(public http: Http) {
    this.title = strings.sp;
    this.days = ['MO', 'DI', 'MI', 'DO', 'FR'];
  }
}
