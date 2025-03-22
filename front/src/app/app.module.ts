import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@angular/router'; 
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';  // ✅ Pour ngModel
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
@NgModule({
  declarations: [
    AppComponent,
   
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,  
    AppRoutingModule,
    CoreModule,
    RouterModule,HttpClientModule,RouterModule,FormsModule,ReactiveFormsModule,  
    GoogleMapsModule

  ],
 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: AuthInterceptor,
//       multi: true,
//     },
//     AuthGuard,
    provideHttpClient(withFetch()), 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
