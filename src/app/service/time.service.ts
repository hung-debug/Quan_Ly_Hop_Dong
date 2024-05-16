import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private apiUrlHTTP = 'http://worldtimeapi.org/api/ip';
  private apiUrlHTTPS = 'https://worldtimeapi.org/api/ip';

  constructor(
    private http: HttpClient,
  ) { }

  getRealTime(): Observable<any> {
    if (window.location.protocol === 'https:') {
      return this.http.get<any>(this.apiUrlHTTPS)
      .pipe(
        map((data) => {
          if (JSON.parse(JSON.stringify(data)) != null) {
           return data.datetime;
          }else{
            return new Date();
          }
        }),
        catchError(this.error)
      );
    } else {
      return this.http.get<any>(this.apiUrlHTTP)
      .pipe(
        map((data) => {
          if (JSON.parse(JSON.stringify(data)) != null) {
           return data.datetime;
          }else{
            return new Date();
          }
        }),
        catchError(this.error)
      );
    }
  }

  private error(error: HttpErrorResponse) {
    return of(new Date());
  }
}
