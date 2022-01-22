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
  role: string,
}
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  getRoleByIdUrl: any = `${environment.apiUrl}/api/v1/customers/roles/`;
  listRoleUrl: any = `${environment.apiUrl}/api/v1/customers/roles/search`;
  addRoleUrl: any = `${environment.apiUrl}/api/v1/customers/roles`;
  updateRoleUrl: any = `${environment.apiUrl}/api/v1/customers/roles/`;
  deleteRoleUrl: any = `${environment.apiUrl}/api/v1/customers/roles`;

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
    return this.http.get<any>(this.getRoleByIdUrl + id, {headers}).pipe();
  }

  addRole(data: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: data.name,
      code: data.code,
      organization_id: this.organization_id,
      status: 1,
      permissions: data.selectedRole,
      description: data.note
    });
    console.log(body);
    return this.http.post<any>(this.addRoleUrl, body, {headers}).pipe();
  }

  updateRole(data: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: data.name,
      code: data.code,
      organization_id: this.organization_id,
      status: 1,
      permissions: data.selectedRole,
      description: data.note
    });
    return this.http.put<any>(this.updateRoleUrl + data.id, body, {headers}).pipe();
  }

  deleteRole(data: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: data.name,
      code: data.code,
      organization_id: this.organization_id,
      status: 1,
      permissions: data.selectedRole,
      description: data.note
    });
    console.log(body);
    return this.http.post<any>(this.deleteRoleUrl, body, {headers}).pipe();
  }

  public getRoleList(code:any, name:any): Observable<any> {
    this.getCurrentUser();
    const headers = {'Authorization': 'Bearer ' + this.token}
    let listRoleUrl = this.listRoleUrl + "?name=" + name + "&code=" + code + "&size=10000"
    return this.http.get<any[]>(listRoleUrl, {headers}).pipe();
  }
}
