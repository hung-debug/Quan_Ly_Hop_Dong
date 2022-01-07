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
        colors: ['#407EF9', '#58A55C', '#ED1C24', '#FF710B', '#717070'],
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
          enabled: true
        },
        xAxis: {
          categories: [
              ''
          ],
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
              }
          }
        },
        series : [
        {
          type: 'column',
          name: 'Đang xử lý',
          data: [
            ['Số hợp đồng', data.total_process],
          ]
        },
        {
          type: 'column',
          name: 'Hoàn thành',
          data: [
            ['Số hợp đồng', data.total_signed],
          ]
        },
        {
          type: 'column',
          name: 'Từ chối',
          data: [
            ['Số hợp đồng', data.total_rejected],
          ]
        },
        {
          type: 'column',
          name: 'Quá hạn',
          data: [
            ['Số hợp đồng', data.total_expires],
          ]
        },
        {
          type: 'column',
          name: 'Hủy bỏ',
          data: [
            ['Số hợp đồng', data.total_cancel]
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
