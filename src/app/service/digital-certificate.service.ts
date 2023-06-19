import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { Helper } from '../core/Helper';
import { DatePipe } from '@angular/common';
import { forkJoin, BehaviorSubject, Subject } from 'rxjs';
import axios from 'axios';
import { User } from './user.service';
import { encode } from 'base64-arraybuffer';
import { SysService } from './sys.service';
import { Router } from '@angular/router';
import { log } from 'console';

export interface DigitalCertificate {
  file: File;
  list_email: string[];
  password: string;
  status: string;
  file_name: string;
}
@Injectable({
  providedIn: 'root',
})
export class DigitalCertificateService {
  addCertificate: any = `${environment.apiUrl}/api/v1/sign/import-cert`;
  getListEmail: any = `${environment.apiUrl}/api/v1/customers/list-email-containing`;
  getAllCert: any = `${environment.apiUrl}/api/v1/sign/find-cert`;
  updateCert: any = `${environment.apiUrl}/api/v1/sign/update-user-from-cert`;

  token: any;
  customer_id: any;
  organization_id: any;
  getCurrentUser() {
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }
  constructor(private http: HttpClient,
    private sysService: SysService,
    public datepipe: DatePipe,
    public router: Router,) { }

  addImportCTS(file: any,email:any,password:any,status:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.token);
    let formData = new FormData();
    formData.append('file', file);
    formData.append('list_email', email);
    formData.append('password', password);
    formData.append('status', status);
    return this.http.post<any>(this.addCertificate, formData, {'headers': headers}).pipe();
  }
  updateCTS(status:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.token);
    let formData = new FormData();
    // formData.append('list_email', email);
    formData.append('status', status);
    return this.http.put<any>(this.updateCert, formData, {'headers': headers}).pipe();
  }

  getList(file:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.token);
    let formData = new FormData();
    formData.append('file', file);
    return file;
  }

  getListAllEmail(email: string){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      let listEmailUrl = this.getListEmail+ '?email='+email;
    return this.http.get<any>(listEmailUrl, {headers});
  }

  public getAllCertificate(file_name: string, status: any, keystoreDateStart: any, keystoreDateEnd: any, number:any, size:any,): Observable<any>{
    this.getCurrentUser();
    if (keystoreDateStart != "") {
      keystoreDateStart = this.datepipe.transform(keystoreDateStart, 'yyyy-MM-dd');
    }
    if (keystoreDateEnd != "") {
      keystoreDateEnd = this.datepipe.transform(keystoreDateEnd, 'yyyy-MM-dd');
    }
    if(number != ""){
      number = number - 1;
    }
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      let listCertificate = this.getAllCert+ '?file_name=' + '' + '&status=' + '' + '&size=' +size + '&number=' +number;
    return this.http.get<any>(listCertificate, {headers});
  }

  public searchCertificate(FileName: string, status: any, keystoreDateStart: any, keystoreDateEnd: any, number:any, size:any,): Observable<any>{
    this.getCurrentUser();
    if (keystoreDateStart != "") {
      keystoreDateStart = this.datepipe.transform(keystoreDateStart, 'yyyy-MM-dd');
    }
    if (keystoreDateEnd != "") {
      keystoreDateEnd = this.datepipe.transform(keystoreDateEnd, 'yyyy-MM-dd');
    }
    if(number != ""){
      number = number - 1;
    }
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      let listCertificate = this.getAllCert+ '?file_name=' + FileName + '&status=' + status + '&size=' +size + '&number=' +number;
    return this.http.get<any>(listCertificate, {headers});
  }

}

