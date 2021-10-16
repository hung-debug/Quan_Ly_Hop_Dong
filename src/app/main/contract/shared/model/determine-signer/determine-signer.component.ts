import { Component, OnInit, Input } from '@angular/core';
import {variable} from "../../../../../config/variable";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-determine-signer',
  templateUrl: './determine-signer.component.html',
  styleUrls: ['./determine-signer.component.scss']
})
export class DetermineSignerComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  address_step = false;
  addressDetails!: FormGroup;
  get address() { return this.addressDetails.controls; }
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.step = variable.stepSampleContract.step2
  }

  ngOnInit(): void {
    this.addressDetails = this.formBuilder.group({
      city: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['',Validators.required]
    });
  }

}
