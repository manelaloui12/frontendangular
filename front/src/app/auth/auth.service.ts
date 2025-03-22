import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  login(userData: any): Observable<any> {
    return this.http.post<any>(environnement.api+"/auth/login/", userData)  as Observable<any>
  }
  findUserToken(token:string):Observable<any>
  {
    return this.http.get<any>(environnement.api+'/user/find/'+String(token)+'/') as Observable<any>
  }

  // urlApi: string = 'http://localhost:8000/api/auth/';
  // login(userData: any): Observable<any> {
  //   return this.http.post<any>(`${this.urlApi}login/`, userData).pipe(
  //     tap(response => {
  //       console.log("Response received:", response);
  //       if (response.access) {
  //         localStorage.setItem('access_token', response.access);
  //         localStorage.setItem('refresh_token', response.refresh);
  //       }
  //     })
  //   );
  // }
}  
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export function tokenGetter(platformId: object): string {
  if (!isPlatformBrowser(platformId)) {
    console.warn("tokenGetter: Running in a non-browser environment.");
    return "";
  }

  const cookies = document.cookie.split(";").map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith("token="));

  return tokenCookie ? tokenCookie.split("=")[1] : "";
}