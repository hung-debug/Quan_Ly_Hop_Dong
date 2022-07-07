import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminActiveUnitComponent } from './admin-active-unit/admin-active-unit.component';
import { AdminAddUnitComponent } from './admin-add-unit/admin-add-unit.component';
import { AdminDeleteUnitComponent } from './admin-delete-unit/admin-delete-unit.component';
import { AdminDetailUnitComponent } from './admin-detail-unit/admin-detail-unit.component';
import { AdminFilterUnitComponent } from './dialog/admin-filter-unit/admin-filter-unit.component';

@Component({
  selector: 'app-admin-unit',
  templateUrl: './admin-unit.component.html',
  styleUrls: ['./admin-unit.component.scss'],
})
export class AdminUnitComponent implements OnInit {
  filter_representative: any = '';
  filter_email: any = '';
  filter_phone: any = '';
  filter_status: any = '';
  filter_address: any = '';
  filter_name: any = '';

  private sub: any;
  action: string;
  status: string;

  @ViewChild('myTable', { static: false }) table: Table;
  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private adminUnitService: AdminUnitService,
    private adminUserService: AdminUserService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  code: any = '';
  name: any = '';
  cols: any[];
  files: any[];
  test: any;
  total: any;
  orgId: any;
  isAdmin: boolean = false;
  adminUnit: boolean = true;

  addUnitRole: boolean = false;
  searchUnitRole: boolean = false;
  infoUnitRole: boolean = false;
  activeUnitRole: boolean = false;
  editUnitRole: boolean = false;
  deleteUnitRole: boolean = false;

  filterSearch: any = '';

  temp: any[];
  totalRecords: number;
  tempTotal: number = 0;
  page: number = 0;
  loading: boolean;
  flagSearch: boolean = false;

  listData: any[];
  tempList: any;

  rows: number;

  ngOnInit(): void {
    this.rows = 20;

    this.appService.setTitle('unit.list');
    this.addUnitRole = this.checkRole(this.addUnitRole, 'QLTC_01');
    this.searchUnitRole = this.checkRole(this.searchUnitRole, 'QLTC_09');
    this.infoUnitRole = this.checkRole(this.infoUnitRole, 'QLTC_10');
    this.activeUnitRole = this.checkRole(this.activeUnitRole, 'QLTC_08');
    this.editUnitRole = this.checkRole(this.editUnitRole, 'QLTC_02');
    this.deleteUnitRole = this.checkRole(this.deleteUnitRole, 'QLTC_07');

    console.log('add unit role');
    console.log(this.addUnitRole);

    this.route.queryParams.subscribe((params) => {
      console.log('param filter re');
      console.log(params.filter_address);

      if (
        typeof params.filter_representative != 'undefined' &&
        params.filter_representative
      ) {
        this.filter_representative = params.filter_representative;
      } else {
        this.filter_representative = '';
      }
      if (typeof params.filter_email != 'undefined' && params.filter_email) {
        this.filter_email = params.filter_email;
      } else {
        this.filter_email = '';
      }
      if (typeof params.filter_phone != 'undefined' && params.filter_phone) {
        this.filter_phone = params.filter_phone;
      } else {
        this.filter_phone = '';
      }
      if (typeof params.filter_status != 'undefined' && params.filter_status) {
        if (params.filter_status != 0) {
          this.filter_status = params.filter_status;
        } else {
          this.filter_status = '';
        }
      } else {
        this.filter_status = '';
      }
      if (
        typeof params.filter_address != 'undefined' &&
        params.filter_address
      ) {
        this.filter_address = params.filter_address;
      } else {
        this.filter_address = '';
      }
    });

    this.sub = this.route.params.subscribe((params) => {
      this.action = params['action'];
      this.status = params['status'];

      // this.getUnitList();
    });

    console.log('info unit role');
    console.log(this.infoUnitRole);

    // this.getUnitList();

    this.cols = [
      { field: 'name', header: 'unit.name', style: 'text-align: left;' },
      { field: 'code', header: 'unit.code', style: 'text-align: left;' },
      { field: 'phone', header: 'Số điện thoại', style: 'text-align: left;' },
      { field: 'active', header: 'Kích hoạt', style: 'text-align: left;' },
      { field: 'email', header: 'Email đăng ký', style: 'text-align: left;' },
      // { field: 'id', header: 'unit.manage', style: 'text-align: center;' },
    ];

    if (!(this.editUnitRole === false && this.deleteUnitRole === false)) {
      this.cols.push({
        field: 'id',
        header: 'unit.manage',
        style: 'text-align: center;',
      });
    }
  }

