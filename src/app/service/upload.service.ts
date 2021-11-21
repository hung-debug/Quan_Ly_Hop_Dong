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

  token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
  organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.organization_id;

  uploadFileUrl:any = `${environment.apiUrl}/api/v1/upload/organizations/`+ this.organization_id + `/single`;



  constructor(private http: HttpClient) { }

  uploadFile(datas: any) {

    let formData = new FormData();
    formData.append('file', datas.contractFile);

    const headers = new HttpHeaders()
      .append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);

    console.log(this.uploadFileUrl);
    console.log(headers);
    console.log(formData);
    return this.http.post<File>(this.uploadFileUrl, formData, {'headers':headers});
  }

  // postFile(datas: any){
  //   let fileToUpload:File = datas.contractFile;
  //   const headers = new HttpHeaders()
  //     .append('Content-Type', 'multipart/form-data')
  //     .append('Authorization', 'Bearer ' + this.token);
  //   const formData: FormData = new FormData();
  //   formData.append('file', fileToUpload, fileToUpload.name);
  //   console.log(this.uploadFileUrl);
  //   console.log(fileToUpload);
  //   console.log(headers);
  //   console.log(formData);
  //   return this.http
  //     .post(this.uploadFileUrl, formData, { headers: headers });
  // }

  // uploadFile2(url: string, file: File): Observable<HttpEvent<any>> {

  //   let formData = new FormData();
  //   formData.append('file', file);

  //   const headers = new HttpHeaders()
  //     .append('Content-Type', 'multipart/form-data')
  //     .append('Authorization', 'Bearer ' + this.token);

  //   const req = new HttpRequest('POST', url, formData, { headers: headers });
  //   return this.http.request(req);
  // }



  // getFiles(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/files`);
  // }

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
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
