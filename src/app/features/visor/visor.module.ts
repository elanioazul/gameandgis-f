import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisorLayoutComponent } from './components/visor-layout/visor-layout.component';
import { VisorMapComponent } from './components/visor-map/visor-map.component';
import { VisorSidebarComponent } from './components/visor-sidebar/visor-sidebar.component';

import { VisorRoutingModule } from './visor-routing.module';
import { ToolComponent } from './components/visor-layout/visor-layout-tools/tools-warehouse/tool/tool.component';
import { VisorSidebarSearcherComponent } from './components/visor-sidebar/visor-sidebar-searcher/visor-sidebar-searcher.component';
import { VisorService } from './services/visor.service';
import { MapService } from './services/map.service';
import { VisorToMapMapperService } from './services/visor-to-map-mapper.service';

@NgModule({
  declarations: [
    VisorLayoutComponent,
    VisorMapComponent,
    VisorSidebarComponent,
    ToolComponent,
    VisorSidebarSearcherComponent
  ],
  imports: [
    CommonModule,
    VisorRoutingModule
  ],
  providers: [VisorService, MapService, VisorToMapMapperService]
})
export class VisorModule { }
