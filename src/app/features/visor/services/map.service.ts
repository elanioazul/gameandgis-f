import { computed, Injectable, signal } from '@angular/core';
import { standardizedRenderingPixelSize } from '@visor/consts/pixel-size';
import { CursorStyle } from '@visor/enums/cursor.enum';
import { EPSGs } from '@visor/enums/epsgs.enum';
import { LayerConfigTypes, LayerTypes } from '@visor/enums/layers-type.enum';
import { IExtendedReadService } from '@visor/interfaces/layers/service.extended.interface';
import { IReadService } from '@visor/interfaces/layers/service.interface';
import { IMap } from '@visor/interfaces/map/gamenandgis-map.interface';
import { IReadVisor } from '@visor/interfaces/visor/visor.interface';
import { GameandgisLayer } from '@visor/models/layers/gameandgis-layer';
import { GameandgisService } from '@visor/models/layers/gameandgis-service';
import { MVTGameandgisService } from '@visor/models/layers/mvt-service';
import { TMSGameandgisService } from '@visor/models/layers/tms-service';
import { WMTSGameandgisService } from '@visor/models/layers/wmts-service';
import { GameandgisMap } from '@visor/models/map/gameandgis-map';
import { ServiceType } from '@visor/types/ol-layer-service.types';
import { ProjUtilities } from '@visor/utils/utils-proj';
import { Extent } from 'ol/extent';
import { FitOptions } from 'ol/View';
import { Subject } from 'rxjs';


export interface MapState {
  map: GameandgisMap | null;
  viewScale: string | null;
  viewZoomLevel: number | null;
  services: GameandgisService[];
  predefinedExtent: Extent | null;
  created: boolean;
}

export class MapService {
  // state
  private readonly state = signal<MapState>({
    map: null,
    viewScale: null,
    viewZoomLevel: null,
    services: [],
    predefinedExtent: null,
    created: false,
  });

  // selectors
  public readonly map = computed(() => this.state().map);
  public readonly services = computed(() => this.state().services);
  viewScale = computed(() => this.state().viewScale);
  viewZoomLevel = computed(() => this.state().viewZoomLevel);

  //sources
  public createMap$ = new Subject<IMap>();
  private readonly setPredefinedExtent$ = new Subject<Extent>();
  private readonly setService$ = new Subject<GameandgisService>();
  private readonly removeService$ = new Subject<GameandgisService>();

  /*
    selectors of LayerConfigTypes.base
  */
    public baseLayers = computed(() =>
      this.state().services.flatMap((srv) =>
        srv.layers.filter((lyr) => lyr.type === LayerConfigTypes.base)
      ).reverse()
    );

    constructor() {
      this.createMap$.subscribe((mapProps: IMap) =>
        this.state.update((state) => ({
          ...state,
          map: this.createMap(mapProps),
          created: true,
        }))
      );

      this.setPredefinedExtent$.subscribe({
        next: (extent: Extent) =>
          this.state.update((state) => ({
            ...state,
            predefinedExtent: extent,
          })),
      });

      this.setService$
        .subscribe((service: GameandgisService) =>
          this.state.update((state) => ({
            ...state,
            services: [...state.services, service],
          }))
        );

      this.removeService$
        .subscribe((removed: GameandgisService) =>
          this.state.update((state) => ({
            ...state,
            services: state.services.filter(
              (service) => service.id !== removed.id
            ),
          }))
        );
    }

    public createMap(props: IMap): GameandgisMap {
      return new GameandgisMap(props);
    }

    private addLayer(layer: GameandgisLayer, zIndex: number): void {
      layer.ol.setZIndex(zIndex);
      this.map()?.addLayer(layer.ol);
      layer.zIndex = zIndex;
    }

    // private removeLayer(layer: GameandgisLayer): void {
    //   const lyrs = this.baseLayers()
    //     .concat(this.filterLayers())
    //     .concat(this.filterResourcesLayers())
    //     .concat(this.onTheFlyLayers());
    //   const found = lyrs.find((lyr) => lyr.name === layer.name);
    //   this.map()?.getLayers().remove(found.ol);
    // }

