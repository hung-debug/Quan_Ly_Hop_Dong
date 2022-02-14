import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {map, catchError, retry} from 'rxjs/operators';
import {Helper} from "../core/Helper";
import {DatePipe} from '@angular/common';
import {forkJoin, BehaviorSubject} from "rxjs";
import axios from 'axios';
import {User} from "./user.service";

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
export interface File {
  path: string,
}



@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private messageShareData = new BehaviorSubject<unknown>('');
  currentMessage = this.messageShareData.asObservable();


  listContractUrl: any = `${environment.apiUrl}/api/v1/contracts/my-contract`;
  listContractMyProcessUrl: any = `${environment.apiUrl}/api/v1/contracts/my-process`;
  addContractUrl: any = `${environment.apiUrl}/api/v1/contracts`;
  addDetermineUrl: any = `${environment.apiUrl}/api/v1/participants/contract/`;
  addDetermineCoorditionUrl: any = `${environment.apiUrl}/api/v1/participants/`;
  addSampleCntractUrl: any = `${environment.apiUrl}/api/v1/fields`;
  documentUrl: any = `${environment.apiUrl}/api/v1/documents`;
  addConfirmContractUrl: any = `${environment.apiUrl}/api/v1/contracts/`;
  changeStatusContractUrl: any = `${environment.apiUrl}/api/v1/contracts/`;
  coordinationSuccess: any = `${environment.apiUrl}/api/v1/processes/coordinator/`;
  listContractTypeUrl: any = `${environment.apiUrl}/api/v1/contract-types/organizations/`;
  processAuthorizeContractUrl: any = `${environment.apiUrl}/api/v1/processes/authorize`;
  addGetDataContract:any = `${environment.apiUrl}/api/v1/contracts/`;
  addGetFileContract:any = `${environment.apiUrl}/api/v1/documents/by-contract/`;
  addGetObjectSignature:any = `${environment.apiUrl}/api/v1/fields/by-contract/`;
  updateInfoContractUrl:any = `${environment.apiUrl}/api/v1/fields/`;
  updateInfoContractConsiderUrl:any = `${environment.apiUrl}/api/v1/processes/approval/`;
  rejectContractUrl:any = `${environment.apiUrl}/api/v1/processes/reject/`;
  uploadFileUrl:any = `${environment.apiUrl}/api/v1/upload/organizations/`;
  uploadFileBase64Url:any = `${environment.apiUrl}/api/v1/upload/organizations/`;
  currentUser:any = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  getNotifyOriganzation: any = `${environment.apiUrl}/api/v1/organizations/`;
  isDataDetermine: any = `${environment.apiUrl} /api/v1/participants/byRecipient/`;
  signDigitalMobi: any = `${environment.apiUrl}/api/v1/processes/digital-sign/`;
  getAccountSignDigital: any = `http://localhost:6704/api/mobi/getcert?mst=`;
  postSignDigital: any = `http://localhost:6704/api/mobi/signpdf`;
  postSignDigitalSimPKI: any = `https://econtract.mobifone.vn/SignService/v2/sign-document`;
  getFileSignSimPKI: any = `https://econtract.mobifone.vn/SignService/download-signed-document?signed_doc_id=`;
  signFilePKI: any = `${environment.apiUrl}/api/v1/sign/sim-pki/`;
  getAllContractTypesUrl: any = `${environment.apiUrl}/api/v1/contract-types/`;
  imageMobiBase64: any;
  getNameSearch: any = `${environment.apiUrl}/api/v1/customers/search`;
  addGetFileZipContract:any = `${environment.apiUrl}/api/v1/documents/compress/`;
  checkCodeUniqueUrl:any = `${environment.apiUrl}/api/v1/contracts/check-code-unique`;

  token:any;
  customer_id:any;
  organization_id:any;
  errorData: any = {};
  redirectUrl: string = '';

  constructor(private http: HttpClient,
              public datepipe: DatePipe,) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/text');
    this.http.get('/assets/sign-digital.txt', { responseType: 'text', headers }).subscribe(data => {
      this.imageMobiBase64 = data;
    })
  }

  changeMessage(message: any) {
    this.messageShareData.next(message);
  }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.customer_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.id;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }

  getAuthCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  public getContractTypeList(): Observable<any> {
    this.getCurrentUser();
    let listContractTypeUrl = this.listContractTypeUrl + this.organization_id;
    console.log(listContractTypeUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Contract[]>(listContractTypeUrl, {headers}).pipe();
  }

  public getContractList(filter_type: any, filter_contract_no: any, filter_from_date: any, filter_to_date: any, filter_status:any, page:any, size:any): Observable<any> {
    this.getCurrentUser();

    if (filter_from_date != "") {
      filter_from_date = this.datepipe.transform(filter_from_date, 'yyyy-MM-dd');
    }
    if (filter_to_date != "") {
      filter_to_date = this.datepipe.transform(filter_to_date, 'yyyy-MM-dd');
    }
    let remain_day = "";
    if(filter_status != "" && filter_status == 33){
      remain_day = "5";
    }
    if(page != ""){
      page = page - 1;
    }
    let listContractUrl = this.listContractUrl + '?type=' + filter_type + '&contract_no=' + filter_contract_no + "&from_date=" + filter_from_date + "&to_date=" + filter_to_date + "&status=" + filter_status + "&remain_day=" + remain_day + "&page=" + page + "&size=" + size;
    console.log(listContractUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Contract[]>(listContractUrl, {headers}).pipe();
  }

  public getContractMyProcessList(filter_type: any, filter_contract_no: any, filter_from_date: any, filter_to_date: any): Observable<any> {
    this.getCurrentUser();
    if (filter_from_date != "") {
      filter_from_date = this.datepipe.transform(filter_from_date, 'yyyy-MM-dd');
    }
    if (filter_to_date != "") {
      filter_to_date = this.datepipe.transform(filter_to_date, 'yyyy-MM-dd');
    }
    let listContractMyProcessUrl = this.listContractMyProcessUrl + '?type=' + filter_type + '&contract_no=' + filter_contract_no + "&from_date=" + filter_from_date + "&to_date=" + filter_to_date + "";
    console.log(listContractMyProcessUrl);
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<Contract[]>(listContractMyProcessUrl, {headers}).pipe();
  }

  addContractStep1(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      code: datas.code,
      contract_no: datas.code,
      //sign_order: 1,
      sign_time: this.datepipe.transform(datas.sign_time, "yyyy-MM-dd'T'hh:mm:ss'Z'"),
      notes: datas.notes,
      role_id: datas.role_id,
      //customer_id: this.customer_id,
      //is_template: false,
      //status: 1,
      alias_url: "",
      refs: datas.contractConnect,
      type_id: datas.type_id,
      //refs:[]
    });
    console.log(headers);
    console.log(body);
    return this.http.post<Contract>(this.addContractUrl, body, {'headers': headers})
      .pipe(
        map((contract) => {
          if (JSON.parse(JSON.stringify(contract)).id != 0) {
            return contract;
          } else {
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

  getContractSample(data_sample_contract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_sample_contract);
    return this.http.post<Contract>(this.addSampleCntractUrl, body, {'headers': headers})
      .pipe(
        map((contract) => {
          if (JSON.parse(JSON.stringify(contract)).id != 0) {
            return contract;
          } else {
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

  processAuthorizeContract(infoAuthorize: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.post<any>(this.processAuthorizeContractUrl, infoAuthorize, {'headers': headers});
  }

  getAllAccountsDigital() {
    this.getCurrentUser();
    let config = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Sec-Fetch-Mode': 'cors',
        'Connection': 'keep-alive',
        'Sec-Fetch-Site': 'cross-site'
      }
    }
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json; charset=utf-8')
      .append('Sec-Fetch-Mode', 'cors')
      .append('Connection', 'keep-alive')
      .append('Sec-Fetch-Site', 'cross-site');
    // return this.http.get<any>(this.getAccountSignDigital, {'headers': headers});
    return axios.get(this.getAccountSignDigital, config);
  }

  postSignDigitalMobi(signCertDigital: any, imgSignGen: any) {
    this.getCurrentUser();
    let config = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Sec-Fetch-Mode': 'cors',
        'Connection': 'keep-alive',
        'Sec-Fetch-Site': 'cross-site'
      }
    };
    let dataPost = {
      certSerial: signCertDigital.Serial,
      fieldName: "",
      fileData: signCertDigital.valueSignBase64,
      imageData: imgSignGen ? imgSignGen : this.imageMobiBase64,
      page: signCertDigital.page.toString(),
      ph: Math.floor(signCertDigital.signDigitalHeight ? signCertDigital.signDigitalHeight : signCertDigital.height).toString(),
      pw: Math.floor(signCertDigital.signDigitalWidth ? signCertDigital.signDigitalWidth : signCertDigital.width).toString(),
      px: Math.floor(signCertDigital.signDigitalX ? signCertDigital.signDigitalX : signCertDigital.coordinate_x).toString(),
      py: Math.floor(signCertDigital.signDigitalY ? signCertDigital.signDigitalY : signCertDigital.coordinate_y).toString(),
      signDate: "11-05-2019 09:55:55",
      typeSign: "4"
    };
    return axios.post(this.postSignDigital, dataPost, config);
    // console.log(datePost);
    // return this.http.post<any>(this.postSignDigital, datePost,{'headers': headers});

  }

  getDataFileUrl(url: any) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/arraybuffer');
    return this.http.get(url, { responseType: 'arraybuffer', headers });
  }

  getDataFileUrlPromise(url: any) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/arraybuffer');
    return this.http.get(url, { responseType: 'arraybuffer', headers }).toPromise();
  }

  getDataBinaryFileUrlPromise(url: any) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-binary');
    return this.http.get(url, { responseType: 'blob', headers }).toPromise();
  }

  getDataBinaryFileUrlConvert(url: any) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-binary');
    return this.http.get(url, { responseType: 'blob', headers });
  }

  getDataFileSIMPKIUrlPromise(idPdf: any) {
    const headers = new HttpHeaders()
      .append('TenantCode', 'mobifone.vn')
      .append('Content-Type', 'application/arraybuffer');
    return this.http.get(this.getFileSignSimPKI + idPdf, { responseType: 'arraybuffer', headers }).toPromise();
  }

  uploadFileSimPKI(file: any) {
    this.getCurrentUser();
    let formData = new FormData();
    formData.append('file', file);
    formData.append('msisdn', '84901764011');
    formData.append('networkCode', 'mobifone');
    formData.append('prompt', 'Ký số file data');
    formData.append('reason', 'ký luôn');

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('TenantCode', 'mobifone.vn');

    return this.http.post<any>(this.postSignDigitalSimPKI, formData, {'headers':headers}).toPromise();
  }

  getDataNotifyOriganzation() {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let listContractUrl = this.getNotifyOriganzation + this.organization_id;
    return this.http.get<Contract[]>(listContractUrl, {headers}).pipe();
  }

  getContractDetermine(data_determine: any, id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_determine);
    return this.http.post<Contract>(this.addDetermineUrl + id, body, {'headers': headers})
      .pipe(
        map((contract) => {
          if (JSON.parse(JSON.stringify(contract)).id != 0) {
            return contract;
          } else {
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

  getContractTypes(idTypeContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getAllContractTypesUrl + idTypeContract, {'headers': headers})
      .pipe(
        map((typesContract) => {
          return typesContract.name ? typesContract.name : '';
        }),
        catchError(this.handleError)
      );
  }


  getContractDetermineCoordination(data_determine: any, id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_determine);
    return this.http.put<Contract>(this.addDetermineCoorditionUrl + id, body, {'headers': headers})
      .pipe(
        map((contract) => {
          if (JSON.parse(JSON.stringify(contract)).id != 0) {
            return contract;
          } else {
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

  public getNameOrganization(filter_organization_id: any, filter_name: any): Observable<any> {
    this.getCurrentUser();
    let listUserUrl = this.getNameSearch + '?name=' + filter_name + "&size=10000";
    const headers = {'Authorization': 'Bearer ' + this.token}
    return this.http.get<User[]>(listUserUrl, {headers}).pipe();
  }


  getListDataCoordination(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({type: id});
    let listContractUrl = this.addConfirmContractUrl + id;
    return this.http.get<Contract[]>(listContractUrl, {headers}).pipe();
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
    console.log(headers);
    console.log(body);
    return this.http.post<Contract>(this.documentUrl, body, {'headers': headers});
  }

  addDocumentDone(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      type: 2,
      path: datas.filePathDone,
      filename: datas.fileNameDone,
      bucket: datas.fileBucketDone,
      internal: 1,
      ordering: 1,
      status: 1,
      contract_id: datas.id,
    });
    console.log(headers);
    console.log(body);
    return this.http.post<Contract>(this.documentUrl, body, {'headers': headers});
  }

  signPkiDigital(phone: any, networkCode: any, recipientId: any, nameContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token)
      .append('Connection', 'Keep-Alive');
    const body = {
      "mobile": phone,
      "network_code": networkCode,
      "prompt": `Bạn có yêu cầu ký số hợp đồng ${nameContract}. Vui lòng nhập mã pin để thực hiện ký.`,
      "reason": "reason"
    };
    return this.http.post<any>(this.signFilePKI + recipientId, body, {'headers': headers}).toPromise();
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
    console.log(headers);
    console.log(body);
    return this.http.post<Contract>(this.documentUrl, body, {'headers': headers});
  }

  addConfirmContract(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = "";
    console.log(headers);
    return this.http.put<Contract>(this.addConfirmContractUrl + datas.id + '/start-bpm', body, {'headers': headers});
  }

  getFileContract(idContract: any) : Observable<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<File>(this.addGetFileContract + idContract, {headers}).pipe();
  }

  getFileZipContract(idContract: any) : Observable<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<File>(this.addGetFileZipContract + idContract, {headers}).pipe();
  }

  getFileContractPromise(idContract: any) : Promise<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<File>(this.addGetFileContract + idContract, {headers}).toPromise();
  }

  getDetermineCoordination(idCoordination: number) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<File>(this.isDataDetermine + idCoordination, {headers}).pipe();
  }

  changeStatusContract(id: any, statusNew:any, reason:any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = {
      reason: reason
    };
    console.log(headers);
    return this.http.post<Contract>(this.changeStatusContractUrl + id + '/change-status/' + statusNew, body, {'headers': headers});
  }

  coordinationContract(id: any, data: any, recipient_id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = "";
    // console.log(headers);
    return this.http.put<Contract>(this.coordinationSuccess + id + `/${recipient_id}`, data, {'headers': headers});
  }

  considerRejectContract(id: any, reason: string) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = {
      reason: reason
    };
    console.log(headers);
    return this.http.put<any>(this.rejectContractUrl + id, body,{'headers': headers});
  }

  updateDigitalSignatured(id: any, base64: string) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = {
      name: "contract_" + new Date().getTime() + ".pdf",
      content: "data:application/pdf," + base64
    };
    console.log(headers);
    return this.http.put<any>(this.signDigitalMobi + id, body,{'headers': headers}).toPromise();
  }

  updateInfoContractSignature(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = "";
    console.log(headers);
    return this.http.put<any>(this.updateInfoContractUrl + datas.id, datas, {'headers': headers});
  }

  updateInfoContractConsider(datas: any, recipient_id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    console.log(headers);

    return this.http.put<any>(this.updateInfoContractConsiderUrl + recipient_id, datas, {'headers': headers});

  }

  updateInfoContractConsiderToPromise(datas: any, recipient_id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.put<any>(this.updateInfoContractConsiderUrl + recipient_id, datas, {'headers': headers}).toPromise();

  }

  uploadFileImageSignature(formData: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.post<File>(this.uploadFileUrl + this.currentUser?.organizationId + `/single`, formData, {'headers': headers});
  }

  uploadFileImageBase64Signature(formData: any) {

    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.post<any>(this.uploadFileBase64Url + formData?.organizationId + `/base64`, formData, {'headers':headers});
  }


  getDetailContract(idContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let arrApi = [];
    arrApi = [
      this.http.get<any>(this.addGetDataContract + idContract, {headers}),
      this.http.get<any>(this.addGetFileContract + idContract, {headers}),
      this.http.get<any>(this.addGetObjectSignature + idContract, {headers}),
    ];
    return forkJoin(arrApi);
  }

  getDataCoordination(idContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.addGetDataContract + idContract, {headers});
    // addGetDataContract:any = `${environment.apiUrl}/api/v1/contracts/`;
  }

  getDetailInforContract(idContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.get<any>(this.addGetDataContract + idContract, {headers});
  }


  convertUrltoBinary(res: any) {
    const headers = new HttpHeaders().append('Content-Type', 'application/binary');
    // @ts-ignore
    return this.http.get(res, { responseType: 'binary', headers })
  }

  checkCodeUnique(code:any){
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
        code: code
      });
    return this.http.post<any>(this.checkCodeUniqueUrl, body, {headers}).pipe();
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
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'so_tai_lieu',
          sign_config: "[]",
        },
        {
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'text',
          sign_config: "[]",
        },
        {
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'chu_ky_anh',
          sign_config: "[]",
        },
        {
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'chu_ky_so',
          sign_config: "[]",
        },
      ]
    }

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
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  getDatermineRole3() {
    return {
      "name": "",
      "type": 3, // Đối tác cá nhân
      "ordering": 1,
      "contract_id": 1,
      "recipients": [
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
        }
      ],
    }
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
            "name": "",
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
