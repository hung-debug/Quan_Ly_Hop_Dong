import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { ImportService } from 'src/app/service/import.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private appService: AppService,
    private userService: UserService,
    private unitService: UnitService,
    private router : Router,
    private importService: ImportService
    ) { }

  organization_id_user_login:any;
  organization_id:any = "";
  email:any = "";
  list: any[];
  cols: any[];
  orgList: any[] = [];
  orgListTmp: any[] = [];

  //phan quyen
  isQLND_01:boolean=true;  //them moi nguoi dung
  isQLND_02:boolean=true;  //sua nguoi dung
  isQLND_03:boolean=true;  //tim kiem nguoi dung
  isQLND_04:boolean=true;  //xem thong tin chi tiet nguoi dung
  first: number = 0;

  lang: any;
  async ngOnInit(): Promise<void> {

    if(sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    this.appService.setTitle("user.list");
    //lay id user
    this.organization_id_user_login = this.userService.getAuthCurrentUser().organizationId;
    //mac dinh se search theo ma to chuc minh
    this.organization_id = this.organization_id_user_login;

    this.searchUser();

    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);

      if(this.lang == 'vi')
        this.orgListTmp.push({name: "Tất cả", id:""});
      else if(this.lang == 'en') 
        this.orgListTmp.push({name: "All", id:""});
      
      let dataUnit = data.entities.sort((a:any,b:any) => a.path.toString().localeCompare(b.path.toString()));
      for(var i = 0; i < dataUnit.length; i++){
        this.orgListTmp.push(dataUnit[i]);
      }
      
      this.orgList = this.orgListTmp;
      this.convertData();
      this.selectedNodeOrganization = this.listOrgCombobox.filter((p: any) => p.data == this.organization_id);
    });

    this.cols = [
      {header: 'user.name', style:'text-align: left;' },
      {header: 'user.email', style:'text-align: left;' },
      {header: 'user.phone', style:'text-align: left;' },
      {header: 'unit.name', style:'text-align: left;' },
      {header: 'unit.status', style:'text-align: left;' },
      {header: 'menu.role.list', style:'text-align: left;' },
      {header: 'unit.manage', style:'text-align: center;' },
    ];
  }

  array_empty: any = [];
  listOrgCombobox: any[];
  selectedNodeOrganization:any;
  convertData(){
    this.array_empty=[];
    this.orgList.forEach((element: any, index: number) => {

      let is_edit = false;
      let dataChildren = this.findChildren(element);
      let data:any="";
      data = {
        label: element.name, 
        data: element.id,
        expanded: true,
        children: dataChildren
      };
      
      this.array_empty.push(data);
      //this.removeElementFromStringArray(element.id);
    })
    this.listOrgCombobox = this.array_empty;
  }

  findChildren(element:any){
    let dataChildren:any[]=[];
    let arrCon = this.orgList.filter((p: any) => p.parent_id == element.id);
    
    arrCon.forEach((elementCon: any, indexCOn: number) => {
      let is_edit = false;
      
      dataChildren.push(
      {
        label: elementCon.name, 
        data: elementCon.id,
        expanded: true,
        children: this.findChildren(elementCon)
      });
      this.removeElementFromStringArray(elementCon.id);
    })
    return dataChildren;
  }

  removeElementFromStringArray(element: string) {
    this.orgList.forEach((value,index)=>{
        if(value.id==element){
          this.orgList.splice(index,1);
        }
        
    });
  }

  
  changeOrg(){
    console.log(this.selectedNodeOrganization);
    this.organization_id = this.selectedNodeOrganization?this.selectedNodeOrganization.data:"";
  }

  searchUser(){
    this.first = 0;
    this.userService.getUserList(this.organization_id==null?"":this.organization_id, this.email).subscribe(response => {
      this.list = response.entities;
    });
  }

  addUser() {
    this.router.navigate(['/main/form-user/add']);
  }

  editUser(id:any) {
    this.router.navigate(['/main/form-user/edit/' + id]);
  }

  detailUser(id:any) {
    this.router.navigate(['/main/user-detail/' + id]);
  }

  
  downFileExample() {
    
  }

  fileChanged(e: any) {
    this.importService.importFile(e,'user');

    e.target.value = null;
  }
}
