import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
export interface User {
  type: string,
  access_token: string,
  customer:{
    id:number,
    name:string,
    email:string,
    phone:string,
    status:string,
    organization_id:string,
    type_id:string,
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loginUrl:any = `${environment.apiUrl}/api/v1/auth`;
  errorData:any = {};
  redirectUrl: string = '';

  constructor(private http: HttpClient) { }


  loginAuthencation(username: string, password: string) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    const body = JSON.stringify({email: username, password: password});

    return this.http.post<User>(this.loginUrl, body, {'headers':headers})
      .pipe(
        map((user) => {
          console.log(user);
          if (JSON.parse(<string>localStorage.getItem('currentUser'))) {
            localStorage.removeItem('currentUser');
            // return user;
          }
          localStorage.setItem('currentUser', JSON.stringify(user));
        }),
        catchError(this.handleError)
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

}
