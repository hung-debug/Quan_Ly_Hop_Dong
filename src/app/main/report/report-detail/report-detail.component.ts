import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  //Biến lưu dữ liệu trong bảng
  list: any[] = [];
  cols: any[];

  selectedNodeOrganization:any;
  listOrgCombobox: any[];
  organization_id:any = "";
  lang: any;
  orgListTmp: any[] = [];
  orgList: any[] = [];
  organization_id_user_login: any;

  constructor(
    private appService: AppService,
    private unitService: UnitService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.detail.contract.full');

    this.cols = [
      {header: 'contract.name', style:'text-align: left;' },
      {header: 'contract.type', style:'text-align: left;' },
      {header: 'contract.number', style:'text-align: left;' },
      {header: 'contract.uid', style:'text-align: left;' },
      {header: 'contract.connect', style: 'text-align: left'},
      {header: 'contract.time.create', style:'text-align: left'}
    ];

    if(sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

     //lay id user
     this.organization_id_user_login = this.userService.getAuthCurrentUser().organizationId;
     //mac dinh se search theo ma to chuc minh
     this.organization_id = this.organization_id_user_login;

     console.log("id ", this.organization_id);

    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);

      if(this.lang == 'vi')
        this.orgListTmp.push({name: "Tất cả", id:""});
      else if(this.lang == 'en') 
        this.orgListTmp.push({name: "All", id:""});
      
      console.log("vao day ");
      let dataUnit = data.entities.sort((a:any,b:any) => a.path.toString().localeCompare(b.path.toString()));
      for(var i = 0; i < dataUnit.length; i++){
        this.orgListTmp.push(dataUnit[i]);
      }
      
      this.orgList = this.orgListTmp;
      this.convertData();
      this.selectedNodeOrganization = this.listOrgCombobox.filter((p: any) => p.data == this.organization_id);

      console.log("s ", this.selectedNodeOrganization);
    }, error => {
      // setTimeout(() => this.router.navigate(['/login']));
      // this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
    })

    // this.selectedNodeOrganization = this.listOrgCombobox.filter((p: any) => p.data == this.organization_id);

  }

  array_empty: any = [];

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

}
