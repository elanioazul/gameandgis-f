import { IHost } from '../host.interface';
import { IReadCapa } from '../dto/capa.dto';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
export interface IReadService {
  id: number;
  name: string;
  alias: string;
  description: string;
  displayInLegend: boolean;
  identifiable: boolean;
  tiled: boolean | null;
  format: string;
  opacity: number;
  host: IHost;
  layers: IReadCapa[];
  extent: Extent | null;
  matrixSet: string | undefined;
  scaleDenominators: number[] | undefined;
  topLeftCorner: Coordinate | Coordinate[] | undefined;
  features?: Feature<Geometry>[] | undefined;
  clusterSource?: boolean | undefined;
  minZoom: number | null;
  maxZoom: number | null;
  visible: boolean;
}
