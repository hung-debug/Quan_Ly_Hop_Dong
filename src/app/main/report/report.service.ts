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
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-binary')
      .append('Authorization', 'Bearer ' + this.token);

    let prefix = this.reportUrl+code + '/' + orgId

    if(excel) {
      prefix = prefix + '/export'
    }

    let url = prefix+params;

    return this.http.get<any>(url, { 
     headers: headers,
     responseType: 'blob' as 'json'
    },)
    .pipe();
  }

}
