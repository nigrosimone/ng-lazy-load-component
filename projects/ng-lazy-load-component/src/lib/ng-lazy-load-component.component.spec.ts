import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgLazyLoadComponentModule } from './ng-lazy-load-component.module';
import { NgLazyLoadComponentImporter, NgLazyLoadComponentInput, NgLazyLoadComponentOutput } from './ng-lazy-load-component.component';
import type { TestClassicComponent } from './test-classic.module';


@Component({
    template: `
<ng-lazy-load-component 
[lazyImporter]="lazyImporterClassic" 
[componentInput]="{testInput1, testInput2}" 
(componentOutput)="onComponentOutput($event)" *ngIf="loaded"></ng-lazy-load-component>
`})
class TestComponent {
    public loaded = true;
    public testInput1: NgLazyLoadComponentInput<TestClassicComponent, 'testInput1'> = 0;
    public testInput2: NgLazyLoadComponentInput<TestClassicComponent, 'testInput2'> = 0;

    lazyImporterClassic: NgLazyLoadComponentImporter = () => import('./test-classic.module').then((m) => ({
        module: m.TestLazyModule,
        component: m.TestClassicComponent
    }));

    onComponentOutput(event: NgLazyLoadComponentOutput<TestClassicComponent>) {
        switch (event.property) {
            case 'testOutput1': this.testInput1 = event.value + 1; break;
            case 'testOutput2': this.testInput2 = event.value + 1; break;
            default:
                break;
        }
    }
}
describe('NgLazyLoadComponentComponent', () => {

    let fixture: ComponentFixture<TestComponent>;
    let debugElement: DebugElement;
    let element: HTMLElement;
    let component: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [NgLazyLoadComponentModule]
        });
        fixture = TestBed.createComponent(TestComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        element = debugElement.nativeElement;
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('test', async() => {
        component.loaded = true;
        component.testInput1 = 5;
        fixture.detectChanges();
        await fixture.whenStable()
        expect(element.textContent?.trim()).toBe('Input1: 5 Output1 Input2: 0 Output2');

        element.getElementsByTagName('button')[0].click();
        fixture.detectChanges();
        expect(element.textContent?.trim()).toBe('Input1: 6 Output1 Input2: 0 Output2');

        component.loaded = false;
        fixture.detectChanges();
        expect(element.textContent?.trim()).toBe('');
    });
});
