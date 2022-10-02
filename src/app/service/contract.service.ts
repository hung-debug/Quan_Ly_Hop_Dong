import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { Helper } from '../core/Helper';
import { DatePipe } from '@angular/common';
import { forkJoin, BehaviorSubject, Subject } from 'rxjs';
import axios from 'axios';
import { User } from './user.service';
import { head } from 'lodash';

export interface Contract {
  id: number;
  name: string;
  code: string;
  typeId: string;
  notes: string;
  status: string;
  createdAt: Date;
  signTime: Date;
}
export interface File {
  path: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private messageShareData = new BehaviorSubject<unknown>('');
  currentMessage = this.messageShareData.asObservable();

  listContractUrl: any = `${environment.apiUrl}/api/v1/contracts/my-contract`;
  listPastContractUrl: any = `${environment.apiUrl}/api/v1/contracts/my-contract/organization-old`;
  listContractOrgUrl: any = `${environment.apiUrl}/api/v1/contracts/my-organization-contract`;
  listContractOrgChildrenUrl: any = `${environment.apiUrl}/api/v1/contracts/my-org-and-descendant-contract`;
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
  addGetDataContract: any = `${environment.apiUrl}/api/v1/contracts/`;
  addGetFileContract: any = `${environment.apiUrl}/api/v1/documents/by-contract/`;
  addGetObjectSignature: any = `${environment.apiUrl}/api/v1/fields/by-contract/`;
  updateInfoContractUrl: any = `${environment.apiUrl}/api/v1/fields/`;
  updateInfoContractConsiderUrl: any = `${environment.apiUrl}/api/v1/processes/approval/`;
  rejectContractUrl: any = `${environment.apiUrl}/api/v1/processes/reject/`;
  uploadFileUrl: any = `${environment.apiUrl}/api/v1/upload/organizations/`;
  uploadFileBase64Url: any = `${environment.apiUrl}/api/v1/upload/organizations/`;
  // currentUser: any = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  getNotifyOriganzation: any = `${environment.apiUrl}/api/v1/organizations/`;
  isDataDetermine: any = `${environment.apiUrl}/api/v1/participants/byRecipient/`;
  signDigitalMobi: any = `${environment.apiUrl}/api/v1/processes/digital-sign/`;

  getAccountSignDigital: any = `http://localhost:6704/api/mobi/getcert?mst=`;

  postSignDigital: any = `http://localhost:6704/api/mobi/signpdf`;

  // postSignDigital: any = `https://127.0.0.1:14424/`;

  postSignDigitalSimPKI: any = `https://econtract.mobifone.vn/SignService/v2/sign-document`;
  getFileSignSimPKI: any = `https://econtract.mobifone.vn/SignService/download-signed-document?signed_doc_id=`;
  signFilePKI: any = `${environment.apiUrl}/api/v1/sign/sim-pki/`;
  getAllContractTypesUrl: any = `${environment.apiUrl}/api/v1/contract-types/`;
  imageMobiBase64: any;
  getNameSearch: any = `${environment.apiUrl}/api/v1/customers/search`;
  addGetFileZipContract: any = `${environment.apiUrl}/api/v1/documents/compress/`;
  checkCodeUniqueUrl: any = `${environment.apiUrl}/api/v1/contracts/check-code-unique`;
  getCopyContract: any = `${environment.apiUrl}/api/v1/contracts/clone/`;
  deleteContractUrl: any = `${environment.apiUrl}/api/v1/contracts/`;
  private getDetailFormContract = `${environment.apiUrl}/api/v1/documents/template/by-contract/`;
  private getSaveContractFormInfo = `${environment.apiUrl}/api/v1/contracts/template`;
  getObjectSignature: any = `${environment.apiUrl}/api/v1/fields/template/by-contract/`;
  getFileContractBatchUrl: any = `${environment.apiUrl}/api/v1/batch/`;
  uploadFileContractBatchUrl: any = `${environment.apiUrl}/api/v1/batch/validate/`;
  getContractBatchListUrl: any = `${environment.apiUrl}/api/v1/batch/parse/`;
  confirmContractBatchListUrl: any = `${environment.apiUrl}/api/v1/batch/process/`;
  viewFlowUrl: any = `${environment.apiUrl}/api/v1/contracts/bpmn-flow/`;
  getCheckSign: any = `${environment.apiUrl}/api/v1/recipients/internal/`;
  deleteParticipantContractUrl: any = `${environment.apiUrl}/api/v1/participants/`;
  changeStatusHandle: any = `${environment.apiUrl}/api/v1/recipients/`;
  updateInfoContractConsiderAndOtpUrl: any = `${environment.apiUrl}/api/v1/processes/approval-sign-image/`;
  updateContractIsPushCeCAUrl: any = `${environment.apiUrl}/api/v1/contracts/ceca-push/`;

