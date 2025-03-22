import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './client';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class clientService {

  constructor(private http:HttpClient) { }
   
urlApi:string='http://localhost:8000/api/client/'

 create(clientData:any) : Observable<Client>
 {
  return this.http.post<Client>(this.urlApi+'create/',clientData) as Observable<Client>
}

listclient(): Observable<any> {
  return this.http.get(this.urlApi+'list/') as Observable<any>; // Remplacez 'list/' par l’URL correcte de votre API
}
 
getclientById(id:number) : Observable<Client>
{
  return this.http.get(this.urlApi+'client-detail/'+JSON.stringify(id)+'/') as Observable<any>
}

updateclient(id:number,dataclient:Client) :Observable<Client>{
  return this.http.patch(this.urlApi+'client-detail/'+JSON.stringify(id)+'/',dataclient) as Observable<Client>
}

Deleteclient(id:number): Observable<any>{
  return this.http.delete(this.urlApi+'client-detail/'+JSON.stringify(id))
 }

deleteMultiple(clientIds: number[]): Observable<any> {
  return this.http
    .request('DELETE', 'http://localhost:8000/api/client/delete-multiple/', {
      body: { ids: clientIds },
    })
    .pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression multiple :', error);
        throw error;  // Propager l'erreur pour qu'elle puisse être gérée dans le composant
      })
    );
}

deleteclients(clientIds: number[]) {
  return this.http.post(`${this.urlApi}delete-multiple/`, { ids: clientIds });
}

}