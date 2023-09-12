import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  token: any;
  customer_id: any;
  organization_id: any;

  reportUrl: any = `${environment.apiUrl}/api/v1/contracts/`

  constructor(
    private http: HttpClient
  ) { }

  getCurrentUser() {
    this.token = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).access_token;
    this.customer_id = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.id;
    this.organization_id = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.organizationId;
  }

  export(code: string, orgId: number, params: any, excel: boolean) {
    this.getCurrentUser();
    let prefix = this.reportUrl+code + '/' + orgId;

    let headers = null;

    if(excel) {
      prefix = prefix + '/export';
      headers = new HttpHeaders()
      .append('Content-Type', 'application/x-binary')
      .append('Authorization', 'Bearer ' + this.token);
    } else {
      headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    }

    let url = prefix+params;

    if(excel) {

      return this.http.get<any>(url, { headers: headers,responseType: 'blob' as 'json'}).pipe();
    } else {
      return this.http.get<any>(url,{headers: headers}).pipe();
    }
  }


  exportMsale(code: string, orgId: number, type:any, params: any, excel: boolean, fromDate: any, toDate: any) {
    this.getCurrentUser();
    let prefix = this.reportUrl + code + '/' + orgId;
    let headers = null;

    if(excel) {
      prefix = prefix + '/export';
      headers = new HttpHeaders()
      .append('Content-Type', 'application/x-binary')
      .append('Authorization', 'Bearer ' + this.token);
    } else {
      headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    }

    let url = prefix + '?type=' + type + params;
    //prefix = api/v1/contracts/rp-by-contract-type/226

    if(excel) {
      return this.http.get<any>(url, { headers: headers,responseType: 'blob' as 'json'}).pipe();
    } else {
      return this.http.get<any>(url + '&from_date=' + fromDate + '&to_date=' + toDate,{headers: headers}).pipe();
    }
  }


}
