import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatDialog} from "@angular/material/dialog";
import {DeviceDetectorService} from "ngx-device-detector";
import {Router} from "@angular/router";

@Component({
  selector: 'app-action-device',
  templateUrl: './action-device.component.html',
  styleUrls: ['./action-device.component.scss']
})
export class ActionDeviceComponent implements OnInit {

  constructor(private modalService: NgbModal,
              public dialog: MatDialog,
              private deviceService: DeviceDetectorService,
              private router: Router) { }

  ngOnInit(): void {

  }

  nextApp() {
    // if (sessionStorage.getItem('url')) {
      // let isUrl = sessionStorage.getItem('url');
      const urlQ = sessionStorage.getItem('url');
      const urlEmail = sessionStorage.getItem('recipientEmail');
      if (urlQ && urlQ.includes('contract-signature/')) {
        let role;
        const urlQ1 = urlQ.split('contract-signature/')[1];
        const urlQ2 = urlQ1.split('/');
        const urlRole = urlQ2[0];
        const matchesNum = urlQ.match(/\d+/g);
        if (urlRole.includes('coordinates')) {
          role = 1;
        } else if (urlRole.includes('consider')) {
          role = 2;
        } else if (urlRole.includes('signatures')) {
          role = 3;
        } else if (urlRole.includes('secretary')) {
          role = 4;
        }
        // if (matchesNum && matchesNum.length == 3) {
        let isLogin = 'loginNotdefine';

        if (matchesNum) {

          if (!matchesNum[2]) {

            matchesNum[2] = "0";

            isLogin = 'login'

          }

          if (urlEmail) {

            window.location.href = `econtract://app/`+isLogin+`/${matchesNum[0]}/${matchesNum[1]}/${role}/${matchesNum[2]}/${urlEmail}`;

          } else
          
          window.location.href = `econtract://app/`+isLogin+`/${matchesNum[0]}/${matchesNum[1]}/${role}/${matchesNum[2]}`;
          // console.log(`econtract://app/login/${matchesNum[0]}/${matchesNum[1]}/${role}/${matchesNum[2]}/${urlEmail}`);
          
        }

      } 
      else if(urlQ && urlQ.includes('contract-template')){

        const matchesNum = urlQ.match(/\d+/g);

        if(matchesNum){

          if (urlEmail) {

            window.location.href = `econtract://app/login/${matchesNum[0]}/_/_/MAU_HD/${urlEmail}`;

          } else

            window.location.href = `econtract://app/login/${matchesNum[0]}/_/_/MAU_HD/${urlEmail}`;

        }
      } else if(urlQ && urlQ.includes('form-contract')){

        const matchesNum = urlQ.match(/\d+/g);

        let isLogin = 'loginNotdefine';

        if(matchesNum){

          if (!matchesNum[2]) {

            matchesNum[2] = "0";

            isLogin = 'login'

          }

          if (urlEmail) {

            window.location.href = `econtract://app/`+isLogin+`/${matchesNum[0]}/-1/-1/${matchesNum[2]}/${urlEmail}`;

          } else

           window.location.href = `econtract://app/`+isLogin+`/${matchesNum[0]}/-1/-1/${matchesNum[2]}`;

        }

      }
      else {
        window.location.href = `econtract://app/login`;
      }

    // }
  }

  downloadApp() {
    if (this.deviceService.os == "iOS") {
        window.location.href = `https://apps.apple.com/vn/app/mobifonecontract/id1604753922`;
    } else if (this.deviceService.os == "Android") {
        window.location.href = `https://play.google.com/store/apps/details?id=vn.mobifone.econtract`;
    }
  }

}
