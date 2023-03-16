import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  
  urlDetailContractsListReport: any = `${environment.apiUrl}/api/v1/report/list/detail/`

  constructor(
    private http: HttpClient
  ) { }

  token:any;
  customer_id:any;
  organization_id:any;
  
  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }

  getDetailContractListReport(param: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let url = this.urlDetailContractsListReport + param;
    return this.http.get<any>(url, {headers}).pipe();
  }
}
