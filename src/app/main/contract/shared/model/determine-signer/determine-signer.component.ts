import { Component, OnInit, Input } from '@angular/core';
import {variable} from "../../../../../config/variable";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  //dropdown
  signTypeList: Array<any> = [];
  dropdownSignTypeSettings: any = {};

  get address() { return this.addressDetails.controls; }
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.step = variable.stepSampleContract.step2

    this.productForm = this.formBuilder.group({
      order: '1',
      name: 'CÔNG TY CỔ PHẦN PHẦN MỀM CÔNG NGHỆ CAO VIỆT NAM',
      userViews: this.formBuilder.array([]) ,
      userSigns: this.formBuilder.array([]) ,
      userDocs: this.formBuilder.array([]) ,
    });

    this.partners = this.formBuilder.group({
      order: '1',
      name: '',
      partnerLeads: this.formBuilder.array([]) ,
      partnerViews: this.formBuilder.array([]) ,
      partnerSigns: this.formBuilder.array([]) ,
      partnerDocs: this.formBuilder.array([]) ,
    });
  }

  ngOnInit(): void {
    this.addressDetails = this.formBuilder.group({
      city: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['',Validators.required]
    });

    this.signTypeList = [
      {
        item_id: 1,
        item_text: "Ký ảnh",
      },
      {
        item_id: 2,
        item_text: "Ký số bằng USB token",
      },
      {
        item_id: 3,
        item_text: "Ký số khác",
      }
    ];

    this.dropdownSignTypeSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      allowSearchFilter: true
    };
  }

  //dropdown contract type
  get getSignTypeItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  name = 'Angular';

  productForm: FormGroup;

  //user view
  userViews() : FormArray {
    return this.productForm.get("userViews") as FormArray
  }
  newUserView(): FormGroup {
    return this.formBuilder.group({
      order: '1',
      name: '',
      email: '',
    })
  }
  addUserView() {
    this.userViews().push(this.newUserView());
  }
  removeUserView(i:number) {
    this.userViews().removeAt(i);
  }

  //user sign
  userSigns() : FormArray {
    return this.productForm.get("userSigns") as FormArray
  }
  newUserSign(): FormGroup {
    return this.formBuilder.group({
      order: '1',
      name: '',
      email: '',
      signType: '',
      isOtp: true,
      phone: '',
    })
  }
  addUserSign() {
    this.userSigns().push(this.newUserSign());
  }
  removeUserSign(i:number) {
    this.userSigns().removeAt(i);
  }

  //user document
  userDocs() : FormArray {
    return this.productForm.get("userDocs") as FormArray
  }
  newUserDoc(): FormGroup {
    return this.formBuilder.group({
      order: '1',
      name: '',
      email: '',
      signType: '',
    })
  }
  addUserDoc() {
    this.userDocs().push(this.newUserSign());
  }
  removeUserDoc(i:number) {
    this.userDocs().removeAt(i);
  }

  //partner
  partners : FormGroup;

  //user partner lead
  partnerLeads() : FormArray {
    return this.partners.get("partnerLeads") as FormArray
  }
  newPartnerLead(): FormGroup {
    return this.formBuilder.group({
      order: '1',
      name: '',
      email: '',
    })
  }
  addPartnerLead() {
    this.partnerLeads().push(this.newPartnerLead());
  }
  removePartnerLead(i:number) {
    this.partnerLeads().removeAt(i);
  }

  //partner view
  partnerViews() : FormArray {
    return this.partners.get("partnerViews") as FormArray
  }
  newPartnerView(): FormGroup {
    return this.formBuilder.group({
      order: '1',
      name: '',
      email: '',
    })
  }
  addPartnerView() {
    this.partnerViews().push(this.newPartnerView());
  }
  removePartnerView(i:number) {
    this.partnerViews().removeAt(i);
  }

  //partner sign
  partnerSigns() : FormArray {
    return this.partners.get("partnerSigns") as FormArray
  }
  newPartnerSign(): FormGroup {
    return this.formBuilder.group({
      order: '1',
      name: '',
      email: '',
      signType: '',
      isOtp: true,
      phone: '',
    })
  }
  addPartnerSign() {
    this.partnerSigns().push(this.newPartnerSign());
  }
  removePartnerSign(i:number) {
    this.partnerSigns().removeAt(i);
  }

  //partner document
  partnerDocs() : FormArray {
    return this.partners.get("partnerDocs") as FormArray
  }
  newPartnerDoc(): FormGroup {
    return this.formBuilder.group({
      order: '1',
      name: '',
      email: '',
      signType: '',
    })
  }
  addPartnerDoc() {
    this.partnerDocs().push(this.newPartnerDoc());
  }
  removePartnerDoc(i:number) {
    this.partnerDocs().removeAt(i);
  }

  onSubmit() {
    console.log(this.productForm.value);
  }

}
