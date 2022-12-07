import {Component, Input, OnInit, Output} from '@angular/core';
import {AppService} from 'src/app/service/app.service';
import {Chart} from 'angular-highcharts';
import {TranslateService} from '@ngx-translate/core';
import {ContractService} from 'src/app/service/contract.service';
import {DashboardService} from 'src/app/service/dashboard.service';
import {UserService} from 'src/app/service/user.service';
import {Router} from '@angular/router';
import {UnitService} from 'src/app/service/unit.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../main.component.scss']
})
export class DashboardComponent implements OnInit {

  translations: any;
  chartCreated: any;
  chartReceived: any;

  menuDashboard: string;
  chartContractCreated: string;
  chartContractReceived: string
  totalCreate: any = 0;

  //filter
  date: any = "";
  filter_from_date: any = "";
  filter_to_date: any = "";

  user: any;
  numberWaitProcess: any = 0;
  numberExpire: any = 0;
  numberComplete: any = 0;
  numberWaitComplete: any = 0;

  isOrg: string = 'off';
  stateOptions: any[];

  listNotification: any[] = [];
  orgList: any[] = [];
  orgListTmp: any[] = [];
  organization_id: any = "";

  selectedNodeOrganization: any;

  constructor(
    private appService: AppService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private unitService: UnitService,
    private router: Router,
    public datepipe: DatePipe,
  ) {
    this.stateOptions = [
      {label: "my.contract", value: 'off'},
      {label: "org.contract", value: 'on'},
    ];
  }

  ngOnInit(): void {
    this.appService.setTitle("menu.dashboard");
    this.search();

    this.user = this.userService.getInforUser();

    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);

      if(localStorage.getItem('lang') == 'vi')
        this.orgListTmp.push({name: "Tất cả", id: ""});
      else if(localStorage.getItem('lang') == 'en')
      this.orgListTmp.push({name: "All", id: ""});

      //sap xep theo path de cho to chuc cha len tren
      let dataUnit = data.entities.sort((a: any, b: any) => a.path.toString().localeCompare(b.path.toString()));
      for (var i = 0; i < dataUnit.length; i++) {
        this.orgListTmp.push(dataUnit[i]);
      }

      this.orgList = this.orgListTmp;
      console.log(this.orgList);
      this.convertData();
      console.log(this.list);
    });
  }

  array_empty: any = [];
  list: any[];
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
    this.list = this.array_empty;
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

  openLink(link: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([link]);
    });
  }


  detailContract(id: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/contract/create/processing']);
    });
  }

  openLinkNotification(link: any, id: any) {
    window.location.href = link.replace('&type=1', '').replace('&type=', '').replace('?id','?recipientId').replace('contract-signature','c').replace('signatures','s9').replace('consider','c9').replace('secretary','s8').replace('coordinates','c8');

    this.dashboardService.updateViewNotification(id).subscribe(data => {
      console.log(data);
    });
  }

  searchCountCreate() {
    if (this.date != "" && this.date[0] != 0) {
      this.date.forEach((key: any, v: any) => {
        if (v == 0 && key) {
          this.filter_from_date = this.datepipe.transform(key, 'yyyy-MM-dd');
        } else if (v == 1 && key) {
          this.filter_to_date = this.datepipe.transform(key, 'yyyy-MM-dd');
        }
      });
    }
    this.organization_id = this.selectedNodeOrganization?this.selectedNodeOrganization.data:"";
    this.dashboardService.countContractCreate(this.isOrg, this.organization_id, this.filter_from_date, this.filter_to_date).subscribe(data => {
      data.isOrg = this.isOrg;
      data.organization_id = this.organization_id;
      data.from_date = this.filter_from_date;
      data.to_date = this.filter_to_date;
      this.totalCreate = data.total_process + data.total_signed + data.total_reject + data.total_cancel + data.total_expires;

      if(localStorage.getItem('lang') == 'vi')
        this.createChart("Đang xử lý","Hoàn thành","Từ chối","Huỷ bỏ", "Quá hạn", "Số lượng", data);
      else if(localStorage.getItem('lang') == 'en')
        this.createChart("Processing","Complete","Reject","Cancel","Out of date", "Number", data);     
    });
  }

  createChart(arg0: string, arg1: string, arg2: string, arg3: string, arg4: string,so_luong: string, data: any) {
    this.chartCreated = new Chart({
      colors: ['#4B71F0', '#58A55C', '#ED1C24', '#717070', '#FF710B'],
      chart: {
        type: 'column',
        style: {
          fontFamily: 'inherit',
        }
      },
      title: {
        text: this.chartContractCreated,
        style: {
          fontSize: '16px',
          fontWeight: '500',
        },
        verticalAlign: 'bottom',
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: [
          arg0, arg1, arg2, arg3, arg4
        ],
        labels: {
          style: {
            fontSize: '13px'
          },
          formatter: function () {
            var link = "";

            if (this.value == arg0) {
              link = "/main/contract/create/processing"
            } else if (this.value == arg1) {
              link = "/main/contract/create/complete"
            } else if (this.value == arg2) {
              link = "/main/contract/create/fail"
            } else if (this.value == arg3) {
              link = "/main/contract/create/cancel"
            } else if (this.value == arg4) {
              link = "/main/contract/create/overdue"
            }
            link = link + "?isOrg=" + data.isOrg + "&organization_id=" + data.organization_id + "&filter_from_date=" + data.from_date + "&filter_to_date=" + data.to_date;
            return '<a style="cursor: pointer; color: #106db6; text-decoration: none" href="' + link + '">' + this.value + '</a>';
          },
          useHTML: true
        }
      },
      yAxis: [{
        title: {
          text: so_luong
        },
        allowDecimals: false,
      }],

      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          },
        },
        column: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                var link = "";
                if (this.x == 0) {
                  link = "/main/contract/create/processing"
                } else if (this.x == 1) {
                  link = "/main/contract/create/complete"
                } else if (this.x == 2) {
                  link = "/main/contract/create/fail"
                } else if (this.x == 3) {
                  link = "/main/contract/create/cancel"
                } else if (this.x == 4) {
                  link = "/main/contract/create/overdue"
                }
                window.location.href = link + "?isOrg=" + data.isOrg + "&organization_id=" + data.organization_id + "&filter_from_date=" + data.from_date + "&filter_to_date=" + data.to_date;
              }
            }
          },
        }
      },
      series: [
        {
          type: 'column',
          colorByPoint: true,
          name: 'Số hợp đồng',
          data: [
            ['Đang xử lý', data.total_process],
            ['Hoàn thành', data.total_signed],
            ['Từ chối', data.total_reject],
            ['Hủy bỏ', data.total_cancel],
            ['Quá hạn', data.total_expires]
          ]
        }]
    });
  }

  search() {
    this.searchCountCreate();

    this.dashboardService.countContractReceived("", "").subscribe(data => {
      console.log(data);
      this.numberWaitProcess = data.processing;
      this.numberComplete = data.processed;
      this.numberExpire = data.prepare_expires;
      this.numberWaitComplete = data.waiting;
    });

    console.log("menu dashboard ");

    this.dashboardService.getNotification('', '', '', 5, '').subscribe(data => {
      this.listNotification = data.entities;
      console.log(this.listNotification);
    });
  }
}