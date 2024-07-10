import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from 'src/app/service/user.service';
import { parttern_input, parttern } from 'src/app/config/parttern';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-remote-dialog-sign',
  templateUrl: './remote-dialog-sign.component.html',
  styleUrls: ['./remote-dialog-sign.component.scss']
})
export class RemoteDialogSignComponent implements OnInit {
  myForm: FormGroup;
  datas: any;
  user: any;
  id: any;
  type: any = 0;
  submitted = false;
  currentUser: any;
  taxCode: any;
  mobile: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private userService: UserService,
    private contractService: ContractService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<RemoteDialogSignComponent>,
    private spinner: NgxSpinnerService,
    private deviceService: DeviceDetectorService,

  ) {
    this.myForm = this.fbd.group({
      supplier: this.fbd.control('1', [Validators.required]),
      taxCode: this.fbd.control("", [Validators.required,
      Validators.pattern(parttern.cardid)
        // Validators.pattern(parttern_input.taxCode_form) ||
        // Validators.pattern(parttern.card_id9) ||
        // Validators.pattern(parttern.card_id12)
      ]),
    });
  }



  ngOnInit(): void {
    this.datas = this.data;



    this.user = this.userService.getInforUser();

    this.id = this.user.customer_id;
    if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
      this.type = 1;
    } else
      this.type = 0;


    this.myForm = this.fbd.group({
      supplier: this.fbd.control('1', [Validators.required]),
      taxCode: this.fbd.control(this.datas?.dataContract?.card_id ? this.datas?.dataContract?.card_id : this.data.userCode, [
        Validators.required,
        Validators.pattern(parttern.cardid)
      ]),
    });
      if (this.user.organization_id != 0) {
      // this.userService.getUserById(this.id).subscribe((response) => {
      //   this.myForm = this.fbd.group({
      //     taxCode: this.fbd.control(response.tax_code, [
      //       Validators.required,
      //       Validators.pattern(parttern.cardid)
      //     ]),
      //   });
      // })

    } else {
      this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe((response) => {
        const lengthRes = response.recipients.length;
        for (let i = 0; i < lengthRes; i++) {

          const id = response.recipients[i].id;

          if (id == this.datas.recipientId) {
            let taxCodePartnerStep2 = response.recipients[i].fields[0].recipient.cardId;

            this.myForm = this.fbd.group({
              taxCode: this.fbd.control(taxCodePartnerStep2,
                [Validators.required,
                  Validators.pattern(parttern.cardid)
              ]),
            })

            break;
          }
        }
      })
    }

    if (!this.data.id)
      this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe((response) => {
        const lengthRes = response.recipients.length;
        for (let i = 0; i < lengthRes; i++) {

          const id = response.recipients[i].id;

          if (id == this.datas.recipientId) {
            let taxCodePartnerStep2 = response.recipients[i].fields[0].recipient.cardId;

            this.taxCode = taxCodePartnerStep2;
            break;
          }
        }
      })

    this.getDeviceApp()
  }

  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  fieldTextType1: boolean = false;
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }

  fieldTextType2: boolean = false;
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }
  cardId: any;
  async onSubmit() {
    this.submitted = true;

    if (this.myForm.invalid) {
      return;
    }
    this.submitted = true;

    if (this.myForm.invalid) {
      return;
    }

    if(!this.data.id) {
      const determineCoordination = await this.contractService.getDetermineCoordination(this.data.recipientId).toPromise();
      let isInRecipient = false;
      const cardId = this.data?.dataContract?.card_id;
      for (const card of determineCoordination.recipients) {
        if (cardId == card.card_id) {
          isInRecipient = true;
        }
      }
      if (!isInRecipient) {
        this.toastService.showErrorHTMLWithTimeout(
          'Bạn không có quyền xử lý hợp đồng này!',
          '',
          3000
        );
        if (this.type == 1) {
          this.router.navigate(['/login']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        } else {
          this.router.navigate(['/main/dashboard']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        }
      }

      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;


      this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe(async (response) => {

        const ArrRecipients = response.recipients.filter((ele: any) => ele.id);


        let ArrRecipientsNew = false
        ArrRecipients.map((item: any) => {
          if (item.email === this.currentUser.email) {
            ArrRecipientsNew = true
            return
          }
        });


        if (!ArrRecipientsNew) {

          this.toastService.showErrorHTMLWithTimeout(
            'Bạn không có quyền xử lý hợp đồng này!',
            '',
            3000
          );
          if (this.type == 1) {
            this.router.navigate(['/login']);
            this.dialogRef.close();
            this.spinner.hide();
            return
          } else {
            this.router.navigate(['/main/dashboard']);
            this.dialogRef.close();
            this.spinner.hide();
            return
          }
        };

        //Check voi nguoi dung trong he thong
        if (!this.data.id)
          this.contractService.getCheckSignatured(this.data.recipientId).subscribe((res: any) => {
            if (res && res.status == 2) {
              this.toastService.showErrorHTMLWithTimeout('contract_signature_success', "", 3000);
              return;
            }
          }, (error: HttpErrorResponse) => {
            this.toastService.showErrorHTMLWithTimeout('error_check_signature', "", 3000);
          })

        const data = {
          ma_dvcs: this.myForm.value.taxCode,
          type: this.myForm.value.supplier
        };



        if (!this.data.id) {
          //Trường hợp không phải ký nhiều
          if (data.ma_dvcs === this.taxCode) {
            this.dialogRef.close(data);
          } else {
            this.toastService.showErrorHTMLWithTimeout('Mã số thuế/CMT/CCCD không trùng khớp thông tin ký hợp đồng', '', 3000);
          }
        }

        else if (this.data.id == 1) {
          //Trường hợp ký nhiều

          this.dialogRef.close(data);
        }
      })
    } else {
      const data = {
        ma_dvcs: this.myForm.value.taxCode,
        type: this.myForm.value.supplier
      };

      this.dialogRef.close(data);
    }
  }

  get f() { return this.myForm.controls; }

}
