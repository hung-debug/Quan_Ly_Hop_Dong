import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractSignatureComponent } from 'src/app/main/contract-signature/contract-signature.component';
import { ContractSignatureService } from 'src/app/service/contract-signature.service';
import { ContractService } from 'src/app/service/contract.service';
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
      console.log(data.entities);
      this.orgList = data.entities.filter((i: any) => (i.id == orgId || i.parent_id == orgId));
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
    console.log(orgId);
    this.userService.getUserList(orgId, "").subscribe(data => {
      console.log(data);
      this.userList = data.entities;

      this.addFormUser = this.fbd.group({
        orgId: orgId,
        email: this.fbd.control("", [Validators.required])
      });
    });
  }

  email:any;
  emailArr:any;
  onSubmit() {
    if(this.type == 1){
      console.log(this.addForm.value.email);
      this.submitted = true;
      // stop here if form is invalid
      if (this.addForm.invalid) {
        return;
      }
      //this.email = this.addForm.value.email.split(',');
      this.email = this.addForm.value.email;
      console.log(this.email);
      // this.email.forEach((key: any, v: any) => {
      //   console.log(key);
      //   if(this.isValidEmail(key.trim())== false){
      //     this.toastService.showErrorHTMLWithTimeout('Tồn tại email ' + key.trim() + ' sai định dạng', "", 1000);
      //     return;
      //   }
      // });

      this.contractService.shareContract(this.email, this.data.id).subscribe(data => {
        console.log(data);
        if(data.id != null){
          this.dialogRef.close();
          this.toastService.showSuccessHTMLWithTimeout('Chia sẻ hợp đồng thành công', "", 1000);
        }else{
          this.toastService.showSuccessHTMLWithTimeout('Chia sẻ hợp đồng thất bại', "", 1000);
        }
      });
      
    }else{
      console.log(this.addFormUser.value.email);
      this.submittedUser = true;
      // stop here if form is invalid
      if (this.addFormUser.invalid) {
        return;
      }
      this.email = this.addForm.value.email[0];
      console.log(this.addForm.value.email[0]);
      this.contractService.shareContract(this.addForm.value.email[0], this.data.id).subscribe(data => {
        console.log(data);
        if(data.id != null){
          this.dialogRef.close();
          this.toastService.showSuccessHTMLWithTimeout('Chia sẻ hợp đồng thành công', "", 1000);
        }else{
          this.toastService.showSuccessHTMLWithTimeout('Chia sẻ hợp đồng thất bại', "", 1000);
        }
      });
    }
    console.log(this.email);
    
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
