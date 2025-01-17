import { IMap } from '@visor/interfaces/map/gamenandgis-map.interface';
import { Map } from 'ol';

export class GameandgisMap extends Map {
  constructor(props: IMap) {
    super(props);
  }
}
