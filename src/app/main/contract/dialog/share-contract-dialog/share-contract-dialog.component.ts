import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractSignatureService } from 'src/app/service/contract-signature.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-share-contract-dialog',
  templateUrl: './share-contract-dialog.component.html',
  styleUrls: ['./share-contract-dialog.component.scss']
})
export class ShareContractDialogComponent implements OnInit {

  type:any;
  addForm: FormGroup;
  addFormUser: FormGroup;
  datas: any;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  userList: Array<any> = [];
  listPhone: Array<any> = [];
  submitted = false;
  submittedUser = false;
  organization_id: any;
  currentUser: any
  get f() { return this.addForm.controls; }
  get fUser() { return this.addFormUser.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<ShareContractDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private unitService: UnitService,
    private userService: UserService,
    private contractService: ContractSignatureService) {

      this.addForm = this.fbd.group({
        // email: this.fbd.control("", [Validators.required])
        email: this.fbd.control(""),
        phone: this.fbd.control("")
      });

      this.addFormUser = this.fbd.group({
        orgId: "",
        // email: this.fbd.control("", [Validators.required])
        email: this.fbd.control("", [Validators.required]),
        phone: this.fbd.control("", [Validators.required]),
      });
      
      this.currentUser = JSON.parse(
        localStorage.getItem('currentUser') || ''
      ).customer.info;
    }

  ngOnInit(): void {
    let orgId = this.userService.getInforUser().organization_id;
    //lay danh sach to chuc
    this.unitService.getUnitList('', '').subscribe(data => {

      this.orgList = data.entities;
    });

    this.datas = this.data;
    this.type = 1;

    this.addForm = this.fbd.group({
      // email: this.fbd.control("", [Validators.required])
      email: this.fbd.control(""),
      phone: this.fbd.control("")
    });
    this.addFormUser = this.fbd.group({
      orgId: "",
      // email: this.fbd.control("", [Validators.required])
      email: this.fbd.control(""),
      phone: this.fbd.control("")
    });

  }

  changeType() {
    if(this.type == 1){
      this.submitted = false;
    }else{
      this.submittedUser = false;
    }
  }

  getUserByOrg(orgId:any){

    let emailLogin = this.userService.getAuthCurrentUser().email;
    let phoneLogin = this.userService.getAuthCurrentUser().phone;
    this.organization_id = orgId;
    
    this.userService.getUserListShareOrg(orgId, "","","").subscribe(data => {

      this.userList = data.entities.filter((p: any) => p.email != emailLogin && p.status == 1 && (p.login_type === 'EMAIL' || p.login_type === 'EMAIL_AND_SDT'));
      this.listPhone = data.entities.filter((p: any) => p.phone != phoneLogin && p.status == 1 && (p.login_type === 'SDT' || p.login_type === 'EMAIL_AND_SDT'));

      this.addFormUser = this.fbd.group({
        orgId: orgId,
        // email: this.fbd.control("", [Validators.required])
        email: this.fbd.control(""),
        phone: this.fbd.control(""),
      });
    });
  }
  
  changeOrg(){
    this.addForm.patchValue({
      email: this.addFormUser.value.email? this.addFormUser.value.email : [],
      phone: this.addFormUser.value.phone? this.addFormUser.value.phone : [],
    })
    this.getListAllEmailOnFillter(this.organization_id);
    this.getListAllPhoneOnFillter(this.organization_id);
  }
  
  getListAllEmailOnFillter(event: any) {
    this.userList = [];
    let emailLogin = this.userService.getAuthCurrentUser().email;
    if (this.addFormUser.value.email.length > 0) {
      for (const item of this.addFormUser.value.email) {
        this.userList.push({email: item})
      }
    }
    let email: any = event.filter || ''
    this.userService.getUserListShareOrg(this.organization_id,'','',email || '').subscribe((response) => {
      if (response) {
        for (const item of response.entities) {
          if (item?.email != this.userList.find((value: any) => value.email == item.email)?.email  && (item.login_type === 'EMAIL' || item.login_type === 'EMAIL_AND_SDT')) {
            this.userList.push({email: item.email});
            if(this.currentUser?.loginType === 'EMAIL' || this.currentUser?.loginType === 'EMAIL_AND_SDT'){
              this.userList = this.userList.filter((p: any) => p.email != emailLogin);
            }
          }
        }
      }
    });
  }
  
