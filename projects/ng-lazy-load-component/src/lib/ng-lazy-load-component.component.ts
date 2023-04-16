import {
  Component,
  Injector,
  Input,
  ViewContainerRef,
  ViewChild,
  Type,
  createNgModule,
  ComponentRef,
  EventEmitter,
  Output,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';

type ExtractEventEmitter<P> = P extends EventEmitter<infer T> ? T : never;

type ComponentChange<T, P extends keyof T> = {
  previousValue: T[P];
  currentValue: T[P];
  firstChange: boolean;
};

type ComponentChanges<T> = {
  [P in keyof T]?: ComponentChange<T, P>;
};

export type NgLazyLoadComponentImporter = () => Promise<{ component: Type<any>, module?: Type<any>, injector?: Injector }>;
export type NgLazyLoadComponentOutput<T = Record<string, any>> = { property: keyof T, value: ExtractEventEmitter<T[keyof T]> | any };
export type NgLazyLoadComponentInput<T = Record<string, any>, P extends keyof T = keyof T> = T[P];
export type NgLazyLoadComponentMultiInput<T = Record<string, any>> = Partial<T>;

@Component({
  selector: 'ng-lazy-load-component',
  template: `
<ng-content *ngIf="isLoading" select="[loading]"></ng-content>
<ng-content *ngIf="error" select="[error]"></ng-content>
<ng-container #vcRef></ng-container>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgLazyLoadComponentComponent implements OnDestroy, OnChanges {

  @ViewChild('vcRef', { read: ViewContainerRef }) private vcRef!: ViewContainerRef;

  /**
   * Lazy load method.
   * Lazy load the component with `import()`, eg.:
   * ```
   * lazyImporter: NgLazyLoadComponentImporter = () => import('./test.module').then((m) => ({
   *   component: m.TestComponent,
   *   module: m.TestModule // NgModule is optional!
   * }));
   * ```
   */
  @Input() lazyImporter: NgLazyLoadComponentImporter | null = null;

  /**
   * Component inputs
   * ```
   * <ng-lazy-load-component [componentInput]="{testInput1, testInput2}">
   * ```
   */
  private _componentInput!: Record<string, any>;
  @Input()
  set componentInput(value: Record<string, any>) {
    this._componentInput = value;
    this.setInput();
  }

  /**
   * Component outputs
   */
  @Output() componentOutput: EventEmitter<NgLazyLoadComponentOutput> = new EventEmitter();

  /**
   * Component loaded
   */
  @Output() loaded: EventEmitter<ComponentRef<any>> = new EventEmitter();

  /**
   * Component load failed
   */
  @Output() failed: EventEmitter<any> = new EventEmitter();

  protected isLoading = false;
  protected error = false;

  /**
   * Component istance
   */
  public componentRef!: ComponentRef<any>;
  private subOutput: Array<Subscription> = [];

  constructor(private injector: Injector) { }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnChanges(changes: ComponentChanges<NgLazyLoadComponentComponent>) {
    if (changes.lazyImporter) {
      if (changes.lazyImporter.currentValue) {
        this.load(changes.lazyImporter.currentValue);
      } else {
        this.unload();
      }
    }
  }

  /**
   * Load the component
   * ```
   * const lazyImporter: NgLazyLoadComponentImporter = () => import('./test.module').then((m) => ({
   *   component: m.TestComponent,
   *   module: m.TestModule // NgModule is optional!
   * }));
   * ```
   */
  async load(lazyImporter: NgLazyLoadComponentImporter) {
    try {
      this.isLoading = true;
      this.error = false;
      this.unload();
      const result = await lazyImporter();
      if (result.module) {
        const lazyModuleRef = createNgModule(result.module, result.injector || this.injector);
        this.componentRef = this.vcRef.createComponent(result.component, { ngModuleRef: lazyModuleRef, injector: result.injector || this.injector });
      } else {
        this.componentRef = this.vcRef.createComponent(result.component, { injector: result.injector || this.injector });
      }
      this.setInput();
      this.setOutput();
      this.componentRef.changeDetectorRef.detectChanges();
      this.loaded.emit(this.componentRef);
    } catch (err) {
      this.error = true;
      this.failed.emit(err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Unload the component
   */
  unload() {
    this.unsubscribe();
    if (this.componentRef) {
      this.vcRef.clear();
    }
  }

  private setInput() {
    if (this.componentRef && this._componentInput) {
      for (const property in this._componentInput) {
        this.componentRef.setInput(property, this._componentInput[property]);
      }
    }
  }

  private setOutput() {
    this.unsubscribe();
    if (this.componentRef) {
      for (const property in this.componentRef.instance) {
        const compRefProp = this.componentRef.instance[property];
        if (compRefProp instanceof EventEmitter) {
          this.subOutput.push(compRefProp.subscribe(value => this.componentOutput.emit({ property: property, value: value })));
        }
      }
    }
  }

  private unsubscribe() {
    for (const subOutput of this.subOutput) {
      subOutput.unsubscribe();
    }
  }
}

