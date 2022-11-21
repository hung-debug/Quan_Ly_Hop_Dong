import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { async } from 'rxjs';
import { AppService } from 'src/app/service/app.service';
import { ImportService } from 'src/app/service/import.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import { AddUnitComponent } from './add-unit/add-unit.component';
import { DetailUnitComponent } from './detail-unit/detail-unit.component';
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
    private roleService: RoleService,
    private toastService: ToastService,
    public router: Router,
    private importService: ImportService
    ) { }

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
      { field: 'short_name', header: 'unit.short-name', style:'text-align: left;' },
      { field: 'code', header: 'unit.code', style:'text-align: left;' },
      { field: 'status', header: 'unit.status', style:'text-align: left;' },
      { field: 'parent_id', header: 'unit.type', style:'text-align: left;' },
      { field: 'id', header: 'unit.manage', style:'text-align: center;' },
      ]; 

      //lay id user
      let userId = this.userService.getAuthCurrentUser().id;
      this.userService.getUserById(userId).subscribe(
        data => {
          //lay id role
          this.roleService.getRoleById(data.role_id).subscribe(
            data => {
              console.log(data);
              let listRole: any[];
              listRole = data.permissions;
              this.isQLTC_01 = listRole.some(element => element.code == 'QLTC_01');
              this.isQLTC_02 = listRole.some(element => element.code == 'QLTC_02');
              this.isQLTC_03 = listRole.some(element => element.code == 'QLTC_03');
              this.isQLTC_04 = listRole.some(element => element.code == 'QLTC_04');
            }, error => {
              this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
            }
          ); 
        
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
        }
      )

  }  

  array_empty: any = [];
  searchUnit(){
    //lay id to chuc nguoi truy cap
    this.orgId = this.userService.getInforUser().organization_id;
    let userId = this.userService.getInforUser().customer_id;

    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data.role_id).subscribe(
          data => {
            //admin cua to chuc thi dc quyen sua thong tin to chuc
            if(data.code.toUpperCase() == 'ADMIN'){
              this.isAdmin = true;
            }else{
              this.isAdmin = false;
            }
            this.getData();
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
          }
        ); 
      
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
      }
    )
  }

  getData() {
    this.unitService.getUnitList(this.code, this.name).subscribe(response => {
      this.listData = response.entities;
      this.total = this.listData.length;

      this.listData = this.listData.sort((a,b) => a.id - b.id || a.parent_id - b.parent_id || a.name.toString().localeCompare(b.name.toString()));

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
        // this.removeElementFromStringArray(element.id);
      })

      this.list = this.array_empty;
    });
  }

  findChildren(element:any){
    let dataChildren:any[]=[];
    let arrCon = this.listData.filter((p: any) => p.parent_id == element.id);

    console.log("arrCon ", arrCon);
    
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

  //Thêm mới tổ chức
  addUnit() {
    const data = {
      title: 'unit.add'
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddUnitComponent, {
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

  fileChanged(e: any) {
    this.importService.importFile(e,'unit');
  }


  downFileExample() {
    
  }

  editUnit(id:any) {
    const data = {
      title: 'unit.update',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddUnitComponent, {
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

  detailUnit(id:any) {
    const data = {
      title: 'unit.information',
      id: id,
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DetailUnitComponent, {
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
