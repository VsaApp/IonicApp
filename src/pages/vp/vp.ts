import {Component} from '@angular/core';

import {strings} from '../../app/resources';
import {DayOfVp} from './day/day';
import {VpHolder} from "../../holder/Vp";

@Component({
  selector: 'page-vp',
  templateUrl: 'vp.html'
})

export class VpPage {
  title: string;
  titleToday: string;
  titleTomorrow: string;
  dayRoot = DayOfVp;

  constructor() {
    this.title = strings.vp;
    if (VpHolder.vp !== null) {
      this.titleToday = VpHolder.getDay(0).weekday;
      this.titleTomorrow = VpHolder.getDay(1).weekday;
    }
  }

  vpRowClicked(event, item, day) {
    // That's right, we're pushing to ourselves!
  }
}
