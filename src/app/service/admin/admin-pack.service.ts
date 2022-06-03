import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminPackService {

  listPackUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  getPackUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  deletePackUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  updatePackUrl: any = `${environment.apiUrl}/api/v1/organizations/`;
  checkNameUniqueUrl:any = `${environment.apiUrl}/api/v1/organizations/check-name-unique`;
  checkCodeUniqueUrl:any = `${environment.apiUrl}/api/v1/organizations/check-code-unique`;

  constructor(
    private http: HttpClient,
  ) { }

  token:any;
  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').access_token;
  }

  getPackList(name:any, code:any, price:any, time:any, status:any, number_contract:any){
    this.getCurrentUser();
    let listPackUrl = this.listPackUrl + '?name=' + name.trim() + '&code=' + code.trim() + '&price=' + price.trim() + '&time=' + time.trim() + '&status=' + status.trim() + '&number_contract=' + number_contract.trim() + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(listPackUrl, {headers}).pipe();
  
  }

  getPackById(id:any){
    this.getCurrentUser();
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(this.getPackUrl + id, {headers}).pipe();
  }

  deletePack(id:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({});
    return this.http.post<any>(this.deletePackUrl + id, body, {'headers': headers});
  }

  updatePack(datas: any) {
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
      path: datas.path
    });
    console.log(headers);
    console.log(body);
    return this.http.put<any>(this.updatePackUrl + datas.id, body, {'headers': headers});
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
}
