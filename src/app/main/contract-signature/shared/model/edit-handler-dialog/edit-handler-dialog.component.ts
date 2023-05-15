import { Component, EventEmitter, Input, Output, OnInit, Inject, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ContractService } from 'src/app/service/contract.service';
import {
  type_signature,
  type_signature_doc,
  type_signature_en,
  variable
} from "../../../../../config/variable";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "../../../../../service/toast.service";
import { environment } from 'src/environments/environment';
import { parttern, parttern_input } from "../../../../../config/parttern";
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-edit-handler-dialog',
  templateUrl: './edit-handler-dialog.component.html',
  styleUrls: ['./edit-handler-dialog.component.scss']
})
export class EditHandlerComponent implements OnInit {
  // @Input() datas: any;
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
  email: string;
  phone: string;
  login_by: any;
  status: any;
  isCheckRadio = this.data.login_by === "phone" ? false : true;
  is_handler: any;
  name: any;
  recipient_id: any;
  sign_type: any;
  id_sign_type: any;
  id: any;
  card_id: any;
  key: any;
  pattern = parttern;
  pattern_input = parttern_input;
  role: any;
  contractId: any;
  currentUser: any;
  errorName: any = '';
  errorPhone: any = '';
  errorCardid: any = '';
  errorEmail: any = '';

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
    private contractService: ContractService,
    public translate: TranslateService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('currentValue',changes.login_by.currentValue);
    console.log('previousValue',changes.login_by.previousValue);
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

    // this.isListSignNotPerson = this.signTypeList.filter((p) => ![1, 5].includes(p.id)); // person => sign all,
    //   console.log("data_organization",this.datas);
    // this.datas.is_handler = [...this.contractService.getDataDetermineInitialization()];
    //   console.log("this.datas.is_handler",this.datas.is_handler);


    console.log("this.data.update process person", this.data);
    console.log("datas",this.datas);
    

