import { ToastService } from './../../../service/toast.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { parttern, parttern_input } from 'src/app/config/parttern';
import {Route, ActivatedRoute, Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { type_signature, org_customer_clone, personal_customer_clone,
clone_load_org_customer, clone_load_personal_customer, type_signature_doc} from 'src/app/config/variable';
import { AppService } from 'src/app/service/app.service';
import { Customer, CustomerService, OrgCustomer, PersonalCustomer, SignType } from 'src/app/service/customer.service';
import { includes } from 'lodash';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit, OnDestroy {
  isOrg: boolean;

  //dropdown
  signTypeList: Array<SignType> = type_signature;
  signType_doc: Array<SignType> = type_signature_doc;
  dropdownSignTypeSettings: any = {};
  email: string = "email";
  phone: string = "phone";

  isListSignNotPerson: any[] = [];
  isListSignNotPersonPartner: any[] = [];
  isListSignPersonal: any[] = [];
  id: any;
  action: any;
  orgCustomer: OrgCustomer = clone_load_org_customer;
  personalCustomer: PersonalCustomer = clone_load_personal_customer;
  site: string;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private customerService: CustomerService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }

    this.route.params.subscribe(params => {
      this.action = params['action'];
      const type = params['type'];
      this.id = params['id'];
      if(type == 'organization'){
        this.isOrg = true;
        this.appService.setTitle("organization.customer.add");
        sessionStorage.setItem('partnerType', 'ORGANIZATION');
        if(this.action == 'add')
        this.orgCustomer= JSON.parse(JSON.stringify(org_customer_clone));
        if(this.action == 'edit'){
          this.customerService.getCustomerList().subscribe((res: any) => {
            this.orgCustomer = res.filter((item: any) => {

                 return item.id.toString() === this.id;
             })[0]})
        }
      }
      else{
        if(type == 'personal'){
        this.isOrg = false;
        this.appService.setTitle("personal.customer.add");
        sessionStorage.setItem('partnerType', 'PERSONAL');
      }
      if(this.action == 'add')
      this.personalCustomer = JSON.parse(JSON.stringify(personal_customer_clone));
      else {
        this.customerService.getCustomerList().subscribe((res: any) => {
          this.personalCustomer = res.filter((item: any) => {

               return item.id.toString() === this.id;
           })[0]})
      }
    }})

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

  dropdownButtonText = '';

  getOrganizationHandler(role: string){
    let handlers: any = [];
    handlers = this.orgCustomer.handlers?.filter(
      (handler: any) => handler.role == role
    );

    return handlers;
  }

  deleteOrganizationHandler(i: any, role: string){
    let arr_clone = this.orgCustomer.handlers.filter(
      (handler) => handler.role == role
    );
    let arr_clone_dif =  this.orgCustomer.handlers.filter(
      (handler) => handler.role != role
    );
    const array_empty: any[] = [];
    let new_arr: any[] = [];
    arr_clone.forEach((handler: any, index: number) => {
        if(index != i)
        array_empty.push(handler);
    })
    array_empty.forEach((handler: any, index: number) => {
      handler.ordering = index + 1;
    })
    new_arr = arr_clone_dif.concat(array_empty);
    this.orgCustomer.handlers = new_arr;
    if(role == 'COORDINATOR'){
      if(this.getOrganizationHandler('SIGNER').length == 0)
      this.addOrganizationHandler('SIGNER');
    }
    // if(arr_clone[i])
  }

  addOrganizationHandler(role: string){
    let data_add = this.customerService.getDataOrgCustomer().handlers.filter(
      (handler) => handler.role == role
    );
    let data=data_add[0];
    if(this.getOrganizationHandler(role).length){
    data.ordering = this.getOrganizationHandler(role).length + 1;}
    else{
      data.ordering = 1;
    }

    this.orgCustomer.handlers?.push(data);
  }

  onCancel(){
    this.router.navigate(['/main/customer'])
  }

  get getContractConnectItems() {
    return this.signTypeList.reduce((acc: any, curr: any) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  onChangeValue(e: any, orering_data: string) {
    if (!e.target.value) {
      let data_ordering = document.getElementById(orering_data);
      if (data_ordering)
        data_ordering.focus();
      this.toastService.showWarningHTMLWithTimeout("Bạn chưa nhập thứ tự ký!", "", 3000);
    }
  }

  getDataSignCka(data: any) {
    return data.signType.filter((p: any) => p.id == 1);
  }

  getDataSignUSBToken(data: any) {
    return data.signType.filter((p: any) => p.id == 2);
  }

  getDataSignEkyc(data: any) {
    return data.signType.filter((p: any) => p.id == 5);
  }

  getDataSignHsm(data: any) {
    return data.signType.filter((p: any) => p.id == 4);
  }

  getDataSignCert(data: any){
    return data.signType.filter((p: any) => p.id == 6);
  }


  selectWithOtp(e: any, data: any, type?: any){
      if (data.role == 'SIGNER') {
        if (this.getDataSignHsm(data).length == 0 && this.getDataSignUSBToken(data).length == 0 && this.getDataSignCert(data).length == 0) {
          data.card_id = "";
        }
      }
      //Nếu là văn thư
      else if (data.role == 'ARCHIVER') {
        if (this.getDataSignUSBToken(data).length == 0 && this.getDataSignHsm(data).length == 0 ) {
          data.card_id = "";
        }
      }

  }

  getListSignType(role?: any) {
    if(role == 'org') {
      return this.signTypeList.filter((p: any) => ![1,5].includes(p.id));
    } else {
      return this.signTypeList;
    }
  }

  getNotificationValid(is_notify: string) {
    this.spinner.hide();
    this.toastService.showWarningHTMLWithTimeout(is_notify, "", 3000);
  }

  validData(){
    let dataArrPartner: any = {};
    if(this.isOrg){

    } else {
      dataArrPartner = this.personalCustomer;
    }
      // validate phía đối tác
      if (this.isOrg) {
        dataArrPartner = this.orgCustomer;
        let isPartnerSort = dataArrPartner.handlers
        for (let k = 0; k < isPartnerSort.length; k++) {
          //Tổ chức
            if (!dataArrPartner.name) {
              this.getNotificationValid("Vui lòng nhập tên tổ chức!")
              return false;
            }

            if(!dataArrPartner.taxCode) {
              this.getNotificationValid("Vui lòng nhập mã số thuế của tổ chức!")
              return false;
            }

            if(!parttern_input.taxCode_form.test(dataArrPartner.taxCode)){
              this.getNotificationValid("Mã số thuế của tổ chức không hợp lệ!")
              return false;
            }

            if (!isPartnerSort[k].name) {
              this.getNotificationValid("Vui lòng nhập tên " + this.getNameObjectValid(isPartnerSort[k].role) + " !")
              return false;
            }

            if (!isPartnerSort[k].email) {
              if(isPartnerSort[k].login_by == 'email') {
                this.getNotificationValid("Vui lòng nhập email " + this.getNameObjectValid(isPartnerSort[k].role) + " !")
                return false;
              } else if(isPartnerSort[k].login_by == 'phone') {
                this.getNotificationValid("Vui lòng nhập SĐT " + this.getNameObjectValid(isPartnerSort[k].role) + " !")
                return false;
              }
            }

            if(!parttern_input.new_input_form.test(isPartnerSort[k].name)) {
              this.getNotificationValid("Họ tên " + this.getNameObjectValid(isPartnerSort[k].role) + " của tổ chức không được chứa ký tự đặc biệt");
              return false;
            }

            if (isPartnerSort[k]?.signType.length == 0 && ((isPartnerSort[k].role == 'SIGNER') || (isPartnerSort[k].role == 'ARCHIVER'))) {
              this.getNotificationValid("Vui lòng chọn loại ký " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
              return false;
            }

            if(isPartnerSort[k].signType.length != 0 && (isPartnerSort[k].role == 'SIGNER' || isPartnerSort[k].role == 'ARCHIVER')){
              if(isPartnerSort[k].signType[0].id == 2 || isPartnerSort[k].signType[0].id == 6){
                if(!isPartnerSort[k].card_id){
                  this.getNotificationValid("Vui lòng nhập mã số thuế/CMT/CCCD của " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
                  return false;
                }
                if(!parttern.cardid.test(isPartnerSort[k].card_id)){
                  this.getNotificationValid("Mã số thuế/CMT/CCCD của " + this.getNameObjectValid(isPartnerSort[k].role) + " không hợp lệ!")
                  return false;
                }
              }
              if(isPartnerSort[k].signType[0].id == 4){
                if(!isPartnerSort[k].card_id){
                  this.getNotificationValid("Vui lòng nhập mã số thuế/CMT/CCCD HSM của " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
                  return false;
                }
                if(!parttern.cardid.test(isPartnerSort[k].card_id)){
                  this.getNotificationValid("Mã số thuế/CMT/CCCD HSM của " + this.getNameObjectValid(isPartnerSort[k].role) + " không hợp lệ!")
                  return false;
                }
              }
            }

            if (!isPartnerSort[k].phone && isPartnerSort[k].login_by == 'phone') {
              this.getNotificationValid("Vui lòng nhập số điện thoại của " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
              return false;
            }

            // valid phone number
            if (isPartnerSort[k].phone && !parttern.phone.test(isPartnerSort[k].phone.trim())) {
              this.getNotificationValid("Số điện thoại " + this.getNameObjectValid(isPartnerSort[k].role) + " không hợp lệ!")
              return false;
            }
            // check duplicate
            if (isPartnerSort[k].phone != '' && this.getCheckDuplicateValue('phone', dataArrPartner)) {
              this.getNotificationValid("Số điện thoại của tổ chức không được trùng nhau!")
              return false;
            }

            if(this.getCheckDuplicateValue('email', dataArrPartner)){
              this.getNotificationValid("valid.login.user")
              return false;
            }

            if(this.getCheckDuplicateValue('card_id', dataArrPartner)){
              this.getNotificationValid("Mã số thuế/CMT/CCCD của tổ chức không được trùng nhau!");
              return false;
            }
          }
          } else if(this.isOrg == false)
          //Cá nhân
          {
            dataArrPartner = this.personalCustomer;
            let personalData = dataArrPartner;
            if (!personalData.name) {
              this.getNotificationValid("Vui lòng nhập tên" + this.getNameObjectValid('SIGNER') + "  cá nhân!")
              return false;
            }

            if (!parttern_input.new_input_form.test(personalData.name)) {
              this.getNotificationValid("Họ tên" + this.getNameObjectValid('SIGNER') + "  cá nhân không hợp lệ!")
              return false;
            }

            if (!personalData.email && personalData.login_by == 'email') {
              this.getNotificationValid("Vui lòng nhập email" + this.getNameObjectValid('SIGNER') + "  cá nhân!")
              return false;
            }

            if (!parttern.email.test(personalData.email.trim())) {
              this.getNotificationValid("Email" + this.getNameObjectValid('SIGNER') + "  cá nhân không hợp lệ!")
              return false;
            }

            if (personalData.signType.length == 0) {
              this.getNotificationValid("Vui lòng chọn loại ký của" + this.getNameObjectValid('SIGNER') + " cá nhân!"
              )
              return false;
            }

            if(personalData.login_by == 'phone' || personalData.signType[0].id == 1){
              if (!personalData.phone) {
                this.getNotificationValid("Vui lòng nhập số điện thoại" + this.getNameObjectValid('SIGNER') + "  cá nhân!")
                return false;
              }
            }

            if(this.personalCustomer.signType.length != 0){
              if(this.personalCustomer.signType[0].id == 2){
                if(!this.personalCustomer.card_id){
                  this.getNotificationValid("Vui lòng nhập mã số thuế/CMT/CCCD của " + this.getNameObjectValid('SIGNER') + "!")
                  return false;
                }
                if(!parttern.cardid.test(this.personalCustomer.card_id)){
                  this.getNotificationValid("Mã số thuế/CMT/CCCD của " + this.getNameObjectValid('SIGNER') + " không hợp lệ!")
                  return false;
                }
              }
              if(this.personalCustomer.signType[0].id == 4){
                if(!this.personalCustomer.card_id){
                  this.getNotificationValid("Vui lòng nhập mã số thuế/CMT/CCCD HSM của " + this.getNameObjectValid('SIGNER') + "!")
                  return false;
                }
                if(!parttern.cardid.test(this.personalCustomer.card_id)){
                  this.getNotificationValid("Mã số thuế/CMT/CCCD HSM của " + this.getNameObjectValid('SIGNER') + " không hợp lệ!")
                  return false;
                }
              }
            }

            // valid phone number
            if (personalData.phone && !parttern.phone.test(personalData.phone.trim())) {
              this.getNotificationValid("Số điện thoại" + this.getNameObjectValid('SIGNER') + " cá nhân không hợp lệ!")
              return false;
            }
          }
          return true;
  }

  getCheckDuplicateValue(valueType: string, dataValid: any){
    let checkDuplicate: any = [];
    if(valueType == 'phone'){
      for(let i = 0; i < dataValid.handlers.length; i++){
        if(dataValid.handlers[i].login_by=="phone" && checkDuplicate.includes(dataValid.handlers[i].phone)){
          return true;
        } else {
          checkDuplicate.push(dataValid.handlers[i].phone);
        }
      }
      return false;
    }

    if(valueType =='email'){
      for(let i = 0; i< dataValid.handlers.length; i++){
        if(dataValid.handlers[i].login_by=="email" && checkDuplicate.includes(dataValid.handlers[i].email)){
          return true;
        } else {
          checkDuplicate.push(dataValid.handlers[i].email);
        }
      }
    }

    if(valueType =='card_id'){
      for(let i = 0; i< dataValid.handlers.length; i++){
        if((dataValid.handlers[i].role == "ARCHIVER" || dataValid.handlers[i].role == "SIGNER") && checkDuplicate.includes(dataValid.handlers[i].card_id)){
          return true;
        } else {
          checkDuplicate.push(dataValid.handlers[i].card_id);
        }
      }
    }
  }

  getNameObjectValid(role_name: string) {
    switch (role_name) {
      case 'COORDINATOR':
        return ' người điều phối ';
      case 'REVIEWER':
        return ' người xem xét ';
      case 'SIGNER':
        return ' người ký ';
      case 'ARCHIVER':
        return ' văn thư ';
      default:
        return '';
    }
  }

  changeTypeSign(d: any,index: any,id?: any,role?: any) {


    if (d.login_by == 'phone' || d.login_by == 'email') {
      d.email = '';
      d.phone = '';
    }


    if(role == 'sign_partner') {
        if (d.login_by == 'phone') {
          this.isListSignNotPersonPartner = this.signTypeList.filter((p) => ![1,2,5].includes(p.id));
        } else {

          this.isListSignNotPersonPartner = this.signTypeList.filter((p) => ![1,5].includes(p.id));
        }
    } else if(role == 'signer') {
      if (d.login_by == 'phone') {
        this.isListSignNotPerson[index] = this.signTypeList.filter((p) => ![1, 2, 5].includes(p.id));
      } else {
        this.isListSignNotPerson[index] = this.signTypeList.filter((p) => ![1,5].includes(p.id));
      }
    } else if(role == 'personal') {
      if (d.login_by == 'phone') {
        this.isListSignPersonal = this.signTypeList.filter((p) => ![2].includes(p.id));
      } else {
        this.isListSignPersonal = this.signTypeList;
      }
    }
  }

  submit(){
    if(this.validData()){
      this.spinner.show();
      if(this.action == 'add'){
      if(this.isOrg){

        this.customerService.addOrgCustomer(this.orgCustomer).subscribe((res: any) => {
          if(res.errors){
            this.spinner.hide();
            this.showError(res.errors[0].code, 'add', 'org')
          } else {
            this.spinner.hide();
            this.toastService.showSuccessHTMLWithTimeout('Thêm khách hàng tổ chức thành công!',"", 2000);
            this.router.navigate(['/main/customer']);
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!',"", 2000);
        })
      }
      if(!this.isOrg){
        this.customerService.addPersonalCustomer(this.personalCustomer).subscribe((res: any) => {
          if(res.errors){
            this.spinner.hide();
            this.showError(res.errors[0].code, 'add', 'personal')
          } else {
            this.spinner.hide();
            this.toastService.showSuccessHTMLWithTimeout('Thêm khách hàng cá nhân thành công!',"", 2000);
            this.router.navigate(['/main/customer']);
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!',"", 2000);
        })
      }}
      if(this.action == 'edit'){
        if(this.isOrg){
          this.orgCustomer.id = this.id;
          this.customerService.editOrgCustomer(this.orgCustomer).subscribe((res: any) => {
            if(res.errors){
              this.spinner.hide();
              this.showError(res.errors[0].code, 'edit', 'org')
            } else {
              this.spinner.hide();
              this.toastService.showSuccessHTMLWithTimeout('Sửa thông tin khách hàng tổ chức thành công!',"", 2000);
              this.router.navigate(['/main/customer']);
            }

          },
          (error) => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout('Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!',"", 2000);
          })
        }
        if(!this.isOrg){
          this.personalCustomer.id = this.id;
          this.customerService.editPersonalCustomer(this.personalCustomer).subscribe((res: any) => {
            if(res.errors){
              this.spinner.hide();
              this.showError(res.errors[0].code, 'edit', 'personal')
            } else {
              this.spinner.hide();
              this.toastService.showSuccessHTMLWithTimeout('Sửa thông tin khách hàng thành công!',"", 2000);
              this.router.navigate(['/main/customer']);
            }

          },
          (error) => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout('Có lỗi xảy ra, vui lòng liên hệ với nhà phát triển để xử lý!',"", 2000);
          })
        }
      }
  }
}
  showError(code: number, action: string, type: string ){
    let actionError: string = '';
    if(action == 'add')
      actionError = 'Thêm khách hàng ';
    else if(action == 'edit')
      actionError = 'Sửa thông tin khách hàng ';
    if(type == 'org')
      actionError += 'tổ chức không thành công, ';
    else if(type == 'personal')
      actionError += 'cá nhân không thành công, ';
    if(code == 1002){
      actionError += 'số điện thoại đã tồn tại!'
      this.toastService.showErrorHTMLWithTimeout(actionError, "", 3000);
    } else
    if(code == 1014){
      actionError += 'CMT/CCCD đã tồn tại!'
      this.toastService.showErrorHTMLWithTimeout(actionError, "", 3000);
    } else
    if(code == 1006){
      actionError += 'mã số thuế đã tồn tại!'
      this.toastService.showErrorHTMLWithTimeout(actionError, "", 3000);
    } else
    if(code == 1013){
      actionError += 'tên khách hàng đã tồn tại!'
      this.toastService.showErrorHTMLWithTimeout(actionError, "", 3000);
    }
  }
  ngOnDestroy(): void {

  }
}
