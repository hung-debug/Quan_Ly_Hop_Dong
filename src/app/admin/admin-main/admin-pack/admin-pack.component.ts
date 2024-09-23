import { CurrencyPipe } from '@angular/common';
import {
  Component,
  OnInit,
  SystemJsNgModuleLoader,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminAddPackComponent } from './admin-add-pack/admin-add-pack.component';
import { AdminDeletePackComponent } from './admin-delete-pack/admin-delete-pack.component';
import { AdminDetailPackComponent } from './admin-detail-pack/admin-detail-pack.component';
import { AdminFilterPackComponent } from './dialog/admin-filter-pack/admin-filter-pack.component';

@Component({
  selector: 'app-admin-pack',
  templateUrl: './admin-pack.component.html',
  styleUrls: ['./admin-pack.component.scss'],
})
export class AdminPackComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: Table;
  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private adminPackService: AdminPackService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe
  ) {}

  filter_name: any = '';
  filter_code: any = '';
  filter_totalBeforeVAT: any = '';
  filter_totalAfterVAT: any = '';
  filter_time: any = '';
  filter_status: any = '';
  filter_number_contract: any = '';

  code: any = '';
  name: any = '';
  total: any = '';
  duration: any = '';
  numberOfContracts: any = '';
  status: any = '';

  listData: any[];
  cols: any[];
  files: any[];
  test: any;
  orgId: any;
  isAdmin: boolean = false;

  deletePackRole: boolean = false;
  editPackRole: boolean = false;
  addPackRole: boolean = false;
  searchPackRole: boolean = false;
  infoPackRole: boolean = false;

  filterSearch: string;

  temp: any[];

  totalRecords: number;
  loading: boolean;
  page: number = 0;

  rows: number;

  ngOnInit(): void {
    this.rows = 20;

    this.deletePackRole = this.checkRole(this.deletePackRole, 'QLGDV_05');
    this.editPackRole = this.checkRole(this.editPackRole, 'QLGDV_02');
    this.addPackRole = this.checkRole(this.addPackRole, 'QLGDV_01');
    this.searchPackRole = this.checkRole(this.searchPackRole, 'QLGDV_03');
    this.infoPackRole = this.checkRole(this.infoPackRole, 'QLGDV_04');

    this.route.queryParams.subscribe((params) => {
      if (typeof params.filter_code != 'undefined' && params.filter_code) {
        this.filter_code = params.filter_code;
      } else {
        this.filter_code = '';
      }

      if (
        typeof params.filter_totalBeforeVAT != 'undefined' &&
        params.filter_totalBeforeVAT
      ) {
        this.filter_totalBeforeVAT = params.filter_totalBeforeVAT;
      } else {
        this.filter_totalBeforeVAT = '';
      }

      if (
        typeof params.filter_totalAfterVAT != 'undefined' &&
        params.filter_totalAfterVAT
      ) {
        this.filter_totalAfterVAT = params.filter_totalAfterVAT;
      } else {
        this.filter_totalAfterVAT = '';
      }

      if (typeof params.filter_status != 'undefined' && params.filter_status) {
        if (params.filter_status == 1) {
          this.filter_status = 1;
        } else if (params.filter_status == 2) {
          this.filter_status = 0;
        } else {
          this.filter_status = '';
        }
      }
      if (typeof params.filter_time != 'undefined' && params.filter_time) {
        this.filter_time = params.filter_time;
      } else {
        this.filter_time = '';
      }

      if (
        typeof params.filter_number_contract != 'undefined' &&
        params.filter_number_contract
      ) {
        this.filter_number_contract = params.filter_number_contract;
      } else {
        this.filter_number_contract = '';
      }
    });

    this.appService.setTitle('DANH SÁCH GÓI DỊCH VỤ');
    // this.searchPack();

    this.cols = [
      { field: 'name', header: 'Tên gói', style: 'text-align: left;' },
      { field: 'code', header: 'Mã gói', style: 'text-align: left;' },
      { field: 'duration', header: 'Thời gian(tháng)', style: 'text-align: left;' },
      {
        field: 'numberOfContracts',
        header: 'Số lượng tài liệu',
        style: 'text-align: left;',
      },
      {
        field: 'totalBeforeVAT',
        header: 'Đơn giá trước VAT',
        style: 'text-align: left;',
      },
      {
        field: 'totalAfterVAT',
        header: 'Đơn giá sau VAT',
        style: 'text-align: left;',
      },
    ];

    if (!(this.editPackRole === false && this.deletePackRole === false)) {
      this.cols.push({
        field: 'id',
        header: 'unit.manage',
        style: 'text-align: center;',
      });
    }
  }

  checkRole(flag: boolean, code: string): boolean {
    let permissions = JSON.parse(localStorage.getItem('currentAdmin') || '')
      .user.permissions;

    const selectedRoleConvert: { code: any }[] = [];

    permissions.forEach((key: any) => {
      let jsonData = { code: key.code, name: key.name };
      selectedRoleConvert.push(jsonData);
    });

    for (let i = 0; i < selectedRoleConvert.length; i++) {
      let role = selectedRoleConvert[i].code;

      if (role.includes(code)) {
        flag = true;
        break;
      }
    }

    return flag;
  }

  array_empty: any = [];

  addPack() {
    const data = {
      title: 'THÊM MỚI GÓI DỊCH VỤ',
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddPackComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result;
    });
  }

  editPack(id: any) {
    const data = {
      title: 'CẬP NHẬT GÓI DỊCH VỤ',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddPackComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result;
    });
  }

  detailPack(id: any) {
    if (this.infoPackRole === true) {
      const data = {
        title: 'THÔNG TIN GÓI DỊCH VỤ',
        id: id,
      };
      // @ts-ignore
      const dialogRef = this.dialog.open(AdminDetailPackComponent, {
        width: '580px',
        backdrop: 'static',
        keyboard: false,
        data,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        let is_data = result;
      });
    }
  }

  deletePack(id: any) {
    const data = {
      title: 'XÓA GÓI DỊCH VỤ',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDeletePackComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      
      let is_data = result;
    });
  }

  autoSearch(event: any) {
    this.table.first = 0;

    

    this.table.first = 0;

    setTimeout(() => {
      this.adminPackService
        .getPackList(this.filterSearch, '', '', '', '', '', '', 0, this.rows)
        .subscribe((res) => {
          this.listData = res.entities;
          this.totalRecords = res.total_elements;
        });
    }, 1000);
  }

  search() {
    const data = {
      title: 'TÌM KIẾM GÓI DỊCH VỤ',
      filter_code: this.filter_code,
      filter_totalBeforeVAT: this.filter_totalBeforeVAT,
      filter_totalAfterVAT: this.filter_totalAfterVAT,
      filter_time: this.filter_time,
      filter_status: this.filter_status,
      filter_number_contract: this.filter_number_contract,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminFilterPackComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      
      let is_data = result;
    });
  }

  loadPack(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      this.adminPackService
        .getPackList(
          this.filter_name,
          this.filter_code,
          this.filter_totalBeforeVAT,
          this.filter_totalAfterVAT,
          this.filter_time,
          this.filter_number_contract,
          this.filter_status,
          this.page,
          20
        )
        .subscribe((res) => {
          this.temp = this.listData;

          this.listData = res.entities;

          this.totalRecords = res.total_elements;
          this.loading = false;
        });
    }, 1000);

    this.page = JSON.parse(JSON.stringify(event)).first / 20;
  }

  getCurrencyFormat(numberCurrency: string) {
    return this.currencyPipe.transform(numberCurrency,'VND','')?.replaceAll(',','.');
  }
}
