import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HuntingAreasComponent } from './components/hunting-areas/hunting-areas.component';
import { ChatComponent } from './components/chat/chat.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { HomeComponent } from './home.component';
import { MainComponent } from './components/main/main.component';

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from "primeng/inputtext";

import { ButtonModule } from "@shared/components/button/button.module";
import { ErrorFormModule } from "@shared/components/error-form/error-form.module";
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
    FontAwesomeModule,
    ButtonModule,
    ErrorFormModule,
    ProgressBarModule,
    ToastModule,
    InputTextModule,
    FormsModule,
		ReactiveFormsModule,

  ],
  exports: [HomeComponent],
  providers: [MessageService]
})
export class HomeModule { }
