import { Image, Tile, VectorTile } from 'ol/layer';
import VectorLayer from 'ol/layer/Vector';
import { ImageWMS, TileWMS, WMTS } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export type olTypes =
  | Image<ImageWMS>
  | Tile<TileWMS>
  | Tile<WMTS>
  | VectorLayer<VectorSource<Feature<Geometry>>>
  | TileLayer<OSM>
  | VectorTile;
