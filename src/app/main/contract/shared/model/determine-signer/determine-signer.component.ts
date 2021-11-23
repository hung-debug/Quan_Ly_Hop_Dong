import { ContractService } from 'src/app/service/contract.service';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {type_signature, variable} from "../../../../../config/variable";
import {FormArray, FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {Helper} from "../../../../../core/Helper";
// import {ContractService} from "../../../../../service/contract.service";
import * as ContractCreateDetermine from '../../contract_data'
import {elements} from "@interactjs/snappers/all";

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
  partnerForm: FormGroup
  submitted = false;
  data_determine: any;
  data_organization: any;
  data_parnter_organization: any = [];

  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = {};

  // is_partner_origanzation_reviewer: any = [];
  // is_partner_origanzation_coordinator: any = [];
  // is_partner_origanzation_signature: any = [];
  // is_partner_origanzation_document: any = {};
  //
  // is_partner_individual_reviewer: any = [];
  // is_partner_individual_coordinator: any = [];
  // is_partner_individual_signature: any = [];
  // is_partner_individual_document: any = {};

  is_determine_clone: any;
  list_type_signature: any = type_signature;
  toppings = new FormControl();


  //dropdown
  signTypeList: Array<any> = [];
  dropdownSignTypeSettings: any = {};

  get determineContract() {
    return this.determineDetails.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
  ) {
    this.bindData();
    this.step = variable.stepSampleContract.step2
    //this.datas.determineDetails = this.determineDetails;
  }

  bindData(){
    const anotherList:any[]=[
      { id:1,value:"test 1"},
      { id:2,value:"test 2"}
    ]
    this.toppings.setValue(anotherList)
  }


  ngOnInit(): void {
    this.is_determine_clone = [...this.contractService.getDataDetermine()];
    // data Tổ chức của tôi
    this.data_organization = this.is_determine_clone.filter((p: any) => p.type == 1)[0];
    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 1);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4)[0];

    // data đối tác
    this.data_parnter_organization = this.is_determine_clone.filter((p: any) => p.type == 2);
    // this.is_partner_origanzation_coordinator= this.data_parnter_organization.recipients.filter((p: any) => p.role == 2);
    // this.is_partner_origanzation_reviewer= this.data_parnter_organization.recipients.filter((p: any) => p.role == 1);
    // this.is_partner_origanzation_signature = this.data_parnter_organization.recipients.filter((p: any) => p.role == 3);
    // this.is_partner_origanzation_document = this.data_parnter_organization.recipients.filter((p: any) => p.role == 4)[0];

    //data cá nhân
    // this.individual =  this.is_determine_clone.filter((p: any) => p.type == 3)[0];
    // this.is_partner_individual_coordinator= this.individual.recipients.filter((p: any) => p.role == 2);
    // this.is_partner_individual_reviewer= this.individual.recipients.filter((p: any) => p.role == 1);
    // this.is_partner_individual_signature = this.individual.recipients.filter((p: any) => p.role == 3);
    // this.is_partner_individual_document = this.individual.recipients.filter((p: any) => p.role == 4)[0];

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
      partnerArrs: this.formBuilder.array([this.newPartner()])
    });

    //this.partnerForm.setControl('partnerArrs', (this.datas.partnerForm && this.datas.partnerForm.partnerArrs.length > 0) ? this.formBuilder.array(this.datas.partnerForm.partnerArrs) : this.formBuilder.array([this.newPartner()]));


    if (this.datas.userForm && this.datas.userForm.userViews.length > 0) {
      this.setUserViews(this.datas.userForm.userViews);
    }
    if (this.datas.userForm && this.datas.userForm.userSigns.length > 0) {
      this.setUserSigns(this.datas.userForm.userSigns);
    }
    if (this.datas.userForm && this.datas.userForm.userDocs.length > 0) {
      this.setUserDocs(this.datas.userForm.userDocs);
    }
    if (this.datas.partnerForm && this.datas.partnerForm.partnerArrs.length > 0) {
      this.datas.partnerForm.partnerArrs.forEach(async (element: any, index: any) => {
        await this.setPartnerDocs(element.partnerDocs);
        await this.setPartnerLeads(element.partnerLeads, index);
        await this.setPartnerSign(element.partnerSigns);
        await this.setPartnerUser(element.partnerUsers);
        await this.setPartnerViews(element.partnerViews);
      })
    }


    // this.signTypeList = [
    //   {
    //     item_id: 1,
    //     item_text: "Ký ảnh",
    //   },
    //   {
    //     item_id: 2,
    //     item_text: "Ký số bằng USB token",
    //   },
    //   {
    //     item_id: 3,
    //     item_text: "Ký số bằng sim KPI",
    //   },
    //   {
    //     item_id: 4,
    //     item_text: "Ký số bằng HSM",
    //   }
    // ];
    this.signTypeList = [
      {
        id: 1,
        name: "Ký ảnh"
      },
      {
        id: 2,
        name: "Ký số bằng USB token"
      },
      {
        id: 3,
        name: "Ký số bằng sim KPI"
      },
      {
        id: 4,
        name: "Ký số bằng HSM"
      }
    ]

    this.dropdownSignTypeSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Chọn tất cả",
      unSelectAllText: "Bỏ chọn tất cả",
      allowSearchFilter: true
    };
  }

  // gán lại dữ liệu value cho form
  setUserViews(data: any) {
    const fa = (this.userForm.get('userViews') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));
    }
  }

  setUserSigns(data: any) {
    const fa = (this.userForm.get('userSigns') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));


      // const faC:any = (fa.at(i).get('signType') as FormGroup);
      // // // console.log(fa);
      // // // console.log(faC);
      // // // console.log(faC);
      // // //const faAAA:any = (faC as FormArray);
      // // // console.log(faAAA);
      // for (let j = 0; j < faC.length; j++) {
      //     faC.push(this.formBuilder.array(faC[j]));
      // }

      // console.log(faC);


    }
  }

  setUserDocs(data: any) {
    const fa = (this.userForm.get('userDocs') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));
    }
  }

  setPartnerDocs(data: any) {
    const fa = (this.partners.get('partnerDocs') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));
    }
  }

  setPartnerLeads(data: any, index: any) {
    //const fa = (this.partnerArrs().at(index).get('partnerLeads') as FormArray);
    const fa = (this.partners.get('partnerLeads') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));
    }
  }

  setPartnerSign(data: any) {
    const fa = (this.partners.get('partnerSigns') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));
    }
  }

  setPartnerUser(data: any) {
    const fa = (this.partners.get('partnerUsers') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));
    }
  }

  setPartnerViews(data: any) {
    const fa = (this.partners.get('partnerViews') as FormArray);
    for (let i = 0; i < data.length; i++) {
      fa.push(this.formBuilder.group(data[i]));
    }
  }

  setPartnerArrs(data: any) {
    const partnerArrs = (this.partnerForm.get("partnerArrs") as FormArray);
    console.log("data" + data);
    for (let i = 0; i < data.length; i++) {

      const partnerLeads = (partnerArrs.at(i)?.get('partnerLeads') as FormArray) || [];
      for (let j = 0; j < data[i].partnerLeads.length; j++) {
        partnerLeads.push(this.formBuilder.group(data[i].partnerLeads[j]));
      }

      const partnerViews = (partnerArrs.at(i)?.get('partnerViews') as FormArray) || [];
      for (let j = 0; j < data[i].partnerViews.length; j++) {
        partnerViews.push(this.formBuilder.group(data[i].partnerViews[j]));
      }

      const partnerSigns = (partnerArrs.at(i)?.get('partnerSigns') as FormArray) || [];
      for (let j = 0; j < data[i].partnerSigns.length; j++) {
        partnerSigns.push(this.formBuilder.group(data[i].partnerSigns[j]));
      }

      const partnerDocs = (partnerArrs.at(i)?.get('partnerDocs') as FormArray) || [];
      for (let j = 0; j < data[i].partnerDocs.length; j++) {
        partnerDocs.push(this.formBuilder.group(data[i].partnerDocs[j]));
      }

      const partnerUsers = (partnerArrs.at(i)?.get('partnerUsers') as FormArray) || [];
      for (let j = 0; j < data[i].partnerUsers.length; j++) {
        partnerUsers.push(this.formBuilder.group(data[i].partnerUsers[j]));
      }
    }

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


  partnerArrs(): FormArray {
    return this.partnerForm.get("partnerArrs") as FormArray
  }

  newPartner(): FormGroup {
    return this.partners = this.formBuilder.group({
      order: 1,
      type: 1,
      name: ['', Validators.required],
      partnerLeads: this.formBuilder.array([]),
      partnerViews: this.formBuilder.array([]),
      partnerSigns: this.formBuilder.array([]),
      partnerDocs: this.formBuilder.array([]),

      partnerUsers: this.formBuilder.array([]),
    })
  }

  // addPartner() {
  //   this.partnerArrs().push(this.newPartner());
  // }

  //dropdown contract type
  get getSignTypeItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  name = 'Angular';

  //user view
  userViews(): FormArray {
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

  removeUserView(i: number) {
    this.userViews().removeAt(i);
  }

  //user sign
  userSigns(): FormArray {
    //console.log((this.userForm.get("userSigns") as FormArray).value)
    return this.userForm.get("userSigns") as FormArray
  }

  newUserSign(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
      isOtp: true,
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      id: '',
    })
  }

  addUserSign() {
    this.userSigns().push(this.newUserSign());
  }

  removeUserSign(i: number) {
    this.userSigns().removeAt(i);
  }

  //user document
  userDocs(): FormArray {
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
    this.userDocs().push(this.newUserDoc());
  }

  removeUserDoc(i: number) {
    this.userDocs().removeAt(i);
  }

  //partner
  partners: FormGroup;

  //user partner lead
  partnerLeads(a: number): FormArray {
    return this.partnerArrs().at(a).get("partnerLeads") as FormArray
  }

  newPartnerLead(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  addPartnerLead(a: number) {
    this.partnerLeads(a).push(this.newPartnerLead());
  }

  removePartnerLead(a: number, i: number) {
    this.partnerLeads(a).removeAt(i);
  }

  //partner view
  partnerViews(a: number): FormArray {
    return this.partnerArrs().at(a).get("partnerViews") as FormArray
  }

  newPartnerView(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  addPartnerView(a: number) {
    this.partnerViews(a).push(this.newPartnerView());
  }

  removePartnerView(a: number, i: number) {
    this.partnerViews(a).removeAt(i);
  }

  //partner sign
  partnerSigns(a: number): FormArray {
    return this.partnerArrs().at(a).get("partnerSigns") as FormArray
  }

  newPartnerSign(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
      isOtp: true,
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      id: ''
    })
  }

  addPartnerSign(a: number) {
    this.partnerSigns(a).push(this.newPartnerSign());
  }

  removePartnerSign(a: number, i: number) {
    this.partnerSigns(a).removeAt(i);
  }

  //partner document
  partnerDocs(a: number): FormArray {
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

  addPartnerDoc(a: number) {
    this.partnerDocs(a).push(this.newPartnerDoc());
  }

  removePartnerDoc(a: number, i: number) {
    this.partnerDocs(a).removeAt(i);
  }

  //partner user (ca nhan)
  partnerUsers(a: number): FormArray {
    return this.partnerArrs().at(a).get("partnerUsers") as FormArray
  }

  newPartnerUser(): FormGroup {
    return this.formBuilder.group({
      order: 1,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      signType: ['', Validators.required],
      isOtp: true,
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
    })
  }

  addPartnerUser(a: number) {
    this.partnerUsers(a).push(this.newPartnerUser());
  }

  removePartnerUser(a: number, i: number) {
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
    this.submitted = true;
    // if (!this.validData()) return;
    // else {
      // gán value step 2 vào datas
      // this.datas.userForm = this.userForm.value;
      // if (this.datas.userForm.userSigns && this.datas.userForm.userSigns.length > 0) {
      //   this.datas.userForm.userSigns.forEach((item: any) => {
      //     item['id'] = Helper._ranDomNumberText(10);
      //   })
      // }
      //
      // this.datas.partnerForm = this.partnerForm.value;
      // if (this.datas.partnerForm.partnerArrs && this.datas.partnerForm.partnerArrs.length > 0) {
      //   this.datas.partnerForm.partnerArrs.forEach((element: any) => {
      //     if (element.partnerSigns && element.partnerSigns.length > 0) {
      //       element.partnerSigns.forEach((item: any) => {
      //         item['id'] = Helper._ranDomNumberText(10);
      //       })
      //     }
      //     if (element.partnerUsers && element.partnerUsers.length > 0) {
      //       element.partnerUsers.forEach((items: any) => {
      //         items['id'] = Helper._ranDomNumberText(10);
      //       })
      //     }
      //   })
      // }

      this.is_determine_clone.forEach((element: any, index: number) => {
          element.recipients.forEach((item: any) =>{
            if (item.role == 3 || item.role == 4) {
              item['id'] = Helper._ranDomNumberText(10);
            }
          })
      })

      console.log(this.is_determine_clone);

      this.datas.determine_contract = this.is_determine_clone;
      this.step = variable.stepSampleContract.step3;
      this.datas.stepLast = this.step
      // console.log(this.datas);
      this.nextOrPreviousStep(this.step);
    // }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeDetermineSigner.emit(step);
  }

  // valid data step 2
  validData() {
    if (this.userForm.invalid) {
      console.log('vui lòng nhập đầy đủ dữ liệu userForm');
      return false;
    }
    if (this.partnerForm.invalid) {
      console.log('Vui lòng nhập đầy đủ dữ liệu partnerForm');
      return false;
    }
    return true;
  }

  // BEGIN DATA

  getOriganzationTypeSign(e: any, name_type_sign: string, data?: any, index?: any) {
    // let data_select = this.signTypeList.filter((p: any) => p.id == e);
    let data_select: any[] = [];
    this.signTypeList.forEach((element: any) => {
      e.forEach((item: any) => {
        if (element.id == item) {
          data_select.push(element);
        }
      })
    })
    if (name_type_sign == 'is_origanzation_document') {
      this.is_origanzation_document.sign_type = data_select;
    } else if (name_type_sign == 'is_origanzation_signature' || name_type_sign == 'get_partner_signature' && data) {
      data[index].sign_type = data_select;
    } else if (name_type_sign == 'get_partner_document') {
      data.sign_type = data_select;
    }
  }

  getValueData(data: any, index: any) {
    return [
      {id: 1, name: 'Ký ảnh'},
      {id: 2, name: 'Ký số'}
    ]
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }

  changePartner(e: any, number_type: number, item: any) {
    console.log(e);
    this.getDataPartner(number_type);
  }

  isOriganzationReviewer() {
    return (this.is_determine_clone.filter((p: any) => p.type == 1)[0]).recipients.filter((p: any) => p.role == 1);
  }

  isOriganzationSignature() {
    return (this.is_determine_clone.filter((p: any) => p.type == 1)[0]).recipients.filter((p: any) => p.role == 3);
  }

  // recipients.filter((p: any) => p.role == 1)

  getOrganization() {
    return this.is_determine_clone.filter((p: any) => p.type == 1)[0];
  }


  getDataPartner(number_type?: number, name?: string) {
    let data = [...this.is_determine_clone];
    return data.filter((p: any) => p.type == 2);
  }

  getPartnerCoordination(item: any) {
    return item.recipients.filter((p: any) => p.role == 2)
  }

  getPartnerReviewer(item: any) {
    return item.recipients.filter((p: any) => p.role == 1)
  }

  getPartnerSignature(item: any) {
    return item.recipients.filter((p: any) => p.role == 3)
  }

  getPartnerDocument(item: any) {
    return item.recipients.filter((p: any) => p.role == 4)[0];
  }


  addOriganzationReviewer() {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_organization = data_determine_add.filter((p: any) => p.type == 1)[0];
    let data = (data_organization.recipients.filter((p: any) => p.role == 1))[0];
    data.ordering = this.is_origanzation_reviewer.length + 1;
    this.is_origanzation_reviewer.push(data)
  }

  addOriganzationSignature() {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_organization = data_determine_add.filter((p: any) => p.type == 1)[0];
    let data = (data_organization.recipients.filter((p: any) => p.role == 3))[0];
    data.ordering = this.is_origanzation_signature.length + 1;
    this.is_origanzation_signature.push(data);
    // this.is_determine_clone.forEach((p: any) => {
    //   if (p.type == 1) {
    //     p.recipients.push(data);
    //   }
    // })
  }

  addPartnerReviewer(item: any) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => p.type == 2)[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 1))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 1);
    data.ordering = count_data.length + 1;
    this.data_parnter_organization.forEach((element: any, index: number) => {
      element.recipients.push(data);
    })
  }

  addPartnerSignature(item: any) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => p.type == 2)[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 3))[0];
    // let count_data = this.getPartnerSignature(item)
    let count_data = item.recipients.filter((p: any) => p.role == 3);
    data.ordering = count_data.length + 1;
    // this.is_determine_clone.forEach((element: any, index: number) => {
    //   if (index == item.ordering) {
    //     element.recipients.push(data)
    //   }
    // })
    this.data_parnter_organization.forEach((element: any, index: number) => {
      element.recipients.push(data);
    })
  }

  deleteOriganzationReviewer(i: any) {
    // this.is_determine_clone.forEach((p: any) => {
    //   if (p.type == 1) {
    //     p.recipients.splice(i, 1);
    //     p.recipients.forEach((element:any, index: any) => {
    //       if (element.role == 1) {
    //         element.ordering = index + 1;
    //       }
    //     })
    //   }
    // })
    this.is_origanzation_reviewer.splice(i, 1);
    this.is_origanzation_reviewer.forEach((element: any, index: any) => {
      element.ordering = index + 1;
    })
  }

  deleteOriganzationSignature(index: any) {
    this.is_origanzation_signature.splice(index, 1);
    this.is_origanzation_signature.forEach((element: any, index: any) => {
      element.ordering = index + 1;
    })
  }

  deletePartnerCoordination(index: any, item: any) {
    this.getPartnerCoordination(item).splice(index, 1);
    this.getPartnerCoordination(item).forEach((element: any, index: any) => {
      element.ordering = index + 1;
    })
  }

  deletePartnerReviewer(index_item: any, item: any) {
    let arr_clone = item.recipients.filter((p: any) => p.role == 1);
    let arr_clone_different = item.recipients.filter((p: any) => p.role != 1);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    arr_clone.forEach((element: any, index: number) => {
      if (index != index_item) {
        array_empty.push(element);
      }
    })
    array_empty.forEach((item: any, index: number) => {
      item.ordering = index + 1;
    })
    new_arr = arr_clone_different.concat(array_empty);
    item.recipients = new_arr;
  }

  deletePartnerSignature(index_item: any, item: any) {
    // this.getPartnerSignature(item).splice(index, 1);
    // this.getPartnerSignature(item).forEach((element: any, index: any) => {
    //   element.ordering = index + 1;
    // })

    let arr_clone = item.recipients.filter((p: any) => p.role == 3);
    let arr_clone_different = item.recipients.filter((p: any) => p.role != 3);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    arr_clone.forEach((element: any, index: number) => {
      if (index != index_item) {
        array_empty.push(element);
      }
    })
    array_empty.forEach((item: any, index: number) => {
      item.ordering = index + 1;
    })
    new_arr = arr_clone_different.concat(array_empty);
    item.recipients = new_arr;
  }

  addPartner() {
    let data_partner_add = [];
    let data = [...this.contractService.getDataDetermine()];
    // return data.filter((p: any) => p.type == 2);
    data_partner_add = data.filter((p: any) => p.type == 2);
    let count_data = data_partner_add[0];
    count_data.ordering = data_partner_add.length + 1;
    // this.is_determine_clone.push(count_data);
    this.data_parnter_organization.push(count_data);
  }

  // getDataAll() {
  //   console.log(this.is_determine_clone);
  //   console.log(this.data_organization);
  //   console.log(this.data_parnter_organization);
  // }

}
