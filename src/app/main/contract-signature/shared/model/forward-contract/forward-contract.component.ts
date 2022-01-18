import {Component, Inject, OnInit, ElementRef, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ContractService} from "../../../../../service/contract.service";
import {ToastService} from "../../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-forward-contract',
  templateUrl: './forward-contract.component.html',
  styleUrls: ['./forward-contract.component.scss']
})
export class ForwardContractComponent implements OnInit {
  myForm: FormGroup;
  datas: any;
  currentUser: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private contractService: ContractService,
    public dialogRef: MatDialogRef<ForwardContractComponent>,
    private toastService: ToastService,
    private el: ElementRef,
    private spinner: NgxSpinnerService,
  ) {
  }


  ngOnInit(): void {
    this.datas = this.data;
    this.getCurrentUser();
    this.myForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      email: this.fbd.control("", [Validators.required]),
    });
  }

  onSubmit() {
    if (!String(this.myForm.value.name)) {
      // this.datas.is_content == 'forward_contract' ? 'Chuyển tiếp' : 'Ủy quyền'
      this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập tên người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
      return;
    }
    if (!String(this.myForm.value.email)) {
      this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập email người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
      return;
    } else if (!String(this.myForm.value.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
      this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập đúng định dạng email', '', 3000);
      return;
    }
    if (!this.checkCanSwitchContract()) {
      this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập email ngoài luồng hợp đồng', '', 3000);
      return;
    }
    if (this.currentUser) {
      const dataAuthorize = {
        email: this.myForm.value.email,
        full_name: this.myForm.value.name,
        role: this.data.role_coordination ? this.data.role_coordination : this.datas.dataContract.roleContractReceived,
        recipient_id: this.datas.recipientId,
        is_replace: true/*this.datas.is_content != 'forward_contract'*/
      };
      this.spinner.show();
      this.contractService.processAuthorizeContract(dataAuthorize).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout((this.datas.is_content == 'forward_contract' ? 'Chuyển tiếp' : 'Ủy quyền') + ' thành công!'
            , "", 3000);
          this.dialogRef.close();
          // if (this.data.role_coordination == 1) {
          this.router.navigate(['/main/contract-signature/receive/processed'])
          // } else {
          //   this.router.navigate(['/main/contract-signature/receive/wait-processing']);
          // }
        }, error => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }, () => {
          this.spinner.hide();
        }
      )
    }
  }

  getCurrentUser(): any {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
  }

  checkCanSwitchContract() {
    if (this.datas?.dataContract?.is_data_contract?.participants?.length) {
      for (const participant of this.datas.dataContract.is_data_contract.participants) {
        for (const recipient of participant.recipients) {
          if (this.myForm.value.email == recipient.email) {
            return false;
          }
        }
      }
    }
    return true;
  }

  t() {
    console.log(this);
  }

}
