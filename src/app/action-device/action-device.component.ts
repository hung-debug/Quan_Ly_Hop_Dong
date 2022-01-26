import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatDialog} from "@angular/material/dialog";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-action-device',
  templateUrl: './action-device.component.html',
  styleUrls: ['./action-device.component.scss']
})
export class ActionDeviceComponent implements OnInit {

  constructor(private modalService: NgbModal,
              public dialog: MatDialog,
              private deviceService: DeviceDetectorService,) { }

  ngOnInit(): void {

  }

  nextApp() {
    window.location.href = `econtract://app/login`;
  }

  downloadApp() {
    if (this.deviceService.os == "iOS") {
        window.location.href = `https://testflight.apple.com/join/qWAmyels`;
    } else if (this.deviceService.os == "Android") {
        window.location.href = `https://drive.google.com/file/d/1Oo-VMe0vnK5UuZN7bdTBLABubmD9Nxns/view?usp=sharing`;
    }
  }

}
