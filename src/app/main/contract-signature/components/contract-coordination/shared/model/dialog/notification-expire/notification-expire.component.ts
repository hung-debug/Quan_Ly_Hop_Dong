import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-expire',
  templateUrl: './notification-expire.component.html',
  styleUrls: ['./notification-expire.component.scss']
})
export class NotificationExpireComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
