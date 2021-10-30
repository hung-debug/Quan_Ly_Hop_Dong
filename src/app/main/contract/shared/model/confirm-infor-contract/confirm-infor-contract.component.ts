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

    this.confirmForm = this.formBuilder.group({
      contractFile: ['', Validators.required],
      dateDeadline: ['', Validators.required],
      comment: ['',Validators.required],
      userViews: ['', Validators.required],
      userSigns: ['', Validators.required],
      userDocs: ['', Validators.required],
      partnerViews: ['', Validators.required],
      partnerSigns: ['', Validators.required],
      partnerDocs: ['', Validators.required],
    });
  }

}
