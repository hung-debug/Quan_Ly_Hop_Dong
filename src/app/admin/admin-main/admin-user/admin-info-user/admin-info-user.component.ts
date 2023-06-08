import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parttern_input } from 'src/app/config/parttern';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-info-user',
  templateUrl: './admin-info-user.component.html',
  styleUrls: ['./admin-info-user.component.scss'],
})
export class AdminInfoUserComponent implements OnInit {
  addForm: FormGroup;
  data: any;
  submitted = false;

  constructor(
    private fbd: FormBuilder,
    private adminUserService: AdminUserService,
    private toastService: ToastService,
    public router: Router,
    private appService: AppService
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
    });
  }

  get f() {
    return this.addForm.controls;
  }

  ngOnInit(): void {
    this.appService.setTitle('Thông tin tài khoản');

    const id = JSON.parse(localStorage.getItem('currentAdmin') || '').user.id;

    var selectedRoleConvert: any[] = [];

    this.adminUserService.getUserById(id).subscribe(
      (data) => {
        this.data = data;
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
        });
      },
      (error) => {
        setTimeout(() => this.router.navigate(['/login']));
        this.toastService.showErrorHTMLWithTimeout(
          'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!',
          '',
          3000
        );
        
      }
    );
  }

  updateInfor() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }

    const dataUpdate = {
      id: this.data.id,
      name: this.addForm.value.name,
      email: this.data.email,
      phone: this.addForm.value.phone,
      role: this.data.permissions,
      status: this.data.status,
    };

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

                const dataUpdate = {
                  token: JSON.parse(localStorage.getItem('currentAdmin') || '')
                    .token,
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

                } else {
                  for (let i = 0; i < dataUpdate.user.permissions.length; i++) {
                    if (dataUpdate.user.permissions[i].code.includes('QLND')) {
                      setTimeout(() => {
                        window.location.reload();
                      },3000)
                      flag = 2;
                      break;
                    }
                  }

                  if (flag == 0) {
                    
                    for (
                      let i = 0;
                      i < dataUpdate.user.permissions.length;
                      i++
                    ) {
                      if (
                        dataUpdate.user.permissions[i].code.includes('QLTC')
                      ) {
                        
                        this.router.navigate(['/admin-main/unit']);
                        break;
                      } else {
                        
                        this.router.navigate(['/admin-main/pack']);
                        break;
                      }
                    }

                  }
                }
              },
              (error) => {
                setTimeout(() => this.router.navigate(['/login']));
                this.toastService.showErrorHTMLWithTimeout(
                  'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!',
                  '',
                  3000
                );
                
              }
            );
          } else {
            this.router.navigate(['/admin/login']);
            localStorage.clear();
          }

        } else {
          if (data.errors[0].code === 1002) {
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
}
