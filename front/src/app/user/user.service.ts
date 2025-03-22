import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
   
urlApi:string='http://localhost:8000/api/user/'

 create(userData:any) : Observable<User>
 {
  return this.http.post<User>(this.urlApi+'create/',userData) as Observable<User>
}

listUser(): Observable<any> {
  return this.http.get(this.urlApi+'list/') as Observable<any>; // Remplacez 'list/' par l’URL correcte de votre API
}


getUserById(id:number) : Observable<User>
{
  return this.http.get(this.urlApi+'user-detail/'+JSON.stringify(id)+'/') as Observable<any>
}

updateUser(id:number,dataUser:User) :Observable<User>{
  return this.http.patch(this.urlApi+'user-detail/'+JSON.stringify(id)+'/',dataUser) as Observable<User>
}

DeleteUser(id:number): Observable<any>{
  return this.http.delete(this.urlApi+'user-detail/'+JSON.stringify(id))
 }
//  deleteMultiple(userIds: number[]) {
//   return this.http.post('http://localhost:8000/api/user/delete-multiple/', { ids: userIds });
// }
deleteMultiple(userIds: number[]): Observable<any> {
  return this.http
    .request('DELETE', 'http://localhost:8000/api/user/delete-multiple/', {
      body: { ids: userIds },
    })
    .pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression multiple :', error);
        throw error;  // Propager l'erreur pour qu'elle puisse être gérée dans le composant
      })
    );
}

deleteUsers(userIds: number[]) {
  return this.http.post(`${this.urlApi}delete-multiple/`, { ids: userIds });
}

}