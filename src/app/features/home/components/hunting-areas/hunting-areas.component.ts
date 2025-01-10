import { Component, inject } from '@angular/core';
import { OpenvisorService } from 'src/app/features/visor/services/openvisor.service';

@Component({
  selector: 'app-hunting-areas',
  templateUrl: './hunting-areas.component.html',
  styleUrl: './hunting-areas.component.scss'
})
export class HuntingAreasComponent {
  private readonly openVisorService = inject(OpenvisorService)

  openVisor(): void {
    this.openVisorService.openVisor(0,0)
  }

}
