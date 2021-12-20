import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/api'; //Required 
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })
export class NodeService {
constructor(private http: HttpClient) {}
    getFilesystem() {
        return this.http.get('/assets/filesystem.json') 
        .toPromise()
        .then((res:any) => <TreeNode[]> res.json().data);
    }
    public list(): Observable<any> {
        return this.http.get("/assets/filesystem.json");
      }
}