import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { AppService } from 'src/app/service/app.service';
import { NodeService } from 'src/app/service/node.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { AddUserComponent } from './add-user/add-user.component';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  p:number = 1;
  page:number = 5; 
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private nodeService: NodeService) { }

  name:any;
  email:any;
  phone:any;
  files: TreeNode[];
  cols: any[];

  ngOnInit(): void {
    this.appService.setTitle("DANH SÁCH NGƯỜI DÙNG");
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
      title: 'THÊM MỚI NGƯỜI DÙNG'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddUserComponent, {
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
