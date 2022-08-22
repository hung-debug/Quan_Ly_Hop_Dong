import {ContractService} from 'src/app/service/contract.service';
import {Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, ElementRef} from '@angular/core';
import {
  type_signature,
  type_signature_doc,
  type_signature_personal_party,
  variable
} from "../../../../../config/variable";
import {parttern, parttern_input} from "../../../../../config/parttern";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {Helper} from "../../../../../core/Helper";
import * as ContractCreateDetermine from '../../contract_data'
import {elements} from "@interactjs/snappers/all";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../../service/toast.service";
import {Router} from "@angular/router";
import {NgxInputSearchModule} from "ngx-input-search";
import {HttpErrorResponse} from '@angular/common/http';
import { UserService } from 'src/app/service/user.service';
import { UnitService } from 'src/app/service/unit.service';

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

  flagUSBToken = false;
  flagUSBTokenMyOrg = false;
  flagUSBTokenDocument = false;

  data_organization: any;
  data_parnter_organization: any = [];
  data_parnter_individual: any = [];

  is_origanzation_reviewer: any = [];
  is_origanzation_signature: any = [];
  is_origanzation_document: any = {};
  checked: boolean = true;
  checkedChange: any = [];
  pattern = parttern;
  pattern_input = parttern_input;

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

  checkCount = 1;
  isCountNext = 1;

  user: any;
  myTaxCode: any;
  isEditable: boolean;
  isListSignPerson: any;

  email: string="email";
  phone: string="phone";

  get determineContract() {
    return this.determineDetails.controls;
  }

  constructor(
    private userService: UserService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.step = variable.stepSampleContract.step2
  }

  ngOnInit(): void {

    console.log("datas clone ", this.datas.is_determine_clone);

    this.user = this.userService.getInforUser();

    this.isListSignNotPerson = this.signTypeList.filter((p) => ![1, 5].includes(p.id)); // person => sign all,
    this.isListSignPerson = this.signTypeList.filter((p) => ![4].includes(p.id));

    if (!this.datas.is_determine_clone || this.datas.is_determine_clone.length == 0) {
      this.datas.is_determine_clone = [...this.contractService.getDataDetermineInitialization()];

      console.log("on init ", this.datas.is_determine_clone);
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
      itemsShowLimit: 1,
      limitSelection: 1,
      disabledField: 'item_disable',
    };
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
    } else {
      console.log("tiep theo buoc 2 sang buoc 3");
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
        // console.log("abc");
    })
    this.spinner.show();
  
    this.contractService.getContractDetermine(this.datas.is_determine_clone, this.datas.id).subscribe((res: any) => {
      console.log("this.datas.is_determine_clone ", this.datas.is_determine_clone);
      console.log("datas id ", this.datas.id);
      console.log("res get contract ", res);
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
    // }
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
      console.log("next or previous step ");

      console.log("res ",res);
      console.log("data clone 1 ", this.datas.is_determine_clone);

      this.datas.is_determine_clone = res ? res : this.datas.is_determine_clone;

      console.log("data clone 2 ", this.datas.is_determine_clone);

      this.step = variable.stepSampleContract.step3;

      this.datas.stepLast = this.step;

      console.log("data clone 3 ", this.datas.is_determine_clone);

      this.nextOrPreviousStep(this.step);
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;

    console.log("data clone 4 ", this.datas.is_determine_clone);

    this.stepChangeDetermineSigner.emit(step);
  }

  onItemSelect(e: any, data: any) {
    

    console.log("event ",e);

    var isParnter = this.dataParnterOrganization().filter((p: any) => p.type == 3); // doi tac ca nhan
    var isOrganization = this.dataParnterOrganization().filter((p: any) => p.type == 2); // doi tac to chuc
    // <==========>
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
        // val.ordering = setOrderingParnter.length > 0 ? (setOrderingParnter.length + index + 1) : (index + 1);
        // val.ordering = setOrderingParnter.length > 0 ? (this.data_organization.ordering + index + 1) : (index + 1);
        val.ordering = this.data_organization.ordering + index + 1; // tăng lên 1 ordering sau tổ chức của tôi
      })
    }

    // }
    // console.log(setOrdering, setOrderingParnter.length)
    this.checkCount = 1; // gan lai de lan sau ko bi tang index
  }

  deSelectOrg(e: any) {
    if(e.id == 2) {
      this.flagUSBTokenMyOrg = false;
    }
  }

  selectPartnerDocument(e: any) {
    if(e.id == 2) {
      this.flagUSBTokenDocument = true;
      return;
    }

    return;
  }

  deSelectPartnerDocument(e: any,item: any) {
    if(this.getPartnerSignature(item).length == 1) {
      if(e.id == 2) {
        this.flagUSBTokenDocument = false;
      return;
      }
    }

    let count = 0;
    for(let i = 0; i < this.getPartnerSignature(item).length; i++) {
      if(this.getPartnerSignature(item)[i].sign_type.length == 0) {
        count++;
        continue;
      }
      if(this.getPartnerSignature(item)[i].sign_type[0].id == 2) {
        this.flagUSBTokenDocument = true;
        return;
      }
    }

    if(count == this.getPartnerSignature(item).length) {
      this.flagUSBTokenDocument = false;
      return;
    }
  }

  deSelectPartnerSign(e: any, item: any) {
    if(this.getPartnerSignature(item).length == 1) {
      if(e.id == 2) {
      this.flagUSBToken = false;
      return;
      }
    }

    let count = 0;
    for(let i = 0; i < this.getPartnerSignature(item).length; i++) {
      if(this.getPartnerSignature(item)[i].sign_type.length == 0) {
        count++;
        continue;
      }
      if(this.getPartnerSignature(item)[i].sign_type[0].id == 2) {
        this.flagUSBToken = true;
        return;
      }
    }

    if(count == this.getPartnerSignature(item).length) {
      this.flagUSBToken = false;
      return;
    }
  }

  onChangePartnerSign(e: any) {
    console.log("event ", e);
  }

  selectWithOtp(e: any, data: any, type: any) { // sort ordering
    console.log("type ",type);

    //clear lai gia tri card_id
    //Check với tổ chức của tôi ký
    if(type == 'organization') {
      //Nếu là người ký
      if(data.role == 3) {
        if(this.getDataSignHsm(data).length == 0 || this.getDataSignUSBToken(data).length == 0) {
          data.card_id = "";
        }
      }
      //Nếu là văn thư
      else if(data.role == 4) {
        if(this.getDataSignUSBToken(data).length == 0) {
          data.card_id = "";
        }
      }
    } 
      //Nếu là đối tác tổ chức
      if(type == 2) {
          //Nếu là người ký
        if(data.role == 3) {
          if(this.getDataSignHsm(data).length == 0 || this.getDataSignUSBToken(data).length == 0) {
            data.card_id = "";
          }
        }
        //Nếu là văn thư
        else if(data.role == 4) {
          if(this.getDataSignUSBToken(data).length == 0) {
            data.card_id = "";
          }
        }
      } else if(type == 3) {
        if(this.getDataSignUSBToken(data).length == 0 || this.getDataSignEkyc(data).length == 0) {
          data.card_id = "";
        }

        //Nếu cá nhân chọn loại ký là otp và ký bằng số điện thoại
        if(data.typeSign == 1 && this.getDataSignCka(data).length > 0) {
          console.log("vao day ");
          data.phone = data.email;
        }
      }
    
  }

  changeTypeSign(d: any) {
    if(d.login_by == 'phone') {
      d.phone = d.email;
    }

    console.log("d ",d);
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
            let count_ordering: number = parseInt(this.getMaxNumberOrderingSign()); // set ordering follow data have max ordering
            // isParnter[i].ordering = this.checkCount + 1;
            // isParnter[i].ordering = count_ordering + 1;
            isParnter[i].ordering = this.datas.is_determine_clone.length;
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
      // for (let j of isOrganization[i].recipients) {
      //   // điều kiện chỉ check các dữ liệu không thuộc option đặc biệt
      //   if (j.sign_type.length > 0) {
      //     if (j.sign_type.some(({id}: any) => id == 2 || id == 3)) {
      //       j.ordering = this.checkCount;
      //       this.checkCount++;
      //     }
      //   } else {
      //     j.ordering = this.checkCount;
      //   }
      // }
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

  getDataSignUSBToken(data: any) {
    return data.sign_type.filter((p: any) => p.id == 2);
  }

  getDataSignEkyc(data: any) {
    return data.sign_type.filter((p: any) => p.id == 5);
  }

  getDataSignHsm(data: any) {
    return data.sign_type.filter((p: any) => p.id == 4);
  }

  // valid data step 2
  validData() {

    let count = 0;
    let dataArr = [];
    dataArr = (this.data_organization.recipients).sort((beforeItemRole: any, afterItemRole: any) => beforeItemRole.role - afterItemRole.role);

    console.log("dataArr ", dataArr);

    for (let i = 0; i < dataArr.length; i++) {
      if (!dataArr[i].name) {
        this.getNotificationValid("Vui lòng nhập tên" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi!");
        count++;
        break;
      }
      if (!dataArr[i].email) {
        this.getNotificationValid("Vui lòng nhập email" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi!")
        count++;
        break;
      }

      if (dataArr[i].sign_type.length == 0 && dataArr[i].role != 2) {
        this.getNotificationValid("Vui lòng chọn loại ký của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi!")
        count++;
        break;
      } else if (dataArr[i].sign_type.length > 0 && dataArr[i].role != 2) {
        let is_duplicate = [];
        //check chu ky so
        is_duplicate = dataArr[i].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
        if (is_duplicate.length > 1) {
          this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi!")
          count++;
          break;
        }
        is_duplicate = [];
        //check chu ky anh
        is_duplicate = dataArr[i].sign_type.filter((p: any) => p.id == 1 || p.id == 5);
        if (is_duplicate.length > 1) {
          this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký ảnh hoặc eKYC của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi!")
          count++;
          break;
        }
        is_duplicate = [];
      }

      if (!dataArr[i].phone && dataArr[i].sign_type.filter((p: any) => p.id == 1).length > 0) {
        this.getNotificationValid("Vui lòng nhập số điện thoại của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi!")
        count++;
        break;
      }

      if (!dataArr[i].card_id && dataArr[i].role == 3 && dataArr[i].sign_type.filter((p: any) => p.id == 5).length > 0) {
        this.getNotificationValid("Vui lòng nhập CMT/CCCD của" + this.getNameObjectValid(3) + "tổ chức của tôi!")
        count++;
        break;
      }

      if(dataArr[i].login_by == 'email') {
        if (dataArr[i].email && !this.pattern.email.test(dataArr[i].email)) {
          this.getNotificationValid("Email của" + this.getNameObjectValid(3) + "tổ chức của tôi không hợp lệ!")
          count++;
          break;
        }
      } else if(dataArr[i].login_by == 'phone') {
        if (dataArr[i].email && !this.pattern.phone.test(dataArr[i].email)) {
          this.getNotificationValid("SĐT của" + this.getNameObjectValid(3) + "tổ chức của tôi không hợp lệ!")
          count++;
          break;
        }
      }
      

      // valid phone number
      if (dataArr[i].phone && !this.pattern.phone.test(dataArr[i].phone)) {
        this.getNotificationValid("Số điện thoại của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi không hợp lệ!")
        count++;
        break;
      }

      // valid cccd number
      if (dataArr[i].card_id && !this.pattern.card_id.test(dataArr[i].card_id) && dataArr[i].sign_type.filter((p: any) => p.id == 5).length > 0) {
        this.getNotificationValid("CMT/CCCD của" + this.getNameObjectValid(3) + "tổ chức của tôi không hợp lệ!")
        count++;
        break;
      }

      if (!dataArr[i].card_id && dataArr[i].role == 3 && dataArr[i].sign_type.filter((p: any) => p.id == 4).length > 0) {
        console.log("vao day validate ");
        console.log("data ", dataArr[i].card_id)
        this.getNotificationValid("Vui lòng nhập mã số thuế của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi!")
        count++;
        break;
      }

      if(dataArr[i].card_id && dataArr[i].role == 3 && !this.pattern_input.taxCode_form.test(dataArr[i].card_id) && dataArr[i].sign_type.filter((p: any) => p.id == 4).length > 0) {
        this.getNotificationValid("Mã số thuế của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi không hợp lệ!")
        count++;
        break;
      }

      if(!dataArr[i].card_id && (dataArr[i].role == 3 || dataArr[i].role == 4) && dataArr[i].sign_type.filter((p: any) => p.id == 2).length > 0) {
        this.getNotificationValid("Vui lòng nhập MST/CMT/CCCD của"+this.getNameObjectValid(dataArr[i].role)+"tổ chức của tôi");
        count++;
        break;
      }

      if(dataArr[i].card_id && (!this.pattern.card_id.test(dataArr[i].card_id || !this.pattern_input.taxCode_form.test(dataArr[i].card_id))) && dataArr[i].sign_type.filter((p: any) => p.id == 2).length > 0) {
        this.getNotificationValid("Mã số thuế/CMT/CCCD của" + this.getNameObjectValid(dataArr[i].role) + "tổ chức của tôi không hợp lệ!");
        count++;
        break;
      }
    }

    console.log("count my org ",count);
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
        this.getNotificationValid("CMT/CCCD tổ chức của tôi không được trùng nhau!");
        return false
      }

      if(this.getCheckDuplicateTaxCodeHsm(onlyPartOrg,dataArr)) {
        this.getNotificationValid("Mã số thuế tổ chức của tôi không được trùng nhau!");
        return false;
      }

      if(this.getCheckDuplicateTaxCodeUID(onlyPartOrg, dataArr)) {
        this.getNotificationValid("Thông tin trong usb token tổ chức của tôi không được trùng nhau!");
        return false;
      }
    }

    let dataArrPartner = [];
    dataArrPartner = this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
    if (count == 0) {
      // validate phía đối tác
      for (let j = 0; j < dataArrPartner.length; j++) {
        let isParterSort = (dataArrPartner[j].recipients).sort((beforeItemParter: any, afterItemParter: any) => beforeItemParter.role - afterItemParter.role);
        // if (isParterSort.length == 0) {
        //   count++;
        //   this.getNotificationValid("Vui lòng nhập người ký");
        //   break;
        // }
        for (let k = 0; k < isParterSort.length; k++) {
          //Tổ chức
          if (dataArrPartner[j].type != 3) {
            if (!dataArrPartner[j].name) {
              this.getNotificationValid("Vui lòng nhập tên của đối tác tổ chức!")
              count++;
              break;
            }

            if (!isParterSort[k].name) {
              this.getNotificationValid("Vui lòng nhập tên" + this.getNameObjectValid(isParterSort[k].role) + " của đối tác!")
              count++;
              break;
            }
            if (!isParterSort[k].email) {
              this.getNotificationValid("Vui lòng nhập email" + this.getNameObjectValid(isParterSort[k].role) + " của đối tác!")
              count++;
              break;
            }

            if (isParterSort[k].sign_type.length == 0 && [3, 4].includes(isParterSort[k].role)) {
              this.getNotificationValid("Vui lòng chọn loại ký" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác!")
              count++;
              break;
            } else if (isParterSort[k].sign_type.length > 0 && [3, 4].includes(isParterSort[k].role)) {
              let isPartnerOriganzationDuplicate = [];
              //check chu ky so
              isPartnerOriganzationDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
              if (isPartnerOriganzationDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác!")
                count++;
                break;
              }
              isPartnerOriganzationDuplicate = [];
              //check chu ky anh
              isPartnerOriganzationDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 1 || p.id == 5);
              if (isPartnerOriganzationDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký ảnh hoặc eKYC" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác!")
                count++;
                break;
              }
              isPartnerOriganzationDuplicate = [];
            }

            if (!isParterSort[k].phone && isParterSort[k].sign_type.filter((p: any) => p.id == 1).length > 0) {
              this.getNotificationValid("Vui lòng nhập số điện thoại của" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác!")
              count++;
              break;
            }

            if (!isParterSort[k].card_id && isParterSort[k].role == 3 && isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("Vui lòng CMT/CCCD của" + this.getNameObjectValid(3) + "tổ chức của đối tác!")
              count++;
              break;
            }

            if(isParterSort.login_by == 'email') {
              if (isParterSort[k].email && !this.pattern.email.test(isParterSort[k].email)) {
                this.getNotificationValid("Email của" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác không hợp lệ!")
                count++;
                break;
              }
            } else if(isParterSort.login_by == 'phone') {
              if (isParterSort[k].email && !this.pattern.phone.test(isParterSort[k].email)) {
                this.getNotificationValid("Email của" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác không hợp lệ!")
                count++;
                break;
              }
            }
          

            // valid phone number
            if (isParterSort[k].phone && !this.pattern.phone.test(isParterSort[k].phone)) {
              this.getNotificationValid("Số điện thoại" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác không hợp lệ!")
              count++;
              break;
            }

            // valid cccd number
            if (isParterSort[k].card_id && !this.pattern.card_id.test(isParterSort[k].card_id) && isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("CMT/CCCD" + this.getNameObjectValid(3) + "của đối tác không hợp lệ!")
              count++;
              break;
            }

            if(!isParterSort[k].card_id && (isParterSort[k].role == 3 || isParterSort[k].role == 4) && isParterSort[k].sign_type.filter((p: any) => p.id == 2).length > 0) {
              this.getNotificationValid("Vui lòng nhập MST/CMT/CCCD của"+this.getNameObjectValid(isParterSort[k].role)+"tổ chức của đối tác");
              count++;
              break;
            }

            if(isParterSort[k].card_id && (!this.pattern.card_id.test(isParterSort[k].card_id || !this.pattern_input.taxCode_form.test(isParterSort[k].card_id))) && isParterSort[k].sign_type.filter((p: any) => p.id == 2).length > 0) {
              this.getNotificationValid("Mã số thuế/CMT/CCCD của" + this.getNameObjectValid(isParterSort[k].role) + "tổ chức của đối tác không hợp lệ!");
              count++;
              break;
            }

            if(!isParterSort[k].card_id && isParterSort[k].role == 3 && isParterSort[k].sign_type.filter((p: any) => p.id == 4).length > 0) {
              this.getNotificationValid("Vui lòng nhập mã số thuế của"+this.getNameObjectValid(isParterSort[k].role)+"tổ chức của đối tác");
              count++;
              break;
            }

            if(isParterSort[k].card_id && !this.pattern_input.taxCode_form.test(isParterSort[k].card_id) && isParterSort[k].sign_type.filter((p: any) => p.id == 4).length > 0) {
              this.getNotificationValid("Mã số thuế của" + this.getNameObjectValid(isParterSort[k].role) + "tổ chức của đối tác không hợp lệ!");
              count++;
              break;
            }
          }
          //Cá nhân
          else if (dataArrPartner[j].type == 3) {
            if (!isParterSort[k].name && isParterSort[k].role == 3) {
              this.getNotificationValid("Vui lòng nhập tên" + this.getNameObjectValid(isParterSort[k].role) + " của đối tác cá nhân!")
              count++;
              break;
            }
            if (!isParterSort[k].email && isParterSort[k].role == 3) {
              this.getNotificationValid("Vui lòng nhập email" + this.getNameObjectValid(isParterSort[k].role) + " của đối tác cá nhân!")
              count++;
              break;
            }

            if (isParterSort[k].sign_type.length == 0 && [3, 4].includes(isParterSort[k].role) && isParterSort[k].role == 3) {
              this.getNotificationValid("Vui lòng chọn loại ký của" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác cá nhân!")
              count++;
              break;
            } else if (isParterSort[k].sign_type.length > 0 && [3, 4].includes(isParterSort[k].role) && isParterSort[k].role == 3) {
              let isPartnerCaNhanDuplicate = [];
              //check chu ky so
              isPartnerCaNhanDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
              if (isPartnerCaNhanDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác cá nhân!")
                count++;
                break;
              }
              isPartnerCaNhanDuplicate = [];
              //check chu ky anh
              isPartnerCaNhanDuplicate = isParterSort[k].sign_type.filter((p: any) => p.id == 1 || p.id == 5);
              if (isPartnerCaNhanDuplicate.length > 1) {
                this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký ảnh hoặc eKYC" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác cá nhân!")
                count++;
                break;
              }
              isPartnerCaNhanDuplicate = [];

              if(!isParterSort[k].card_id && (isParterSort[k].role == 3 || isParterSort[k].role == 4) && isParterSort[k].sign_type.filter((p: any) => p.id == 2).length > 0) {
                this.getNotificationValid("Vui lòng nhập MST/CMT/CCCD của"+this.getNameObjectValid(isParterSort[k].role)+"của đối tác cá nhân");
                count++;
                break;
              }

              if(isParterSort[k].card_id && (!this.pattern.card_id.test(isParterSort[k].card_id || !this.pattern_input.taxCode_form.test(isParterSort[k].card_id))) && isParterSort[k].sign_type.filter((p: any) => p.id == 2).length > 0) {
                this.getNotificationValid("Mã số thuế/CMT/CCCD của" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác cá nhân không hợp lệ!");
                count++;
                break;
              }
            }

            if(isParterSort[k].login_by === 'email') {
              if (!isParterSort[k].phone && isParterSort[k].sign_type.filter((p: any) => p.id == 1).length > 0) {
                this.getNotificationValid("Vui lòng nhập số điện thoại" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác cá nhân!")
                count++;
                break;
              }
            }

            if (!isParterSort[k].card_id && isParterSort[k].role == 3 && isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("Vui lòng CMT/CCCD của" + this.getNameObjectValid(3) + "tổ chức của đối tác cá nhân!")
              count++;
              break;
            }

            if(isParterSort[k].login_by === 'email') {
              if (isParterSort[k].email && !this.pattern.email.test(isParterSort[k].email) && isParterSort[k].role == 3) {
                this.getNotificationValid("Email" + this.getNameObjectValid(isParterSort[k].role) + " của đối tác cá nhân không hợp lệ!")
                count++;
                break;
              }
            } else if(isParterSort[k].login_by === 'phone') {
              if (isParterSort[k].email && !this.pattern.phone.test(isParterSort[k].email) && isParterSort[k].role == 3) {
                this.getNotificationValid("SĐT" + this.getNameObjectValid(isParterSort[k].role) + " của đối tác cá nhân không hợp lệ!")
                count++;
                break;
              }
            }

            // valid phone number
            if (isParterSort[k].phone && !this.pattern.phone.test(isParterSort[k].phone)) {
              this.getNotificationValid("Số điện thoại" + this.getNameObjectValid(isParterSort[k].role) + "của đối tác cá nhân không hợp lệ!")
              count++;
              break;
            }

            // valid cccd number
            if (isParterSort[k].card_id && !this.pattern.card_id.test(isParterSort[k].card_id) && isParterSort[k].sign_type.filter((p: any) => p.id == 5).length > 0) {
              this.getNotificationValid("CMT/CCCD" + this.getNameObjectValid(3) + "của đối tác cá nhân không hợp lệ!")
              count++;
              break;
            }
          }
        }
      }
    }

    // check trung ten cac doi tac
    let isNameObj: any[] = [];
    for (const d of this.datas.is_determine_clone) {
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
        this.getNotificationValid("Email hoặc số điện thoại của đối tác không được trùng nhau!");
        return false
      }

      if (this.getCheckDuplicatePhone(onlyPartner, dataArrPartner)) {
        this.getNotificationValid("Số điện thoại hoặc email đối tác không được trùng nhau!");
        return false
      }

      if (this.getCheckDuplicateCardId(onlyPartner, dataArrPartner)) {
        this.getNotificationValid("CMT/CCCD đối tác không được trùng nhau!");
        return false
      }

      if(this.getCheckDuplicateTaxCodeHsm(onlyPartner, dataArrPartner)) {
        this.getNotificationValid("Mã số thuế của đối tác không được trùng nhau");
        return false;
      }

      if(this.getCheckDuplicateTaxCodeUID(onlyPartner, dataArrPartner)) {
        this.getNotificationValid("Thông tin trong usb token của đối tác không được trùng nhau");
        return false;
      }

      if (this.getCheckDuplicateEmail(allCheckEmail, this.datas.is_determine_clone)) {
        this.getNotificationValid("Email không được trùng nhau giữa các bên tham gia!");
        return false
      }

      if (this.getCheckDuplicatePhone(allCheckEmail, this.datas.is_determine_clone)) {
        this.getNotificationValid("Số điện thoại không được trùng nhau giữa các bên tham gia!");
        return false
      }

      if (this.getCheckDuplicateCardId(allCheckEmail, this.datas.is_determine_clone)) {
        this.getNotificationValid("CMT/CCCD không được trùng nhau giữa các bên tham gia!");
        return false
      }

      if(this.getCheckDuplicateTaxCodeHsm(allCheckEmail, this.datas.is_determine_clone)) {
        this.getNotificationValid("Mã số thuế không được trùng nhau giữa các bên tham gia");
        return false;
      }

      if(this.getCheckDuplicateTaxCodeUID(allCheckEmail, this.datas.is_determine_clone)) {
        this.getNotificationValid("Thông tin trong usb token không được trùng nhau giữa các bên tham gia");
        return false;
      }
    }

    if (count == 0) {
      //valid ordering cac ben doi tac - to chuc
      let isOrderingPerson_exception = this.datas.is_determine_clone.filter((val: any) => val.type == 3 && val.recipients[0].sign_type.some((p: any) => p.id == 1 || p.id == 5));
      let isOrdering_not_exception = this.datas.is_determine_clone.filter((val: any) => val.recipients[0].sign_type.some((p: any) => p.id == 2 || p.id == 3));
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

  getCheckDuplicateTaxCodeUID(isParty: string, dataValid: any) {
    let arrCheckTaxCode = [];

    if (isParty != 'only_party_origanzation') {
      let arrTaxCode = [];
      for (let i = 0; i < dataValid.length; i++) {
        const element = dataValid[i].recipients;
        for (let j = 0; j < element.length; j++) {
          if (element[j].card_id) {
            let items = {
              email: element[j].card_id,
              role: element[j].role,
              type: dataValid[i].type,
              ordering: dataValid[i].ordering
            }
            // arrCheckEmail.push(element[j].email);
            arrTaxCode.push(items);
          }
        }
      }

      if (arrTaxCode.some((p: any) => p.role == 1) && arrTaxCode.some((p: any) => p.role == 3)) {
        if (isParty == 'only_party_partner') {
          arrTaxCode = arrTaxCode.filter((p: any) => p.role != 1);
        } else {
          let duplicateEmail: any[] = [];
          let countCheck_duplicate = true;
          for (const d of arrTaxCode) {
            if (duplicateEmail.length > 0 && duplicateEmail.some((p: any) => p.email == d.email && (p.type != d.type || p.ordering != d.ordering))) { // check duplicate email coordination with between party
              return true;
            }
            duplicateEmail.push(d);
          }
          if (countCheck_duplicate) return false;
        }
      }

      arrTaxCode.forEach((items: any) => {
        arrCheckTaxCode.push(items.email)
      })

    } else {
      for (let i = 0; i < dataValid.length; i++) {
        if (dataValid[i].card_id) {
          arrCheckTaxCode.push(dataValid[i].card_id);
        }
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckTaxCode.length; ++k) {
      console.log("arr check tax code ", arrCheckTaxCode[k]);
      var value: any = arrCheckTaxCode[k];
      if (value in valueSoFar) {
        return true;
      }
      valueSoFar[value] = true;
    }
    return false;
  }

  getCheckDuplicateTaxCodeHsm(isParty: string, dataValid: any) {
    let arrCheckTaxCode = [];

    if (isParty != 'only_party_origanzation') {
      let arrTaxCode = [];
      for (let i = 0; i < dataValid.length; i++) {
        const element = dataValid[i].recipients;
        for (let j = 0; j < element.length; j++) {
          if (element[j].card_id) {
            let items = {
              email: element[j].card_id,
              role: element[j].role,
              type: dataValid[i].type,
              ordering: dataValid[i].ordering
            }
            // arrCheckEmail.push(element[j].email);
            arrTaxCode.push(items);
          }
        }
      }

      if (arrTaxCode.some((p: any) => p.role == 1) && arrTaxCode.some((p: any) => p.role == 3)) {
        if (isParty == 'only_party_partner') {
          arrTaxCode = arrTaxCode.filter((p: any) => p.role != 1);
        } else {
          let duplicateEmail: any[] = [];
          let countCheck_duplicate = true;
          for (const d of arrTaxCode) {
            if (duplicateEmail.length > 0 && duplicateEmail.some((p: any) => p.email == d.email && (p.type != d.type || p.ordering != d.ordering))) { // check duplicate email coordination with between party
              return true;
            }
            duplicateEmail.push(d);
          }
          if (countCheck_duplicate) return false;
        }
      }

      arrTaxCode.forEach((items: any) => {
        arrCheckTaxCode.push(items.email)
      })

    } else {
      for (let i = 0; i < dataValid.length; i++) {
        if (dataValid[i].card_id) {
          arrCheckTaxCode.push(dataValid[i].card_id);
        }
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckTaxCode.length; ++k) {
      console.log("arr check tax code ", arrCheckTaxCode[k]);
      var value: any = arrCheckTaxCode[k];
      if (value in valueSoFar) {
        return true;
      }
      valueSoFar[value] = true;
    }
    return false;
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
        if (dataValid[i].email) {
          arrCheckEmail.push(dataValid[i].email);
        }
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckEmail.length; ++k) {
      var value: any = arrCheckEmail[k];
      if (value in valueSoFar) {
        return true;
      }
      valueSoFar[value] = true;
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
              phone: element[j].phone,
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
    return item.recipients.filter((p: any) => p.role == 3);
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

  countOrgDoc: number = 0;
  addOriganzationDocument() {
    this.countOrgDoc++;

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
    // @ts-ignore
    // let is_ordering: number = parseInt(this.getMaxNumberOrderingSign(count_data)); // set ordering follow data have max ordering
    data.ordering = count_data.length + 1;
    // data.ordering = is_ordering + 1;
    // this.data_parnter_organization[index].recipients.push(data);
    (this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3))[index].recipients.push(data);
  }

  getMaxNumberOrderingSign() { //count_data: any
    let dataPushOrdering = [];
    for (let item of this.datas.is_determine_clone) {
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
    if (!item.recipients.some((p: any) => p.role == 3)) {
      item.recipients.push({
        name: "",
        email: "",
        phone: "",
        card_id: "",
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
    // for loop set ordering <==> comment code because case set ordering with option eKYC/Image/OTP not auto set ordering.
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
    return this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3);
  }

  // thêm đối tác
  addPartner() {
    let data_partner_add = {};
    let data = [...this.contractService.getDataDetermineInitialization()];
    data_partner_add = data.filter((p: any) => (p.type == 2))[0];
    this.datas.is_determine_clone.push(data_partner_add);
    // @ts-ignore
    let is_ordering: number = parseInt(this.getMaxNumberOrderingSign()); // set ordering follow data have max ordering
    this.datas.is_determine_clone[this.datas.is_determine_clone.length - 1].ordering = is_ordering + 1;
  }

  // xóa đối tham gia bên đối tác
  deletePartner(index: any, item: any) {
    //xoa doi tuong tham gia
    if (item.id) {
      this.spinner.show();
      this.contractService.deleteParticipantContract(item.id).subscribe((res: any) => {
        if (res.success == true) {
          this.toastService.showSuccessHTMLWithTimeout(`Xóa đối tác thành công!`, "", "3000");
          this.datas.is_determine_clone = this.datas.is_determine_clone.filter((p: any) => p.id != item.id);
          // this.datas.is_determine_clone.splice(index + 1, 1);
        } else {
          this.toastService.showErrorHTMLWithTimeout(`Xóa đối tác thất bại!`, "", "3000");
        }
      }, (error: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout(`Đã xảy ra lỗi!`, "", "3000");
      }, () => {
        this.spinner.hide();
        this.onItemSelect(null, null);
      })
    } else {
      // this.datas.is_determine_clone.splice(index + 1, 1);
      this.datas.is_determine_clone = this.datas.is_determine_clone.filter((p: any) => p.ordering != item.ordering);
      this.onItemSelect(null, null);
      // this.datas.is_determine_clone.forEach((res: any, index: number) => {
      //   res.ordering = index + 1;
      // })
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
    // console.log(item, e);
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
          element.card_id = "";
          element.role = 3; // người ký
          element.ordering = 1;
          element.status = 0;
          element.is_otp = 0;
          element.sign_type = [];
          if (element.id) delete element.id;
        }
      })
    }
    this.datas.is_determine_clone.filter((p: any) => p.type == 2 || p.type == 3)[index].recipients = newArr;
    // if (item.type == 3) {
    // this.data_organization.ordering = 2;
    // item.ordering = 1;
    // this.is_change_party = true;
    // } else {
    // this.data_organization.ordering = 1;
    // item.ordering = 2;
    // this.is_change_party = false;
    // }
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
      this.contractService.getNameOrganization("", stringEmitted).subscribe((res) => {
        let arr_all = res.entities;
        let data = arr_all.map((p: any) => ({name: p.name, email: p.email, phone: p.phone}));
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
    dData.phone = tData.phone;
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
      this.toastService.showWarningHTMLWithTimeout("Bạn chưa nhập thứ tự ký!", "", 3000);
    }
  }

  deleteElement(dataArrClone: any, assignElement: string) {
    this.spinner.show();
    let count = 0;
    this.contractService.deleteInfoContractSignature(dataArrClone.fields[0].id).subscribe((res: any) => {
      this.toastService.showSuccessHTMLWithTimeout(`Bạn đã xóa ${assignElement} ${dataArrClone.name}!`, "", "3000");
    }, (error: HttpErrorResponse) => {
      this.toastService.showErrorHTMLWithTimeout(`Đã xảy ra lỗi!`, "", "3000");
      this.spinner.hide();
      count = 1;
    }, () => {
      this.spinner.hide();
    })

    return count == 0;
  }


}