  getStatusSignImageOtpUrl: any = `${environment.apiUrl}/api/v1/processes/approval-sign-image/`;
  getSendOtpContractProcessUrl: any = `${environment.apiUrl}/api/v1/processes/approval/`;

  checkTaxCodeExistUrl: any = `${environment.apiUrl}/api/v1/contracts/check-mst-exist`;

  signHsmUrl: any = `${environment.apiUrl}/api/v1/sign/hsm/`;

  getFilePdfForMobileUrl: any = `${environment.apiUrl}/api/v1/contracts/review/`;

  cccdFront: any = `http://ekyc2.mobifone.ai/v2/recognition`;

  detectFaceUrl: any = `http://ekyc2.mobifone.ai/v2/verification`;

  changeLinkUrl: any = `${environment.apiUrl}/api/v1/handle/`;

  signManyUsbTokenUrl: any = `${environment.apiUrl}/api/v1/sign/multi/usb-token`;

  token: any;
  customer_id: any;
  organization_id: any;
  errorData: any = {};
  redirectUrl: string = '';

  private message = new BehaviorSubject('First Message');
  sharedMessage = this.message.asObservable();
  /*
   * @return {Observable<string>} : siblingMsg
   */
  // public getMessage(): Observable<string> {
  //   return this.siblingMsg.asObservable();
  // }
  /*
   * @param {string} message : siblingMsg
   */
  public updateMessage(message: string): void {
    this.message.next(message);
  }

