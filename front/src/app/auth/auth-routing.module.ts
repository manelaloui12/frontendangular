import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

// Définissez les routes spécifiques à ce module
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Utilisation de forChild pour les routes enfants
  exports: [RouterModule]  // Exportation pour que les routes soient disponibles dans ce module
})
export class AuthRoutingModule { }
