import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UserService } from 'src/app/service/user.service';
import { parttern_input } from 'src/app/config/parttern';
import { ContractService } from 'src/app/service/contract.service';
import { error } from 'jquery';
import { ToastService } from 'src/app/service/toast.service';

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

  submitted = false;

  taxCode: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private el: ElementRef,
    private userService: UserService,
    private contractService: ContractService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<HsmDialogSignComponent>,
  ) {
     this.myForm = this.fbd.group({
      taxCode: this.fbd.control("", [Validators.required,Validators.pattern(parttern_input.taxCode_form)]),
      username: this.fbd.control("", [Validators.required]),
      pass1: this.fbd.control("", [Validators.required]),
      pass2: this.fbd.control("", [Validators.required])
    });
   }



  ngOnInit(): void {
    this.datas = this.data;

    console.log("field text type ", this.fieldTextType1);

    this.user = this.userService.getInforUser();

    console.log("this user ", this.user);

    this.id = this.user.customer_id;

    console.log("this id ", this.id);

    if(this.user.organization_id != 0) {
      console.log("id to chuc khac 0 ");
      this.userService.getUserById(this.id).subscribe((response) => {
        this.myForm = this.fbd.group({
          taxCode: this.fbd.control(response.tax_code, [Validators.required, Validators.pattern(parttern_input.taxCode_form)]),
          username: this.fbd.control(response.hsm_name, [Validators.required]),
          pass1: this.fbd.control(response.hsm_pass, [Validators.required]),
          pass2: this.fbd.control("",[Validators.required])
        });
      })

    } else {
      this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe((response) => {
        const lengthRes = response.recipients.length;
        for(let i = 0; i < lengthRes; i++) {

          const id = response.recipients[i].id;

          if(id == this.datas.recipientId) {
            let taxCodePartnerStep2 = response.recipients[i].fields[0].recipient.cardId;

            this.myForm = this.fbd.group({
              taxCode: this.fbd.control(taxCodePartnerStep2, [Validators.required, Validators.pattern(parttern_input.taxCode_form)]),
              username: this.fbd.control(taxCodePartnerStep2, [Validators.required]),
              pass1: this.fbd.control("", [Validators.required]),
              pass2: this.fbd.control("",[Validators.required])
            })

            break;
          }
        }
      })
    }


    this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe((response) => {
      const lengthRes = response.recipients.length;
      for(let i = 0; i < lengthRes; i++) {

        const id = response.recipients[i].id;

        if(id == this.datas.recipientId) {
          let taxCodePartnerStep2 = response.recipients[i].fields[0].recipient.cardId;

          this.taxCode = taxCodePartnerStep2;
          break;
        }
      }
    })
  }

  fieldTextType1: boolean = false;
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;

    console.log("field text type ", this.fieldTextType1);
  }

  fieldTextType2: boolean = false;
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  onSubmit() {
    this.submitted = true;

    if(this.myForm.invalid) {
      console.log("vao day ");
      return;
    }

    const data = {
      ma_dvcs: this.myForm.value.taxCode,
      username: this.myForm.value.username,
      password: this.myForm.value.pass1,
      password2: this.myForm.value.pass2
    };

    const recipientId = this.datas.recipientId;

    console.log("data ", data);

    console.log("tax code ", this.taxCode);

    //Check voi nguoi dung trong he thong
    if(data.ma_dvcs === this.taxCode) {
      this.contractService.signHsm(data, recipientId).subscribe((response) => {
        if(response.success === true) {
          console.log("response true ");
          this.dialogRef.close(data);
        } else if(response.success === false) {
          if(!response.message) {
            this.toastService.showErrorHTMLWithTimeout('Đăng nhập không thành công','',3000);
          } else if(response.message) {
            this.toastService.showErrorHTMLWithTimeout(response.message,'',3000);
          }
        }
      },
      (error) => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
          '',
          3000);
      });
    } else {
      this.toastService.showErrorHTMLWithTimeout('Mã số thuê không trùng khớp thông tin ký hợp đồng','',3000);
    }
  }

  get f() { return this.myForm.controls; }

}
