import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninPageRoutingModule } from './signin-page-routing.module';
import { SigninPageComponent } from './signin-page.component';


@NgModule({
  declarations: [
    SigninPageComponent
  ],
  imports: [
    CommonModule,
    SigninPageRoutingModule
  ]
})
export class SigninPageModule { }
