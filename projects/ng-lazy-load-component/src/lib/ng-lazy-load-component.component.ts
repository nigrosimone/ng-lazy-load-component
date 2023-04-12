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
} from '@angular/core';
import { Subscription } from 'rxjs';

export type LazyImporter = () => Promise<{ module: Type<any>, component: Type<any> }>;


@Component({
  selector: 'ng-lazy-load-component',
  template: `
<ng-content *ngIf="isLoading" select="[loading]">
</ng-content>
<ng-content *ngIf="error" select="[error]">
</ng-content>
<ng-container #vcRef></ng-container>
`,
})
export class NgLazyLoadComponentComponent implements OnDestroy, OnChanges {

  @ViewChild('vcRef', { read: ViewContainerRef }) private vcRef!: ViewContainerRef;

  @Input() lazyImporter!: LazyImporter;

  private _componentInput!: Record<string, any>;
  @Input()
  set componentInput(value: Record<string, any>) {
    this._componentInput = value;
    this.setInput();
  }

  @Output() componentOutput: EventEmitter<{ property: string, value: any }> = new EventEmitter();

  protected isLoading = false;
  protected error = false;

  private componentRef!: ComponentRef<any>;
  private subOutput: Array<Subscription> = [];

  constructor(private injector: Injector) { }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lazyImporter'] && changes['lazyImporter'].currentValue) {
      this.load(this.lazyImporter);
    }
  }

  async load(lazyImporter: LazyImporter) {
    try {
      this.isLoading = true;
      this.error = false;
      if (this.componentRef) {
        this.vcRef.clear();
      }
      const result = await lazyImporter();
      const lazyModuleRef = createNgModule(result.module, this.injector);
      this.componentRef = this.vcRef.createComponent(result.component, { ngModuleRef: lazyModuleRef });
      this.setInput();
      this.setOutput();
      this.componentRef.changeDetectorRef.detectChanges();
      this.isLoading = false;
    } catch (err) {
      this.error = true;
      throw err;
    } finally {
      this.isLoading = false;
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
          this.subOutput.push(compRefProp.subscribe(value => this.componentOutput.emit({ property, value })));
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
