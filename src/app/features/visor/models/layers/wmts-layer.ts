import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { GameandgisLayer } from './gameandgis-layer';
import { WMTS } from 'ol/source';
import { Tile } from 'ol/layer';
import { IWMTSLayer } from '../../interfaces/layers/wmts-layer-interface';
import { ILayer } from '../../interfaces/layers/layer.interface';
import * as olproj from 'ol/proj';
import {
  getTopLeft as extentGetTopLeft,
  getWidth as extentGetWidth,
} from 'ol/extent.js';
import { EPSGs } from '../../enums/epsgs.enum';
import { Coordinate } from 'ol/coordinate';
import { meterPerUnit } from '../../consts/pixel-size';
export class WMTSGameandgisLayer extends GameandgisLayer {
  private _matrixSet: string;
  private _scaleDenominators: number[] | undefined;
  private _topLeftCorner: Coordinate | Coordinate[] | undefined;
  private _activeStyleName: string;
  private _className: string;
  private _identifier: string;
  private _projection: string;

  get identifier(): string {
    return this._identifier;
  }
  get matrixSet(): string {
    return this._matrixSet;
  }
  get scaleDenominators(): number[] | undefined {
    return this._scaleDenominators;
  }
  get topLeftCorner(): Coordinate | Coordinate[] | undefined {
    return this._topLeftCorner;
  }
  get activeStyleName(): string {
    return this._activeStyleName;
  }
  get projection(): string {
    return this._projection;
  }

  constructor(options: IWMTSLayer) {
    super(options as ILayer);
    this._matrixSet = options.matrixSet!;
    this._scaleDenominators = options.scaleDenominators;
    this._topLeftCorner = options.topLeftCorner;
    this._projection = options.projection;
    this._identifier = options.identifier;
    this._activeStyleName = options.selectedStyleName
      ? options.selectedStyleName
      : '';
    this._className = options.className;
    this.initWrapperWMTSLayer();
  }

  public select() {}
  public clearSelect() {}

  private initWrapperWMTSLayer() {
    const defaultTileGrid: WMTSTileGrid = this.createDefaultTileGrid(
      this.projection
    );
    const scaleDenominatorTileGrid: WMTSTileGrid =
      this.createTileGridBasedOnScaleDenominator(
        this.projection,
        this.scaleDenominators!,
        this.topLeftCorner!
      );

    const layerSource = new WMTS({
      url: this.url,
      matrixSet: this.matrixSet,
      format: this.format,
      layer: this.identifier,
      tileGrid:
        this.scaleDenominators === undefined && this.topLeftCorner === undefined
          ? defaultTileGrid
          : scaleDenominatorTileGrid,
      style: this.activeStyleName,
      projection: EPSGs.EPSG25831,
      version: '1.0.0',
    });

    const tileGrid = layerSource.getTileGrid();

    const projection = olproj.get(this.projection);
    const projectionExtent = projection!.getExtent();

    this.ol = new Tile({
      className: this._className,
      source: layerSource,
      visible: this.visible,
      opacity: this.opacity,
      minResolution: tileGrid?.getResolution(tileGrid.getMaxZoom()),
      maxResolution: tileGrid?.getResolution(tileGrid.getMinZoom()),
      extent: projectionExtent,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    });
  }

  private createDefaultTileGrid(epsg: string): WMTSTileGrid {
    const projection = olproj.get(epsg);
    const projectionExtent = projection!.getExtent();
    const size = extentGetWidth(projectionExtent) / 256;
    const resolutions = new Array(20);
    const matrixIds = new Array(20);
    for (let z = 0; z < 20; ++z) {
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    return new WMTSTileGrid({
      origin: extentGetTopLeft(projectionExtent),
      resolutions,
      matrixIds,
      extent: projectionExtent,
    });
  }

  private createTileGridBasedOnScaleDenominator = (
    epsg: string,
    scaleDenominators: number[],
    topLeftCorner: Coordinate | Coordinate[]
  ): WMTSTileGrid => {
    const projection = olproj.get(epsg);
    const projectionExtent = projection!.getExtent();

    const matrixIds = new Array(scaleDenominators.length);
    const resolutions = new Array(scaleDenominators.length);
    for (let z = 0; z < scaleDenominators.length; ++z) {
      resolutions[z] = meterPerUnit * scaleDenominators[z];
      //para pnoa ese '0' no es requerido, pero para icgc y chronos si (aunque icgc se lo come sin y chronos no)
      matrixIds[z] = z;
    }

    const isArrayOfCoordinates = (array: unknown): array is Coordinate[] => {
      return (
        Array.isArray(array) &&
        array.every((entry) => Array.isArray(entry) && entry.length === 2)
      );
    };

    if (!isArrayOfCoordinates(topLeftCorner)) {
      return new WMTSTileGrid({
        origin: topLeftCorner /*extentGetTopLeft(projectionExtent),*/,
        resolutions,
        matrixIds,
        tileSize: [256, 256],
        extent: projectionExtent,
      });
    } else {
      return new WMTSTileGrid({
        origins: topLeftCorner /*extentGetTopLeft(projectionExtent),*/,
        resolutions,
        matrixIds,
        tileSize: [256, 256],
        extent: projectionExtent,
      });
    }
  };
}
