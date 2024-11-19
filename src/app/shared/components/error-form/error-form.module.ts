import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorFormComponent } from './error-form.component';



@NgModule({
  declarations: [
    ErrorFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ErrorFormComponent]
})
export class ErrorFormModule { }
