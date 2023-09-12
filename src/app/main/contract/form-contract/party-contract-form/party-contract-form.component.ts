import {Component, OnInit, Input, EventEmitter, Output, SimpleChanges, AfterViewInit} from "@angular/core";
// import { variable } from "src/app/config/variable";
import {parttern, parttern_input} from "src/app/config/parttern";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {
  type_signature,
  type_signature_doc,
  type_signature_personal_party,
  variable
} from "src/app/config/variable";
import {ContractService} from "src/app/service/contract.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "src/app/service/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import * as _ from 'lodash';
import { UnitService } from "src/app/service/unit.service";
import { UserService } from "src/app/service/user.service";
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-party-contract-form',
  templateUrl: './party-contract-form.component.html',
  styleUrls: ['./party-contract-form.component.scss']
})

export class PartyContractFormComponent implements OnInit, AfterViewInit {
  @Input() datasForm: any;
  @Input() stepForm: any;
  @Output() stepChangePartyContractForm = new EventEmitter<string>();
  @Input() save_draft_infor_form: any;
  @Input() saveDraftStepForm: any;

  determine_step = false;
  flagUsbToken: any = [];

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
  isListSignNotPerson: any = [];
  isListSignNotPerson1: any = [];
  ordering_person_partner = true;
  checkCount = 1;
  isCountNext = 1;

  action: any;

  typeSign: number = 0;

  email: string="email";
  phone: string="phone";
  orgId: any;
  numContractUse: any;
  smsContractUse: any;
  eKYCContractUse: any;
  numContractBuy: any;
  eKYCContractBuy: any;
  smsContractBuy: any;
  isButtonDisabled: boolean = false;

  site: string;
  isOrderValueValid: boolean = true
  get determineContract() {
    return this.determineDetails.controls;
  }

  constructor(
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private unitService: UnitService,
    private userService: UserService,
  ) {
    this.stepForm = variable.stepSampleContract.step2
  }

  ngOnInit(): void {
    if(environment.flag == 'NB') {
      this.site = 'NB';
    } else if(environment.flag == 'KD') {
      this.site = 'KD';
    }

    if(this.datasForm.flagDigitalSign) {
      this.signTypeList = this.signTypeList.filter((p: any) => ![1,5].includes(p.id));
     }

    this.flagUsbToken[0] = true;
    for(let i = 1; i < this.dataParnterOrganization().length; i++) {
      this.flagUsbToken[i] = false;
    }

    this.isListSignNotPerson = this.signTypeList.filter((p) => ![1, 5].includes(p.id)); // person => sign all,
    this.isListSignNotPerson1 = this.signType_doc.filter((p) => ![1, 5].includes(p.id));

    if (!this.datasForm.is_determine_clone || this.datasForm.is_determine_clone.length == 0) {
      this.datasForm.is_determine_clone = [...this.contractService.getDataDetermineInitializationPartner()];
    }

    // data Tổ chức của tôi
    this.data_organization = this.datasForm.is_determine_clone.filter((p: any) => p.type == 1)[0];

    this.data_organization.name = this.data_organization.name ? this.data_organization.name: this.datasForm.name_origanzation;

    this.is_origanzation_reviewer = this.data_organization.recipients.filter((p: any) => p.role == 2);
    this.is_origanzation_signature = this.data_organization.recipients.filter((p: any) => p.role == 3);
    this.is_origanzation_document = this.data_organization.recipients.filter((p: any) => p.role == 4);

    // data đối tác
    this.data_parnter_organization = this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);

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

  ngAfterViewInit(): void {
    let isRouter = this.route.params.subscribe((params: any) => {
      this.action = params.action;
    }, null, () => {
      isRouter.unsubscribe;
    })
  }

  changeTypeSign(d: any,index?: any,id?: any,role?: any) {
    if (d.login_by == 'phone' || d.login_by == 'email') {
      d.email = '';
      d.phone = '';
    }

    if(d.login_by == 'phone') {
      d.sign_type = d.sign_type.filter((p: any) => ![2].includes(p.id));
    }

    if(role == 'sign_partner') {
        if (d.login_by == 'phone') {
          d.isListSignNotPersonPartner = this.signTypeList.filter((p) => ![1,2,5].includes(p.id));
        } else {
          d.isListSignNotPersonPartner = this.signTypeList.filter((p) => ![1,5].includes(p.id));
        }
    } else if(role == 'signer') {
      if (d.login_by == 'phone') {
        d.isListSignNotPerson = this.signTypeList.filter((p) => ![1, 2, 5].includes(p.id));
      } else {
        d.isListSignNotPerson = this.signTypeList.filter((p) => ![1,5].includes(p.id));
      }
    } else if(role == 'personal') {
      if (d.login_by == 'phone') {
        d.isListSignPersonal = this.signTypeList.filter((p) => ![2].includes(p.id));
      } else {
        d.isListSignPersonal = this.signTypeList;
      }
    }
  }

  getListSignType(role?: any) {
    if(role == 'partner' || role == 'org') {
      return this.signTypeList.filter((p: any) => ![1,5].includes(p.id));
    } else {
      return this.signTypeList;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.step == 'party-contract-form') {
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

  selectPartnerSign(e: any, id: number) {
    if(e.id == 2) {
      this.flagUsbToken[id] = true;
    } else {
      this.flagUsbToken[id] = false;
    }

    this.onItemSelect(e);
  }

  deSelectPartnerSign(e: any, id: number) {
    if(e.id == 2) {
      this.flagUsbToken[id] = false;
    }
  }

  dropdownButtonText = '';

  changeButtonText(text: string) {
    this.dropdownButtonText = text;
  }

  back(e: any, step?: any) {
    this.nextOrPreviousStep(step);
  }

  // next step event
  isCeCaPushNo: boolean = false;
  async next(action: string) {

    if (!this.isOrderValueValid) {
      return
    }
    this.datasForm.is_determine_clone.forEach((items: any, index: number) => {

      this.datasForm.is_determine_clone[index].id = null;

      if (items.type == 3) {
        this.datasForm.is_determine_clone[index].recipients = items.recipients.filter((p: any) => p.role == 3);

        //Cá nhân không ký số không đẩy lên bộ công thương(thông báo với loại hợp đồng ceca_push = 1)
        items.recipients.forEach((ele: any) => {
          if(this.datasForm.ceca_push == 1 && ele.sign_type.length > 0) {
            if(this.datasForm.ceca_push == 1 && ele.sign_type[0].id == 1 || ele.sign_type[0].id == 5) {
              this.isCeCaPushNo = true;
              this.toastService.showWarningHTMLWithTimeout('ceca.reason','',3000)
              return;
            }
          }
        })
      } else if(this.datasForm.is_determine_clone.length == 1 && this.datasForm.is_determine_clone[index].length == 1) {
        this.isCeCaPushNo = true;
        this.toastService.showWarningHTMLWithTimeout('ceca.reason.one.person','',3000)
      }

      for(let i = 0; i < this.datasForm.is_determine_clone[index].recipients.length; i++) {
        this.datasForm.is_determine_clone[index].recipients[i].email = this.datasForm.is_determine_clone[index].recipients[i].email.trim().toLowerCase();
        if(this.datasForm.is_determine_clone[index].recipients[i].login_by == "phone") {
          this.datasForm.is_determine_clone[index].recipients[i].phone = this.datasForm.is_determine_clone[index].recipients[i].email.trim().toLowerCase();
        }
      }
    })

    if(this.isCeCaPushNo) {
      //chuyển ceca_push thành 0
      this.datasForm.ceca_push = 0;
      this.contractService.addContractStep1(this.datasForm, this.datasForm.contract_id).subscribe();
    }

    this.submitted = true;
    if (action == 'save-step' && !this.validData()) {
      if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
        this.save_draft_infor_form.close_header = false;
        this.save_draft_infor_form.close_modal.close();
      }
      return;
    } else {
      this.isButtonDisabled = true;
      let is_save = false;
      if (action == 'save-step') {
        is_save = true;

        this.orgId = this.userService.getInforUser().organization_id;

        let countEkyc = 0;
        let countSMS = 0;

        this.datasForm.is_determine_clone.forEach((items: any, index: number) => {
          items.recipients.forEach((element: any) => {
            if(element.login_by == "email") {
              if(element.sign_type.length > 0 && element.sign_type[0].id == 5) {
                  countEkyc++;
              }else if(element.sign_type.length > 0 && element.sign_type[0].id == 1) {
                  countSMS++;
              }
            } else if(element.login_by == 'phone') {
              if(element.sign_type.length > 0 && element.sign_type[0].id == 1) {
                countSMS = countSMS + 2;
              } else {
                countSMS++;
              }
            }
          })
        })
        this.checkNumber(countEkyc, countSMS);
      } else {
        this.getApiDetermine(is_save);
      }
    }
  }

  async checkNumber(countEkyc: number, countSMS: number) {
    let numberContractUseOrg: any = null;
    let numberContractBuyOrg: any = null;

    //So luong hop dong da dung
    try {
      numberContractUseOrg = await this.unitService.getNumberContractUseOriganzation(this.orgId).toPromise();
    } catch(err) {
      this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin số lượng hợp đồng đã dùng '+err,'',3000);
    }

    //So luong hop dong da mua
    try {
      numberContractBuyOrg = await this.unitService.getNumberContractBuyOriganzation(this.orgId).toPromise();
    } catch(err) {
      this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin số lượng hợp đồng đã mua '+err,'',3000);
    }


    if(countEkyc > 0 && Number(numberContractUseOrg.ekyc) + Number(countEkyc) > Number(numberContractBuyOrg.ekyc)) {
      this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lượng eKYC đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
    } else if(countSMS > 0 && Number(numberContractUseOrg.sms) + Number(countSMS) > Number(numberContractBuyOrg.sms)) {
      this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lượng SMS đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
    } else {
      this.getApiDetermine(true);
    }
  }

  async getApiDetermine(is_save?: boolean) {
      //Đưa giá trị email về chũ thường
      this.datasForm.is_determine_clone.forEach((items: any, index: number) => {
        for(let i = 0; i < this.datasForm.is_determine_clone[index].recipients.length; i++) {
          if(this.datasForm.is_determine_clone[index].recipients[i].email) {
            this.datasForm.is_determine_clone[index].recipients[i].email = this.datasForm.is_determine_clone[index].recipients[i].email.toLowerCase().trim();
          }
        }
    })

    this.datasForm.is_determine_clone.forEach((items: any, index: number) => {
      items.recipients.forEach((element: any) => {

        for(let i = 0; i < this.datasForm.is_determine_clone[index].recipients.length; i++) {
          this.datasForm.is_determine_clone[index].recipients[i].email = this.datasForm.is_determine_clone[index].recipients[i].email.trim().toLowerCase();

          if(this.datasForm.is_determine_clone[index].recipients[i].phone)
            this.datasForm.is_determine_clone[index].recipients[i].phone = this.datasForm.is_determine_clone[index].recipients[i].phone.trim().toLowerCase();
        }

        if (this.action != 'edit') {
          // tạo mới hđ từ mẫu gán id = null
          if (!element.template_recipient_id) {
            if (!element.id) {
              element.id = null;
            }
            element['template_recipient_id'] = element.id;
            element.id = null;
          }
        } else {
          element.template_recipient_id = element.id;
        }
      })

      if (items.type == 3) {
        this.datasForm.is_determine_clone[index].recipients = items.recipients.filter((p: any) => p.role == 3);
      }
        // this.datasForm.is_determine_clone[index].id = null;
    })
    this.spinner.show();
    this.isButtonDisabled = true;

    this.contractService.getContractDetermine(this.datasForm.is_determine_clone, this.datasForm.id).subscribe((res: any) => {
        this.datasForm.is_determine_clone = res;
        this.getDataApiDetermine(res, is_save)
      }, (error: HttpErrorResponse) => {
        if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
          this.save_draft_infor_form.close_header = false;
          this.save_draft_infor_form.close_modal.close();
        }
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!", "", 3000);
      },
    );
  }

  getDataApiDetermine(res: any, is_save?: boolean) {
    if (!is_save) {
      this.spinner.hide();
      if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
        this.save_draft_infor_form.close_header = false;
        this.save_draft_infor_form.close_modal.close();
      }
      this.toastService.showSuccessHTMLWithTimeout("Lưu nháp thành công!", "", 3000)
      void this.router.navigate(['/main/contract/create/draft']);
    } else if (!this.saveDraftStepForm || is_save) {
      if (this.datasForm.is_data_object_signature) {
        this.spinner.hide();
        this.stepForm = variable.stepSampleContractForm.step3;
        this.datasForm.stepLast = this.stepForm;
        this.nextOrPreviousStep(this.stepForm);
      } else {
        this.spinner.show();
        this.contractService.getSignPositionCoordinatesForm(this.datasForm.template_contract_id).subscribe((result: any) => {
          this.spinner.hide();
          this.datasForm['is_data_object_signature'] = result;
          this.datasForm.is_determine_clone = res ? res : this.datasForm.is_determine_clone;
          this.stepForm = variable.stepSampleContractForm.step3;
          this.datasForm.stepLast = this.stepForm;
          this.nextOrPreviousStep(this.stepForm);
        }, () => {
          this.getNotificationValid('error.server');
        })
      }
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datasForm.stepLast = step;
    this.stepChangePartyContractForm.emit(step);
  }

  getDataSignUSBToken(data: any) {
    return data.sign_type.filter((p: any) => p.id == 2);
  }

  onItemSelect(e: any) {
    console.log("e ",e);
    var isParnter = this.dataParnterOrganization().filter((p: any) => p.type == 3); // doi tac ca nhan
    var isOrganization = this.dataParnterOrganization().filter((p: any) => p.type == 2); // doi tac to chuc
    // <==========>

    console.log("1 ");
    if (isParnter.length > 0) {
      for (let i = 0; i < 2; i++) {
        this.getSetOrderingPersonal(isParnter, i);
      }
    }
    // for loop check change ordering with parnter origanization
    this.getSetOrderingParnterOrganization(isOrganization);
    // set again ordering data not option eKYC/img/otp => order
    // var setOrderingOrganization =
    var setOrdering = this.dataParnterOrganization().filter((p: any) => p.type == 2 || p.type == 3 && (p.recipients[0].sign_type.some(({id}: any) => id == 2 || id == 3) || p.recipients[0].sign_type.length == 0));
    var setOrderingParnter = this.dataParnterOrganization().filter((p: any) => p.type == 3 && p.recipients[0].sign_type.some(({id}: any) => id == 1 || id == 5));
    // if (setOrderingParnter.length > 0) {
    if (setOrderingParnter.length == 0) {
      this.data_organization.ordering = 1;
      setOrdering.forEach((val: any, index: number) => {
        val.ordering = index + 2; // + 2 (1: index & 1 index tổ chức của tôi) vì sẽ luôn luôn order sau tổ chức của tôi nếu trong các bên ko có dữ liệu ký eKYC/Image/OTP.
      })
    } else {
      this.data_organization.ordering = setOrderingParnter.length + 1;
      setOrdering.forEach((val: any, index: number) => {
        val.ordering = this.data_organization.ordering + index + 1; // tăng lên 1 ordering sau tổ chức của tôi
      })
    }

    // }
    //
    this.checkCount = 1; // gan lai de lan sau ko bi tang index
  }

  // selectWithOtp(e: any, data: any) {
  //   this.changeOtp(data);
  // }

  selectWithOtp(e: any, data: any, type?: any) { // sort ordering
    //clear lai gia tri card_id
    //Check với tổ chức của tôi ký
    if (type == 'organization') {
      //Nếu là người ký
      if (data.role == 3) {
        if (this.getDataSignHsm(data).length == 0 && this.getDataSignUSBToken(data).length == 0 && this.getDataSignEkyc(data.length) == 0 && this.getDataSignCert(data).length == 0) {
          data.card_id = "";
        }
      }
      //Nếu là văn thư
      else if (data.role == 4) {
        // if (e[0]?.id==6) {
        //   data.card_id = "";
        // }
        // else
         if (this.getDataSignUSBToken(data).length == 0 && this.getDataSignHsm(data).length == 0 && this.getDataSignCert(data).length == 0) {
          this.unitService.getTaxCodeOriganzation(this.userService.getInforUser().organization_id).subscribe((res: any) => {
            data.card_id=res.tax_code;})
        }
      }
    }
    //Nếu là đối tác tổ chức
    else if (type == 2) {
      //Nếu là người ký
      if (data.role == 3) {
        if (this.getDataSignHsm(data).length == 0 && this.getDataSignUSBToken(data).length == 0 && this.getDataSignCert(data).length == 0) {
          data.card_id = "";
        }
      }
      //Nếu là văn thư
      else if (data.role == 4) {
        if (this.getDataSignUSBToken(data).length == 0) {
          data.card_id = "";
        }
      }
    } else if (type == 3) {
      if (this.getDataSignUSBToken(data).length == 0 && this.getDataSignEkyc(data).length == 0 && this.getDataSignCert(data).length == 0) {
        data.card_id = "";
      }

      //Nếu cá nhân chọn loại ký là otp và ký bằng số điện thoại
      if (data.typeSign == 1 && this.getDataSignCka(data).length > 0) {
        data.phone = data.email;
      }
    }

  }

  flagUSBTokenMyOrg = false;

  deSelectOrg(e: any) {
    if(e.id == 2) {
      this.flagUSBTokenMyOrg = false;
    }
  }

  getSetOrderingPersonal(isParnter: any, index: number): void {
    // this.checkCount == 1 => default
    for (let i = 0; i < isParnter.length; i++) {
      if (index == 0) { // only check signature eKYC and image or OTP
        if (isParnter[i].recipients[0].sign_type.length > 0) {
          if (isParnter[i].recipients[0].sign_type.some(({id}: any) => id == 1 || id == 5)) {
            isParnter[i].ordering = this.checkCount;
            this.checkCount++
            // comment
            // you need save checkCount variable => when index data not pass condition
            // cần lưu biến checkCount để khi dữ liệu có index không pass qua điều kiện, sẽ chạy tiếp từ biến cũ chứ ko chạy biến mới theo for loop
          }
        } else {
          isParnter[i].ordering = this.checkCount; // Keep value checkCount variable (avoid case not pass index value);
        }
      }
        // only check signature not eKYC/Image/OTP condition (condition exception)
      // điều kiện chỉ check các dữ liệu không thuộc option đặc biệt
      else {
        if (isParnter[i].recipients[0].sign_type.length > 0) {
          if (isParnter[i].recipients[0].sign_type.some(({id}: any) => id == 2 || id == 3)) {
            //@ts-ignore
            // let count_ordering: number = parseInt(this.getMaxNumberOrderingSign()); // set ordering follow data have max ordering
            // isParnter[i].ordering = this.checkCount + 1;
            // isParnter[i].ordering = count_ordering + 1;
            isParnter[i].ordering = this.datasForm.is_determine_clone.length;
          }
        } else {
          isParnter[i].ordering = this.checkCount;
        }
      }
    }
  }

