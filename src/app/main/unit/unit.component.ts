import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { UnitService } from 'src/app/service/unit.service';
import { AddUnitComponent } from './add-unit/add-unit.component';

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

  p:number = 1;
  page:number = 5; 
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private unitService: UnitService) { }

  code:any = "";
  name:any = "";
  list: any[];
  cols: any[];

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH TỔ CHỨC");
    this.unitService.getUnitList(this.code, this.name).subscribe(response => {
      console.log(response);
      this.list = response.entities;
      console.log(this.list);
    });

    this.cols = [
      { field: 'name', header: 'Tên tổ chức' },
      { field: 'short_name', header: 'Tên viết tắt' },
      { field: 'code', header: 'Mã tổ chức' },
      { field: 'status', header: 'Trạng thái' },
      { field: 'parent_id', header: '' },
      { field: 'id', header: '' },
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
  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

}
