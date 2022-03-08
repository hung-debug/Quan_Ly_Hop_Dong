import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import {Helper} from "../core/Helper";
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ContractTemplateService {

  token: any;
  shareContractTemplateUrl:any = `${environment.apiUrl}/api/v1/`;
  listContractTemplateUrl:any = `http://192.168.1.26:8762/api/v1/contracts/template/my-contract`;
  addInforContractTemplateUrl:any = `http://192.168.1.26:8762/api/v1/contracts/template`;
  documentUrl: any = `http://192.168.1.26:8762/api/v1/documents/template`;
  addDetermineUrl: any = `http://192.168.1.26:8762/api/v1/participants/template/contract/`;
  addSampleContractUrl: any = `http://192.168.1.26:8762/api/v1/fields/template`;
  changeStatusContractUrl: any = `http://192.168.1.26:8762/api/v1/contracts/template/`;
  getDataContract:any = `http://192.168.1.26:8762/api/v1/contracts/template/`;
  getFileContract:any = `http://192.168.1.26:8762/api/v1/documents/by-contract/template/`;
  getObjectSignature:any = `http://192.168.1.26:8762/api/v1/fields/by-contract/template/`;

  constructor(private http: HttpClient,
              public datepipe: DatePipe,) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser')||'').access_token;
  }

  // public getContractTemplateList(isShare:any, filter_name:any, filter_type: any, page:any, size:any): Observable<any> {
  //   return this.http.get("/assets/data-contract-template.json");
  // }

  public getContractTemplateList(isShare:any, filter_name:any, filter_type: any, page:any, size:any): Observable<any> {
    this.getCurrentUser();

    if(page != ""){
      page = page - 1;
    }
    if(!filter_type){
      filter_type="";
    }
    let listContractTemplateUrl = this.listContractTemplateUrl + '?name=' + filter_name.trim() + '&type=' + filter_type + "&page=" + page + "&size=" + size;
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<any[]>(listContractTemplateUrl, {headers}).pipe();
  }

  addInforContractTemplate(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      code: datas.code,
      start_time: this.datepipe.transform(datas.start_time, "yyyy-MM-dd'T'hh:mm:ss'Z'"),
      end_time: this.datepipe.transform(datas.start_time, "yyyy-MM-dd'T'hh:mm:ss'Z'"),
      type_id: datas.type_id
    });
    console.log(body);
    return this.http.post<any>(this.addInforContractTemplateUrl, body, {'headers': headers}).pipe();
  }

  addDocument(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      type: 1,
      path: datas.filePath,
      filename: datas.fileName,
      bucket: datas.fileBucket,
      internal: 1,
      ordering: 1,
      status: 1,
      contract_id: datas.id,
    });
    return this.http.post<any>(this.documentUrl, body, {'headers': headers});
  }

  addDocumentAttach(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      type: 3,
      path: datas.filePathAttach,
      filename: datas.fileNameAttach,
      bucket: datas.fileBucketAttach,
      internal: 1,
      ordering: 1,
      status: 1,
      contract_id: datas.id,
    });
    return this.http.post<any>(this.documentUrl, body, {'headers': headers});
  }

  getContractDetermine(data_determine: any, id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_determine);
    console.log(body);
    return this.http.post<any>(this.addDetermineUrl + id, body, {'headers': headers}).pipe();
  }

  getContractSample(data_sample_contract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_sample_contract);
    console.log(body);
    return this.http.post<any>(this.addSampleContractUrl, body, {'headers': headers}).pipe();
  }

  changeStatusContract(id: any, statusNew:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    console.log(headers);
    const body = {};
    return this.http.post<any>(this.changeStatusContractUrl + id + '/change-status/' + statusNew, body, {'headers': headers});
  }

  getDetailContract(idContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let arrApi = [];
    arrApi = [
      this.http.get<any>(this.getDataContract + idContract, {headers}),
      this.http.get<any>(this.getFileContract + idContract, {headers}),
      this.http.get<any>(this.getObjectSignature + idContract, {headers}),
    ];
    return forkJoin(arrApi);
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

  getDataFormatContractUserSign() {
    return [
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'so_tai_lieu',
        sign_config: []
      },
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'text',
        sign_config: []
      },
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'chu_ky_anh',
        sign_config: []
      },
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'chu_ky_so',
        sign_config: []
      },
    ]
  }
}
