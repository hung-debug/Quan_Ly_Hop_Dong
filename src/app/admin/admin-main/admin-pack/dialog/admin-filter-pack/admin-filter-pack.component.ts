import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-admin-filter-pack',
  templateUrl: './admin-filter-pack.component.html',
  styleUrls: ['./admin-filter-pack.component.scss']
})
export class AdminFilterPackComponent implements OnInit {

  addForm: FormGroup;
  datas: any;

  dropdownOrgSettings: any = {};
  contractTypeList: Array<any> = [];
  submitted = false;

  orgList: any[] = [];
  orgListTmp: any[] = [];
  isOrg:any=""

  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private adminPackService : AdminPackService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AdminFilterPackComponent>,
    public router: Router,
    public dialog: MatDialog,
    ) { 

      this.addForm = this.fbd.group({
        filter_type: this.fbd.control(Number(this.data.filter_type)),
        filter_contract_no:this.fbd.control(this.data.filter_contract_no),
        filter_from_date: this.fbd.control(this.data.filter_from_date),
        filter_to_date: this.fbd.control(this.data.filter_to_date),
        status:this.data.status,
        isOrg:this.data.isOrg,
        organization_id: this.fbd.control(Number(this.data.organization_id)),
      });
    }

  ngOnInit(): void {
    this.addForm = this.fbd.group({
      filter_type: this.data.filter_type!=""?this.fbd.control(Number(this.data.filter_type)):"",
      filter_contract_no:this.fbd.control(this.data.filter_contract_no),
      filter_from_date: this.data.filter_from_date!=""?this.fbd.control(new Date(this.data.filter_from_date)):"",
      filter_to_date: this.data.filter_to_date!=""?this.fbd.control(new Date(this.data.filter_to_date)):"",
      status:this.data.status,
      isOrg:this.data.isOrg,
      organization_id:  this.data.organization_id!=""?this.fbd.control(Number(this.data.organization_id)):""
    });
    this.isOrg = this.data.isOrg;
    console.log(this.addForm);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      filter_type: this.addForm.value.filter_type,
      filter_contract_no: this.addForm.value.filter_contract_no,
      filter_from_date: this.addForm.value.filter_from_date,
      filter_to_date: this.addForm.value.filter_to_date,
      status: this.addForm.value.status,
      isOrg: this.addForm.value.isOrg,
      organization_id: this.addForm.value.organization_id
    }
    this.dialogRef.close();
    console.log(data);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/contract/create/' + data.status],
      {
        queryParams: {
          'filter_type': data.filter_type, 
          'filter_contract_no': data.filter_contract_no,
          'filter_from_date': data.filter_from_date,
          'filter_to_date': data.filter_to_date,
          'isOrg': data.isOrg,
          'organization_id': data.organization_id,
        },
        skipLocationChange: true
      });
    });
  }

}
