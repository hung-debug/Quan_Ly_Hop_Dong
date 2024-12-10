import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { optionsCeCa } from 'src/app/config/variable';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-dialog-sign-many-component',
  templateUrl: './dialog-sign-many-component.component.html',
  styleUrls: ['./dialog-sign-many-component.component.scss']
})
export class DialogSignManyComponentComponent implements OnInit {

  options: any;
  id: number = 0;
  currentUser: any;
  markSignAcc: string | null;
  mobile: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogSignManyComponentComponent>,
    private userService: UserService,
    private deviceService: DeviceDetectorService,
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;
  }

  ngOnInit(): void {
    this.options = optionsCeCa;
    const data = {
      mark: 1,
      agree: 1,
    }
    this.dialogRef.close(data);
  }

  onChangeForm(event: any) {
    this.id = event.value;
  }

  async onSubmit() {
    const data = {
      mark: this.id,
      agree: 1,
    }
    this.dialogRef.close(data);
  }

  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

}
