import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { AdminAddPackUnitComponent } from '../admin-add-pack-unit/admin-add-pack-unit.component';
import { AdminDeletePackUnitComponent } from '../admin-delete-pack-unit/admin-delete-pack-unit.component';
import { AdminDetailPackUnitComponent } from '../admin-detail-pack-unit/admin-detail-pack-unit.component';

@Component({
  selector: 'app-admin-detail-unit',
  templateUrl: './admin-detail-unit.component.html',
  styleUrls: ['./admin-detail-unit.component.scss']
})
export class AdminDetailUnitComponent implements OnInit {

  datas:any;
  cols: any[];
  list: any[];
  name: string;
  code: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AdminDetailUnitComponent>,
    public router: Router,
    public dialog: MatDialog,
    private adminUnitService: AdminUnitService,
    ) { }

  ngOnInit(): void {

    console.log("detai unit");

    this.adminUnitService.getUnitById(this.data.id).subscribe(
      data => {
        console.log(data);
        this.datas = data;
        
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )

    this.cols = [
      { field: 'name', header: 'Tên gói', style:'text-align: left;' },
      { field: 'code', header: 'Mã gói', style:'text-align: left;' },
      { field: 'duration', header: 'Thời gian', style:'text-align: left;' },
      { field: 'startDate', header: 'Ngày bắt đầu', style:'text-align: left;' },
      { field: 'usageStatus', header: 'Trạng thái sử dụng', style:'text-align: left;' },
      { field: 'id', header: 'unit.manage', style:'text-align: center;' },
      ]; 
      
      this.searchPackUnit();
  }
  searchPackUnit() {
    this.adminUnitService.getUnitById(this.data.id).subscribe((response) => {
      console.log("res ",response);
      this.list = response.services;
    })

  }

  detailPackUnit(id: any) {
    console.log("id unit ", id);
    const data = {
      title: 'CHI TIẾT GÓI DỊCH VỤ CỦA TỔ CHỨC',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDetailPackUnitComponent, {
      width: '600px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  addPack() {
    const data = {
      title: 'THÊM GÓI DỊCH VỤ CHO TỔ CHỨC',
      id: this.data.id,
      idPack: null
    };

    console.log("add ",data.id);

    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddPackUnitComponent, {
      width: '600px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  deleteUnitPack(id: any) {
    const data = {
      title: 'XOÁ GÓI DỊCH VỤ CHO TỔ CHỨC',
      id: this.data.id,
      idPack: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDeletePackUnitComponent, {
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

  editUnitPack(id: any) {
    const data = {
      title: 'SỬA GÓI DỊCH VỤ CHO TỔ CHỨC',
      id: this.data.id,
      idPack: id
    };

    console.log("edit ", data.idPack);

    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddPackUnitComponent, {
      width: '600px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }


}
