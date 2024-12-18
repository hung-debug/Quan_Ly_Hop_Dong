import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { result } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SysService {

  constructor(private router: Router,) { }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  checkSizeFile(file:any){
    if (file?.size <= 25 * (Math.pow(1024, 2))) {
      return {
        result: true,
        message: ''
      }
    } else {
      return {
        result: false,
        message: 'File tài liệu yêu cầu tối đa 25MB'
      }
    }
  }
  
  checkFirstHandler(data: any) {
    // Tìm ordering nhỏ nhất trong tất cả participants
    const minOrdering = Math.min(...data.map((item: any) => item.ordering));
  
    // Lọc các participants có ordering bằng với minOrdering
    const minOrderingParticipants = data.filter((item: any) => item.ordering === minOrdering);
  
    // Lấy recipient có ordering nhỏ nhất trong các participants đã lọc
    const firstRecipients = minOrderingParticipants.flatMap((item: any) => {
      // Tìm ordering nhỏ nhất trong các recipients của mỗi participant
      const minOrderingRecipient = Math.min(...item.recipients.map((r: any) => r.ordering));
      
      // Lọc các recipient có ordering nhỏ nhất
      return item.recipients.filter((r: any) => r.ordering === minOrderingRecipient);
    });
  
    // Hàm lấy tất cả recipients theo role và có ordering nhỏ nhất
    const getRoleRecipients = (role: any) => {
      // Lấy tất cả recipients với role phù hợp
      const roleRecipients = firstRecipients.filter((r: any) => r.role === role);
  
      // Nếu không có recipients cho role này thì trả về mảng rỗng
      if (roleRecipients.length === 0) return [];
  
      // Tìm ordering nhỏ nhất trong các recipients
      const minOrdering = Math.min(...roleRecipients.map((r: any) => r.ordering));
  
      // Lọc các recipients có ordering nhỏ nhất
      return roleRecipients.filter((r: any) => r.ordering === minOrdering);
    };
  
    // Hàm kiểm tra điều kiện role
    const checkRole = (roleRecipients: any) => {
      // Nếu chỉ có 1 recipient với ordering nhỏ nhất, trả về true
      if (roleRecipients.length === 1) return true;
  
      // Nếu có nhiều hơn 1 recipient, kiểm tra nếu tất cả đều có ordering nhỏ nhất
      return roleRecipients.length === 1;
    };
  
    // Kiểm tra role 2
    const allRole2 = getRoleRecipients(2);
    if (allRole2.length > 0) return checkRole(allRole2);
  
    // Kiểm tra role 3
    const allRole3 = getRoleRecipients(3);
    if (allRole3.length > 0) return checkRole(allRole3);
  
    // Kiểm tra role 4
    const allRole4 = getRoleRecipients(4);
    if (allRole4.length > 0) return checkRole(allRole4);
  
    return false;
  }
  
}
