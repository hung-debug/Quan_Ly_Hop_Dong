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
  groupId:any;
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
  listContractTypeV2Url: any = `${environment.apiUrl}/api/v1/contract-types/organizations-v2/`;
  listGroupContract: any = `${environment.apiUrl}/api/v1/contracts-group`;
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

    const body = JSON.stringify({
      name: datas.name,
      code: datas.code,
      ordering: 1,
      status: 1,
      organization_id: this.organization_id,
      ceca_push: datas.ceca_push,
      groupId: datas.groupId
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
      ceca_push: datas.ceca_push,
      groupId: datas.groupId
    });
    return this.http.put<ContractType>(this.updateContractTypeUrl + datas.id, body, {'headers': headers});
  }

  deleteContractType(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.delete<any>(this.deleteContractTypeUrl + id, {'headers': headers});
  }

  getGroupContract(){
    let contain_msale = false;
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<ContractType>(this.listGroupContract + '?contain-msale=' + contain_msale, {headers}).pipe();
  }

  getContractTypeById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<ContractType>(this.getContractTypeByIdUrl + id, {headers}).pipe();
  }

  public getContractTypeList(code:any, name:any,idOrg?: number, row: number = 15, page: any = 0): Observable<any> {
    this.getCurrentUser();
    let listContractTypeUrl = this.listContractTypeUrl + this.organization_id + "?name=" + name.trim() + "&code=" + code.trim() + "&size=" + row  +'&page=' + page;

    if(idOrg) {
      listContractTypeUrl = this.listContractTypeUrl + idOrg + "?name=" + name.trim() + "&code=" + code.trim() + "&size=" + row  +'&page=' + page;
    }


    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<ContractType[]>(listContractTypeUrl, {headers}).pipe();
  }

  public getContractTypeListV2(code:any, name:any,idOrg?: number): Observable<any> {
    this.getCurrentUser();
    let listContractTypeV2Url = this.listContractTypeV2Url + this.organization_id + "?name=" + name.trim() + "&code=" + code.trim();

    if(idOrg) {
      listContractTypeV2Url = this.listContractTypeV2Url + idOrg + "?name=" + name.trim() + "&code=" + code.trim();
    }


    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<ContractType[]>(listContractTypeV2Url, {headers}).pipe();
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
