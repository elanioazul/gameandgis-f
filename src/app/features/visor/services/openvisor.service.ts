import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from '@core/services/shared.service';
import { WindowName } from '@shared/enums/window-name';
import { Coordinate } from 'ol/coordinate';
import { Paths } from '@shared/enums/paths';

@Injectable({
  providedIn: 'root'
})
export class OpenvisorService {

  private readonly cataloniaCentroid: Coordinate = [1.51890092, 41.74646618];

  private readonly sharedService: SharedService = inject(SharedService);
  private readonly router: Router = inject(Router);
  private readonly location: Location = inject(Location);

  public openVisor(lon: number, lat: number, zoom?: number): void {
    if (this.sharedService.openedWindows.findIndex(item => item?.name === WindowName.VISOR) > -1) {
    } else if (lat === 0 && lon === 0) {
        this.openVisorAuto();
    } else {
      this.openVisorByPoint(lon, lat);
    }
  }

  private openVisorAuto(): void {
    this.openVisorByPoint(this.cataloniaCentroid[0], this.cataloniaCentroid[1]);
  }

  private openVisorByPoint(lon: number, lat: number): void {
    const queryParams = {
      lng: lon,
      lat: lat
    };
    const tree = this.router.createUrlTree([Paths.POP_UP_PATH + Paths.VISOR], { queryParams: queryParams });
    const url = this.location.prepareExternalUrl(tree.toString());
    const wind = window.open(url.toString(), WindowName.VISOR, 'location=yes,width=1280,height=720');
    if (wind)
    this.sharedService.openedWindows = wind;
  }
}
