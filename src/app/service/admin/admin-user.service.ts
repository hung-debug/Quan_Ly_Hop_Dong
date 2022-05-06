import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  listUserUrl: any = `${environment.apiUrl}`;
  constructor(private http: HttpClient,) { }

  token:any;
  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').access_token;
  }

  getUserList(name: any, email: any, phone:any): Observable<any> {
    this.getCurrentUser();

    let listUserUrl = this.listUserUrl + '?name=' + name.trim() + '&email=' + email.trim() + '&phone=' + phone.trim() + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(listUserUrl, {headers}).pipe();
  }

}
