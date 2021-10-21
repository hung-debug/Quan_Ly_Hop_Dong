import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-infor-contract',
  templateUrl: './confirm-infor-contract.component.html',
  styleUrls: ['./confirm-infor-contract.component.scss']
})
export class ConfirmInforContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  confirmForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,) {
    this.step = 'confirm-contract'
  }

  ngOnInit(): void {
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
