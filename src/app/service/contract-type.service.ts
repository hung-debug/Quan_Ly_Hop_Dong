import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface ContractType {
  id: number,
  name: string,
  code: string,
  ordering: string,
  status: string,
  organization_id: string,
  ceca_push: any;
}
@Injectable({
  providedIn: 'root'
})
export class ContractTypeService {

  addContractTypeUrl: any = `${environment.apiUrl}/api/v1/contract-types`;
  updateContractTypeUrl: any = `${environment.apiUrl}/api/v1/contract-types/`;
  deleteContractTypeUrl: any = `${environment.apiUrl}/api/v1/contract-types/`;
  getContractTypeByIdUrl: any = `${environment.apiUrl}/api/v1/contract-types/`;
  listContractTypeUrl: any = `${environment.apiUrl}/api/v1/contract-types/organizations/`;
  checkCodeContractTypeUrl:any = `${environment.apiUrl}/api/v1/contract-types/check-code-unique`;
  checkNameContractTypeUrl:any = `${environment.apiUrl}/api/v1/contract-types/check-name-unique`;

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
    console.log("datas ", datas);
    const body = JSON.stringify({
      name: datas.name,
      code: datas.code,
      ordering: 1,
      status: 1,
      organization_id: this.organization_id,
      ceca_push: datas.ceca_push
    });
    return this.http.post<ContractType>(this.addContractTypeUrl, body, {'headers': headers});
  }

  updateContractType(datas: any) {
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
      ceca_push: datas.ceca_push
    });
    return this.http.put<ContractType>(this.updateContractTypeUrl + datas.id, body, {'headers': headers});
  }

  deleteContractType(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      console.log(this.deleteContractTypeUrl + id);
    return this.http.delete<any>(this.deleteContractTypeUrl + id, {'headers': headers});
  }

  getContractTypeById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<ContractType>(this.getContractTypeByIdUrl + id, {headers}).pipe();
  }

  public getContractTypeList(code:any, name:any,idOrg?: number): Observable<any> {
    this.getCurrentUser();
    let listContractTypeUrl = this.listContractTypeUrl + this.organization_id + "?name=" + name.trim() + "&code=" + code.trim();

    if(idOrg) {
      listContractTypeUrl = this.listContractTypeUrl + idOrg + "?name=" + name.trim() + "&code=" + code.trim();
    }

    console.log(listContractTypeUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<ContractType[]>(listContractTypeUrl, {headers}).pipe();
  }

  checkCodeContractType(code:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      code: code,
      organization_id: this.organization_id,
    });
    return this.http.post<any>(this.checkCodeContractTypeUrl, body, {headers}).pipe();
  }

  checkNameContractType(name:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: name,
      organization_id: this.organization_id,
    });
    return this.http.post<any>(this.checkNameContractTypeUrl, body, {headers}).pipe();
  }
}
