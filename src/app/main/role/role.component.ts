import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { AddRoleComponent } from './add-role/add-role.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

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
    this.appService.setTitle("DANH SÁCH VAI TRÒ");
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
      title: 'THÊM MỚI VAI TRÒ'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '780px',
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
