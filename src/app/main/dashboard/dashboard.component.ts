import { Component, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Chart } from 'angular-highcharts';
import { TranslateService } from '@ngx-translate/core';
import { ContractService } from 'src/app/service/contract.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { UserService } from 'src/app/service/user.service';
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

  constructor(
    private appService: AppService,
    private dashboardService: DashboardService,
    private userService: UserService,
  ) {

  }


  ngOnInit(): void {
    this.appService.setTitle("menu.dashboard");
    this.search();

    this.user = this.userService.getInforUser();
  }

  search(){
    this.dashboardService.countContractCreate(this.filter_from_date, this.filter_to_date).subscribe(data => {     
      console.log(data);     
        this.chartCreated = new Chart({
          colors: ['#407EF9', '#58A55C', '#ED1C24', '#FF710B'],
          chart: {
            type: 'pie',
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
          plotOptions : {
            pie: {
              dataLabels: {
                enabled: false,

            },
            showInLegend: true,
                shadow: false,
                center: ['50%', '50%'],
                innerSize: '60%'
            },
          },

          series : [{
            type: 'pie',
            name: 'Số hợp đồng',
            data: [
              ['Đang xử lý', data.total_process],
              ['Hoàn thành', data.total_signed],
              ['Từ chối', data.total_rejected],
              ['Quá hạn', data.total_expires]
            ],
          }]
        });
    });

    this.dashboardService.countContractReceived(this.filter_from_date, this.filter_to_date).subscribe(data => { 
      console.log(data);     
      this.chartReceived = new Chart({
        colors: ['#407EF9', '#58A55C', '#ED1C24', '#FF710B'],
        chart: {
          type: 'column',
          style: {
            fontFamily: 'inherit',
          }
        },
        title: {
          text: this.chartContractReceived,
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
          name: 'Số hợp đồng',
          data: [
              ['Chưa xử lý', data.processing],
          ]
        },
        {
          type: 'column',
          name: 'Số hợp đồng',
          data: [
            ['Đã xử lý', data.processed]
          ]
        }]
      });
    });
  }
}
