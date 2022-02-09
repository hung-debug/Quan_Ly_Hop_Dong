import { Component, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Chart } from 'angular-highcharts';
import { TranslateService } from '@ngx-translate/core';
import { ContractService } from 'src/app/service/contract.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../main.component.scss']
})
export class DashboardComponent implements OnInit {

  translations: any;
  chartCreated:any;
  chartReceived:any;

  menuDashboard:string;
  chartContractCreated:string;
  chartContractReceived:string
  totalCreate:any=0;

  //filter
  filter_from_date:any = "";
  filter_to_date:any = "";

  user:any;
  numberWaitProcess:any=0;
  numberExpire:any=0;
  numberComplete:any=0;
  numberWaitComplete:any=0;

  isOrg: string = 'off';
  stateOptions: any[];

  listNotification: any[] = [];

  constructor(
    private appService: AppService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private contractService:ContractService,
    private router: Router,
  ) {
    this.stateOptions = [
      { label: 'HĐ của tôi', value: 'off' },
      { label: 'HĐ của tổ chức', value: 'on' },
    ];
  }

  ngOnInit(): void {
    this.appService.setTitle("menu.dashboard");
    this.search();

    this.user = this.userService.getInforUser();
  }

  openLink(link:any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([link]);
    });
    //this.router.navigate([link]);
  }

  openLinkNotification(link:any, id:any) {
    window.location.href = link.replace('&loginType=', '').replace('&loginType=1', '');
    this.dashboardService.updateViewNotification(id).subscribe(data => {
      console.log(data);
    });
  }

  categoryLinks:any;
  searchCountCreate(){
    console.log(this.isOrg);
    this.dashboardService.countContractCreate(this.isOrg, this.filter_from_date, this.filter_to_date).subscribe(data => {     
      console.log(data);    
      this.totalCreate = data.total_process + data.total_signed + data.total_reject + data.total_cancel + data.total_expires;
      this.categoryLinks = {
        'Đang xử lý': 'http://www.google.com',
        'Hoàn thành': 'http://www.facebook.com',
        'Từ chối': 'http://www.stackoverflow.com',
        'Hủy bỏ': 'http://www.google.com',
        'Quá hạn': 'http://www.facebook.com'
      };
      console.log(this.categoryLinks['Đang xử lý'])
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
            'Đang xử lý', 'Hoàn thành', 'Từ chối',  'Hủy bỏ', 'Quá hạn'
          ],
          labels: {
            style: {
              fontSize: '13px'
            },
            formatter: function() {
              var link = "";
              if(this.value == 'Đang xử lý'){
                link = "/main/contract/create/processing"
              }else if(this.value == 'Hoàn thành'){
                link = "/main/contract/create/complete"
              }else if(this.value == 'Từ chối'){
                link = "/main/contract/create/fail"
              }else if(this.value == 'Hủy bỏ'){
                link = "/main/contract/create/cancel"
              }else if(this.value == 'Quá hạn'){
                link = "/main/contract/create/overdue"
              }
              return '<a style="cursor: pointer; color: #106db6; text-decoration: none" href="'+ link + '">' + this.value + '</a>';
            },
            useHTML: true
          }
        },
        yAxis: [{
          title: {
              text: 'Số lượng'
          },
          allowDecimals: false,
        }],
        plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true,
              },
              
          }
        },
        series : [
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
    });
  }

  search(){    
    this.searchCountCreate();

    this.dashboardService.countContractReceived("", "").subscribe(data => { 
      console.log(data);    
      this.numberWaitProcess = data.processing; 
      this.numberComplete = data.processed;
      this.numberExpire = data.prepare_expires;
      this.numberWaitComplete = data.waiting;
    });

    this.dashboardService.getNotification('', '', '', 5, '').subscribe(data => {
      this.listNotification = data.entities;
      console.log(this.listNotification);
    });
  }
}
