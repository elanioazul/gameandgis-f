import { Proj4js } from "@visor/enums/proj4js.enum";
import { IReadVisor } from "@visor/interfaces/visor/visor.interface";
import { scaleDenominatorsIgnWmts, topLeftCornersIgnWmtsPNOA } from "./scale-denominators-ign";
import { extentConstraint, extentPnoa } from "./extents";
import { EPSGs } from "@visor/enums/epsgs.enum";
import { Formats } from "@visor/enums/formats";
import { LayerTypes } from "@visor/enums/layers-type.enum";


export const visorConfig: IReadVisor = {
  name: 'Gameandgis-visor',
  spatialReference: {
    proj4js: Proj4js.EPSG25830,
    authority: 'EPSG',
    srid: 25830,
  },
  scalesDenominators: scaleDenominatorsIgnWmts,
  extent: extentConstraint,
  servicesBase: [
    {
			id: 0,
			name: 'OI.OrthoimageCoverage',
			alias: 'Ortoimágenes de España (satélite Sentinel2 y ortofotos del PNOA máxima actualidad)',
			description: `Ortofotos de máxima actualidad del proyecto PNOA (Plan Nacional de Ortofotografía Aérea) visibles a partir de una escala aproximada 1:70.000. Para escalas menores se visualizan las imágenes de satélite Sentinel2 de 10 metros de resolución. Ortoimagen Melilla: Pléiades Neo © Airbus DS (2022). La cobertura PNOA está constituida por mosaicos de distinta fecha de adquisición y distinta resolución (50 y 25 cm). Los datos PNOA se actualizan varias veces al año y los datos Sentinel2 se actualizan semestralmente. Las imágenes mundiales de fondo provienen del espectrorradiómetro de imágenes de resolución moderada de la NASA (MODIS).Estas actualizaciones se anuncian en el canal RSS del IGN (https://www.ign.es/ign/rss). Servicio de visualización Teselado conforme al perfil INSPIRE de Web Map Tile Service (WMTS) 1.0.0. Las teselas se pregeneran en formato JPEG y hasta el nivel 19 (correspondiente con una escala aproximada 1:1.000) en el Sistema de Referencia por Coordenadas WGS84 Web Mercator (EPSG:3857).`,
			opacity: 1.0,
			identifiable: false,
			displayInLegend: false,
			format: Formats.jpeg,
			extent: extentConstraint,
			matrixSet: EPSGs.EPSG25830,
			scaleDenominators: scaleDenominatorsIgnWmts,
			topLeftCorner: topLeftCornersIgnWmtsPNOA,
			minZoom: null,
			maxZoom: null,
			tiled: true,
			host: {
				url: 'https://www.ign.es/wmts/pnoa-ma?',
				tipo: LayerTypes.WMTS,
			},
			visible: true,
			layers: [
        {
          id: 0,
          name: 'PNOA WMTS',
          identificator: 'OI.OrthoimageCoverage',
          className: 'PNOA WMTS',
          minZoom: 0,
          maxZoom: 19,
          checked: true
        },
			]
		}
  ],
  servicesFiltersResources: [],
  servicesFiltersOthers: [],
  tools: []
};
