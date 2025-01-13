import { IReadCapa } from '@visor/interfaces/dto/capa.dto';
import { ServiceType } from '../../types/ol-layer-service.types';

import { IExtendedReadService } from '@visor/interfaces/layers/service.extended.interface';
import { Extent } from 'ol/extent';
import { GameandgisLayer } from './gameandgis-layer';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';

export abstract class GameandgisService {
  protected _layers!: GameandgisLayer[];

  private _id!: number;
  private _name!: string;
  private _alias!: string;
  private _description!: string;
  private _url!: string;
  private _opacity!: number;
  private _extent!: Extent | null;
  private _tiled!: boolean | null;
  private _format!: string;
  private _queryable!: boolean;
  private _showInLegend!: boolean;
  private _matrixSet?: string;
  private _scaleDenominators?: number[];
  private _topLeftCorner?: Coordinate | Coordinate[];
  private _features?: Feature[];
  private _clusterSource?: boolean;
  private _minZoom!: number | null;
  private _maxZoom!: number | null;

  private _type!: ServiceType;

  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get alias(): string {
    return this._alias;
  }
  get description(): string {
    return this._description;
  }
  get url(): string {
    return this._url;
  }
  get opacity(): number {
    return this._opacity;
  }
  get extent(): Extent | null {
    return this._extent;
  }
  get tiled(): boolean | null {
    return this._tiled;
  }
  get format(): string {
    return this._format;
  }
  get queryable(): boolean {
    return this._queryable;
  }
  get showInLegend(): boolean {
    return this._showInLegend;
  }
  get matrixSet(): string | undefined {
    return this._matrixSet;
  }
  get scaleDenominators(): number[] | undefined {
    return this._scaleDenominators;
  }
  get topLeftCorner(): Coordinate | Coordinate[] | undefined {
    return this._topLeftCorner;
  }
  get features(): Feature[] | undefined {
    return this._features;
  }
  get clusterSource(): boolean | undefined {
    return this._clusterSource;
  }
  get minZoom(): number | null {
    return this._minZoom;
  }
  get maxZoom(): number | null {
    return this._maxZoom;
  }
  get layers(): GameandgisLayer[] {
    return this._layers;
  }
  get type(): ServiceType {
    return this._type;
  }

  constructor(options: IExtendedReadService) {
    this._id = options.id;
    this._alias = options.alias;
    this._url = options.host.url;
    this._opacity = options.opacity;
    this._tiled = options.tiled;
    this._format = options.format;
    this._showInLegend = options.displayInLegend;
    this._type = options.type;

    if (Object.prototype.hasOwnProperty.call(options, 'name')) {
      this._name = options.name;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'description')) {
      this._description = options.description;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'extent')) {
      this._extent = options.extent;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'matrixSet')) {
      this._matrixSet = options.matrixSet;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'scaleDenominators')) {
      this._scaleDenominators = options.scaleDenominators;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'topLeftCorner')) {
      this._topLeftCorner = options.topLeftCorner;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'features')) {
      this._features = options.features;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'clusterSource')) {
      this._clusterSource = options.clusterSource;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'maxZoom')) {
      this._maxZoom = options.maxZoom;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'minZoom')) {
      this._minZoom = options.minZoom;
    }
  }

  protected abstract setLayers(layers: IReadCapa[]): GameandgisLayer[];
}
