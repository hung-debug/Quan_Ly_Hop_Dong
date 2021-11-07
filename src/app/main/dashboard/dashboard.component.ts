import { Component, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { single } from '../../data/data';
import { Chart } from 'angular-highcharts';

//templateUrl: './dashboard.component.html',
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../main.component.scss']
})
export class DashboardComponent implements OnInit {
  chart = new Chart({
    colors: ['#058DC7', '#58A55C', '#ED1C24', '#FF710B'],
    chart: {
      type: 'pie',
      style: {
        fontFamily: 'Roboto',
      }
    },
    title: {
      text: 'Biểu đồ thống kê số lượng hợp đồng tạo',
    },
    credits: {
      enabled: false
    },
    plotOptions : {
      pie: {
        dataLabels: {
          enabled: false
      },
      showInLegend: true,
         shadow: false,
         center: ['50%', '50%'],
         innerSize: '30%'
      }
    },

    series : [{
      type: 'pie',
      name: 'Số hợp đồng',
      data: [
        ['Đang xử lý', 45.0],
        ['Hoàn thành', 26.8],
        ['Từ chối', 8.5],
        ['Quá hạn', 6.2]
      ],
    }]
  });

  chart2 = new Chart({
    colors: ['#058DC7', '#58A55C', '#ED1C24', '#FF710B'],
    chart: {
      type: 'column',
      style: {
        fontFamily: 'Roboto',
      }
    },
    title: {
      text: 'Biểu đồ thống kê số lượng hợp đồng được gán'
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
  constructor(
    private appService: AppService
  ) {

  }


  ngOnInit(): void {
    this.appService.setTitle('TRANG CHỦ');




  }

}
