import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CheckZoomService {

  constructor(
    private toastService: ToastService,
  ) { }

  
  onResize() {
    if (window.navigator.userAgent.indexOf('Windows') != -1) {
      if(window.outerWidth  / window.innerWidth > 1.15 || window.outerWidth  / window.innerWidth < 0.95) {
        this.toastService.showErrorHTMLWithTimeout('Cảnh báo lệch toạ độ khi kéo ô ký/text/số hợp đồng khi phóng to, thu nhỏ','',3000);
      } else if(window.devicePixelRatio > 1.15 || window.devicePixelRatio < 0.95) {
          this.toastService.showErrorHTMLWithTimeout('Cảnh báo lệch toạ độ khi kéo ô ký/text/số hợp đồng khi phóng to, thu nhỏ','',3000);
      }
    }

    if (window.navigator.userAgent.indexOf('Mac') != -1) {
      if(window.outerWidth  / window.innerWidth > 1.15 || window.outerWidth  / window.innerWidth < 0.95) {
        this.toastService.showErrorHTMLWithTimeout('Cảnh báo lệch toạ độ khi kéo ô ký/text/số hợp đồng khi phóng to, thu nhỏ','',3000);
      } else if(window.devicePixelRatio != 2) {
          this.toastService.showErrorHTMLWithTimeout('Cảnh báo lệch toạ độ khi kéo ô ký/text/số hợp đồng khi phóng to, thu nhỏ','',3000);
      }
    }

  }
}
