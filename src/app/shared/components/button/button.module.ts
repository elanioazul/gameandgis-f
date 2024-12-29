import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { ButtonModule as PrimeButtonModule } from "primeng/button";

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    PrimeButtonModule
  ],
  exports: [ButtonComponent]
})
export class ButtonModule { }
