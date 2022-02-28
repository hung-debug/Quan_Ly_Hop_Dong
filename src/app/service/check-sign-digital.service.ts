import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckSignDigitalService {

  constructor(private http: HttpClient) { }

  public getList(): Observable<any> {
    return this.http.get("/assets/data.json");
  }
}
