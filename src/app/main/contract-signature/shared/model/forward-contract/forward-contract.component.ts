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
    private toastService : ToastService,
    private el: ElementRef,
    private spinner: NgxSpinnerService,
  ) { }



  ngOnInit(): void {
    this.datas = this.data;
    this.getCurrentUser();
    this.myForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      email: this.fbd.control("", [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.checkCanSwitchContract()) {
      this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập email ngoài luồng hợp đồng', '', 1000);
      return;
    }
    if (this.currentUser) {
      const dataAuthorize = {
        email: this.myForm.value.email,
        full_name: this.myForm.value.name,
        role: this.data.role_coordination ? this.data.role_coordination : this.datas.dataContract.roleContractReceived,
        recipient_id: this.datas.recipientId,
        is_replace: false/*this.datas.is_content != 'forward_contract'*/
      }
      this.spinner.show();
      this.contractService.processAuthorizeContract(dataAuthorize).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout((this.datas.is_content == 'forward_contract' ? 'Chuyển tiếp' : 'Ủy quyền') + ' thành công!'
            , "", 1000);
          this.dialogRef.close();
          if (this.datas.action_title == 'dieu_phoi') {
            this.router.navigate(['/main/contract-signature/receive/processed'])
            // main/contract-signature/receive/processed
          } else {
            this.router.navigate(['/main/contract-signature/receive/wait-processing']);
          }
        }, error => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
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
