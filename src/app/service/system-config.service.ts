import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SystemConfig {
  success: any;
  id: number,
  type: any,
  url: any,
  apikey: any,
  organization_id: string,
  method: any;
  body: any;
  orgId: any;
}

@Injectable({
  providedIn: 'root'
})

export class SystemConfigService {
  token: any;
  customer_id: any;
  organization_id: any;
  constructor(private http: HttpClient,) { }


  listApiWebHook: any = `${environment.apiUrl}/api/v1/organizations/webhook`;
  addNewApiWebHook: any = `${environment.apiUrl}/api/v1/organizations/webhook`;
  apiTemplateWebHook: any = `${environment.apiUrl}/api/v1/organizations/webhooktype`;
  addApiWebHook: any = `${environment.apiUrl}/api/v1/organizations/webhook`;
  editApiWebHook: any = `${environment.apiUrl}/api/v1/organizations/webhook`;
  updateApiWebHook: any = `${environment.apiUrl}/api/v1/organizations/update_webhook`;
  checkApiWebHook: any = `${environment.apiUrl}/api/v1/organizations/webhook/check`;



  getCurrentUser() {
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }

  getAddApiWebHook(data: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      type: data.type,
      apikey: data.apikey,
      url: data.url,
    });
    return this.http.post<SystemConfig>(this.addApiWebHook, body, { headers: headers });
  }

  //API có chức năng lấy thông tin chi tiết tất cả webhook của tổ chức
  getlistApiWebHook() {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any[]>(this.listApiWebHook, { headers }).pipe();
  }

  //API có chức năng lấy thông tin mẫu các loại webhook
  getApiTemplateWebHook() {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<SystemConfig[]>(this.apiTemplateWebHook, { headers }).pipe();
  }

  //api update webhook
  getUpdateApiWebHook(dataWebHook: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const bodyUpdate = JSON.stringify({
      id: dataWebHook.id,
      type: dataWebHook.type,
      url: dataWebHook.url,
      apikey: dataWebHook.apikey,
      orgId: dataWebHook.orgId,
      body: dataWebHook.body,
      method: "POST"
    });
    
    return this.http.put<SystemConfig>(this.updateApiWebHook, bodyUpdate, { headers: headers });
  }

  getAddApIWebHook(dataWebHook: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      
    const bodyAdd = JSON.stringify({
      type: dataWebHook.type,
      url: dataWebHook.url,
      apikey: dataWebHook.apikey,
      body: dataWebHook.body,
    });
    
    return this.http.post<SystemConfig>(this.addNewApiWebHook, bodyAdd, { headers: headers });
  }
  
  checkStatusWebHook(dataCheckWebHook: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      
    const bodyCheck = JSON.stringify({
      id: dataCheckWebHook.id,
      type: dataCheckWebHook.type,
      url: dataCheckWebHook.url,
      apikey: dataCheckWebHook.apikey,
      orgId: dataCheckWebHook.orgId,
      body: dataCheckWebHook.body,
      method: "POST"
    });
    
    return this.http.post<SystemConfig>(this.checkApiWebHook, bodyCheck, { headers: headers });
  }
}