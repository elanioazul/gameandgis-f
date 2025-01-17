import { get as getProjection, Projection, transformExtent, transform } from 'ol/proj';
import { ISpatialReference } from '../interfaces/spatial-reference.interface';
import proj4x from 'proj4';
import { register } from 'ol/proj/proj4';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import { getWidth as extentGetWidth } from 'ol/extent.js';
import { EPSGs } from '../enums/epsgs.enum';
import { Proj4js } from '@visor/enums/proj4js.enum';

export class ProjUtilities {
    public static getOlProj(spatialReference: ISpatialReference): Projection {
		const epsgCode = `${spatialReference.authority}:${spatialReference.srid}`;
		proj4x.defs([
			[
				epsgCode,
				spatialReference.proj4js
			],
			[
				EPSGs.EPSG3857,
				Proj4js.EPSG3857
			],
			[
				EPSGs.EPSG4326,
				Proj4js.EPSG4326
			],
			[
				EPSGs.EPSG4258,
				Proj4js.EPSG4258
			],
			[
				EPSGs.EPSG25829,
				Proj4js.EPSG25829
			],
			[
				EPSGs.EPSG25830,
				Proj4js.EPSG25830
			],
			[
				EPSGs.EPSG25831,
				Proj4js.EPSG25831
			]
		]);
		register(proj4x);
        return getProjection(epsgCode) ?? new Projection({
            code: EPSGs.EPSG3857,
            extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
            units: 'm',
        });
	}

	public static transformExtent(
		extent: Extent,
		fromCode: string,
		toCode: string
	): Extent {
		return transformExtent(extent, fromCode, toCode);
	}

	public static transform(
		coords: Coordinate,
		fromCode: string,
		toCode: string
	): Extent {
		return transform(coords, fromCode, toCode);
	}

	public static enlargeExtentForGivenProjection(epsg: string, extent: Extent): void {
		const projection = getProjection(epsg);
		const projectionExtent = projection?.getExtent();
		const currentProjectionWidth = extentGetWidth(projectionExtent!)
		const width = extentGetWidth(extent);
		if (width > currentProjectionWidth) {
			this.setExtentToProjection(epsg, extent)
		}
	}

	public static setExtentToProjection(epsg: string, extent: Extent): void {
		getProjection(epsg)?.setExtent([
			extent[0],
			extent[1],
			extent[2],
			extent[3],
		]);
	}
}
