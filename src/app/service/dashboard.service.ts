import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  countContractCreateUrl: any = `${environment.apiUrl}/api/v1/dashboard/my-contract`;
  countContractReceivedUrl: any = `${environment.apiUrl}/api/v1/dashboard/my-process`;
  listContractUrl: any = `${environment.apiUrl}/api/v1/contracts/my-contract`;

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

  constructor(private http: HttpClient,
    public datepipe: DatePipe,) { }

  public countContractCreate(from_date: any, to_date: any): Observable<any> {
    this.getCurrentUser();
    if (from_date != "") {
      from_date = this.datepipe.transform(from_date, 'yyyy-MM-dd');
    }
    if (to_date != "") {
      to_date = this.datepipe.transform(to_date, 'yyyy-MM-dd');
    }
    let countContractCreateUrl = this.countContractCreateUrl + '?from_date=' + from_date + '&to_date=' + to_date;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(countContractCreateUrl, {headers}).pipe();
  }

  public countContractReceived(from_date: any, to_date: any): Observable<any> {
    this.getCurrentUser();
    if (from_date != "") {
      from_date = this.datepipe.transform(from_date, 'yyyy-MM-dd');
    }
    if (to_date != "") {
      to_date = this.datepipe.transform(to_date, 'yyyy-MM-dd');
    }
    let countContractReceivedUrl = this.countContractReceivedUrl + '?from_date=' + from_date + '&to_date=' + to_date;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(countContractReceivedUrl, {headers}).pipe();
  }

  public getContractList(): Observable<any> {
    this.getCurrentUser();
    let listContractUrl = this.listContractUrl + '?size=5';
    console.log(listContractUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(listContractUrl, {headers}).pipe();
  }

}
