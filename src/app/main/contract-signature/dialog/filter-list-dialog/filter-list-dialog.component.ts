import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';
import {TranslateService} from '@ngx-translate/core';

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
  contractStatusProcessedList: { id: number, name: string }[] = [
    { "id": 20, "name": this.translate.instant('sys.processing') },
    { "id": 2, "name": this.translate.instant('contract.status.overdue') },
    { "id": 31, "name": this.translate.instant('contract.status.fail') },
    { "id": 32, "name": this.translate.instant('contract.status.cancel') },
    { "id": 30, "name": this.translate.instant('contract.status.complete') },
    { "id": 40, "name": this.translate.instant('liquidated') }
  ];
  contractStatusProcessingList: { id: number, name: string }[] = [
    { "id": 20, "name": this.translate.instant('sys.processing') },
    { "id": 2, "name": this.translate.instant('contract.status.overdue') },
    { "id": 31, "name": this.translate.instant('contract.status.fail') },
    { "id": 32, "name": this.translate.instant('contract.status.cancel') }
  ];
  
  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialogRef: MatDialogRef<FilterListDialogComponent>,
    public router: Router,
    public dialog: MatDialog,
    public translate: TranslateService,
    private contractTypeService : ContractTypeService) { 

      this.addForm = this.fbd.group({
        filter_type: this.fbd.control(Number(this.data.filter_type)),
        filter_contract_no:this.fbd.control(this.data.filter_contract_no),
        filter_from_date: this.fbd.control(this.data.filter_from_date),
        filter_to_date: this.fbd.control(this.data.filter_to_date),
        name_or_email_customer:this.fbd.control(this.data.name_or_email_customer),
        organization_id: this.fbd.control(this.data.organization_id),
        status:this.data.status,
        contractStatus: this.fbd.control(this.data.contractStatus),    
        
      });
    }

  ngOnInit(): void {
    //lay danh sach to chuc
    this.contractTypeService.getContractTemplateTypeList("", "").subscribe(data => {
      console.log(data);
      this.contractTypeList = data;
    });

    this.addForm = this.fbd.group({
      filter_type: this.data.filter_type!=""?this.fbd.control(Number(this.data.filter_type)):"",
      filter_contract_no:this.fbd.control(this.data.filter_contract_no),
      filter_from_date: this.data.filter_from_date!=""?this.fbd.control(new Date(this.data.filter_from_date)):"",
      filter_to_date: this.data.filter_to_date!=""?this.fbd.control(new Date(this.data.filter_to_date)):"",
      name_or_email_customer: this.fbd.control(this.data.name_or_email_customer),
      organization_id: this.fbd.control(this.data.organization_id),
      status:this.data.status,
      contractStatus: this.fbd.control(this.data.contractStatus),
    });   
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
      name_or_email_customer: this.addForm.value.name_or_email_customer,
      organization_id: this.addForm.value.organization_id,
      status: this.addForm.value.status,
      contractStatus: this.addForm.value.contractStatus
    }
    this.dialogRef.close();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['main/c/receive/' + data.status],
      {
        queryParams: {
          'filter_name': this.data.filter_name,
          'filter_type': data.filter_type, 
          'filter_contract_no': data.filter_contract_no,
          'filter_from_date': data.filter_from_date,
          'filter_to_date': data.filter_to_date,
          'name_or_email_customer':data.name_or_email_customer,
          'organization_id':data.organization_id,
          'contractStatus' : data.contractStatus,
          'type_display': this.data.type_display
        },
        skipLocationChange: true
      });
    });
  }

}
