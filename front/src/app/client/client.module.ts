import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import {ClientADDComponent} from './client-add/client-add.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientUpdateComponent } from './client-update/client-update.component';
import { ClientDeleteComponent } from './client-delete/client-delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ClientADDComponent,
    ClientListComponent,
    ClientUpdateComponent,
    ClientDeleteComponent
  ],
   imports: [
      CommonModule,
     ClientRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
    ]
})
export class ClientModule { }
