import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class SharedService {

  constructor() { }
  
  getCookie(cname: string) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // uploadImgCloudinary(imageData: any) {
  //    return this.http.post(environment.api + '/uploadImgCloudinary/' ,imageData);
  //   }

}
