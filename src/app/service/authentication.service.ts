import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
export interface User {
  type: string,
  access_token: string,
  code: string,
  customer: {
    info: {
      id:number,
      name:string,
      email:string,
      phone:string,
      status:string,
      organization_id:string,
      role_id:string,
      passwordChange: number
    }
  },
  login_fail_num: number;
  active_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loginUrl:any = `${environment.apiUrl}/api/v1/auth`;
  errorData:any = {};
  redirectUrl: string = '';

  constructor(private http: HttpClient) { }


  loginAuthencation(username: string, password: string, type: number, isContractId: number | null) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    let body = JSON.stringify({email: username.trim().toLowerCase(), password: password, type: type});

    if(isContractId) {
      body = JSON.stringify({email: username.trim().toLowerCase(), password: password, type, contractId: isContractId});
    }

    return this.http.post<User>(this.loginUrl, body, {'headers':headers})
      .pipe(
        map((user) => {
          if (JSON.parse(JSON.stringify(user)) != null) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          }else{
            return null;
          }
        }),
        catchError(this.loginError)
      );
  }

  loginAuthencationUserOut(username: string, password: string, type: number, isContractId: number | null) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    const body = JSON.stringify({email: username.trim().toLowerCase(), password: password, type, contractId: isContractId});

    return this.http.post<User>(this.loginUrl, body, {'headers':headers})
      .pipe(
        map((user) => {
          if (JSON.parse(JSON.stringify(user)) != null) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          }else{
            
            return null;
          }
        }),
        catchError(this.loginError)
      );
  }

  isLoggedInSuccess() {
    if (localStorage.getItem('currentUser') != null) {
      return true;
    }
    return false;
  }

  private handleError(error: HttpErrorResponse) {
    
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
    
    if (JSON.parse(JSON.stringify(error)).status == 400 && JSON.parse(JSON.stringify(error)).access_token == null) {
      localStorage.setItem('checkUser', "error");
    }else{
      localStorage.setItem('checkUser', "");
    }
    return throwError(this.errorData);
  }
}