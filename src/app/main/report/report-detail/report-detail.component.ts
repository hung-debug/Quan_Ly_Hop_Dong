import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { ReportService } from 'src/app/service/report.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  //Biến lưu dữ liệu trong bảng
  list: any[];

  //col header
  cols: any[];

  colsSuggest: any[];

  selectedNodeOrganization:any;
  listOrgCombobox: any[];
  organization_id:any = "";
  lang: any;
  orgListTmp: any[] = [];
  orgList: any[] = [];
  organization_id_user_login: any;

  //Biến lấy số lượng tổ chức lớn nhất trong các hợp đồng
  maxOrg: number;

  //Biến để gộp các cột
  mergeCol: any[] = [];

  params: any;
  date: any;
  optionsStatus: any;

  formGroup: any;


  constructor(
    private appService: AppService,
    private unitService: UnitService,
    private userService: UserService,
    private translate: TranslateService,
    private fbd: FormBuilder,
  ) {

    this.formGroup = this.fbd.group({
      name: this.fbd.control(''),
      date:this.fbd.control(''),
      contractStatus: this.fbd.control(''),  
    });

   }

  ngOnInit(): void {
    this.appService.setTitle('report.detail.contract.full');

    this.list = [
      {product: 'Công ty cổ phần phần mềm công nghệ cao Việt Nam', lastYearSale: 51, thisYearSale: 40, lastYearProfit: 54406, thisYearProfit: 43342},
  ];

    this.formGroup = this.fbd.group({
      name: this.fbd.control(''),
      date:this.fbd.control(''),
      contractStatus: this.fbd.control(''),  
    });

    this.optionsStatus = [
      { "id": 0, "name": this.translate.instant('all') },
      { "id": 20, "name": this.translate.instant('sys.processing')},
      { "id": 2, "name": this.translate.instant('contract.status.overdue') },
      { "id": 31, "name": this.translate.instant('contract.status.fail') },
      { "id": 32, "name": this.translate.instant('contract.status.cancel') },
      { "id": 30, "name": this.translate.instant('contract.status.complete') },
    ];

    this.cols = [
      {id: 1,header: 'contract.name', style:'text-align: left;',colspan: 1,rowspan:'2' },
      {id: 2,header: 'contract.type', style:'text-align: left;',colspan: 1,rowspan:'2' },
      {id: 3,header: 'contract.number', style:'text-align: left;',colspan: 1,rowspan:'2'},
      {id: 4,header: 'contract.uid', style:'text-align: left;',colspan: 1,rowspan:'2' },
      {id: 5,header: 'contract.connect', style: 'text-align: left',colspan: 1,rowspan:'2'},
      {id: 6,header: 'contract.time.create', style:'text-align: left',colspan: 1,rowspan:'2'},
      {id: 7,header: 'signing.expiration.date',style:'text-align: left',colspan: 1,rowspan:'2'},
      {id: 8,header: 'contract.status.v2',style:'text-align:left',colspan: 1,rowspan:'2'},
      {id: 9,header: 'date.completed', style: 'text-align: left',colspan: 1,rowspan:'2'},
      {id: 10,header: 'suggest', style: 'text-align: center',colspan:'5',rowspan: 1},
    ];

    this.colsSuggest = [
      {header: 'sign.object',style:'text-align: left'},
      {header: 'name.unit',style:'text-align: left'},
      {header: 'user.view',style:'text-align: left'},
      {header: 'user.sign',style:'text-align: left'},
      {header: 'user.doc',style:'text-align: left'},
    ]

    this.getMergeCol();
  
    //call api danh sách chi tiết hợp đồng
    this.getDetailContractsList();

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

  //merge các cột nhỏ của bảng
  getMergeCol() {
    this.mergeCol = this.cols.concat(this.colsSuggest);
  }


  getMaxCol() {
    return 14;
  }

  getDetailContractsList() {
    // this.reportService.getDetailContractListReport(this.params).subscribe((response) => {

    //   //lấy số lượng tổ chức lớn nhất tham gia trong danh sách hợp đồng
    //   this.maxOrg = response.maxOrg;
    // })
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
