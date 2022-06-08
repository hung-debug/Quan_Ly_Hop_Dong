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
    this.getCurrentUser();

    let listUnitUrl =
      this.listUnitUrl +
      '?name=' +
      name.trim() +
      '&address=' +
      address.trim() +
      '&representative=' +
      representative.trim() +
      '&email=' +
      email.trim() +
      '&phone=' +
      phone.trim() +
      '&status=' +
      status.trim() +
      '&page=' +
      page.trim() +
      '&size=' +
      size.trim();
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

  addUnit(datas: any) {
    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      name: datas.nameOrg,
      code: datas.code,
      taxCode: datas.tax_code,
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
