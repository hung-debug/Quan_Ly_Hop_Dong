import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Helper} from "../core/Helper";
@Injectable({
  providedIn: 'root'
})
export class ContractTemplateService {

  constructor(private http: HttpClient) { }

  public getContractTemplateList(): Observable<any> {
    return this.http.get("/assets/data-contract-template.json");
  }
}
