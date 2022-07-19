import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  countContractCreateUrl: any = `${environment.apiUrl}/api/v1/dashboard/my-contract`;
  countContractOrgCreateUrl: any = `${environment.apiUrl}/api/v1/dashboard/organization-contract`;
  countContractOrgAllCreateUrl: any = `${environment.apiUrl}/api/v1/contracts/count-my-org-and-descendant-contract`;
  countContractReceivedUrl: any = `${environment.apiUrl}/api/v1/dashboard/my-process`;
  listNotificationUrl: any = `${environment.apiUrl}/api/v1/notification/my-notice`;
  updateViewNotificationUrl:any = `${environment.apiUrl}/api/v1/notification/viewed/`;

  listUnitUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  token:any;
  customer_id:any;
  organization_id:any;
  errorData: any = {};
  redirectUrl: string = '';

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }

  constructor(private http: HttpClient,
    public datepipe: DatePipe,
    public router: Router,
    private toastService: ToastService) { }

  public countContractCreate(isOrg:any, organization_id:any, from_date: any, to_date: any): Observable<any> {
    this.getCurrentUser();
    console.log(from_date);
    let countContractCreateUrl = '';
    console.log(isOrg);
    if(isOrg != 'off'){
      if(organization_id == ""){
        countContractCreateUrl = this.countContractOrgAllCreateUrl + '?organizationId=' + this.organization_id + '&from_date=' + from_date + '&to_date=' + to_date;
      }else{
        countContractCreateUrl = this.countContractOrgCreateUrl + '?organization_id=' + organization_id + '&from_date=' + from_date + '&to_date=' + to_date;
      }
    }else{
      countContractCreateUrl = this.countContractCreateUrl + '?from_date=' + from_date + '&to_date=' + to_date;
    }
    console.log(countContractCreateUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(countContractCreateUrl, {headers}).pipe();
  }

  public countContractReceived(from_date: any, to_date: any): Observable<any> {
    this.getCurrentUser();
    if (from_date != "") {
      from_date = this.datepipe.transform(from_date, 'yyyy-MM-dd');
    }
    if (to_date != "") {
      to_date = this.datepipe.transform(to_date, 'yyyy-MM-dd');
    }
    let countContractReceivedUrl = this.countContractReceivedUrl + '?from_date=' + from_date + '&to_date=' + to_date;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(countContractReceivedUrl, {headers}).pipe();
  }

  public getNotification(status:any, from_date:any, to_date:any, size:any, page:any): Observable<any> {
    this.getCurrentUser();
    if(page != ""){
      page = page - 1;
    }
    let listNotificationUrl = this.listNotificationUrl + '?status=' + status + '&from_date=' + from_date + '&to_date=' + to_date + '&size=' + size + '&page=' + page;
    console.log(listNotificationUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(listNotificationUrl, {headers}).pipe(catchError(this.handleError));
  }

  updateViewNotification(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
      console.log(headers);
    const body ="";
    return this.http.post<any>(this.updateViewNotificationUrl + id, body, {headers}).pipe(catchError(this.handleError));
  }


  handleError(error: HttpErrorResponse) {
    if (error.status === 401 && error.error == 'Unauthorized') {
      this.toastService.showWarningHTMLWithTimeout('Hết phiên đăng nhập', "", 3000)
      this.logout();
    }
    return throwError(this.errorData);
  };

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl("/login");
  }
}
