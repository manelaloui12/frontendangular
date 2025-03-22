import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimAddComponent } from './claim-add/claim-add.component';
import { ClaimUpdateComponent } from './claim-update/claim-update.component';
import { ClaimListComponent } from './claim-list/claim-list.component';
import { ClaimDeleteComponent } from './claim-delete/claim-delete.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list-claim', pathMatch: 'full' }, 
  { path: 'add-claim', component: ClaimAddComponent ,canActivate: [AuthGuard] },
  { path: 'update-claim/:id', component: ClaimUpdateComponent  ,canActivate: [AuthGuard]},
  { path: 'list-claim', component: ClaimListComponent,canActivate: [AuthGuard]},
  { path: 'delete-claim', component: ClaimDeleteComponent ,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
