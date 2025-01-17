import { Extent } from 'ol/extent';
import { Projection } from 'ol/proj';

export interface IView {
	projection: Projection;
	resolutions?: Array<number>;
	extent?: Extent;
	enableRotation?: boolean;
	// maxZoom: number;
	// minZoom: number
	constrainResolution: boolean
}
