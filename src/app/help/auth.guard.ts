import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import {Location} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {DeviceDetectorService} from "ngx-device-detector";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    // @ts-ignore
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let role;
    console.log(next);
    console.log(state);
    //@ts-ignore
    if (state.url.search('loginType') > 0 && next._urlSegment.segments.some((p: any) => p.path == 'contract-signature')) {
      if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
        const urlQ = state.url;
        const urlQ1 =  urlQ.split('contract-signature/')[1];
        const urlQ2 =  urlQ1.split('/');
        const urlRole = urlQ2[0];
        const matchesNum = urlQ.match(/\d+/g);
        if (urlRole.includes('coordinates')) {
          role = 1;
        } else if (urlRole.includes('consider')) {
          role = 2;
        } else if (urlRole.includes('signatures')) {
          role = 3;
        } else if (urlRole.includes('secretary')) {
          role = 4;
        }
        if (matchesNum && matchesNum.length == 3) {
          window.location.href = `econtract://app/login/${matchesNum[0]}/${matchesNum[1]}/${role}/${matchesNum[2]}`;
          console.log(`econtract://app/login/${matchesNum[0]}/${matchesNum[1]}/${role}/${matchesNum[2]}`)
        }
      } else if (!sessionStorage.getItem('url')) {

        sessionStorage.setItem('url', state.url);
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
        sessionStorage.clear();
        sessionStorage.setItem('url', urlC ? urlC : '');
        sessionStorage.setItem('urlLoginType', lt ? lt : '');
        if (next.queryParams.loginType && next.queryParams.loginType == 1) {
          this.router.navigate(['/login'],
            {
              queryParams: { 'loginType': 1 }
            });
        } else {
          this.router.navigate(['/login'],
            {
              queryParams: { 'loginType': 0 }
            });
        }
        return false;
      } else return true;
    } else {
      if (localStorage.getItem('currentUser') != null) {
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
