import { Component, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Chart } from 'angular-highcharts';
import { TranslateService } from '@ngx-translate/core';
import { DatepickerOptions } from 'ng2-datepicker';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
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

  // options sample with default values
  options: DatepickerOptions = {
    minYear: getYear(new Date()) - 30, // minimum available and selectable year
    maxYear: getYear(new Date()) + 30, // maximum available and selectable year
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'dd/MM/yyyy', // date format to display in input
    formatTitle: 'MM/yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
    // keyboardEvents: true // enable keyboard events
  };

  constructor(
    private appService: AppService,
    private translateService: TranslateService
  ) {

  }

  // getTranslation(str:string) {
  //   this.translateService.get(str).subscribe( (text: string) => {
  //   });
  // }


  ngOnInit(): void {
    // this.translateService.get(['menu.dashboard', 'chart.contract.created', 'chart.contract.received'])
    //   .subscribe(translations => {
    //     this.menuDashboard = translations['menu.dashboard'];
    //     this.chartContractCreated = translations['chart.contract.created'];
    //     this.chartContractReceived = translations['chart.contract.received'];
    //   });
        this.appService.setTitle("menu.dashboard");
        this.chartCreated = new Chart({
          colors: ['#058DC7', '#58A55C', '#ED1C24', '#FF710B'],
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
              ['Đang xử lý', 45],
              ['Hoàn thành', 26],
              ['Từ chối', 8],
              ['Quá hạn', 6]
            ],
          }]
        });

        this.chartReceived = new Chart({
          colors: ['#058DC7', '#58A55C', '#ED1C24', '#FF710B'],
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
                ['Chưa xử lý', 45],
            ]
          },
          {
            type: 'column',
            name: 'Số hợp đồng',
            data: [
              ['Đã xử lý', 26]
            ]
          }]
      });

  }
}
