import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-share-contract-template-dialog',
  templateUrl: './share-contract-template-dialog.component.html',
  styleUrls: ['./share-contract-template-dialog.component.scss']
})
export class ShareContractTemplateDialogComponent implements OnInit {

  type:any;
  addFormUser: FormGroup;
  datas: any;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  userList: Array<any> = [];
  submittedUser = false;
  get fUser() { return this.addFormUser.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<ShareContractTemplateDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private unitService: UnitService, 
    private userService: UserService) { 

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
      this.orgList = data.entities;
    });

    this.datas = this.data;
    
    this.addFormUser = this.fbd.group({
      orgId: "",
      email: this.fbd.control("", [Validators.required])
    });

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

  //email:any;
  emailArr:any[] = [];
  checkEmailError:boolean;
  onSubmit() {
    this.emailArr = [];
    
    console.log(this.addFormUser.value.email);
    this.submittedUser = true;
    // stop here if form is invalid
    if (this.addFormUser.invalid) {
      return;
    }
    console.log("email=" + this.addFormUser.value.email);
    // this.contractTemplateService.shareContract(this.addFormUser.value.email, this.data.id).subscribe(data => {
    //   console.log(data);
    //   if(data.contract_id != null){
    //     this.dialogRef.close();
    //     this.toastService.showSuccessHTMLWithTimeout('Chia sẻ hợp đồng thành công', "", 3000);
    //   }else{
    //     this.toastService.showErrorHTMLWithTimeout('Chia sẻ hợp đồng thất bại', "", 3000);
    //   }
    // });
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
