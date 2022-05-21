import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  type_signature,
  type_signature_doc,
  type_signature_personal_party,
  variable
} from "../../../../../../../config/variable";
import {Helper} from "../../../../../../../core/Helper";
import {ContractService} from "../../../../../../../service/contract.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../../../../service/toast.service";
import {Router} from "@angular/router";
import {parttern} from "../../../../../../../config/parttern";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-determine-signer',
  templateUrl: './determine-signer.component.html',
  styleUrls: ['./determine-signer.component.scss']
})
export class DetermineSignerComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeDetermineSigner = new EventEmitter<string>();
  @ViewChild("abcd") fieldAbcd: any;
  determine_step = false;
  determineDetails!: FormGroup;
  userForm: FormGroup;
  partnerForm: FormGroup
  submitted = false;
  data_organization: any;
  data_parnter_organization: any = [];
  data_parnter_individual: any = [];

  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = {};
  checked: boolean = true;
  checkedChange: any = [];
  pattern = parttern;

  is_determine_clone: any;
  toppings = new FormControl();

  //dropdown
  signTypeList: Array<any> = type_signature;
  signTypeList_personal_partner: Array<any> =  type_signature_personal_party;
  signType_doc: Array<any> = type_signature_doc;

  dropdownSignTypeSettings: any = {};
  getNameIndividual: string = "";
  is_change_party: boolean = false;


  //dropdown
  get determineContract() {
    return this.determineDetails.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.step = variable.stepSampleContract.step2
    //this.datas.determineDetails = this.determineDetails;
  }

  ngOnInit(): void {
    // console.log(this.datas.determine_contract);
    if (this.datas.determine_contract)
      this.is_determine_clone = [this.datas.determine_contract];
    else
      this.is_determine_clone = [...this.contractService.getDataDetermine()];
    // data Tổ chức của tôi

    if (this.is_determine_clone && this.is_determine_clone.type == 1) {
      this.data_organization = this.is_determine_clone.filter((p: any) => p.type == 1)[0];
      // this.data_organization = this.is_determine_clone;
      this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
      this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
      this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);
    }

    // data đối tác
    if (this.is_determine_clone.type == 3) {
      this.data_parnter_organization = this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
    }

    // this.data_parnter_individual = this.is_determine_clone.filter((p: any) => p.type == 3);

    this.dropdownSignTypeSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      // selectAllText: "Chọn tất cả",
      // unSelectAllText: "Bỏ chọn tất cả",
      enableCheckAll: false,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      limitSelection: 2,
      disabledField: 'item_disable',
    };

    if (this.is_determine_clone.some((p: any) => p.type == 3)) this.is_change_party = true;
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // console.log(changes);
  //   if (this.saveDraftStep) {
  //     this.getApiDetermine();
  //   }
  // }

  //dropdown contract type
  get getSignTypeItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.datas.step = step;
    // this.nextOrPreviousStep(step);
  }

  next() {
    if (!this.validData()) return;
    else
      this.getApiDetermine();
  }

  getApiDetermine() {
    this.is_determine_clone.forEach((items: any, index: number) => {
      if (items.type == 3) {
        let data = items.recipients.filter((p: any) => p.role == 3);
        this.is_determine_clone[index].recipients = data;
      }
    })
    this.spinner.show();
    this.contractService.getContractDetermineCoordination(this.is_determine_clone[0], this.datas.determine_contract.id).subscribe((res: any) => {
        this.datas.determine_contract = res ? res : this.is_determine_clone;
        this.step = variable.stepSampleContract.step3;
        this.datas.stepLast = this.step
        this.nextOrPreviousStep(this.step);
      },
      (res: any) => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout(res.error, "", 3000);
      }, () => {
        this.spinner.hide();
      }
    );
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeDetermineSigner.emit(step);
  }

  getData(item: any) {
    console.log(item)
  }

  // valid data step 2
  validData() {
    let count = 0;
    let dataArrPartner = [];
    dataArrPartner = this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
    for (let i = 0; i < dataArrPartner.length; i++) {
      if (!dataArrPartner[i].recipients.some((p: any) => p.role == 3)) {
        this.getNotificationValid("Vui lòng chọn người ký của đối tác!");
        count++;
        break;
      }
    }

    // validate phía đối tác
    for (let j = 0; j < dataArrPartner.length; j++) {
      for (let k = 0; k < dataArrPartner[j].recipients.length; k++) {
        if (dataArrPartner[j].type != 3) {
          if (!dataArrPartner[j].name) {
            this.getNotificationValid("Vui lòng nhập tên của đối tác tổ chức!")
            count++;
            break;
          }

          if (!dataArrPartner[j].recipients[k].name) {
            this.getNotificationValid("Vui lòng nhập tên" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác!")
            count++;
            break;
          }
          if (!dataArrPartner[j].recipients[k].email) {
            this.getNotificationValid("Vui lòng nhập email" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác!")
            count++;
            break;
          }

          if (dataArrPartner[j].recipients[k].sign_type.length == 0 && [3, 4].includes(dataArrPartner[j].recipients[k].role)) {
            this.getNotificationValid("Vui lòng chọn loại ký" + this.getNameObject(dataArrPartner[j].recipients[k].role) + "của đối tác!")
            count++;
            break;
          } else if (dataArrPartner[j].recipients[k].sign_type.length > 0 && [3, 4].includes(dataArrPartner[j].recipients[k].role)) {
            let isPartnerOriganzationDuplicate = [];
            isPartnerOriganzationDuplicate = dataArrPartner[j].recipients[k].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
            if (isPartnerOriganzationDuplicate.length > 1) {
              this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số" + this.getNameObject(dataArrPartner[j].recipients[k].role) + "của đối tác!")
              count++;
              break;
            }
            isPartnerOriganzationDuplicate = [];
          }

          if (!dataArrPartner[j].recipients[k].phone && dataArrPartner[j].recipients[k].role == 3 && (dataArrPartner[j].recipients[k].is_otp || dataArrPartner[j].recipients[k].is_otp == 1)) {
            this.getNotificationValid("Vui lòng nhập số điện thoại của" + this.getNameObject(3) + "của đối tác!")
            count++;
            break;
          }

          if (dataArrPartner[j].recipients[k].email && !this.pattern.email.test(dataArrPartner[j].recipients[k].email)) {
            this.getNotificationValid("Email" + this.getNameObject(3) + "của đối tác không hợp lệ!")
            count++;
            break;
          }

        } else if (dataArrPartner[j].type == 3) {
          if (!dataArrPartner[j].recipients[k].name && dataArrPartner[j].recipients[k].role == 3) {
            this.getNotificationValid("Vui lòng nhập tên" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác cá nhân!")
            count++;
            break;
          }
          if (!dataArrPartner[j].recipients[k].email && dataArrPartner[j].recipients[k].role == 3) {
            this.getNotificationValid("Vui lòng nhập email" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác cá nhân!")
            count++;
            break;
          }

          if (dataArrPartner[j].recipients[k].sign_type.length == 0 && [3, 4].includes(dataArrPartner[j].recipients[k].role) && dataArrPartner[j].recipients[k].role == 3) {
            this.getNotificationValid("Vui lòng chọn loại ký của" + this.getNameObject(dataArrPartner[j].recipients[k].role) + "của đối tác cá nhân!")
            count++;
            break;
          } else if (dataArrPartner[j].recipients[k].sign_type.length > 0 && [3, 4].includes(dataArrPartner[j].recipients[k].role) && dataArrPartner[j].recipients[k].role == 3) {
            let isPartnerCaNhanDuplicate = [];
            isPartnerCaNhanDuplicate = dataArrPartner[j].recipients[k].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
            if (isPartnerCaNhanDuplicate.length > 1) {
              this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số" + this.getNameObject(dataArrPartner[j].recipients[k].role) + "của đối tác cá nhân!")
              count++;
              break;
            }
            isPartnerCaNhanDuplicate = [];
          }

          // if (!dataArrPartner[j].recipients[k].phone &&
          //   dataArrPartner[j].recipients[k].role == 3 &&
          //   (dataArrPartner[j].recipients[k].is_otp || dataArrPartner[j].recipients[k].is_otp == 1)) {
          //   this.getNotificationValid("Vui lòng nhập số điện thoại" + this.getNameObject(3) + "của đối tác!")
          //   count++;
          //   break;
          // }

          // if (dataArrPartner[j].recipients[k].name && !this.pattern.name.test(dataArrPartner[j].recipients[k].name && dataArrPartner[j].recipients[k].role == 3)) {
          //   this.getNotificationValid("Tên" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " đối tác cá nhân không hợp lệ!");
          //   count++;
          //   break;
          // }
          if (dataArrPartner[j].recipients[k].email && !this.pattern.email.test(dataArrPartner[j].recipients[k].email) && dataArrPartner[j].recipients[k].role == 3) {
            this.getNotificationValid("Email" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác cá nhân không hợp lệ!")
            count++;
            break;
          }
          // if (dataArrPartner[j].recipients[k].phone && !this.pattern.phone.test(dataArrPartner[j].recipients[k].phone)) {
          //   this.getNotificationValid("Số điện thoại" + this.getNameObject(3) + "của đối tác không hợp lệ!")
          //   count++;
          //   break;
          // }
        }
      }
    }

    if (count == 0) {
      if (this.getCheckDuplicateEmail('only_party_partner', dataArrPartner)) {
        this.getNotificationValid("Email đối tác không được trùng nhau!");
        return false
      }
    }

    // if (count == 0) {
    //   if (this.getCheckDuplicateEmail('allCheckEmail', this.is_determine_clone)) {
    //     this.getNotificationValid("Email không được trùng nhau giữa các bên tham gia!");
    //     return false
    //   }
    // }

    if (count > 0) {
      return false;
    }
    return true;
  }

  getCheckDuplicateEmail(isParty: string, dataValid?: any) {
    let arrCheckEmail = [];
    // valid email đối tác và các bên tham gia
    if (isParty != 'only_party_origanzation') {
      let arrEmail = [];
      for (let i = 0; i < dataValid.length; i++) {
        const element = dataValid[i].recipients;
        for (let j = 0; j < element.length; j++) {
          if (element[j].email) {
            let items = {
              email: element[j].email,
              role: element[j].role
            }
            // arrCheckEmail.push(element[j].email);
            arrEmail.push(items);
          }
        }
      }

      if (arrEmail.some((p: any) => p.role == 1) && arrEmail.some((p: any) => p.role == 3)) {
        arrEmail = arrEmail.filter((p: any) => p.role != 1);
      }

      arrEmail.forEach((items: any) => {
        arrCheckEmail.push(items.email)
      })

    } else {
      // valid email tổ chức của tôi
      for (let i = 0; i < dataValid.length; i++) {
        if (dataValid[i].email) {
          arrCheckEmail.push(dataValid[i].email);
        }
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckEmail.length; ++k) {
      var value = arrCheckEmail[k];
      if (value in valueSoFar) {
        return true;
      }
      valueSoFar[value] = true;
    }
    return false;
  }

  getNotificationValid(is_notify: string) {
    this.spinner.hide();
    this.toastService.showErrorHTMLWithTimeout(is_notify, "", 3000);
  }

  getNameObject(role_numer: number) {
    switch (role_numer) {
      case 1:
        return ' người điều phối ';
        break;
      case 2:
        return ' người xem xét ';
        break;
      case 3:
        return ' người ký ';
        break;
      case 4:
        return ' văn thư ';
        break;
      default:
        return '';
        break;
    }
  }

  // BEGIN DATA

  get getContractConnectItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  getDataSignature(e: any) {
    console.log(e)
  }

  getValueData(data: any, index: any) {
    return [
      {id: 1, name: 'Ký ảnh'},
      {id: 2, name: 'Ký số'}
    ]
  }

  changePartner(e: any, number_type: number, item: any) {
    this.getDataPartner(number_type);
  }

// tạo mảng đối tác
  getDataPartner(number_type?: number, name?: string) {
    let data = [...this.is_determine_clone];
    return data.filter((p: any) => (p.type == 2 || p.type == 3));
  }

  getOriganzationDocument() {
    return this.data_organization.recipients.filter((p: any) => p.role == 4)
  }

  // tạo đối tượng người điều phối đối tác
  getPartnerCoordination(item: any) {
    return item.recipients.filter((p: any) => p.role == 1)
  }

  // tạo đối tượng đ
  getPartnerSignatureIndividual() {

  }

  // tạo mảng người xem xét đối tác
  getPartnerReviewer(item: any) {
    return item.recipients.filter((p: any) => p.role == 2)
  }

  getName(e: any, item: any) {
    this.getNameIndividual = e.target.value;
    item.name = e.target.value;

  }

  // tạo mảng người ký đối tác tổ chức
  getPartnerSignature(item: any) {
    return item.recipients.filter((p: any) => p.role == 3)
  }

  // tạo mảng đối tượng văn thư tổ chức của tôi
  getPartnerDocument(item: any) {
    return item.recipients.filter((p: any) => p.role == 4);
  }

  // thêm đối tượng người xem xét tổ chức của tôi
  addOriganzationReviewer() {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_organization = data_determine_add.filter((p: any) => p.type == 1)[0];
    let data = (data_organization.recipients.filter((p: any) => p.role == 2))[0];
    data.ordering = this.getOriganzationReviewer().length + 1;
    this.data_organization.recipients.push(data)
  }

  // thêm đối tượng ký tổ chức của tôi
  addOriganzationSignature() {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_organization = data_determine_add.filter((p: any) => p.type == 1)[0];
    let data = (data_organization.recipients.filter((p: any) => p.role == 3))[0];
    data.ordering = this.getOriganzationSignature().length + 1;
    this.data_organization.recipients.push(data);
  }

  addOriganzationDocument() {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_organization = data_determine_add.filter((p: any) => p.type == 1)[0];
    let data = (data_organization.recipients.filter((p: any) => p.role == 4))[0];
    data.ordering = this.getOriganzationDocument().length + 1;
    this.data_organization.recipients.push(data);
  }

  // thêm đối tượng người xem xét đối tác (done)
  addPartnerReviewer(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => p.type == 2)[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 2))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 2);
    data.ordering = count_data.length + 1;
    // this.data_parnter_organization[index].recipients.push(data);
    (this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  // thêm đối tượng người điều phối (done)
  addPartnerCoordination(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => p.type == 2)[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 1))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 1);
    data.ordering = count_data.length + 1;
    // this.data_parnter_organization[index].recipients.push(data);
    (this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  // thêm đối tượng ký đối tác (done)
  addPartnerSignature(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => (p.type == 2))[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 3))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 3);
    data.ordering = count_data.length + 1;
    (this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  // thêm đối tượng văn thư đối tác (done)
  addPartnerDocument(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => (p.type == 2))[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 4))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 4);
    data.ordering = count_data.length + 1;
    (this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  // tạo mảng đối tượng người xem xét tổ chức của tôi
  getOriganzationReviewer() {
    return this.data_organization.recipients.filter((p: any) => p.role == 2);
  }

  // xóa đối tượng người xem xét tổ chức của tôi (done)
  deleteOriganzationReviewer(i: any) {
    let arr_clone = this.data_organization.recipients.filter((p: any) => p.role == 2);
    let arr_clone_different = this.data_organization.recipients.filter((p: any) => p.role != 2);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    if (arr_clone[i].fields && arr_clone[i].fields.length > 0 && !this.deleteElement(arr_clone[i], 'người xem xét tổ chức')) {
      return;
    }
    arr_clone.forEach((element: any, index: number) => {
      if (index != i) {
        array_empty.push(element);
      }
    })
    array_empty.forEach((item: any, index: number) => {
      item.ordering = index + 1;
    })
    new_arr = arr_clone_different.concat(array_empty);
    this.data_organization.recipients = new_arr;
  }

  // tạo mảng các đối tượng người ký tổ chức của tôi
  getOriganzationSignature() {
    return this.data_organization.recipients.filter((p: any) => p.role == 3);
  }

  // xóa đối tượng người ký tổ chức của tôi (done)
  deleteOriganzationSignature(i: any) {
    let arr_clone = this.data_organization.recipients.filter((p: any) => p.role == 3);
    let arr_clone_different = this.data_organization.recipients.filter((p: any) => p.role != 3);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    if (arr_clone[i].fields && arr_clone[i].fields.length > 0 && !this.deleteElement(arr_clone[i], 'người ký tổ chức')) {
      return;
    }
    arr_clone.forEach((element: any, index: number) => {
      if (index != i) {
        array_empty.push(element);
      }
    })
    array_empty.forEach((item: any, index: number) => {
      item.ordering = index + 1;
    })
    new_arr = arr_clone_different.concat(array_empty);
    this.data_organization.recipients = new_arr;
  }

  // xóa văn thư tổ chức của tôi (done)
  deleteOriganzationDocument(i: any) {
    let arr_clone = this.data_organization.recipients.filter((p: any) => p.role == 4);
    let arr_clone_different = this.data_organization.recipients.filter((p: any) => p.role != 4);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    if (arr_clone[i].fields && arr_clone[i].fields.length > 0 && !this.deleteElement(arr_clone[i], 'văn thư tổ chức')) {
      return;
    }
    arr_clone.forEach((element: any, index: number) => {
      if (index != i) {
        array_empty.push(element);
      }
    })
    array_empty.forEach((item: any, index: number) => {
      item.ordering = index + 1;
    })
    new_arr = arr_clone_different.concat(array_empty);
    this.data_organization.recipients = new_arr;
  }

  // xóa đối tượng điều phối hợp đồng (done)
  deletePartnerCoordination(index_item: any, item: any, id: number) {
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

  // xóa đối tượng người xem xét đối tác
  deletePartnerReviewer(index_item: any, item: any, id: number) {
    let arr_clone = item.recipients.filter((p: any) => p.role == 2);
    let arr_clone_different = item.recipients.filter((p: any) => p.role != 2);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    if (arr_clone[index_item].fields && arr_clone[index_item].fields.length > 0 && !this.deleteElement(arr_clone[index_item], 'người xem xét đối tác')) {
      return;
    }
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

  // xóa đối tượng người ký đối tác
  deletePartnerSignature(index_item: any, item: any) {
    let arr_clone = item.recipients.filter((p: any) => p.role == 3);
    let arr_clone_different = item.recipients.filter((p: any) => p.role != 3);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    if (arr_clone[index_item].fields && arr_clone[index_item].fields.length > 0 && !this.deleteElement(arr_clone[index_item], 'người ký đối tác')) {
      return;
    }
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

  deletePartnerDocument(index_item: any, item: any) {
    let arr_clone = item.recipients.filter((p: any) => p.role == 4);
    let arr_clone_different = item.recipients.filter((p: any) => p.role != 4);
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    if (arr_clone[index_item].fields && arr_clone[index_item].fields.length > 0 && !this.deleteElement(arr_clone[index_item], 'văn thư đối tác')) {
      return;
    }
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

  dataParnterOrganization() {
    // return this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
    return this.is_determine_clone;
  }

  // thêm đối tác
  addPartner() {
    let data_partner_add = {};
    let data = [...this.contractService.getDataDetermine()];
    data_partner_add = data.filter((p: any) => (p.type == 2))[0];
    this.is_determine_clone.push(data_partner_add);
    this.is_determine_clone.forEach((res: any, index: number) => {
      res.ordering = index + 1;
    })

    console.log(this.data_parnter_organization);
  }

  // xóa đối tượng tham gia bên đối tác
  deletePartner(index: any) {
    this.is_determine_clone.splice(index, 1);
    this.is_determine_clone.forEach((res: any, index: number) => {
      res.ordering = index + 1;
    })
  }

  changeData(item: any, index: any) {
    // this.checkedChange[index]['name'] = name;
    let data_partner_add = {};
    let data = [...this.contractService.getDataDetermine()];
    data_partner_add = data.filter((p: any) => p.type == item.type)[0];
    this.data_parnter_organization[index] = data_partner_add;
  }

  changeType(e: any, item: any, index: number) {
    // console.log(item, e);
    item.name = "";
    let newArr: any[] = [];
    for (let i = 0; i < item.recipients.length; i++) {
      if (!newArr.some((p: any) => p.role == item.recipients[i].role)) {
        newArr.push(item.recipients[i]);
      }
    }
    if (newArr.length) {
      newArr.forEach((item: any) => {
        if (item.role == 3) {
          item.name = "";
          item.email = "";
          item.phone = "";
          item.role = 3; // người ký
          item.ordering = 1;
          item.status = 0;
          // item.username = "";
          // item.password = "";
          item.is_otp = 1;
          item.sign_type = [];
        }
      })
    }
    this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3)[index].recipients = newArr;

    if (item.type == 3) {
      this.data_organization.ordering = 2;
      item.ordering = 1;
      this.is_change_party = true;
    } else {
      this.data_organization.ordering = 1;
      item.ordering = 2;
      this.is_change_party = false;
    }
  }

  deleteElement(dataArrClone: any, assignElement: string) {
    this.spinner.show();
    let count = 0;
    this.contractService.deleteInfoContractSignature(dataArrClone.fields[0].id).subscribe((res: any) => {
      this.toastService.showSuccessHTMLWithTimeout(`Bạn đã xóa ${assignElement} ${dataArrClone.name}!`, "", "3000");
    }, (error: HttpErrorResponse) => {
      this.toastService.showSuccessHTMLWithTimeout(`Đã xảy ra lỗi!`, "", "3000");
      this.spinner.hide();
      count = 1;
    }, () => {
      this.spinner.hide();
    })

    if (count == 0)
      return true
    else return false;
  }

}
