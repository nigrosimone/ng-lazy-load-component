import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-standalone',
  template: `
  Input1: {{testInput1 | json}} <button (click)="testOutput1.emit(testInput1)">Output1</button><br />
  Input2: {{testInput2 | json}} <button (click)="testOutput2.emit(testInput2)">Output2</button>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TestStandaloneComponent {
  @Input() testInput1 = 0;
  @Input() testInput2 = 0;
  @Output() testOutput1: EventEmitter<number> = new EventEmitter<number>();
  @Output() testOutput2: EventEmitter<number> = new EventEmitter<number>();
}
