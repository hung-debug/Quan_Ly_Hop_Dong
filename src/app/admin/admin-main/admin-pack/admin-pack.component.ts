import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminAddPackComponent } from './admin-add-pack/admin-add-pack.component';
import { AdminDetailPackComponent } from './admin-detail-pack/admin-detail-pack.component';

@Component({
  selector: 'app-admin-pack',
  templateUrl: './admin-pack.component.html',
  styleUrls: ['./admin-pack.component.scss']
})
export class AdminPackComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private adminPackService: AdminPackService,
    private toastService: ToastService) { }

  code:any = "";
  name:any = "";
  price:any = "";
  time:any = "";
  status:any = "";
  number_contract:any = "";

  list: any[];
  listData:any[];
  cols: any[];
  files:any[];
  test:any;
  total:any;
  orgId:any;
  isAdmin:boolean=false;

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH GÓI DỊCH VỤ");
    this.searchUnit();

    this.cols = [
      { field: 'name', header: 'Tên gói', style:'text-align: left;' },
      { field: 'code', header: 'Mã gói', style:'text-align: left;' },
      { field: 'time', header: 'Thời gian', style:'text-align: left;' },
      { field: 'numberContract', header: 'Số lượng hợp đồng', style:'text-align: left;' },
      { field: 'price', header: 'Đơn giá', style:'text-align: left;' },
      { field: 'id', header: 'unit.manage', style:'text-align: center;' },
      ]; 
  }  

  array_empty: any = [];
  searchUnit(){
    this.adminPackService.getPackList(this.name, this.code, this.price ,this.time, this.status, this.number_contract).subscribe(response => {
      this.listData = response.entities;
      this.total = this.listData.length;
    });
  }

  addPack() {
    const data = {
      title: 'THÊM MỚI GÓI DỊCH VỤ'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddPackComponent, {
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

  editPack(id:any) {
    const data = {
      title: 'CẬP NHẬT GÓI DỊCH VỤ',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddPackComponent, {
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

  detailPack(id:any) {
    const data = {
      title: 'unit.information',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDetailPackComponent, {
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

  deletePack(id:any){
    
  }

}
