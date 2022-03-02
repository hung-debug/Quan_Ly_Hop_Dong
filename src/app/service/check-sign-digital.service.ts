import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckSignDigitalService {

  listUrl: any = `https://econtract.mobifone.vn/CheckSignature/signatureInfo/getSignatureInfo`;

  constructor(private http: HttpClient) { }

  getList(file:any) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
    let formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.listUrl, formData, {'headers': headers}).pipe();
  }
}
