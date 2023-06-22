import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DowloadPluginService {

  constructor() { }

  getLinkDownLoadV2() {
     Swal.fire({
        html:
          'Vui lòng bật tool ký số hoặc tải ' +
          `<a href='/assets/upload/MBFCASignPlugin.rar' target='_blank'>Tại đây</a>  và cài đặt`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
     });
  }
}
