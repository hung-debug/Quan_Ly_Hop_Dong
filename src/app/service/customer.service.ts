import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface Customer {
  id: number,
  name: string,
  taxCode: string,
  type: string,
  signType:string,
  phone: string,
  email: string,
  handlers: Handler[],
}


export interface Handler{
  ordering: number,
  role: string,
  name: string,
  email: string,
  phone: string | null,
  signType: string,
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  getCustomerUrl: any = `${environment.apiUrl}/api/v1/customers/my-partner`;
  deleteCustomerByIdUrl: any = `${environment.apiUrl}/api/v1/customers/my-partner/`;

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

  public getOrganizationCustomerList(): Observable<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<Customer[]>(this.getCustomerUrl, {headers}).pipe();
  }

  deleteCustomerById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.delete<any>(this.deleteCustomerByIdUrl + id, { headers });
  }


}
