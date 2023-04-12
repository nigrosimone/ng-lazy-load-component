import { NgModule } from '@angular/core';
import { NgLazyLoadComponentComponent } from './ng-lazy-load-component.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgLazyLoadComponentComponent],
  imports: [CommonModule],
  exports: [NgLazyLoadComponentComponent]
})
export class NgLazyLoadComponentModule { }
