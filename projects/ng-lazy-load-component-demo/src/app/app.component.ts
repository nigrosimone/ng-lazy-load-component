import { Component } from '@angular/core';
import { NgLazyLoadComponentImporter, NgLazyLoadComponentInput, NgLazyLoadComponentOutput } from '../../../ng-lazy-load-component/src/public-api';
import type { TestClassicComponent } from './test-classic.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  template: `
  <button (click)="loaded = false" [disabled]="!loaded">Unload</button> <button (click)="loaded = true" [disabled]="loaded">Load</button>
  <hr>
  <h2>Classic</h2>
  <button (click)="lazyImporterClassic = $any(null)">Null</button><br />
  <ng-lazy-load-component [lazyImporter]="lazyImporterClassic" [componentInput]="{testInput1, testInput2}" (componentOutput)="onComponentOutput($event)" *ngIf="loaded"></ng-lazy-load-component>
  <h2>Standalone</h2>
  <button (click)="lazyImporterStandalone = $any(null)">Null</button><br />
  <ng-lazy-load-component [lazyImporter]="lazyImporterStandalone" [componentInput]="{testInput1, testInput2}" (componentOutput)="onComponentOutput($event)" *ngIf="loaded"></ng-lazy-load-component>
  <h2>Separated</h2>
  <button (click)="lazyImporterSeparated = $any(null)">Null</button><br />
  <ng-lazy-load-component [lazyImporter]="lazyImporterSeparated" [componentInput]="{testInput1, testInput2}" (componentOutput)="onComponentOutput($event)" *ngIf="loaded"></ng-lazy-load-component>
  
  `,
})
export class AppComponent {

  public loaded = false;

  public testInput1: NgLazyLoadComponentInput<TestClassicComponent, 'testInput1'> = 0;
  public testInput2: NgLazyLoadComponentInput<TestClassicComponent, 'testInput2'> = 0;

  lazyImporterClassic: NgLazyLoadComponentImporter = () => import('./test-classic.module').then((m) => ({
    module: m.TestLazyModule,
    component: m.TestClassicComponent
  }));

  lazyImporterSeparated: NgLazyLoadComponentImporter = () => import('./test-separated/test-separated.module').then((m) => ({
    module: m.TestSeparatedModule,
    component: m.TestSeparatedComponent
  }));

  lazyImporterStandalone: NgLazyLoadComponentImporter = () => import('./test-standalone.component').then((m) => ({
    component: m.TestStandaloneComponent
  }));

  onComponentOutput(event: NgLazyLoadComponentOutput<TestClassicComponent>) {
    switch (event.property) {
      case 'testOutput1': this.testInput1 = event.value + 1; break;
      case 'testOutput2': this.testInput2 = event.value + 1; break;
      default:
        break;
    }
  }

  onNull(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.lazyImporterClassic = null as any;
  }
}
