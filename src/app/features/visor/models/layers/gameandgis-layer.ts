import { Extent } from 'ol/extent';
import { ServiceType } from '../../types/ol-layer-service.types';
import { olTypes } from '../../types/ol-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILayer } from '../../interfaces/layers/layer.interface';

export abstract class GameandgisLayer {
  private _ol!: olTypes; // Instancia de OpenLayers
  private _id: number | undefined;
  private _name!: string;
  private _serviceId!: number;
  private _displayInLegend!: boolean;
  private _url!: string;
  private _format!: string;
  private _type!: ServiceType;
  private _opacity!: number;
  private _minZoom!: number;
  private _maxZoom!: number;

  private _currentZoom!: number;

  get extent(): Extent | undefined {
    return this.ol?.getExtent();
  }
  set extent(extent: Extent) {
    this.ol?.setExtent(extent);
  }
  get maxResolution(): number {
    return this.ol?.getMaxResolution();
  }
  set maxResolution(maxResolution: number) {
    this.ol?.setMaxResolution(maxResolution);
  }
  get maxZoom(): number {
    return this._maxZoom;
    //return this.ol.getMaxZoom();
  }
  set maxZoom(maxZoom: number) {
    this._maxZoom = maxZoom;
  }
  get minResolution(): number {
    return this.ol?.getMinResolution();
  }
  set minResolution(minResolution: number) {
    this.ol?.setMinResolution(minResolution);
  }
  get minZoom(): number {
    return this._minZoom;
    //return this.ol.getMinZoom();
  }
  set minZoom(minZoom: number) {
    this._minZoom = minZoom;
  }
  get zIndex(): number | undefined {
    return this.ol?.getZIndex();
  }
  set zIndex(zIndex: number) {
    this.ol?.setZIndex(zIndex);
  }

  get currentZoom(): number {
    return this._currentZoom;
  }
  set currentZoom(zoom: number) {
    this._currentZoom = zoom;
    this.updateVisibility();
  }

  get visible(): boolean {
    return this.visibleSource.value;
  }
  set visible(visible: boolean) {
    this.visibleSource.next(visible);
    this.ol?.setVisible(visible);
  }
  get opacity(): number {
    return this._opacity;
  }
  set opacity(opacity: number) {
    this._opacity = opacity;
    this.ol?.setOpacity(opacity);
  }

  get visible$(): Observable<boolean> {
    return this.visibleSource.asObservable();
  }
  get type(): ServiceType {
    return this._type;
  }
  get serviceId(): number {
    return this._serviceId;
  }
  get name(): string {
    return this._name;
  }
  get id(): number | undefined {
    return this._id;
  }
  get displayInLegend(): boolean {
    return this._displayInLegend;
  }

  get ol(): olTypes {
    return this._ol;
  }
  set ol(ol: olTypes) {
    this._ol = ol;
  }
  get url(): string {
    return this._url;
  }
  get format(): string {
    return this._format;
  }

  get className() {
    return this.ol.getClassName();
  }

  private visibleSource = new BehaviorSubject<boolean>(false);

  /*
    Si piden cambio UI al no estar visible la capa,
    aqui sería settear algo (una signal o un BehaviourSubject (lo mismo vale la visibleSource))
    para que los comp CheckboxAccordionComponent y SimpleLayerItemComponent se rendericen de acuerdo al cambio.
    O a lo mejor no hace ni falta, con las propiedades Observable de BaseLaer de ol
    se puede hacer ese mismo juego de renderizado sin tener que hacer uso de
    LayersVisibilityService (lo dejo creado pero ahora no es injectado pq está comentado en VisorMapComponent),
    es decir, que los compo hijo juegen con el ui contra la propiedad visible de baselayer ya que esta es ajustada
    según minZoom and maxZoom
  */
  private updateVisibility(): void {
    const isVisible = this.isEnabled(this.currentZoom);
    //this.visibleSource.next(isVisible);
  }

  isEnabled(currentZoom: number): boolean {
    return currentZoom >= this.minZoom && currentZoom <= this.maxZoom;
  }

  constructor(options: ILayer) {
    this._id = options.id;
    this._name = options.name;
    this._url = options.url;
    this.visible = options.visible;
    this.opacity = options.opacity;
    this._displayInLegend = options.showInLegend;
    this._format = options.format;
    this._type = options.type;
    this.minZoom = options.minZoom;
    this.maxZoom = options.maxZoom;

    if (Object.prototype.hasOwnProperty.call(options, 'serviceId')) {
      this._serviceId = options.serviceId;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'extent')) {
      this.extent = options.extent!;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'zIndex')) {
      this.zIndex = options.zIndex!;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'minResolution')) {
      this.minResolution = options.minResolution!;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'maxResolution')) {
      this.maxResolution = options.maxResolution!;
    }
  }
}
