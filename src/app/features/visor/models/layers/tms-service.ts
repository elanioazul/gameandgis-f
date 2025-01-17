/* eslint-disable no-underscore-dangle */
import { TMSGameandgisLayer } from './tms-layer';
import { IReadCapa } from '@visor/interfaces/dto/capa.dto';
import { ILayer } from '@visor/interfaces/layers/layer.interface';
import { IExtendedReadService } from '@visor/interfaces/layers/service.extended.interface';
import { GameandgisService } from './gameandgis-service';
import { ITMSLayer } from '../../interfaces/layers/tms-layer.interface';

export class TMSGameandgisService extends GameandgisService {
  constructor(private options: IExtendedReadService) {
    super(options);
    if (options.layers && options.layers.length > 0) {
      this._layers = this.setLayers(options.layers);
    }
  }

  public createLayer(layer: IReadCapa): TMSGameandgisLayer {
    const commonLayerProps: ILayer = {
      id: layer.id,
      name: layer.name,
      url: this.url,
      showInLegend: this.showInLegend,
      format: this.format,
      opacity: this.opacity,
      type: this.type,
      visible: true,//this.type === 'base' ? false : true,
      serviceId: this.id,
      extent: this.extent,
      maxZoom: layer.maxZoom,
      minZoom: layer.minZoom,
      maxResolution: null,
      minResolution: null,
      zIndex: undefined,
    };
    const tmsLayerProps: ITMSLayer = {
      ...commonLayerProps,
      identifier: layer.identificator,
      className: layer.className || ''
    };
    return new TMSGameandgisLayer(tmsLayerProps);
  }

  protected setLayers(layers: IReadCapa[]): TMSGameandgisLayer[] {
    return (layers as IReadCapa[]).map((lyr) => this.createLayer(lyr));
  }
}
