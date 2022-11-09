import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import * as moment from 'moment';
import { ContractService } from 'src/app/service/contract.service';

@Component({
  selector: 'app-processing-handle-econtract',
  templateUrl: './processing-handle-econtract.component.html',
  styleUrls: ['./processing-handle-econtract.component.scss']
})
export class ProcessingHandleEcontractComponent implements OnInit {
  is_list_name: any = [];
  personCreate: string;
  emailCreate: string;
  timeCreate: any;

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
    private contractService : ContractService
    // public name: LoginComponent
  ) {
  }

  ngOnInit(): void {
    // this.personCreate = "Phạm Tấn Dũng";
    // this.emailCreate = "dung111999@gmail.com";
    // this.timeCreate="19/10/2022";
    this.contractService.viewFlowContract(this.data.is_data_contract.id).subscribe(response => {
      this.personCreate = response.createdBy.name;
      // this.timeCreate = response.createdAt ? moment(response.createdAt, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss") : null;

      this.timeCreate = response.createdAt ? moment(response.createdAt).add(420):null;
      this.timeCreate = response.createdAt ? moment(this.timeCreate, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss") : null;
      this.emailCreate = response.createdBy.email;

      response.recipients.forEach((element: any) => {
        let data = {
          name: element.name,
          name_company: element.participantName,
          emailRecipients: element.email,
          status: this.checkStatusUser(element.status, element.role),
          typeOfSign: element.signType[0],
          process_at:  element.process_at ? moment(element.process_at, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss") : null
        }
        this.is_list_name.push(data);
      })
    });
     console.log("sssssssssssssssss",this.is_list_name)
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
    if (status == 3) {
      return 'Đã từ chối';
    }
    if (status == 0) {
      res += 'Chưa ';
    } else if (status == 1) {
      res += 'Đang ';
    } else if (status == 2) {
      res += 'Đã ';
    }
    if (role == 1) {
      res +=  'điều phối';
    } else if (role == 2) {
      res +=  'xem xét';
    } else if (role == 3) {
      res +=  'ký';
    } else if (role == 4) {
      res =  res + ' đóng dấu';
    }
    return res;
  }

  acceptRequest() {
    this.dialog.closeAll();
    // this.router.navigate(['/login']);
  }

}
