import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Helper} from "../core/Helper";
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContractTemplateService {

  token: any;
  shareContractTemplateUrl:any = `${environment.apiUrl}/api/v1/`;

  constructor(private http: HttpClient) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser')||'').access_token;
  }

  public getContractTemplateList(): Observable<any> {
    return this.http.get("/assets/data-contract-template.json");
  }

  shareContract(email:any, id: any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      email: email,
      contract_id: id
    });
    return this.http.post<any>(this.shareContractTemplateUrl, body, {'headers': headers}).pipe();
  }

  getDataDetermine() {
    return [
      {
        "name": "", // tên bên tham gia
        "type": 1, // loại bên tham gia: tổ chức của tôi | đối tác | cá nhân
        "ordering": 1, // thứ tự thực hiện ký kết của các bên tham gia
        status: 1, //
        "recipients": [
          // Dữ liệu người xem xét
          {
            "name": "", // tên người tham gia
            "email": "", // email người tham gia
            "phone": "", // sđt người tham gia
            "role": 2, // loại tham gia: xem xét|điều phối| ký | văn thư
            "ordering": 1, // thứ tự thực hiện của người tham gia
            "status": 0, // Trạng thái chưa xử lý/ đã xử lý
            // "username": "", // username khi click từ link email
            // "password": "", // pw click từ link email
            "is_otp": 0, // select otp
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
            "status": 0, // Trạng thái chưa xử lý/ đã xử lý
            // "username": "thangbt", // username khi click từ link email
            // "password": "ad", // pw click từ link email
            "is_otp": 0, // select otp
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
            "status": 0, // Trạng thái chưa xử lý/ đã xử lý
            // "username": "", // username khi click từ link email
            // "password": "", // pw click từ link email
            "is_otp": 0, // select otp
            "sign_type": [ // hình thức ký
            ]
          },
        ],
        // "contract_id": 1
      },
      // Đối tác
      // Tổ chức
      {
        "name": "",
        "type": 2, // Đối tác tổ chức
        "ordering": 2,
        status: 1,
        "recipients": [
          // người điều phối
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 1, // người điều phối
            "ordering": 1,
            "status": 0,
            // "username": "",
            // "password": "",
            "is_otp": 0,
            "sign_type": []
          },
          // người xem xét
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 2, // người xem xét
            "ordering": 1,
            "status": 0,
            // "username": "",
            // "password": "",
            "is_otp": 0,
            "sign_type": []
          },
          // người ký
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 3, // người ký
            "ordering": 1,
            "status": 0,
            // "username": "",
            // "password": "",
            "is_otp": 0,
            "sign_type": []
          },
          // văn thư
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 4, // văn thư
            "ordering": 1,
            "status": 0,
            // "username": "",
            // "password": "",
            "is_otp": 0,
            "sign_type": []
          }
        ],
        // "contract_id": 1
      },
      // {
      //   "name": "",
      //   "type": 3, // Đối tác cá nhân
      //   "ordering": 1,
      //   "contract_id": 1,
      //   "recipients": [
      //     // người ký
      //     {
      //       "name": "",
      //       "email": "",
      //       "phone": "",
      //       "role": 3, // người ký
      //       "ordering": 1,
      //       "status": 1,
      //       "username": "",
      //       "password": "",
      //       "is_otp": 1,
      //       "sign_type": []
      //     }
      //   ],
      // }
    ]
  }

  getDataDetermineInitialization() {
    return [
      {
        "name": "",
        "type": 1,
        "ordering": 1,
        status: 1,
        "recipients": [
          {
            "name": "",
            "email": "",
            "phone": "",
            "role": 3,
            "ordering": 1,
            "status": 0,
            "is_otp": 0,
            "sign_type": [
            ]
          }
        ],
      },
      {
        "name": "",
        "type": 2,
        "ordering": 2,
        status: 1,
        "recipients": [
          {
            "name": "Người ký 1",
            "email": "",
            "phone": "",
            "role": 3,
            "ordering": 1,
            "status": 0,
            "is_otp": 0,
            "sign_type": []
          }
        ],
      },
    ]
  }
}
