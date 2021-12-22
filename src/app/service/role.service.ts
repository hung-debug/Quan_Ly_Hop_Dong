import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface Role {
  id: number,
  name: string,
  code: string,
  ordering: string,
  organization_id: string,
}
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  getRoleByIdUrl: any = `${environment.apiUrl}/api/v1/customers/types/`;
  listRoleUrl: any = `${environment.apiUrl}/api/v1/customers/types/`;

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

  getRoleById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<Role>(this.getRoleByIdUrl + id, {headers}).pipe();
  }

  public getRoleList(code:any, name:any): Observable<any> {
    this.getCurrentUser();
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Role[]>(this.listRoleUrl, {headers}).pipe();
  }
}
