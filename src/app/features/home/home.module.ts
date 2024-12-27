import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HuntingAreasComponent } from './components/hunting-areas/hunting-areas.component';
import { ChatComponent } from './components/chat/chat.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { HomeComponent } from './home.component';
import { MainComponent } from './components/main/main.component';

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    HuntingAreasComponent,
    ChatComponent,
    LeftSidebarComponent,
    HomeComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    FontAwesomeModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
