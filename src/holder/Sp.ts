import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

export class SpHolder {

  public static sp: Array<{ name: string, lessons: [[{ teacher: string, lesson: string, room: string, block: string }]] }>;

  static load(http: Http, callback: Function) {
    let grade = 'EF';
    let url = 'https://api.vsa.lohl1kohl.de/sp/' + grade + '.json';

    http.get(url).map(res => res.json()).subscribe(data => {
      SpHolder.sp = data;
      callback();
      console.log('loaded sp: ', data);
    });
  }

  static getDay(day: number) {
    return SpHolder.sp[day];
  }
}
