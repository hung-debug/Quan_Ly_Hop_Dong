import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

export interface Unit {
  id: number,
  name: string,
  code: string,
  email: string,
  phone: string,
  fax: string,
  path: string,
  status: string,
  short_name: string,
  parent_id: string,
}
@Injectable({
  providedIn: 'root'
})
export class UnitService {

  listUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  addUnitUrl: any = `${environment.apiUrl}/api/v1/organizations`;
  updateUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/`;
  getUnitByIdUrl: any = `${environment.apiUrl}/api/v1/organizations/`;
  checkNameUnitUrl:any = ``;
  checkCodeUnitUrl:any = ``;

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

  public getUnitList(filter_code: any, filter_name: any): Observable<any> {
    this.getCurrentUser();

    let listUnitUrl = this.listUnitUrl + '?code=' + filter_code + '&name=' + filter_name + "&size=10000";
    console.log(listUnitUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Unit[]>(listUnitUrl, {headers}).pipe();
  }

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
      status: datas.status,
      parent_id: datas.parent_id,
    });
    console.log(headers);
    console.log(body);
    return this.http.post<Unit>(this.addUnitUrl, body, {'headers': headers});
  }

  updateUnit(datas: any) {
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
      status: datas.status,
      parent_id: datas.parent_id,
      path: null
    });
    console.log(headers);
    console.log(body);
    return this.http.put<Unit>(this.updateUnitUrl + datas.id, body, {'headers': headers});
  }

  getUnitById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<Unit>(this.getUnitByIdUrl + id, {headers}).pipe();
  }

  checkNameUnit(name:any){
    this.getCurrentUser();
    const headers = {'Authorization': 'Bearer ' + this.token}
    let checkNameUnitUrl = this.checkNameUnitUrl + "?name=" + name;
    return this.http.get<any[]>(checkNameUnitUrl, {headers}).pipe();
  }
  
  checkCodeUnit(code:any){
    this.getCurrentUser();
    const headers = {'Authorization': 'Bearer ' + this.token}
    let checkCodeUnitUrl = this.checkCodeUnitUrl + "?code=" + code;
    return this.http.get<any[]>(checkCodeUnitUrl, {headers}).pipe();
  }
}
