import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-processing-handle-econtract',
  templateUrl: './processing-handle-econtract.component.html',
  styleUrls: ['./processing-handle-econtract.component.scss']
})
export class ProcessingHandleEcontractComponent implements OnInit {
  is_list_name: any = [];
  status: any = [
    {
      value: 0,
      name: 'Tạm dừng'
    },
    {
      value: 1,
      name: 'Hoạt động'
    }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      is_data_contract: any,
      content: any},
    public router: Router,
    public dialog: MatDialog,
    // public name: LoginComponent
  ) {
  }

  ngOnInit(): void {
    this.data.is_data_contract.participants.forEach((item: any) => {
      item.recipients.forEach((element: any) => {
        let data = {
          name: element.name,
          name_company: item.name,
          emailRecipients: element.email,
          status: this.checkStatusUser(element.status, element.role),
          process_at: element.process_at
        }
        this.is_list_name.push(data);
      })
    })
    // console.log(this.is_list_name)
  }

  getStatus(status: any) {
    if (status == 1) {
      return 'Hoạt động';
    } else if (status == 0) {
      return 'Tạm dừng';
    }
  }

  checkStatusUser(status: any, role: any) {
    let res = '';
    if (status == 0) {
      res += 'Chưa ';
    } else if (status == 1) {
      res += 'Đang ';
    } else if (status == 2 || status == 3) {
      res += 'Đã ';
    }
    if (role == 1) {
      res +=  'điều phối';
    } else if (role == 2) {
      res +=  'xem xét';
    } else if (role == 3) {
      res +=  'ký';
    } else if (role == 4) {
      res =  'Văn thư ' + res?.toLowerCase() + 'xử lý';
    }
    return res;
  }

  acceptRequest() {
    this.dialog.closeAll();
    // this.router.navigate(['/login']);
  }

}
