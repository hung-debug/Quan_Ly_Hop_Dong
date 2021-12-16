import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { AddUnitComponent } from './add-unit/add-unit.component';

// export interface TreeNode {
//   data?: any;
//   children?: TreeNode[];
//   leaf?: boolean;
//   expanded?: boolean;
//   }
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
    private nodeService: NodeService) { }

  code:any;
  name:any;
  files: TreeNode[];
  cols: any[];

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH TỔ CHỨC");
    this.nodeService.list().subscribe(response => {
      console.log(response);
      this.files = response.data;
      this.pageTotal = this.files.length;
      this.setPage();
    });
    
    console.log(this.files);
      this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'type', header: 'Type' }
      ];
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
