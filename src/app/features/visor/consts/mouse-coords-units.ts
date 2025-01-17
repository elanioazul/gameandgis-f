export const COORDS_EPSG_FORMATS_TO_DISPLAY = {
  'EPSG:4326': (coordinates: number[] | undefined) => {
    if (!coordinates) return 'Coordinates not available';
    const lon = coordinates?.[0].toFixed(3);
    const lat = coordinates?.[1].toFixed(3);
    return `lon: ${lon}, lat: ${lat} WGS84 Geogràfiques (4326)`;
  },
  'EPSG:4258': (coordinates: number[] | undefined) => {
    if (!coordinates) return 'Coordinates not available';
    const lon = coordinates?.[0].toFixed(3);
    const lat = coordinates?.[1].toFixed(3);
    return `lon: ${lon}, lat: ${lat} ETRS Geográficas (4258) GD`;
  },
  'EPSG:3857': (coordinates: number[] | undefined) => {
    if (!coordinates) return 'Coordinates not available';
    const x = coordinates?.[0].toFixed(3);
    const y = coordinates?.[1].toFixed(3);
    return `x: ${x}, y: ${y} WGS84 PseudoMercator (3857)`;
  },
  'EPSG:25830': (coordinates: number[] | undefined) => {
    if (!coordinates) return 'Coordinates not available';
    const easting = coordinates?.[0].toFixed(3);
    const northing = coordinates?.[1].toFixed(3);
    return `x: ${easting}, y: ${northing} ETRS89 UTM uso 30N (25830)`;
  },
  'EPSG:25831': (coordinates: number[] | undefined) => {
    if (!coordinates) return 'Coordinates not available';
    const easting = coordinates?.[0].toFixed(3);
    const northing = coordinates?.[1].toFixed(3);
    return `x: ${easting}, y: ${northing} ETRS89 UTM uso 31N (25831)`;
  },
  'EPSG:25829': (coordinates: number[] | undefined) => {
    if (!coordinates) return 'Coordinates not available';
    const easting = coordinates?.[0].toFixed(3);
    const northing = coordinates?.[1].toFixed(3);
    return `x: ${easting}, y: ${northing} ETRS89 UTM uso 29N (25829)`;
  },
};
