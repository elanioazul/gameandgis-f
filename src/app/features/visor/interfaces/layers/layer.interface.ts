import { Extent } from 'ol/extent';
import { ServiceType } from '@visor/types/ol-layer-service.types';

export interface ILayer {
	/* Correspondientes a BaseLayer OL src: https://openlayers.org/en/latest/apidoc/module-ol_layer_Base-BaseLayer.html */
	// className: string; // default value 'ol-layer'
	opacity: number; // default value 1
	visible: boolean; // default value true
	/* Correspondientes a BaseLayer OL src: https://openlayers.org/en/latest/apidoc/module-ol_layer_Base-BaseLayer.html */
	/* Como pueden ser undefined se incluyen en las opcionales */
	extent: Extent | null;
	zIndex: number | undefined;
	minResolution: number | null;
	maxResolution: number | null;
	minZoom: number;
	maxZoom: number;
	/* Customización/gestión propia */
	id?: number;
	name: string;
	showInLegend: boolean;
	url: string;
	format: string;
	type: ServiceType;
	serviceId: number;
}
