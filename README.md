# NgLazyLoadComponent [![Build Status](https://app.travis-ci.com/nigrosimone/ng-lazy-load-component.svg?branch=main)](https://app.travis-ci.com/nigrosimone/ng-lazy-load-component) [![Coverage Status](https://coveralls.io/repos/github/nigrosimone/ng-lazy-load-component/badge.svg?branch=main)](https://coveralls.io/github/nigrosimone/ng-lazy-load-component?branch=main) [![NPM version](https://img.shields.io/npm/v/ng-lazy-load-component.svg)](https://www.npmjs.com/package/ng-lazy-load-component)

Angular lazy load component into HTML template.

## Description

Angular lazy load component into HTML template.

See the [stackblitz demo](https://stackblitz.com/edit/demo-ng-lazy-load-component?file=src%2Fapp%2Fapp.component.ts).


## Get Started

*Step 1*: install `ng-lazy-load-component`

```bash
npm i ng-lazy-load-component
```

*Step 2*: Import `NgLazyLoadComponentModule` into your app module, eg.:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

import { NgLazyLoadComponentModule } from 'ng-lazy-load-component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    NgLazyLoadComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  ],
})
export class AppModule { }
```

*Step 2*: The component to lazy load

```ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

@Component({
  selector: 'test-lazy',
  template: `
  Input1: {{testInput1}} <button (click)="testOutput1.emit(testInput1)">Output1</button><br />
  Input2: {{testInput2}} <button (click)="testOutput2.emit(testInput2)">Output2</button>
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
export class TestLazyModule {}

// Export the component
export const testLazyComponent = TestLazyComponent;
```

*Step 3*: usage

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <ng-lazy-load-component 
    [lazyImporter]="lazyImporter" 
    [componentInput]="{testInput1, testInput2}" 
    (componentOutput)="onComponentOutput($event)"
  ></ng-lazy-load-component>
  `,
})
export class AppComponent {
  public testInput1 = 0;
  public testInput2 = 0;

  lazyImporter = (): Promise<{ module: Type<any>, component: Type<any> }> => import('./test-lazy.module').then((m) => ({
    module: m.TestLazyModule,
    component: m.testLazyComponent
  }));

  onComponentOutput(event: { property: string, value: number }) {
    switch (event.property) {
      case 'testOutput1': this.testInput1 = event.value + 1; break;
      case 'testOutput2': this.testInput2 = event.value + 1; break;
      default:
        break;
    }
  }
}
```

## Support

This is an open-source project. Star this [repository](https://github.com/nigrosimone/ng-lazy-load-component), if you like it, or even [donate](https://www.paypal.com/paypalme/snwp). Thank you so much! 

## My other libraries

I have published some other Angular libraries, take a look:

 - [NgSimpleState: Simple state management in Angular with only Services and RxJS](https://www.npmjs.com/package/ng-simple-state)
 - [NgHttpCaching: Cache for HTTP requests in Angular application](https://www.npmjs.com/package/ng-http-caching)
 - [NgGenericPipe: Generic pipe for Angular application for use a component method into component template.](https://www.npmjs.com/package/ng-generic-pipe)
 - [NgLet: Structural directive for sharing data as local variable into html component template](https://www.npmjs.com/package/ng-let)
 - [NgForTrackByProperty: Angular global trackBy property directive with strict type checking](https://www.npmjs.com/package/ng-for-track-by-property)
