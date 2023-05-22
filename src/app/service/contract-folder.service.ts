import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Folder {
  name: string;
  open: boolean;
  contracts?: any[];
  id?: number;
  parentId?: number
}

@Injectable({
  providedIn: 'root'
})
export class ContractFolderService {

  getContractFolderListUrl = `${environment.apiUrl}/api/v1/contracts/contract-folder`;
  getContractFolderNameUrl = `${environment.apiUrl}/api/v1/contracts/contract-folder`;
  // getContractFolderListUrl = `${environment.apiUrlTest}`;
  // getContractFolderNameUrl = `${environment.apiUrlTest}`;

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
}