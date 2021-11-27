import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  showSuccessHTMLWithTimeout(message:any, title:any, timespan:any){
    this.toastr.success(message, title ,{
      timeOut :  timespan,
      enableHtml :  true
    })
  }
}
