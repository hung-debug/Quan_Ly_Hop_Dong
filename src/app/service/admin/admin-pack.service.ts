import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminPackService {

  listPackUrl: any = `${environment.apiUrl}/api/v1/admin/service-package/`;
  listPackUrlComboBox: any = `${environment.apiUrl}/api/v1/admin/service-package/codes`;

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
    this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').token;
  }

  getPackList(name:string, code:string, totalBeforeVAT:any,totalAfterVAT: any, duration:any, numberOfContracts:any, status:any, page: number, size: number){

    this.getCurrentUser();
    let listPackUrl = this.listPackUrl + '?name=' + name.trim() + '&code=' + code.trim() + '&totalBeforeVAT=' + totalBeforeVAT + '&totalAfterVAT='+totalAfterVAT+'&duration=' + duration.trim() + 
    '&numberOfContracts=' + numberOfContracts.trim() + '&status=' + status +  "&page="+page+ "&size=" + size+"&sort=name";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(listPackUrl, {headers}).pipe();
  
  }

  getPackListComboBox(name:any, code:any, totalBeforeVAT:any,totalAfterVAT: any, duration:any, numberOfContracts:any, status:any){

    console.log("status ",status);

    this.getCurrentUser();
    let listPackUrl = this.listPackUrl + '?name=' + name.trim() + '&code=' + code.trim() + '&totalBeforeVAT=' + totalBeforeVAT + '&totalAfterVAT='+totalAfterVAT+'&duration=' + duration.trim() + 
    '&numberOfContracts=' + numberOfContracts.trim() + '&status=' + status +  "&page=0"+ "&size=1000" +"&sort=name";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(this.listPackUrlComboBox, {headers}).pipe();
  
  }

  addPack(datas: any) {
    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      code: datas.code,
      name: datas.name,
      totalBeforeVAT: datas.totalBeforeVAT,
      totalAfterVAT: datas.totalAfterVAT,
      type: datas.type,
      calculatorMethod: datas.calc,
      duration: datas.time,
      numberOfContracts: datas.number_contract,
      description: datas.describe,
      status: datas.status
    });

    console.log('body unit');
    console.log(body);

    return this.http.post<any>(this.listPackUrl, body, { headers: headers });
  }

  getPackById(id:any){
    this.getCurrentUser();
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(this.listPackUrl + id, {headers}).pipe();
  }


  deletePack(id:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({});
    return this.http.delete<any>(this.listPackUrl + id, {'headers': headers});
  }

  updatePack(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      code: datas.code,
      name: datas.name,
      totalBeforeVAT: datas.totalBeforeVAT,
      totalAfterVAT: datas.totalAfterVAT,
      type: datas.type,
      calculatorMethod: datas.calc,
      duration: datas.time,
      numberOfContracts: datas.number_contract,
      description: datas.describe,
      status: datas.status
    });


    return this.http.put<any>(this.listPackUrl + datas.id,body, { headers: headers });
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
