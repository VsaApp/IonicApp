import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Storage} from '@ionic/storage';

export class SpHolder {

  public static sp: Array<{ name: string, lessons: [[{ teacher: string, lesson: string, room: string, block: string }]] }>;

  static load(http: Http, storage: Storage, callback: Function) {
    storage.get('grade').then(value => {
      let url = 'https://api.vsa.lohl1kohl.de/sp/' + value + '.json';

      http.get(url).timeout(5000).map(res => res.json()).subscribe(data => {
        SpHolder.sp = data;
        callback(false);
        console.log('loaded sp: ', data);
        console.log(' - from url: ', url);
      }, error => {
        callback(true);
      });
    });
  }

  static getDay(day: number) {
    return SpHolder.sp[day];
  }
}
