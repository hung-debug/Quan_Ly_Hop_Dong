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
      if (urlQ) {
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
        if (matchesNum && matchesNum.length == 3) {
          console.log(`econtract://app/login/${matchesNum[0]}/${matchesNum[1]}/${role}/${matchesNum[2]}`);
          window.location.href = `econtract://app/login/${matchesNum[0]}/${matchesNum[1]}/${role}/${matchesNum[2]}`;
        }
      } else {
        window.location.href = `econtract://app/login`;
      }

    // }
  }

  downloadApp() {
    if (this.deviceService.os == "iOS") {
        window.location.href = `https://testflight.apple.com/join/qWAmyels`;
    } else if (this.deviceService.os == "Android") {
        window.location.href = `https://drive.google.com/file/d/1Oo-VMe0vnK5UuZN7bdTBLABubmD9Nxns/view?usp=sharing`;
    }
  }

}
