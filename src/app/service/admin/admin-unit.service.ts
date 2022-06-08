import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AdminUnitService {
  listUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  activeUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;
  addUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  constructor(private http: HttpClient) {}

  token: any;
  getCurrentUser() {
    this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').token;
  }

  getUnitList(code: any, name: any) {
    this.getCurrentUser();
    let listUnitUrl =
      this.listUnitUrl +
      '?code=' +
      code.trim() +
      '&name=' +
      name.trim() +
      '&size=10000';
    const headers = { Authorization: 'Bearer ' + this.token };
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

    console.log("body unit");
    console.log(body);

    return this.http.post<any>(this.addUnitUrl, body, { headers: headers });
  }
}
