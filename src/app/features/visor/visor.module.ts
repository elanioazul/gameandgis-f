import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisorLayoutComponent } from './components/visor-layout/visor-layout.component';
import { VisorMapComponent } from './components/visor-map/visor-map.component';
import { VisorSidebarComponent } from './components/visor-sidebar/visor-sidebar.component';

import { VisorRoutingModule } from './visor-routing.module';

@NgModule({
  declarations: [
    VisorLayoutComponent,
    VisorMapComponent,
    VisorSidebarComponent
  ],
  imports: [
    CommonModule,
    VisorRoutingModule
  ]
})
export class VisorModule { }
