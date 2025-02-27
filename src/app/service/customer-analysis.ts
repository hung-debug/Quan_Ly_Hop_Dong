import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Parse from 'parse';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerAnalysis {
  urlGetTokenAnalysis: any = `${environment.urlgetTokenAnalysis}/v1/auth/authenticate_app`
  tokenAnalysis: any;
  infoUser: any;
  datas: any;
  constructor(private http: HttpClient) {}
    convertToVietnamTimeISOString(date: Date): string {
    const vietnamTime = new Date(date.getTime());
    
    // Lấy các thành phần của thời gian
    const year = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    const hours = String(vietnamTime.getHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getMinutes()).padStart(2, '0');
    const seconds = String(vietnamTime.getSeconds()).padStart(2, '0');
    const milliseconds = String(vietnamTime.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+07:00`;
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
          console.log("token", token)
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

  pushData(data: any) {
    this.getCurrentTokenAnalysis();
    data.appId = this.tokenAnalysis.tenantId;
    data.phone = this.infoUser.phone;
    data.mail = this.infoUser.email;
    data.userUuid = this.infoUser.email;
    const EmailObject = Parse.Object.extend(this.tokenAnalysis.eventKey);
    const emailObject = new EmailObject();
  
    // Duyệt qua từng cặp key-value trong data và tự động set
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

  async pushEvent(eventName: string, data: any) {
    try {
      await this.getCurrentTokenAnalysis(); // Đảm bảo token đã cập nhật
  
      // Thêm thông tin chung vào data
      data.appId = this.tokenAnalysis?.tenantId || '';
      data.phone = this.infoUser?.phone || '';
      data.mail = this.infoUser?.email || '';
      data.timestamp = new Date().toISOString(); // Ghi thời gian xảy ra sự kiện
  
      // Tạo object dựa trên tên sự kiện
      const EventObject = Parse.Object.extend(eventName);
      const eventObject = new EventObject();
  
      // Gán dữ liệu tự động
      Object.keys(data).forEach((field) => {
        eventObject.set(field, data[field]);
      });
  
      // Lưu sự kiện lên server
      const response = await eventObject.save();
      console.log(`Sự kiện ${eventName} đã được lưu thành công:`, response);
      return response;
    } catch (error) {
      console.error(`Lưu sự kiện ${eventName} thất bại:`, error);
      throw error;
    }
  }
  
}
