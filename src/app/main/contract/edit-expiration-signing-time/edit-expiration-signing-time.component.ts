import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

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
    private contractService: ContractService,
    private toastService: ToastService,
    private datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private router: Router,
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

  async save() {
    this.spinner.show();

    //Gọi api lấy thông tin contractId
    const inforContract = await this.contractService.getDataCoordination(this.data.contractId).toPromise();

    const data = {
      alias_url: inforContract.alias_url,
      ceca_push: inforContract.ceca_push,
      code: inforContract.code,
      contract_no: inforContract.contract_no,
      is_template: inforContract.is_template,
      name: inforContract.name,
      notes: inforContract.notes,
      originalContractId: inforContract.originalContractId,
      refs: inforContract.refs,
      sign_time: this.datepipe.transform(
        this.expirationSign,
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      )?.slice(0,11).concat("00:00:00Z"),
      template_contract_id: inforContract.template_contract_id,
      type_id: inforContract.type_id
    }

    //Gọi api edit contract
    try {
      const editContract = await this.contractService.editContract(data, this.data.contractId).toPromise();

      if(editContract.id) {
        window.location.reload();

        this.toastService.showSuccessHTMLWithTimeout('update.success','',3000);
        this.dialog.closeAll();
      } else {
        this.toastService.showErrorHTMLWithTimeout('error.server','',3000)
      }
    } catch(err) {
      this.toastService.showErrorHTMLWithTimeout(err,'',3000)
    }

    this.spinner.hide();
  }

}
