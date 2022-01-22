import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public listNotification: any[] = [];
  p:number = 1;
  page:number = 10;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;
  constructor(private dashboardService: DashboardService,
    private appService: AppService) { }

  ngOnInit(): void {
    this.appService.setTitle("no.list");
    this.dashboardService.getNotification('', '', '', 1000, '').subscribe(data => {
      this.listNotification = data.entities;
      console.log(this.listNotification);
      this.pageTotal = this.listNotification.length;
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }
    });
  }

  openLinkNotification(link:any, id:any) {
    window.location.href = link.replace('&loginType=', '').replace('&loginType=1', '');
    this.dashboardService.updateViewNotification(id).subscribe(data => {
      console.log(data);
    });
  }

  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

}
