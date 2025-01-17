/* eslint-disable no-underscore-dangle */
import { IReadCapa } from '@visor/interfaces/dto/capa.dto';
import { ILayer } from '@visor/interfaces/layers/layer.interface';
import { IWMTSLayer } from '../../interfaces/layers/wmts-layer-interface';
import { IExtendedReadService } from '@visor/interfaces/layers/service.extended.interface';
import { WMTSGameandgisLayer } from './wmts-layer';
import { Extent } from 'ol/extent';
import { ProjUtilities } from '../../utils/utils-proj';
import { get as getProjection } from 'ol/proj';
import { EPSGs } from '../../enums/epsgs.enum';
import { GameandgisService } from './gameandgis-service';

export class WMTSGameandgisService extends GameandgisService {
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

  public createLayer(layer: IReadCapa): WMTSGameandgisLayer {
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
    const wmtsLayerProps: IWMTSLayer = {
      ...commonLayerProps,
      identifier: layer.identificator,
      matrixSet: this.matrixSet,
      scaleDenominators: this.scaleDenominators,
      topLeftCorner: this.topLeftCorner,
      projection: this.projection,
      selectedStyleName: layer.defaultStyle ? layer.defaultStyle : '',
      className: layer.className || ''
    };
    return new WMTSGameandgisLayer(wmtsLayerProps);
  }

  protected setLayers(layers: IReadCapa[]): WMTSGameandgisLayer[] {
    return layers.map((lyr) => this.createLayer(lyr));
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
