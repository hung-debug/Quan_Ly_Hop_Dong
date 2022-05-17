import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminUnitService {
  listUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  activeUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;

  constructor(
    private http: HttpClient,
  ) { }

  token:any;
  getCurrentUser(){
    //this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').access_token;
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
  }

  getUnitList(code: any, name:any){
    this.getCurrentUser();
    let listUnitUrl = this.listUnitUrl + '?code=' + code.trim() + '&name=' + name.trim() + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(listUnitUrl, {headers}).pipe();
  
  }

  activeUnit(id: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({});
    return this.http.post<any>(this.activeUnitUrl + id, body, {'headers': headers});
  }
}
