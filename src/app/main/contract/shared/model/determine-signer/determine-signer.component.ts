import {ContractService} from 'src/app/service/contract.service';
import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {type_signature, variable} from "../../../../../config/variable";
import {FormArray, FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {Helper} from "../../../../../core/Helper";
// import {ContractService} from "../../../../../service/contract.service";
import * as ContractCreateDetermine from '../../contract_data'
import {elements} from "@interactjs/snappers/all";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../../service/toast.service";

@Component({
  selector: 'app-determine-signer',
  templateUrl: './determine-signer.component.html',
  styleUrls: ['./determine-signer.component.scss']
})
export class DetermineSignerComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  @Output() stepChangeDetermineSigner = new EventEmitter<string>();
  @Output('dataStepContract') dataStepContract = new EventEmitter<Array<any>>();
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

  is_determine_clone: any;
  toppings = new FormControl();


  //dropdown
  signTypeList: Array<any> = type_signature;
  dropdownSignTypeSettings: any = {};

  get determineContract() {
    return this.determineDetails.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService
  ) {
    this.step = variable.stepSampleContract.step2
    //this.datas.determineDetails = this.determineDetails;
  }


  ngOnInit(): void {
    if (this.datas.determine_contract)
      this.is_determine_clone = this.datas.determine_contract
    else
      this.is_determine_clone = [...this.contractService.getDataDetermine()];
    // data Tổ chức của tôi
    this.data_organization = this.is_determine_clone.filter((p: any) => p.type == 1)[0];
    this.data_organization.name = this.datas.name_origanzation ? this.datas.name_origanzation : '';
    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);

    // data đối tác
    this.data_parnter_organization = this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
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
  }

  //dropdown contract type
  get getSignTypeItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
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
    if (!this.validData()) return;
    else {
      this.is_determine_clone.forEach((items: any, index: number) => {
        if (items.type == 3) {
          let data = items.recipients.filter((p: any) => p.role == 3);
          this.is_determine_clone[index].recipients = data;
        }
      })
      this.contractService.getContractDetermine(this.is_determine_clone, this.datas.id).subscribe((res: any) => {
          // this.datas.id = data?.id;
          // console.log(res);
          this.datas.determine_contract = res ? res : this.is_determine_clone;
          this.step = variable.stepSampleContract.step3;
          this.datas.stepLast = this.step
          this.nextOrPreviousStep(this.step);
        },
        (res: any) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout(res.error, "", 10000);
        }
      );
    }
  }

  saveDataStep(datas: any) {

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
    let dataArr = [];
    dataArr = this.data_organization.recipients;

    for (let i = 0; i < dataArr.length; i++) {
      if (!dataArr[i].name) {
        this.spinner.hide();
        // @ts-ignore
        // document.getElementById("signature-origanzation-" + element.ordering).focus();
        this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập tên" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!", "", 10000);
        count++;
        break;
      }
      if (!dataArr[i].email) {
        this.spinner.hide();
        // @ts-ignore
        // document.getElementById("signature-origanzation-" + element.ordering).focus();
        this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập email" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!", "", 10000);
        count++;
        break;
      }

      if (dataArr[i].sign_type.length == 0 && dataArr[i].role != 2) {
        this.spinner.hide();
        // @ts-ignore
        this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn loại ký của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!", "", 10000);
        count++;
        break;
      }

      if (!dataArr[i].phone && dataArr[i].role == 3 && (dataArr[i].is_otp || dataArr[i].is_otp == 1)) {
        this.spinner.hide();
        // @ts-ignore
        this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập số điện thoại của" + this.getNameObject(3) + "tổ chức của tôi!", "", 10000);
        count++;
        break;
      }
    }

    if (count == 0) {
      // validate phía đối tác
      let dataArrPartner = [];
      dataArrPartner = this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
      for (let j = 0; j < dataArrPartner.length; j++) {
        for (let k = 0; k < dataArrPartner[j].recipients.length; k++) {
          if (dataArrPartner[j].type != 3) {
            if (!dataArrPartner[j].name) {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập tên của đối tác tổ chức!", "", 10000);
              count++;
              break;
            }

            if (!dataArrPartner[j].recipients[k].name) {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập tên" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác!", "", 10000);
              count++;
              break;
            }
            if (!dataArrPartner[j].recipients[k].email) {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập email" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác!", "", 10000);
              count++;
              break;
            }

            if (dataArrPartner[j].recipients[k].sign_type.length == 0 && [3, 4].includes(dataArrPartner[j].recipients[k].role)) {
              this.spinner.hide();
              // @ts-ignore
              this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn loại ký của" + this.getNameObject(dataArrPartner[j].recipients[k].role) + "của đối tác!", "", 10000);
              count++;
              break;
            }

            if (!dataArrPartner[j].recipients[k].phone && dataArrPartner[j].recipients[k].role == 3 && (dataArrPartner[j].recipients[k].is_otp || dataArrPartner[j].recipients[k].is_otp == 1)) {
              this.spinner.hide();
              // @ts-ignore
              this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập số điện thoại của" + this.getNameObject(3) + "của đối tác!", "", 10000);
              count++;
              break;
            }
          } else if (dataArrPartner[j].type == 3) {
            if (!dataArrPartner[j].recipients[k].name && dataArrPartner[j].recipients[k].role == 3) {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập tên" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác cá nhân!", "", 10000);
              count++;
              break;
            }
            if (!dataArrPartner[j].recipients[k].email && dataArrPartner[j].recipients[k].role == 3) {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập email" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác cá nhân!", "", 10000);
              count++;
              break;
            }

            if (dataArrPartner[j].recipients[k].sign_type.length == 0 && [3, 4].includes(dataArrPartner[j].recipients[k].role) && dataArrPartner[j].recipients[k].role == 3) {
              this.spinner.hide();
              // @ts-ignore
              this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn loại ký của" + this.getNameObject(dataArrPartner[j].recipients[k].role) + "của đối tác cá nhân!", "", 10000);
              count++;
              break;
            }

            if (!dataArrPartner[j].recipients[k].phone &&
              dataArrPartner[j].recipients[k].role == 3 &&
              (dataArrPartner[j].recipients[k].is_otp ||
                dataArrPartner[j].recipients[k].is_otp == 1) &&
              dataArrPartner[j].recipients[k].role == 3) {
              this.spinner.hide();
              // @ts-ignore
              this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập số điện thoại của" + this.getNameObject(3) + "của đối tác!", "", 10000);
              count++;
              break;
            }
          }
        }
      }
    }

    if (count > 0) {
      return false;
    }
    return true;
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

  onItemSelect(e: any, data: any) {

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
    this.data_parnter_organization[index].recipients.push(data);
  }

  // thêm đối tượng người điều phối (done)
  addPartnerCoordination(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => p.type == 2)[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 1))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 1);
    data.ordering = count_data.length + 1;
    this.data_parnter_organization[index].recipients.push(data);
  }

  // thêm đối tượng ký đối tác (done)
  addPartnerSignature(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => (p.type == 2))[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 3))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 3);
    data.ordering = count_data.length + 1;
    this.data_parnter_organization[index].recipients.push(data);
  }

  // thêm đối tượng văn thư đối tác (done)
  addPartnerDocument(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => (p.type == 2))[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 4))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 4);
    data.ordering = count_data.length + 1;
    this.data_parnter_organization[index].recipients.push(data);
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
    return this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
  }

  // thêm đối tác
  addPartner() {
    let data_partner_add = {};
    let data = [...this.contractService.getDataDetermine()];
    data_partner_add = data.filter((p: any) => (p.type == 2))[0];
    this.is_determine_clone.push(data_partner_add);
    this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3).forEach((res: any, index: number) => {
      res.ordering = index + 1;
    })

    console.log(this.data_parnter_organization);
  }

  // xóa đối tham gia bên đối tác
  deletePartner(index: any) {
    this.is_determine_clone.splice(index, 1);
    this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3).forEach((res: any, index: number) => {
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
    console.log(item, e);
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
          item.status = 1;
          item.username = "";
          item.password = "";
          item.is_otp = 1;
          item.sign_type = [];
        }
      })
    }
    this.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3)[index].recipients = newArr;
  }

}
