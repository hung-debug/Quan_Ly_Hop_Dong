import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

export interface ContractType {
  id: number,
  name: string,
  code: string,
  ordering: string,
  status: string,
  organization_id: string
}
@Injectable({
  providedIn: 'root'
})
export class ContractTypeService {

  addContractTypeUrl: any = `${environment.apiUrl}/api/v1/contract-types`;
  getContractTypeByIdUrl: any = `${environment.apiUrl}/api/v1/contract-types/`;

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

  addContractType(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      code: datas.code,
      ordering: 1,
      status: 1,
      organization_id: this.organization_id,
    });
    return this.http.post<ContractType>(this.addContractTypeUrl, body, {'headers': headers});
  }

  getUnitById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<ContractType>(this.getContractTypeByIdUrl + id, {headers}).pipe();
  }
}
