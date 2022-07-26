import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddUnitComponent } from 'src/app/main/unit/add-unit/add-unit.component';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import { isConstructorDeclaration } from 'typescript';
import { parttern_input } from '../../../../config/parttern';
import { fileCeCaOptions, roleList } from '../../../../config/variable';
@Component({
  selector: 'app-admin-add-unit',
  templateUrl: './admin-add-unit.component.html',
  styleUrls: ['./admin-add-unit.component.scss'],
})
export class AdminAddUnitComponent implements OnInit {
  addForm: FormGroup;
  datas: any;
  codeOld: any;
  nameOld: any;
  parentName: any;
  emailOld: any;
  phoneOld: any;
  status: any;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  fileCeCaOptions: Array<any> = [];
  submitted = false;
  get f() {
    return this.addForm.controls;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private adminUnitService: AdminUnitService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<AdminAddUnitComponent>,
    public router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private roleService: RoleService
  ) {
    this.addForm = this.fbd.group({
      nameOrg: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      short_name: this.fbd.control('', [
        Validators.pattern(parttern_input.input_form),
      ]),
      code: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      email: this.fbd.control('', [Validators.required, Validators.email]),
      phone: this.fbd.control('', [
        Validators.required,
        Validators.pattern('[0-9 ]{10}'),
      ]),
      size: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      status: 1,
      representatives: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      tax_code: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.taxCode_form),
      ]),
      address: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      position: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      fileCeCa: this.fbd.control('',[
        Validators.required
      ])
    });
  }

  ngOnInit(): void {
    this.fileCeCaOptions = fileCeCaOptions;

    this.datas = this.data;

    console.log('data ');
    console.log(this.data);

    //lay du lieu form cap nhat
    if (this.data.id != null) {
      console.log('vao form cap nhat');

      //lay danh sach to chuc
      this.adminUnitService.getUnitById(this.data.id).subscribe(
        (data) => {
          console.log('data');
          console.log(data);

          this.addForm = this.fbd.group({
            nameOrg: this.fbd.control(data.name, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            short_name: this.fbd.control(data.shortName, [
              Validators.pattern(parttern_input.input_form),
            ]),
            code: this.fbd.control(data.code, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            email: this.fbd.control(data.email, [
              Validators.required,
              Validators.email,
            ]),
            phone: this.fbd.control(data.phone, [
              Validators.required,
              Validators.pattern('[0-9 ]{10}'),
            ]),
            size: this.fbd.control(data.size, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            status: this.convertStatus(data.status),
            representatives: this.fbd.control(data.representative, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            tax_code: this.fbd.control(data.taxCode, [
              Validators.required,
              Validators.pattern(parttern_input.taxCode_form),
            ]),
            address: this.fbd.control(data.address, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            position: this.fbd.control(data.position, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            fileCeCa: this.fbd.control(
              this.convertFileCeCa(data.ceCAPushMode),
              Validators.required
            ),
          });
        },
        (error) => {
          this.toastService.showErrorHTMLWithTimeout(
            'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
            '',
            3000
          );
        }
      );
      //khoi tao form them moi
    } else {
      this.addForm = this.fbd.group({
        nameOrg: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        short_name: this.fbd.control('', [
          Validators.pattern(parttern_input.input_form),
        ]),
        code: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        email: this.fbd.control('', [Validators.required, Validators.email]),
        phone: this.fbd.control('', [
          Validators.required,
          Validators.pattern('[0-9 ]{10}'),
        ]),
        size: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        status: 1,
        representatives: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        tax_code: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.taxCode_form),
        ]),
        address: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        position: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        fileCeCa: this.fbd.control('', [
          Validators.required,
        ]),
      });
    }
  }
  convertFileCeCa(ceCAPushMode: any): any {
    if ((ceCAPushMode = fileCeCaOptions[0].id)) {
      ceCAPushMode = fileCeCaOptions[0];
    } else if ((ceCAPushMode = fileCeCaOptions[1].id)) {
      ceCAPushMode = fileCeCaOptions[1];
    } else if ((ceCAPushMode = fileCeCaOptions[2].id)) {
      ceCAPushMode = fileCeCaOptions[2];
    }

    return ceCAPushMode;
  }

  convertStatus(status: any): any {
    if (status == 'IN_ACTIVE' || status == 'NOT_ACTIVATED') {
      status = 0;
    } else if (status == 'ACTIVE') {
      console.log('status 0');
      status = 1;
    }

    return status;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }

    let dataForm = {
      id: this.data.id,
      name: this.addForm.value.nameOrg,
      shortName: this.addForm.value.short_name,
      code: this.addForm.value.code,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      size: this.addForm.value.size,
      status: this.addForm.value.status,
      representative: this.addForm.value.representatives,
      taxCode: this.addForm.value.tax_code,
      position: this.addForm.value.position,
      address: this.addForm.value.address,
      ceCAPushMode: this.addForm.value.fileCeCa,
    };

    //truong hop sua ban ghi
    if (dataForm.id != null) {
      console.log('vao truong hop sua ban ghi');

      this.adminUnitService.updateUnitt(dataForm).subscribe(
        (data) => {
          console.log('data ', data);

          if (data.id != null) {
            if (data.codeInfo == 1) {
              let roleArrConvert: any = [];

              roleList.forEach((key: any, v: any) => {
                key.items.forEach((keyItem: any, vItem: any) => {
                  let jsonData = { code: keyItem.value, status: 1 };
                  roleArrConvert.push(jsonData);
                });
              });

              const dataRoleIn = {
                name: 'Admin',
                code: 'ADMIN',
                selectedRole: roleArrConvert,
                organization_id: data.id,
              };

              this.adminUnitService.addRoleByOrg(dataRoleIn).subscribe(
                (dataRole) => {
                  //this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò cho tổ chức thành công!', "", 3000);
                  console.log(dataRole);
                  //them nguoi dung
                  const dataUserIn = {
                    name: 'Admin',
                    email: data.email,
                    phone: data.phone,
                    organizationId: data.id,
                    role: dataRole.id,
                    status: 1,
                    sign_image: [],
                  };

                  this.adminUnitService.addUser(dataUserIn).subscribe(
                    (dataUser) => {
                      console.log(dataUser);
                      this.toastService.showSuccessHTMLWithTimeout(
                        'Cập nhật tổ chức thành công!',
                        '',
                        3000
                      );
                      this.dialogRef.close();
                      this.router
                        .navigateByUrl('/', { skipLocationChange: true })
                        .then(() => {
                          this.router.navigate(['/admin-main/unit']);
                        });
                    },
                    (error) => {
                      this.toastService.showErrorHTMLWithTimeout(
                        'Cập nhật người dùng admin thất bại',
                        '',
                        3000
                      );
                    }
                  );
                },
                (error) => {
                  this.toastService.showErrorHTMLWithTimeout(
                    'Cập nhật tổ chức thất bại',
                    '',
                    3000
                  );
                }
              );
            } else if (data.codeInfo == 2) {
              this.adminUnitService.getUserByEmail(data.email).subscribe(
                (responseEmail) => {
                  this.adminUnitService.getRoleByOrgId(data.id).subscribe(
                    (dataRoleByOrgId) => {
                      console.log('data role by org id ', dataRoleByOrgId);

                      let roleAdmin = dataRoleByOrgId.entities.filter(
                        (p: any) => p.code == 'ADMIN'
                      );

                      const dataUpdateUser = {
                        id: responseEmail.id,
                        name: 'Admin',
                        email: dataForm.email,
                        phone: dataForm.phone,
                        organizationId: data.id,
                        role: roleAdmin[0].id,
                        status: 1,
                        phoneKpi: null,
                        networkKpi: null,
                        nameHsm: null,
                        sign_image: [],
                      };

                      this.adminUnitService
                        .updateUser(dataUpdateUser)
                        .subscribe(
                          (response) => {
                            this.toastService.showSuccessHTMLWithTimeout(
                              'Cập nhật tổ chức thành công!',
                              '',
                              3000
                            );
                            this.dialogRef.close();
                            this.router
                              .navigateByUrl('/', { skipLocationChange: true })
                              .then(() => {
                                this.router.navigate(['/admin-main/unit']);
                              });
                          },
                          (error) => {
                            this.toastService.showErrorHTMLWithTimeout(
                              'Cập nhật tổ chức thất bại',
                              '',
                              3000
                            );
                          }
                        );
                    },
                    (error) => {
                      this.toastService.showErrorHTMLWithTimeout(
                        'Cập nhật tổ chức thất bại',
                        '',
                        3000
                      );
                    }
                  );
                },
                (error) => {
                  this.toastService.showErrorHTMLWithTimeout(
                    'Cập nhật tổ chức thất bại',
                    '',
                    3000
                  );
                }
              );
            } else if (data.codeInfo == 3) {
              this.toastService.showErrorHTMLWithTimeout(
                'Email đã tồn tại trong tổ chức khác',
                '',
                3000
              );
            } else {
              this.toastService.showErrorHTMLWithTimeout(
                'Cập nhật thất bại',
                '',
                3000
              );
            }
            // console.log(data.status);

            // this.toastService.showSuccessHTMLWithTimeout(
            //   'Cập nhật thành công!',
            //   '',
            //   3000
            // );
            // this.router
            //   .navigateByUrl('/', { skipLocationChange: true })
            //   .then(() => {
            //     this.router.navigate(['admin-main/unit']);
            //   });

            // this.dialog.closeAll();
          } else {
            if (data.errors[0].code == 1001) {
              this.toastService.showErrorHTMLWithTimeout(
                'Email đã tồn tại trên hệ thống',
                '',
                3000
              );
            } else if (data.errors[0].code == 1003) {
              this.toastService.showErrorHTMLWithTimeout(
                'Tên tổ chức đã được sử dụng',
                '',
                3000
              );
            } else if (data.errors[0].code == 1002) {
              this.toastService.showErrorHTMLWithTimeout(
                'SĐT đã được sử dụng',
                '',
                3000
              );
            } else if (data.errors[0].code == 1006) {
              this.toastService.showErrorHTMLWithTimeout(
                'Mã số thuế đã tồn tại trên hệ thống',
                '',
                3000
              );
            }
          }
        },
        (error) => {
          console.log('error ');
          console.log(error);
          this.toastService.showErrorHTMLWithTimeout(
            'Cập nhật thất bại',
            '',
            3000
          );
        }
      );

      //truong hop them moi ban ghi
    } else {
      this.addUnit(dataForm);
    }
  }

  addUnit(dataForm: {
    id: any;
    name: any;
    shortName: any;
    code: any;
    email: any;
    phone: any;
    size: any;
    status: any;
    representative: any;
    taxCode: any;
    position: any;
    address: any;
  }) {
    console.log('vao truong hop them moi ban ghi');

    if (dataForm.status == 1) {
      dataForm.status = 'ACTIVE';
    } else if (dataForm.status == 0) {
      dataForm.status = 'IN_ACTIVE';
    }

    this.adminUnitService.addUnit(dataForm).subscribe(
      (data) => {
        if (data.id != null && data.id != undefined) {
          if (data.status == 'ACTIVE') {
            //them vai tro
            let roleArrConvert: any = [];

            roleList.forEach((key: any, v: any) => {
              key.items.forEach((keyItem: any, vItem: any) => {
                let jsonData = { code: keyItem.value, status: 1 };
                roleArrConvert.push(jsonData);
              });
            });

            console.log("roleArrConvert ",roleArrConvert);

            const dataRoleIn = {
              name: 'Admin',
              code: 'ADMIN',
              selectedRole: roleArrConvert,
              organization_id: data.id,
            };

            this.adminUnitService.addRoleByOrg(dataRoleIn).subscribe(
              (dataRole) => {
                //this.toastService.showSuccessHTMLWithTimeout('Thêm mới vai trò cho tổ chức thành công!', "", 3000);
                console.log("dataRole ",dataRole);
                //them nguoi dung
                const dataUserIn = {
                  name: 'Admin',
                  email: data.email,
                  phone: data.phone,
                  organizationId: data.id,
                  role: dataRole.id,
                  status: 1,
                  sign_image: [],
                };

                this.adminUnitService.addUser(dataUserIn).subscribe(
                  (dataUser) => {
                    console.log(dataUser);
                    //this.toastService.showSuccessHTMLWithTimeout('Thêm mới người dùng admin thành công!', "", 3000);
                    this.toastService.showSuccessHTMLWithTimeout(
                      'Thêm mới tổ chức thành công!',
                      '',
                      3000
                    );
                  },
                  (error) => {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Thêm mới người dùng admin thất bại',
                      '',
                      3000
                    );
                  }
                );
              },
              (error) => {
                this.toastService.showErrorHTMLWithTimeout(
                  'Thêm mới vai trò cho tổ chức thất bại',
                  '',
                  3000
                );
              }
            );
          } else {
            this.toastService.showSuccessHTMLWithTimeout(
              'Thêm mới tổ chức thành công!',
              '',
              3000
            );
          }

          this.dialogRef.close();
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/admin-main/unit']);
            });
        } else {
          if (data.errors[0].code == 1001) {
            this.toastService.showErrorHTMLWithTimeout(
              'Email đã tồn tại trên hệ thống',
              '',
              3000
            );
          } else if (data.errors[0].code == 1003) {
            this.toastService.showErrorHTMLWithTimeout(
              'Tên tổ chức đã được sử dụng',
              '',
              3000
            );
          } else if (data.errors[0].code == 1006) {
            this.toastService.showErrorHTMLWithTimeout(
              'Mã số thuế đã tồn tại trên hệ thống',
              '',
              3000
            );
          } else if (data.errors[0].code == 1002) {
            this.toastService.showErrorHTMLWithTimeout(
              'SĐT đã được sử dụng',
              '',
              3000
            );
          }
        }
      },
      (error) => {
        console.log('error ');
        console.log(error);
        this.toastService.showErrorHTMLWithTimeout(
          'Thêm mới thất bại',
          '',
          3000
        );
      }
    );
  }
}
