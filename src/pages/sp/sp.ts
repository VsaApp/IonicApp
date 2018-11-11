import {Component} from '@angular/core';

import {strings} from '../../app/resources';
import {DayOfSp} from './day/day';
import {Http} from '@angular/http';
import {SplashScreen} from '@ionic-native/splash-screen';

@Component({
  selector: 'page-sp',
  templateUrl: 'sp.html'
})

export class SpPage {
  title: string;
  days: Array<string>;
  dayRoot = DayOfSp;

  constructor(public http: Http, public splashScreen: SplashScreen) {
    this.title = strings.sp;
    this.days = ['MO', 'DI', 'MI', 'DO', 'FR'];
    this.splashScreen.hide();
  }

  spRowClicked(event, item, day) {
    // That's right, we're pushing to ourselves!
  }
}
