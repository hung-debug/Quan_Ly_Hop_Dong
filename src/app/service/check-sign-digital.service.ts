import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckSignDigitalService {

  token:any;
  listUrl: any = `${environment.apiUrl}/api/v1/sign/signatureInfo`;
  getPage: any = `${environment.apiUrl}/api/v1/contracts/page`;
  constructor(private http: HttpClient) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser')||'').access_token;
  }

  getList(file:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.token);
    let formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.listUrl, formData, {'headers': headers}).pipe();
  }
  
  getPagePdfOld(file:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.token);
    let formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.getPage, formData, {'headers': headers}).pipe();
  }
}
