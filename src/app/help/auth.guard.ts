import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {DeviceDetectorService} from "ngx-device-detector";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
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
     console.log("type ",state.url.search('loginType'));
    //console
    //@ts-ignore
  
    if (state.url.search('type') > 0 && (next._urlSegment.segments.some((p: any) => p.path == 'contract-signature') || next._urlSegment.segments.some((p: any) => p.path == 'contract-template') || next._urlSegment.segments.some((p: any) => p.path == 'form-contract'))) {
      //console.log(state.url);
      console.log(!sessionStorage.getItem('url'), state.url.includes("mail"));
      if (!sessionStorage.getItem('url') && state.url.includes("mail")) {
        console.log(2);
        let isCheckUrl = state.url.split("&mail=");
        
        // sessionStorage.setItem('url', state.url);
        sessionStorage.setItem('url', isCheckUrl[0]);
        console.log(3);
        // sessionStorage.setItem('recipientEmail', isCheckUrl[isCheckUrl.length - 1]);

        sessionStorage.setItem('mail', isCheckUrl[isCheckUrl.length - 1]);

        console.log(4);
        
        let is_local = sessionStorage.getItem('url');
        if (is_local?.includes('type')) {
          let dataLoginType = is_local.split("type")[is_local.split("type").length - 1];
          if (sessionStorage.getItem('type')) {
            sessionStorage.removeItem('type')
          }
          if (dataLoginType == "=1") {
            sessionStorage.setItem('type', JSON.stringify({loginType: true}));
          }
        }
        const urlC = sessionStorage.getItem('url');
        const lt = sessionStorage.getItem('type');
        const isEmail = sessionStorage.getItem('mail');
        console.log(1);
        sessionStorage.clear();
        sessionStorage.setItem('url', urlC ? urlC : '');
        sessionStorage.setItem('type', lt ? lt : '');
        sessionStorage.setItem('mail', isEmail ? isEmail : '');
        if (next.queryParams.type && next.queryParams.type == 1) {
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
