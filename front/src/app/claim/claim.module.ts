import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimRoutingModule } from './claim-routing.module';
import { ClaimAddComponent } from './claim-add/claim-add.component';
import { ClaimListComponent } from './claim-list/claim-list.component';
import { ClaimUpdateComponent } from './claim-update/claim-update.component';
import { ClaimDeleteComponent } from './claim-delete/claim-delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClientModule } from '../client/client.module';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    ClaimAddComponent,
    ClaimListComponent,
    ClaimUpdateComponent,
    ClaimDeleteComponent
  ],
  imports: [
    CommonModule,
    ClaimRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClientModule,
    GoogleMapsModule

  ]
 

})
export class ClaimModule { }
