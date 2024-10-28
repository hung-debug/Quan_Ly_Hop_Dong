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
     if(state.url.includes("handle/")) {
      console.log("state.url.includes",state.url.includes("handle/"));
      
      sessionStorage.clear();

      let code = state.url.substring(8);

      this.contractService.changeLink(code).subscribe((response) => {
        let url = response.original_link;
        console.log("res",response);
        
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

        if(response.sign_type?.length > 0)
          localStorage.setItem('sign_type',response.sign_type[0].id)
        this.router.navigateByUrl(urlChange, { skipLocationChange: true });
      })
     }
    

    //console
    console.log("state",state);
    console.log("next",next);
    //@ts-ignore
    
    //@ts-ignore
    if (state.url.search('type') > 0 && (next._urlSegment.segments.some((p: any) => p.path == this.contract_signatures) || next._urlSegment.segments.some((p: any) => p.path == 'contract-template') || next._urlSegment.segments.some((p: any) => p.path == 'form-contract'))) {
      console.log("this.kyTuCach",this.kyTuCach);
      
      if (!sessionStorage.getItem('url') && state.url.includes(this.kyTuCach+"mail")) {
        let isCheckUrl = state.url.split(this.kyTuCach+"mail=");
    
        sessionStorage.setItem('url', isCheckUrl[0]);

        sessionStorage.setItem('mail', isCheckUrl[isCheckUrl.length - 1]);
        
        let is_local = sessionStorage.getItem('url');
        if (is_local?.includes('type')) {
          let dataLoginType = is_local.split("type")[is_local.split("type").length - 1];
          console.log("dataLoginType1",dataLoginType);
          
          if (sessionStorage.getItem('type')) {
            sessionStorage.removeItem('type')
          }
          if (dataLoginType == "=1") {
            console.log("dataLoginType2",dataLoginType);
            sessionStorage.setItem('type', JSON.stringify({loginType: true}));
          }
        }
        const urlC = sessionStorage.getItem('url');
        const lt = sessionStorage.getItem('type');
        const isEmail = sessionStorage.getItem('mail');
        
        sessionStorage.clear();
        sessionStorage.setItem('url', urlC ? urlC : '');

        
        sessionStorage.setItem('type', lt ? lt : '');
        sessionStorage.setItem('mail', isEmail ? isEmail : '');
  



          if (next.queryParams.type && next.queryParams.type == 1) {
          console.log("next.queryParams.type",next.queryParams.type);
          
            this.router.navigate(['/login'],
            {
              queryParams: {'loginType': 1}
            }).then(() =>" window.location.reload()")
          } else {
            console.log("2");
            
            this.router.navigate(['/login'],
              {
                queryParams: {'loginType': 0}
              });
          }
          return false;
      } else return true;
    } else {
      console.log("localStorage.getItem('currentUser')",localStorage.getItem('currentUser'));
      
      if (localStorage.getItem('currentUser') != null) {
        //
        return true;
      } else {
        
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

}