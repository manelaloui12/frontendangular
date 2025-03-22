import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanneRoutingModule } from './panne-routing.module';
import { PanneAddComponent } from './panne-add/panne-add.component';
import { PanneListComponent } from './panne-list/panne-list.component';
import { PanneUpdateComponent } from './panne-update/panne-update.component';
import { PanneDeleteComponent } from './panne-delete/panne-delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    PanneAddComponent,
    PanneListComponent,
    PanneUpdateComponent,
    PanneDeleteComponent
  ],
  imports: [
    CommonModule,
    PanneRoutingModule,
     FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule

  ]
})
export class PanneModule { }
