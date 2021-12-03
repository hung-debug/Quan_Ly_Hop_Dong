import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService,
    public translate: TranslateService,) { }

  showSuccessHTMLWithTimeout(message:any, title:any, timespan:any){
    this.toastr.success(this.translate.instant(message), title,{
      timeOut :  timespan,
      enableHtml :  true
    })
  }

  showErrorHTMLWithTimeout(message:any, title:any, timespan:any){
    this.toastr.error(this.translate.instant(message), title ,{
      timeOut :  timespan,
      enableHtml :  true
    })
  }

  showWarningHTMLWithTimeout(message:any, title:any, timespan:any){
    this.toastr.warning(this.translate.instant(message), title ,{
      timeOut :  timespan,
      enableHtml :  true
    })
  }
}
