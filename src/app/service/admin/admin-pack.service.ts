import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminPackService {

  listPackUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;

  constructor(
    private http: HttpClient,
  ) { }

  token:any;
  getCurrentUser(){
    //this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').access_token;
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
  }

  getPackList(name:any, code:any, price:any, time:any, status:any, number_contract:any){
    this.getCurrentUser();
    let listPackUrl = this.listPackUrl + '?name=' + name.trim() + '&code=' + code.trim() + '&price=' + price.trim() + '&time=' + time.trim() + '&status=' + status.trim() + '&number_contract=' + number_contract.trim() + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(listPackUrl, {headers}).pipe();
  
  }
}
