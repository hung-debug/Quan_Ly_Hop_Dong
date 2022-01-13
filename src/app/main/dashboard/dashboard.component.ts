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

  //filter
  filter_from_date:any = "";
  filter_to_date:any = "";

  user:any;
  numberWaitProcess:any=0;
  numberExpire:any=0;
  numberComplete:any=0;
  numberWaitComplete:any=0;

  value1: string = 'off';
  stateOptions: any[];

  contracts: any[] = [];

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
  }

  search(){
    this.dashboardService.countContractCreate(this.filter_from_date, this.filter_to_date).subscribe(data => {     
      console.log(data);     
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
            }
          }
        },
        yAxis: [{
          title: {
              text: 'Số lượng'
          },
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
            ['Từ chối', data.total_rejected],
            ['Hủy bỏ', data.total_cancel],
            ['Quá hạn', data.total_expires]
          ]
        }]
      });
    });

    this.dashboardService.countContractReceived("", "").subscribe(data => { 
      console.log(data);    
      this.numberWaitProcess = data.processing; 
      this.numberComplete = data.processed;
      this.numberExpire = 0;
      this.numberWaitComplete = 0;
    });

    this.dashboardService.getContractList().subscribe(data => {
      this.contracts = data.entities;
      console.log(this.contracts);
      
      this.contracts.forEach((key : any, v: any) => {
        let participants = key.participants;
        participants.forEach((key : any, val: any) => {
          if (key.type == 1) {
            this.contracts[v].sideA = key.name;
          }else{
            this.contracts[v].sideB = key.name;
          }
          console.log(this.contracts[v].sideA);
        })
      });
      console.log(this.contracts);
    });
  }
}
