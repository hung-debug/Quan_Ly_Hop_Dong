import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { map, catchError, retry, concatMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { isPdfFile } from 'pdfjs-dist';
import { encode } from 'base64-arraybuffer';
export interface User {
  id: any;
  name: any;
  email: any;
  phone: any;
  birthday: any;
  status: any;
  phone_sign: any;
  phone_tel: any;
  sign_image: any;
  hsm_name: any;
  role_id: any;
  organization_id: any;
  organization: any;
  type: any;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  forgotPasswordUrl: any = `${environment.apiUrl}/api/v1/customers/password/request`;
  resetPasswordUrl: any = `${environment.apiUrl}/api/v1/customers/password/recover`;
  resetPasswordTokenUrl: any = `${environment.apiUrl}/api/v1/customers/changePassword`;
  addUserUrl: any = `${environment.apiUrl}/api/v1/customers`;

  getUnitByIdUrl: any = `${environment.apiUrl}/api/v1/admin/organization/`;

  updateUserUrl: any = `${environment.apiUrl}/api/v1/customers/`;
  getUserByIdUrl: any = `${environment.apiUrl}/api/v1/customers/`;
  getOrgChildren: any = `${environment.apiUrl}/api/v1/organizations/getParent`;
  listUserUrl: any = `${environment.apiUrl}/api/v1/customers/search`;
  getUserByEmailUrl: any = `${environment.apiUrl}/api/v1/customers/get-by-email`;
  checkPhoneUrl: any = `${environment.apiUrl}/api/v1/customers/check-phone-unique`;
  getNameSearch: any = `${environment.apiUrl}/api/v1/customers/search`;

  signupUrl: any = `${environment.apiUrl}/api/v1/admin/registrations/organization`;

  getCheckContractUserUrl: any = `${environment.apiUrl}/api/v1/contracts/check-contract-exist`;

  checkServiceStatusUrl: any = `${environment.apiUrl}/api/v1/customers/check-service-status`;

  checkTokenDateUrl: any = `${environment.apiUrl}/api/v1/customers/password/recover/valid`

  token: any;
  customer_id: any;
  organization_id: any;
  name: any;
  email: any;
  phone: any;

  constructor(private http: HttpClient, public datepipe: DatePipe) {}

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

    this.name = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.name;
    this.email = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.email;
    this.phone = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info.phone;
  }

  getAuthCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  uploadFileUserUrl: any = `${environment.apiUrl}/api/v1/customers/import`;
  uploadFile(file: any) {
    this.getCurrentUser();
    let formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.token)

      return this.http.post(
        this.uploadFileUserUrl,
        formData,
        {
          headers: headers,
          observe: 'response',
          responseType: 'blob'
        }
      ).toPromise();
  }


  getInforUser() {
    this.getCurrentUser();
    return {
      token: this.token,
      customer_id: this.customer_id,
      organization_id: this.organization_id,
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
  }

  sendForgotPassword(email: string) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );
    const body = JSON.stringify({ email: email });
    return this.http
      .post<any>(this.forgotPasswordUrl, body, { headers: headers })
      .pipe();
  }

  checkTokenDate(token: string) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );


    return this.http.get<any>(this.checkTokenDateUrl + "?token=" + token, { headers: headers});
  }

  sendResetPassword(token: string, password: string) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );
    const body = JSON.stringify({ token: token, password: password });
    return this.http
      .post<User>(this.resetPasswordUrl, body, { headers: headers })
      .pipe(
        map((user) => {

          if (JSON.parse(JSON.stringify(user)).status == 0) {
            return user;
          } else {
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

  //ghep api dang ky
  signup(datas: any) {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );
    const body = JSON.stringify({
      code: datas.code,
      name: datas.name,
      size: datas.size,
      address: datas.address,
      tax_code: datas.tax_code,
      representative: datas.representatives,
      position: datas.position,
      email: datas.email,
      phone: datas.phone,
    });

    return this.http.post<any>(this.signupUrl, body, { headers: headers });
  }

  sendResetPasswordToken(passwordOld: string, passwordNew: string) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      password: passwordOld,
      newPassword: passwordNew,
    });
    return this.http
      .post<User>(this.resetPasswordTokenUrl, body, { headers: headers })
      .pipe(
        map((user) => {

          if (JSON.parse(JSON.stringify(user)).status == 0) {
            return user;
          } else {
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

  addUser(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    if (datas.birthday != null) {
      datas.birthday = this.datepipe.transform(datas.birthday, 'yyyy/MM/dd');
    }

    const body = JSON.stringify({
      name: datas.name,
      email: datas.email,
      phone: datas.phone,
      organization_id: datas.organizationId,
      birthday: datas.birthday,
      status: datas.status,
      role_id: datas.role,

      sign_image: datas.sign_image,

      phone_sign: datas.phoneKpi,
      phone_tel: datas.networkKpi ==='bcy' ? 3 : datas.networkKpi,

      hsm_name: datas.nameHsm,
      tax_code: datas.taxCodeHsm,
      hsm_pass: datas.password1Hsm,
    });


    return this.http.post<User>(this.addUserUrl, body, { headers: headers });
  }

  updateUser(datas: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    if (datas.birthday != null) {
      datas.birthday = this.datepipe.transform(datas.birthday, 'yyyy/MM/dd');
    }

    const body = JSON.stringify({
      name: datas.name,
      email: datas.email,
      phone: datas.phone,
      organization_id: datas.organizationId,
      birthday: datas.birthday,
      status: datas.status,
      role_id: datas.role,

      sign_image: datas.sign_image,
      stampImage: datas.stampImage,

      phone_sign: datas.phoneKpi,
      phone_tel: datas.networkKpi ==='bcy' ? 3 : datas.networkKpi,

      hsm_name: datas.nameHsm,
      tax_code: datas.taxCodeHsm,
      hsm_pass: datas.password1Hsm,

      organization_change: datas.organization_change,
    });

    return this.http.put<User>(this.updateUserUrl + datas.id, body, {
      headers: headers,
    });
  }

  getUserById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getUserByIdUrl + id, { headers: headers},);
  }

  getOrgIdChildren(orgId: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getOrgChildren + '?orgId='+ orgId, { headers: headers},);
  }

  async getUserById1(id: any) {
    this.getCurrentUser();
    let response = await fetch(this.getUserByIdUrl + id, {
              headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.token,
        },
    });
  }

  getUnitById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.get<any>(
      this.getUnitByIdUrl + id + '?sort=startDate,desc',
      { headers: headers }
    );
  }

  getUserByEmail(email: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      email: email,
    });

    return this.http.post<User>(this.getUserByEmailUrl, body, {
      headers: headers,
    });
  }

  public getUserList(
    filter_organization_id: any,
    filter_nameOrEmail: any,
    filter_email: any
  ): Observable<any> {
    this.getCurrentUser();

    let listUserUrl = this.listUserUrl + '?nameOrEmail=' + filter_nameOrEmail.trim() + '&phone=&organization_id=' + filter_organization_id + '&email=' + filter_email.trim() + '&size=10000';
    const headers = { Authorization: 'Bearer ' + this.token };
    return this.http.get<User[]>(listUserUrl, { headers }).pipe();
  }

  getSignatureUserById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getUserByIdUrl + id, { headers: headers })
      .pipe(
        map((res) => {
          if (res?.sign_image?.length) {
            return res?.sign_image[0].presigned_url;
          }
        }),
        concatMap((res: any) => {
          if (res) {
            const headers = new HttpHeaders().append(
              'Content-Type',
              'application/arraybuffer'
            );
            return this.http
              .get(res, { responseType: 'arraybuffer', headers })
              .pipe(
                map((res) => {
                  return encode(res);
                })
              );
          } else {
            return of(null);
          }
        })
      );
  }

  getMarkUserById(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.get<any>(this.getUserByIdUrl + id, { headers: headers })
      .pipe(
        map((res) => {
          if (res?.stampImage?.length) {
            return res?.stampImage[0].presigned_url;
          }
        }),
        concatMap((res: any) => {
          if (res) {
            const headers = new HttpHeaders().append(
              'Content-Type',
              'application/arraybuffer'
            );
            return this.http
              .get(res, { responseType: 'arraybuffer', headers })
              .pipe(
                map((res) => {
                  return encode(res);
                })
              );
          } else {
            return of(null);
          }
        })
      );
  }

  checkPhoneUser(phone: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);
    const body = JSON.stringify({
      phone_tel: phone,
    });
    return this.http.post<any>(this.checkPhoneUrl, body, { headers }).pipe();
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

  getCheckContractUser(id: any) {
    this.getCurrentUser();
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.token);

    return this.http.get<any>(this.getCheckContractUserUrl + '?id=' + id, {
      headers: headers,
    });
  }

  checkServiceStatus() {
    this.getCurrentUser();
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Authorization', 'Bearer ' + this.token);

    return this.http.get<any>(this.checkServiceStatusUrl, {headers}).pipe();

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


}
