import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-filter-list-dialog',
  templateUrl: './filter-list-dialog.component.html',
  styleUrls: ['./filter-list-dialog.component.scss']
})
export class FilterListDialogComponent implements OnInit {

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
    private unitService : UnitService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<FilterListDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    private userService : UserService,
    private contractTypeService : ContractTypeService) { 

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
    let orgId = this.userService.getInforUser().organization_id;
    //lay danh sach to chuc
    this.contractTypeService.getContractTypeList("", "").subscribe(data => {
      console.log(data);
      this.contractTypeList = data;
    });

    this.unitService.getUnitList('', '').subscribe(data => {
      if(this.data.filter_is_org_me_and_children){
        this.orgListTmp.push({name: "Tất cả", id:""});
      }
      let dataUnit = data.entities.sort((a:any,b:any) => a.name.toString().localeCompare(b.name.toString()));
      for(var i = 0; i < dataUnit.length; i++){
        this.orgListTmp.push(dataUnit[i]);
      }
      
      this.orgList = this.orgListTmp;
    });

    console.log(this.data.filter_type);
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
