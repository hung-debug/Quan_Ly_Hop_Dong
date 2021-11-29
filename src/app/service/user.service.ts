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



  constructor(private http: HttpClient) { }

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
    let token = JSON.parse(localStorage.getItem('currentUser') || '')?.access_token;
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + token);
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
     window.alert(errorMessage);
     return throwError(errorMessage);
  }
}
