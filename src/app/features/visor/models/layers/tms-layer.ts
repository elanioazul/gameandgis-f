import { ILayer } from '../../interfaces/layers/layer.interface';
import { GameandgisLayer } from './gameandgis-layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ITMSLayer } from '../../interfaces/layers/tms-layer.interface';
import XYZ from 'ol/source/XYZ.js';

export class TMSGameandgisLayer extends GameandgisLayer {
  private _identifier: string;

  get identifier() {
    return this._identifier;
  }

  constructor(public options: ITMSLayer) {
    super(options as ILayer);
    this._identifier = options.identifier;
    this.initWrapperTMSLayer();
  }

  private initWrapperTMSLayer(): void {
    this.createVectorLayer();
  }

  private createVectorLayer() {
    this.ol = new TileLayer({
      source: this.createSource(),
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    });
  }

  private createSource(): OSM | XYZ {
    let source;
    if (this.name.indexOf('osmfoundation') !== -1) {
      source = new OSM({
        url: this.url,
        maxZoom: 18,
      });
    } else {
      source = new XYZ({
        url: this.url,
        maxZoom: 18,
      });
    }
    return source;
  }
}
