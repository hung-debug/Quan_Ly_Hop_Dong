import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/service/app.service';
import { RoleService } from 'src/app/service/role.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
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
    private userService: UserService,
    private roleService: RoleService) { }

  code:any = "";
  name:any = "";
  list: any[];
  listData:any[];
  cols: any[];
  files:any[];
  test:any;
  total:any;

  isQLTC_01:boolean=true;  //them moi to chuc
  isQLTC_02:boolean=true;  //sua to chuc
  isQLTC_03:boolean=true;  //tim kiem to chuc
  isQLTC_04:boolean=true;  //xem thong tin chi tiet to chuc

  ngOnInit(): void {
    this.appService.setTitle("unit.list");
    this.searchUnit();

    this.cols = [
      { field: 'name', header: 'unit.name', style:'text-align: left;' },
      { field: 'short_name', header: 'unit.short-name', style:'text-align: left;' },
      { field: 'code', header: 'unit.code', style:'text-align: left;' },
      { field: 'status', header: 'unit.status', style:'text-align: left;' },
      { field: 'parent_id', header: 'unit.type', style:'text-align: left;' },
      { field: 'id', header: 'unit.manage', style:'text-align: center;' },
      ]; 

      // let roleId = this.userService.getAuthCurrentUser().typeId;
      // this.roleService.getRoleList(this.code, this.name).subscribe(response => {
      //   let listRole: any[];
      //   listRole = response.entities;
      //   this.isQLTC_01 = listRole.some(element => element == 'QLTC_01');
      //   this.isQLTC_02 = listRole.some(element => element == 'QLTC_02');
      //   this.isQLTC_03 = listRole.some(element => element == 'QLTC_03');
      //   this.isQLTC_04 = listRole.some(element => element == 'QLTC_04');
      // });

  }  

  array_empty: any = [];
  searchUnit(){
    //lay id to chuc nguoi truy cap
    let orgId = this.userService.getInforUser().organization_id;
    let is_edit = false;

    this.unitService.getUnitList(this.code, this.name).subscribe(response => {
      this.listData = response.entities;
      console.log(this.listData);
      this.total = this.listData.length;

      //let arrCha = this.listData.filter((p: any) => p.id == orgId);
      this.listData.sort((a,b) => a.id.toString().localeCompare(b.id));
      let data:any="";

      this.array_empty=[];
      this.listData.forEach((element: any, index: number) => {
        let dataChildren;
        if(element.id == orgId){
          dataChildren = this.findChildren(element, true);
        }else{
          dataChildren = this.findChildren(element, false);
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
      console
    });
  }

  findChildren(element:any, is_edit:any){
    let dataChildren:any[]=[];
    let arrCon = this.listData.filter((p: any) => p.parent_id == element.id);
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
          is_edit: is_edit
        },
        expanded: true,
        children: this.findChildren(elementCon, is_edit)
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
      title: 'unit.update',
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
      title: 'unit.information',
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
