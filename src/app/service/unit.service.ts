import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SysService } from './sys.service';
import { Router } from '@angular/router';
import { data } from 'jquery';

export interface Unit {
  totalCecaPurchased: number;
  tax_code: any;
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
  ceca_push_mode: any
}
@Injectable({
  providedIn: 'root'
})
export class UnitService {

  listUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  addUnitUrl: any = `${environment.apiUrl}/api/v1/organizations`;
  updateUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/`;
  getUnitByIdUrl: any = `${environment.apiUrl}/api/v1/organizations/`;
  checkNameUniqueUrl:any = `${environment.apiUrl}/api/v1/organizations/check-name-unique`;
  checkCodeUniqueUrl:any = `${environment.apiUrl}/api/v1/organizations/check-code-unique`;
  isDataDetermine: any = `${environment.apiUrl} /api/v1/participants/byRecipient/`;
  getNotifyOriganzation: any = `${environment.apiUrl}/api/v1/organizations/`;
  getNumberContractCreateOriganzationUrl: any = `${environment.apiUrl}/api/v1/contracts/total-contracts?orgId=`;
  getNumberContractBuyOriganzationUrl: any = `${environment.apiUrl}/api/v1/organizations/`;

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

  constructor(private http: HttpClient,
    private sysService: SysService,
    public router: Router,) { }

  public getUnitList(filter_code: any, filter_name: any): Observable<any> {
    this.getCurrentUser();

    let listUnitUrl = this.listUnitUrl + '?code=' + filter_code.trim() + '&name=' + filter_name.trim() + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Unit[]>(listUnitUrl, {headers}).pipe(catchError(this.handleError));
  }  

  //add api thêm mới tổ chức user
  addUnit(datas: any) {
    console.log("datas unit ", datas);

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
      tax_code: datas.tax_code
    });

    return this.http.post<any>(this.addUnitUrl, body, {'headers': headers});
  }

  uploadFileUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/import-child-org`;
  uploadFile(file: any) {
    this.getCurrentUser();
    let formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.token)
          
      return this.http.post(
        this.uploadFileUnitUrl,
        formData,
        {
          headers: headers,
          observe: 'response',
          responseType: 'blob'
        }
      ).toPromise();
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
      path: datas.path,
      tax_code: datas.tax_code
    });
    return this.http.put<any>(this.updateUnitUrl + datas.id, body, {'headers': headers});
  }

  getUnitById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<Unit>(this.getUnitByIdUrl + id, {headers}).pipe();
  }

  checkNameUnique(data:any, name:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: name,
      org_id_cha: data.parent_id,
      org_id_con: data.id
    });
    return this.http.post<any>(this.checkNameUniqueUrl, body, {headers}).pipe();
  }
  
  checkCodeUnique(data:any, code:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
        code: code,
        org_id_cha: data.parent_id,
        org_id_con: data.id
      });
    return this.http.post<any>(this.checkCodeUniqueUrl, body, {headers}).pipe();
  }

  getDataNotifyOriganzation() {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let listUrl = this.getNotifyOriganzation + this.organization_id;
    return this.http.get<any[]>(listUrl, {headers}).pipe();
  }

  getNumberContractCreateOriganzation(organization_id:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let listUrl = this.getNumberContractCreateOriganzationUrl + organization_id;
    return this.http.get<any>(listUrl, {headers}).pipe();
  }

  getNumberContractUseOriganzation(organization_id:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let listUrl = this.getNumberContractBuyOriganzationUrl + organization_id + '/service/total-used-items';
    return this.http.get<any>(listUrl, {headers}).pipe();
  }

  getNumberContractBuyOriganzation(organization_id:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let listUrl = this.getNumberContractBuyOriganzationUrl + organization_id + '/service/total-purchased-items';
    return this.http.get<any>(listUrl, {headers}).pipe();
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0 && error.error instanceof ProgressEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('Client side error:', error.error)
      this.router.navigateByUrl("/login");
    }
    return throwError(this.errorData);
  };
  getDataNotifyOriganzation1(organization_id:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let listUrl = this.getNotifyOriganzation + organization_id;
    return this.http.get<any[]>(listUrl, {headers}).pipe();
  }
}
