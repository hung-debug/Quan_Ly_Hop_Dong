import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import {roleList} from "../../../config/variable";
import {parttern_input} from "../../../config/parttern";
import { parttern } from '../../../config/parttern';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit {
  addForm: FormGroup;
  datas: any;
  codeOld:any;
  nameOld:any
  parentName:any;
  emailOld:any;
  phoneOld:any

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
    private roleService: RoleService,
    private spinner: NgxSpinnerService
    ) { 

      this.addForm = this.fbd.group({
        nameOrg: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        short_name: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        fax: this.fbd.control("", Validators.pattern(parttern_input.input_form)),
        status: 1,
        parent_id: this.fbd.control("", [Validators.required]),
      });
    }

  ngOnInit(): void {
    let orgId = this.userService.getInforUser().organization_id;
    

    this.datas = this.data;

    //lay du lieu form cap nhat
    if( this.data.id != null){
      //lay danh sach to chuc
      this.unitService.getUnitList('', '').subscribe(data => {
        this.orgList = data.entities.filter((p: any) => p.id != this.data.id);
      });
      this.unitService.getUnitById(this.data.id).subscribe(
        data => {
          this.addForm = this.fbd.group({
            nameOrg: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            short_name: this.fbd.control(data.short_name, [Validators.pattern(parttern_input.input_form)]),
            code: this.fbd.control(data.code, [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
            email: this.fbd.control(data.email, [Validators.required, Validators.email]),
            phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
            fax: this.fbd.control(data.fax, Validators.pattern(parttern_input.input_form)),
            status: this.fbd.control(data.status),
            parent_id: this.fbd.control(data.parent_id),
            path: this.fbd.control(data.path)
          });
          this.nameOld = data.name;
          this.codeOld = data.code;
          this.emailOld = data.email;
          this.phoneOld = data.phone;
      
          //set name
          if(data.parent_id != null){
            this.unitService.getUnitById(data.parent_id).subscribe(
              data => {
                this.parentName = data.name;
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
              }
            )
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )

    //khoi tao form them moi
    }else{
      //lay danh sach to chuc
      this.unitService.getUnitList('', '').subscribe(data => {
        console.log(data.entities);
        this.orgList = data.entities;
      });
      this.addForm = this.fbd.group({
        nameOrg: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        short_name: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.input_form)]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        fax: this.fbd.control("", Validators.pattern(parttern_input.input_form)),
        status: 1,
        parent_id: this.fbd.control(orgId, [Validators.required]),
      });
    }
  }

  update(data:any){
    this.unitService.updateUnit(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/unit']);
        });
        this.spinner.hide();
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        this.spinner.hide();
      }
    )
  }

  updateEmailAndPhone(data:any){
    if(data.email != this.emailOld || data.phone != this.phoneOld){
      //kiem tra email da ton tai trong he thong hay chua
      this.userService.getUserByEmail(data.email).subscribe(
        dataByEmail => {

          //lay id vai tro admin theo id to chuc
          this.roleService.getRoleByOrgId(data.id).subscribe(
            dataRoleByOrgId => {
              let roleAdmin = dataRoleByOrgId.entities.filter((p:any) => p.code == 'ADMIN');
              if(roleAdmin.length > 0){

                //neu user chua co => them moi user va gan vai tro admin
                if(dataByEmail.id == 0){

                  //tao nguoi dung co vai tro admin
                  const dataUpdateUser = {
                    name: 'Admin',
                    email: data.email,
                    phone: data.phone,
                    organizationId: data.id,
                    role: roleAdmin[0].id,
                    status: 1,
                    phoneKpi: null,
                    networkKpi: null,
                    nameHsm: null,
                    sign_image: []
                  }

                  this.userService.addUser(dataUpdateUser).subscribe(
                    dataUser => {
                      //this.toastService.showSuccessHTMLWithTimeout('Thêm mới admin tổ chức thành công!', "", 3000);

                      //update thong tin to chuc
                      this.update(data);
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Thêm mới admin tổ chức thất bại', "", 3000);
                      this.spinner.hide();
                    }
                  )
                
                //neu da co user
                }else{
                  //kiem tra xem user do co thuoc to chuc nay hay khong
                  if(dataByEmail.organization_id == data.id){
                    //tao nguoi dung co vai tro admin
                    const dataUpdateUser = {
                      id: dataByEmail.id,
                      name: 'Admin',
                      email: data.email,
                      phone: data.phone,
                      organizationId: data.id,
                      role: roleAdmin[0].id,
                      status: dataByEmail.status,
                      phoneKpi: dataByEmail.phone_sign,
                      networkKpi: dataByEmail.phone_tel,
                      nameHsm: dataByEmail.hsm_name,
                      sign_image: dataByEmail.sign_image
                    }

                    //update nguoi dung co vai tro admin theo id
                    this.userService.updateUser(dataUpdateUser).subscribe(
                      dataUser => {
                        //this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin admin tổ chức thành công!', "", 3000);
                        
                        //update thong tin to chuc
                        this.update(data);
                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin admin tổ chức thất bại', "", 3000);
                        this.spinner.hide();
                      }
                    )
                  }else{
                    this.toastService.showErrorHTMLWithTimeout('Người dùng đăng ký admin không thuộc tổ chức', "", 3000);
                    this.spinner.hide();
                  }
                }
              }else{
                this.toastService.showErrorHTMLWithTimeout('Không tìm thấy vai trò ADMIN của tổ chức', "", 3000);
                this.spinner.hide();
              }
            }, error => {
              this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin vai trò tổ chức', "", 3000);
              this.spinner.hide();
            }
          ); 
          
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )
    }else{
      //update thong tin to chuc
      this.update(data);
    }
  }

  checkCode(data:any){
    //neu thay doi ma thi can check lai
    if(data.code != this.codeOld){
      //kiem tra ma to chuc da ton tai trong he thong hay chua
      this.unitService.checkCodeUnique(data, data.code).subscribe(
        dataByCode => {

          if(dataByCode.code == '00'){

            //ham check email
            this.updateEmailAndPhone(data);

          }else if(dataByCode.code == '01'){
            this.toastService.showErrorHTMLWithTimeout('Mã tổ chức đã tồn tại trong hệ thống', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )
    //neu khong thay doi ma thi khong can check ma
    }else{
      //ham check email
      this.updateEmailAndPhone(data);
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
      path: this.addForm.value.path
    }
    console.log(data);

    this.spinner.show();
    //truong hop sua ban ghi
    if(this.data.id !=null){
      data.id = this.data.id;
      //neu thay doi ten thi can check lai
      if(data.name != this.nameOld){
        //kiem tra ten to chuc da ton tai trong he thong hay chua
        this.unitService.checkNameUnique(data, data.name).subscribe(
          dataByName => {
            console.log(dataByName);
            if(dataByName.code == '00'){

              //ham check ma
              this.checkCode(data);

            }else if(dataByName.code == '01'){
              this.toastService.showErrorHTMLWithTimeout('Tên tổ chức đã tồn tại trong hệ thống', "", 3000);
              this.spinner.hide();
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
            this.spinner.hide();
          }
        )
      //neu khong thay doi thi khong can check ten
      }else{
        //ham check ma
        this.checkCode(data);
      }
      

    //truong hop them moi ban ghi
    }else{
      //kiem tra ten to chuc da ton tai trong he thong hay chua
      this.unitService.checkNameUnique(data, data.name).subscribe(
        dataByName => {
          console.log(dataByName);
          if(dataByName.code == '00'){

            //kiem tra ma to chuc da ton tai trong he thong hay chua
            this.unitService.checkCodeUnique(data, data.code).subscribe(
              dataByCode => {

                if(dataByCode.code == '00'){
                    
                    //kiem tra email da ton tai trong he thong hay chua
                    this.userService.getUserByEmail(data.email).subscribe(
                      dataByEmail => {
                        if(dataByEmail.id == 0){

                          //kiem tra phone da ton tai trong he thong hay chua
                          this.userService.checkPhoneUser(data.phone).subscribe(
                            dataByPhone => {
                              if(dataByPhone.code == '00'){
        
                                //them to chuc
                                this.unitService.addUnit(data).subscribe(
                                  dataUnit => {
                                    //this.toastService.showSuccessHTMLWithTimeout('Thêm mới tổ chức thành công!', "", 3000);
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
                                        //this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò cho tổ chức thành công!', "", 3000);
                                        console.log(dataRole);
                                        //them nguoi dung
                                        const dataUserIn = {
                                          name: "Admin",
                                          email: data.email,
                                          phone: data.phone,
                                          organizationId: dataUnit.id,
                                          role: dataRole.id,
                                          status: 1,
                                          sign_image: []
                                        }
                                        this.userService.addUser(dataUserIn).subscribe(
                                          dataUser => {
                                            console.log(dataUser);
                                            //this.toastService.showSuccessHTMLWithTimeout('Thêm mới người dùng admin thành công!', "", 3000);
                                            this.toastService.showSuccessHTMLWithTimeout('Thêm mới tổ chức thành công!', "", 3000);
                                            this.dialogRef.close();
                                            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                                              this.router.navigate(['/main/unit']);
                                            });
                                            this.spinner.hide();
                                          }, error => {
                                            this.toastService.showErrorHTMLWithTimeout('Thêm mới người dùng admin thất bại', "", 3000);
                                            this.spinner.hide();
                                          }
                                        )
                                      }, error => {
                                        this.toastService.showErrorHTMLWithTimeout('Thêm mới vai trò cho tổ chức thất bại', "", 3000);
                                        this.spinner.hide();
                                      }
                                    )
                                  }, error => {
                                    this.toastService.showErrorHTMLWithTimeout('Thêm mới tổ chức thất bại', "", 3000);
                                    this.spinner.hide();
                                  }
                                )
                              }else if(dataByPhone.code == '01'){
                                this.toastService.showErrorHTMLWithTimeout('Số điện thoại đã tồn tại trong hệ thống', "", 3000);
                                this.spinner.hide();
                              }
                            }, error => {
                              this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                              this.spinner.hide();
                            }
                          )
                          
                        }else{
                          this.toastService.showErrorHTMLWithTimeout('Email đã tồn tại trong hệ thống', "", 3000);
                          this.spinner.hide();
                        }
                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                        this.spinner.hide();
                      }
                    )
                  }else if(dataByCode.code == '01'){
                    this.toastService.showErrorHTMLWithTimeout('Mã tổ chức đã tồn tại trong hệ thống', "", 3000);
                    this.spinner.hide();
                  }
                }, error => {
                  this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                  this.spinner.hide();
                }
              )
              
            }else if(dataByName.code == '01'){
              this.toastService.showErrorHTMLWithTimeout('Tên tổ chức đã tồn tại trong hệ thống', "", 3000);
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
