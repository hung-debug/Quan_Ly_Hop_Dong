import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AdminUnitService {
  listUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization`;

  activeUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;

  addUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  updateUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  getUnitByIdUrl : any = `${environment.apiUrl}/api/v1/admin/organization/`;

  constructor(private http: HttpClient) {}

  token: any;
  getCurrentUser() {
    this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').token;
  }

  getUnitList(
    name: any,
    address: any,
    representative: any,
    email: any,
    phone: any,
    status: any,
    page: any,
    size: any
  ) {

    console.log("api danh sach to chuc");

    this.getCurrentUser();

  


    let listUnitUrl =
      this.listUnitUrl +
      '?name=' +
      name +
      '&address=' +
      address +
      '&representative=' +
      representative +
      '&email=' +
      email +
      '&phone=' +
      phone +
      '&status=' +
      status +
      '&page=0' +
      '&size=1000'+
      '&sort=name'
      ;
    const headers = { 'Authorization': 'Bearer ' + this.token };

    console.log("vao api tim kiem");

    return this.http.get<any>(listUnitUrl, { headers }).pipe();
  }

  activeUnit(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({});
    return this.http.post<any>(this.activeUnitUrl + id, body, {
      headers: headers,
    });
  }

  updateUnitt(datas: any) {

    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

      console.log("upate unit service");
      console.log(datas.id);

      const body = JSON.stringify({
        name: datas.name,
        code: datas.code,
        taxCode: datas.taxCode,
        shortName: datas.shortName,
        address: datas.address,
        email: datas.email,
        representative: datas.representative,
        position: datas.position,
        size: datas.size,
        phone: datas.phone,
        status: datas.status,
      });

      // console.log("id ");
      // console.log(datas);

      return this.http.put<any>(this.addUnitUrl + datas.id, body, { headers: headers });
  }

  getUnitById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    console.log(headers);
    return this.http.get<any>(this.getUnitByIdUrl + id, {'headers': headers});
  }

  addUnit(datas: any) {


    console.log("datas");
    console.log(datas);

    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      name: datas.name,
      code: datas.code,
      taxCode: datas.taxCode,
      shortName: datas.short_name,
      address: datas.address,
      email: datas.email,
      representative: datas.representatives,
      position: datas.position,
      size: datas.size,
      phone: datas.phone,
      status: datas.status,
    });

    console.log('body unit');
    console.log(body);

    return this.http.post<any>(this.addUnitUrl, body, { headers: headers });
  }
}
