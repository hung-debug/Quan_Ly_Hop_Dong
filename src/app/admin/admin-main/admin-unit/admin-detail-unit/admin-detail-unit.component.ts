import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { AdminAddPackUnitComponent } from '../admin-add-pack-unit/admin-add-pack-unit.component';

@Component({
  selector: 'app-admin-detail-unit',
  templateUrl: './admin-detail-unit.component.html',
  styleUrls: ['./admin-detail-unit.component.scss']
})
export class AdminDetailUnitComponent implements OnInit {

  datas:any;
  cols: any[];
  list: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AdminDetailUnitComponent>,
    public router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.unitService.getUnitById(this.data.id).subscribe(
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
      { field: 'time', header: 'Thời gian', style:'text-align: left;' },
      { field: 'start_time', header: 'Ngày bắt đầu', style:'text-align: left;' },
      { field: 'status', header: 'Trạng thái', style:'text-align: left;' },
      { field: 'id', header: 'unit.manage', style:'text-align: center;' },
      ]; 
  }

  addPack(id:any) {
    const data = {
      title: 'unit.information',
      id: id,
    };
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
