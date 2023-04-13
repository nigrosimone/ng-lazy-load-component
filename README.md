# NgLazyLoadComponent [![Build Status](https://app.travis-ci.com/nigrosimone/ng-lazy-load-component.svg?branch=main)](https://app.travis-ci.com/nigrosimone/ng-lazy-load-component) [![Coverage Status](https://coveralls.io/repos/github/nigrosimone/ng-lazy-load-component/badge.svg?branch=main)](https://coveralls.io/github/nigrosimone/ng-lazy-load-component?branch=main) [![NPM version](https://img.shields.io/npm/v/ng-lazy-load-component.svg)](https://www.npmjs.com/package/ng-lazy-load-component)

Lazy load Angular component into HTML template without routing.

## Description

This library help to lazy load Angular component dynamically and render a at runtime. The `NgLazyLoadComponent` takes a function named `lazyImporter` as an input, which returns a `Promise` containing the component to be loaded.

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
    NgLazyLoadComponentModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

*Step 2*: This is `test-lazy.ts`, an example of component with `NgModule` to lazy load (but also works with standalone component without `NgModule`), eg.:

```ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

@Component({
  selector: 'test-lazy',
  template: `
  Input1: {{testInput1}} <button (click)="testOutput1.emit(testInput1)">Output1</button><br />
  Input2: {{testInput2}} <button (click)="testOutput2.emit(testInput2)">Output2</button>
  `
})
export class TestLazyComponent {
  @Input() testInput1 = 0;
  @Input() testInput2 = 0;
  @Output() testOutput1: EventEmitter<number> = new EventEmitter<number>();
  @Output() testOutput2: EventEmitter<number> = new EventEmitter<number>();
}

@NgModule({
  declarations: [TestLazyComponent],
  imports: [CommonModule],
  exports: [TestLazyComponent]
})
export class TestLazyModule {}
```

If you have the `NgModule` and the component into two separate files, you can export the component in the same file of the `NgModule`, eg.:

```ts
import { NgModule } from '@angular/core';
import { TestLazyComponent } from './test-lazy.component';

// also export the component
export { TestLazyComponent }

@NgModule({
  declarations: [TestLazyComponent],
  imports: [CommonModule],
  exports: [TestLazyComponent]
})
export class TestLazyModule {}
```

*Step 3*: usage

```ts
import { Component } from '@angular/core';
import { NgLazyLoadComponentImporter, NgLazyLoadComponentOutput, NgLazyLoadComponentInput } from 'ng-lazy-load-component';
// import ONLY type definition of the component
import type { TestLazyComponent } from './test-lazy';

@Component({
  selector: 'app-root',
  template: `
  <ng-lazy-load-component 
    [lazyImporter]="lazyImporter" 
    [componentInput]="{testInput1, testInput2}" 
    (componentOutput)="onComponentOutput($event)"
  >
    <div #loading>Loading...</div> <!-- optional -->
    <div #error>Ops!</div> <!-- optional -->
  </ng-lazy-load-component>
  `,
})
export class AppComponent {
  // NgLazyLoadComponentInput force Input type casting between ng-lazy-load-component and lazy loaded component
  public testInput1: NgLazyLoadComponentInput<TestLazyComponent, 'testInput1'> = 0; // bind with test-lazy component `@Input() testInput1`
  public testInput2: NgLazyLoadComponentInput<TestLazyComponent, 'testInput2'> = 0; // bind with test-lazy component `@Input() testInput2`

  /** Lazy load the component with `import()` */
  lazyImporter: NgLazyLoadComponentImporter = () => import('./test-lazy').then((m) => ({
    component: m.TestLazyComponent, // Also works with standalone component
    module: m.TestLazyModule // NgModule is optional!
  }));

  /** 
   * test-lazy component outputs: `@Output() testOutput1` and `@Output() testOutput2` 
   * NgLazyLoadComponentOutput force Output type casting between ng-lazy-load-component and lazy loaded component
   */
  onComponentOutput(event: NgLazyLoadComponentOutput<TestLazyComponent>) {
    switch (event.property) {
      case 'testOutput1': this.testInput1 = event.value + 1; break;
      case 'testOutput2': this.testInput2 = event.value + 1; break;
    }
  }
}
```

The `import()` syntax, avoids dynamic imports using variables as paths to the modules. So needs to provide a static path to the module to let webpack to generate metadata for the module at the compile time.

The main issue of the `import()` syntax is that it starts importing the module when the compiler reads the line it is written in. So in this case, we use function syntax to avoid it's importing until the function will be called.

## Support

This is an open-source project. Star this [repository](https://github.com/nigrosimone/ng-lazy-load-component), if you like it, or even [donate](https://www.paypal.com/paypalme/snwp). Thank you so much! 

## My other libraries

I have published some other Angular libraries, take a look:

 - [NgSimpleState: Simple state management in Angular with only Services and RxJS](https://www.npmjs.com/package/ng-simple-state)
 - [NgHttpCaching: Cache for HTTP requests in Angular application](https://www.npmjs.com/package/ng-http-caching)
 - [NgGenericPipe: Generic pipe for Angular application for use a component method into component template.](https://www.npmjs.com/package/ng-generic-pipe)
 - [NgLet: Structural directive for sharing data as local variable into html component template](https://www.npmjs.com/package/ng-let)
 - [NgForTrackByProperty: Angular global trackBy property directive with strict type checking](https://www.npmjs.com/package/ng-for-track-by-property)
