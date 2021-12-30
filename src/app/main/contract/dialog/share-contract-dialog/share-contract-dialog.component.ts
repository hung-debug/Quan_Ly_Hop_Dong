import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-share-contract-dialog',
  templateUrl: './share-contract-dialog.component.html',
  styleUrls: ['./share-contract-dialog.component.scss']
})
export class ShareContractDialogComponent implements OnInit {

  addForm: FormGroup;
  addFormUser: FormGroup;
  datas: any;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<ShareContractDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private unitService: UnitService, 
    private userService: UserService) { 

      this.addForm = this.fbd.group({
        email: this.fbd.control("", [Validators.required])
      });
    }

  ngOnInit(): void {
    let orgId = this.userService.getInforUser().organization_id;
    //lay danh sach to chuc
    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);
      this.orgList = data.entities.filter((i: any) => (i.id == orgId || i.parent_id == orgId));
    });

    this.datas = this.data;

    this.addForm = this.fbd.group({
      email: this.fbd.control("", [Validators.required])
    });

  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
  }

}
