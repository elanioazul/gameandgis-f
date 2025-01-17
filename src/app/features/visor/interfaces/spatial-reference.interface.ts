export interface ISpatialReference {
	id?: number;
	authority: string;
	proj4js: string;
	srid: number;
}
