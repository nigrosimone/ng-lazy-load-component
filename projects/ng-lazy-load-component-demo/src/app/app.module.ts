import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { NgLazyLoadComponentModule } from '../../../ng-lazy-load-component/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    NgLazyLoadComponentModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
