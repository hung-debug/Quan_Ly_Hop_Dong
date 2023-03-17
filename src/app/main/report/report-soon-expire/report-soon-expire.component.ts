import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-report-soon-expire',
  templateUrl: './report-soon-expire.component.html',
  styleUrls: ['./report-soon-expire.component.scss']
})
export class ReportSoonExpireComponent implements OnInit {

  selectedNodeOrganization: any;
  listOrgCombobox: any;
  date: any;
  optionsStatus: any;
  list: any;
  cols: any;
  colsSuggest: any;
  mergeCol: any;
  organization_id_user_login: any;
  organization_id: any;
  lang: string;
  orgListTmp: any[] = [];
  orgList: any[] = [];
  array_empty: any[];

  constructor(
    private appService: AppService,
    private userService: UserService,
    private unitService: UnitService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('report.expires-soon.contract.full');

    this.cols = [
      {id: 1,header: 'contract.name', style:'text-align: left;',colspan: 1,rowspan:'2' },
      {id: 2,header: 'contract.type', style:'text-align: left;',colspan: 1,rowspan:'2' },
      {id: 3,header: 'contract.number', style:'text-align: left;',colspan: 1,rowspan:'2'},
      // {id: 4,header: 'contract.uid', style:'text-align: left;',colspan: 1,rowspan:'2' },
      // {id: 5,header: 'contract.connect', style: 'text-align: left',colspan: 1,rowspan:'2'},
      // {id: 6,header: 'contract.time.create', style:'text-align: left',colspan: 1,rowspan:'2'},
      {id: 7,header: 'signing.expiration.date',style:'text-align: left',colspan: 1,rowspan:'2'},
      // {id: 8,header: 'contract.status.v2',style:'text-align:left',colspan: 1,rowspan:'2'},
      // {id: 9,header: 'date.completed', style: 'text-align: left',colspan: 1,rowspan:'2'},
      {id: 10,header: 'suggest', style: 'text-align: center',colspan:'5',rowspan: 1},
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
 
     this.unitService.getUnitList('', '').subscribe(data => {
 
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
     }, error => {
      
     })
  }

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
