import { ToolComponent } from '@visor/components/visor-layout/visor-layout-tools/tools-warehouse/tool/tool.component';
import { toolType } from '../../enums/tool-type.enum';

export interface ITool {
  id: number;
  key: string;
  name: string;
  description?: string;
  widget?: () => Promise<typeof ToolComponent>;
  config: IToolConfig;
  param?: unknown;
}

export interface IToolConfig {
  icon: string;
    tooltipMessage: string,
    type: toolType;
    active?: boolean;
}
