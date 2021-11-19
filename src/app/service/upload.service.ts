import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

export interface File {
  success:string,
}
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  uploadFileUrl:any = `${environment.apiUrl}/api/v1/auth/login`;

  // token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
  // organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.organization_id;

  // uploadFileUrl:any = `${environment.apiUrl}/api/v1/upload/organizations/`+ this.organization_id + `/single`;
  //
  //
  //
  constructor(private http: HttpClient) { }

  // uploadFile(datas: any) {
  //
  //   let formData = new FormData();
  //   formData.append('file', datas.contractFile);
  //
  //   const headers = new HttpHeaders()
  //     .append('Content-Type', 'multipart/form-data')
  //     .append('Authorization', 'Bearer ' + this.token);
  //
  //   console.log(this.uploadFileUrl);
  //   console.log(headers);
  //   console.log(formData);
  //   return this.http.post<File>(this.uploadFileUrl, formData, {'headers':headers});
  // }

  uploadFile(file: File): Observable<HttpEvent<any>> {

    let formData = new FormData();
    // @ts-ignore
    formData.append('upload', file);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', this.uploadFileUrl, formData, options);
    return this.http.request(req);
  }





  // getFiles(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/files`);
  // }

  // Error handling
 //  handleError(error:any) {
 //    let errorMessage = '';
 //    if(error.error instanceof ErrorEvent) {
 //      // Get client-side error
 //      errorMessage = error.error.message;
 //    } else {
 //      // Get server-side error
 //      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
 //    }
 //    window.alert(errorMessage);
 //    return throwError(errorMessage);
 // }
}
