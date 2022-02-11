import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import {roleList} from "../../../config/variable";

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit {
  addForm: FormGroup;
  datas: any;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddUnitComponent>,
    public router: Router,
    public dialog: MatDialog,
    private userService : UserService,
    private roleService: RoleService,) { 

      this.addForm = this.fbd.group({
        nameOrg: this.fbd.control("", [Validators.required]),
        short_name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        fax: null,
        status: 1,
        parent_id: this.fbd.control("", [Validators.required]),
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

    //lay du lieu form cap nhat
    if( this.data.id != null){
      this.unitService.getUnitById(this.data.id).subscribe(
        data => {
          this.addForm = this.fbd.group({
            nameOrg: this.fbd.control(data.name, [Validators.required]),
            short_name: this.fbd.control(data.short_name, [Validators.required]),
            code: this.fbd.control(data.code, [Validators.required]),
            email: this.fbd.control(data.email, [Validators.required, Validators.email]),
            phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
            fax: this.fbd.control(data.fax),
            status: this.fbd.control(data.status),
            parent_id: this.fbd.control(data.parent_id, [Validators.required]),
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )

    //khoi tao form them moi
    }else{
      this.addForm = this.fbd.group({
        nameOrg: this.fbd.control("", [Validators.required]),
        short_name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        fax: null,
        status: 1,
        parent_id: this.fbd.control(orgId, [Validators.required]),
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      id: "",
      name: this.addForm.value.nameOrg,
      short_name: this.addForm.value.short_name,
      code: this.addForm.value.code,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      fax: this.addForm.value.fax,
      status: this.addForm.value.status,
      parent_id: this.addForm.value.parent_id,
    }
    console.log(data);
    if(this.data.id !=null){
      data.id = this.data.id;
      this.unitService.updateUnit(data).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 3000);
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/unit']);
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }else{
      //kiem tra email da ton tai trong he thong hay chua
      this.userService.getUserByEmail(data.email).subscribe(
        dataByEmail => {
          if(dataByEmail.id == 0){

            //them to chuc
            this.unitService.addUnit(data).subscribe(
              dataUnit => {
                this.toastService.showSuccessHTMLWithTimeout('Thêm mới tổ chức thành công!', "", 3000);
                console.log(dataUnit);

                //them vai tro
                let roleArrConvert: any = [];
                roleList.forEach((key: any, v: any) => {
                  key.items.forEach((keyItem: any, vItem: any) => {
                    let jsonData = {code: keyItem.value, status: 1};
                    roleArrConvert.push(jsonData);
                  });
                });
                const dataRoleIn = {
                  name: 'Admin',
                  code: 'ADMIN',
                  selectedRole: roleArrConvert,
                  organization_id: dataUnit.id
                }
                console.log(dataRoleIn);
                
                this.roleService.addRoleByOrg(dataRoleIn).subscribe(
                  dataRole => {
                    this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò cho tổ chức thành công!', "", 3000);
                    console.log(dataRole);
                    //them nguoi dung
                    const dataUserIn = {
                      name: "Admin",
                      email: data.email,
                      phone: data.phone,
                      organizationId: dataUnit.id,
                      role: dataRole.id,
                      status: 1
                    }
                    this.userService.addUser(dataUserIn).subscribe(
                      dataUser => {
                        console.log(dataUser);
                        this.toastService.showSuccessHTMLWithTimeout('Thêm mới người dùng admin thành công!', "", 3000);
                        this.dialogRef.close();
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                          this.router.navigate(['/main/unit']);
                        });
                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Thêm mới người dùng admin thất bại', "", 3000);
                      }
                    )
                  }, error => {
                    this.toastService.showErrorHTMLWithTimeout('Thêm mới vai trò cho tổ chức thất bại', "", 3000);
                  }
                )
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Thêm mới tổ chức thất bại', "", 3000);
              }
            )
            
          }else{
            this.toastService.showErrorHTMLWithTimeout('Email đã tồn tại trong hệ thống', "", 3000);
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }
  }

}
