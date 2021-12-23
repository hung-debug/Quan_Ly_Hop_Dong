import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { UnitService } from 'src/app/service/unit.service';
import { AddUnitComponent } from './add-unit/add-unit.component';
import { DetailUnitComponent } from './detail-unit/detail-unit.component';

export class TreeNode {
  data:{
    name:any;
  }
  constructor(name:any) {
    this.data.name = name;
  }
}
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private unitService: UnitService,
    private nodeService: NodeService) { }

  code:any = "";
  name:any = "";
  list: any[];
  cols: any[];
  files:any[];
  test:any;

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

      this.nodeService.list().subscribe(response => {
        
        this.files = response.data;
        console.log(this.files);
      });

      
  }

  array_empty: any[] = [];
  searchUnit(){
    this.unitService.getUnitList(this.code, this.name).subscribe(response => {
      this.list = response.entities;
      console.log(this.list);

      let arrCha = this.list.filter((p: any) => p.parent_id == null);
      console.log(arrCha);

      let data:any="";

      arrCha.forEach((element: any, index: number) => {
        let dataChildren:any[]=[];

        this.findChildren(dataChildren, element);
        
        data = {
          data:
          {
            id: element.id, 
            name: element.name, 
            short_name: element.short_name,
            code: element.code,
            status: element.status,
            parent_id: element.parent_id,
          }
        };
        
        this.array_empty.push(data);
        
      })
      console.log(this.list);
      console.log(this.array_empty);
    });
  }

  findChildren(dataChildren:any, element:any){
    let arrCon = this.list.filter((p: any) => p.parent_id == element.id);
      arrCon.forEach((elementCon: any, indexCOn: number) => {
        dataChildren.push(
        {
          data:
          {
            id: elementCon.id, 
            name: elementCon.name, 
            short_name: elementCon.short_name,
            code: elementCon.code,
            status: elementCon.status,
            parent_id: elementCon.parent_id,
          },
          children: []
        })
        ;
      })
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