  getListAllPhoneOnFillter(event: any) {
    this.listPhone = [];
    let phoneLogin = this.userService.getAuthCurrentUser().phone;
    if (this.addFormUser.value.phone.length > 0) {
      for (const item of this.addFormUser.value.phone) {
        this.listPhone.push({phone: item})
      }
    }
    let phone: any = event.filter || ''
    this.userService.getUserListShareOrg(this.organization_id,'',phone || '','').subscribe((response) => {
      if (response) {
        for (const item of response.entities) {
          if (item?.phone != this.listPhone.find((value: any) => value.phone == item.phone)?.phone  && (item.login_type === 'SDT' || item.login_type === 'EMAIL_AND_SDT')) {
            this.listPhone.push({phone: item.phone});
            if(this.currentUser?.loginType === 'SDT' || this.currentUser?.loginType === 'EMAIL_AND_SDT'){
              this.listPhone = this.listPhone.filter((p: any) => p.phone != phoneLogin);
            }
          }
        }
      }
    });
  }
  
  onSelectionChangeEmail() {
    let selectedValues = []
    selectedValues = this.addFormUser.get('email')?.value;
    selectedValues.forEach((value: any) => {
      const option = this.userList.find((opt: any) => opt.email === value);
      if (option) {
        value = option.email;
      }
    });
    this.addFormUser.patchValue({ email: selectedValues });
  }
  
  onSelectionChangePhone() {
    let selectedValues = []
    selectedValues = this.addFormUser.get('phone')?.value;
    selectedValues.forEach((value: any) => {
      const option = this.listPhone.find((opt: any) => opt.phone === value);
      if (option) {
        value = option.phone;
      }
    });
    this.addFormUser.patchValue({ phone: selectedValues });
  }

