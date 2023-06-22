import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { dateFormat } from 'highcharts';
import { Contract } from './contract.service';
import { Observable } from 'rxjs';

export interface Folder {
  name: string;
  contracts?: any[];
  id?: number;
  parentId?: number;
  description: string;
  createdDate?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ContractFolderService {

  getContractFolderListUrl = `${environment.apiUrl}/api/v1/contracts/contract-folder`;
  getContractFolderNameUrl = `${environment.apiUrl}/api/v1/contracts/contract-folder`;
  addContractFolderUrl = `${environment.apiUrl}/api/v1/contracts/contract-folder`;
  deleteContractFolderUrl = `${environment.apiUrl}/api/v1/contracts/contract-folder/`;
  getContractCreatedListUrl = `${environment.apiUrl}/api/v1/contracts/my-contract?keyword=`;
  getContractShareListUrl: any = `${environment.apiUrl}/api/v1/shares`;
  getContractMyProcessListUrl: any = `${environment.apiUrl}/api/v1/contracts/my-process`;
  // getContractFolderListUrl = `${environment.apiFolder}/contract-folder`;
  // getContractFolderNameUrl = `${environment.apiFolder}/contract-folder`;
  // getContractFolderListUrl = `${environment.apiUrl}`;
  // getContractFolderNameUrl = `${environment.apiUrl}`;

  token: any;
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

  getContractFoldersList() {    
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<Folder[]>(this.getContractFolderListUrl, {headers}).pipe();
  }

  getContractFolderName(){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<Folder[]>(this.getContractFolderNameUrl, {headers}).pipe();
}

  addContractFolder(item: Folder){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let folder = {
      name: item.name,
      description: item.description,
      parentId: 0
    }
    const body = JSON.stringify(folder);
    return this.http.post(this.addContractFolderUrl, body, {headers}).pipe();
  }

  deleteContractFolder(id: number){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.delete(this.deleteContractFolderUrl + id, {headers}).pipe();
  }

  editContractFolder(item: Folder){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let folder = {
      name: item.name,
      description: item.description
    }
    const body = JSON.stringify(folder);
    return this.http.put(this.deleteContractFolderUrl + item.id, body, {headers}).pipe();
  }

  convertDateTime(dateTime: any){
    const date = new Date(dateTime);
    return date;
  }

  getContractCreatedList(filter_name: string, status: any, page: number, size: number): Observable<any>{
    this.getCurrentUser();
    const headers = { Authorization: 'Bearer ' + this.token };
    if(page){
      page = page - 1;
    }
    const getContractUrl = this.getContractCreatedListUrl +  filter_name.trim() + '&type=&contract_no=&from_date=&to_date=&' + 'status=' + status + '&remain_day=' + '&page=' + page + '&size=' + size;
    return this.http.get<Contract[]>(getContractUrl, { headers }).pipe();
  }

  public getContractMyProcessList(filter_name:any, filter_status:any, page:any, size:any): Observable<any> {
    this.getCurrentUser();
    if(page != ""){
      page = page - 1;
    }
    let listContractMyProcessUrl = this.getContractMyProcessListUrl + '?keyword=' + filter_name.trim() + '&type=&status=' + filter_status + '&contract_no=' + "&from_date=" + "&to_date=" + "&page=" + page + "&size=" + size + "&contractStatus=";
    
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Contract[]>(listContractMyProcessUrl, {headers}).pipe();
  }

  public getContractShareList(filter_name:any, page:any, size:any): Observable<any> {
    this.getCurrentUser();
    if(page != ""){
      page = page - 1;
    }
    let shareListContractUrl = this.getContractShareListUrl + '?keyword=' + filter_name.trim() + '&type=' + '&status=' + '&contract_no=' + "&from_date=" + "&to_date=" + "&page=" + page + "&size=" + size + "&contractStatus=";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(shareListContractUrl, {headers}).pipe();
  }

}