import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Helper} from "../core/Helper";
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContractTemplateService {

  token: any;
  shareContractTemplateUrl:any = `${environment.apiUrl}/api/v1/`;

  constructor(private http: HttpClient) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser')||'').access_token;
  }

  public getContractTemplateList(): Observable<any> {
    return this.http.get("/assets/data-contract-template.json");
  }

  shareContract(email:any, id: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      email: email,
      contract_id: id
    });
    return this.http.post<any>(this.shareContractTemplateUrl, body, {'headers': headers}).pipe();
  }
}
