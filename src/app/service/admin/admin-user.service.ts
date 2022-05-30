import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  listUserUrl:any = `${environment.apiUrl}/api/v1/customers/search`;
  getUserByIdUrl: any = `${environment.apiUrl}/api/v1/customers/`;
  updateUserUrl: any = `${environment.apiUrl}`;
  checkPhoneUrl:any = `${environment.apiUrl}`;
  getUserByEmailUrl:any = `${environment.apiUrl}`;
  addUserUrl:any = `${environment.apiUrl}`;
  deleteUserUrl:any = `${environment.apiUrl}`;

  constructor(private http: HttpClient,) { }

  token:any;
  getCurrentUser(){
    //this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').access_token;
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
  }

  getUserList(name: any, email: any, phone:any): Observable<any> {
    this.getCurrentUser();

    let listUserUrl = this.listUserUrl + '?name=' + name.trim() + '&email=' + email.trim() + '&phone=' + phone.trim() + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any>(listUserUrl, {headers}).pipe();
  }

  getUserById(id:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    console.log(headers);
    return this.http.get<any>(this.getUserByIdUrl + id, {'headers': headers});
  }

  updateUser(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      name: datas.name,
      email: datas.email,
      phone: datas.phone,
      organization_id: datas.organizationId,
      birthday: datas.birthday,
      status: datas.status,
      role_id: datas.role,

      sign_image: datas.sign_image,

      phone_sign: datas.phoneKpi,
      phone_tel: datas.networkKpi,

      hsm_name: datas.nameHsm
    });console.log(headers);
    console.log(body);
    return this.http.put<any>(this.updateUserUrl + datas.id, body, {'headers': headers});
  }

  checkPhoneUser(phone:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      phone_tel: phone
    });
    return this.http.post<any>(this.checkPhoneUrl, body, {headers}).pipe();
  }

  getUserByEmail(email:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      email: email
    });
    console.log(headers);
    return this.http.post<any>(this.getUserByEmailUrl, body, {'headers': headers});
  }

  //call api them moi nguoi dung
  addUser(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    // 
    const body = JSON.stringify({
      name: datas.name,
      email: datas.email,
      phone: datas.phone,
      organization_id: datas.organizationId,
      birthday: datas.birthday,
      status: datas.status,
      role_id: datas.role,

      sign_image: datas.sign_image,

      phone_sign: datas.phoneKpi,
      phone_tel: datas.networkKpi,

      hsm_name: datas.nameHsm
    });
    console.log(headers);   
    console.log(body);
    return this.http.post<any>(this.addUserUrl, body, {'headers': headers});
  }

  deleteUser(id: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({});
    return this.http.post<any>(this.deleteUserUrl + id, body, {'headers': headers});
  }

}
