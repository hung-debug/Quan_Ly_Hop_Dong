import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

export interface File {
  id:number,
  success:string,
  file_object:{
    filename:string,
    bucket:string,
    file_path:string,
  }
}
@Injectable({
  providedIn: 'root'
})
export class UploadService {


  token:any;
  organization_id:any;

  uploadFileUrl:any = `${environment.apiUrl}/api/v1/upload/organizations/`;



  constructor(private http: HttpClient) { }

  getCurrentUser(){
    this.token = JSON.parse(localStorage.getItem('currentUser') || '').access_token;
    this.organization_id = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.organizationId;
  }

  uploadFile(file: any) {
    this.getCurrentUser();
    let formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders()
      //.append('Content-Type', 'multipart/form-data')
      .append('Authorization', 'Bearer ' + this.token);
    return this.http.post<File>(this.uploadFileUrl + this.organization_id + `/single`, formData, {'headers':headers});
  }

  downloadFile(path:any): any {
		return this.http.get(path, {responseType: 'blob'});
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
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
