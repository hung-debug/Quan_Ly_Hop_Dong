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
  selector: 'app-admin-detail-user',
  templateUrl: './admin-detail-user.component.html',
  styleUrls: ['./admin-detail-user.component.scss'],
})
export class AdminDetailUserComponent implements OnInit {
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
    });
  }

  convertRoleArr(roleArr: []) {
    let roleArrConvert: any = [];
    roleArr.forEach((key: any, v: any) => {
      roleArrConvert.push(key.code);
    });

    return roleArrConvert;
  }

  getDataOnInit() {
    this.addForm.controls.email.disable();

    this.id = this.data.id;

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
          birthday: data.birthday == null ? null : new Date(data.birthday),
          phone: this.fbd.control(data.phone, [
            Validators.required,
            Validators.pattern('[0-9 ]{10}'),
          ]),
          organizationId: this.fbd.control(data.organization_id, [
            Validators.required,
          ]),

          role: this.fbd.control(this.convertRoleArr(data.permissions), [
            Validators.required,
          ]),

          password: this.fbd.control(data.password, [Validators.required]),
          status: data.status,
        });
        this.phoneOld = data.phone;
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout(
          'Lỗi lấy thông tin người dùng',
          '',
          3000
        );
      }
    );
  }

  ngOnInit(): void {
    this.getDataOnInit();
    this.groupedRole = adminRoleList;
  }
}
