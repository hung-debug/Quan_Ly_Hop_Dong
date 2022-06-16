import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AdminUnitService {
  listUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  activeUnitUrl: any = `${environment.apiUrl}/api/v1/organizations/search`;

  addUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  updateUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  getUnitByIdUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  constructor(private http: HttpClient) {}

  token: any;
  getCurrentUser() {
    this.token = JSON.parse(localStorage.getItem('currentAdmin') || '').token;
  }

  deleteUnit(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.delete<any>(this.listUnitUrl + id, { headers: headers });
  }

  deletePackUnit(id: any, idPack: any) {

    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    console.log("token ",this.token);

    return this.http.patch<any>(
      this.listUnitUrl + id + '/service/cancel/' + idPack, '',
      { headers: headers }
    ).pipe();
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

    console.log('status');
    console.log(status);

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
      '&size=1000' +
      '&sort=name';
    const headers = { Authorization: 'Bearer ' + this.token };

    console.log('vao api tim kiem');

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

    console.log('upate unit service');
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

    return this.http.put<any>(this.addUnitUrl + datas.id, body, {
      headers: headers,
    });
  }

  updatePackUnit(datas: any, idPack: any
    ) {
    this.getCurrentUser();

    console.log("end date ", datas.endDate.toLocaleDateString("fr-CA"));

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

      const body = JSON.stringify({
        serviceId: idPack,
        purchaseDate: datas.purchaseDate.toLocaleDateString("fr-CA"),
        paymentType: datas.paymentType.id,
        paymentStatus: datas.paymentStatus.id,
        startDate: datas.startDate.toLocaleDateString("fr-CA"),
        endDate: datas.endDate.toLocaleDateString("fr-CA"),
        paymentDate: datas.paymentDate.toLocaleDateString("fr-CA"),
      });

    console.log('body ', body);

    return this.http.patch<any>(
      this.listUnitUrl + datas.id + '/service/register/',
      body,
      { headers: headers }
    );
  }

  getUnitById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.get<any>(this.getUnitByIdUrl + id, { headers: headers });
  }

  getPackUnitByIdPack(id: any, idPack: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.get<any>(
      this.listUnitUrl + id + '/service/detail/' + idPack,
      { headers: headers }
    );
  }

  addUnit(datas: any) {
    console.log('datas');
    console.log(datas);

    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

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

    console.log('body unit');
    console.log(body);

    return this.http.post<any>(this.addUnitUrl, body, { headers: headers });
  }

  addPackUnit(datas: any) {
    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      serviceId: datas.idPack,
      purchaseDate: JSON.stringify(datas.purchaseDate).substring(1, 11),
      paymentType: datas.paymentType.id,
      paymentStatus: datas.paymentStatus.id,
      startDate: JSON.stringify(datas.startDate).substring(1, 11),
      endDate: JSON.stringify(datas.endDate).substring(1, 11),
      paymentDate: JSON.stringify(datas.paymentDate).substring(1, 11),
    });

    console.log('body ', body);

    return this.http.patch<any>(
      this.listUnitUrl + datas.id + '/service/register',
      body,
      { headers: headers }
    );
  }
}
