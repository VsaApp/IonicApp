import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'lesson',
  templateUrl: 'lesson.html'
})
export class LessonComponent {

  @Input('lesson') lesson: any;
  @Input('subitem') subitem = false;
  @Output('click') click = new EventEmitter();

  constructor() {
  }

  lessonClicked(event, item) {
    this.click.emit(item);
  }

}
