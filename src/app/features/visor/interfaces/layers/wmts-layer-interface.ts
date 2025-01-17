import { ILayer } from './layer.interface';
import { Coordinate } from 'ol/coordinate';
export interface IWMTSLayer extends ILayer {
  matrixSet?: string;
  scaleDenominators?: number[];
  topLeftCorner?: Coordinate | Coordinate[];
  identifier: string;
  projection: string;
  selectedStyleName?: string;
  className: string,
}