    this.name = this.data.name;
    this.login_by = this.data.login_by;
    // voi case email duoc luu theo so phone thi khoi tao se clear rong
    this.email = this.data.email !== this.data.phone ? this.data.email : "";
    this.phone = this.data.phone;
    this.sign_type = this.data.sign_type[0]?.name
    this.id_sign_type = this.data.sign_type[0]?.id
    this.card_id = this.data.card_id;
    this.id = this.data.id;
    this.role = this.data.role;
    this.status = this.data.status;
    // this.contractid = this.data.is_data_contract.id;

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
  //dropdown contract type
  get getSignTypeItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }
  handleCancel() {
    this.dialogRef.close();
  }
  keyDownHandler(event: any) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }

  getNameObjectValid(role_numer: number) {
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
  UpdateHandler() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
    console.log("datas",this.currentUser);

    this.spinner.show();
    if(this.id_sign_type !== 1 && this.id_sign_type !== 5){
      let dataUpdate = {
        ...this.data,
        name: this.name,
        email: this.isCheckRadio ? this.email.toLowerCase() : this.phone,
        phone: !this.isCheckRadio ? this.phone : "",
        login_by: this.isCheckRadio ? "email" : "phone",
        card_id: this.card_id,
      };
      // console.log("a",dataUpdate);
      
  
      if (!this.validData()) {
        console.log("dataUpdate", this.validData());
        console.log("b");
        return;
      }
      else {
        if (this.name !== "") {
          if (JSON.stringify(this.data) === JSON.stringify(dataUpdate)) {
  
            return;
          }
          console.log("c");
          this.contractService.updateInfoPersonProcess(dataUpdate, this.data.id, this.data.contract_id).subscribe(
            (res: any) => {
              if (!res.success) {
                switch (res.message) {
                  case "E01": {
                    this.toastService.showErrorHTMLWithTimeout(this.translate.instant('email.already.exist'), "", 3000);
                    break
                  }
                  case "E02": {
                    this.toastService.showErrorHTMLWithTimeout(this.translate.instant('phone.already.exist'), "", 3000);
                    break
                  }
                  case "E03": {
                    this.toastService.showErrorHTMLWithTimeout(this.translate.instant('cardid.already.exist'), "", 3000);
                    break
                  } default: this.toastService.showErrorHTMLWithTimeout(this.translate.instant('error.update.handler'), "", 3000);
                }
              } else {
                this.toastService.showSuccessHTMLWithTimeout(this.translate.instant('update.success'), "", 3000);
                dataUpdate = { ...dataUpdate, "change_num": this.data.change_num + 1 }
                this.dialogRef.close(dataUpdate);
                // this.router.navigate(['/main/form-contract/detail/' + this.id]);
              }
            }
          )
        } else {
          this.toastService.showWarningHTMLWithTimeout("Tên người xử lý không được bỏ trống", "", 3000);
        }
  
      }
    } else{
        let dataUpdate = {
          ...this.data,
          name: this.name,
          email: this.isCheckRadio ? this.email.toLowerCase() : this.phone,
          phone: this.isCheckRadio ? this.phone : "",
          login_by: this.isCheckRadio ? "email" : "phone",
          card_id: this.card_id,
        };
        // console.log("a",dataUpdate);
        
    
        if (!this.validData()) {
          console.log("dataUpdate", this.validData());
          console.log("b");
          return;
        }
        else {
          if (this.name !== "") {
            if (JSON.stringify(this.data) === JSON.stringify(dataUpdate)) {
    
              return;
            }
            console.log("c");
            this.contractService.updateInfoPersonProcess(dataUpdate, this.data.id, this.data.contract_id).subscribe(
              (res: any) => {
                if (!res.success) {
                  switch (res.message) {
                    case "E01": {
                      this.toastService.showErrorHTMLWithTimeout(this.translate.instant('email.already.exist'), "", 3000);
                      break
                    }
                    case "E02": {
                      this.toastService.showErrorHTMLWithTimeout(this.translate.instant('phone.already.exist'), "", 3000);
                      break
                    }
                    case "E03": {
                      this.toastService.showErrorHTMLWithTimeout(this.translate.instant('cardid.already.exist'), "", 3000);
                      break
                    } default: this.toastService.showErrorHTMLWithTimeout(this.translate.instant('error.update.handler'), "", 3000);
                  }
                } else {
                  this.toastService.showSuccessHTMLWithTimeout(this.translate.instant('update.success'), "", 3000);
                  dataUpdate = { ...dataUpdate, "change_num": this.data.change_num + 1 }
                  this.dialogRef.close(dataUpdate);
                  // this.router.navigate(['/main/form-contract/detail/' + this.id]);
                }
              }
            )
          } else {
            this.toastService.showWarningHTMLWithTimeout("Tên người xử lý không được bỏ trống", "", 3000);
          }
    
        }
      
    }
    
  }
  validData() {
    this.clearError();
    if (!!this.isCheckRadio && (!this.validateName(this.name) || !this.validateEmail(this.email))) {
      // this.spinner.hide();
      return false;
    } else if (!this.isCheckRadio && (!this.validateName(this.name) || !this.validatePhoneNumber(this.phone))) {
      return false;
    }
    if ((this.id_sign_type === 4 || this.id_sign_type === 2)) {
      return this.validateCardId(this.card_id);
    }
    return true
  }
  validateName(testInput: string) {
    this.errorName = "";
    if (testInput == "") {
      this.errorName = "error.name.required";
      return false;
    }
    return true;
  }
  validatePhoneNumber(testInput: string) {
    this.errorPhone = "";
    if (testInput && !this.pattern.phone.test(testInput)) {
      this.errorPhone = "error.user.phone.format";
      return false;
    }
    else if (!testInput && !this.isCheckRadio) {
      this.errorPhone = "error.phone.required";
      return false;
    }
    return true;
  }
  validateCardId(testInput: string) {
    this.errorCardid = "";
    if (testInput == "") {
      this.errorCardid = "error.card.required";
      return false;
    }
    if (!this.pattern.cardid.test(testInput)) {
      this.errorCardid = "taxcode.format";
      return false;
    }
    return true;

  }
  validateEmail(testInput: string) {
    this.errorEmail = "";
    if (!this.pattern.email.test(testInput)) {
      this.errorEmail = "error.user.email.format";
      return false;
    } else if (testInput == "") {
      this.errorEmail = "error.email.required";
      return false;
    }
    return true;
  }
  clearError() {
    if (this.name) {
      this.errorName = '';
    }
    if (this.phone) {
      this.errorPhone = '';
    }
    if (this.card_id) {
      this.errorCardid = '';
    }
  }

  onItemSelect(e: any, data: any) {

    // console.log(setOrdering, setOrderingParnter.length)
    this.checkCount = 1; // gan lai de lan sau ko bi tang index
  }
  // dataParnterOrganization() {
  //   return this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
  // }
  addOriganzationSignature() {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_organization = data_determine_add.filter((p: any) => p.type == 1)[0];
    let data = (data_organization.recipients.filter((p: any) => p.role == 3))[0];
    data.ordering = this.getOriganzationSignature1().length + 1;
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

  getOriganzationSignature1() {
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