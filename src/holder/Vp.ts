import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Storage} from '@ionic/storage';
import {storageKeys, weekdays} from "../app/resources";
import {SpHolder, Subject} from "./Sp";

export declare type Change = { grade: string, unit: number, lesson: string, type: string, room: string, teacher: string, myChange: boolean, changed: { info: string, teacher: string, room: string } };
export declare type VpDay = {date: string, time: string, update: string, weekday: string, changes: [Change]};

export class VpHolder {

  public static vp: Array<VpDay>;

  public static load(http: Http, storage: Storage, callback: Function) {
    storage.get(storageKeys.grade).then(grade => {
      this.loadDay('today', grade, http, storage, (data1, error1) => {
        this.loadDay('tomorrow', grade, http, storage, (data2, error2) => {
          VpHolder.vp = [data1, data2];
          this.updateFilter(storage, 0).then(() => this.updateFilter(storage, 1).then(() => callback(error1 || error2)));
        });
      });
    });
  }

  public static async updateFilter(storage: Storage, day: number){
    for (let i = 0; i < this.vp[day].changes.length; i++) {
      await this.setMyChange(this.vp[day].weekday, this.vp[day].changes[i], storage);
    }
  }

  public static getMyChanges(day: number){
    let vp = this.vp[day];
    return {date: vp.date, time: vp.time, update: vp.update, weekday: vp.weekday, changes: vp.changes.filter((change) => change.myChange)};
  }

  public static getOtherChanges(day: number){
    let vp = this.vp[day];
    return {date: vp.date, time: vp.time, update: vp.update, weekday: vp.weekday, changes: vp.changes.filter((change) => !change.myChange)};
  }

  private static async setMyChange(weekday: string, change: Change, storage: Storage){
    if (change.changed.info.includes('Klausur')){
      //TODO: Currently there is no possibility to filter exams...
      change.myChange = undefined;
    } else {
      // Find the original subject in the sp...
      let nLessons = SpHolder.sp[weekdays.indexOf(weekday)].lessons[change.unit - 1];
      let possibleSubjects = nLessons.filter((subject: Subject) => (subject.lesson === change.lesson));
      if (possibleSubjects.length > 1) nLessons.filter((subject: Subject) => (subject.lesson === change.lesson && subject.teacher === change.teacher));
      if (possibleSubjects.length === 0) possibleSubjects = nLessons.filter((subject: Subject) => (subject.lesson === change.lesson && subject.room === change.room));
      else if (possibleSubjects.length > 1) possibleSubjects = possibleSubjects.filter((subject: Subject) => (subject.lesson === change.lesson && subject.room === change.room));

      if (possibleSubjects.length === 0){
        let possibleSubjects = nLessons.filter((subject: Subject) => (subject.lesson === change.lesson));
        let myChange = true;
        for (let i = 0; i < possibleSubjects.length; i++) if (await SpHolder.isSelected(weekday, change.unit - 1, possibleSubjects[i], storage)) myChange = false;
        change.myChange = myChange ? false : undefined;
      }
      else if (possibleSubjects.length > 1){
        // When none of the possible subject is selected, than it is not my change...
        let notMyChange = true;
        for (let i = 0; i < possibleSubjects.length; i++) if (await SpHolder.isSelected(weekday, change.unit - 1, possibleSubjects[i], storage)) notMyChange = false;
        change.myChange = notMyChange ? false : undefined;
      }
      else{
        if (change.teacher.length === 0) change.teacher = possibleSubjects[0].teacher;
        // When the subject is found, then check if this subject is selected...
        change.myChange = await SpHolder.isSelected(weekday, change.unit - 1, possibleSubjects[0], storage);
      }
    }
  }

  private static loadDay(day: string, grade: any, http: Http, storage: Storage, loaded: Function) {
    let url = 'https://api.vsa.lohl1kohl.de/vp/' + day + '/' + grade + '.json?v=' + Math.random().toString(36).substr(2);

    http.get(url).timeout(5000).map(res => res.json()).subscribe(data => {
      storage.set('vp-' + day + '-' + grade, data);
      loaded(data, false);
    }, error => {
      storage.get('vp-' + day + '-' + grade).then(savedVp => {
        loaded(savedVp, true)
      })
    });
  }

  public static isDay(weekday: number){
    return this.vp[0].weekday === weekdays[weekday]|| this.vp[1].weekday === weekdays[weekday];
  }

  public static convertDay(weekday: number){
    if (this.vp[0].weekday === weekdays[weekday]) return 0;
    else if (this.vp[1].weekday === weekdays[weekday]) return 1;
    return -1;
  }
}
