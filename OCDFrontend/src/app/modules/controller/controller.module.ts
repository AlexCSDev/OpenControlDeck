import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ControllerComponent } from './pages/controller/controller.component';
import { ControllerRoutingModule } from './controller-routing.module';

import { MatGridListModule } from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatSelectModule} from '@angular/material/select'; 
import { GridsterModule } from 'angular-gridster2';
import { EditControllerComponent } from './components/edit-controller/edit-controller.component';
import { EditDashboardControllerComponent } from './components/edit-dashboard-controller/edit-dashboard-controller.component';
import { ParticlesModule } from 'angular-particle';
import { BatteryIndicatorComponent } from './components/battery-indicator/battery-indicator.component';
import { ScreensaverComponent } from './components/screensaver/screensaver.component';



@NgModule({
  declarations: [ControllerComponent, EditControllerComponent, EditDashboardControllerComponent, BatteryIndicatorComponent, ScreensaverComponent],
  entryComponents: [EditControllerComponent,EditDashboardControllerComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    GridsterModule,
    MatGridListModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ControllerRoutingModule,
    ParticlesModule
  ]
})
export class ControllerModule { }
