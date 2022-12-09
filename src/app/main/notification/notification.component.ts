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
  
  lang: string;
  ngOnInit(): void {

    if(sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    console.log("lang ", this.lang);

    this.appService.setTitle("no.list");
    this.getNotification();
  }

  getNotification(){
    this.dashboardService.getNotification('', '', '', this.page, this.p).subscribe(data => {
      this.listNotification = data.entities;
      console.log(this.listNotification);
      this.pageTotal = data.total_elements;
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
    window.location.href = link.replace('&type=1', '').replace('&type=', '').replace('?id','?recipientId').replace('contract-signature','c').replace('signatures','s9').replace('consider','c9').replace('secretary','s8').replace('coordinates','c8');;
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
