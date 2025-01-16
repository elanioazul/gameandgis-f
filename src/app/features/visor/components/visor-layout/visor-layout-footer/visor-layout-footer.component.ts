import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { epsgOptions } from '@visor/consts/epsg-options';
import { IepsgTypes } from '@visor/interfaces/epsg/epsg-options.interface';
import { MapService } from '@visor/services/map.service';
import { addMouseControlToMap } from '@visor/utils/utils-ol';
import { EPSGCode } from '@visor/types/epsg-code';
import { MousePosition } from 'ol/control';
import { ProjUtilities } from '@visor/utils/utils-proj';
import { COORDS_EPSG_FORMATS_TO_DISPLAY } from '@visor/consts/mouse-coords-units';

@Component({
  selector: 'app-visor-layout-footer',
  templateUrl: './visor-layout-footer.component.html',
  styleUrl: './visor-layout-footer.component.scss'
})
export class VisorLayoutFooterComponent implements AfterViewInit {
  @ViewChild('coordinates') private coordinatesDiv!: ElementRef<HTMLDivElement>;

  options: IepsgTypes[] | undefined;
  selectedByDefault!: IepsgTypes;

  mapService = inject(MapService);

  constructor() {}

  ngOnInit() {
    this.options = epsgOptions;
    //this.selectedByDefault = this.mapService.map()!.getView().getProjection().getCode();
    this.selectedByDefault = epsgOptions[4]
}

  ngAfterViewInit(): void {
    addMouseControlToMap(this.coordinatesDiv.nativeElement, this.mapService.map()!);
  }


  onSelection(event: any): void {
    const epsgString: EPSGCode = 'EPSG:' + event.value.subtypeCode as EPSGCode;
    this.changeCoordsOutput(epsgString)
  }

  changeCoordsOutput(epsgSelected: EPSGCode): void {
    const mouseControl = this.mapService.map()!.getControls().getArray().find(control => control instanceof MousePosition) as MousePosition;
    if (mouseControl) {
      mouseControl.setProjection(this.mapService.map()!.getView().getProjection());

      mouseControl.setCoordinateFormat((coordinates: any) => {
        if (!coordinates) {
          return 'Coordinates not available';
        }

        const transformedCoordinates = ProjUtilities.transform(
          coordinates,
          this.mapService.map()!.getView().getProjection().getCode(),
          epsgSelected
        );
        const formatFunction = COORDS_EPSG_FORMATS_TO_DISPLAY[epsgSelected] || COORDS_EPSG_FORMATS_TO_DISPLAY['EPSG:25830'];
        return formatFunction(transformedCoordinates);
      });
    }
  }

}
