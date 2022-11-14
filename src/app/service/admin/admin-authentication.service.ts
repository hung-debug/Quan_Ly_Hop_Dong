import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthenticationService {

  loginUrl:any = `${environment.apiUrl}/api/v1/auth/admin`;
  errorData:any = {};
  redirectUrl: string = '';

  constructor(private http: HttpClient) { }

  //login admin
  loginAuthencation(username: string, password: string) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    const body = JSON.stringify({email: username.trim(), password: password});

    return this.http.post<any>(this.loginUrl, body, {'headers':headers})
      .pipe(
        map((user) => {
          if (JSON.parse(JSON.stringify(user)) != null) {            
            //luu thong tin admin
            localStorage.setItem('currentAdmin', JSON.stringify(user));

            console.log("user ",user);

            return user;
          }else{
            console.log(JSON.stringify(user));
            return null;
          }
        }),
        catchError(this.loginError)
      );
  }

  isLoggedInSuccess() {
    if (localStorage.getItem('currentAdmin') != null) {
      return true;
    }
    return false;
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }

  private loginError(error: HttpErrorResponse) {
    console.log(error);
    if (JSON.parse(JSON.stringify(error)).status == 400 && JSON.parse(JSON.stringify(error)).access_token == null) {
      localStorage.setItem('checkAdmin', "error");
    }else{
      localStorage.setItem('checkAdmin', "");
    }
    return throwError(this.errorData);
  }

}
