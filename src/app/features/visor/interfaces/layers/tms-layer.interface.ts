import { ILayer } from './layer.interface';

export interface ITMSLayer extends ILayer {
  identifier: string;
  className: string
}
