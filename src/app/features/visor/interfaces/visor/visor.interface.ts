import { Extent } from 'ol/extent';
import { IReadService } from '../layers/service.interface';
import { ISpatialReference } from '../spatial-reference.interface';
import { ITool } from '../tool/tool.interface';

export interface IReadVisor {
  name: string;
  spatialReference: ISpatialReference;
  scalesDenominators: Array<number>;
  extent: Extent;
  servicesFiltersOthers?: IReadService[];
  servicesFiltersResources?: IReadService[];
  servicesBase?: IReadService[];
  //serviciosOverview?: IReadService[];
  tools: ITool[];
}
