import { parttern } from 'src/app/config/parttern';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import {Helper} from "../core/Helper";
import {BehaviorSubject} from "rxjs/index";
import { DatePipe } from '@angular/common';

export interface Contract {
  status: string
}
@Injectable({
  providedIn: 'root'
})
export class ContractSignatureService {

  listContractMyProcessUrl: any = `${environment.apiUrl}/api/v1/contracts/my-process`;
  listContractMyProcessUrlSignMany: any = `${environment.apiUrl}/api/v1/contracts/my-contract/can-sign-multi?`;
  listContractMyProcessUrlDownloadMany: any = `${environment.apiUrl}/api/v1/file/download-multi?`;

  token: any;
  addContractUrl:any = `${environment.apiUrl}/api/v1/auth/login`;
  shareContractUrl: any = `${environment.apiUrl}/api/v1/shares`;
  shareListContractUrl: any = `${environment.apiUrl}/api/v1/shares`;
  dashboardContractMyProcessUrl: any = `${environment.apiUrl}/api/v1/dashboard/my-process-by-status/`;
  getViewContractList: any = `${environment.apiUrl}/api/v1/contracts/my-contract/can-review-multi?`;

  errorData:any = {};
  redirectUrl: string = '';
  public imageSignObs$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private http: HttpClient,
    public datepipe: DatePipe,) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser')||'').access_token;
  }

  public getContractMyProcessList(filter_name:any, filter_type: any, filter_contract_no: any, filter_from_date: any, filter_to_date: any, filter_status:any, page:any, size:any, contractStatus: any): Observable<any> {
    this.getCurrentUser();
    if (filter_from_date != "") {
      filter_from_date = this.datepipe.transform(filter_from_date, 'yyyy-MM-dd');
    }
    if (filter_to_date != "") {
      filter_to_date = this.datepipe.transform(filter_to_date, 'yyyy-MM-dd');
    }
    if(page != ""){
      page = page - 1;
    }
    let listContractMyProcessUrl = this.listContractMyProcessUrl + '?keyword=' + filter_name.trim() + '&type=' + filter_type + '&status=' + filter_status + '&contract_no=' + filter_contract_no.trim() + "&from_date=" + filter_from_date + "&to_date=" + filter_to_date + "&page=" + page + "&size=" + size + "&contractStatus=" + contractStatus;
    
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Contract[]>(listContractMyProcessUrl, {headers}).pipe();
  }

  public getContractMyProcessListSignMany(keyword?: string, filter_type?: any, filter_contract_no?: any, filter_from_date?: any, filter_to_date?: any) {
    this.getCurrentUser();

    const headers = {'Authorization': 'Bearer ' + this.token};
    const orgId = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.organizationId;

    filter_type = filter_type ? filter_type : '';
    filter_contract_no = filter_contract_no ? filter_contract_no: '';
    
    filter_from_date = filter_from_date ? this.datepipe.transform(filter_from_date, 'yyyy-MM-dd'): '';
    filter_to_date = filter_to_date ? this.datepipe.transform(filter_to_date, 'yyyy-MM-dd'): '';
    
    return this.http.get<any[]>(this.listContractMyProcessUrlSignMany+'orgId='+orgId+'&platform=web'+'&keyword='+keyword+'&type=' + filter_type+ '&contract_no=' + filter_contract_no + "&from_date=" + filter_from_date + "&to_date=" + filter_to_date,{headers}).pipe();
  }

  public getViewContractMyProcessList(keyword?: string, filter_type?: any, filter_contract_no?: any, filter_from_date?: any, filter_to_date?: any){
    this.getCurrentUser();

    const headers = {'Authorization': 'Bearer ' + this.token};
    const orgId = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.organizationId;

    filter_type = filter_type ? filter_type : '';
    filter_contract_no = filter_contract_no ? filter_contract_no: '';
    
    filter_from_date = filter_from_date ? this.datepipe.transform(filter_from_date, 'yyyy-MM-dd'): '';
    filter_to_date = filter_to_date ? this.datepipe.transform(filter_to_date, 'yyyy-MM-dd'): '';

    return this.http.get<any[]>(this.getViewContractList+'orgId='+orgId+'&platform=web'+'&keyword='+keyword+'&type=' + filter_type+ '&contract_no=' + filter_contract_no + "&from_date=" + filter_from_date + "&to_date=" + filter_to_date,{headers}).pipe();
  }

  public getContractMyProcessListDownloadMany(ids: any): Observable<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders().append('Authorization', 'Bearer ' + this.token)
    return this.http.get(this.listContractMyProcessUrlDownloadMany+'ids='+ids,{headers, responseType: 'blob'}).pipe();
  }
  
  public getSignatureListUser(): Observable<any> {
    return this.http.get("/assets/data-signature-user.json");
  }

  public getContractDetail(): Observable<any> {
    return this.http.get("/assets/data-contract-sign.json");
  }

  public getContractList(): Observable<any> {
    return this.http.get("/assets/data-contract-received.json");
  }

  shareContract(email: any, id:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      email: email,
      contract_id: id
    });
    
    return this.http.post<any>(this.shareContractUrl, body, {'headers': headers}).pipe();
  }

  public getContractShareList(filter_name:any, filter_type: any, filter_contract_no: any, filter_from_date: any, filter_to_date: any, filter_status:any, page:any, size:any, contractStatus: any): Observable<any> {
    this.getCurrentUser();
    if (filter_from_date != "") {
      filter_from_date = this.datepipe.transform(filter_from_date, 'yyyy-MM-dd');
    }
    if (filter_to_date != "") {
      filter_to_date = this.datepipe.transform(filter_to_date, 'yyyy-MM-dd');
    }
    if(page != ""){
      page = page - 1;
    }
    let shareListContractUrl = this.shareListContractUrl + '?keyword=' + filter_name.trim() + '&type=' + filter_type + '&status=' + '&contract_no=' + filter_contract_no.trim() + "&from_date=" + filter_from_date + "&to_date=" + filter_to_date + "&page=" + page + "&size=" + size + "&contractStatus=" + contractStatus;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(shareListContractUrl, {headers}).pipe();
  }

  public getContractMyProcessDashboard(filter_status:any, page:any, size:any): Observable<any> {
    this.getCurrentUser();
    if(page != ""){
      page = page - 1;
    }
    let dashboardContractMyProcessUrl = this.dashboardContractMyProcessUrl + filter_status + "?page=" + page + "&size=" + size;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Contract[]>(dashboardContractMyProcessUrl, {headers}).pipe();
  }

  getProfileObs(): Observable<string> {
    return this.imageSignObs$.asObservable();
  }

  setImageObs(image: string) {
    this.imageSignObs$.next(image);
  }

  objDefaultSampleContract() {
    return {
      file_content: "base64",
      sign_determine: [
        {
          title: 'Người xem xét',
          id: 'nguoi_xem_xet_1',
          property_name: [
            {
              name: 'Họ tên',
              value: ''
            },
            {
              name: 'Email',
              value: ''
            }
          ]
        },
        {
          title: 'Người ký',
          id: 'nguoi_ky_1',
          property_name: [
            {
              name: 'Họ tên',
              value: ''
            },
            {
              name: 'Email',
              value: ''
            },
            {
              name: 'Loại ký',
              value: ''
            },
            {
              name: 'Số điện thoại',
              value: ''
            }
          ]
        }
      ],

      contract_user_sign: [
        {
          id: Helper._ranDomNumberText(10),
          sign_unit: 'so_tai_lieu',
          sign_config: "[]",
          name: ""
        },
        {
          id: Helper._ranDomNumberText(10),
          sign_unit: 'text',
          sign_config: "[]",
          name: "",
        },
        {
          id: Helper._ranDomNumberText(10),
          sign_unit: 'chu_ky_anh',
          sign_config: "[]",
          name: ""
        },
        {
          id: Helper._ranDomNumberText(10),
          sign_unit: 'chu_ky_so',
          sign_config: "[]",
          name: ""
        },
      ]
    }


  }


  // Error handling
  handleError(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(errorMessage);
 }


}