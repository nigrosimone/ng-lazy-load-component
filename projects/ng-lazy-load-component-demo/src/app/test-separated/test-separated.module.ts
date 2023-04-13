import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import { TestSeparatedComponent } from './test-separated.component';

export { TestSeparatedComponent }

@NgModule({
  declarations: [TestSeparatedComponent],
  imports: [CommonModule],
  exports: [TestSeparatedComponent],
})
export class TestSeparatedModule {}
