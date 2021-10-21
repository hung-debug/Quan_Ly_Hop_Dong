import { Component, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { single } from '../../data/data';
// import {LegendPosition} from "@swimlane/ngx-charts/lib/common/types/legend.model";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../main.component.scss']
})
export class DashboardComponent implements OnInit {
  single: any[] = [];
  view: [number, number] = [700, 250];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: any;
  legendTitle: string = 'Danh mục';
  arcWidth: number = 0.4;

  // colorScheme = {
  //   domain: ['#2da133', '#FF710B', '#407EF9', '#F3E13F', '#ED1C24'],
  // };

  colorScheme: any;

  constructor(
    private appService: AppService
  ) {
    this.legendPosition = "right";
    this.colorScheme = {
      domain: ['#2da133', '#FF710B', '#407EF9', '#F3E13F', '#ED1C24']
    }
   Object.assign(this, { single });
  }

  onSelect(data:any): void {
     console.log('Item clicked', JSON.parse(JSON.stringify(data)));
   }

   onActivate(data:any): void {
     console.log('Activate', JSON.parse(JSON.stringify(data)));
   }

   onDeactivate(data:any): void {
     console.log('Deactivate', JSON.parse(JSON.stringify(data)));
   }

  ngOnInit(): void {
    this.appService.setTitle('TRANG CHỦ');
  }

}
