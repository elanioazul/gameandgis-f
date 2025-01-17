/* eslint-disable no-underscore-dangle */
import { IReadCapa } from '@visor/interfaces/dto/capa.dto';
import { ILayer } from '@visor/interfaces/layers/layer.interface';
import { IExtendedReadService } from '@visor/interfaces/layers/service.extended.interface';
import { GameandgisService } from './gameandgis-service';
import { MVTLayer } from '../../interfaces/layers/mvt-layer.interface';
import { MVTGameandgisLayer } from './mvt-layer';
import { Extent } from 'ol/extent';
import { ProjUtilities } from '../../utils/utils-proj';
import { EPSGs } from '@visor/enums/epsgs.enum';
import { get as getProjection } from 'ol/proj';

export class MVTGameandgisService extends GameandgisService {
    private _projection!: string;
    get projection(): string {
      return this._projection;
    }
  constructor(private options: IExtendedReadService, projection?: string) {
    super(options);
    if (projection) {
        this._projection = projection;
      }
    if (options.layers && options.layers.length > 0) {
      this._layers = this.setLayers(options.layers);
    }
  }

  public createLayer(layer: IReadCapa): MVTGameandgisLayer {
    const commonLayerProps: ILayer = {
      id: layer.id,
      name: layer.name,
      url: this.url,
      showInLegend: this.showInLegend,
      format: this.format,
      opacity: this.opacity,
      type: this.type,
      visible: layer.checked || false,
      serviceId: this.id,
      extent:
        this.extent !== null
          ? this.reprojectExtentToServiceProjection(
              this.extent,
              this.projection
            )
          : this.extent,
      maxZoom: layer.maxZoom,
      minZoom: layer.minZoom,
      maxResolution: null,
      minResolution: null,
      zIndex: undefined,
    };
    const mvtLayerProps: MVTLayer = {
      ...commonLayerProps,
      identifier: layer.identificator,
      className: layer.className || '',
      projection: this.projection,
      matrixSet: this.matrixSet,
      scaleDenominators: this.scaleDenominators,
      topLeftCorner: this.topLeftCorner,
    };
    return new MVTGameandgisLayer(mvtLayerProps);
  }

  protected setLayers(layers: IReadCapa[]): MVTGameandgisLayer[] {
    return (layers as IReadCapa[]).map((lyr) => this.createLayer(lyr));
  }

  protected reprojectExtentToServiceProjection(
    extent: Extent,
    epsg: string
  ): Extent {
    const lowerCornerTransformed = ProjUtilities.transform(
      [extent[0], extent[1]],
      EPSGs.EPSG4326,
      epsg
    );
    const upperCornerTransformed = ProjUtilities.transform(
      [extent[2], extent[3]],
      EPSGs.EPSG4326,
      epsg
    );
    const outExtent = lowerCornerTransformed.concat(upperCornerTransformed);
    const projection = getProjection(epsg);
    const projectionExtent = projection?.getExtent();
    if (projectionExtent) {
      ProjUtilities.enlargeExtentForGivenProjection(epsg, outExtent);
    } else {
      ProjUtilities.setExtentToProjection(epsg, outExtent);
    }
    return outExtent;
  }
}
