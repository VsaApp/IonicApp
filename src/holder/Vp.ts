import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Storage} from '@ionic/storage';

export class VpHolder {

  public static vp: Array<{ date: string, time: string, update: string, weekday: string, changes: [{ grade: string, unit: number, lesson: string, type: string, room: string, teacher: string, changed: { info: string, teacher: string, room: string } }] }>;

  static load(http: Http, storage: Storage, callback: Function) {
    storage.get('grade').then(grade => {
      this.loadDay('today', grade, http, (data1, error1) => {
        this.loadDay('tomorrow', grade, http, (data2, error2) => {
          if (!error1 && !error2) VpHolder.vp = [data1, data2];
          callback(error1 || error2);
        });
      });
    });
  }

  static getDay(day: number) {
    return VpHolder.vp[day];
  }

  private static loadDay(day: string, grade: any, http: Http, loaded: Function) {
    let url = 'https://api.vsa.lohl1kohl.de/vp/' + day + '/' + grade + '.json';

    http.get(url).timeout(5000).map(res => res.json()).subscribe(data => {
      console.log('loaded day:  ', day);
      console.log(' loaded vp: ', data);
      loaded(data, false);
    }, error => {
      loaded(error, true)
    });
  }
}