    public addService(service: GameandgisService): void {
      this.setService$.next(service);
      service.layers.forEach((lyr: GameandgisLayer) => {
        this.addLayer(lyr, 150);
        lyr.visible = true;
      });
    }

    // public removeService(service: GameandgisService): void {
    //   //primero se elimina la capa pq al reves la capa ya no estaría accesible en state pero si en mapa
    //   service.layers.forEach((lyr: GameandgisLayer) => {
    //     this.removeLayer(lyr);
    //   });
    //   this.removeService$.next(service);
    // }

    public populateMap(visorConfig: IReadVisor): void {
      let extent = visorConfig.extent;
      const mapProj = this.getMapProjCode();
      // el extent de la config del visor viene en...4326 => transformarlo a 25381 igual que hago en VisorToMapMapperService
      //if (mapProj !== EPSGs.EPSG25830) {
        extent = ProjUtilities.transformExtent(
          visorConfig.extent,
          EPSGs.EPSG4326,
          mapProj
        );
      //}
      this.zoomToExtent(extent);
      this.setPredefinedExtent$.next(extent);
    }

    private getMapProjCode(): string {
      return this.map()!.getView().getProjection().getCode();
    }

    private zoomToExtent(
      extent: Extent,
      padding = false,
      maxZoom?: number
    ): void {
      let fitOptions: FitOptions = {
        size: this.map()!.getSize(),
        nearest: true,
        duration: 250,
        maxZoom: 17,
      };
      if (padding) {
        fitOptions = { ...fitOptions, padding: [300, 300, 300, 300] };
      }
      if (maxZoom) {
        fitOptions = { ...fitOptions, maxZoom };
      }
      this.map()!.getView().fit(extent, fitOptions);
    }

    public applyConfigData(visorConfig: IReadVisor): void {
      if (visorConfig.servicesBase && visorConfig.servicesBase.length > 0) {
        this.handleBaseServices(visorConfig.servicesBase);
      }
      this.processResolutionAndZoomLevel();
    }



  private handleBaseServices(srvs: IReadService[]): void {
    srvs.forEach((serviceInfo) => {
      const service: GameandgisService = this.createService(
        serviceInfo,
        LayerConfigTypes.base
      );
      this.setService$.next(service);
      service.layers.forEach((baseLayer: GameandgisLayer) => {
        this.addLayer(baseLayer, 1);
      });
    });
  }

  public createService(
    serviceInfo: IReadService,
    type: ServiceType
  ): GameandgisService {
    let gameandgisService: GameandgisService;
    const props: IExtendedReadService = { ...serviceInfo, type };
    switch (serviceInfo.host.tipo) {
      case LayerTypes.WMTS:
        gameandgisService = new WMTSGameandgisService(props, this.getMapProjCode());
        break;
      case LayerTypes.TMS:
        gameandgisService = new TMSGameandgisService(props);
        break;
      case LayerTypes.MVT:
        gameandgisService = new MVTGameandgisService(props);
        break;
      default:
        throw new Error(`Unsupported LayerType: ${serviceInfo.host.tipo}`);
    }
    return gameandgisService;
  }

  public setCursor(cursor: CursorStyle): void {
    this.map()!.getViewport().style.cursor = cursor;
  }

  updateMapStateWithScaleAndZoom(scale: string | null, zoom: number | null): void {
    this.state.update((state) => ({ ...state, viewScale: scale, viewZoomLevel: zoom }));
  }

  private processResolutionAndZoomLevel(): void {
    this.map()!.on('moveend', () => {
      const newZoom = this.map()!.getView().getZoom();
      const resolution = this.map()!.getView().getResolution();
      if(resolution) {
      const scale = resolution / (standardizedRenderingPixelSize / 1000); //projection 25831 es metros.
      // const inchesPerMeter = 39.3701;
      // const dotsPerInch = 96;
      // const conversionFactor = inchesPerMeter * dotsPerInch;
      // const scale96 = resolution! * conversionFactor;

      this.updateMapStateWithScaleAndZoom(Math.round(scale).toLocaleString('es-ES'), Math.round(newZoom!));
      this.map()!.render();
      }
    });
  }
}