  loadUnit(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      this.adminUnitService
        .getUnitList(
          this.filterSearch,
          this.filterSearch,
          this.filter_address,
          this.filter_representative,
          this.filter_email,
          this.filter_phone,
          this.filter_status,
          this.page,
          this.rows
        )
        .subscribe((res) => {
          console.log('page', this.page);

          this.temp = this.listData;

          this.listData = res.entities;

          this.totalRecords = res.total_elements;
          this.loading = false;
        });
    }, 1000);

    this.page = JSON.parse(JSON.stringify(event)).first / this.rows;
  }

  checkRole(flag: boolean, code: string): boolean {
    let permissions = JSON.parse(localStorage.getItem('currentAdmin') || '')
      .user.permissions;

    const selectedRoleConvert: { code: any }[] = [];

    permissions.forEach((key: any) => {
      let jsonData = { code: key.code, name: key.name };
      selectedRoleConvert.push(jsonData);
    });

    console.log('se');
    console.log(selectedRoleConvert);

    for (let i = 0; i < selectedRoleConvert.length; i++) {
      let role = selectedRoleConvert[i].code;

      if (role.includes(code)) {
        console.log('role ', role);
        console.log('code ', code);
        console.log('i ', i);

        flag = true;
        break;
      }
    }

    return flag;
  }

  array_empty: any = [];

  //Tìm kiếm tổ chức
  searchUnit() {
    const data = {
      title: 'TÌM KIẾM TỔ CHỨC',
      filter_representative: this.filter_representative,
      filter_email: this.filter_email,
      filter_phone: this.filter_phone,
      filter_status: this.filter_status,
      filter_address: this.filter_address,
    };

    // @ts-ignore
    const dialogRef = this.dialog.open(AdminFilterUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;

      console.log('result');
      console.log(result);
    });
  }

  //Thêm mới tổ chức
  addUnit() {
    const data = {
      title: 'unit.add',
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  editUnit(id: any) {
    const data = {
      title: 'unit.update',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  deleteUnit(id: any) {
    const data = {
      title: 'XOÁ TỔ CHỨC',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDeleteUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  detailUnit(id: any) {
    console.log('id unit ', id);
    if (this.infoUnitRole === true) {
      const data = {
        title: 'unit.information',
        id: id,
      };
      // @ts-ignore
      const dialogRef = this.dialog.open(AdminDetailUnitComponent, {
        width: '80%',
        height: '80%',
        backdrop: 'static',
        keyboard: false,
        data,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('the close dialog');
        let is_data = result;
      });
    }
  }

  activeUnit(id: any) {
    if (this.activeUnitRole === true) {
      const data = {
        title: 'KÍCH HOẠT TỔ CHỨC',
        id: id,
      };
      // @ts-ignore
      const dialogRef = this.dialog.open(AdminActiveUnitComponent, {
        width: '400px',
        backdrop: 'static',
        keyboard: false,
        data,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('the close dialog');
        let is_data = result;
      });
    }
  }

  autoSearch(event: any) {
    setTimeout(() => {
      this.table.first = 0;

      this.adminUnitService
        .getUnitList(
          this.filterSearch,
          this.filterSearch,
          '',
          '',
          '',
          '',
          '',
          0,
          this.rows
        )
        .subscribe((res) => {
          console.log('res ');
  
          this.listData = res.entities;
  
          this.totalRecords = res.total_elements;
  
          this.tempTotal = this.totalRecords;
          this.tempList = this.listData;
        });
    },1000)
  }
}
