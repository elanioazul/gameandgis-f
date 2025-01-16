import { COORDS_EPSG_FORMATS_TO_DISPLAY } from "@visor/consts/mouse-coords-units";
import { MousePosition } from "ol/control";
import { Map } from 'ol';

export const addMouseControlToMap = (target: HTMLElement, map: Map) => {
  const mouse = new MousePosition({
    coordinateFormat: (coordinates) => {
      const epsgKey = map
        .getView()
        .getProjection()
        .getCode() as keyof typeof COORDS_EPSG_FORMATS_TO_DISPLAY;
      const formatFunction = COORDS_EPSG_FORMATS_TO_DISPLAY[epsgKey] || COORDS_EPSG_FORMATS_TO_DISPLAY['EPSG:25830'];
      return formatFunction(coordinates);
    },
    target: target,
  });
  map.addControl(mouse);
};
