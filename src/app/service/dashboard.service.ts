import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  countContractCreateUrl: any = `${environment.apiUrl}/api/v1/dashboard/my-contract`;
  countContractReceivedUrl: any = `${environment.apiUrl}/api/v1/dashboard/my-contract`;

  token:any;
  customer_id:any;
  organization_id:any;
  errorData: any = {};
  redirectUrl: string = '';

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }

  constructor(private http: HttpClient
    ) { }

  public countContractCreate(from_date: any, to_date: any): Observable<any> {
    this.getCurrentUser();

    let countContractCreateUrl = this.countContractCreateUrl + '?from_date=' + from_date + '&to_date=' + to_date;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(countContractCreateUrl, {headers}).pipe();
  }

  public countContractReceived(from_date: any, to_date: any): Observable<any> {
    this.getCurrentUser();

    let countContractReceivedUrl = this.countContractReceivedUrl + '?from_date=' + from_date + '&to_date=' + to_date;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(countContractReceivedUrl, {headers}).pipe();
  }

}