  constructor(private http: HttpClient, public datepipe: DatePipe) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/text'
    );
    this.http
      .get('/assets/sign-digital.txt', { responseType: 'text', headers })
      .subscribe((data) => {
        this.imageMobiBase64 = data;
      });
  }


  changeMessage(message: any) {
    this.messageShareData.next(message);
  }

  getCurrentUser() {
    this.token = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).access_token;
    this.customer_id = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.id;
    this.organization_id = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.organizationId;
  }

  getAuthCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  getDetailContractFormInfor(id: number) {
    this.getCurrentUser();
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http
      .get<Contract[]>(this.getDetailFormContract + `${id}`, { headers })
      .pipe();
  }

  public getContractTypeList(): Observable<any> {
    this.getCurrentUser();
    let listContractTypeUrl = this.listContractTypeUrl + this.organization_id;
    // console.log(listContractTypeUrl);
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http.get<Contract[]>(listContractTypeUrl, { headers }).pipe();
  }

  public saveContractFormInfo(data: any) {
    this.getCurrentUser();
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http
      .post<any>(this.getSaveContractFormInfo, { data }, { headers })
      .pipe();
  }

  public getContractList(
    isOrg: any,
    organization_id: any,
    filter_name: any,
    filter_type: any,
    filter_contract_no: any,
    filter_from_date: any,
    filter_to_date: any,
    filter_status: any,
    page: any,
    size: any
  ): Observable<any> {
    this.getCurrentUser();

    if (filter_from_date != '') {
      filter_from_date = this.datepipe.transform(
        filter_from_date,
        'yyyy-MM-dd'
      );
    }
    if (filter_to_date != '') {
      filter_to_date = this.datepipe.transform(filter_to_date, 'yyyy-MM-dd');
    }
    let remain_day = '';
    if (filter_status != '' && filter_status == 33) {
      remain_day = '5';
    }
    if (page != '') {
      page = page - 1;
    }
    let listContractUrl = '';
    if (isOrg == 'off') {
      if (filter_status == '40') {
        filter_status = '30';
        listContractUrl =
          this.listPastContractUrl +
          '?name=' +
          filter_name.trim() +
          '&type=' +
          filter_type +
          '&contract_no=' +
          filter_contract_no.trim() +
          '&from_date=' +
          filter_from_date +
          '&to_date=' +
          filter_to_date +
          '&status=' +
          filter_status +
          '&remain_day=' +
          remain_day +
          '&page=' +
          page +
          '&size=' +
          size;
      } else {
        listContractUrl =
          this.listContractUrl +
          '?name=' +
          filter_name.trim() +
          '&type=' +
          filter_type +
          '&contract_no=' +
          filter_contract_no.trim() +
          '&from_date=' +
          filter_from_date +
          '&to_date=' +
          filter_to_date +
          '&status=' +
          filter_status +
          '&remain_day=' +
          remain_day +
          '&page=' +
          page +
          '&size=' +
          size;
      }
    } else {
      if (organization_id == '') {
        listContractUrl =
          this.listContractOrgChildrenUrl +
          '?organizationId=' +
          this.organization_id +
          '&name=' +
          filter_name.trim() +
          '&type=' +
          filter_type +
          '&contract_no=' +
          filter_contract_no.trim() +
          '&from_date=' +
          filter_from_date +
          '&to_date=' +
          filter_to_date +
          '&status=' +
          filter_status +
          '&remain_day=' +
          remain_day +
          '&page=' +
          page +
          '&size=' +
          size;
      } else {
        listContractUrl =
          this.listContractOrgUrl +
          '?organization_id=' +
          organization_id +
          '&name=' +
          filter_name.trim() +
          '&type=' +
          filter_type +
          '&contract_no=' +
          filter_contract_no.trim() +
          '&from_date=' +
          filter_from_date +
          '&to_date=' +
          filter_to_date +
          '&status=' +
          filter_status +
          '&remain_day=' +
          remain_day +
          '&page=' +
          page +
          '&size=' +
          size;
      }
    }

    console.log(listContractUrl);
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http.get<Contract[]>(listContractUrl, { headers }).pipe();
  }

  public getContractMyProcessList(
    filter_type: any,
    filter_contract_no: any,
    filter_from_date: any,
    filter_to_date: any
  ): Observable<any> {
    this.getCurrentUser();
    if (filter_from_date != '') {
      filter_from_date = this.datepipe.transform(
        filter_from_date,
        'yyyy-MM-dd'
      );
    }
    if (filter_to_date != '') {
      filter_to_date = this.datepipe.transform(filter_to_date, 'yyyy-MM-dd');
    }
    let listContractMyProcessUrl =
      this.listContractMyProcessUrl +
      '?type=' +
      filter_type +
      '&contract_no=' +
      filter_contract_no +
      '&from_date=' +
      filter_from_date +
      '&to_date=' +
      filter_to_date +
      '';
    console.log(listContractMyProcessUrl);
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http
      .get<Contract[]>(listContractMyProcessUrl, { headers })
      .pipe();
  }

  public getContractMyProcessListSignMany() {

  }

  addContractStep1(datas: any, id?: any, type_form?: string) {
    console.log('datas contract step 1 ', datas);

    console.log('type form ', type_form);

    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      code: datas.contract_no,
      contract_no: datas.contract_no,
      sign_time: this.datepipe.transform(
        datas.sign_time ? datas.sign_time : datas.end_time,
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      ),
      notes: datas.notes,
      role_id: datas.role_id,
      alias_url: '',
      refs: datas.contractConnect,
      type_id: datas.type_id,
      is_template: type_form ? true : false,
      template_contract_id: type_form ? datas.template_contract_id : null,
      contract_expire_time: this.datepipe.transform(
        datas.expire_time,
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      ),
    });

    console.log('body add contract step 1', body);

    if (id) {
      console.log('vao day');

      return this.http
        .put<Contract>(this.addGetDataContract + id, body, { headers: headers })
        .pipe(
          map((contract) => {
            if (JSON.parse(JSON.stringify(contract)).id != 0) {
              console.log('contract ', contract);
              return contract;
            } else {
              return null;
            }
          }),
          catchError(this.handleError)
        );
    } else {
      console.log('post contract ');

      return this.http
        .post<Contract>(this.addContractUrl, body, { headers: headers })
        .pipe(
          map((contract) => {
            if (JSON.parse(JSON.stringify(contract)).id != 0) {
              console.log('contract ', contract);
              return contract;
            } else {
              return null;
            }
          }),
          catchError(this.handleError)
        );
    }
  }

  getSignPositionCoordinatesForm(id_contract_form: number) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getObjectSignature + `${id_contract_form}`, {
      headers,
    });
  }

  api_key: any = '9b84cd8c-f042-11ec-aae7-0c4de99e932e';
  detectCCCD(image: any) {
    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('api-key',this.api_key);

    const body = {
      "image":image,
    }

    return this.http.post<any>(this.cccdFront, body, {headers});
  }

  detectFace(imageCCCD: any, imageFace: any) {
    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('api-key',this.api_key);

      const body = {
        "image_cmt":imageCCCD,
        "image_live": imageFace,
      }

    return this.http.post<any>(this.detectFaceUrl, body, {headers})
  }

  getContractSample(data_sample_contract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_sample_contract);
    return this.http
      .post<Contract>(this.addSampleCntractUrl, body, { headers: headers })
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

  getContractSampleEdit(data_sample_contract: any, id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_sample_contract);
    return this.http
      .put<Contract>(this.addSampleCntractUrl + `/${id}`, body, {
        headers: headers,
      })
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
    return this.http.post<any>(
      this.processAuthorizeContractUrl,
      infoAuthorize,
      { headers: headers }
    );
  }

  getAllAccountsDigital() {
    this.getCurrentUser();
    let config = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Sec-Fetch-Mode': 'cors',
        Connection: 'keep-alive',
        'Sec-Fetch-Site': 'cross-site',
      },
    };
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json; charset=utf-8')
      .append('Sec-Fetch-Mode', 'cors')
      .append('Connection', 'keep-alive')
      .append('Sec-Fetch-Site', 'cross-site');
    // return this.http.get<any>(this.getAccountSignDigital, {'headers': headers});

    console.log('get account sign digital ', this.getAccountSignDigital);
    return axios.get(this.getAccountSignDigital, config);
  }

  checkTaxCodeExist(taxCode: any, certB64: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    console.log('tax code ', taxCode);
    console.log('certB64 ', certB64);

    const body = JSON.stringify({
      mst: taxCode,
      certB64: certB64,
    });

    console.log('body ', body);

    return this.http.post<any>(this.checkTaxCodeExistUrl, body, {
      headers: headers,
    });
  }

  getFilePdfForMobile(recipientId: any, image_base64: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = {
      image_base64: image_base64,
    }
    
    return this.http.post<any>(this.getFilePdfForMobileUrl+recipientId, body,{
      headers: headers,
    })
  }

  //signDigital = signCertDigital
  //imgSignGen = imgSignGen
  postSignDigitalMobi(signCertDigital: any, imgSignGen: any) {
    console.log('signCertDigital ', signCertDigital);

    this.getCurrentUser();
    let config = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Sec-Fetch-Mode': 'cors',
        Connection: 'keep-alive',
        'Sec-Fetch-Site': 'cross-site',
      },
    };
    let dataPost = {
      certSerial: signCertDigital.Serial,
      fieldName: '',
      fileData: signCertDigital.valueSignBase64,
      imageData: imgSignGen ? imgSignGen : this.imageMobiBase64,
      page: signCertDigital.page.toString(),
      ph: Math.floor(
        signCertDigital.signDigitalHeight
          ? signCertDigital.signDigitalHeight
          : signCertDigital.height
      ).toString(),
      pw: Math.floor(
        signCertDigital.signDigitalWidth
          ? signCertDigital.signDigitalWidth
          : signCertDigital.width
      ).toString(),
      px: Math.floor(
        signCertDigital.signDigitalX
          ? signCertDigital.signDigitalX
          : signCertDigital.coordinate_x
      ).toString(),
      py: Math.floor(
        signCertDigital.signDigitalY
          ? signCertDigital.signDigitalY
          : signCertDigital.coordinate_y
      ).toString(),
      signDate: '11-05-2019 09:55:55',
      typeSign: '4',
      //algDigest: "SHA_256"
    };

    return axios.post(this.postSignDigital, dataPost, config);
    // console.log(datePost);
    // return this.http.post<any>(this.postSignDigital, datePost,{'headers': headers});
  }

  postSignDigitalMobiMulti(serial: any, valueSignBase64: any,imageData: any,page: any, height: any, width: any,x: any,y: any) {

    this.getCurrentUser();
    let config = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Sec-Fetch-Mode': 'cors',
        Connection: 'keep-alive',
        'Sec-Fetch-Site': 'cross-site',
      },
    };
    let dataPost = {
      certSerial: serial,
      fieldName: '',
      fileData: valueSignBase64,
      imageData: imageData,
      page: page.toString(),
      ph: Math.floor(height).toString(),
      pw: Math.floor(width).toString(),
      px: Math.floor(x).toString(),
      py: Math.floor(y).toString(),
      signDate: '11-05-2019 09:55:55',
      typeSign: '4',
      //algDigest: "SHA_256"
    };

    return axios.post(this.postSignDigital, dataPost, config);
    // console.log(datePost);
    // return this.http.post<any>(this.postSignDigital, datePost,{'headers': headers});
  }


  getDataFileUrl(url: any) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/arraybuffer'
    );
    return this.http.get(url, { responseType: 'arraybuffer', headers });
  }

  getDataFileUrlPromise(url: any) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/arraybuffer'
    );
    return this.http
      .get(url, { responseType: 'arraybuffer', headers })
      .toPromise();
  }

  getDataBinaryFileUrlPromise(url: any) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-binary'
    );
    return this.http.get(url, { responseType: 'blob', headers }).toPromise();
  }

  getDataBinaryFileUrlConvert(url: any) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-binary'
    );
    return this.http.get(url, { responseType: 'blob', headers });
  }

  getDataFileSIMPKIUrlPromise(idPdf: any) {
    const headers = new HttpHeaders()
      .append('TenantCode', 'mobifone.vn')
      .append('Content-Type', 'application/arraybuffer');
    return this.http
      .get(this.getFileSignSimPKI + idPdf, {
        responseType: 'arraybuffer',
        headers,
      })
      .toPromise();
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

    return this.http
      .post<any>(this.postSignDigitalSimPKI, formData, { headers: headers })
      .toPromise();
  }

  signManyUsbToken(fieldId: any[], digitalSign: any) {
    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = {
      fieldId:fieldId,
      digitalSign:digitalSign
    }
    
    return this.http.post<any>(this.signManyUsbTokenUrl,body,{ headers: headers }).pipe();
  }

  getDataNotifyOriganzation() {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let listContractUrl = this.getNotifyOriganzation + this.organization_id;
    return this.http.get<Contract[]>(listContractUrl, { headers }).pipe();
  }

  changeLink(code: any) {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Authorization', 'Bearer ');
    return this.http.get<any>(this.changeLinkUrl+code,{ headers }).pipe();
  }

  getContractDetermine(data_determine: any, id: any) {
    console.log('data_determine ', data_determine);

    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify(data_determine);
    return this.http
      .post<Contract>(this.addDetermineUrl + id, body, { headers: headers })
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
    return this.http
      .get<any>(this.getAllContractTypesUrl + idTypeContract, {
        headers: headers,
      })
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
    return this.http
      .put<Contract>(this.addDetermineCoorditionUrl + id, body, {
        headers: headers,
      })
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

  public getNameOrganization(
    filter_organization_id: any,
    filter_name: any
  ): Observable<any> {
    this.getCurrentUser();
    let listUserUrl =
      this.getNameSearch + '?name=' + filter_name + '&size=10000';
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http.get<User[]>(listUserUrl, { headers }).pipe();
  }

  getListDataCoordination(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({ type: id });
    let listContractUrl = this.addConfirmContractUrl + id;
    return this.http.get<Contract[]>(listContractUrl, { headers }).pipe();
  }

  addDocument(datas: any, is_type?: number, is_status?: number) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      type: is_type ? is_type : 1,
      path: datas.filePath ? datas.filePath : datas.pdfUrl,
      filename: datas.fileName,
      bucket: datas.fileBucket,
      internal: 1,
      ordering: 1,
      status: is_status ? is_status : 1,
      contract_id: datas.id,
    });
    return this.http.post<Contract>(this.documentUrl, body, {
      headers: headers,
    });
  }

  updateFileAttach(id: any, body: any, isStatus?: number) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    if (isStatus) body.type = isStatus;
    return this.http.put<Contract>(this.documentUrl + `/${id}`, body, {
      headers: headers,
    });
  }

  addDocumentDone(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      name: datas.name,
      type: 2,
      path: datas.filePathDone ? datas.filePathDone : datas.pdfUrl,
      filename: datas.fileNameDone ? datas.fileNameDone : datas.fileName,
      bucket: datas.fileBucketDone ? datas.fileBucketDone : datas.fileBucket,
      internal: 1,
      ordering: 1,
      status: 1,
      contract_id: datas.id,
    });
    // console.log(headers);
    // console.log(body);
    return this.http.post<Contract>(this.documentUrl, body, {
      headers: headers,
    });
  }

  signPkiDigital(
    phone: any,
    networkCode: any,
    recipientId: any,
    nameContract: any
  ) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token)
      .append('Connection', 'Keep-Alive');
    const body = {
      mobile: phone,
      network_code: networkCode,
      prompt: `Bạn có yêu cầu ký số hợp đồng ${nameContract}. Vui lòng nhập mã pin để thực hiện ký.`,
      reason: 'reason',
    };
    return this.http
      .post<any>(this.signFilePKI + recipientId, body, { headers: headers })
      .toPromise();
  }

  signHsm(datas: any, recipientId: number) {
    this.getCurrentUser();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    const body = JSON.stringify({
      ma_dvcs: datas.ma_dvcs,
      username: datas.username,
      password: datas.password,
      password2: datas.password2,
      image_base64: datas.imageBase64,
    });

    console.log('body ', body);

    return this.http
      .post<any>(this.signHsmUrl + recipientId, body, { headers: headers })
      .toPromise();
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
    // console.log(headers);
    // console.log(body);
    return this.http.post<Contract>(this.documentUrl, body, {
      headers: headers,
    });
  }

  addConfirmContract(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = '';
    console.log(headers);
    return this.http.put<Contract>(
      this.addConfirmContractUrl + datas.id + '/start-bpm',
      body,
      { headers: headers }
    );
  }

  getFileContract(idContract: any): Observable<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http
      .get<File>(this.addGetFileContract + idContract, { headers })
      .pipe();
  }

  getFileZipContract(idContract: any): Observable<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http
      .get<File>(this.addGetFileZipContract + idContract, { headers })
      .pipe();
  }

  getFileContractPromise(idContract: any): Promise<any> {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http
      .get<File>(this.addGetFileContract + idContract, { headers })
      .toPromise();
  }

  getDetermineCoordination(idCoordination: number) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    console.log('url ', this.isDataDetermine + idCoordination);

    return this.http
      .get<any>(this.isDataDetermine + idCoordination, { headers })
      .pipe();
  }

  changeStatusContract(id: any, statusNew: any, reason: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = {
      reason: reason,
    };
    return this.http.post<Contract>(
      this.changeStatusContractUrl + id + '/change-status/' + statusNew,
      body,
      { headers: headers }
    );
  }

  getChangeNewStatus(id: number, new_status: number) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let body = {};
    return this.http.put<any>(
      this.changeStatusHandle + id + '/change-status/' + new_status,
      body,
      { headers: headers }
    );
  }

  coordinationContract(participant_id: any, body: any, recipient_id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.put<Contract>(
      this.coordinationSuccess + `${participant_id}/${recipient_id}`,
      body,
      { headers: headers }
    );
  }

  considerRejectContract(id: any, reason: string) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = {
      reason: reason,
    };
    console.log(headers);
    return this.http.put<any>(this.rejectContractUrl + id, body, {
      headers: headers,
    });
  }

  updateDigitalSignatured(id: any, base64: string) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = {
      name: 'contract_' + new Date().getTime() + '.pdf',
      content: 'data:application/pdf,' + base64,
    };
    console.log(headers);
    return this.http
      .put<any>(this.signDigitalMobi + id, body, { headers: headers })
      .toPromise();
  }

  updateInfoContractSignature(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = '';
    console.log(headers);
    return this.http.put<any>(this.updateInfoContractUrl + datas.id, datas, {
      headers: headers,
    });
  }

  deleteInfoContractSignature(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = '';
    return this.http.delete<any>(this.updateInfoContractUrl + id, { headers });
  }

  updateInfoContractConsider(datas: any, recipient_id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.put<any>(
      this.updateInfoContractConsiderUrl + recipient_id,
      datas,
      { headers: headers }
    );
  }

  updateInfoContractConsiderImg(datas: any, recipient_id: any) {
    console.log('datas ', datas);

    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.put<any>(
      this.updateInfoContractConsiderAndOtpUrl + recipient_id,
      datas,
      { headers: headers }
    );
  }

  updateInfoContractConsiderToPromise(datas: any, recipient_id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http
      .put<any>(this.updateInfoContractConsiderUrl + recipient_id, datas, {
        headers: headers,
      })
      .toPromise();
  }

  uploadFileImageSignature(formData: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);

    let currentUser: any = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;

    return this.http.post<File>(
      this.uploadFileUrl + currentUser.organizationId + `/single`,
      formData,
      { headers: headers }
    );
  }

  uploadFileImageBase64Signature(formData: any) {
    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);

    console.log('formData ', formData);

    return this.http.post<any>(
      this.uploadFileBase64Url + formData?.organizationId + `/base64`,
      formData,
      { headers: headers }
    );
  }

  getCheckSignatured(id_recipient?: number | string) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getCheckSign + id_recipient, { headers });
  }

  getDetailContract(idContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    let arrApi = [];
    arrApi = [
      this.http.get<any>(this.addGetDataContract + idContract, { headers }),
      this.http.get<any>(this.addGetFileContract + idContract, { headers }),
      this.http.get<any>(this.addGetObjectSignature + idContract, { headers }),
    ];
    return forkJoin(arrApi);
  }

  getDataObjectSignatureLoadChange(contract_id: number) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.addGetObjectSignature + contract_id, {
      headers,
    });
  }

  getDataCoordination(idContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.addGetDataContract + idContract, {
      headers,
    });
    // addGetDataContract:any = `${environment.apiUrl}/api/v1/contracts/`;
  }

  getDetailInforContract(idContract: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.get<any>(this.addGetDataContract + idContract, {
      headers,
    });
  }

  getContractCopy(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getCopyContract + id, { headers });
  }

  convertUrltoBinary(res: any) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/binary'
    );
    // @ts-ignore
    return this.http.get(res, { responseType: 'binary', headers });
  }

  checkCodeUnique(code: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      code: code,
      organization_id: this.organization_id,
    });
    return this.http
      .post<any>(this.checkCodeUniqueUrl, body, { headers })
      .pipe();
  }

  deleteContract(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.delete<any>(this.deleteContractUrl + id, {
      headers: headers,
    });
  }

  getFileContractBatch(idContractTemplate: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = '';
    return this.http
      .post<any>(this.getFileContractBatchUrl + idContractTemplate, body, {
        headers,
      })
      .pipe();
  }

  uploadFileContractBatch(file: any, idContractTemplate: any) {
    this.getCurrentUser();
    let formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.post<any>(
      this.uploadFileContractBatchUrl +
        idContractTemplate +
        '?organization_id=' +
        this.organization_id,
      formData,
      { headers: headers }
    );
  }

  getContractBatchList(file: any, idContractTemplate: any) {
    this.getCurrentUser();
    let formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.post<any>(
      this.getContractBatchListUrl + idContractTemplate,
      formData,
      { headers: headers }
    );
  }

  confirmContractBatchList(file: any, idContractTemplate: any, isCeCA: any) {
    this.getCurrentUser();
    let formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.post<any>(
      this.confirmContractBatchListUrl + idContractTemplate + '/' + isCeCA,
      formData,
      { headers: headers }
    );
  }

  viewFlowContract(id: any): Observable<any> {
    this.getCurrentUser();
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http.get<any>(this.viewFlowUrl + id, { headers }).pipe();
  }

  deleteParticipantContract(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.delete<any>(this.deleteParticipantContractUrl + id, {
      headers,
    });
  }

  sendOtpContractProcess(contract_id: any, recipient_id: any, phone: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      contractId: contract_id,
      phone: phone,
    });
    return this.http.post<any>(
      this.getSendOtpContractProcessUrl + recipient_id + '/gen-otp',
      body,
      { headers }
    );
  }

  getStatusSignImageOtp(recipient_id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(
      this.getStatusSignImageOtpUrl + recipient_id + '/status',
      { headers }
    );
  }

  updateContractIsPushCeCA(id: any, isCeCA: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = '';
    return this.http
      .put<any>(this.updateContractIsPushCeCAUrl + id + '/' + isCeCA, body, {
        headers: headers,
      })
      .pipe();
  }

  objDefaultSampleContract() {
    return {
      file_content: 'base64',
      sign_determine: [
        {
          title: 'Người xem xét',
          id: 'nguoi_xem_xet_1',
          property_name: [
            {
              name: 'Họ tên',
              value: '',
            },
            {
              name: 'Email',
              value: '',
            },
          ],
        },
        {
          title: 'Người ký',
          id: 'nguoi_ky_1',
          property_name: [
            {
              name: 'Họ tên',
              value: '',
            },
            {
              name: 'Email',
              value: '',
            },
            {
              name: 'Loại ký',
              value: '',
            },
            {
              name: 'Số điện thoại',
              value: '',
            },
          ],
        },
      ],

      contract_user_sign: [
        {
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'so_tai_lieu',
          sign_config: [],
        },
        {
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'text',
          sign_config: [],
        },
        {
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'chu_ky_anh',
          sign_config: [],
        },
        {
          recipient_id: Helper._ranDomNumberText(10),
          sign_unit: 'chu_ky_so',
          sign_config: [],
        },
      ],
    };
  }

  getDataFormatContractUserSign() {
    return [
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'so_tai_lieu',
        sign_config: [],
      },
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'text',
        sign_config: [],
      },
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'chu_ky_anh',
        sign_config: [],
      },
      {
        id: Helper._ranDomNumberText(10),
        sign_unit: 'chu_ky_so',
        sign_config: [],
      },
    ];
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

  getDataDetermine() {
    return [
      {
        name: '', // tên bên tham gia
        type: 1, // loại bên tham gia: tổ chức của tôi | đối tác | cá nhân
        ordering: 1, // thứ tự thực hiện ký kết của các bên tham gia
        status: 1, //
        recipients: [
          // Dữ liệu người xem xét
          {
            name: '', // tên người tham gia
            email: '', // email người tham gia
            phone: '', // sđt người tham gia
            card_id: '', // cccd người tham gia
            role: 2, // loại tham gia: xem xét|điều phối| ký | văn thư
            ordering: 1, // thứ tự thực hiện của người tham gia
            status: 0, // Trạng thái chưa xử lý/ đã xử lý
            is_otp: 0, // select otp
            sign_type: [
              // hình thức ký
            ],
          },
          // Dữ liệu người ký
          {
            login_by: 'email',
            name: '', // tên người tham gia
            email: '', // email người tham gia
            phone: '', // sđt người tham gia
            card_id: '', // cccd người tham gia
            role: 3, // loại tham gia: xem xét|điều phối| ký | văn thư
            ordering: 1, // thứ tự thực hiện của người tham gia
            status: 0, // Trạng thái chưa xử lý/ đã xử lý
            is_otp: 0, // select otp
            sign_type: [
              // hình thức ký
            ],
          },
          // dữ liệu văn thư
          {
            login_by: 'email',
            name: '', // tên người tham gia
            email: '', // email người tham gia
            phone: '', // sđt người tham gia
            card_id: '', // cccd người tham gia
            role: 4, // loại tham gia: xem xét|điều phối| ký | văn thư
            ordering: 1, // thứ tự thực hiện của người tham gia
            status: 0, // Trạng thái chưa xử lý/ đã xử lý
            is_otp: 0, // select otp
            sign_type: [
              // hình thức ký
            ],
          },
        ],
      },
      // Đối tác
      // Tổ chức
      {
        name: '',
        type: 2, // Đối tác tổ chức
        ordering: 2,
        status: 1,
        recipients: [
          // người điều phối
          {
            name: '',
            email: '',
            phone: '',
            card_id: '', // cccd người tham gia
            role: 1, // người điều phối
            ordering: 1,
            status: 0,
            is_otp: 0,
            sign_type: [],
          },
          // người xem xét
          {
            name: '',
            email: '',
            phone: '',
            card_id: '', // cccd người tham gia
            role: 2, // người xem xét
            ordering: 1,
            status: 0,
            is_otp: 0,
            sign_type: [],
          },
          // người ký
          {
            login_by: 'email',
            name: '',
            email: '',
            phone: '',
            card_id: '', // cccd người tham gia
            role: 3, // người ký
            ordering: 1,
            status: 0,
            is_otp: 0,
            sign_type: [],
          },
          // văn thư
          {
            login_by: 'email',
            name: '',
            email: '',
            phone: '',
            card_id: '', // cccd người tham gia
            role: 4, // văn thư
            ordering: 1,
            status: 0,
            is_otp: 0,
            sign_type: [],
          },
        ],
      },
    ];
  }

  getDataDetermineInitialization() {
    return [
      {
        name: '',
        type: 1,
        ordering: 1,
        status: 1,
        recipients: [
          {
            login_by: 'email',
            name: '',
            email: '',
            phone: '',
            card_id: '',
            role: 3,
            ordering: 1,
            status: 0,
            is_otp: 0,
            sign_type: [],
          },
        ],
      },
      {
        name: '',
        type: 2,
        ordering: 2,
        status: 1,
        recipients: [
          {
            login_by: 'email',
            name: '',
            email: '',
            phone: '',
            card_id: '',
            role: 3,
            ordering: 1,
            status: 0,
            is_otp: 0,
            sign_type: [],
          },
        ],
      },
    ];
  }
}
