import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { variable } from 'src/app/config/variable';

@Component({
  selector: 'app-confirm-infor-contract',
  templateUrl: './confirm-infor-contract.component.html',
  styleUrls: ['./confirm-infor-contract.component.scss']
})
export class ConfirmInforContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  confirmForm!: FormGroup;
  @Output('stepChangeConfirmInforContract') stepChangeConfirmInforContract = new EventEmitter<Array<any>>();

  constructor(private formBuilder: FormBuilder,) {
    this.step = variable.stepSampleContract.step4
  }

  ngOnInit(): void {
    console.log("step4" + this.datas.contract_user_sign);

    let userViews:string = '';
    let conn:string = '';
    if (this.datas.userForm.userViews && this.datas.userForm.userViews.length > 0) {
      this.datas.userForm.userViews.forEach((item: any) => {
        userViews = userViews + conn + item.name + " - " + item.email;
        conn = ",";
        console.log(userViews);
      })
    }

    let userSigns:string = '';
    conn = '';
    if (this.datas.userForm.userSigns && this.datas.userForm.userSigns.length > 0) {
      this.datas.userForm.userSigns.forEach((item: any) => {
        userSigns = userSigns + conn + item.name + " - " + item.email;
        conn = ",";
      })
    }

    let userDocs:string = '';
    conn = '';
    if (this.datas.userForm.userDocs && this.datas.userForm.userDocs.length > 0) {
      this.datas.userForm.userDocs.forEach((item: any) => {
        userDocs = userDocs + conn + item.name + " - " + item.email;
        conn = ",";
      })
    }

    let partnerViews:string = '';
    conn = '';
    if (this.datas.partners.partnerViews && this.datas.partners.partnerViews.length > 0) {
      this.datas.partners.partnerViews.forEach((item: any) => {
        partnerViews = partnerViews + conn + item.name + " - " + item.email;
        conn = ",";
      })
    }

    let partnerSigns:string = '';
    conn = '';
    if (this.datas.partners.partnerSigns && this.datas.partners.partnerSigns.length > 0) {
      this.datas.partners.partnerSigns.forEach((item: any) => {
        partnerSigns = partnerSigns + conn + item.name + " - " + item.email;
        conn = ",";
      })
    }

    let partnerDocs:string = '';
    conn = '';
    if (this.datas.partners.partnerDocs && this.datas.partners.partnerDocs.length > 0) {
      this.datas.partners.partnerDocs.forEach((item: any) => {
        partnerDocs = partnerDocs + conn + item.name + " - " + item.email;
        conn = ",";
      })
    }

    this.confirmForm = this.formBuilder.group({

      contractFileName:this.datas.file_name,
      dateDeadline: this.datas.dateDeadline,
      comment: this.datas.comment,
      userViews: userViews,
      userSigns: userSigns,
      userDocs: userDocs,
      partnerViews: partnerViews,
      partnerSigns: partnerSigns,
      partnerDocs: partnerDocs,
    });
  }

}
