import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ButtonModule } from "@shared/components/button/button.module";
import { ErrorFormModule } from "@shared/components/error-form/error-form.module";
import { InputTextModule } from "primeng/inputtext";

import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
		ErrorFormModule,
		InputTextModule,
		FormsModule,
		ReactiveFormsModule,
    DialogModule
  ],
  exports: [SignupComponent]
})
export class SignupModule { }
