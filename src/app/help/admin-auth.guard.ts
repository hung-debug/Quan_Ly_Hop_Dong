import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Location} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {DeviceDetectorService} from "ngx-device-detector";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    // @ts-ignore
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let role;
    // console.log(next);
     //console.log(state.url);
    //console
    //@ts-ignore
  
    if (state.url.search('loginType') > 0 && (next._urlSegment.segments.some((p: any) => p.path == 'contract-signature') || next._urlSegment.segments.some((p: any) => p.path == 'contract-template') || next._urlSegment.segments.some((p: any) => p.path == 'form-contract'))) {
      //console.log(state.url);
      console.log(!sessionStorage.getItem('url'), state.url.includes("recipientEmail"));
      if (!sessionStorage.getItem('url') && state.url.includes("recipientEmail")) {
        console.log(2);
        let isCheckUrl = state.url.split("&recipientEmail=");
        
        // sessionStorage.setItem('url', state.url);
        sessionStorage.setItem('url', isCheckUrl[0]);
        console.log(3);
        sessionStorage.setItem('recipientEmail', isCheckUrl[isCheckUrl.length - 1]);
        console.log(4);
        
        let is_local = sessionStorage.getItem('url');
        if (is_local?.includes('loginType')) {
          let dataLoginType = is_local.split("loginType")[is_local.split("loginType").length - 1];
          if (sessionStorage.getItem('urlLoginType')) {
            sessionStorage.removeItem('urlLoginType')
          }
          if (dataLoginType == "=1") {
            sessionStorage.setItem('urlLoginType', JSON.stringify({loginType: true}));
          }
        }
        const urlC = sessionStorage.getItem('url');
        const lt = sessionStorage.getItem('urlLoginType');
        const isEmail = sessionStorage.getItem('recipientEmail');
        console.log(1);
        sessionStorage.clear();
        sessionStorage.setItem('url', urlC ? urlC : '');
        sessionStorage.setItem('urlLoginType', lt ? lt : '');
        sessionStorage.setItem('recipientEmail', isEmail ? isEmail : '');
        if (next.queryParams.loginType && next.queryParams.loginType == 1) {
          this.router.navigate(['/login'],
            {
              queryParams: {'loginType': 1}
            });
        } else {
          this.router.navigate(['/login'],
            {
              queryParams: {'loginType': 0}
            });
        }
        return false;
      } else return true;
    } else {
      if (localStorage.getItem('currentAdmin') != null) {
        //console.log(localStorage.getItem('currentUser'));
        return true;
      } else {
        console.log("No Log in")
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

}
