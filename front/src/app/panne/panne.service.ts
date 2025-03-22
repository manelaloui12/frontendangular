import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { panne } from './panne';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PanneService {
 constructor(private http:HttpClient) { }
   
urlApi:string='http://localhost:8000/api/breakdown1/'

//  create(panneData:any) : Observable<panne>
//  {
//   return this.http.post<panne>(this.urlApi+'create/',panneData) as Observable<panne>
// }

 create(userData:any) : Observable<panne>
 {
  return this.http.post<panne>(this.urlApi+'create/',userData) as Observable<panne>
}


listpanne(): Observable<any> {
  return this.http.get(this.urlApi+'list/') as Observable<any>; // Remplacez 'list/' par l’URL correcte de votre API
}
 
getpanneById(id:number) : Observable<panne>
{
  return this.http.get(this.urlApi+'breakdown1-detail/'+JSON.stringify(id)+'/') as Observable<any>
}

// updatepanne(id:number,datapanne:panne) :Observable<panne>{
//   return this.http.patch(this.urlApi+'panne-detail/'+JSON.stringify(id)+'/',datapanne) as Observable<panne>
// }
updatepanne(id: number, datapanne: panne): Observable<panne> {
  return this.http.patch<panne>(this.urlApi + 'breakdown1-detail/' + id + '/', datapanne);
}

Deletepanne(id: number): Observable<any> {
  return this.http.delete(this.urlApi + 'breakdown1-detail/'+JSON.stringify(id));
}

deleteMultiple(panneIds: number[]): Observable<any> {
  return this.http
    .request('DELETE', 'http://localhost:8000/api/breakdown1/delete-multiple/', {
      body: { ids: panneIds },
    })
    .pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression multiple :', error);
        throw error;  // Propager l'erreur pour qu'elle puisse être gérée dans le composant
      })
    );
}


deletepanne(panneIds: number[]) {
  return this.http.post(`${this.urlApi}delete-multiple/`, { ids: panneIds });
}

}
