import { ToastService } from './../../../service/toast.service';
import { Component, OnInit } from '@angular/core';
import { parttern, parttern_input } from 'src/app/config/parttern';
import {Route, ActivatedRoute, Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { type_signature, org_customer_clone, personal_customer_clone,
clone_load_org_customer, clone_load_personal_customer} from 'src/app/config/variable';
import { AppService } from 'src/app/service/app.service';
import { Customer, CustomerService, OrgCustomer, PersonalCustomer, SignType } from 'src/app/service/customer.service';
import { includes } from 'lodash';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
  isOrg: boolean;

  //dropdown
  signTypeList: Array<SignType> = type_signature;

  dropdownSignTypeSettings: any = {};

  isListSignNotPerson: any[] = [];
  id: any;
  action: any;
  orgCustomer: OrgCustomer = clone_load_org_customer;
  personalCustomer: PersonalCustomer = clone_load_personal_customer;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private customerService: CustomerService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    console.log(this.signTypeList)
    this.route.params.subscribe(params => {
      this.action = params['action'];
      const type = params['type'];
      this.id = params['id'];
      if(type == 'organization'){
        this.isOrg = true;
        this.appService.setTitle("organization.customer.add");
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
        if(type == 'personal')
        this.isOrg = false;
        this.appService.setTitle("personal.customer.add");
      }
      this.personalCustomer = JSON.parse(JSON.stringify(personal_customer_clone));
    })

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
    // if(arr_clone[i])
  }

  addOrganizationHandler(role: string){
    let data_add = this.customerService.getDataOrgCustomer().handlers.filter(
      (handler) => handler.role == role
    );
    let data=data_add[0];
    data.ordering = this.getOrganizationHandler(role).length + 1;
    console.log(data);
    console.log(this.orgCustomer.handlers);
    this.orgCustomer.handlers?.push(data);
    console.log(this.orgCustomer.handlers);
  }

  onCancel(){
    this.router.navigate(['/main/customer'])
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


  selectWithOtp(e: any, data: any, type: any){
    console.log(e);
    console.log(data);
    // if(data.signType != null) 
    // data.signType = data.signType[0];
    console.log(e);
    console.log(data);
  }

  getListSignType(role?: any) {
    if(role == 'personal' || role == 'org') {
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

            console.log("1235")
            console.log(dataArrPartner)
            console.log(!dataArrPartner.name)
            console.log(isPartnerSort[k]);
            if (!dataArrPartner.name) {
              this.getNotificationValid("Vui lòng nhập tên tổ chức!")
              return false;
            }

            if(!dataArrPartner.taxCode) {
              this.getNotificationValid("Vui lòng nhập mã số thuế của tổ chức!")
              return false;
            }
           
            if (!isPartnerSort[k].name) {
              console.log(isPartnerSort.name)
              this.getNotificationValid("Vui lòng nhập tên " + this.getNameObjectValid(isPartnerSort[k].role) + " !")
              return false;
            }

            if(!parttern_input.input_form.test(isPartnerSort[k].name)) {
              this.getNotificationValid("Họ tên " + this.getNameObjectValid(isPartnerSort[k].role) + " của tổ chức không được chứa ký tự đặc biệt");
              return false;
            }

            if (!isPartnerSort[k].signType && ((isPartnerSort[k].role == 'SIGNER') || (isPartnerSort[k].role == 'ARCHIVER'))) {
              console.log((isPartnerSort[k].role == 'SIGNER') || (isPartnerSort[k].role == 'ARCHIVER'))
              this.getNotificationValid("Vui lòng chọn loại ký " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
              console.log('????');
              console.log(isPartnerSort[k].signType);
              return false;
            } 
            // else if (isPartnerSort[k].signType.length > 0 && [3, 4].includes(isPartnerSort[k].role)) {
            //   let isPartnerOriganzationDuplicate = [];
            //   //check chu ky so
            //   isPartnerOriganzationDuplicate = isPartnerSort.signType.filter((p: any) => p.id == 2 || p.id == 3 || p.id == 4);
            //   if (isPartnerOriganzationDuplicate.length > 1) {
            //     this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký số " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
                
            //     return false;
            //   }
            //   isPartnerOriganzationDuplicate = [];
            //   //check chu ky anh
            //   isPartnerOriganzationDuplicate = isPartnerSort.signType.filter((p: any) => p.id == 1 || p.id == 5);
            //   if (isPartnerOriganzationDuplicate.length > 1) {
            //     this.getNotificationValid("Vui lòng chỉ chọn 1 loại ký ảnh hoặc eKYC " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
                
            //     return false;
            //   }
            //   isPartnerOriganzationDuplicate = [];
            // }

            if (!isPartnerSort[k].phone) {
              this.getNotificationValid("Vui lòng nhập số điện thoại của " + this.getNameObjectValid(isPartnerSort[k].role) + "!")
              return false;
            }

            // valid phone number
            if (isPartnerSort[k].phone && !parttern.phone.test(isPartnerSort[k].phone.trim())) {
              this.getNotificationValid("Số điện thoại " + this.getNameObjectValid(isPartnerSort[k].role) + " không hợp lệ!")
              return false;
            }
            // check duplicate 
            if (this.getCheckDuplicateValue('phone', dataArrPartner)) {
              this.getNotificationValid("Số điện thoại của tổ chức không được trùng nhau!")
              return false;
            }

            if(this.getCheckDuplicateValue('email', dataArrPartner)){
              this.getNotificationValid("valid.login.user")
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

            if (!parttern_input.input_form.test(personalData.name)) {
              this.getNotificationValid("Họ tên" + this.getNameObjectValid('SIGNER') + "  cá nhân không hợp lệ!")
              return false;
            }

            if (!personalData.email) {
              this.getNotificationValid("Vui lòng nhập email" + this.getNameObjectValid('SIGNER') + "  cá nhân!")
              return false;
            }

            if (!personalData.signType) {
              this.getNotificationValid("Vui lòng chọn loại ký của" + this.getNameObjectValid('SIGNER') + " cá nhân!"
              )
              return false;
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
        if(checkDuplicate.includes(dataValid.handlers[i].phone)){
          return true;
        } else {
          checkDuplicate.push(dataValid.handlers[i].phone);
        }
      }
      return false;
    }

    if(valueType =='email'){
      for(let i = 0; i< dataValid.handlers.length; i++){
        if(checkDuplicate.includes(dataValid.handlers[i].email)){
          return true;
        } else {
          checkDuplicate.push(dataValid.handlers[i].email);
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

  submit(){
    if(this.validData()){
      this.spinner.show();
      if(this.action == 'add'){
      if(this.isOrg){
        console.log(this.orgCustomer);
        this.customerService.addOrgCustomer(this.orgCustomer).subscribe((res: any) => {
          this.spinner.hide();
          this.toastService.showSuccessHTMLWithTimeout('Thêm khách hàng tổ chức thành công!',"", 2000);
          this.router.navigate(['/main/customer']);
        },
        (error) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Thêm khách hàng thất bại!',"", 2000);
        })
      }
      if(!this.isOrg){
        this.customerService.addPersonalCustomer(this.personalCustomer).subscribe((res: any) => {
          this.spinner.hide();
          this.toastService.showSuccessHTMLWithTimeout('Thêm khách hàng thành công!',"", 2000);
          this.router.navigate(['/main/customer']);
        },
        (error) => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Thêm khách hàng thất bại!',"", 2000);
        })
      }}
      if(this.action == 'edit'){
        if(this.isOrg){
          this.orgCustomer.id = this.id;
          this.customerService.editOrgCustomer(this.orgCustomer).subscribe((res: any) => {
            this.spinner.hide();
            this.toastService.showSuccessHTMLWithTimeout('Sửa thông tin khách hàng tổ chức thành công!',"", 2000);
            this.router.navigate(['/main/customer']);
          },
          (error) => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout('Sửa thông tin khách hàng thất bại!',"", 2000);
          })
        }
        if(!this.isOrg){
          this.personalCustomer.id = this.id;
          this.customerService.editPersonalCustomer(this.personalCustomer).subscribe((res: any) => {
            this.spinner.hide();
            this.toastService.showSuccessHTMLWithTimeout('Sửa thông tin khách hàng thành công!',"", 2000);
            this.router.navigate(['/main/customer']);
          },
          (error) => {
            this.spinner.hide();
            this.toastService.showErrorHTMLWithTimeout('Sửa thông tin khách hàng thất bại!',"", 2000);
          })
        }
      }
  }
}
}
