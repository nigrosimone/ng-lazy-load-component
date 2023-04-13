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
  SimpleChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';

type ExtractEventEmitter<P> = P extends EventEmitter<infer T> ? T : never;

export type NgLazyLoadComponentImporter = () => Promise<{ component: Type<any>, module?: Type<any>, injector?: Injector }>;
export type NgLazyLoadComponentOutput<T = Record<string, any>> = { property: keyof T, value: ExtractEventEmitter<T[keyof T]> | any };
export type NgLazyLoadComponentInput<T = Record<string, any>, P extends keyof T = keyof T> = T[P];

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

  @Input() lazyImporter!: NgLazyLoadComponentImporter;

  private _componentInput!: Record<string, any>;
  @Input()
  set componentInput(value: Record<string, any>) {
    this._componentInput = value;
    this.setInput();
  }

  @Output() componentOutput: EventEmitter<NgLazyLoadComponentOutput> = new EventEmitter();

  protected isLoading = false;
  protected error = false;

  public componentRef!: ComponentRef<any>;
  private subOutput: Array<Subscription> = [];

  constructor(private injector: Injector, private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lazyImporter'] && changes['lazyImporter'].currentValue) {
      this.load(this.lazyImporter);
    }
  }

  async load(lazyImporter: NgLazyLoadComponentImporter) {
    try {
      this.isLoading = true;
      this.error = false;
      this.unload();
      this.cdr.detectChanges();
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
    } catch (err) {
      this.error = true;
      throw err;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  unload() {
    if (this.componentRef) {
      this.vcRef.clear();
    }
  }

  private setInput() {
    if (this.componentRef && this._componentInput) {
      for (const property in this._componentInput) {
        this.componentRef.setInput(property, this._componentInput[property]);
      }
      this.cdr.detectChanges();
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

