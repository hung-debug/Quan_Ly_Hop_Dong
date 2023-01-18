import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ContractService } from 'src/app/service/contract.service';
import { DialogReasonRejectedComponent } from '../dialog-reason-rejected/dialog-reason-rejected.component';
import { EditHandlerComponent } from '../edit-handler-dialog/edit-handler-dialog.component';
import { ToastService } from 'src/app/service/toast.service';
@Component({
  selector: 'app-processing-handle-econtract',
  templateUrl: './processing-handle-econtract.component.html',
  styleUrls: ['./processing-handle-econtract.component.scss']
})
export class ProcessingHandleEcontractComponent implements OnInit {
  datas: any;
  is_list_name: any = [];
  personCreate: string;
  emailCreate: string;
  timeCreate: any;
  isHiddenButton = false;
  currentUser: any;
  // recipient:any;
  listCheckSmsEmail: any;
  contractStatus: string;
  endDate: any;
  reasonCancel: string;
  cancelDate: any;
  isEndDate: boolean;
  staus: number;

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
      content: any
    },
    private toastService: ToastService,
    public router: Router,
    public dialog: MatDialog,
    private contractService: ContractService,
    public translate: TranslateService,
  ) {

  }

  lang: string;
  ngOnInit(): void {

    console.log("aaa ", sessionStorage.getItem('lang'));

    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }
    this.contractService.getDetailContract(this.data.is_data_contract.id).subscribe(response => {
      this.endDate = moment(response[0].sign_time, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss")
      let timeNow = moment(new Date(), "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss")

      // console.log("SUABc 1", moment(timeNow, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss"))
      // console.log("SUABc 2", moment(this.endDate, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss"))
      // console.log("SUABc 3", moment(this.endDate, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss") >= moment(timeNow, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss"))

      this.isEndDate = this.endDate >= timeNow ? true : false
    })

    this.contractService.viewFlowContract(this.data.is_data_contract.id).subscribe(response => {
      this.personCreate = response.createdBy.name;

      this.timeCreate = response.createdAt ? moment(response.createdAt).add(420) : null;
      this.timeCreate = response.createdAt ? moment(this.timeCreate, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss") : null;
      this.emailCreate = response.createdBy.email;
      this.reasonCancel = response.reasonCancel;
      this.contractStatus = response.contractStatus;
      this.cancelDate = response.cancelDate ? moment(response.cancelDate, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss") : null;

      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
      if (this.currentUser.email == this.emailCreate) {
        this.isHiddenButton = true;
      } else {
        this.isHiddenButton = false;
      }
      console.log("this.currentUser.email", this.currentUser.email);
      console.log("emailCreate", this.emailCreate);
      console.log("this.contractStatus", this.contractStatus);
      console.log("this.cancelDate", this.cancelDate);



      console.log("ishidden", this.isHiddenButton);

      response.recipients.forEach((element: any) => {
        let data = {
          id: element.id,
          name: element.name,
          name_company: element.participantName,
          emailRecipients: element.email,
          status: this.checkStatusUser(element.status, element.role),
          typeOfSign: element.signType[0],
          process_at: element.process_at ? moment(element.process_at, "YYYY/MM/DD HH:mm:ss").format("YYYY/MM/DD HH:mm:ss") : null,
          reasonReject: element.reasonReject,
          type: element.participantType,
          statusNumber: element.status
        }
        this.is_list_name.push(data);
      })
      console.log("dataaaaaa", this.is_list_name);





      this.listCheckSmsEmail = true
      // this.is_list_name.map((item: any) => {
      //   if (item.statusNumber === 3 || item.statusNumber === 34) {
      //     console.log(" item.statusNumber", item.statusNumber);

      //     this.listCheckSmsEmail = false
      //   }
      // });


      if (response.contractStatus === 31 || response.contractStatus === 34 || response.contractStatus === 0) {
        this.listCheckSmsEmail = false
      }

    });

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

    console.log("lang ", this.lang);

    if (this.lang == 'vi' || !this.lang) {
      if (status == 3) {
        return 'Đã từ chối';
      } else if (status == 4) {
        return 'Đã uỷ quyền/chuyển tiếp';
      } else if (status == 34) {
        return 'Quá hạn';
      }

      if (status == 0 && !this.reasonCancel) {
        res += 'Chưa ';
      } else if (status == 1 && !this.reasonCancel) {
        res += 'Đang ';
      } else if (status == 2) {
        res += 'Đã ';
      }

      if (!this.reasonCancel) {
        if (role == 1) {
          res += 'điều phối';
        } else if (role == 2) {
          res += 'xem xét';
        } else if (role == 3) {
          res += 'ký';
        } else if (role == 4) {
          res = res + ' đóng dấu';
        }
      } else {
        if (!res.includes('Đã'))
          res = 'Đã huỷ'
      }
    } else if (this.lang == 'en') {
      if (status == 3) {
        return 'Rejected';
      } else if (status == 4) {
        return 'Authorized/Forwarded';
      } else if (status == 34) {
        return 'Overdue';
      }

      if (status == 0 && !this.reasonCancel) {
        res += 'Not ';
      } else if (status == 1 && !this.reasonCancel) {
        res += 'Doing ';
      } else if (status == 2) {
        res += 'Already ';
      }

      if (!this.reasonCancel) {
        if (role == 1) {
          res += 'coordinator';
        } else if (role == 2) {
          res += 'consider';
        } else if (role == 3) {
          res += 'sign';
        } else if (role == 4) {
          res = res + ' mark';
        }
      } else {
        if (!res.includes('Already'))
          res = ''
      }
    }


    return res;
  }

  acceptRequest() {
    this.dialog.closeAll();
  }

  // @ts-ignore
  viewReasonRejected(RecipientsId: any) {
    let data: any;

    for (let i = 0; i < this.is_list_name.length; i++) {

      if (RecipientsId === this.is_list_name[i].id) {
        data = { reasonReject: this.is_list_name[i].reasonReject }
      }
    }

    const dialogRef = this.dialog.open(DialogReasonRejectedComponent, {
      width: '600px',
      data
    })
    console.log("ly do tu choi hd", data);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
    })
  }

  resendSmsEmail(recipient: any) {
    let responseSmsEmail: any;
    this.contractService.resendSmsEmail(recipient).subscribe((responseSmsEmail) => {
      console.log("data success", responseSmsEmail);

      if (responseSmsEmail.success == true) {
        this.toastService.showSuccessHTMLWithTimeout((this.translate.instant('send.sms.email')), "", 3000);
      } else {
        //alert(responseSmsEmail.message)
        this.toastService.showErrorHTMLWithTimeout(responseSmsEmail.message, "", 3000);
      }
    })

  }

  openEdit(recipient: any) {
    this.contractService.getInforPersonProcess(recipient).subscribe((response) => {
      let data: any;
      data = response
      // console.log("response",response);

      const dialogRef = this.dialog.open(EditHandlerComponent, {
        width: '1000px',
        data,
      })
      // console.log("data luongxly hodng",data);

      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('the close dialog', result);

        this.is_list_name = this.is_list_name.map((x: any) => {
          if (x.id === result.id) {
            console.log('the close dialog 1.1', x);
            return {
              ...x, name: result.name,
              emailRecipients: result.email,
            }
          }
          return x
        })
        console.log('the close   1', this.is_list_name);
      })
    })

  }

  getDataHandler(id: number, action: string) {
    setTimeout(() => {
      // void this.router.navigate(['main/contract-template/form/edit/' + id]);
    }, 100)
  }

}