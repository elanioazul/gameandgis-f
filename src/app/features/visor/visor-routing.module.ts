import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisorLayoutComponent } from './components/visor-layout/visor-layout.component';

const routes: Routes = [
  {
    path: '',
    component: VisorLayoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorRoutingModule { }
