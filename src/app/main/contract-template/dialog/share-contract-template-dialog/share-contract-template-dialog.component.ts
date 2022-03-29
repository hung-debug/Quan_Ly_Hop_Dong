import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
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

  isList: string = 'off';
  stateOptions: any[];
  cols: any[]; 
  list: any[] = [];

  get fUser() { return this.addFormUser.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<ShareContractTemplateDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private unitService: UnitService, 
    private userService: UserService,
    private contractTemplateService: ContractTemplateService) { 

      this.addFormUser = this.fbd.group({
        orgId: "",
        email: this.fbd.control("", [Validators.required])
      });

      this.stateOptions = [
        { label: 'Chia sẻ', value: 'off' },
        { label: 'Danh sách', value: 'on' },
      ];
    }

  organization_id_user_login:any;
  orgId:any;
  ngOnInit(): void {
    //lay danh sach to chuc
    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);
      this.orgList = data.entities;
    });

    if(this.isList == 'off'){
      //lay id user
      this.organization_id_user_login = this.userService.getAuthCurrentUser().organizationId;
      
      this.datas = this.data;
      
      //mac dinh lay danh sach user to chuc cua ng truy cap
      this.getUserByOrg(this.organization_id_user_login);

      this.addFormUser = this.fbd.group({
        orgId: this.organization_id_user_login,
        email: this.fbd.control("", [Validators.required])
      });
    }else{
      this.orgId=this.userService.getAuthCurrentUser().organizationId;
      this.cols = [
        {header: 'Email đã chia sẻ', style:'text-align: left;' },
        {header: 'Tổ chức', style:'text-align: left;' },
        {header: 'role.manage', style:'text-align: center;' },
        ];
      this.getDataShareByOrgId();
    }
  }

  getDataShareByOrgId(){
    this.contractTemplateService.getEmailShareList(this.data.id, this.orgId).subscribe(response => {
      console.log(response);
      this.list = response;
    });
  }

  getUserByOrg(orgId:any){
    console.log(orgId);
    //lay danh sach email da duoc chia se
    this.contractTemplateService.getEmailShareList(this.data.id, orgId).subscribe(listShared => {
      this.userService.getUserList(orgId, "").subscribe(data => {
        console.log(data);
        //chi lay danh sach user chua duoc chia se
        this.userList = data.entities.filter((o1:any) => !listShared.some((o2:any) => o1.email === o2.email));
      });
    });

    
  }

  //email:any;
  checkEmailError:boolean;
  onSubmit() {    
    console.log(this.addFormUser.value.email);
    this.submittedUser = true;
    // stop here if form is invalid
    if (this.addFormUser.invalid) {
      return;
    }
    console.log("email=" + this.addFormUser.value.email);
    this.contractTemplateService.shareContract(this.addFormUser.value.email, this.data.id).subscribe(data => {
      console.log(data);
      if(data.contract_id != null){
        this.dialogRef.close();
        this.toastService.showSuccessHTMLWithTimeout('Chia sẻ mẫu hợp đồng thành công', "", 3000);
      }else{
        this.toastService.showErrorHTMLWithTimeout('Chia sẻ mẫu hợp đồng thất bại', "", 3000);
      }
    });
  }


  deleteShare(id:any){
    this.contractTemplateService.deleteShare(id).subscribe((data) => {

      if(data.success){
        this.toastService.showSuccessHTMLWithTimeout("Ngừng chia sẻ thành công!", "", 3000);
        this.ngOnInit();
      }else{
        this.toastService.showErrorHTMLWithTimeout("Ngừng chia sẻ thất bại!", "", 3000);
      }
    },
    error => {
      this.toastService.showErrorHTMLWithTimeout("Ngừng chia sẻ thất bại", "", 3000);
      return false;
    }
    );
  }
}
