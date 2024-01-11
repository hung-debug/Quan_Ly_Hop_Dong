import { ToastService } from './../../service/toast.service';
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
import { RoleService } from 'src/app/service/role.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

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
  chartHeight: number = 450;

  user: any;
  numberWaitProcess: any = 0;
  numberExpire: any = 0;
  numberComplete: any = 0;
  numberWaitComplete: any = 0;
  numContractUse: number = 0;
  numContractBuy: number = 0;

  isOrg: string = 'off';
  stateOptions: any[];

  listNotification: any[] = [];
  orgList: any[] = [];
  orgListTmp: any[] = [];
  organization_id: any = "";

  selectedNodeOrganization: any;
  isQLHD_03: boolean | undefined;
  isQLHD_04: boolean | undefined;
  currentDate: Date;
  daysRemaining: number;
  formattedEndDate: string;
  message: string;
  messageExpired: string;
  endLicense: any;
  countNoti: any = 0;
  notiExpried: any;
  isSoonExp: boolean = false;
  isExp: boolean = false;
  isEkycExp: boolean = false;
  isSmsExp: boolean = false;
  isCecaExp: boolean = false;
  isContractExp: boolean = false;
  OrgId: any;
  enviroment: any = "";
  site: string;

  constructor(
    private appService: AppService,
    private dashboardService: DashboardService,
    public translate: TranslateService,
    private userService: UserService,
    private unitService: UnitService,
    private router: Router,
    public datepipe: DatePipe,
    private toastService: ToastService,
    private roleService: RoleService
  ) {
    this.stateOptions = [
      {label: "my.contract", value: 'off'},
      {label: "org.contract", value: 'on'},
    ];
  }

  lang: any;
  ngOnInit(): void {

    this.enviroment = environment;
    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }

    this.appService.setTitle("menu.dashboard");
    this.search();
    let count = localStorage.getItem('countNoti')
    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data?.role_id).subscribe(
          data => {
            let listRole: any[];
            listRole = data.permissions;
            this.isQLHD_03 = listRole.some(element => element.code == 'QLHD_03');
            this.isQLHD_04 = listRole.some(element => element.code == 'QLHD_04');
        }, error => {
        });
        this.OrgId = data.organization.id;
        this.userService.getOrgIdChildren(this.OrgId).subscribe(dataOrg => {
          let countNotiWarning: number = localStorage.getItem('countNoti') as any
          countNotiWarning++;
          localStorage.setItem("countNoti",countNotiWarning.toString())
          if(count == '0'){
            countNotiWarning++;
            localStorage.setItem("countNoti",countNotiWarning.toString())
            this.currentDate = new Date();
            this.endLicense = new Date(dataOrg.endLicense);
            this.daysRemaining = Math.floor((new Date(this.endLicense).getTime() - this.currentDate.getTime()) / (1000 * 60 * 60 * 24));
            // this.daysRemaining = Math.abs(this.daysRemaining)

            this.validateExpDateAndPackageNumber(dataOrg.numberOfEkyc, dataOrg.numberOfSms, dataOrg.numberOfContractsCanCreate, dataOrg.numberOfCeca, this.daysRemaining, this.currentDate, this.endLicense)

          }
        })

    }, error => {}
    )

    this.user = this.userService.getInforUser();

    if(localStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(localStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    this.unitService.getUnitList('', '').subscribe(data => {
      if(localStorage.getItem('lang') == 'vi')
        this.orgListTmp.push({name: "Tất cả", id: ""});
      else if(localStorage.getItem('lang') == 'en')
        this.orgListTmp.push({name: "All", id: ""});

      //sap xep theo path de cho to chuc cha len tren
      let dataUnit = data.entities.sort((a: any, b: any) => a.path.toString().localeCompare(b.path.toString()));
      for (var i = 0; i < dataUnit.length; i++) {
        this.orgListTmp.push(dataUnit[i]);
      }

      this.unitService.getNumberContractUseOriganzation(this.userService.getInforUser().organization_id).toPromise().then(
        data => {
          this.numContractUse = data.contract;
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã dùng', "", 3000);
        }
      )

      //lay so luong hop dong da mua
      this.unitService.getNumberContractBuyOriganzation(this.userService.getInforUser().organization_id).toPromise().then(
        data => {
          this.numContractBuy = data.contract;
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã mua', "", 3000);
        }
      )

      this.orgList = this.orgListTmp;
      this.convertData();
    });
  }

  getNotiMessage(isSoonExp: boolean, isExp: boolean, isEkycExp: boolean, isSmsExp: boolean, isCecaExp: boolean, isContractExp: boolean){
    let messageSoonExp = ""
    let messageExp = ""
    let messageEkycExp = ""
    let messageCecaExp = ""
    let messageSmsExp = ""
    let messageContractExp = ""
    let numberExpMessage = ""
    let numberExpArr = []
    if (isSoonExp){
      messageSoonExp = `Thời gian sử dụng dịch vụ sẽ hết hạn vào ngày ${moment(this.endLicense).format("DD/MM/YYYY")}. `
    }
    if (isExp){
      messageExp = `Thời gian sử dụng dịch vụ đã hết. `
    }
    if (isContractExp){
      messageContractExp = "Hợp đồng"
      numberExpArr.push(messageContractExp)
    }
    if (isEkycExp){
      messageEkycExp = "eKYC"
      numberExpArr.push(messageEkycExp)
    }
    if (isSmsExp){
      messageSmsExp = "SMS"
      numberExpArr.push(messageSmsExp)
    }
    if (isCecaExp){
      messageCecaExp = "Xác thực CeCA"
      numberExpArr.push(messageCecaExp)
    }

    numberExpMessage = (isEkycExp || isSmsExp || isCecaExp || isContractExp) ? "<br>Số lượng " + numberExpArr.toString().replaceAll(",","/") + " sắp hết": ""
    return this.toastService.showWarningHTMLWithTimeout((messageSoonExp ? messageSoonExp :  messageExp) + numberExpMessage,"",9000)
  }

  validateExpDateAndPackageNumber(numberOfEkyc: any, numberOfSms: any, numberOfContractsCanCreate: any, numberOfCeca: any, daysRemaining: any, currentDate: any, endLicense: any){
    if(environment.flag == 'KD'){
      if (daysRemaining < 60 && daysRemaining > 0){
        this.isSoonExp = true
      }
      if (new Date(currentDate) > new Date(endLicense)){
        this.isExp = true
      }
      if (numberOfEkyc < 30 && numberOfEkyc > 0){
        this.isEkycExp = true
      }
      if (numberOfSms < 30 && numberOfSms > 0) {
        this.isSmsExp = true
      }
      if (numberOfContractsCanCreate < 30 && numberOfContractsCanCreate > 0) {
        this.isContractExp = true
      }
      if (numberOfCeca < 30 && numberOfCeca > 0) {
        this.isCecaExp = true
      }
      this.getNotiMessage(this.isSoonExp, this.isExp, this.isEkycExp, this.isSmsExp, this.isCecaExp, this.isContractExp)
    }
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
    this.list = this.array_empty
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
        expanded: false,
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
      let newData = Object.assign( {}, data)
      newData.isOrg = this.isOrg;
      newData.organization_id = this.organization_id;
      newData.from_date = this.filter_from_date;
      newData.to_date = this.filter_to_date;

      this.totalCreate = newData.total_process + newData.total_signed + newData.total_reject + newData.total_cancel + newData.total_expires;

      let numContractHeight = document.getElementById('num-contract')?.offsetHeight || 0;
      let numContractBodyHeight = document.getElementById('num-contract-body')?.offsetHeight || 0;
      let notiHeight = document.getElementById('noti')?.offsetHeight || 450;

      this.chartHeight = numContractHeight + notiHeight + numContractBodyHeight - 37;

      if(localStorage.getItem('lang') == 'vi' || sessionStorage.getItem('lang') == 'vi')
        this.createChart("Đang xử lý","Hoàn thành","Từ chối","Huỷ bỏ", "Quá hạn", "Số lượng", newData);
      else if(localStorage.getItem('lang') == 'en' || sessionStorage.getItem('lang') == 'en')
        this.createChart("Processing","Complete","Reject","Cancel","Out of date", "Number", newData);
    });
  }

  createChart(arg0: string, arg1: string, arg2: string, arg3: string, arg4: string,so_luong: string, data: any) {
    this.chartCreated = new Chart({
      colors: ['#4B71F0', '#58A55C', '#ED1C24', '#717070', '#FF710B'],
      chart: {
        type: 'column',
        style: {
          fontFamily: 'inherit',
        },
        height: 500
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
            return '<a style="cursor: pointer; color: #106db6; text-decoration: none"; href="' + link + '">' + this.value + '</a>';
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
          name: this.translate.instant('contract.number'),
          data: [
            [this.translate.instant('sys.processing'), data.total_process],
            [this.translate.instant('contract.status.complete'), data.total_signed],
            [this.translate.instant('contract.status.fail'), data.total_reject],
            [this.translate.instant('contract.status.cancel'), data.total_cancel],
            [this.translate.instant('contract.status.overdue'), data.total_expires]
          ]
        }]
    });
  }

  getNumberContractBoxHeight(){
    let chartHeight = document.getElementById('chart-column')?.offsetHeight || 0;
    let numContractBodyHeight = document.getElementById('num-contract-body')?.offsetHeight || 450;
    let numContractHeight = document.getElementById('num-contract')?.offsetHeight || 0;
    let notiHeight = chartHeight - numContractBodyHeight - numContractHeight;

    return {
      'height': notiHeight + 'px',
      'overflow': 'auto'
    };
  }

  search() {
    this.searchCountCreate();

    this.dashboardService.countContractReceived("", "").subscribe(data => {

      this.numberWaitProcess = data.processing;
      this.numberComplete = data.processed;
      this.numberExpire = data.prepare_expires;
      this.numberWaitComplete = data.waiting;
    });

    this.dashboardService.getNotification('', '', '', 5, '').subscribe(data => {
      this.listNotification = data.entities;

    });
  }
}
