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

@Component({
  selector: 'app-hsm-dialog-sign',
  templateUrl: './hsm-dialog-sign.component.html',
  styleUrls: ['./hsm-dialog-sign.component.scss']
})
export class HsmDialogSignComponent implements OnInit {
  myForm: FormGroup;
  datas: any;
  user: any;
  id: any;
  type: any = 0;
  submitted = false;
  currentUser: any;
  taxCode: any;
  hsmSupplier: any;
  suppliers: any[] = [];
  dataGetUserById: any;
  isHsmIcorp: boolean = true;
  typeUser: any;
  confirmConsider: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private userService: UserService,
    private contractService: ContractService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<HsmDialogSignComponent>,
    private spinner: NgxSpinnerService,
  ) {
    this.myForm = this.fbd.group({
      hsmSupplier: this.fbd.control("", [Validators.required]),
      username: this.fbd.control("", [Validators.required]),
      pass1: this.fbd.control("", [Validators.required]),
      pass2: this.fbd.control("", [Validators.required]),
      uuid: this.fbd.control("", [Validators.required]),
    });
    
    this.typeUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.type;
  }


  async ngOnInit(): Promise<void> {
    this.datas = this.data;
    
    this.user = this.userService.getInforUser();

    this.id = this.user.customer_id;
    if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
      this.type = 1;
    } else
      this.type = 0;


    if (this.user.organization_id != 0) {
      this.userService.getUserById(this.id).subscribe((response) => {
        this.isHsmIcorp = response.hsm_supplier === "mobifone";
        this.dataGetUserById = response;
        if(!this.isHsmIcorp) {
          this.myForm = this.fbd.group({
            hsmSupplier: this.fbd.control(response.hsm_supplier, [Validators.required]),
            username: this.fbd.control(response.hsm_name, [Validators.required]),
            pass1: this.fbd.control("", [Validators.required]),
          });
        } else {
          this.myForm = this.fbd.group({
            hsmSupplier: this.fbd.control(response.hsm_supplier, [Validators.required]),
            pass2: this.fbd.control("", [Validators.required]),
            uuid: this.fbd.control(response.uuid, [Validators.required]),
          });
        }
      })
    } else {
      this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe((response) => {
        const lengthRes = response.recipients.length;
        for (let i = 0; i < lengthRes; i++) {

          const id = response.recipients[i].id;

          if (id == this.datas.recipientId) {
            this.myForm = this.fbd.group({
              hsmSupplier: this.fbd.control('mobifone', [Validators.required]),
              pass2: this.fbd.control("", [Validators.required]),
              uuid: this.fbd.control("", [Validators.required]),
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
    
      //
    let listSupplier = await this.contractService.getListSupplier(1).toPromise();
    
    if(listSupplier) {
      this.suppliers = listSupplier.map((item: any) => ({
        id: item.code,
        name: item.supplierName
      }));
    }
  }

  onSupplierChange(event: any) {
    this.isHsmIcorp = event.value === "mobifone";
    if(this.user.organization_id != 0) {
      if(!this.isHsmIcorp) {
        this.myForm = this.fbd.group({
          hsmSupplier: this.fbd.control(event.value, [Validators.required]),
          username: this.fbd.control(this.dataGetUserById.hsm_name, [Validators.required]),
          pass1: this.fbd.control("", [Validators.required]),
        });
      } else {
        this.myForm = this.fbd.group({
          hsmSupplier: this.fbd.control(event.value, [Validators.required]),
          pass2: this.fbd.control("", [Validators.required]),
          uuid: this.fbd.control(this.dataGetUserById.uuid, [Validators.required]),
        });
      }
    } else {
      if(!this.isHsmIcorp) {
        this.myForm = this.fbd.group({
          hsmSupplier: this.fbd.control(event.value, [Validators.required]),
          username: this.fbd.control("", [Validators.required]),
          pass1: this.fbd.control("", [Validators.required]),
        });
      } else {
        this.myForm = this.fbd.group({
          hsmSupplier: this.fbd.control(event.value, [Validators.required]),
          pass2: this.fbd.control("", [Validators.required]),
          uuid: this.fbd.control("", [Validators.required]),
        });
      }
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
          'Bạn không có quyền xử lý tài liệu này!',
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
          if ((((item.email === this.currentUser.email && this.currentUser?.loginType == 'EMAIL') || 
          (item.phone === this.currentUser.phone && this.currentUser?.loginType == 'SDT') ||
          ((item.phone === this.currentUser.phone || item.email === this.currentUser.email) && this.currentUser?.loginType == 'EMAIL_AND_SDT')) && this.typeUser === 0) ||
          (item.email === this.currentUser.email && this.typeUser === 1)) {
            ArrRecipientsNew = true
            return
          }
        });
        
  
        if (!ArrRecipientsNew) {
          
          this.toastService.showErrorHTMLWithTimeout(
            'Bạn không có quyền xử lý tài liệu này!',
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
  
        const data: any = {
          supplier: this.myForm.value.hsmSupplier,
          confirmConsider: this.confirmConsider
          //a_dvcs: this.myForm.value.taxCode,
          // username: this.myForm.value.username,
          // password: this.myForm.value.pass1,
        };
        if (this.isHsmIcorp) {
          data["password2"] = this.myForm.value.pass2;
          data["uuid"] = this.myForm.value.uuid;
        } else {
          data["username"] = this.myForm.value.username;
          data["password"] = this.myForm.value.pass1;
        }

        // if(this.confirmConsider && this.typeUser != 1) {
        //   try{
        //     let saveInfoSingHsm = await this.userService.saveInfoSingHsm(data).toPromise();
        //     if(!saveInfoSingHsm.status) {
        //         this.toastService.showErrorHTMLWithTimeout(
        //         saveInfoSingHsm.message,
        //         '',
        //         3000
        //       );   
        //     }
        //   } catch(err) {
        //     this.toastService.showErrorHTMLWithTimeout(
        //       'Lưu thông tin ký số cho lần ký sau thất bại',
        //       '',
        //       3000
        //     );
        //   }
        // }
        if (!this.data.id) {
          this.dialogRef.close(data);
          //Trường hợp không phải ký nhiều
          // if (data.ma_dvcs === this.taxCode) {
          //   this.dialogRef.close(data);
          // } else {
          //   this.toastService.showErrorHTMLWithTimeout('Mã số thuế/CMT/CCCD không trùng khớp thông tin ký tài liệu', '', 3000);
          // }
        }
  
        else if (this.data.id == 1) {
          //Trường hợp ký nhiều
          
          this.dialogRef.close(data);
        }
      })
    } else {
      const data: any = {
        supplier: this.myForm.value.hsmSupplier,
        confirmConsider: this.confirmConsider
        //ma_dvcs: this.myForm.value.taxCode,
        // username: this.myForm.value.username,
        // password: this.myForm.value.pass1,
      };

      if (this.isHsmIcorp) {
        data["password2"] = this.myForm.value.pass2;
        data["uuid"] = this.myForm.value.uuid;
      } else {
        data["username"] = this.myForm.value.username;
        data["password"] = this.myForm.value.pass1;
      }

      // if(this.confirmConsider && this.typeUser != 1) {
      //   try{
      //     let saveInfoSingHsm = await this.userService.saveInfoSingHsm(data).toPromise();
      //     if(!saveInfoSingHsm.status) {
      //         this.toastService.showErrorHTMLWithTimeout(
      //         saveInfoSingHsm.message,
      //         '',
      //         3000
      //       );   
      //     }
      //   } catch(err) {
      //     this.toastService.showErrorHTMLWithTimeout(
      //       'Lưu thông tin ký số cho lần ký sau thất bại',
      //       '',
      //       3000
      //     );
      //   }
      // }

      this.dialogRef.close(data);
    }
  }

  get f() { return this.myForm.controls; }

}