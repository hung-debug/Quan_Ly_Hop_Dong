import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface Customer {
  id?: number,
  name: string,
  taxCode?: string,
  type: string,
  signType?: SignType[],
  phone?: string,
  email?: string,
  login_by?: string,
  locale?: string,
  handlers?: Handler[],
}

export interface OrgCustomer {
  id?: number,
  name: string,
  taxCode: string,
  type: string,
  handlers: Handler[],
}

export interface PersonalCustomer {
  id?: number,
  name: string,
  type: string,
  phone: string,
  email: string,
  signType: SignType[],
  login_by: string,
  locale: string,
  card_id: string,
}



export interface Handler{
  ordering: number,
  role: string,
  name: string,
  email: string,
  phone: string | null,
  signType: SignType[],
  login_by?: string,
  locale: string,
  card_id?: string,
}

export interface SignType{
  id: number,
  name: string,
  is_otp: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  getCustomerUrl: any = `${environment.apiUrl}/api/v1/customers/my-partner`;
  deleteCustomerByIdUrl: any = `${environment.apiUrl}/api/v1/customers/my-partner/`;
  addCustomerUrl: any = `${environment.apiUrl}/api/v1/customers/my-partner`;
  editCustomerUrl: any = `${environment.apiUrl}/api/v1/customers/my-partner`;

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

  public getCustomerList(): Observable<any> {
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

  getDataOrgCustomer(){
    return {
      name: '',
      taxCode: '',
      type: 'ORGANIZATION',
      handlers: [
        {
          ordering: 1,
          role: 'SIGNER',
          name: '',
          email: '',
          phone: '',
          signType: [],
          locale: 'vi',
          login_by: 'email'
        },
        {
          ordering: 1,
          role: 'ARCHIVER',
          name: '',
          email: '',
          phone: '',
          signType: [],
          locale: 'vi',
          login_by: 'email'
        },
        {
          ordering: 1,
          role: 'REVIEWER',
          name: '',
          email: '',
          phone: '',
          signType: [],
          locale: 'vi',
          login_by: 'email'
        },
        {
          ordering: 1,
          role: 'COORDINATOR',
          name: '',
          email: '',
          phone: '',
          signType: [],
          locale: 'vi',
          login_by: 'email'
        },
      ],
    };
  }
  
  getDataOrgCustomerDemo(){
    return {
      name: 'Tan',
      taxCode: '0123456789',
      type: 'ORGANIZATION',
      handlers: [
        {
          ordering: 1,
          role: 'SIGNER',
          name: 'Tannn',
          email: 'ginvudz1@gmail.com',
          phone: '',
          signType: [{
            id: 4,
            name: "Ký số bằng HSM",
            is_otp: false
          }],
          locale: 'vi',
          login_by: 'email'
        },
        {
          ordering: 1,
          role: 'ARCHIVER',
          name: '',
          email: '',
          phone: '',
          signType: [{
            id: 4,
            name: "Ký số bằng HSM",
            is_otp: false
          }],
          locale: 'vi',
          login_by: 'email'
        },
        {
          ordering: 1,
          role: 'REVIEWER',
          name: '',
          email: '',
          phone: '',
          signType: [],
          locale: 'vi',
          login_by: 'email'
        },
        {
          ordering: 1,
          role: 'COORDINATOR',
          name: '',
          email: '',
          phone: '',
          signType: [],
          locale: 'vi',
          login_by: 'email'
        },
      ],
    };
  }

  getDataPersonalCustomer(){
    return {
      name: '',
      type: 'PERSONAL',
      phone: '',
      email: '',
      signType: [],
      locale: 'vi',
      login_by: 'email',
      card_id: '',
    };
  }

  addOrgCustomer(data: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    console.log(data);
    const handlers: Handler[] = [];
    for(let i = 0; i < data.handlers.length; i++){
      let handler: Handler = {
        ordering: data.handlers[i].ordering,
        role: data.handlers[i].role,
        name: data.handlers[i].name,
        email: data.handlers[i].email,
        phone: data.handlers[i].phone,
        signType: data.handlers[i].signType,
        login_by: data.handlers[i].login_by,
        locale: data.handlers[i].locale,
        card_id: data.handlers[i].card_id,
      };
      if(handler.card_id == null)
      handler.card_id = '';
      if(handler.phone == null)
      handler.phone = '';
      if(handler.email == null)
      handler.email = '';
      handlers.push(handler);
    }
    const body = JSON.stringify({
      name: data.name,
      taxCode: data.taxCode,
      type: data.type,
      handlers: handlers,
    });
    return this.http.post<any>(this.getCustomerUrl, body, { headers: headers });
  }

  addPersonalCustomer(data: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    // const body = JSON.stringify({
    //   name: data.name,
    //   type: data.type,
    //   phone: data.phone,
    //   email: data.email,
    //   signType: data.signType,
    //   login_by : data.login_by,
    //   locale: data.locale,
    //   card_id: data.card_id,
    // });
    // console.log(body);
    const customer = {
      id: data.id,
      name: data.name,
      type: data.type,
      phone: data.phone,
      email: data.email,
      signType: data.signType,
      login_by : data.login_by,
      locale: data.locale,
      card_id: data.card_id,
      handlers: [],
      taxCode: '',
    }
    if(customer.card_id == null)
    customer.card_id = '';
    if(customer.phone == null)
    customer.phone = '';
    if(customer.email == null)
    customer.email = '';

    const body = JSON.stringify(customer);
    return this.http.post<any>(this.getCustomerUrl, body, { headers: headers });
  }

  editOrgCustomer(data: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const handlers: Handler[] = [];
    for(let i = 0; i < data.handlers.length; i++){
      let handler: Handler = {
        ordering: data.handlers[i].ordering,
        role: data.handlers[i].role,
        name: data.handlers[i].name,
        email: data.handlers[i].email,
        phone: data.handlers[i].phone,
        signType: data.handlers[i].signType,
        login_by: data.handlers[i].login_by,
        locale: data.handlers[i].locale,
        card_id: data.handlers[i].card_id,
      };
      if(handler.card_id == null)
      handler.card_id = '';
      if(handler.phone == null)
      handler.phone = '';
      if(handler.email == null)
      handler.email = '';
      handlers.push(handler);
    }
    const body = JSON.stringify({
      id: data.id,
      name: data.name,
      taxCode: data.taxCode,
      type: data.type,
      handlers: handlers,
    });
    return this.http.put<any>(this.editCustomerUrl, body, { headers: headers });
  }

  editPersonalCustomer(data: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const customer = {
      id: data.id,
      name: data.name,
      type: data.type,
      phone: data.phone,
      email: data.email,
      signType: data.signType,
      login_by : data.login_by,
      locale: data.locale,
      card_id: data.card_id,
      handlers: [],
      taxCode: '',
    }
    if(customer.card_id == null)
    customer.card_id = '';
    if(customer.phone == null)
    customer.phone = '';
    if(customer.email == null)
    customer.email = '';

    const body = JSON.stringify(customer);
    return this.http.put<any>(this.editCustomerUrl, body, { headers: headers });
  }


}
