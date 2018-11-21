import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {nameOfSubjects, storageKeys, times} from '../../../app/resources';
import {SpHolder} from '../../../holder/Sp';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'sp-day',
  templateUrl: 'day.html'
})

export class DayOfSp {
  name: string;
  items: Array<{ ready: boolean, showSelect: boolean, isExpanded: boolean, lessons: Array<{ unit: number, lesson: string, teacher: string, time: string, room: string, lunch: boolean }>, selected: number }>;
  title: string;

  constructor(navParams: NavParams, public translate: TranslateService, public storage: Storage, public navCtrl: NavController) {
    this.title = this.translate.instant('sp');
    this.name = navParams.data.name;
    this.setup();
  }

  async setup() {
    this.items = [];
    for (let i: number = 0; i < 11; i++) {
      this.items.push({
        lessons: [{unit: 0, lesson: '', teacher: '', time: '', room: '', lunch: false}],
        selected: 0,
        ready: false,
        showSelect: false,
        isExpanded: false
      });
    }

    if (SpHolder.sp != undefined) {
      let lessons = SpHolder.sp[['MO', 'DI', 'MI', 'DO', 'FR'].indexOf(this.name)].lessons;
      for (let i: number = 0; i < lessons.length; i++) {
        let weekday = ['MO', 'DI', 'MI', 'DO', 'FR'].indexOf(this.name);
        this.items[i].selected = (await this.storage.get('sp-' + (await this.storage.get(storageKeys.grade)) + '-' + weekday + '-' + i)) || 0;
        let unit = lessons[i];
        if (unit.length > 0) {
          for (let j: number = 0; j < unit.length; j++) {
            let lesson = unit[j];
            let longName = lesson.lesson.toUpperCase() in nameOfSubjects ? nameOfSubjects[lesson.lesson.toUpperCase()] : lesson.lesson;
            if (j !== 0) {
              this.items[i].lessons.push({
                unit: i + 1,
                lesson: longName,
                teacher: lesson.teacher,
                time: times[i],
                room: lesson.room,
                lunch: false
              });
            } else {
              this.items[i].lessons[0] = {
                unit: i + 1,
                lesson: longName,
                teacher: lesson.teacher,
                time: times[i],
                room: lesson.room,
                lunch: false
              };
            }
          }
          if ((await this.storage.get(storageKeys.grade) === 'EF') || (await this.storage.get(storageKeys.grade) === 'Q1') || (await this.storage.get(storageKeys.grade) === 'Q2')) {
            this.items[i].lessons.push({
              unit: i + 1,
              lesson: this.translate.instant('free_lesson'),
              teacher: '',
              time: times[i],
              room: '',
              lunch: false
            });
          }
        }
      }
      this.items = this.items.filter(items => items.lessons[0].unit !== 0);
      if (this.items.length > 5) {
        this.items.splice(5, 0, {
          lessons: [{
            unit: 6,
            lesson: this.translate.instant('lunch_break'),
            teacher: '',
            time: '',
            room: '',
            lunch: true
          }],
          selected: 0,
          ready: false,
          showSelect: false,
          isExpanded: false
        });
      }
      this.items = this.items.map(items => {
        items.ready = true;
        return items;
      });
    }
  }

  spRowClicked(unit) {
    if (this.items[unit].showSelect) {
      this.deactivateSelection(this.items[unit]);
    } else {
      this.items = this.items.map(a => {
        if (a.showSelect) this.deactivateSelection(a);
        return a;
      });
      this.activateSelection(this.items[unit]);
    }
  }

  activateSelection(unit: any) {
    unit.showSelect = true;
    setTimeout(() => {
      unit.isExpanded = true;
    }, 30);
  }

  deactivateSelection(unit: any) {
    unit.isExpanded = false;
    setTimeout(() => {
      unit.showSelect = false;
    }, 300);
  }

  async spSelectRowClicked(unit, i) {
    this.items[unit].selected = i;
    let weekday = ['MO', 'DI', 'MI', 'DO', 'FR'].indexOf(this.name);
    this.storage.set('sp-' + (await this.storage.get(storageKeys.grade)) + '-' + weekday + '-' + unit, i).then(() => {
      this.deactivateSelection(this.items[unit]);
    });
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
