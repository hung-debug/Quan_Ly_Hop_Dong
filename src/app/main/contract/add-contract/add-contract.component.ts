import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss', '../../main.component.scss']
})
export class AddContractComponent implements OnInit {

  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  confirmDetails!: FormGroup;
  personal_step = false;
  address_step = false;
  education_step = false;
  confirm_step = false;
  step = 1;
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.personalDetails = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['',Validators.required]
    });
    this.addressDetails = this.formBuilder.group({
        city: ['', Validators.required],
        address: ['', Validators.required],
        pincode: ['',Validators.required]
    });
    this.educationalDetails = this.formBuilder.group({
        highest_qualification: ['', Validators.required],
        university: ['', Validators.required],
        total_marks: ['',Validators.required]
    });
    this.confirmDetails = this.formBuilder.group({

    });
  }
  get personal() { return this.personalDetails.controls; }
  get education() { return this.educationalDetails.controls; }
  get address() { return this.addressDetails.controls; }
  get confirm() { return this.confirmDetails.controls; }

  next(){
    if(this.step==1){
      this.personal_step = true;
      if (this.personalDetails.invalid) { return  }
    }
    else if(this.step==2){
      this.address_step = true;
      if (this.addressDetails.invalid) { return }
    }
    else if(this.step==3){
      this.education_step = true;
      if (this.educationalDetails.invalid) { return }
    }
    this.step++;
  }

  previous(){
    this.step--
    if(this.step==1){
      this.personal_step = false;
    }
    else if(this.step==2){
      this.address_step = false;
      this.education_step = false;
    }
    else if(this.step==3){
      this.education_step = false;
      this.confirm_step = false;
    }
  }

  submit(){
    if(this.step==4){
      this.confirm_step = true;
      if (this.confirmDetails.invalid) { return }
    }
  }

}
