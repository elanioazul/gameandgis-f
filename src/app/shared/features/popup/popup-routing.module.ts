import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopupComponent } from './popup.component';
import { authGuard } from '@core/guards/iam/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: PopupComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'visor',
        canActivate: [authGuard],
        loadChildren: () =>
          import('../../../features/visor/visor.module').then(m => m.VisorModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupRoutingModule { }
