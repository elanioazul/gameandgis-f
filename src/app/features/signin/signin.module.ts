import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ButtonModule } from "@shared/components/button/button.module";
import { ErrorFormModule } from "@shared/components/error-form/error-form.module";
import { InputTextModule } from "primeng/inputtext";
import { LoadingIndicatorModule } from '@shared/components/loading-indicator/loading-indicator.module';

@NgModule({
  declarations: [
    SigninComponent
  ],
  imports: [
		CommonModule,
		ButtonModule,
		ErrorFormModule,
		FormsModule,
		ReactiveFormsModule,
		InputTextModule,
    LoadingIndicatorModule
  ],
  exports: [SigninComponent]
})
export class SigninModule { }
