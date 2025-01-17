import { Collection, Overlay } from 'ol';
import { Control } from 'ol/control';
import { Interaction } from 'ol/interaction';
import { GameandgisMapView } from '../../models/map/gameandgis-map-view';

export interface IMap {
  target?: string;
  pixelRatio: number;
  view: GameandgisMapView;
  keyboardEventTarget: Document;
  interactions: Collection<Interaction>;
  controls: Collection<Control>;
  overlays: Overlay[];
}
