import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Storage} from '@ionic/storage';
import {randomBytes} from "crypto";
import {storageKeys} from "../app/resources";

export class SpHolder {

  public static sp: Array<{ name: string, lessons: [[{ teacher: string, lesson: string, room: string, block: string }]] }>;

  static load(http: Http, storage: Storage, callback: Function) {
    storage.get(storageKeys.grade).then(grade => {
      let url = 'https://api.vsa.lohl1kohl.de/sp/' + grade + '.json?v=' + randomBytes(8).toString('hex');

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
}