  //email:any;
  emailArr:any[] = [];
  checkEmailError:boolean;
  phoneArr:any[] = [];
  checkPhoneError:boolean;
  onSubmit() {
    console.log("current",this.currentUser);
    
    this.emailArr = [];
    this.phoneArr = [];
    if(this.type == 1){

      this.submitted = true;
      // stop here if form is invalid
      if (this.addForm.invalid) {
        return;
      }
      
      this.checkEmailError = false;
      this.checkPhoneError = false;
      // this.email = this.addForm.value.email;

      let emailLogin = this.userService.getAuthCurrentUser().email;
      let phoneLogin = this.userService.getAuthCurrentUser().phone;
      
      let emailInput = this.addForm.value.email?.trim();
      let phoneInput = this.addForm.value.phone?.trim();
      
      let emailDup = new Set<string>();
      let phoneDup = new Set<string>();
      
      if(!emailInput && !phoneInput){
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập giá trị Email/Số điện thoại', "", 3000);
        return;
      }
      
      if(emailInput){
        emailInput.split(',').forEach((key: any) =>{
          const valueEmail = key.trim();
          if(!this.isValidEmail(valueEmail)){
            this.toastService.showErrorHTMLWithTimeout('Tồn tại email ' + valueEmail + ' sai định dạng', "", 3000);
            this.checkEmailError = true;
            this.checkPhoneError = true;
          } else if(valueEmail == emailLogin && (this.currentUser?.loginType === 'EMAIL' || this.currentUser?.loginType === 'EMAIL_AND_SDT')){
            this.toastService.showErrorHTMLWithTimeout('Không thể chia sẻ Email cho chính mình', "", 3000);
            this.checkEmailError = true;
            this.checkPhoneError = true;
          } else if (emailDup.has(valueEmail)) {
            this.toastService.showErrorHTMLWithTimeout(`Email "${valueEmail}" đã được nhập nhiều lần`, "", 3000);
            this.checkEmailError = true;
            this.checkPhoneError = true;
          } else {
            emailDup.add(valueEmail);
            this.emailArr.push(valueEmail);
          }
        })
      }
      
      if(phoneInput){
        phoneInput.split(',').forEach((key: any) =>{
          const valuePhone = key.trim();
          if(!this.isValidPhone(valuePhone)){
            this.toastService.showErrorHTMLWithTimeout('Tồn tại số điện thoại ' + valuePhone + ' sai định dạng', "", 3000);
            this.checkPhoneError = true;
            this.checkEmailError = true;
          } else if(valuePhone == phoneLogin && (this.currentUser?.loginType === 'SDT' || this.currentUser?.loginType === 'EMAIL_AND_SDT')){
            this.toastService.showErrorHTMLWithTimeout('Không thể chia sẻ Số điện thoại cho chính mình', "", 3000);
            this.checkPhoneError = true;
            this.checkEmailError = true;
          } else if (phoneDup.has(valuePhone)) {
            this.toastService.showErrorHTMLWithTimeout(`Số điện thoại "${valuePhone}" đã được nhập nhiều lần`, "", 3000);
            this.checkPhoneError = true;
            this.checkEmailError = true;
          } else {
            phoneDup.add(valuePhone);
            this.phoneArr.push(valuePhone);
          }
        })
      }
      
      
      const hasEmail = this.emailArr.length > 0;
      const hasPhone = this.phoneArr.length > 0;

      const emailValid = hasEmail && !this.checkEmailError;
      const phoneValid = hasPhone && !this.checkPhoneError;

      if((emailValid && !hasPhone) || (phoneValid && !hasEmail) || (emailValid && phoneValid)){
        this.contractService.shareContract(this.emailArr, this.phoneArr, this.data.id).subscribe(data => {

          if(data.contract_id != null){
            this.dialogRef.close();
            this.toastService.showSuccessHTMLWithTimeout('Chia sẻ tài liệu thành công', "", 3000);
          }else{
            this.toastService.showErrorHTMLWithTimeout('Chia sẻ tài liệu thất bại', "", 3000);
          }
        });
      }


    }else{

      this.submittedUser = true;
      // stop here if form is invalid
      if (this.addFormUser.invalid) {
        return;
      }
      let orgValue = this.addFormUser.value.orgId;
      let emailInput = this.addFormUser.value.email[0]?.trim();
      let phoneInput = this.addFormUser.value.phone[0]?.trim();

      if(!orgValue){
        this.toastService.showWarningHTMLWithTimeout('Vui lòng chọn tổ chức', "", 3000);
        return;
      }else if(!emailInput && !phoneInput){
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập Email hoặc SĐT chia sẻ', "", 3000);
        return;
      }
      
      this.contractService.shareContract(this.addFormUser.value.email,this.addFormUser.value.phone, this.data.id).subscribe(data => {

        if(data.contract_id != null){
          this.dialogRef.close();
          this.toastService.showSuccessHTMLWithTimeout('Chia sẻ tài liệu thành công', "", 3000);
        }else{
          this.toastService.showErrorHTMLWithTimeout('Chia sẻ tài liệu thất bại', "", 3000);
        }
      });

    }
  }

  isValidEmail(emailString: any) {
    try {
      let pattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
      let valid = pattern.test(emailString);
      return valid;
    } catch (TypeError) {
      return false;
    }
  }
  
  isValidPhone(phoneString: any) {
    try {
      let pattern = new RegExp("^[+]*[0-9]{10,11}$");
      let valid = pattern.test(phoneString);
      return valid;
    } catch (TypeError) {
      return false;
    }
  }
}
