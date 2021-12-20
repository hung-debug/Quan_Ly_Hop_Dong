import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { UnitService } from 'src/app/service/unit.service';
import { AddUnitComponent } from './add-unit/add-unit.component';
import { DetailUnitComponent } from './detail-unit/detail-unit.component';

export interface TreeNode {
  name?: any;
  short_name?: any;
  code?: any;
  status?: any;
  parent_id?: any;
  children?: TreeNode[];
  }
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private unitService: UnitService) { }

  code:any = "";
  name:any = "";
  list: any[];
  cols: any[];

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH TỔ CHỨC");
    this.searchUnit();

    this.cols = [
      { field: 'name', header: 'Tên tổ chức', style:'text-align: left;' },
      { field: 'short_name', header: 'Tên viết tắt', style:'text-align: left;' },
      { field: 'code', header: 'Mã tổ chức', style:'text-align: left;' },
      { field: 'status', header: 'Trạng thái', style:'text-align: left;' },
      { field: 'parent_id', header: 'Loại tổ chức', style:'text-align: left;' },
      { field: 'id', header: 'Quản lý', style:'text-align: center;' },
      ];
  }

  searchUnit(){
    this.unitService.getUnitList(this.code, this.name).subscribe(response => {
      console.log(response);
      this.list = response.entities;
      console.log(this.list);
    });
  }

  addUnit() {
    const data = {
      title: 'THÊM MỚI TỔ CHỨC'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  editUnit(id:any) {
    const data = {
      title: 'CẬP NHẬT THÔNG TIN TỔ CHỨC',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddUnitComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  detailUnit(id:any) {
    const data = {
      title: 'THÔNG TIN TỔ CHỨC',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DetailUnitComponent, {
      width: '580px',
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
