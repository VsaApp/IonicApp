import {Component} from '@angular/core';
import {DayOfSp} from './day/day';
import {Http} from '@angular/http';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'page-sp',
  templateUrl: 'sp.html'
})

export class SpPage {
  title: string;
  days: Array<string>;
  dayRoot = DayOfSp;

  constructor(public translate: TranslateService, public http: Http) {
    this.title = this.translate.instant('sp');
    this.days = ['MO', 'DI', 'MI', 'DO', 'FR'];
  }
}
