import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { claim } from './claim';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ClaimService {


  constructor(private http:HttpClient) { }
   
urlApi:string='http://localhost:8000/api/claim/'

 create(claimData:any) : Observable<claim>
 {
  return this.http.post<claim>(this.urlApi+'create/',claimData) as Observable<claim>
}

listclaim(): Observable<any> {
  return this.http.get(this.urlApi+'list/') as Observable<any>; // Remplacez 'list/' par l’URL correcte de votre API
}
 
getclaimById(id:number) : Observable<claim>
{
  return this.http.get(this.urlApi+'claim-detail/'+JSON.stringify(id)+'/') as Observable<any>
}

updateclaim(id:number,dataclaim:claim) :Observable<claim>{
  return this.http.patch(this.urlApi+'claim-detail/'+JSON.stringify(id)+'/',dataclaim) as Observable<claim>
}

Deleteclaim(id:number): Observable<any>{
  return this.http.delete(this.urlApi+'claim-detail/'+JSON.stringify(id))
 }

deleteMultiple(claimIds: number[]): Observable<any> {
  return this.http
    .request('DELETE', 'http://localhost:8000/api/claim/delete-multiple/', {
      body: { ids: claimIds },
    })
    .pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression multiple :', error);
        throw error;  // Propager l'erreur pour qu'elle puisse être gérée dans le composant
      })
    );
}

deleteclaims(claimIds: number[]) {
  return this.http.post(`${this.urlApi}delete-multiple/`, { ids: claimIds });
}


}
