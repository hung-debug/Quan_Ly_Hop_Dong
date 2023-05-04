import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import {roleList, roleList_en} from "../../../config/variable";
import {parttern_input} from "../../../config/parttern"
import { parttern } from '../../../config/parttern';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  addForm: FormGroup;
  datas: any;

  name:any;
  code:any;

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
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
    ) { 
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
        note: this.fbd.control("", Validators.pattern(parttern_input.input_form)),
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
            name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            code: this.fbd.control(data.code, [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
            note: this.fbd.control(data.description, Validators.pattern(parttern_input.input_form)),
            selectedRole: this.fbd.control(this.convertRoleArr(data.permissions), [Validators.required]),
          });
          this.name = data.name;
          this.code = data.code;
        });
    }else{
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
        note: this.fbd.control("", Validators.pattern(parttern_input.input_form)),
        selectedRole: this.fbd.control([], [Validators.required]),
      });
    }

    if(sessionStorage.getItem('lang') == 'vi')
      this.groupedRole = roleList;
    else if(sessionStorage.getItem('lang') == 'en')
      this.groupedRole = roleList_en;
  }

  selectedRoleIdCode: any = [];
  convertRoleArr(roleArr:[]){
    let roleArrConvert: any = [];
    roleArr.forEach((key: any, v: any) => {
      roleArrConvert.push(key.code);

      this.selectedRoleIdCode.push({
        id: key.id,
        code: key.code
      })
    });

    return roleArrConvert;
  }

  onChange(event: any) {
    // if(event.value.includes('QLHD_02')) {
    //   event.value.push('QLHD_07')
    // }

    // if(event.value.includes('QLMHD_02')) {
    //   event.value.push('QLMHD_08')
    // }

    // if(event.value.includes('QLTC_02')) {
    //   event.value.push('QLTC_04')
    // }

    // if(event.value.includes('QLND_02')) {
    //   event.value.push('QLND_04')
    // }

    // if(event.value.includes('QLVT_02')) {
    //   event.value.push('QLVT_05');
    // }

    // if(event.value.includes('QLHD_02')) {
    //   event.value.push('QLHD_05');
    // }
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
    
    if (this.addForm.invalid) {
      console.log(this.addForm.invalid);
      return;
    }
    this.spinner.show();
    this.selectedRoleConvert = [];

    console.log("data ", data.selectedRole);

    let arr: any = [];
    data.selectedRole.forEach((key: any, v: any) => {
      // let jsonData = {code: key, status: 1};
      // this.selectedRoleConvert.push(jsonData);
      this.selectedRoleIdCode.forEach((selectedRoleIdCode: any) => {
        if(key == selectedRoleIdCode.code) {
           let jsonData = {id:selectedRoleIdCode.id, code: key, status: 1};
           this.selectedRoleConvert.push(jsonData);
           arr.push(key);
        } else {
          let jsonData = { code: key, status: 1};
          this.selectedRoleConvert.push(jsonData);
        }
      })
    });

    for(let i = 0; i < this.selectedRoleConvert.length; i++) {
      for(let j = 0; j < arr.length;j++) {
        if(this.selectedRoleConvert[i].code == arr[j] && this.selectedRoleConvert[i].id) {
          this.selectedRoleConvert = this.selectedRoleConvert.splice(i,1);
        }
      }
    }

    data.selectedRole = this.selectedRoleConvert;

    if(this.data.id != null){

      this.roleService.updateRole(data).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout('Cập nhật vai trò thành công!', "", 3000);
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/role']);
          });
          this.spinner.hide();
          this.selectedRoleIdCode = [];
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
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
                      this.spinner.hide();
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                      this.spinner.hide();
                    }
                  )
                //neu da ton tai ten
                }else{
                  this.toastService.showErrorHTMLWithTimeout('Tên vai trò đã tồn tại', "", 3000);
                  this.spinner.hide();
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                this.spinner.hide();
              }
            )
          //neu da ton tai ma
          }else{
            this.toastService.showErrorHTMLWithTimeout('Mã vai trò đã tồn tại', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )
    }
    
  }

}