  getSetOrderingParnterOrganization(isOrganization: any) {
    for (let i = 0; i < isOrganization.length; i++) {
      // only check signature not eKYC/Image/OTP condition (condition exception)
      if (isOrganization[i].recipients[0].sign_type.some(({id}: any) => id == 2 || id == 3)) {
        isOrganization[i].ordering = this.checkCount;
        this.checkCount++;
      } else {
        isOrganization[i].ordering = this.checkCount;
      }
    }
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

  getDataSignCka(data: any) {
    return data.sign_type.filter((p: any) => p.id == 1);
  }

  getDataSignOTP(data: any) {
    return data.sign_type.filter((p: any) => p.id == 2);
  }

  getDataSignEkyc(data: any) {
    return data.sign_type.filter((p: any) => p.id == 5);
  }

  getDataSignHsm(data: any) {
    return data.sign_type.filter((p: any) => p.id == 4);
  }
  getDataSignCert(data: any){
    return data.sign_type.filter((p: any) => p.id == 6);
  }

  pattern_input = parttern_input;
  // valid data step 2
  validData() {
    if(!this.data_organization.name) {
      this.getNotificationValid("Vui lòng nhập tên tổ chức của tôi!");
      return false;
    }

    let count = 0;
    let dataArr = [];
    dataArr = (this.data_organization.recipients).sort((beforeItemRole: any, afterItemRole: any) => beforeItemRole.role - afterItemRole.role);

    for (let i = 0; i < dataArr.length; i++) {
      if (!dataArr[i].name) {
        this.getNotificationValid("Vui lòng nhập tên" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!");
        count++;
        break;
      }

      if(!parttern_input.new_input_form.test(dataArr[i].name)) {
        this.getNotificationValid("Họ tên " + this.getNameObject(dataArr[i].role) + "tổ chức của tôi không được chứa ký tự đặc biệt");
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
        //check chu ky so
        is_duplicate = dataArr[i].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
        if (is_duplicate.length > 1) {
          this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!")
          count++;
          break;
        }
        is_duplicate = [];
        //check chu ky anh
        is_duplicate = dataArr[i].sign_type.filter((p: any) => p.id == 1 || p.id == 5);
        if (is_duplicate.length > 1) {
          this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký ảnh hoặc eKYC của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!")
          count++;
          break;
        }
        is_duplicate = [];
      }

      if (!dataArr[i].phone && dataArr[i].sign_type.filter((p: any) => p.id == 1).length > 0) {
        this.getNotificationValid("Vui lòng nhập số điện thoại của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi!")
        count++;
        break;
      }

      if (!dataArr[i].card_id && dataArr[i].role == 3 && dataArr[i].sign_type.filter((p: any) => p.id == 5).length > 0) {
        this.getNotificationValid("Vui lòng nhập CMT/CCCD của" + this.getNameObject(3) + "tổ chức của tôi!")
        count++;
        break;
      }

      if(dataArr[i].login_by == 'email') {
        if (dataArr[i].email.trim() && !this.pattern.email.test(dataArr[i].email.trim())) {
          this.getNotificationValid("Email của" + this.getNameObject(3) + "tổ chức của tôi không hợp lệ!")
          count++;
          break;
        }
      } else if(dataArr[i].login_by == 'phone') {
        if (dataArr[i].email.trim() && !this.pattern.phone.test(dataArr[i].email.trim())) {
          this.getNotificationValid("SĐT của" + this.getNameObject(3) + "tổ chức của tôi không hợp lệ!")
          count++;
          break;
        }
      }


      // valid phone number
      if (dataArr[i].phone && !this.pattern.phone.test(dataArr[i].phone.trim())) {
        this.getNotificationValid("Số điện thoại của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi không hợp lệ!")
        count++;
        break;
      }

      if(!dataArr[i].card_id.trim() && (dataArr[i].role == 3 || dataArr[i].role == 4) &&
        (dataArr[i].sign_type.filter((p: any) => p.id == 2).length > 0 || dataArr[i].sign_type.filter((p: any) => p.id == 4).length > 0 || dataArr[i].sign_type.filter((p: any) => p.id == 6).length > 0)) {
        this.getNotificationValid("Vui lòng nhập MST/CMT/CCCD của"+this.getNameObject(dataArr[i].role)+"tổ chức của tôi");
        count++;
        break;
      }

      if(dataArr[i].card_id.trim() && !this.pattern.cardid.test(dataArr[i].card_id.trim()) &&
        (dataArr[i].sign_type.filter((p: any) => p.id == 2 || p.id == 6).length > 0 || dataArr[i].sign_type.filter((p: any) => p.id == 4 || p.id == 6).length > 0)) {
        this.getNotificationValid("Mã số thuế/CMT/CCCD của" + this.getNameObject(dataArr[i].role) + "tổ chức của tôi không hợp lệ!");
        count++;
        break;
      }


    }

    if (count == 0) {
      const onlyPartOrg = 'only_party_origanzation';

      if (this.getCheckDuplicateEmail(onlyPartOrg, dataArr)) {
        this.getNotificationValid("Email tổ chức của tôi không được trùng nhau!");
        return false
      }

      if (this.getCheckDuplicatePhone(onlyPartOrg, dataArr)) {
        this.getNotificationValid("Số điện thoại tổ chức của tôi không được trùng nhau!");
        return false
      }

      if (this.getCheckDuplicateCardId(onlyPartOrg, dataArr)) {
        this.getNotificationValid("Mã số thuế/CMT/CCCD tổ chức của tôi không được trùng nhau!");
        return false
      }

    }

    let dataArrPartner = [];
    dataArrPartner = this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
    if (count == 0) {
      // validate phía đối tác
      for (let j = 0; j < dataArrPartner.length; j++) {
        let isParterSort = (dataArrPartner[j].recipients).sort((beforeItemParter: any, afterItemParter: any) => beforeItemParter.role - afterItemParter.role);
        for (let k = 0; k < isParterSort.length; k++) {
          //Tổ chức
          if (dataArrPartner[j].type != 3) {
            if (!dataArrPartner[j].name) {
              this.getNotificationValid("Vui lòng nhập tên của đối tác tổ chức!")
              count++;
              break;
            }

            if (!isParterSort[k].name) {
              this.getNotificationValid("Vui lòng nhập tên" + this.getNameObject(isParterSort[k].role) + " của đối tác!")
              count++;
              break;
            }

            if(!parttern_input.new_input_form.test(isParterSort[k].name)) {
              this.getNotificationValid("Họ tên " + this.getNameObject(isParterSort[k].role) + "tổ chức của tôi không được chứa ký tự đặc biệt");
              count++;
              break;
            }

            if (!isParterSort[k].email) {
              this.getNotificationValid("Vui lòng nhập email" + this.getNameObject(isParterSort[k].role) + " của đối tác!")
              count++;
              break;
            }

            if (isParterSort[k].sign_type.length == 0 && [3, 4].includes(isParterSort[k].role)) {
              this.getNotificationValid("Vui lòng chọn loại ký" + this.getNameObject(isParterSort[k].role) + "của đối tác!")
              count++;
              break;
            } else if (isParterSort[k].sign_type.length > 0 && [3, 4].includes(isParterSort[k].role)) {
              let isPartnerOriganzationDuplicate = [];
              //check chu ky so
              isPartnerOriganzationDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
              if (isPartnerOriganzationDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số" + this.getNameObject(isParterSort[k].role) + "của đối tác!")
                count++;
                break;
              }
              isPartnerOriganzationDuplicate = [];
              //check chu ky anh
              isPartnerOriganzationDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 1 || p.id == 5);
              if (isPartnerOriganzationDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký ảnh hoặc eKYC" + this.getNameObject(isParterSort[k].role) + "của đối tác!")
                count++;
                break;
              }
              isPartnerOriganzationDuplicate = [];
            }

            if (!isParterSort[k].phone && isParterSort[k].sign_type.filter((p: any) => p.id == 1).length > 0) {
              this.getNotificationValid("Vui lòng nhập số điện thoại của" + this.getNameObject(isParterSort[k].role) + "của đối tác!")
              count++;
              break;
            }

            if (!isParterSort[k].card_id && isParterSort[k].role == 3 && isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("Vui lòng CMT/CCCD của" + this.getNameObject(3) + "tổ chức của đối tác!")
              count++;
              break;
            }

            if(isParterSort.login_by == 'email') {
              if (isParterSort[k].email.trim() && !this.pattern.email.test(isParterSort[k].email.trim())) {
                this.getNotificationValid("Email của" + this.getNameObject(isParterSort[k].role) + "của đối tác không hợp lệ!")
                count++;
                break;
              }
            } else if(isParterSort.login_by == 'phone') {
              if (isParterSort[k].email && !this.pattern.phone.test(isParterSort[k].email.trim())) {
                this.getNotificationValid("Email của" + this.getNameObject(isParterSort[k].role) + "của đối tác không hợp lệ!")
                count++;
                break;
              }
            }


            // valid phone number
            if (isParterSort[k].phone && !this.pattern.phone.test(isParterSort[k].phone.trim())) {
              this.getNotificationValid("Số điện thoại" + this.getNameObject(isParterSort[k].role) + "của đối tác không hợp lệ!")
              count++;
              break;
            }

            // valid cccd number
            if (isParterSort[k].card_id.trim() && !this.pattern.card_id9.test(isParterSort[k].card_id.trim()) &&
            !this.pattern.card_id12.test(isParterSort[k].card_id.trim()) &&
              isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("CMT/CCCD" + this.getNameObject(3) + "của đối tác không hợp lệ!")
              count++;
              break;
            }

            if(!isParterSort[k].card_id.trim() && (isParterSort[k].role == 3 || isParterSort[k].role == 4) &&
                (isParterSort[k].sign_type.filter((p: any) => p.id == 2).length > 0 ||
                isParterSort[k].sign_type.filter((p: any) => p.id == 4).length > 0 ||
                isParterSort[k].sign_type.filter((p: any) => p.id == 6).length > 0
              )) {
              this.getNotificationValid("Vui lòng nhập MST/CMT/CCCD của"+this.getNameObject(isParterSort[k].role)+"tổ chức của đối tác");
              count++;
              break;
            }

            if(isParterSort[k].card_id.trim() && !this.pattern.card_id9.test(isParterSort[k].card_id.trim()) &&
              !this.pattern.card_id12.test(isParterSort[k].card_id.trim()) &&
                !this.pattern_input.taxCode_form.test(isParterSort[k].card_id.trim()) &&
                (isParterSort[k].sign_type.filter((p: any) => p.id == 2).length > 0 ||
                  isParterSort[k].sign_type.filter((p: any) => p.id == 4).length > 0 ||
                  isParterSort[k].sign_type.filter((p: any) => p.id == 6).length > 0
              )) {
              this.getNotificationValid("Mã số thuế/CMT/CCCD của" + this.getNameObject(isParterSort[k].role) + "tổ chức của tôi không hợp lệ!");
              count++;
              break;
            }
          }
          //Cá nhân
          else if (dataArrPartner[j].type == 3) {
            if (!isParterSort[k].name && isParterSort[k].role == 3) {
              this.getNotificationValid("Vui lòng nhập tên" + this.getNameObject(isParterSort[k].role) + " của đối tác cá nhân!")
              count++;
              break;
            }

            if (!parttern_input.new_input_form.test(isParterSort[k].name) && isParterSort[k].role == 3) {
              this.getNotificationValid("Họ tên" + this.getNameObject(isParterSort[k].role) + " của đối tác cá nhân không hợp lệ!")
              count++;
              break;
            }

            if (!isParterSort[k].email && isParterSort[k].role == 3) {
              if(isParterSort[k].login_by == 'email') {
                this.getNotificationValid("Vui lòng nhập email" + this.getNameObject(isParterSort[k].role) + " của đối tác cá nhân!")
                count++;
                break;
              } else if(isParterSort[k].login_by == 'phone') {
                this.getNotificationValid("Vui lòng nhập số điện thoại" + this.getNameObject(isParterSort[k].role) + " của đối tác cá nhân!")
                count++;
                break;
              }

            }

            if (isParterSort[k].sign_type.length == 0 && [3, 4].includes(isParterSort[k].role) && isParterSort[k].role == 3) {
              this.getNotificationValid("Vui lòng chọn loại ký của" + this.getNameObject(isParterSort[k].role) + "của đối tác cá nhân!")
              count++;
              break;
            } else if (isParterSort[k].sign_type.length > 0 && [3, 4].includes(isParterSort[k].role) && isParterSort[k].role == 3) {
              let isPartnerCaNhanDuplicate = [];
              //check chu ky so
              isPartnerCaNhanDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
              if (isPartnerCaNhanDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số" + this.getNameObject(isParterSort[k].role) + "của đối tác cá nhân!")
                count++;
                break;
              }
              isPartnerCaNhanDuplicate = [];
              //check chu ky anh
              isPartnerCaNhanDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 1 || p.id == 5);
              if (isPartnerCaNhanDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký ảnh hoặc eKYC" + this.getNameObject(isParterSort[k].role) + "của đối tác cá nhân!")
                count++;
                break;
              }
              isPartnerCaNhanDuplicate = [];

              if(!isParterSort[k].card_id && (isParterSort[k].role == 3 || isParterSort[k].role == 4) && isParterSort[k].sign_type.filter((p: any) => p.id == 2 || p.id == 6).length > 0) {
                this.getNotificationValid("Vui lòng nhập MST/CMT/CCCD của"+this.getNameObject(isParterSort[k].role)+"của đối tác cá nhân");
                count++;
                break;
              }

              if(isParterSort[k].card_id.trim() && !this.pattern.card_id9.test(isParterSort[k].card_id.trim()) &&
                !this.pattern.card_id12.test(isParterSort[k].card_id.trim()) &&
                !this.pattern_input.taxCode_form.test(isParterSort[k].card_id.trim()) && isParterSort[k].sign_type.filter((p: any) => p.id == 2).length > 0) {
                this.getNotificationValid("Mã số thuế/CMT/CCCD của" + this.getNameObject(isParterSort[k].role) + "tổ chức của tôi không hợp lệ!");
                count++;
                break;
              }

              if(isParterSort[k].card_id.trim() && !this.pattern_input.taxCode_form.test(isParterSort[k].card_id.trim()) && isParterSort[k].sign_type.filter((p: any) => p.id == 4 || p.id == 6).length > 0) {
                this.getNotificationValid("Mã số thuế của" + this.getNameObject(isParterSort[k].role) + "tổ chức của đối tác không hợp lệ!");
                count++;
                break;
              }

            }

            if(isParterSort[k].login_by === 'email') {
              if (!isParterSort[k].phone && isParterSort[k].sign_type.filter((p: any) => p.id == 1).length > 0) {
                this.getNotificationValid("Vui lòng nhập số điện thoại" + this.getNameObject(isParterSort[k].role) + "của đối tác cá nhân!")
                count++;
                break;
              }
            }

            if (!isParterSort[k].card_id && isParterSort[k].role == 3 && isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("Vui lòng CMT/CCCD của" + this.getNameObject(3) + "tổ chức của đối tác cá nhân!")
              count++;
              break;
            }

            if(isParterSort[k].login_by === 'email') {
              if (isParterSort[k].email.trim() && !this.pattern.email.test(isParterSort[k].email.trim()) && isParterSort[k].role == 3) {
                this.getNotificationValid("Email" + this.getNameObject(isParterSort[k].role) + " của đối tác cá nhân không hợp lệ!")
                count++;
                break;
              }
            } else if(isParterSort[k].login_by === 'phone') {
              if (isParterSort[k].email && !this.pattern.phone.test(isParterSort[k].email.trim()) && isParterSort[k].role == 3) {
                this.getNotificationValid("SĐT" + this.getNameObject(isParterSort[k].role) + " của đối tác cá nhân không hợp lệ!")
                count++;
                break;
              }
            }

            if (!isParterSort[k].phone && isParterSort[k].sign_type.filter((p: any) => p.id == 1).length > 0) {
              this.getNotificationValid("Vui lòng nhập số điện thoại của" + this.getNameObject(isParterSort[k].role) + "của đối tác!")
              count++;
              break;
            }

            // valid phone number
            if (isParterSort[k].phone && !this.pattern.phone.test(isParterSort[k].phone.trim())) {
              this.getNotificationValid("Số điện thoại" + this.getNameObject(isParterSort[k].role) + "của đối tác cá nhân không hợp lệ!")
              count++;
              break;
            }

            // valid cccd number
            if (isParterSort[k].card_id.trim() && !this.pattern.card_id9.test(isParterSort[k].card_id.trim()) &&
            !this.pattern.card_id12.test(isParterSort[k].card_id.trim()) &&
            isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("CMT/CCCD" + this.getNameObject(3) + "của đối tác cá nhân không hợp lệ!")
              count++;
              break;
            }
          }
        }
      }
    }

    // check trung ten cac doi tac
    let isNameObj: any[] = [];
    for (const d of this.datasForm.is_determine_clone) {
      if (isNameObj.length > 0 && isNameObj.includes(d.name)) {
        this.getNotificationValid("Trùng tên đối tác. Vui lòng kiểm tra lại!");
        return false;
      }
      isNameObj.push(d.name);
    }

    if (count == 0) {
      const onlyPartner = 'only_party_partner';
      const allCheckEmail = 'allCheckEmail';

      if (this.getCheckDuplicateEmail(onlyPartner, dataArrPartner)) {
        this.getNotificationValid('valid.login.user');
        return false
      }

      if (this.getCheckDuplicatePhone(onlyPartner, dataArrPartner)) {
        this.getNotificationValid("Số điện thoại của đối tác không được trùng nhau!");
        return false
      }

      if (this.getCheckDuplicateCardId(onlyPartner, dataArrPartner)) {
        this.getNotificationValid("Mã số thuế/CMT/CCCD đối tác không được trùng nhau!");
        return false
      }

      if (this.getCheckDuplicateEmail(allCheckEmail, this.datasForm.is_determine_clone)) {
        this.getNotificationValid("Email không được trùng nhau giữa các bên tham gia!");
        return false
      }

      if (this.getCheckDuplicatePhone(allCheckEmail, this.datasForm.is_determine_clone)) {
        this.getNotificationValid("Số điện thoại không được trùng nhau giữa các bên tham gia!");
        return false
      }

      if (this.getCheckDuplicateCardId(allCheckEmail, this.datasForm.is_determine_clone)) {
        this.getNotificationValid("Mã số thuế/CMT/CCCD không được trùng nhau giữa các bên tham gia!");
        return false
      }
    }

    if (count == 0) {
      //valid ordering cac ben doi tac - to chuc
      let isOrderingPerson_exception = this.datasForm.is_determine_clone.filter((val: any) => val.type == 3 && val.recipients[0].sign_type.some((p: any) => p.id == 1 || p.id == 5));
      let isOrdering_not_exception = this.datasForm.is_determine_clone.filter((val: any) => val.recipients[0].sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4));
      // valid ordering doi tac ca nhan selected option eKYC/OTP/Image
      if (isOrderingPerson_exception.length > 0) {
        let dataError_ordering = isOrderingPerson_exception.some((val: any) => val.ordering > isOrderingPerson_exception.length);
        if (dataError_ordering) {
          this.getNotificationValid("Người ký với hình thức ký ảnh OTP hoặc eKYC cần thực hiện ký trước hình thức ký số!");
          return false;
        }
      }

      let isCheckOrdering = [];
      for (const d of isOrderingPerson_exception) {
        isCheckOrdering.push(d.ordering);
      }
      let maxOrderingException = Math.max.apply(Math, isCheckOrdering);
      if (!maxOrderingException) {maxOrderingException = 0;}
      if (isOrdering_not_exception.length > 0) {
        // let dataError_ordering = isOrdering_not_exception.some((val: any) => val.ordering <= isOrderingPerson_exception.length);

        let dataError_ordering = isOrdering_not_exception.some((val: any) => val.ordering <= maxOrderingException);
        if (dataError_ordering) {
          this.getNotificationValid("Người ký với hình thức ký ảnh OTP hoặc eKYC cần thực hiện ký trước hình thức ký số!");
          return false;
        }
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
              role: element[j].role,
              type: dataValid[i].type,
              ordering: dataValid[i].ordering
            }
            // arrCheckEmail.push(element[j].email);
            arrEmail.push(items);
          }
        }
      }

      if (arrEmail.some((p: any) => p.role == 1) && arrEmail.some((p: any) => p.role == 3)) {
        if (isParty == 'only_party_partner') {
          arrEmail = arrEmail.filter((p: any) => p.role != 1);
        } else {
          let duplicateEmail: any[] = [];
          let countCheck_duplicate = true;
          for (const d of arrEmail) {
            if (duplicateEmail.length > 0 && duplicateEmail.some((p: any) => p.email == d.email && (p.type != d.type || p.ordering != d.ordering))) { // check duplicate email coordination with between party
              return true;
            }
            duplicateEmail.push(d);
          }
          if (countCheck_duplicate) return false;
        }
      }

      arrEmail.forEach((items: any) => {
        arrCheckEmail.push(items.email)
      })

    } else {
      // valid email tổ chức của tôi
      for (let i = 0; i < dataValid.length; i++) {
        if (dataValid[i].email && dataValid[i].login_by=='email') {
          arrCheckEmail.push(dataValid[i].email);
        }
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckEmail.length; ++k) {
      //   let value = arrCheckEmail[k];
      if (arrCheckEmail[k] in valueSoFar) {
        return true;
      }
      valueSoFar[arrCheckEmail[k]] = true;
    }
    return false;
  }

  getCheckDuplicatePhone(isParty: string, dataValid?: any) {
    let arrCheckPhone = [];
    // valid phone đối tác và các bên tham gia
    if (isParty != 'only_party_origanzation') {
      let arrPhone = [];
      for (let i = 0; i < dataValid.length; i++) {
        const element = dataValid[i].recipients;
        for (let j = 0; j < element.length; j++) {
          if (element[j].phone) {
            let items = {
              phone: (environment.flag == 'KD' && element[j].login_by == 'email') ? null : element[j].phone,
              role: element[j].role,
              type: dataValid[i].type,
              ordering: dataValid[i].ordering
            }
            arrPhone.push(items);
          }
        }
      }

      if (arrPhone.some((p: any) => p.role == 1) && arrPhone.some((p: any) => p.role == 3)) {
        if (isParty == 'only_party_partner') {
          arrPhone = arrPhone.filter((p: any) => p.role != 1);
        } else {
          let duplicatePhone: any[] = [];
          let countCheck_duplicate = true;
          for (const d of arrPhone) {
            if (duplicatePhone.length > 0 && duplicatePhone.some((p: any) => p.phone == d.phone && (p.type != d.type || p.ordering != d.ordering))) { // check duplicate email coordination with between party
              return true;
            }
            duplicatePhone.push(d);
          }
          if (countCheck_duplicate) return false;
        }
      }

      arrPhone.forEach((items: any) => {
        arrCheckPhone.push(items.phone)
      })

    } else {
      // valid email tổ chức của tôi
      for (let i = 0; i < dataValid.length; i++) {
        if ((environment.flag == 'KD' && dataValid[i].login_by=='email' && dataValid[i].role == 3)){
          dataValid[i].phone = ''
        }
        if (dataValid[i].phone) {
          arrCheckPhone.push(dataValid[i].phone);
        }
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckPhone.length; ++k) {
      var value: any = arrCheckPhone[k];
      if (value in valueSoFar) {
        return true;
      }
      valueSoFar[value] = true;
    }
    return false;
  }

  getCheckDuplicateCardId(isParty: string, dataValid?: any) {
    let arrCheckCardId = [];
    // valid card_id đối tác và các bên tham gia
    if (isParty != 'only_party_origanzation') {
      let arrCardId = [];
      for (let i = 0; i < dataValid.length; i++) {
        const element = dataValid[i].recipients;
        for (let j = 0; j < element.length; j++) {
          if (element[j].card_id) {
            let items = {
              card_id: element[j].card_id,
              role: element[j].role,
              type: dataValid[i].type,
              ordering: dataValid[i].ordering
            }
            arrCardId.push(items);
          }
        }
      }

      if (arrCardId.some((p: any) => p.role == 1) && arrCardId.some((p: any) => p.role == 3)) {
        if (isParty == 'only_party_partner') {
          arrCardId = arrCardId.filter((p: any) => p.role != 1);
        } else {
          let duplicateCardId: any[] = [];
          let countCheck_duplicate = true;
          for (const d of arrCardId) {
            if (duplicateCardId.length > 0 && duplicateCardId.some((p: any) => p.card_id == d.card_id && (p.type != d.type || p.ordering != d.ordering))) { // check duplicate card_id coordination with between party
              return true;
            }
            duplicateCardId.push(d);
          }
          if (countCheck_duplicate) return false;
        }
      }

      arrCardId.forEach((items: any) => {
        arrCheckCardId.push(items.card_id)
      })

    } else {
      // valid card_id tổ chức của tôi
      for (let i = 0; i < dataValid.length; i++) {
        if (dataValid[i].card_id) {
          arrCheckCardId.push(dataValid[i].card_id);
        }
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckCardId.length; ++k) {
      var value: any = arrCheckCardId[k];
      if (value in valueSoFar) {
        return true;
      }
      valueSoFar[value] = true;
    }
    return false;
  }

  getNotificationValid(is_notify: string) {
    this.spinner.hide();
    this.toastService.showWarningHTMLWithTimeout(is_notify, "", 3000);
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

  getdatasFormignature(e: any) {

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
    let data = [...this.datasForm.is_determine_clone];
    return data.filter((p: any) => (p.type == 2 || p.type == 3));
  }

  getOriganzationDocument() {
    return this.data_organization.recipients.filter((p: any) => p.role == 4).map((x: any) => {
      if (!x.locale) {
        x.locale = "vi"
      }
      return x
    });
  }

  // tạo đối tượng người điều phối đối tác
  getPartnerCoordination(item: any) {
    // return item.recipients.filter((p: any) => p.role == 1)
    return item.recipients.filter((p: any) => p.role == 1).map((x: any) => {
      if (!x.locale) {
        x.locale = "vi"
      }
      return x
    });
  }

  // tạo đối tượng đ
  getPartnerSignatureIndividual() {

  }

  // tạo mảng người xem xét đối tác
  getPartnerReviewer(item: any) {
    // return item.recipients.filter((p: any) => p.role == 2)
    return item.recipients.filter((p: any) => p.role == 2).map((x: any) => {
      if (!x.locale) {
        x.locale = "vi"
      }
      return x
    });
  }

  getName(e: any, item: any) {
    this.getNameIndividual = e.target.value;
    item.name = e.target.value;

  }

  // tạo mảng người ký đối tác tổ chức
  getPartnerSignature(item: any) {

    // return item.recipients.filter((p: any) => p.role == 3)
    return item.recipients.filter((p: any) => p.role == 3).map((x: any) => {
      if (!x.locale) {
        x.locale = "vi"
      }
      return x
    });
  }

  // tạo mảng đối tượng văn thư tổ chức của tôi
  getPartnerDocument(item: any) {
    // return item.recipients.filter((p: any) => p.role == 4);
    return item.recipients.filter((p: any) => p.role == 4).map((x: any) => {
      if (!x.locale) {
        x.locale = "vi"
      }
      return x
    });
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
    (this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
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
    (this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
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
    (this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  getMaxNumberOrderingSign() {
    let dataPushOrdering = [];
    for (let item of this.datasForm.is_determine_clone) {
      dataPushOrdering.push(item.ordering);
    }
    return Math.max.apply(Math, dataPushOrdering);
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
    (this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  // tạo mảng đối tượng người xem xét tổ chức của tôi
  getOriganzationReviewer() {
    return this.data_organization.recipients.filter((p: any) => p.role == 2).map((x: any) => {
      if (!x.locale) {
        x.locale = "vi"
      }
      return x
    });
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
    //

    return this.data_organization.recipients.filter((p: any) => p.role == 3).map((x: any) => {
      if (!x.locale) {
        x.locale = "vi"
      }
      return x
    });
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
    if (!item.recipients.some((p: any) => p.role == 3)) {
      item.recipients.push({
        name: "",
        email: "",
        phone: "",
        role: 3, // người ký
        ordering: 1,
        status: 0,
        is_otp: 0,
        sign_type: []
      })
    }
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
    // array_empty.forEach((item: any, index: number) => {
    //   item.ordering = index + 1;
    // })
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
    return this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
  }

  // thêm đối tác
  addPartner() {
    let data_partner_add = {};
    let data = [...this.contractService.getDataDetermineInitializationPartner()];
    data_partner_add = data.filter((p: any) => (p.type == 2))[0];
    this.datasForm.is_determine_clone.push(data_partner_add);
    // this.datasForm.is_determine_clone.forEach((res: any, index: number) => {
    //   res.ordering = index + 1;
    // })
    //
    //
    //@ts-ignore
    let is_ordering: number = parseInt(this.getMaxNumberOrderingSign()); // set ordering follow data have max ordering
    this.datasForm.is_determine_clone[this.datasForm.is_determine_clone.length - 1].ordering = is_ordering + 1;
  }


  // xóa đối tham gia bên đối tác
  deletePartner(index: any, item: any) {

    //xoa doi tuong tham gia
    if (item.id && this.router.url.includes('edit')) {
      this.spinner.show();
      this.contractService.deleteParticipantContract(item.id).subscribe((res: any) => {
        if (res.success == true) {
          this.toastService.showSuccessHTMLWithTimeout(`Xóa đối tác thành công!`, "", "3000");
          this.datasForm.is_determine_clone = this.datasForm.is_determine_clone.filter((p: any) => p.id != item.id);
          // this.datasForm.is_determine_clone.splice(index + 1, 1);
        } else {
          this.toastService.showErrorHTMLWithTimeout(`Xóa đối tác thất bại!`, "", "3000");
        }
      }, (error: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout(`Đã xảy ra lỗi!`, "", "3000");
      }, () => {
        this.spinner.hide();
        this.onItemSelect(null);
      })
    } else {
      this.datasForm.is_determine_clone = this.datasForm.is_determine_clone.filter((p: any) => p.id != item.id);

    }
  }

  changeData(item: any, index: any) {
    // this.checkedChange[index]['name'] = name;
    let data_partner_add = {};
    let data = [...this.contractService.getDataDetermine()];
    data_partner_add = data.filter((p: any) => p.type == item.type)[0];
    this.data_parnter_organization[index] = data_partner_add;
  }

  changeType(e: any, item: any, index: number) {
    item.name = "";
    let newArr: any[] = [];

    for (let i = 0; i < item.recipients.length; i++) {
      if (!newArr.some((p: any) => p.role == item.recipients[i].role)) {
        newArr.push(item.recipients[i]);
      }
    }
    if (newArr.length) {
      newArr.forEach((element: any) => {
        if (element.role == 3 || item.type == 3) {
          element.name = "";
          element.email = "";
          element.phone = "";
          element.role = 3; // người ký
          element.ordering = 1;
          element.status = 0;
          element.is_otp = 0;
          element.sign_type = [];
          element.login_by = 'email';
          if (element.id) delete element.id;
        }
      })
    }
    this.datasForm.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3)[index].recipients = newArr;
  }

  // style select otp and phone with signature
  getStyleSignature(data: any) {
    let dataCheck = data.sign_type.filter((p: any) => p.id == 1);
    if (dataCheck.length > 0) {
      return {
        'width': '40%'
      }
    } else return {'width': '90%'}
  }

  doTheSearch($event: Event, indexs: number, action: string): void {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    this.arrSearchNameView = [];
    this.arrSearchNameSignature = [];
    this.arrSearchNameDoc = [];

    setTimeout(() => {
      this.contractService.getAllInfoUser(stringEmitted).subscribe((res) => {
        let arr_all = res;
        let data = arr_all.map((p: any) => (
          environment.flag == 'NB' ? {name: p.name, email: p.email, phone: p.phone} : {name: p.name, email: p.email}
        ));
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

  onSelectName(tData: any, dData: any) {
    dData.name = tData.name;
    dData.email = tData.email;
    dData.phone = tData.phone
    this.arrSearchNameView = [];
    this.arrSearchNameSignature = [];
    this.arrSearchNameDoc = [];
  }

  onChangeValue(e: any, orering_data: string) {
    if (!e.target.value) {
      let data_ordering = document.getElementById(orering_data);
      if (data_ordering)
        data_ordering.focus();
      this.toastService.showErrorHTMLWithTimeout("Bạn chưa nhập thứ tự ký!", "", 3000);
    } else if (e.target.value == 0) {
      let data_ordering = document.getElementById(orering_data);
      if (data_ordering)
      data_ordering.focus();
      this.toastService.showWarningHTMLWithTimeout("Thứ tự đã nhập phải lớn hơn 0", "", 3000);
      this.isOrderValueValid = false
    } else {
      this.isOrderValueValid = true
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
