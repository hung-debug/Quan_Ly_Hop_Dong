import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {map, catchError, retry} from 'rxjs/operators';
import {Helper} from "../core/Helper";
import {DatePipe} from '@angular/common';

export interface Contract {
  id: number,
  name: string,
  code: string,
  typeId: string,
  notes: string,
  status: string,
  createdAt: Date,
  signTime: Date,
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  // listContractUrl:any = `${environment.apiUrl}/api/v1/contracts/my-contract`;
  // addContractUrl:any = `${environment.apiUrl}/api/v1/contracts`;
  //
  // token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
  // errorData:any = {};
  // redirectUrl: string = '';
  //
  // constructor(private http: HttpClient,
  //   public datepipe: DatePipe,) { }
  //
  // public getContractList(): Observable<any> {
  //   const headers = { 'Authorization': 'Bearer ' + this.token}
  //   return this.http.get<Contract[]>(this.listContractUrl, { headers }).pipe();
  // }

  addContractUrl: any = `${environment.apiUrl}/api/v1/auth/login`;
  errorData: any = {};
  redirectUrl: string = '';

  constructor(private http: HttpClient) {
  }

  public getContractList(): Observable<any> {
    return this.http.get("/assets/data.json");
  }


  // addContractStep1(datas:any) {
  //   const headers = new HttpHeaders()
  //     .append('Content-Type', 'application/json')
  //     .append('Authorization', 'Bearer ' + this.token);
  //   const body = JSON.stringify({name: datas.name,
  //                                code: datas.code,
  //                                contract_no: datas.code,
  //                                sign_order: 1,
  //                                sign_time: this.datepipe.transform(datas.sign_time, 'yyyy-MM-ddThh:mm:ssZ'),
  //                                notes: datas.notes,
  //                                type_id: 2,
  //                                customer_id: 2,
  //                                is_template: false,
  //                                status: 1,
  //                               });
  // console.log(headers);
  // console.log(body);
  //   return this.http.post<Contract>(this.addContractUrl, body, {'headers':headers})
  //      .pipe(
  //         map((contract) => {
  //           if (JSON.parse(JSON.stringify(contract)).id != 0) {
  //             return contract;
  //           }else{
  //             return null;
  //           }
  //        }),
  //        catchError(this.handleError)
  //      );
  // }

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
      //         "offsetHeight": "28",
      //         "signType": "organization"
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
      //         "offsetHeight": "28",
      //         "signType": "organization"
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
      //         "offsetHeight": 66,
      //         "signType": "partner"
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
      //         "offsetHeight": 50,
      //         "signType": "partner"
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
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getDataDetermine() {
    return [
      {
        "name": "", // tên bên tham gia
        "type": 1, // loại bên tham gia: tổ chức của tôi | đối tác | cá nhân
        "ordering": 1, // thứ tự thực hiện ký kết của các bên tham gia
        "recipients": [
          // Dữ liệu người xem xét
          {
            "name": "", // tên người tham gia
            "email": "", // email người tham gia
            "phone": "", // sđt người tham gia
            "role": 1, // loại tham gia: xem xét|điều phối| ký | văn thư
            "ordering": 1, // thứ tự thực hiện của người tham gia
            "status": 1, // Trạng thái chưa xử lý/ đã xử lý
            "username": "", // username khi click từ link email
            "password": "", // pw click từ link email
            "is_otp": 1, // select otp
            "sign_type": [ // hình thức ký
            ]
          },
          // Dữ liệu người ký
          {
            "name": "", // tên người tham gia
            "email": "", // email người tham gia
            "phone": "", // sđt người tham gia
            "role": 3, // loại tham gia: xem xét|điều phối| ký | văn thư
            "ordering": 1, // thứ tự thực hiện của người tham gia
            "status": 1, // Trạng thái chưa xử lý/ đã xử lý
            "username": "thangbt", // username khi click từ link email
            "password": "ad", // pw click từ link email
            "is_otp": 1, // select otp
            "sign_type": [ // hình thức ký
            ]
          },
          // dữ liệu văn thư
          {
            "name": "", // tên người tham gia
            "email": "", // email người tham gia
            "phone": "", // sđt người tham gia
            "role": 4, // loại tham gia: xem xét|điều phối| ký | văn thư
            "ordering": 1, // thứ tự thực hiện của người tham gia
            "status": 1, // Trạng thái chưa xử lý/ đã xử lý
            "username": "", // username khi click từ link email
            "password": "", // pw click từ link email
            "is_otp": 1, // select otp
            "sign_type": [ // hình thức ký
            ]
          },
        ],
      },
      // Đối tác
      // Tổ chức
      {
        "name": "Đối tác tổ chức",
        "type": 2, // Đối tác tổ chức
        "ordering": 1,
        "selected": true,
        "recipients": [
          // người điều phối
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 2, // người điều phối
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": [
              {
                "id": 1,
                "name": "Ký ảnh"
              },
              {
                "id": 2,
                "name": "Ký số bằng USB token"
              },
              {
                id: 3,
                name: "Ký số bằng sim KPI"
              },
              {
                id: 4,
                name: "Ký số bằng HSM"
              }
            ]
          },
          // người xem xét
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 1, // người xem xét
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": [
              {
                "id": 1,
                "name": "Ký ảnh"
              },
              {
                "id": 2,
                "name": "Ký số bằng USB token"
              },
              {
                id: 3,
                name: "Ký số bằng sim KPI"
              },
              {
                id: 4,
                name: "Ký số bằng HSM"
              }
            ]
          },
          // người ký
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 3, // người ký
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": [
              {
                "id": 1,
                "name": "Ký ảnh"
              },
              {
                "id": 2,
                "name": "Ký số bằng USB token"
              },
              {
                id: 3,
                name: "Ký số bằng sim KPI"
              },
              {
                id: 4,
                name: "Ký số bằng HSM"
              }
            ]
          },
          // văn thư
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 4, // văn thư
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": [
              {
                "id": 1,
                "name": "Ký ảnh"
              },
              {
                "id": 2,
                "name": "Ký số bằng USB token"
              },
              {
                id: 3,
                name: "Ký số bằng sim KPI"
              },
              {
                id: 4,
                name: "Ký số bằng HSM"
              }
            ]
          }
        ],
      },
      {
        "name": "Đối tác cá nhân",
        "type": 3, // Đối tác cá nhân
        "ordering": 1,
        "selected": false,
        "recipients": [
          // người điều phối
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 2, // người điều phối
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": []
          },
          // người xem xét
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 1, // người xem xét
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": []
          },
          // người ký
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 3, // người ký
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": []
          },
          // văn thư
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 4, // văn thư
            "ordering": 1,
            "status": 1,
            "username": "",
            "password": "",
            "is_otp": 1,
            "sign_type": []
          }
        ],
      }
    ]
  }

}
