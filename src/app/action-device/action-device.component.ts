import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-action-device',
  templateUrl: './action-device.component.html',
  styleUrls: ['./action-device.component.scss']
})
export class ActionDeviceComponent implements OnInit {

  constructor(private modalService: NgbModal,
              public dialog: MatDialog) { }

  ngOnInit(): void {

  }

}
