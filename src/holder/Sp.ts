import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Storage} from '@ionic/storage';
import {storageKeys, weekdays} from "../app/resources";

export declare type Subject = {teacher: string, lesson: string, room: string, block: string}
export declare type Lesson = [Subject];
export declare type SpDay = {name: string, lessons: [Lesson]};

export class SpHolder {
  public static sp: Array<SpDay>;

  static load(http: Http, storage: Storage, callback: Function) {
    storage.get(storageKeys.grade).then(grade => {
      let url = 'https://api.vsa.lohl1kohl.de/sp/' + grade + '.json?v=' + Math.random().toString(36).substr(2);

      http.get(url).timeout(5000).map(res => res.json()).subscribe(data => {
        SpHolder.sp = data;
        callback(false);
        storage.set('sp-' + grade, data);
      }, error => {
        storage.get('sp-' + grade).then(savedSp => {
          SpHolder.sp = savedSp;
          callback(true);
        })
      });
    });
  }

  static getDay(day: number) {
    return SpHolder.sp[day];
  }

  static async isSelected(weekday: string, unit: number, subject: Subject, storage: Storage){
    let selectedIndex = await storage.get('sp-' + (await storage.get(storageKeys.grade)) + '-' + weekdays.indexOf(weekday) + '-' + unit.toString());
    let compareIndex = this.sp[weekdays.indexOf(weekday)].lessons[unit].indexOf(subject);
    if (selectedIndex == null) selectedIndex = 0;
    return compareIndex === selectedIndex;
  }
}
