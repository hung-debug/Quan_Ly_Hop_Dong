import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-expiration-signing-time',
  templateUrl: './edit-expiration-signing-time.component.html',
  styleUrls: ['./edit-expiration-signing-time.component.scss']
})
export class EditExpirationSigningTimeComponent implements OnInit, AfterViewInit {
  @ViewChild('inputElement') inputElement: any;
  @ViewChild('calendarContainer') calendarContainer: ElementRef;
  

  expirationSign: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.expirationSign = moment(this.data.expirationSign).toDate();
  }

  ngAfterViewInit(): void {
    this.inputElement.showOnFocus = false;
  }

  onContainerClick(event: MouseEvent) {
    if (this.calendarContainer.nativeElement.contains(event.target)) {
      this.inputElement.showOnFocus = true;

      const inputElement = this.inputElement.inputfieldViewChild.nativeElement;
      inputElement.click();
    } else {
      this.inputElement.showOnFocus = false;
   }
  }

}
