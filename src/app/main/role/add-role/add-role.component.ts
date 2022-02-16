import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import {roleList} from "../../../config/variable";

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  addForm: FormGroup;
  datas: any;

  groupedRole: SelectItemGroup[];
  selectedRoleConvert: any = [];

  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private roleService : RoleService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddRoleComponent>,
    public router: Router,
    public dialog: MatDialog,) { 
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required]),
        note: "",
        selectedRole: this.fbd.control([], [Validators.required]),
      });
    }

  ngOnInit(): void {
    this.datas = this.data;
    if(this.data.id != null){
      this.roleService.getRoleById(this.data.id).subscribe(
        data => {
          console.log(data);
          this.addForm = this.fbd.group({
            name: this.fbd.control(data.name, [Validators.required]),
            code: this.fbd.control(data.code, [Validators.required]),
            note: data.description,
            selectedRole: this.fbd.control(this.convertRoleArr(data.permissions), [Validators.required]),
          });
        });
    }else{
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required]),
        note: "",
        selectedRole: this.fbd.control([], [Validators.required]),
      });
    }

    this.groupedRole = roleList;
  }

  convertRoleArr(roleArr:[]){
    let roleArrConvert: any = [];
    roleArr.forEach((key: any, v: any) => {
      roleArrConvert.push(key.code);
    });
    return roleArrConvert;
  }

  onSubmit() {
    this.submitted = true;
    const data = {
      id: this.data.id,
      name: this.addForm.value.name,
      code: this.addForm.value.code,
      note: this.addForm.value.note,
      selectedRole: this.addForm.value.selectedRole,
    }
    console.log(data);
    console.log(this.addForm.invalid);
    if (this.addForm.invalid) {
      console.log(this.addForm.invalid);
      return;
    }
    this.selectedRoleConvert = [];
    data.selectedRole.forEach((key: any, v: any) => {
      console.log(key);
      let jsonData = {code: key, status: 1};
      this.selectedRoleConvert.push(jsonData);
    });
    data.selectedRole = this.selectedRoleConvert;

    if(this.data.id != null){
      this.roleService.updateRole(data).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout('Cập nhật vai trò thành công!', "", 3000);
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/role']);
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }else{
      //kiem tra ma vai tro ton tai chua
      this.roleService.checkCodeRole(data.code).subscribe(
        dataByCode => {
          //neu chua ton tai
          if(dataByCode.code == '00'){
            //kiem tra ten vai tro da ton tai chua
            this.roleService.checkNameRole(data.name).subscribe(
              dataByName => {
                //neu chua ton tai
                if(dataByName.code == '00'){
                  
                  this.roleService.addRole(data).subscribe(
                    data => {
                      this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò thành công!', "", 3000);
                      this.dialogRef.close();
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigate(['/main/role']);
                      });
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                    }
                  )
                //neu da ton tai ten
                }else{
                  this.toastService.showErrorHTMLWithTimeout('Tên vai trò đã tồn tại', "", 3000);
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
              }
            )
          //neu da ton tai ma
          }else{
            this.toastService.showErrorHTMLWithTimeout('Mã vai trò đã tồn tại', "", 3000);
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }
    
  }

}
