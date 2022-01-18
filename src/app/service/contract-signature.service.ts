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

  token: any;
  addContractUrl:any = `${environment.apiUrl}/api/v1/auth/login`;
  shareContractUrl: any = `${environment.apiUrl}/api/v1/shares`;
  shareListContractUrl: any = `${environment.apiUrl}/api/v1/shares`;

  errorData:any = {};
  redirectUrl: string = '';
  public imageSignObs$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private http: HttpClient,
    public datepipe: DatePipe,) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser')||'').access_token;
  }

  public getContractMyProcessList(filter_type: any, filter_contract_no: any, filter_from_date: any, filter_to_date: any, filter_status:any): Observable<any> {
    this.getCurrentUser();
    if (filter_from_date != "") {
      filter_from_date = this.datepipe.transform(filter_from_date, 'yyyy-MM-dd');
    }
    if (filter_to_date != "") {
      filter_to_date = this.datepipe.transform(filter_to_date, 'yyyy-MM-dd');
    }
    let listContractMyProcessUrl = this.listContractMyProcessUrl + '?type=' + filter_type + '&contract_no=' + filter_contract_no + "&from_date=" + filter_from_date + "&to_date=" + filter_to_date + "&size=59";
    //console.log(listContractMyProcessUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Contract[]>(listContractMyProcessUrl, {headers}).pipe();
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
    console.log(body);
    return this.http.post<any>(this.shareContractUrl, body, {'headers': headers}).pipe();
  }

  public getContractShareList(): Observable<any> {
    this.getCurrentUser();
    let shareListContractUrl = this.shareListContractUrl + "?size=1000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(shareListContractUrl, {headers}).pipe();
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

      // contract_user_sign: [
      //   {
      //     "id": "123",
      //     "sign_unit": "so_tai_lieu",
      //     "sign_config": [
      //       {
      //         "sign_unit": "so_tai_lieu",
      //         "id": "signer-0-index-0_123",
      //         "dataset_x": 44,
      //         "dataset_y": 2953.3333333333335,
      //         "position": "317,235,497,265",
      //         "left": 44,
      //         "top": "570",
      //         "number": "4",
      //         "offsetWidth": "135",
      //         "offsetHeight": "28"
      //       }
      //     ]
      //   },
      //   {
      //     "id": "456",
      //     "sign_unit": "text",
      //     "sign_config": [
      //       {
      //         "sign_unit": "text",
      //         "id": "signer-1-index-0_456",
      //         "dataset_x": 316.5,
      //         "dataset_y": 2910.3333333333335,
      //         "position": "149,0,284,85",
      //         "left": 317,
      //         "top": "527",
      //         "number": "4",
      //         "offsetWidth": "135",
      //         "offsetHeight": "28"
      //       }
      //     ]
      //   },
      //   {
      //     "id": "789",
      //     "sign_unit": "chu_ky_anh",
      //     "sign_config": [
      //       {
      //         "sign_unit": "chu_ky_anh",
      //         "id": "signer-2-index-0_789",
      //         "dataset_x": 149,
      //         "dataset_y": 3090.3330891927085,
      //         "position": "148,8,283,93",
      //         "left": 149,
      //         "top": "707",
      //         "number": "4",
      //         "offsetWidth": 106,
      //         "offsetHeight": 66
      //       },
      //       {
      //         "sign_unit": "chu_ky_anh",
      //         "id": "signer-2-index-1_789",
      //         "dataset_x": 448,
      //         "dataset_y": 2404.6665852864585,
      //         "position": "390,663,570,765",
      //         "left": 448,
      //         "top": "21",
      //         "number": "4",
      //         "offsetWidth": 100,
      //         "offsetHeight": 50
      //       }
      //     ]
      //   },
      //   {
      //     "id": "101",
      //     "sign_unit": "chu_ky_so",
      //     "sign_config": [
      //       {
      //         "sign_unit": "chu_ky_so",
      //         "id": "signer-3-index-0_101",
      //         "dataset_x": 407.5,
      //         "dataset_y": 3084.9998372395835,
      //         "position": "409,14,544,99",
      //         "left": 408,
      //         "top": "702",
      //         "number": "4",
      //         "offsetWidth": 135,
      //         "offsetHeight": 85
      //       },
      //       {
      //         "sign_unit": "chu_ky_so",
      //         "id": "signer-3-index-1_101",
      //         "dataset_x": 48.5,
      //         "dataset_y": 2555.6665852864585,
      //         "position": "43,645,223,747",
      //         "left": 49,
      //         "top": "172",
      //         "number": "4",
      //         "offsetWidth": 135,
      //         "offsetHeight": 85
      //       }
      //     ]
      //   }
      // ]


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
    console.log(errorMessage);
    return throwError(errorMessage);
 }


}
