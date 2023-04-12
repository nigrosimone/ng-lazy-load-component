import { Component, Type } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  template: `
  <button (click)="loaded = false" [disabled]="!loaded">Unload</button> <button (click)="loaded = true" [disabled]="loaded">Load</button>
  <hr>
  <ng-lazy-load-component [lazyImporter]="lazyImporter" [componentInput]="{testInput1, testInput2}" (componentOutput)="onComponentOutput($event)" *ngIf="loaded"></ng-lazy-load-component>
  `,
})
export class AppComponent {

  public loaded = false;
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
