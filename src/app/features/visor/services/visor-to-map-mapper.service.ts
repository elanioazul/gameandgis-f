import { Injectable } from '@angular/core';
import { MapperGeneric } from '@core/mappers/generic-mapper';
import { IReadVisor } from '../interfaces/visor/visor.interface';
import { IMap } from '../interfaces/map/gamenandgis-map.interface';
import { Extent } from 'ol/extent';
import { GameandgisMapView } from '../models/map/gameandgis-map-view';
import { ProjUtilities } from '../utils/utils-proj';
import { KeyboardPan, defaults as defaultInteractions } from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';
import { Collection } from 'ol';
import { EPSGs } from '../enums/epsgs.enum';
import { meterPerUnit } from '../consts/pixel-size';

@Injectable()
export class VisorToMapMapperService extends MapperGeneric<IReadVisor, IMap> {
  public ProjUtilities = ProjUtilities;
  public  map(props: IReadVisor): IMap {
    const projection = ProjUtilities.getOlProj(props.spatialReference);
    const extent: Extent = ProjUtilities.transformExtent(
      props.extent,
      EPSGs.EPSG4326,
      `EPSG:${props.spatialReference.srid}`
    );
    return {
      view: new GameandgisMapView({
        projection,
        extent,
        enableRotation: false,
        constrainResolution: true,
        resolutions: props.scalesDenominators.map((deniminator: number) => {
          return deniminator * meterPerUnit
        }),
        minZoom: 0,
        maxZoom: 12
      }),
      pixelRatio: 1,
      keyboardEventTarget: document,
      interactions: defaultInteractions().extend([
        new KeyboardPan({
          condition: shiftKeyOnly,
          pixelDelta: 512,
        }),
      ]),
      overlays: [],
      controls: new Collection([]),
    };
  }
}
