import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Calendar } from 'primeng/calendar';
import { elementAt } from 'rxjs/operators';
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
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.expirationSign = moment(this.data.expirationSign).toDate();
    const dialog = document.getElementById("edit-expiration-conainer");
    console.log(Number(dialog?.offsetHeight) + Number(dialog?.offsetTop));
  }

  ngAfterViewInit(): void {
    this.inputElement.showOnFocus = false;
  }

  generateSafeStyle(style:string):SafeStyle{
    return this.sanitizer.bypassSecurityTrustStyle(style);
   }

  isCalendarClick: number = 0;
  top: number[] = [];
  onContainerClick(event: MouseEvent) {
    if (this.calendarContainer.nativeElement.contains(event.target)) {
      this.inputElement.showOnFocus = true;

      const inputElement = this.inputElement.inputfieldViewChild.nativeElement;
      let collection = document.getElementsByClassName("p-datepicker");

      const element = collection[0] as HTMLElement; // Cast to HTMLElement
  
      if(this.top.length > 0) {
        element.style.top = (this.top[0] + this.data.scrollY) + "px";
        this.top.splice(1);
      } else {
        if (collection.length > 0) {
          const currentTop = parseFloat(getComputedStyle(element).top);
          this.top.push(currentTop)
  
          element.style.top = (currentTop + this.data.scrollY) + "px";
          this.isCalendarClick = 1;
        }
        inputElement.click();
        this.isCalendarClick = 0;

      }
    } else {
      this.inputElement.showOnFocus = false;
    }

  }

  async save() {
    if(!this.expirationSign) {
      this.toastService.showErrorHTMLWithTimeout('error.notTime','',3000);
      return;
    } 
    this.spinner.show();

    //Gọi api lấy thông tin contractId
    let data;
    if(this.data.status == 'multi') {
      data = {
        sign_time: this.datepipe.transform(
          this.expirationSign,
          "yyyy-MM-dd'T'HH:mm:ss'Z'"
        )?.slice(0,11).concat("00:00:00Z"),
        contract_ids: this.data.contractId
      }
    } else {
      const inforContract = await this.contractService.getDataCoordination(this.data.contractId).toPromise();

      data = {
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
    }

    //Gọi api edit contract
    try {
      let editContract: any;
      if(this.data.status == 'multi') {
        editContract = await this.contractService.editSignTimeMutiContract(data).toPromise();
      } else {
        editContract = await this.contractService.editContract(data, this.data.contractId).toPromise();
      }

      if(this.data.status == 'multi') {
        if(editContract.status) {
          // window.location.reload();
          this.toastService.showSuccessHTMLWithTimeout('update.success','',3000);
          this.dialog.closeAll();
          this.data.refreshContractList();
        } else {
          this.toastService.showErrorHTMLWithTimeout('error.server','',3000)
        }
      } else {
        if(editContract.id) {
          // window.location.reload();
  
          this.toastService.showSuccessHTMLWithTimeout('update.success','',3000);
          this.dialog.closeAll();
          this.data.refreshContractList();
        } else {
          this.toastService.showErrorHTMLWithTimeout('error.server','',3000)
        }
      }
    } catch(err) {
      this.toastService.showErrorHTMLWithTimeout(err,'',3000)
    }

    //this.spinner.hide();
  }

}
