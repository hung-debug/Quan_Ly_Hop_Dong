import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-infor-user',
  templateUrl: './infor-user.component.html',
  styleUrls: ['./infor-user.component.scss']
})
export class InforUserComponent implements OnInit {

  user:any;
  name:any;
  email:any;
  phone:any;
  birthday:any;
  organization_name:any;

  phoneKpi:any;
  networkKpi:any;

  nameHsm:any;

  constructor(private appService: AppService,
    private toastService : ToastService,
    private userService : UserService,
    private contractService: ContractService) { }

  ngOnInit(): void {
    this.appService.setTitle("user.information");
    this.user = this.userService.getInforUser();
    this.name = this.user.name;
    this.email = this.user.email;
    this.phone = this.user.phone;
    this.contractService.getDataNotifyOriganzation().subscribe((data: any) => {
      this.organization_name = data.name;
    });
  }

  updateInforUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 10000);
  }

  updateSignFileImageUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.file.image.success", "", 10000);
  }

  updateSignKpiUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.kpi.success", "", 10000);
  }

  updateSignHsmUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.hsm.success", "", 10000);
  }

}
