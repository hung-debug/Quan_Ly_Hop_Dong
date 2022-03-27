import { ContractService } from 'src/app/service/contract.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import {
  type_signature,
  type_signature_doc,
  type_signature_personal_party,
  variable
} from "../../../../../config/variable";
import { parttern } from "../../../../../config/parttern";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Helper } from "../../../../../core/Helper";
import * as ContractCreateDetermine from '../../contract_data'
import { elements } from "@interactjs/snappers/all";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "../../../../../service/toast.service";
import { Router } from "@angular/router";
import { NgxInputSearchModule } from "ngx-input-search";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-determine-signer',
  templateUrl: './determine-signer.component.html',
  styleUrls: ['./determine-signer.component.scss']
})
export class DetermineSignerComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  @Input() saveDraftStep: any;
  @Output() stepChangeDetermineSigner = new EventEmitter<string>();
  @Input() save_draft_infor: any;
  // @Output('dataStepContract') dataStepContract = new EventEmitter<Array<any>>();
  // @Output('saveDraft') saveDraft = new EventEmitter<string>();
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
  arrSearch: any = [];

  //dropdown
  signTypeList: Array<any> = type_signature;
  signTypeList_personal_partner: Array<any> = type_signature_personal_party;
  signType_doc: Array<any> = type_signature_doc;

  dropdownSignTypeSettings: any = {};
  getNameIndividual: string = "";

  arrSearchName: any = [];
  arrSearchNameDoc: any = [];
  arrSearchNameSignature: any = [];
  arrSearchNameView: any = [];
  is_change_party: boolean = false;

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
    if (!this.datas.is_determine_clone || this.datas.is_determine_clone.length == 0) {
      // this.datas.is_determine_clone = null;
      // this.datas.is_determine_clone = this.datas.determine_contract;
      this.datas.is_determine_clone = [...this.contractService.getDataDetermineInitialization()];
    }

    // data Tổ chức của tôi
    this.data_organization = this.datas.is_determine_clone.filter((p: any) => p.type == 1)[0];
    this.data_organization.name = this.datas.name_origanzation ? this.datas.name_origanzation : '';
    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);

    // data đối tác
    this.data_parnter_organization = this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
    // this.data_parnter_individual = this.datas.is_determine_clone.filter((p: any) => p.type == 3);

    this.dropdownSignTypeSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      enableCheckAll: false,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      limitSelection: 2,
      disabledField: 'item_disable',
    };

    if (this.datas.is_determine_clone.some((p: any) => p.type == 3)) this.is_change_party = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.step == 'determine-contract') {
      this.next('save-draft');
    }
  }

  //dropdown contract type
  get getSignTypeItems() {
    return this.signTypeList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.nextOrPreviousStep(step);
  }

  // next step event
  next(action: string) {
    this.submitted = true;
    if (action == 'save-step' && !this.validData()) {
      if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
        this.save_draft_infor.close_header = false;
        this.save_draft_infor.close_modal.close();
      }
      return;
    } 
    else {
      let is_save = false;
      if (action == 'save-step') {
        is_save = true;
      }
      this.getApiDetermine(is_save);
    }
  }

  async getApiDetermine(is_save?: boolean) {
    this.datas.is_determine_clone.forEach((items: any, index: number) => {
      if (items.type == 3)
        this.datas.is_determine_clone[index].recipients = items.recipients.filter((p: any) => p.role == 3);
    })
    this.spinner.show();
    let isCheckId = this.datas.is_determine_clone.filter((p: any) => p.id);
    if (this.datas.is_action_contract_created && this.router.url.includes("edit") && (isCheckId && isCheckId.length == this.datas.is_determine_clone.length)) {
      let isBody: any[] = [];
      let count = 0;
      let is_error = '';
      // this.datas.contract_id_action
      
      for (let i = 0; i < this.datas.is_determine_clone.length; i++) {
        this.datas.is_determine_clone[i].recipients.forEach((element: any) => {
          if (!element.id) element.id = 0;
        })
        await this.contractService.getContractDetermineCoordination(this.datas.is_determine_clone[i], this.datas.is_determine_clone[i].id).toPromise().then((res: any) => {
          isBody.push(res);
        }, (res: any) => {
          is_error = res.error;
          count++
        })
        if (count > 0) {
          break;
        }
      }
      if (isBody.length == this.datas.is_determine_clone.length) {
        this.getDataApiDetermine(isBody, is_save)
      } else {
        if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
          this.save_draft_infor.close_header = false;
          this.save_draft_infor.close_modal.close();
        }
        this.toastService.showErrorHTMLWithTimeout(is_error ? is_error : 'Có lỗi! vui lòng liên hệ với nhà phát triển để xử lý.', "", 3000);
      }
        
      this.spinner.hide()
    } else {
      this.contractService.getContractDetermine(this.datas.is_determine_clone, this.datas.id).subscribe((res: any) => {
        this.getDataApiDetermine(res, is_save)
      }, (error: HttpErrorResponse) => {
        if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
          this.save_draft_infor.close_header = false;
          this.save_draft_infor.close_modal.close();
        }
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!", "", 3000);
      }, () => {
        this.spinner.hide();
      }
      );
    }
  }

  getDataApiDetermine(res: any, is_save?: boolean) {
    // this.datas.id = data?.id;
    if (!is_save) {
      if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
        this.save_draft_infor.close_header = false;
        this.save_draft_infor.close_modal.close();
      }
      this.toastService.showSuccessHTMLWithTimeout("Lưu nháp thành công!", "", 3000)
      void this.router.navigate(['/main/contract/create/draft']);
    } else if (!this.saveDraftStep || is_save) {
      this.datas.is_determine_clone = res ? res : this.datas.is_determine_clone;
      this.step = variable.stepSampleContract.step3;
      this.datas.stepLast = this.step;
      this.nextOrPreviousStep(this.step);
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeDetermineSigner.emit(step);
  }

  selectWithOtp(e: any, data: any) {
    // this.changeOtp(data);
  }

  changeOtp(data: any) {
    let data_sign_cka = data.sign_type.filter((p: any) => p.id == 1)[0];
    if (data.is_otp && data_sign_cka) {
      data.sign_type.forEach((res: any) => {
        res.is_otp = true;
      })
    } else {
      data.sign_type.forEach((res: any) => {
        res.is_otp = false;
      })
    }
  }

  // valid data step 2
  validData() {
    let count = 0;
    let dataArr = [];
    dataArr = this.data_organization.recipients;
    for (let i = 0; i < dataArr.length; i++) {
      if (!dataArr[i].name) {
        this.getNotificationValid("Vui lòng nhập tên" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!");
        count++;
        break;
      }
      if (!dataArr[i].email) {
        this.getNotificationValid("Vui lòng nhập email" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!")
        count++;
        break;
      }
      if (dataArr[i].sign_type.length == 0 && dataArr[i].role != 2) {
        this.getNotificationValid("Vui lòng chọn loại ký của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!")
        count++;
        break;
      } else if (dataArr[i].sign_type.length > 0 && dataArr[i].role != 2) {
        let is_duplicate = [];
        is_duplicate = dataArr[i].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
        if (is_duplicate.length > 1) {
          this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!")
          count++;
          break;
        }
        is_duplicate = [];
      }

      if (!dataArr[i].phone && dataArr[i].role == 3 && (dataArr[i].is_otp || dataArr[i].is_otp == 1)) {
        this.getNotificationValid("Vui lòng nhập số điện thoại của" + this.getNameObject(3) + "tổ chức của tôi!")
        count++;
        break;
      }
      // @ts-ignore
      // if (!this.pattern.name.test(dataArr[i].name)) {
      //   this.getNotificationValid("Tên" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi không hợp lệ!")
      //   count++;
      //   break;
      // }
      // @ts-ignore
      if (dataArr[i].email && !this.pattern.email.test(dataArr[i].email)) {
        this.getNotificationValid("Email của" + this.getNameObject(3) + "tổ chức của tôi không hợp lệ!")
        count++;
        break;
      }
      //@ts-ignore
      if (dataArr[i].phone && !this.pattern.phone.test(dataArr[i].phone)) {
        this.getNotificationValid("Số điện thoại của" + this.getNameObject(3) + "tổ chức của tôi không hợp lệ!")
        count++;
        break;
      }
    }

    if (count == 0) {
      if (this.getCheckDuplicateEmail('only_party_origanzation', dataArr)) {
        this.getNotificationValid("Email tổ chức của tôi không được trùng nhau!");
        return false
      }
    }


    let dataArrPartner = [];
    dataArrPartner = this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
    if (count == 0) {
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

            if (!dataArrPartner[j].recipients[k].phone &&
              dataArrPartner[j].recipients[k].role == 3 &&
              (dataArrPartner[j].recipients[k].is_otp || dataArrPartner[j].recipients[k].is_otp == 1)) {
              this.getNotificationValid("Vui lòng nhập số điện thoại" + this.getNameObject(3) + "của đối tác!")
              count++;
              break;
            }

            //@ts-ignore
            // if (dataArrPartner[j].recipients[k].name && !this.pattern.name.test(dataArrPartner[j].recipients[k].name && dataArrPartner[j].recipients[k].role == 3)) {
            //   this.getNotificationValid("Tên" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " đối tác cá nhân không hợp lệ!");
            //   count++;
            //   break;
            // }
            //@ts-ignore
            if (dataArrPartner[j].recipients[k].email && !this.pattern.email.test(dataArrPartner[j].recipients[k].email) && dataArrPartner[j].recipients[k].role == 3) {
              this.getNotificationValid("Email" + this.getNameObject(dataArrPartner[j].recipients[k].role) + " của đối tác cá nhân không hợp lệ!")
              count++;
              break;
            }
            //@ts-ignore
            if (dataArrPartner[j].recipients[k].phone && !this.pattern.phone.test(dataArrPartner[j].recipients[k].phone)) {
              this.getNotificationValid("Số điện thoại" + this.getNameObject(3) + "của đối tác không hợp lệ!")
              count++;
              break;
            }
          }
        }
      }
    }

    if (count == 0) {
      // dataArrPartyCheckEmail = this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
      if (this.getCheckDuplicateEmail('only_party_partner', dataArrPartner)) {
        this.getNotificationValid("Email đối tác không được trùng nhau!");
        return false
      }
    }

    if (count == 0) {
      if (this.getCheckDuplicateEmail('allCheckEmail', this.datas.is_determine_clone)) {
        this.getNotificationValid("Email không được trùng nhau giữa các bên tham gia!");
        return false
      }
    }

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
      { id: 1, name: 'Ký ảnh' },
      { id: 2, name: 'Ký số' }
    ]
  }

  changePartner(e: any, number_type: number, item: any) {
    this.getDataPartner(number_type);
  }

  // tạo mảng đối tác
  getDataPartner(number_type?: number, name?: string) {
    let data = [...this.datas.is_determine_clone];
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
    (this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
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
    (this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  // thêm đối tượng ký đối tác (done)
  addPartnerSignature(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => (p.type == 2))[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 3))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 3);
    data.ordering = count_data.length + 1;
    // this.data_parnter_organization[index].recipients.push(data);
    (this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  // thêm đối tượng văn thư đối tác (done)
  addPartnerDocument(item: any, index: number) {
    let data_determine_add = [];
    data_determine_add = [...this.contractService.getDataDetermine()];
    let data_partner = data_determine_add.filter((p: any) => (p.type == 2))[0];
    let data = (data_partner.recipients.filter((p: any) => p.role == 4))[0];
    let count_data = item.recipients.filter((p: any) => p.role == 4);
    data.ordering = count_data.length + 1;
    // this.data_parnter_organization[index].recipients.push(data);
    (this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
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
    return this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
  }

  // thêm đối tác
  addPartner() {
    let data_partner_add = {};
    // let data = [...this.contractService.getDataDetermine()];
    let data = [...this.contractService.getDataDetermineInitialization()];
    data_partner_add = data.filter((p: any) => (p.type == 2))[0];
    this.datas.is_determine_clone.push(data_partner_add);
    this.datas.is_determine_clone.forEach((res: any, index: number) => {
      res.ordering = index + 1;
    })

    console.log(this.data_parnter_organization);
  }

  // xóa đối tham gia bên đối tác
  deletePartner(index: any) {
    this.datas.is_determine_clone.splice(index + 1, 1);
    this.datas.is_determine_clone.forEach((res: any, index: number) => {
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
          item.is_otp = 0;
          item.sign_type = [];
          if (item.id) delete item.id;
        }
      })
    }
    this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3)[index].recipients = newArr;

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

  // style select otp and phone with signature
  getStyleSignature(data: any) {
    let dataCheck = data.sign_type.filter((p: any) => p.id == 1);
    if (dataCheck.length > 0) {
      return {
        'width': '40%'
      }
    } else return { 'width': '90%' }
  }

  doTheSearch($event: Event, indexs: number, action: string): void {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    console.log(stringEmitted);
    this.arrSearchNameView = [];
    this.arrSearchNameSignature = [];
    this.arrSearchNameDoc = [];
    setTimeout(() => {
      this.contractService.getNameOrganization("", stringEmitted).subscribe((res) => {
        let arr_all = res.entities;
        let data = arr_all.map((p: any) => ({ name: p.name, email: p.email }));
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

  onSelectName(tData: any, dData: any) {
    dData.name = tData.name;
    dData.email = tData.email;
    this.arrSearchNameView = [];
    this.arrSearchNameSignature = [];
    this.arrSearchNameDoc = [];
  }

  onChangeValue(e: any, orering_data: string) {
    // console.log(e.target.value);
    if (!e.target.value) {
      let data_ordering = document.getElementById(orering_data);
      if (data_ordering)
        data_ordering.focus();
      this.toastService.showErrorHTMLWithTimeout("Bạn chưa nhập thứ tự ký!", "", 3000);
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
