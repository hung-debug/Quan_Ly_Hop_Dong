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
  submitted = false;
  submittedUser = false;
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
        email: this.fbd.control("", [Validators.required])
      });

      this.addFormUser = this.fbd.group({
        orgId: "",
        email: this.fbd.control("", [Validators.required])
      });
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
      email: this.fbd.control("", [Validators.required])
    });
    this.addFormUser = this.fbd.group({
      orgId: "",
      email: this.fbd.control("", [Validators.required])
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
    this.userService.getUserList(orgId, "","").subscribe(data => {

      this.userList = data.entities.filter((p: any) => p.email != emailLogin && p.status == 1);

      this.addFormUser = this.fbd.group({
        orgId: orgId,
        email: this.fbd.control("", [Validators.required])
      });
    });
  }

  //email:any;
  emailArr:any[] = [];
  checkEmailError:boolean;
  onSubmit() {
    this.emailArr = [];
    if(this.type == 1){

      this.submitted = true;
      // stop here if form is invalid
      if (this.addForm.invalid) {
        return;
      }
      this.checkEmailError=false;
      // this.email = this.addForm.value.email;

      let emailLogin = this.userService.getAuthCurrentUser().email;
      this.addForm.value.email.split(',').forEach((key: any, v: any) => {

        if(this.isValidEmail(key.trim())== false){
          this.toastService.showErrorHTMLWithTimeout('Tồn tại email ' + key.trim() + ' sai định dạng', "", 3000);
          this.checkEmailError=true;
        }else if(key.trim() == emailLogin){
          this.toastService.showErrorHTMLWithTimeout('Không thể chia sẻ cho chính mình', "", 3000);
          this.checkEmailError=true;
        }
        else{
          this.emailArr.push(key.trim());
        }
      });

      if(!this.checkEmailError){
        this.contractService.shareContract(this.emailArr, this.data.id).subscribe(data => {

          if(data.contract_id != null){
            this.dialogRef.close();
            this.toastService.showSuccessHTMLWithTimeout('Chia sẻ hợp đồng thành công', "", 3000);
          }else{
            this.toastService.showErrorHTMLWithTimeout('Chia sẻ hợp đồng thất bại', "", 3000);
          }
        });
      }


    }else{

      this.submittedUser = true;
      // stop here if form is invalid
      if (this.addFormUser.invalid) {
        return;
      }


      this.contractService.shareContract(this.addFormUser.value.email, this.data.id).subscribe(data => {

        if(data.contract_id != null){
          this.dialogRef.close();
          this.toastService.showSuccessHTMLWithTimeout('Chia sẻ hợp đồng thành công', "", 3000);
        }else{
          this.toastService.showErrorHTMLWithTimeout('Chia sẻ hợp đồng thất bại', "", 3000);
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
}
