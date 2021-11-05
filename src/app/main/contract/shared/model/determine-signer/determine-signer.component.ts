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
  partnerForm : FormGroup

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
  data: any = [
      {
        "order": 1,
        "name": "Nguyễn Tuấn Anh",
        "email": "nguyentuananh@vhc.com.vn",
        "signType": [
          {
            "item_id": 1,
            "item_text": "Ký ảnh"
          }
        ],
        "isOtp": true,
        "phone": "0979889999",
        "id": 3923609057,
        "selected": false,
        "sign_unit": "organization"
      },
      {
        "order": 1,
        "name": "Đỗ Thành Dương",
        "email": "duongdt@vhc.com.vn",
        "signType": [
          {
            "item_id": 1,
            "item_text": "Ký ảnh"
          }
        ],
        "isOtp": true,
        "phone": "0979889889",
        "id": 3900000225,
        "selected": false,
        "sign_unit": "organization"
      }
  ];

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      order: 1,
      name: 'CÔNG TY CỔ PHẦN PHẦN MỀM CÔNG NGHỆ CAO VIỆT NAM',
      userViews: this.formBuilder.array([]),
      userSigns: this.formBuilder.array([]),
      userDocs: this.formBuilder.array([])
      // userViews: (this.datas.userForm && this.datas.userForm.userViews.length > 0) ? this.formBuilder.array(this.datas.userForm.userViews) : this.formBuilder.array([]) ,
      // userSigns: (this.datas.userForm && this.datas.userForm.userSigns.length > 0) ? this.formBuilder.array(this.datas.userForm.userSigns) : this.formBuilder.array([]) ,
      // userDocs: (this.datas.userForm && this.datas.userForm.userDocs.length > 0) ? this.formBuilder.array(this.datas.userForm.userDocs) : this.formBuilder.array([]) ,
    });



    // this.userForm.setControl('userViews', (this.datas.userForm && this.datas.userForm.userViews.length > 0) ? this.formBuilder.array(this.datas.userForm.userViews) : this.formBuilder.array([]));
    // this.userForm.setControl('userSigns', (this.datas.userForm && this.datas.userForm.userSigns.length > 0) ? this.formBuilder.array(this.datas.userForm.userSigns) : this.formBuilder.array([]));
    // this.userForm.setControl('userDocs', (this.datas.userForm && this.datas.userForm.userDocs.length > 0) ? this.formBuilder.array(this.datas.userForm.userDocs) : this.formBuilder.array([]));

    this.partnerForm = this.formBuilder.group({
      partnerArrs : this.formBuilder.array([this.newPartner()])
    });

    this.partnerForm.setControl('partnerArrs', (this.datas.partnerForm && this.datas.partnerForm.partnerArrs.length > 0) ? this.formBuilder.array(this.datas.partnerForm.partnerArrs) : this.formBuilder.array([this.newPartner()]));


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
        item_text: "Ký số bằng sim KPI",
      },
      {
        item_id: 4,
        item_text: "Ký số bằng HSM",
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

    // const fa = (this.userForm.get('aliases') as FormArray);
    this.addNewAlias();
  }

  // gán lại dữ liệu value cho form
  addNewAlias() {
    const fa = (this.userForm.get('userSigns') as FormArray);
    for (let i = 0; i < this.data.length; i++) {
      fa.push(this.formBuilder.group(this.data[i]));
    }
    console.log(fa, this.data.length)
  }


  // this.data = [
  //   {
  //     "order": 1,
  //     "name": "Nguyễn Tuấn Anh",
  //     "email": "nguyentuananh@vhc.com.vn",
  //     "signType": [
  //       {
  //         "item_id": 1,
  //         "item_text": "Ký ảnh"
  //       }
  //     ],
  //     "isOtp": true,
  //     "phone": "0979889999",
  //     "id": 3923609057,
  //     "selected": false,
  //     "sign_unit": "organization"
  //   }]

  // @ts-ignore



  partnerArrs() : FormArray {
    return this.partnerForm.get("partnerArrs") as FormArray
  }
  newPartner(): FormGroup {
    return this.partners = this.formBuilder.group({
      order: 1,
      type: 1,
      name: ['', Validators.required],
      partnerLeads: this.formBuilder.array([]) ,
      partnerViews: this.formBuilder.array([]) ,
      partnerSigns: this.formBuilder.array([]) ,
      partnerDocs: this.formBuilder.array([]) ,

      partnerUsers: this.formBuilder.array([]) ,
    })
  }
  addPartner() {
    this.partnerArrs().push(this.newPartner());
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
    console.log((this.userForm.get("userSigns") as FormArray).value)
    return this.userForm.get("userSigns") as FormArray
  }
  newUserSign(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
      isOtp: true,
      phone: ['', Validators.required],
      id: '',
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
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
  partnerLeads(a:number) : FormArray {
    return this.partnerArrs().at(a).get("partnerLeads") as FormArray
  }
  newPartnerLead(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }
  addPartnerLead(a:number) {
    this.partnerLeads(a).push(this.newPartnerLead());
  }
  removePartnerLead(a:number, i:number) {
    this.partnerLeads(a).removeAt(i);
  }

  //partner view
  partnerViews(a:number) : FormArray {
    return this.partnerArrs().at(a).get("partnerViews") as FormArray
  }
  newPartnerView(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }
  addPartnerView(a:number) {
    this.partnerViews(a).push(this.newPartnerView());
  }
  removePartnerView(a:number, i:number) {
    this.partnerViews(a).removeAt(i);
  }

  //partner sign
  partnerSigns(a:number) : FormArray {
    return this.partnerArrs().at(a).get("partnerSigns") as FormArray
  }
  newPartnerSign(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
      isOtp: true,
      phone: ['', Validators.required],
      id: ''
    })
  }
  addPartnerSign(a:number) {
    this.partnerSigns(a).push(this.newPartnerSign());
  }
  removePartnerSign(a:number, i:number) {
    this.partnerSigns(a).removeAt(i);
  }

  //partner document
  partnerDocs(a:number) : FormArray {
    return this.partnerArrs().at(a).get("partnerDocs") as FormArray
  }
  newPartnerDoc(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
    })
  }
  addPartnerDoc(a:number) {
    this.partnerDocs(a).push(this.newPartnerDoc());
  }
  removePartnerDoc(a:number, i:number) {
    this.partnerDocs(a).removeAt(i);
  }

  //partner user (ca nhan)
  partnerUsers(a:number) : FormArray {
    return this.partnerArrs().at(a).get("partnerUsers") as FormArray
  }
  newPartnerUser(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
      isOtp: true,
      phone: ['', Validators.required],
    })
  }
  addPartnerUser(a:number) {
    this.partnerUsers(a).push(this.newPartnerUser());
  }
  removePartnerUser(a:number, i:number) {
    this.partnerUsers(a).removeAt(i);
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
      // if (this.datas.userForm.userSigns && this.datas.userForm.userSigns.length > 0) {
      //   this.datas.userForm.userSigns.forEach((item: any) => {
      //     // item['id'] = Helper._randomNumber(10);
      //   })
      // }
      this.datas.partners = this.partners.value;
      // if (this.datas.partners.partnerSigns && this.datas.userForm.userSigns.length > 0) {
      //   this.datas.partners.partnerSigns.forEach((item: any) => {
      //     // item['id'] = Helper._randomNumber(10);
      //   })
      // }
      // if (this.datas.partners.partnerUsers && this.datas.partners.partnerUsers.length > 0) {
      //   this.datas.partners.partnerUsers.forEach((item: any) => {
      //     // item['id'] = Helper._randomNumber(10);
      //   })
      // }
      this.step = variable.stepSampleContract.step3;
      this.datas.stepLast = this.step
      // console.log(this.datas);
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
      return false;
    }
    if (this.partners.invalid) {
      console.log('Vui lòng nhập đầy đủ dữ liệu partners')
    }
    return true;
  }

}
