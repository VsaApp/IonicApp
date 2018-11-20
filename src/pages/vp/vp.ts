import {Component} from '@angular/core';
import {DayOfVp} from './day/day';
import {VpHolder} from '../../holder/Vp';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-vp',
  templateUrl: 'vp.html'
})

export class VpPage {
  title: string;
  titleToday: string;
  titleTomorrow: string;
  dayRoot = DayOfVp;

  constructor(public translate: TranslateService) {
    this.title = this.translate.instant('vp');
    if (VpHolder.vp !== null) {
      this.titleToday = VpHolder.vp[0].weekday;
      this.titleTomorrow = VpHolder.vp[1].weekday;
    }
  }
}
