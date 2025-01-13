import { ServiceType } from '../../types/ol-layer-service.types';
import { IReadService } from './service.interface';

export interface IExtendedReadService extends IReadService {
  type: ServiceType;
}
