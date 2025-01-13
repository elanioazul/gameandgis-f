import { MVTLayer } from '@visor/interfaces/layers/mvt-layer.interface';
import { ILayer } from '../../interfaces/layers/layer.interface';
import { GameandgisLayer } from './gameandgis-layer';
import MVT from 'ol/format/MVT.js';
import { VectorTile as VectorTileLayer } from 'ol/layer';
import { VectorTile as VectorTileSource } from 'ol/source';
import { TileGrid } from 'ol/tilegrid';
import * as olTilecoord from 'ol/tilecoord';
import * as olproj from 'ol/proj';
import { meterPerUnit } from '../../consts/pixel-size';
import {
  getTopLeft as extentGetTopLeft,
  getWidth as extentGetWidth,
} from 'ol/extent.js';
import { Coordinate } from 'ol/coordinate';

// Matrix heights for each zoom level from your TileMatrixSet from wmts capabilites
const matrixHeights = [18, 36, 72, 198, 396, 791, 1976, 3951, 9877, 19754, 39507, 79014, 197535];
export class MVTGameandgisLayer extends GameandgisLayer {
  private _matrixSet: string;
  private _scaleDenominators: number[] | undefined;
  private _topLeftCorner: Coordinate | Coordinate[] | undefined;
  private _projection: string;

  get projection(): string {
    return this._projection;
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

  constructor(options: MVTLayer) {
    super(options as ILayer);
    this._matrixSet = options.matrixSet!;
    this._scaleDenominators = options.scaleDenominators;
    this._topLeftCorner = options.topLeftCorner;
    this._projection = options.projection;
    this.initVectorTileLayer(options);
  }

  private initVectorTileLayer(options: MVTLayer): void {
    const projection = olproj.get(this.projection);
    const projectionExtent = projection!.getExtent();

    // Custom Tile URL function to handle inverted Y
    const tileUrlFunction = (tileCoord: olTilecoord .TileCoord) => {
      // Ensure tileCoord has three elements
      if (tileCoord.length < 3) {
        throw new Error("Invalid tile coordinate");
      }
      const z = tileCoord[0]; // Zoom level
      const x = tileCoord[1]; // X index
      const y = tileCoord[2]; // Non-inverted Y index
      const invertedY = this.calculateInvertedYIndex(y, z); // Calculate inverted Y
      return `${options.url}/1.0.0/${options.identifier}@${this.matrixSet}@pbf/${z}/${x}/${invertedY}.pbf`;
    };

    const defaultTileGrid: TileGrid = this.createDefaultTileGrid(
      this.projection
    );
    const scaleDenominatorTileGrid: TileGrid =
      this.createTileGridBasedOnScaleDenominator(
        this.projection,
        this.scaleDenominators!,
        this.topLeftCorner!
      );
    const layerSource = new VectorTileSource({
      format: new MVT(),
      url: undefined,
      projection: this.projection,
      tileGrid:
        this.scaleDenominators === undefined && this.topLeftCorner === undefined
          ? defaultTileGrid
          : scaleDenominatorTileGrid,
    });

    layerSource.setTileUrlFunction(tileUrlFunction);

    const tileGridsArtifact = layerSource.getTileGrid();

    this.ol = new VectorTileLayer({
      source: layerSource,
      minResolution: tileGridsArtifact?.getResolution(tileGridsArtifact.getMaxZoom()),
      maxResolution: tileGridsArtifact?.getResolution(tileGridsArtifact.getMinZoom()),
      renderMode: 'hybrid',
      visible: this.visible,
      opacity: this.opacity,
      extent: projectionExtent,
    });
  }

  private createDefaultTileGrid(epsg: string): TileGrid {
    const projection = olproj.get(epsg);
    const projectionExtent = projection!.getExtent();
    const size = extentGetWidth(projectionExtent) / 256;
    const resolutions = new Array(20);
    for (let z = 0; z < 20; ++z) {
      resolutions[z] = size / Math.pow(2, z);
    }

    return new TileGrid({
      origin: extentGetTopLeft(projectionExtent),
      resolutions,
      extent: projectionExtent,
    });
  }

  private createTileGridBasedOnScaleDenominator = (
    epsg: string,
    scaleDenominators: number[],
    topLeftCorner: Coordinate | Coordinate[]
  ): TileGrid => {
    const projection = olproj.get(epsg);
    const projectionExtent = projection!.getExtent();

    const resolutions = new Array(scaleDenominators.length);
    for (let z = 0; z < scaleDenominators.length; ++z) {
      resolutions[z] = meterPerUnit * scaleDenominators[z];
    }

    const isArrayOfCoordinates = (array: unknown): array is Coordinate[] => {
      return (
        Array.isArray(array) &&
        array.every((entry) => Array.isArray(entry) && entry.length === 2)
      );
    };

    if (!isArrayOfCoordinates(topLeftCorner)) {
      return new TileGrid({
        origin: topLeftCorner /*extentGetTopLeft(projectionExtent),*/,
        resolutions,
        tileSize: 256,
        extent: projectionExtent,
      });
    } else {
      return new TileGrid({
        origins: topLeftCorner /*extentGetTopLeft(projectionExtent),*/,
        resolutions,
        tileSize: 256,
        extent: projectionExtent,
      });
    }
  };

  private calculateInvertedYIndex = (y: number, zoomLevel: number) =>{
    // Get the MatrixHeight for the given zoom level
    const matrixHeight = matrixHeights[zoomLevel];
    // Calculate the inverted Y index
    return matrixHeight - 1 - y;
  }
}
