import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CursorStyle } from '@visor/enums/cursor.enum';
import { GameandgisMap } from '@visor/models/map/gameandgis-map';
import { MapService } from '@visor/services/map.service';

@Component({
  selector: 'app-visor-map',
  templateUrl: './visor-map.component.html',
  styleUrl: './visor-map.component.scss'
})
export class VisorMapComponent implements AfterViewInit {
  mapService = inject(MapService);

  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;

  @Input('map') map!: GameandgisMap | null;

  constructor() {}

  ngAfterViewInit(): void {
    this.map?.setTarget(this.mapRef.nativeElement);

    this.mapService.setCursor(CursorStyle.default);
  }
}
