import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Parse from 'parse';
import { map } from 'rxjs/operators';
import {DeviceDetectorService} from "ngx-device-detector";

@Injectable({
  providedIn: 'root',
})
export class CustomerAnalysis {
  urlGetTokenAnalysis: any = `${environment.urlgetTokenAnalysis}/v1/auth/authenticate_app`
  tokenAnalysis: any;
  infoUser: any;
  datas: any;
  constructor(
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
  ) {}

  convertToVietnamTimeISOString(): string {
    const vietnamTime = new Date();
  
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
    const year = vietnamTime.getFullYear();
    const hours = String(vietnamTime.getHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getMinutes()).padStart(2, '0');
    const seconds = String(vietnamTime.getSeconds()).padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }  

  getTokenAnalysis() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = {
      appName: environment.appNameAnalysis,
      apiKey: environment.apiKeyAnalysis
    };
    
    return this.http.post<any>(this.urlGetTokenAnalysis, body, { headers }).pipe(
      map((token) => 
      {
        if (JSON.parse(JSON.stringify(token)) != null) {
          localStorage.setItem('tokenAnalysis', JSON.stringify(token))
          this.initAnalysis(token.appId);
          return token;
        }
      }),         
    );
  }

  getCurrentTokenAnalysis() {
    this.tokenAnalysis = JSON.parse(localStorage.getItem('tokenAnalysis') || '');
    this.infoUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  initAnalysis(appId: string) {
    Parse.initialize(appId);
    Parse.serverURL = environment.urlAnalysis;
  }

  async pushData(data: any) {
    if (!environment.enableCustomerAnalysis) {
      return;
    }
    await this.getTokenAnalysis()?.toPromise();
    await this.getCurrentTokenAnalysis();
    data.appId = this.tokenAnalysis.tenantId;
    data.phone = this.infoUser.phone || this.infoUser.email;
    data.mail = this.infoUser.email;
    data.userUuid = this.infoUser.email;

    let deviceInfo = this.deviceService.getDeviceInfo();
    data.deviceInfo = deviceInfo.browser + " " + deviceInfo.browser_version,
    data.osInfo = this.deviceService.os + ' ' + this.deviceService.os_version;
    data.appVersion = environment.appVersion;
    data.language = localStorage.getItem('lang') || 'vi';

    const EmailObject = Parse.Object.extend(this.tokenAnalysis.eventKey);
    const emailObject = new EmailObject();
  
    Object.keys(data).forEach((field) => {
      emailObject.set(field, data[field]);
    });
  
    return emailObject.save()
    .then((response: any) => {
      console.log('Dữ liệu đã được lưu thành công:', response);
      return response;
    })
    .catch((error: any) => {
      console.error('Lưu dữ liệu thất bại:', error);
      throw error;
    });
  }
}
