import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Storage} from '@ionic/storage';

export class VpHolder {

  public static vp: Array<{ date: string, time: string, update: string, weekday: string, changes: [{ grade: string, unit: number, lesson: string, type: string, room: string, teacher: string, changed: { info: string, teacher: string, room: string } }] }>;

  public static load(http: Http, storage: Storage, callback: Function) {
    storage.get('grade').then(grade => {
      this.loadDay('today', grade, http, storage, (data1, error1) => {
        this.loadDay('tomorrow', grade, http, storage, (data2, error2) => {
          if (!error1 && !error2) VpHolder.vp = [data1, data2];
          callback(error1 || error2);
        });
      });
    });
  }

  public static getDay(day: number) {
    return VpHolder.vp[day];
  }

  private static loadDay(day: string, grade: any, http: Http, storage: Storage, loaded: Function) {
    let url = 'https://api.vsa.lohl1kohl.de/vp/' + day + '/' + grade + '.json';

    http.get(url).timeout(5000).map(res => res.json()).subscribe(data => {
      console.log('loaded day:  ', day);
      console.log(' loaded vp: ', data);
      storage.set('vp-' + day + '-' + grade, data);
      loaded(data, false);
    }, error => {
      storage.get('vp-' + day + '-' + grade).then(savedVp => {
        VpHolder.vp = savedVp;
        loaded(error, true);
      })
    });
  }
}
