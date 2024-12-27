import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HuntingAreasComponent } from './components/hunting-areas/hunting-areas.component';
import { ChatComponent } from './components/chat/chat.component';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    HuntingAreasComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
