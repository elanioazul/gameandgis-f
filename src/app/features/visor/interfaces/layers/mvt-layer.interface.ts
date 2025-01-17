import { ILayer } from './layer.interface';
import { Coordinate } from 'ol/coordinate';
export interface MVTLayer extends ILayer {
  identifier: string;
  className: string;
  projection: string;
  matrixSet?: string;
  scaleDenominators?: number[];
  topLeftCorner?: Coordinate | Coordinate[];
}
