import {NgModule} from '@angular/core';
import {ChangeComponent} from './change/change';
import {LessonComponent} from './lesson/lesson';

@NgModule({
  declarations: [LessonComponent, ChangeComponent],
  imports: [],
  exports: [LessonComponent, ChangeComponent]
})
export class ComponentsModule {
}
