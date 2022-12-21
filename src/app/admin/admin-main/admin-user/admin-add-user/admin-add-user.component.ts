import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItemGroup } from 'primeng/api';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { parttern_input } from '../../../../config/parttern';
import { adminRoleList } from '../../../../config/variable';
@Component({
  selector: 'app-admin-add-user',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.component.scss'],
})
export class AdminAddUserComponent implements OnInit {
  submitted = false;
  selectedRoleConvert: any[];
  get f() {
    return this.addForm.controls;
  }
  groupedRole: SelectItemGroup[];

  action: string;
  private sub: any;
  id: any = null;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  networkList: Array<any> = [];
  roleList: Array<any> = [];
  phoneOld: any;

  addForm: FormGroup;
  datas: any;
  attachFile: any;
  sign_image: null;
  imgSignBucket: null;
  imgSignPath: null;
  isEditRole: boolean = false;

  organizationName: any;
  roleName: any;
  userRoleCode: string = '';

  //phan quyen
  isQLND_01: boolean = true; //them moi nguoi dung
  isQLND_02: boolean = true; //sua nguoi dung

  //0 -> add
  //1 -> update
  flagAddUpdate: number = -1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService,
    private toastService: ToastService,
    private adminUserService: AdminUserService,
    private route: ActivatedRoute,
    private fbd: FormBuilder,
    public router: Router,
    public dialog: MatDialog
  ) {
    this.addForm = this.fbd.group({
      name: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      email: this.fbd.control('', [Validators.required, Validators.email]),
      phone: this.fbd.control('', [
        Validators.required,
        Validators.pattern('[0-9 ]{10}'),
      ]),
      role: this.fbd.control('', [Validators.required]),
      password: this.fbd.control('', [Validators.required]),
      status: 1,
    });
  }

  checkClick() {
    console.log('flag ' + this.flagAddUpdate);

    if (this.flagAddUpdate === 0) {
      console.log('on submit');
      this.onSubmit();
    } else if (this.flagAddUpdate === 1) {
      this.update();
    }
  }

  getDataOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.action = params['action'];

      //set title
      if (!this.data.id) {
        this.flagAddUpdate = 0;

        this.addForm = this.fbd.group({
          name: this.fbd.control('', [
            Validators.required,
            Validators.pattern(parttern_input.input_form),
          ]),
          email: this.fbd.control('', [Validators.required, Validators.email]),
          phone: this.fbd.control('', [
            Validators.required,
            Validators.pattern('[0-9 ]{10}'),
          ]),
          role: this.fbd.control('', [Validators.required]),
          status: 1,
        });
      } else {
        this.flagAddUpdate = 1;
        this.addForm.controls.email.disable();

        this.id = this.data.id;
        //this.appService.setTitle('user.update');

        this.adminUserService.getUserById(this.id).subscribe(
          (data) => {
            this.addForm = this.fbd.group({
              name: this.fbd.control(data.name, [
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

              role: this.fbd.control(this.convertRoleArr(data.permissions), [
                Validators.required,
              ]),

              status: this.convertStatus(data.status),
            });

            this.phoneOld = data.phone;
          },
          (error) => {
            // this.toastService.showErrorHTMLWithTimeout(
            //   'Lỗi lấy thông tin người dùng',
            //   '',
            //   3000
            // );
            this.router.navigate(['/login'])
          }
        );
      }
    });
  }
  convertStatus(status: any): any {
    if (status == 'ACTIVE') {
      return 1;
    } else if (status == 'IN_ACTIVE') {
      return 0;
    }

    return -1;
  }

  convertRoleArr(roleArr: []) {
    let roleArrConvert: any = [];
    roleArr.forEach((key: any, v: any) => {
      roleArrConvert.push(key.code);
    });

    console.log('role arr convert');
    console.log(roleArrConvert);

    return roleArrConvert;
  }

  ngOnInit(): void {
    this.getDataOnInit();
    this.groupedRole = adminRoleList;
  }

  onCancel() {
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['/main/user']);
    // });

    this.dialog.closeAll();
  }

  update() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }

    const dataUpdate = {
      id: this.data.id,
      name: this.addForm.value.name,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      role: this.addForm.value.role,
      status: this.addForm.value.status,
    };

    var selectedRoleConvert: any[] = [];

    dataUpdate.role.forEach((key: any) => {
      let jsonData = { code: key };
      selectedRoleConvert.push(jsonData);
    });

    dataUpdate.role = selectedRoleConvert;

    this.adminUserService.updateUser(dataUpdate).subscribe(
      (data) => {
        if (data.id != undefined && data.id != null) {
          this.toastService.showSuccessHTMLWithTimeout(
            'Cập nhật thành công!',
            '',
            3000
          );

          if (data.status == 'ACTIVE') {
            this.adminUserService.getUserById(dataUpdate.id).subscribe(
              (data) => {
                if (
                  data.id ==
                  JSON.parse(localStorage.getItem('currentAdmin') || '').user.id
                ) {
                  console.log('vao day');

                  const dataUpdate = {
                    token: JSON.parse(
                      localStorage.getItem('currentAdmin') || ''
                    ).token,
                    user: JSON.parse(localStorage.getItem('currentAdmin') || '')
                      .user,
                  };

                  dataUpdate.user.permissions = data.permissions;
                  dataUpdate.user.name = data.name;

                  localStorage.setItem(
                    'currentAdmin',
                    JSON.stringify(dataUpdate)
                  );

                  let flag = 0;
                  if (dataUpdate.user.permissions.length == 1) {
                    if (dataUpdate.user.permissions[0].code.includes('QLTC')) {
                      this.router.navigate(['/admin-main/unit']);
                    } else if (
                      dataUpdate.user.permissions[0].code.includes('QLGDV')
                    ) {
                      this.router.navigate(['/admin-main/pack']);
                    }

                    flag = 1;

                    setTimeout(() => {
                      window.location.reload();
                    }, 100);
                  } else {
                    for (
                      let i = 0;
                      i < dataUpdate.user.permissions.length;
                      i++
                    ) {
                      if (
                        dataUpdate.user.permissions[i].code.includes('QLND')
                      ) {
                        window.location.reload();
                        flag = 2;
                        break;
                      }
                    }

                    if (flag == 0) {
                      console.log('vao day ');
                      for (
                        let i = 0;
                        i < dataUpdate.user.permissions.length;
                        i++
                      ) {
                        if (
                          dataUpdate.user.permissions[i].code.includes('QLTC')
                        ) {
                          console.log('vao phan quan ly to chuc');
                          this.router.navigate(['/admin-main/unit']);
                          break;
                        } else {
                          console.log('vao day goi dich vu');
                          this.router.navigate(['/admin-main/pack']);
                          break;
                        }
                      }

                      setTimeout(() => {
                        window.location.reload();
                      }, 100);
                    } 
                  }
                }
              },
              (error) => {
                // this.toastService.showErrorHTMLWithTimeout(
                //   'Lỗi lấy thông tin người dùng',
                //   '',
                //   3000
                // );
                this.router.navigate(['/login'])
              }
            );
          } else {
            this.router.navigate(['/admin/login']);
            localStorage.clear();
          }

          this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['admin-main/user']);
          });
          this.dialog.closeAll();
        } else {
          if (data.errors[0].code === 1001) {
            this.toastService.showErrorHTMLWithTimeout(
              'Email đã tồn tại trên hệ thống',
              '',
              3000
            );
          } else if (data.errors[0].code === 1002) {
            this.toastService.showErrorHTMLWithTimeout(
              'SĐT đã được sử dụng',
              '',
              3000
            );
          }
        }
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout(
          'Cập nhật thất bại',
          '',
          3000
        );
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    // if (this.addForm.invalid) {
    //   return;
    // }

    const data = {
      name: this.addForm.value.name,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      role: this.addForm.value.role,
      status: this.addForm.value.status,
    };
    console.log(data);

    this.selectedRoleConvert = [];

    console.log('data role ');
    console.log(data.role);

    data.role.forEach((key: any, v: any) => {
      let jsonData = { code: key };
      this.selectedRoleConvert.push(jsonData);
    });

    console.log('this selected role convert ' + this.selectedRoleConvert);

    data.role = this.selectedRoleConvert;

    this.adminUserService.addUser(data).subscribe(
      (data) => {
        if (data.id != null || data.id != undefined) {
          this.toastService.showSuccessHTMLWithTimeout(
            'Thêm mới thành công!',
            '',
            3000
          );
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['admin-main/user']);
            });

          this.dialog.closeAll();
        } else {
          // this.toastService.showErrorHTMLWithTimeout(
          //   data.errors[0].message,
          //   '',
          //   3000
          // );

          console.log('error');
          console.log(data.errors);

          if (data.errors[0].code === 1001) {
            this.toastService.showErrorHTMLWithTimeout(
              'Email đã tồn tại trên hệ thống',
              '',
              3000
            );
          } else if (data.errors[0].code === 1002) {
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

  fileChangedAttach(e: any) {
    console.log(e.target.files);
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = e.target.files[i];
      if (file) {
        // giới hạn file upload lên là 5mb
        if (e.target.files[0].size <= 50000000) {
          const file_name = file.name;
          const extension = file.name.split('.').pop();
          if (
            extension.toLowerCase() == 'jpg' ||
            extension.toLowerCase() == 'png' ||
            extension.toLowerCase() == 'jpge'
          ) {
            this.handleUpload(e);
            this.attachFile = file;
            console.log(this.attachFile);
          } else {
            this.toastService.showErrorHTMLWithTimeout(
              'File hợp đồng yêu cầu định dạng JPG, PNG, JPGE',
              '',
              3000
            );
          }
        } else {
          this.attachFile = null;
          this.toastService.showErrorHTMLWithTimeout(
            'Yêu cầu file nhỏ hơn 50MB',
            '',
            3000
          );
          break;
        }
      }
    }
  }
  imgSignPCSelect: string;
  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //console.log(reader.result);
      this.imgSignPCSelect = reader.result ? reader.result.toString() : '';
    };
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }
}
