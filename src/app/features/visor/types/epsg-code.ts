import { COORDS_EPSG_FORMATS_TO_DISPLAY } from "@visor/consts/mouse-coords-units";

export type EPSGCode = keyof typeof COORDS_EPSG_FORMATS_TO_DISPLAY;
