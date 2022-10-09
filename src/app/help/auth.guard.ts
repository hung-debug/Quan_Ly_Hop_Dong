import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {DeviceDetectorService} from "ngx-device-detector";
import { ContractService } from '../service/contract.service';
import { isPdfFile } from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {

  contract_signatures: any = "c";
  kyTuCach: any = "&";

  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    private contractService: ContractService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    // @ts-ignore
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let role;

    //@ts-ignore
     if(state.url.includes("handle")) {

      let code = state.url.substring(8);

      this.contractService.changeLink(code).subscribe((response) => {
        let url = response.original_link;

        // window.location.href = url;
        let urlChange = "";
        let count = 0;
        let index = 0;
        for(let i = 0; i < url.length; i++) {
          if(url.charAt(i) == "/") {
            count++;
          }

          if(count == 3) {
            index = i;
            break;
          }
        }

        if(count = 3) {
          urlChange = url.substring(index);
        }

        this.router.navigateByUrl(urlChange, { skipLocationChange: true });
      })
     }

    
    //console
    //@ts-ignore
    console.log("next ", next._urlSegment.segments.some((p: any) => p.path == 'form-contract'));
    //@ts-ignore
    if (state.url.search('type') > 0 && (next._urlSegment.segments.some((p: any) => p.path == this.contract_signatures) || next._urlSegment.segments.some((p: any) => p.path == 'contract-template') || next._urlSegment.segments.some((p: any) => p.path == 'form-contract'))) {
      console.log("vao day");
      console.log(!sessionStorage.getItem('url'), state.url.includes(this.kyTuCach+"mail"));
      if (!sessionStorage.getItem('url') && state.url.includes(this.kyTuCach+"mail")) {
        console.log(2);
        let isCheckUrl = state.url.split(this.kyTuCach+"mail=");
        
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

        console.log("lt ",lt);
        sessionStorage.setItem('type', lt ? lt : '');
        sessionStorage.setItem('mail', isEmail ? isEmail : '');

        console.log("next.queryParams ", next.queryParams.type);
        console.log("next query params ", next.queryParams);

        if (next.queryParams.type && next.queryParams.type == 1) {
          console.log("vao day");
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
          //@ts-ignore
    } else if(state.url.search('loginType') > 0 && (next._urlSegment.segments.some((p: any) => p.path == 'contract-signature') || next._urlSegment.segments.some((p: any) => p.path == 'contract-template') || next._urlSegment.segments.some((p: any) => p.path == 'form-contract'))) {
      console.log("vao day");
      console.log(!sessionStorage.getItem('url'), state.url.includes(this.kyTuCach+"recipientEmail"));
      if (!sessionStorage.getItem('url') && state.url.includes(this.kyTuCach+"recipientEmail")) {
        console.log(2);
        let isCheckUrl = state.url.split(this.kyTuCach+"recipientEmail");
        
        // sessionStorage.setItem('url', state.url);
        sessionStorage.setItem('url', isCheckUrl[0]);
        console.log(3);
        // sessionStorage.setItem('recipientEmail', isCheckUrl[isCheckUrl.length - 1]);

        sessionStorage.setItem('recipientEmail', isCheckUrl[isCheckUrl.length - 1]);

        console.log(4);
        
        let is_local = sessionStorage.getItem('url');
        if (is_local?.includes('loginType')) {
          let dataLoginType = is_local.split("loginType")[is_local.split("loginType").length - 1];
          if (sessionStorage.getItem('loginType')) {
            sessionStorage.removeItem('loginType')
          }
          if (dataLoginType == "=1") {
            sessionStorage.setItem('loginType', JSON.stringify({loginType: true}));
          }
        }
        const urlC = sessionStorage.getItem('url');
        const lt = sessionStorage.getItem('loginType');
        const isEmail = sessionStorage.getItem('recipientEmail');
        console.log(1);
        sessionStorage.clear();
        sessionStorage.setItem('url', urlC ? urlC : '');

        console.log("lt ",lt);
        sessionStorage.setItem('loginType', lt ? lt : '');
        sessionStorage.setItem('recipientEmail', isEmail ? isEmail : '');

        console.log("next.queryParams ", next.queryParams.loginType);
        console.log("next query params ", next.queryParams);

        if (next.queryParams.loginType && next.queryParams.loginType == 1) {
          console.log("vao day");
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
