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
  reportSmsUrl: any = `${environment.apiUrl}/api/v1/contracts/getNotificationLog`
  exportReportSmsUrl: any = `${environment.apiUrl}/api/v1/contracts/rp-by-sms-log/export`

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
  exportSmsReport(params: any, data: any, isExport: boolean) {
    this.getCurrentUser();

    let headers = null;

    const body = JSON.stringify({
      orgId: data.orgId,
      contractInfo: data.contractInfo,
      createDate: data.createDate
    })

    if(isExport) {
      headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    } else {
      headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    }

    if (isExport) {
      return this.http.post<any>(this.exportReportSmsUrl + params, body, { headers: headers,responseType: 'blob' as 'json'}).pipe();
    } else {
      return this.http.post<any>(this.reportSmsUrl + params, body, {headers: headers});
    }

  }
}
