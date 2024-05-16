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
import Swal from 'sweetalert2';
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
  recipientId: any;
  sign_type: any;
  user_in_organization: any;
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
  locale: string;
  //dropdown
  signTypeList: Array<any> = type_signature;
  checkCount = 1;
  dataSign: any;
  isReqPhone: boolean = false;
  isReqCardId: boolean = false;
  isReqCardIdToken: boolean = false;
  isReqCardIdHsm: boolean = false;
  isReqCardIdCts: boolean = false;
  hasText: boolean = false;
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
    this.recipientId = this.data.id;
    this.user_in_organization = this.data.user_in_organization;
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
    this.actionWithSignTypeForm()

  }
  //dropdown contract type
  get getSignTypeItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }
  // setLocale(lang: string) {
  //   this.locale = lang;
  // }

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
    if (!this.validData()) {
      this.spinner.hide();
      return;
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;

    const login_by = this.isCheckRadio ? "email" : "phone"
    this.spinner.show();
    let dataUpdate = {
      ...this.data,
      name: this.name,
      email: login_by === 'email' ? this.email.toLowerCase() : login_by === 'phone' ? this.phone : '',
      phone: this.phone,
      login_by: login_by,
      card_id: [2,4,5,6,8].includes(this.dataSign[0]?.id) ? this.card_id : "",
      sign_type: this.dataSign,
      user_in_organization: this.user_in_organization
      // locale: this.locale,
    }; 

    if (this.name !== "") {
      if (JSON.stringify(this.data) === JSON.stringify(dataUpdate)) {
        this.spinner.hide();
        return;
      }
      this.contractService.updateInfoPersonProcess(dataUpdate, this.data.id, this.data.contract_id).subscribe(
        (res: any) => {
          this.spinner.hide();
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

            // this.router.navigate(['/main/form-contract/detail/' + this.id]);
            let dataOrg : any = ""
            this.contractService.viewFlowContract(this.data.contract_id).subscribe(response =>{
              response.recipients.forEach((element: any) => {     
                if(element.id == this.data.id){
                 dataOrg = element.user_in_organization
                 dataUpdate = { ...dataUpdate, "change_num": this.data.change_num + 1, user_in_organization: dataOrg }
                 this.dialogRef.close(dataUpdate);
                }
              })
            })
          }
          
        }
      )
    } else {
      this.spinner.hide()
      this.toastService.showWarningHTMLWithTimeout("Tên người xử lý không được bỏ trống", "", 3000);
    }

  }
  validData() {
    this.clearError();
    if (!!this.isCheckRadio && (!this.validateName() || !this.validateEmail())) {
      // this.spinner.hide();
      return false;
    } else if (!this.isCheckRadio && (!this.validateName() || !this.validatePhoneNumber()) || (this.id_sign_type === 1 && !this.validatePhoneNumber())) {
      return false;
    }
    if ((this.id_sign_type === 4 || this.id_sign_type === 2 || this.id_sign_type === 5 || this.id_sign_type == 6)) {
      return this.validateCardId();
    }
    if (this.dataSign.length == 0 && this.data.role != 2 && this.data.role != 1) {
      this.toastService.showErrorHTMLWithTimeout("Loại ký không được để trống!","",3000)
      return false
    }
    return true
  }
  validateName() {
    let testInput = this.name
    this.errorName = "";
    if (testInput == "") {
      this.errorName = "error.name.required";
      return false;
    }
    return true;
  }
  validatePhoneNumber() {
    let testInput = this.phone
    this.errorPhone = "";
    if (testInput && !this.pattern.phone.test(testInput)) {
      this.errorPhone = "error.user.phone.format";
      return false;
    }
    else if (!testInput && !this.isCheckRadio || (this.id_sign_type === 1 && !testInput)) {
      this.errorPhone = "error.phone.required";
      return false;
    }
    return true;
  }
  validateCardId() {
    let testInput = this.card_id
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
  validateEmail() {
    let testInput = this.email
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


    d === 1 ? this.isCheckRadio = false : this.isCheckRadio = true
  }

  getDataSignHsm(data: any) {
    return data.sign_type.filter((p: any) => p.id == 4);
  }
  getDataSignUSBToken(data: any) {
    return data.sign_type.filter((p: any) => p.id == 2);
  }
  getDataSignCert(data: any) {
    return data.sign_type.filter((p: any) => p.id == 6);
  }

  get getContractConnectItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  onFocusIn(e: any, is_index: number, action: string) {
    //
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
    //
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
        //
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
    //
    if (!e.target.value) {
      let data_ordering = document.getElementById(orering_data);
      if (data_ordering)
        data_ordering.focus();
      this.toastService.showWarningHTMLWithTimeout("Bạn chưa nhập thứ tự ký!", "", 3000);
    }
  }

  async actionWithSignTypeForm() {
    const contractFieldsDetail = await this.contractService.getDetailInforContract(this.data.contract_id).toPromise();
    contractFieldsDetail.participants.forEach((element: any) => {
      element.recipients.forEach((recip: any) => {
        if (recip.id == this.recipientId) {
          this.hasText = recip.fields.some((data: any) => data.type !== 2 && data.type !== 3)
        }
      }) 
    })
    this.dataSign = this.data.sign_type
    let currentSignType = this.data.sign_type[0]
    if(currentSignType.id == 2 || currentSignType.id == 3 || currentSignType.id == 4 || currentSignType.id == 6 || currentSignType.id == 7 || currentSignType.id == 8) {
      this.signTypeList = this.signTypeList.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6 || p.id == 7 || p.id == 8);
    } else if(currentSignType.id == 1 ||  currentSignType.id == 5) {
      this.signTypeList = this.signTypeList.filter((p: any) => p.id == 1 || p.id == 5);
    }
 
  }

  getTargetRecipientData(targetId : number){
    if (this.datas?.dataContract?.is_data_contract?.participants?.length) {
      const participants = this.datas?.dataContract?.is_data_contract?.participants;
      for (const participant of participants) {
        for (const recipient of participant.recipients) {
          if (targetId == recipient.id) {
            return recipient;
          }
        }
      }
    }
  }

  onItemSelect(event: any) {
    // 1: Ký ảnh
    // 5: Ký ekyc
    if(event.id == 1) {
      this.isReqPhone = true;
      this.isReqCardId = false;
    } else if(event.id == 5) {
      this.isReqCardId = true;
    } else if(event.id == 4) {
      //Ký hsm
      this.isReqCardIdHsm = true;
      this.isReqCardIdToken = false;
      this.isReqCardIdCts = false;
    } else if(event.id == 2) {
      //Ký token
      this.isReqCardIdHsm = false;
      this.isReqCardIdToken = true;
      this.isReqCardIdCts = false;
    } else if(event.id == 6){
      this.isReqCardIdCts = true;
      this.isReqCardIdHsm = false;
      this.isReqCardIdToken = false;
    } else if(event.id == 8){
      this.isReqCardIdCts = true;
      this.isReqCardIdHsm = false;
      this.isReqCardIdToken = false;
    } else if(event.id == 7){
      this.isReqCardIdCts = false;
      this.isReqCardIdHsm = false;
      this.isReqCardIdToken = false;
      this.isReqPhone = false;
    } else if(event.id == 3){
      this.isReqCardIdCts = false;
      this.isReqCardIdHsm = false;
      this.isReqCardIdToken = false;
    }
    if (![2,4,6].includes(event.id) && this.hasText) {
      this.checkContractTextFieldsSwalfire()
    }
    this.dataSign = this.signTypeList.filter(signType => signType.id == event.id) 
    this.id_sign_type = this.dataSign[0].id
  }

  checkContractTextFieldsSwalfire() {
    return Swal.fire({
      title: `Người ký <b>${this.data.name}</b> đang có ô text/số hợp đồng cần xử lý, bạn có chắc muốn chuyển sang hình thức ký <b>KHÔNG</b> hỗ trợ <b>nhập ô text/số hợp đồng</b> không?`,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#b0bec5',
      confirmButtonText: this.translate.instant('confirm'),
      cancelButtonText: this.translate.instant('contract.status.canceled'),
      allowOutsideClick: false
    });
  }
}
