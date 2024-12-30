import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingIndicatorComponent } from './loading-indicator.component';


@NgModule({
  declarations: [LoadingIndicatorComponent],
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ],
  exports: [LoadingIndicatorComponent]
})
export class LoadingIndicatorModule { }
