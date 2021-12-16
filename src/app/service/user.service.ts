import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
export interface User {
  status: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  forgotPasswordUrl:any = `${environment.apiUrl}/api/v1/customers/password/request`;
  resetPasswordUrl:any = `${environment.apiUrl}/api/v1/customers/password/recover`;
  resetPasswordTokenUrl:any = `${environment.apiUrl}/api/v1/customers/changePassword`;
  addUserUrl:any = `${environment.apiUrl}/api/v1/customer`;

  token:any;
  customer_id:any;
  organization_id:any;
  name:any;
  email:any;
  phone:any;

  constructor(private http: HttpClient) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;

    this.name = JSON.parse(localStorage.getItem('currentUser')||'').customer.info.name;
    this.email = JSON.parse(localStorage.getItem('currentUser')||'').customer.info.email;
    this.phone = JSON.parse(localStorage.getItem('currentUser')||'').customer.info.phone;
  }

  getInforUser(){
    this.getCurrentUser();
    return {
      token: this.token,
      customer_id: this.customer_id,
      organization_id: this.organization_id,
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
  }

  sendForgotPassword(email:string) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    const body = JSON.stringify({email: email});
    return this.http.post<User>(this.forgotPasswordUrl, body, {'headers':headers})
    .pipe(
      map((user) => {
        console.log(user);
        if (JSON.parse(JSON.stringify(user)).status == 0) {
          return user;
        }else{
          return null;
        }
     }),
     catchError(this.handleError)
   )
  }

  sendResetPassword(token:string, password:string) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    const body = JSON.stringify({token: token, password: password});
    return this.http.post<User>(this.resetPasswordUrl, body, {'headers':headers})
    .pipe(
      map((user) => {
        console.log(user);
        if (JSON.parse(JSON.stringify(user)).status == 0) {
          return user;
        }else{
          return null;
        }
     }),
     catchError(this.handleError)
   )
  }

  sendResetPasswordToken(passwordOld:string, passwordNew:string) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({password: passwordOld, newPassword: passwordNew});
    return this.http.post<User>(this.resetPasswordTokenUrl, body, {'headers':headers})
    .pipe(
      map((user) => {
        console.log(user);
        if (JSON.parse(JSON.stringify(user)).status == 0) {
          return user;
        }else{
          return null;
        }
     }),
     catchError(this.handleError)
   )
  }

  addUser(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      short_name: datas.short_name,
      code: datas.code,
      email: datas.email,
      phone: datas.phone,
      fax: datas.fax,
      status: 1,
      parent_id: datas.parent_id,
    });
    console.log(headers);
    console.log(body);
    return this.http.post<User>(this.addUserUrl, body, {'headers': headers});
  }

  // Error handling
  handleError(error:any) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     console.error(errorMessage);
     return throwError(errorMessage);
  }
}
