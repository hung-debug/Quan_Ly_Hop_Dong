import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';


@Component({
  selector: 'app-detail-contract-type',
  templateUrl: './detail-contract-type.component.html',
  styleUrls: ['./detail-contract-type.component.scss']
})
export class DetailContractTypeComponent implements OnInit {

  name:any="";
  code:any="";
  ceca_push: any = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private contractTypeService : ContractTypeService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<DetailContractTypeComponent>,
    public router: Router,
    public dialog: MatDialog,
    private translateService: TranslateService
    ) { }

  ngOnInit(): void {
    this.contractTypeService.getContractTypeById(this.data.id).subscribe(
      data => {
        this.name = data.name,
        this.code = data.code,
        this.ceca_push = this.convertCeCa(data.ceca_push)
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

  convertCeCa(ceca_push: any) {
    if(ceca_push == 1) {
      return this.translateService.instant('yes');
    } else {
      return this.translateService.instant('no');
    }
  }
}
