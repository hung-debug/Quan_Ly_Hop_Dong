import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
export interface User {
  tax_code: number,
  username: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //loginUrl = 'https://uatecontractapp.efy.com.vn/api/login';
  loginUrl:any = `${environment.apiUrl}/api/v1/auth/login`;
  errorData:any = {};
  redirectUrl: string = '';

  constructor(private http: HttpClient) { }

  // loginAuthencation(username: string, password: string) {
  //   console.log(this.loginUrl);

  //   let postData:any = {username: username, password: password };
  //   return this.http.get<User>(this.loginUrl, postData)
  //     .pipe(map(user => {
  //       if (JSON.parse(JSON.stringify(user)).status == "error") {
  //         // console.log(JSON.stringify(user));
  //         // localStorage.removeItem('currentUser');
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         return user;
  //       } else {
  //         // localStorage.removeItem('currentUser');
  //         console.log(JSON.stringify(user));
  //         return null;
  //       }
  //     }),
  //       catchError(this.handleError)
  //     );
  // }

 loginAuthencation(username: string, password: string) {
    console.log(this.loginUrl);

    //let headers = new HttpHeaders();
    //headers = headers.set('Content-Type', 'application/json');
    // headers = headers.set('username', username).set('password',password);

    //headers = headers.set("Access-Control-Allow-Origin", "http://192.168.1.13:8001/");
    // headers = headers.set("Access-Control-Allow-Credentials", "true");
    // headers = headers.set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
    // headers = headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS')
      .append('Access-Control-Allow-Origin', '*');

    const body = JSON.stringify({username: username, password: password});

    console.log(headers);
    console.log(body);
    return this.http.post<User>(this.loginUrl, body, {'headers':headers})
       .pipe(
          map((data) => {
            //You can perform some transformation here
            console.log(data);
           return data;
         }),
         catchError((err) => {
           console.error(err);
           throw err;
         }
       ));
  }

  // loginAuthencation(username: string, password: string) {
  //       return this.http.post<any>(this.loginUrl, { username, password })
  //           .pipe(map(user => {
  //               // login successful if there's a jwt token in the response
  //               console.log(user);
  //               if (user) {
  //                   // store user details and jwt token in local storage to keep user logged in between page refreshes
  //                   localStorage.setItem('currentUser', JSON.stringify(user));
  //               }

  //               return user;
  //           }));
  //   }

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
