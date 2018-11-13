import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the ChangeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'change',
  templateUrl: 'change.html'
})
export class ChangeComponent {

  @Input('item') item: Array<any>;
  @Output('click') click = new EventEmitter();

  constructor() {
  }

  changeCilcked(event, item){
    this.click.emit(item);
  }

}
