import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminUnitService {
  listUnitUrl: any = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
  ) { }

  token:any;
  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').access_token;
  }

  getUnitList(code: any, name:any){
    this.getCurrentUser();
    let listUnitUrl = this.listUnitUrl + '?code=' + code.trim() + '&name=' + name.trim() + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(listUnitUrl, {headers}).pipe();
  
  }
}
