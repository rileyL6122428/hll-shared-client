import { TestComponent } from './test.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    TestComponent
  ],
  exports: [
    TestComponent
  ]
})
export class TestModule { }
