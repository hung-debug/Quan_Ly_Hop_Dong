import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CheckZoomService {
  constructor(private toastService: ToastService) {}

  onResize() {
    var ratio = (screen.availWidth / document.documentElement.clientWidth);
    var zoomLevel = Number(ratio.toFixed(1).replace(".", "") + "0");

    console.log("zoom level ", zoomLevel);

    if(zoomLevel != 100) {
      this.toastService.showWarningHTMLWithTimeout('zoom.warning','',3000);
    }
  }
}
