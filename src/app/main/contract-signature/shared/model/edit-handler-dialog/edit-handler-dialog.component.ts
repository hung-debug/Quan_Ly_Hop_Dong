import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ContractService } from 'src/app/service/contract.service';
import {
  type_signature,
  type_signature_doc,
  type_signature_en,
} from "../../../../../config/variable";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "../../../../../service/toast.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-handler-dialog',
  templateUrl: './edit-handler-dialog.component.html',
  styleUrls: ['./edit-handler-dialog.component.scss']
})
export class EditHandlerComponent implements OnInit {
  @Input() datas: any;
  @Output() modalState: EventEmitter<any> = new EventEmitter();
  dropdownSignTypeSettings: any = {};
  isListSignNotPerson: any = [];
  data_organization: any;
  flagUSBTokenMyOrg = false;
  arrSearch: any = [];
  arrSearchNameView: any = [];
  arrSearchNameSignature: any = [];
  arrSearchNameDoc: any = [];
  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = {};
  site: string;
  email: string = "email";
  phone: string = "phone";
  login_by: any;
  isCheckRadio= true;
  //dropdown
  signTypeList: Array<any> = type_signature;
  checkCount = 1;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    public router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditHandlerComponent>,
    private contractService: ContractService
  ) {
  }

  ngOnInit(): void {
    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }

    if (localStorage.getItem('lang') == 'en') {
      this.signTypeList = type_signature_en;
    } else if (localStorage.getItem('lang') == 'vi') {
      this.signTypeList = type_signature;
    }
    console.log("dataflagDigital");
    console.log("dataflagDigitalsssssssssss", this.datas);
    console.log("dataflagDigital", this.datas?.flagDigitalSign);


    if (!this.datas.flagDigitalSign) {
      this.isListSignNotPerson = this.signTypeList.filter((p) => ![1, 5].includes(p.id)); // person => sign all,   
    } else {
      this.isListSignNotPerson = this.signTypeList.filter((p) => ![1, 5].includes(p.id)); // person => sign all,
    }

    // data Tổ chức của tôi
    this.data_organization = this.datas.is_determine_clone.filter((p: any) => p.type == 1)[0];
    this.data_organization.name = this.datas.is_determine_clone.filter((p: any) => p.type == 1)[0].name ? this.datas.is_determine_clone.filter((p: any) => p.type == 1)[0].name : this.datas.name_origanzation;
    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);
    this.dropdownSignTypeSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      enableCheckAll: false,
      allowSearchFilter: true,
      itemsShowLimit: 1,
      limitSelection: 1,
      disabledField: 'item_disable',
    };

  }

  handleCancel() {
    this.dialogRef.close();
  }
  onItemSelect(e: any, data: any) {
    // var isParnter = this.dataParnterOrganization().filter((p: any) => p.type == 3); // doi tac ca nhan
    // var isOrganization = this.dataParnterOrganization().filter((p: any) => p.type == 2); // doi tac to chuc
    // // <==========>
    // if (isParnter.length > 0) {
    //   for (let i = 0; i < 2; i++) {
    //     this.getSetOrderingPersonal(isParnter, i);
    //   }
    // }
    // for loop check change ordering with parnter origanization
    // this.getSetOrderingParnterOrganization(isOrganization);
    // set again ordering data not option eKYC/img/otp => order
    // var setOrderingOrganization =
    var setOrdering = this.dataParnterOrganization().filter((p: any) => p.type == 2 || p.type == 3 && (p.recipients[0].sign_type.some(({ id }: any) => id == 2 || id == 3) || p.recipients[0].sign_type.length == 0));
    var setOrderingParnter = this.dataParnterOrganization().filter((p: any) => p.type == 3 && p.recipients[0].sign_type.some(({ id }: any) => id == 1 || id == 5));
    // if (setOrderingParnter.length > 0) {
    if (setOrderingParnter.length == 0) {
      this.data_organization.ordering = 1;
      setOrdering.forEach((val: any, index: number) => {
        val.ordering = index + 2; // + 2 (1: index & 1 index tổ chức của tôi) vì sẽ luôn luôn order sau tổ chức của tôi nếu trong các bên ko có dữ liệu ký eKYC/Image/OTP.
      })
    } else {
      this.data_organization.ordering = setOrderingParnter.length + 1;
      setOrdering.forEach((val: any, index: number) => {
        // val.ordering = setOrderingParnter.length > 0 ? (setOrderingParnter.length + index + 1) : (index + 1);
        // val.ordering = setOrderingParnter.length > 0 ? (this.data_organization.ordering + index + 1) : (index + 1);
        val.ordering = this.data_organization.ordering + index + 1; // tăng lên 1 ordering sau tổ chức của tôi
      })
    }

    // }
    // console.log(setOrdering, setOrderingParnter.length)
    this.checkCount = 1; // gan lai de lan sau ko bi tang index
  }
  dataParnterOrganization() {
    return this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
  }
  addOriganzationSignature() {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_organization = data_determine_add.filter((p: any) => p.type == 1)[0];
    let data = (data_organization.recipients.filter((p: any) => p.role == 3))[0];
    data.ordering = this.getOriganzationSignature().length + 1;
    this.data_organization.recipients.push(data);
  }
  deSelectOrg(e: any) {
    if (e.id == 2) {
      this.flagUSBTokenMyOrg = false;
    }
  }

  selectWithOtp(e: any, data: any, type: any) { // sort ordering
    console.log("type ", type);

    //clear lai gia tri card_id
    //Check với tổ chức của tôi ký
    if (type == 'organization') {
      //Nếu là người ký
      if (data.role == 3) {
        if (this.getDataSignHsm(data).length == 0 && this.getDataSignUSBToken(data).length == 0) {
          data.card_id = "";
        }
      }
    }
  }

  changeTypeSign(d: any) {
    console.log("d ", d);

    d === 1 ? this.isCheckRadio = false : this.isCheckRadio = true
    // if(d.login_by == 'phone' || d.login_by == 'email') {
    //   d.email = '';
    //   d.phone = '';
    // }
  }

  getDataSignHsm(data: any) {
    return data.sign_type.filter((p: any) => p.id == 4);
  }
  getDataSignUSBToken(data: any) {
    return data.sign_type.filter((p: any) => p.id == 2);
  }

  get getContractConnectItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  onFocusIn(e: any, is_index: number, action: string) {
    // console.log(e);
    if (e.type == "focusin") {
      this.arrSearch = [];
      let arrData = [];
      if (action == 'view') {
        arrData = this.data_organization.recipients.filter((p: any) => p.role == 2);
      } else if (action == 'signature') {
        arrData = this.data_organization.recipients.filter((p: any) => p.role == 3);
      } else if (action == 'doc') {
        arrData = this.data_organization.recipients.filter((p: any) => p.role == 4);
      }
      if (arrData.length > 0) {
        arrData.forEach((res: any, index: number) => {
          this.arrSearch.push(false);
          if (is_index == index) {
            this.arrSearch[index] = true;
          } else this.arrSearch[index] = false;
        })
      }

    }
  }

  onFocusOut(e: any, dItem: any) {
    // console.log(e)
    if (!e.relatedTarget || (e.relatedTarget && e.relatedTarget.className && !e.relatedTarget.className.includes('search-name-items'))) {
      if (!dItem.name) dItem.email = '';
      this.arrSearchNameView = [];
      this.arrSearchNameSignature = [];
      this.arrSearchNameDoc = [];
    }
  }

  doTheSearch($event: Event, indexs: number, action: string): void {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    this.arrSearchNameView = [];
    this.arrSearchNameSignature = [];
    this.arrSearchNameDoc = [];
    setTimeout(() => {
      this.contractService.getNameOrganization("", stringEmitted).subscribe((res) => {
        let arr_all = res.entities;
        let data = arr_all.map((p: any) => ({ name: p.name, email: p.email, phone: p.phone }));
        if (action == 'view') {
          this.arrSearchNameView = data;
        } else if (action == 'signature') {
          this.arrSearchNameSignature = data;
        } else {
          this.arrSearchNameDoc = data;
        }
        // console.log(data, res);
      }, () => {
        this.getNotificationValid('có lỗi, vui lòng liên hệ với nhà phát triển để được xử lý!')
      })
    }, 100)

  }

  onSelectName(tData: any, dData: any) {
    dData.name = tData.name;
    dData.email = tData.email;
    dData.phone = tData.phone;
    this.arrSearchNameView = [];
    this.arrSearchNameSignature = [];
    this.arrSearchNameDoc = [];
  }

  getNotificationValid(is_notify: string) {
    this.spinner.hide();
    this.toastService.showWarningHTMLWithTimeout(is_notify, "", 3000);
  }

  getOriganzationSignature() {
    return this.data_organization.recipients.filter((p: any) => p.role == 3);
  }

  onChangeValue(e: any, orering_data: string) {
    // console.log(e.target.value);
    if (!e.target.value) {
      let data_ordering = document.getElementById(orering_data);
      if (data_ordering)
        data_ordering.focus();
      this.toastService.showWarningHTMLWithTimeout("Bạn chưa nhập thứ tự ký!", "", 3000);
    }
  }
}