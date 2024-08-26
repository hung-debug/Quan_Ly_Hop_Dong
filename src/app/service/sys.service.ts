import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { result } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SysService {

  constructor(private router: Router,) { }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  checkSizeFile(file:any){
    if (file?.size <= 25 * (Math.pow(1024, 2))) {
      return {
        result: true,
        message: ''
      }
    } else {
      return {
        result: false,
        message: 'File hợp đồng yêu cầu tối đa 25MB'
      }
    }
  }
}
