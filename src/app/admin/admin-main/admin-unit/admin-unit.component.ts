import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminAddUnitComponent } from './admin-add-unit/admin-add-unit.component';
import { AdminDetailUnitComponent } from './admin-detail-unit/admin-detail-unit.component';

@Component({
  selector: 'app-admin-unit',
  templateUrl: './admin-unit.component.html',
  styleUrls: ['./admin-unit.component.scss']
})
export class AdminUnitComponent implements OnInit {

  constructor(private appService: AppService,
    private dialog: MatDialog,
    private adminUnitService: AdminUnitService,
    private adminUserService: AdminUserService,
    private toastService: ToastService) { }

  code:any = "";
  name:any = "";
  list: any[];
  listData:any[];
  cols: any[];
  files:any[];
  test:any;
  total:any;
  orgId:any;
  isAdmin:boolean=false;

  //phan quyen
  isQLTC_01:boolean=true;  //them moi to chuc
  isQLTC_02:boolean=true;  //sua to chuc
  isQLTC_03:boolean=true;  //tim kiem to chuc
  isQLTC_04:boolean=true;  //xem thong tin chi tiet to chuc

  ngOnInit(): void {
    this.appService.setTitle("unit.list");
    this.searchUnit();

    this.cols = [
      { field: 'name', header: 'unit.name', style:'text-align: left;' },
      { field: 'code', header: 'unit.code', style:'text-align: left;' },
      { field: 'phone', header: 'Số điện thoại', style:'text-align: left;' },
      { field: 'status', header: 'unit.status', style:'text-align: left;' },
      { field: 'email', header: 'Email đăng ký', style:'text-align: left;' },
      { field: 'id', header: 'unit.manage', style:'text-align: center;' },
      ]; 
  }  

  array_empty: any = [];
  searchUnit(){
    this.getData();
  }

  getData(){
    this.adminUnitService.getUnitList(this.code, this.name).subscribe(response => {
      this.listData = response.entities;
      this.total = this.listData.length;

      //let arrCha = this.listData.filter((p: any) => p.id == orgId);
      this.listData = this.listData.sort((a,b) => a.parent_id - b.parent_id || a.name.toString().localeCompare(b.name.toString()));
      //console.log(this.listData);
      let data:any="";

      this.array_empty=[];
      this.listData.forEach((element: any, index: number) => {

        let is_edit = false;
        let dataChildren = this.findChildren(element);
        //neu la to chuc con hoac co quyen admin thi dc phep sua
        if(element.id != this.orgId || this.isAdmin){
          is_edit = true;
        }
        
        data = {
          data:
          {
            id: element.id, 
            name: element.name, 
            short_name: element.short_name,
            code: element.code,
            status: element.status,
            parent_id: element.parent_id,
            is_edit: is_edit
          },
          expanded: true,
          children: dataChildren
        };
        
        this.array_empty.push(data);
        //this.removeElementFromStringArray(element.id);
      })
      this.list = this.array_empty;
    });
  }

  findChildren(element:any){
    let dataChildren:any[]=[];
    let arrCon = this.listData.filter((p: any) => p.parent_id == element.id);
    
    arrCon.forEach((elementCon: any, indexCOn: number) => {
      let is_edit = false;
      if(elementCon.id != this.orgId || this.isAdmin){
        is_edit = true;
      }
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
          is_edit: is_edit
        },
        expanded: true,
        children: this.findChildren(elementCon)
      });
      this.removeElementFromStringArray(elementCon.id);
    })
    return dataChildren;
  }

  removeElementFromStringArray(element: string) {
    this.listData.forEach((value,index)=>{
        if(value.id==element){
          this.listData.splice(index,1);
        }
        
    });
  }

  addUnit() {
    const data = {
      title: 'unit.add'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUnitComponent, {
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
      title: 'unit.update',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminAddUnitComponent, {
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
      title: 'unit.information',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AdminDetailUnitComponent, {
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
