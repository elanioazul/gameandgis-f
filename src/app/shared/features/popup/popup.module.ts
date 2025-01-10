import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import { PopupRoutingModule } from './popup-routing.module';


@NgModule({
  declarations: [
    PopupComponent
  ],
  imports: [
    CommonModule,
    PopupRoutingModule
  ]
})
export class PopupModule { }
