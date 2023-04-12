import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-lazy',
  template: `
  Input1: {{testInput1 | json}} <button (click)="testOutput1.emit(testInput1)">Output1</button><br />
  Input2: {{testInput2 | json}} <button (click)="testOutput2.emit(testInput2)">Output2</button>
  `,
})
export class TestLazyComponent {
  @Input() testInput1 = 0;
  @Output() testOutput1: EventEmitter<number> = new EventEmitter<number>();

  @Input() testInput2 = 0;
  @Output() testOutput2: EventEmitter<number> = new EventEmitter<number>();
}

@NgModule({
  declarations: [TestLazyComponent],
  imports: [CommonModule],
  exports: [TestLazyComponent],
})
export class TestLazyModule {

}

export const testLazyComponent = TestLazyComponent;