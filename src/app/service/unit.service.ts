import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';


export interface Unit {
  id: number,
  name: string,
  code: string,
  email: string,
  phone: string,
  fax: string,
  path: string,
  short_name: string,
  parent_id: string,
}
@Injectable({
  providedIn: 'root'
})
export class UnitService {

  addUnitUrl: any = `${environment.apiUrl}/api/v1/organizations`;

  token:any;
  customer_id:any;
  organization_id:any;
  errorData: any = {};
  redirectUrl: string = '';

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }

  constructor(private http: HttpClient,) { }

  addUnit(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      short_name: datas.short_name,
      code: datas.code,
      email: datas.email,
      phone: datas.phone,
      fax: datas.fax,
      status: 1,
      parent_id: datas.parent_id,
    });
    console.log(headers);
    console.log(body);
    return this.http.post<Unit>(this.addUnitUrl, body, {'headers': headers});
  }
}
