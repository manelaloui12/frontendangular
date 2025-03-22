import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanneAddComponent } from './panne-add/panne-add.component';
import { PanneDeleteComponent } from './panne-delete/panne-delete.component';
import { PanneListComponent } from './panne-list/panne-list.component';
import { PanneUpdateComponent } from './panne-update/panne-update.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list-panne', pathMatch: 'full' }, 
  { path: 'add-panne', component: PanneAddComponent ,canActivate: [AuthGuard] },
  { path: 'update-panne/:id', component: PanneUpdateComponent,canActivate: [AuthGuard] },
  { path: 'list-panne', component: PanneListComponent ,canActivate: [AuthGuard]},
  { path: 'delete-panne', component: PanneDeleteComponent ,canActivate: [AuthGuard]}
];



@NgModule({
 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanneRoutingModule { }
