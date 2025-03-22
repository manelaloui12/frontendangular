import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientADDComponent } from './client-add/client-add.component';
import { ClientUpdateComponent } from './client-update/client-update.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientDeleteComponent } from './client-delete/client-delete.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list-client', pathMatch: 'full' }, 
  { path: 'add-client', component: ClientADDComponent,canActivate: [AuthGuard] },
  { path: 'update-client/:id', component: ClientUpdateComponent ,canActivate: [AuthGuard] },
  { path: 'list-client', component: ClientListComponent ,canActivate: [AuthGuard]},
  { path: 'delete-client', component: ClientDeleteComponent ,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }


