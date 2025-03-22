import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
  path:"user",loadChildren:()=>import('./user/user.module').then(m=>m.UserModule) ,canActivate: [AuthGuard]
  },
{ path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

{ path: 'core', loadChildren: () => import('./core/core.module').then(m => m.CoreModule),canActivate: [AuthGuard] },

{ path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) ,canActivate: [AuthGuard]},

{ path: 'panne', loadChildren: () => import('./panne/panne.module').then(m => m.PanneModule) ,canActivate: [AuthGuard]},

{ path: 'claim', loadChildren: () => import('./claim/claim.module').then(m => m.ClaimModule),canActivate: [AuthGuard] },

{ path: '', redirectTo: 'auth/login', pathMatch: 'full' }
// { path: '**', redirectTo: 'auth/login' },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
