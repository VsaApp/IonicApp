import {Http} from "@angular/http";
import 'rxjs/add/operator/map';

export class VpHolder {

  public static vp: Array<{date: string, time: string, update: string, weekday: string, changes: [{grade: string, unit: number, lesson: string, type: string, room: string, teacher: string, changed: {info: string, teacher: string, room: string}}]}>;

  static load(http: Http, callback: Function){
    let grade = "EF";
    this.loadDay("today", grade, http, data1 => {
      this.loadDay("tomorrow", grade, http, data2 => {
        VpHolder.vp = [data1, data2];
        callback();
      });
    });
  }

  private static loadDay(day: string, grade: string, http: Http, loaded: Function){
    let url = "https://api.vsa.lohl1kohl.de/vp/" + day + "/" + grade + ".json";

    http.get(url).map(res => res.json()).subscribe(data => {
      console.log("loaded day:  ", day);
      console.log(" loaded vp: ", data);
      loaded(data);
    });
  }

  static getDay(day: number){
    return VpHolder.vp[day];
  }
}
