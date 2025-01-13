
export interface IReadCapa {
  id: number;
  name: string;
  identificator: string;
  className?: string;
  order?: number;
  defaultStyle?: string;
  maxZoom: number;
  minZoom: number;
  checked?: boolean;
}
