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
  contractGroupUrl: any = `${environment.apiUrl}/api/v1/contracts-group`
  msaleReportUrl: any = `${environment.apiUrl}/api/v1/contracts/rp-by-contract-type/`
  reportEmailUrl: any = `${environment.apiUrl}/api/v1/contracts/email-report`
  exportReportEmailUrl: any = `${environment.apiUrl}/api/v1/contracts/rp-by-email-log/export`
  detailReportEmail: any = `${environment.apiUrl}/api/v1/notification/email-detail/`
  reportEkycUrl: any = `${environment.apiUrl}/api/v1/contracts/eykc-report`
  exportReportEkycUrl: any = `${environment.apiUrl}/api/v1/contracts/rp-by-eykc/export`

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
      // createDate: data.createDate
      startDate: data.startDate,
      endDate: data.endDate,
      // contractStatus: data.contractStatus
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

  exportEmailReport(params: any, data: any, isExport: boolean) {
    this.getCurrentUser();

    let headers = null;

    const body = JSON.stringify({
      orgId: data.orgId,
      contractInfo: data.contractInfo,
      startDate: data.startDate,
      endDate: data.endDate,
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
      return this.http.post<any>(this.exportReportEmailUrl + params, body, { headers: headers,responseType: 'blob' as 'json'}).pipe();
    } else {
      return this.http.post<any>(this.reportEmailUrl + params, body, {headers: headers});
    }

  }
  
  exportEkycReport(params: any, data: any, isExport: boolean) {
    this.getCurrentUser();

    let headers = null;

    const body = JSON.stringify(data
      // orgId: data.orgId,
      // keyword: data.contractInfo,
      // processIdStart: data.startDate,
      // processIdEnd: data.endDate,
    )

    if(isExport) {
      headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    } else {
      headers = new HttpHeaders().append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    }

    if (isExport) {
      return this.http.post<any>(this.exportReportEkycUrl + params, body, { headers: headers,responseType: 'blob' as 'json'}).pipe();
    } else {
      return this.http.post<any>(this.reportEkycUrl + params, body, {headers: headers});
    }

  }

  detailContentEmailReport(id: any){
    this.getCurrentUser();
    let headers = null;
    headers = new HttpHeaders()
    .append('Content-Type', 'text/html')
    .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.detailReportEmail + id,{headers: headers, responseType: 'text' as any}).pipe();
  }

  exportMsale(code: string, orgId: number, type:any, params: any, excel: boolean) {
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

    let url = prefix + '?group-ids=' + type + params;
    //prefix = api/v1/contracts/rp-by-contract-type/226

    if(excel) {
      return this.http.get<any>(url, { headers: headers,responseType: 'blob' as 'json'}).pipe();
    } else {
      return this.http.get<any>(url,{headers: headers}).pipe();
    }

    // return this.http.get<any>(url,{headers: headers}).pipe();
  }

  exportDetail(code: string, orgId: number, type:any, params: any, excel: boolean) {
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

    let url = prefix + '?group-ids=' + type + params;
    //prefix = api/v1/contracts/rp-by-contract-type/226

    if(excel) {
      return this.http.get<any>(url, { headers: headers,responseType: 'blob' as 'json'}).pipe();
    } else {
      return this.http.get<any>(url,{headers: headers}).pipe();
    }

    // return this.http.get<any>(url,{headers: headers}).pipe();
  }

  getContractGroup() {
    this.getCurrentUser();
    let headers = null;

      headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      return this.http.get<any>(this.contractGroupUrl + '?contain-msale=true',{headers: headers}).pipe();
  }

  getMSaleReport(params: any) {
    this.getCurrentUser();
    let headers = null;
    let prefix: string = params.orgId + `?from_date=${params.fromDate}&to_date=${params.toDate}`
      headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      return this.http.get<any>(this.msaleReportUrl + prefix, {headers: headers}).pipe();
  }
}
