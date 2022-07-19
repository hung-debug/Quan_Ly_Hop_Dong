import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { roleList } from 'src/app/config/variable';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-active-unit',
  templateUrl: './admin-active-unit.component.html',
  styleUrls: ['./admin-active-unit.component.scss'],
})
export class AdminActiveUnitComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<AdminActiveUnitComponent>,
    public router: Router,
    public dialog: MatDialog,
    private adminUnitService: AdminUnitService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.adminUnitService.activeUnit(this.data.id).subscribe(
      (data) => {
        if (data.status == 'ACTIVE') {
          if (data.codeInfo == 4) {
            //them vai tro
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
                      'Kích hoạt thành công!',
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
              'Kích hoạt thành công!',
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
          this.toastService.showErrorHTMLWithTimeout(
            'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
            '',
            3000
          );
        }
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout(
          'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
          '',
          3000
        );
      }
    );
  }
}
