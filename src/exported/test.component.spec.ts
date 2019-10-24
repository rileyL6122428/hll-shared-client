import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestComponent } from './test.component';

describe('TestComponent', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(testComponent).toBeTruthy();
  });
});
