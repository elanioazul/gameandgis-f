import { Component, computed, inject, OnInit } from '@angular/core';
import { visorConfig } from '@visor/consts/visor-config';
import { MapService } from '@visor/services/map.service';
import { VisorToMapMapperService } from '@visor/services/visor-to-map-mapper.service';
import { VisorService } from '@visor/services/visor.service';

@Component({
  selector: 'app-visor-layout',
  templateUrl: './visor-layout.component.html',
  styleUrl: './visor-layout.component.scss'
})
export class VisorLayoutComponent implements OnInit {

  private readonly visorToMapMapperService = inject(VisorToMapMapperService);
  private readonly mapService = inject(MapService);
  private readonly visorService = inject(VisorService);

  config = computed(() => this.visorService.config());
  map = computed(() => this.mapService.map());

  ngOnInit(): void {
    this.setUpVisor();
  }

  private setUpVisor(): void {
    this.visorService.setVisorState(visorConfig);
    this.mapService.createMap$.next(
      this.visorToMapMapperService.transform(this.config()!)
    );
    this.mapService.populateMap(this.config()!);
    this.mapService.applyConfigData(this.config()!);
  }
}
