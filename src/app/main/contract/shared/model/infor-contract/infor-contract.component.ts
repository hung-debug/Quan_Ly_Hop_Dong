import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {variable} from "../../../../../config/variable";

@Component({
  selector: 'app-infor-contract',
  templateUrl: './infor-contract.component.html',
  styleUrls: ['./infor-contract.component.scss']
})
export class InforContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  personalDetails!: FormGroup;
  personal_step = false;
  get personal() { return this.personalDetails.controls; }
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.step = variable.stepSampleContract.step1
  }

  ngOnInit(): void {
    this.personalDetails = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['',Validators.required]
    });
  }

}
