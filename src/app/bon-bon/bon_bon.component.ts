import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import { ToastService } from '../service/toast.service';
import { AccountLinkDialogComponent } from '../main/dialog/account-link-dialog/account-link-dialog.component';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './bon_bon.component.html',
  styleUrls: ['./bon_bon.component.scss']
})
export class BonBonComponent implements OnInit{
  contract_signatures: any = "c";
  signatures: any = "s9";
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    let username = this.route.snapshot.paramMap.get('username') || '';
    let pass = this.route.snapshot.paramMap.get('pass') || '';
    let type = this.route.snapshot.paramMap.get('type') || '';
    let isContractId = this.route.snapshot.paramMap.get('isContractId') || '';
    let recipientId = this.route.snapshot.paramMap.get('recipientId') || '';
    this.login(username, pass, type, isContractId, recipientId);
  }


  login(username: any, pass: any, type: any, isContractId: any, isRecipientId: any) {
    this.authService.loginAuthencation(username, pass, type, isContractId).subscribe((data) => {
      console.log("data", data)
      if(data?.code == '00'){
        if (this.authService.isLoggedInSuccess() == true) {
          localStorage.setItem('isBonBon', 'true');
          this.action(isContractId, isRecipientId);
        }
      } else if(data?.code == '13'){
        const date = moment(data.active_at);
        this.toastService.showErrorHTMLWithTimeout("Tài khoản bị khoá đến "+moment(date).format('YYYY/MM/DD HH:mm:ss'), '', 3000);
      }else if(data?.code == '02'){
        this.toastService.showErrorHTMLWithTimeout("Tổ chức không hoạt động", '', 3000);
      } else if (data?.code == '10') {
        this.toastService.showErrorHTMLWithTimeout("Tài khoản của bạn chỉ hỗ trợ đăng nhập bằng SSO, vui lòng đăng nhập bằng SSO để sử dụng hệ thống", '', 3000);
      } else if (data?.code == '11' && environment.usedSSO) {
        this.openAccountLinkDialog(data?.customer?.info)
      } else if (data?.code == '01') {
        this.toastService.showErrorHTMLWithTimeout("Tài khoản không hoạt động", '', 3000);
      }
      else {
        this.toastService.showErrorHTMLWithTimeout("error.username.password", '', 3000);
      }
      },
      error => {
        this.toastService.showErrorHTMLWithTimeout("error.server", '', 3000);
      }
    );
  }

  action(isContractId: any, isRecipientId: any) {
    this.router.navigate(['/main/'+this.contract_signatures+'/'+this.signatures+'/' + isContractId],
      {
        queryParams: {'recipientId': isRecipientId}
      });
  }

  openAccountLinkDialog(userData: any) {
    // @ts-ignore
    const dialogRef: any = this.dialog.open(AccountLinkDialogComponent, {
      width: '498px',
    // @ts-ignore
      // backdrop: 'static',
      data: userData,
      disableClose: true,
      autoFocus: false
    })
  }
}
