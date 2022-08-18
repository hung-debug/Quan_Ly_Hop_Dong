import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UserService } from 'src/app/service/user.service';
import { parttern_input } from 'src/app/config/parttern';
import { ContractService } from 'src/app/service/contract.service';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private el: ElementRef,
    private userService: UserService,
    private contractService: ContractService,
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

    this.user = this.userService.getInforUser();

    this.id = this.user.customer_id;

    this.userService.getUserById(this.id).subscribe((response) => {
      console.log("response ",response);
      this.myForm = this.fbd.group({
        taxCode: this.fbd.control(response.tax_code, [Validators.required, Validators.pattern(parttern_input.taxCode_form)]),
        username: this.fbd.control(response.hsm_name, [Validators.required]),
        pass1: this.fbd.control(response.hsm_pass, [Validators.required]),
        pass2: this.fbd.control("",[Validators.required])
      })
    })

  }

  onSubmit() {
    this.submitted = true;

    if(this.myForm.invalid) {
      console.log("vao day ");
      return;
    }


  }

  get f() { return this.myForm.controls; }

}
