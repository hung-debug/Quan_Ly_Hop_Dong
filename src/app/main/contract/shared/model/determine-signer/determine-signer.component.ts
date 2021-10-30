import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {variable} from "../../../../../config/variable";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Helper} from "../../../../../core/Helper";
import {ContractService} from "../../../../../service/contract.service";

@Component({
  selector: 'app-determine-signer',
  templateUrl: './determine-signer.component.html',
  styleUrls: ['./determine-signer.component.scss']
})
export class DetermineSignerComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeDetermineSigner = new EventEmitter<string>();
  determine_step = false;
  determineDetails!: FormGroup;
  userForm: FormGroup;

  //dropdown
  signTypeList: Array<any> = [];
  dropdownSignTypeSettings: any = {};

  get determineContract() { return this.determineDetails.controls; }
  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService
  ) {
    this.step = variable.stepSampleContract.step2
    //this.datas.determineDetails = this.determineDetails;
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      order: 1,
      name: 'CÔNG TY CỔ PHẦN PHẦN MỀM CÔNG NGHỆ CAO VIỆT NAM',
      userViews: this.formBuilder.array([]) ,
      userSigns: this.formBuilder.array([]) ,
      // userSigns: (this.datas.userForm && this.datas.userForm.userSigns.length > 0) ? this.formBuilder.array(this.datas.userForm.userSigns) : this.formBuilder.array([]) ,
      userDocs: this.formBuilder.array([]) ,
    });

    this.partners = this.formBuilder.group({
      order: 1,
      type: 2,
      name: '',
      partnerLeads: this.formBuilder.array([]) ,
      partnerViews: this.formBuilder.array([]) ,
      partnerSigns: this.formBuilder.array([]) ,
      // partnerSigns: (this.datas.partners && this.datas.partners.partnerSigns.length > 0) ? this.formBuilder.array(this.datas.partners.partnerSigns) : this.formBuilder.array([]) ,
      partnerDocs: this.formBuilder.array([]) ,

      partnerUsers: this.formBuilder.array([]) ,
    });

    this.signTypeList = [
      {
        item_id: 1,
        item_text: "Ký ảnh",
      },
      {
        item_id: 2,
        item_text: "Ký số bằng USB token",
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

  //user view
  userViews() : FormArray {
    return this.userForm.get("userViews") as FormArray
  }
  newUserView(): FormGroup {
    return this.formBuilder.group({
      order: 1,
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
    return this.userForm.get("userSigns") as FormArray
  }
  newUserSign(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: '',
      email: '',
      signType: '',
      isOtp: true,
      phone: '',
      id: ''
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
    return this.userForm.get("userDocs") as FormArray
  }
  newUserDoc(): FormGroup {
    return this.formBuilder.group({
      order: 1,
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
      order: 1,
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
      order: 1,
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
      order: 1,
      name: '',
      email: '',
      signType: '',
      isOtp: true,
      phone: '',
      id: ''
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
      order: 1,
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

  //partner user (ca nhan)
  partnerUsers() : FormArray {
    return this.partners.get("partnerUsers") as FormArray
  }
  newPartnerUser(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: '',
      email: '',
      signType: '',
      isOtp: true,
      phone: '',
    })
  }
  addPartnerUser() {
    this.partnerUsers().push(this.newPartnerUser());
  }
  removePartnerUser(i:number) {
    this.partnerUsers().removeAt(i);
  }

  onSubmit() {
    console.log(this.userForm.value);
  }

  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.nextOrPreviousStep(step);
  }

  // next step event
  next() {
    if (!this.validData()) return;
    else {
      // gán value step 2 vào datas
      this.datas.userForm = this.userForm.value;
      if (this.datas.userForm.userSigns && this.datas.userForm.userSigns.length) {
        this.datas.userForm.userSigns.forEach((item: any) => {
          item['id'] = Helper._randomNumber(10);
        })
      }
      this.datas.partners = this.partners.value;
      if (this.datas.partners.partnerSigns && this.datas.userForm.userSigns.length) {
        this.datas.partners.partnerSigns.forEach((item: any) => {
          item['id'] = Helper._randomNumber(10);
        })
      }
      this.step = variable.stepSampleContract.step3;
      this.datas.stepLast = this.step
      console.log(this.datas);
      this.nextOrPreviousStep(this.step);
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeDetermineSigner.emit(step);
  }

  // valid data step 2
  validData() {
    if (this.userForm.invalid) {
      console.log('vui lòng nhập đầy đủ dữ liệu userForm')
    }
    if (this.partners.invalid) {
      console.log('Vui lòng nhập đầy đủ dữ liệu partners')
    }
    return true;
  }

}
