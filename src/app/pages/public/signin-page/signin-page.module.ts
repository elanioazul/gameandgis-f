import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninPageRoutingModule } from './signin-page-routing.module';
import { SigninPageComponent } from './signin-page.component';
import { SigninModule } from 'src/app/features/signin/signin.module';


@NgModule({
  declarations: [
    SigninPageComponent
  ],
  imports: [
    CommonModule,
    SigninPageRoutingModule,
    SigninModule
  ]
})
export class SigninPageModule { }
