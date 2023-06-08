import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { environment } from 'src/environments/environment';
import { ContractService } from "../../../service/contract.service";

@Component({
  selector: 'app-detail-unit',
  templateUrl: './detail-unit.component.html',
  styleUrls: ['./detail-unit.component.scss']
})
export class DetailUnitComponent implements OnInit {

  name: any = "";
  short_name: any = "";
  code: any = "";
  email: any = "";
  phone: any = "";
  fax: any = "";
  status: any = "";
  parent_id: any = "";
  id: any = "";

  numContractUse: number = 0;
  numContractCreate: number = 0;
  numContractBuy: number = 0;

  eKYCContractUse: number = 0;
  eKYCContractBuy: number = 0;

  smsContractUse: number = 0;
  smsContractBuy: number = 0;

  numTimeStampUse: number = 0;
  numTimeStampBuy: number = 0;

  numCecaUse: any;
  numCecaBuy: any;

  taxCode: any = "";
  cEcAPushMode: any = "";
  site: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private unitService: UnitService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<DetailUnitComponent>,
    public router: Router,
    private contractService: ContractService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {

    if (environment.flag === 'NB') {
      this.site = 'NB';
    } else if (environment.flag === 'KD') {
      this.site = 'KD';
    }

    this.getData();
  }

  async getData() {
    await this.unitService.getUnitById(this.data.id).toPromise().then(
      data => {
        
        this.name = data.name,
          this.short_name = data.short_name,
          this.code = data.code,
          this.email = data.email,
          this.phone = data.phone,
          this.fax = data.fax,
          this.status = data.status,
          this.parent_id = data.parent_id,
          this.taxCode = data.tax_code,
          this.cEcAPushMode = this.convert(data.ceca_push_mode),
          this.id = data.id

        if (data.parent_id != null) {
          this.unitService.getUnitById(data.parent_id).subscribe(
            data => {
              
              this.parent_id = data.name
            }, error => {
              this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
            }
          )
        }


        //lay so luong hop dong da dung
        this.unitService.getNumberContractUseOriganzation(this.data.id).toPromise().then(
          data => {
            this.numContractUse = data.contract;
            this.eKYCContractUse = data.ekyc;
            this.smsContractUse = data.sms;
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã dùng', "", 3000);
          }
        )

        //lay so luong hop dong da mua
        this.unitService.getNumberContractBuyOriganzation(this.data.id).toPromise().then(
          data => {
            this.numContractBuy = data.contract;
            this.eKYCContractBuy = data.ekyc;
            this.smsContractBuy = data.sms;
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã mua', "", 3000);
          }
        )
        
        //lay so luong timestamp, xac thuc BCT da mua/da su dung
        this.unitService.getDataNotifyOriganzation1(this.data.id).toPromise().then(
          (data: any) => {
            this.numTimeStampBuy = data.totalTimestampPurchased;
            this.numTimeStampUse = (this.numTimeStampBuy) - (data.numberOfTimestamp)

            this.numCecaBuy = data.totalCecaPurchased;
            this.numCecaUse = (this.numCecaBuy) - (data.numberOfCeca)
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã mua', "", 3000);
          }
        )
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin tổ chức', "", 3000);
      }
    )
    await this.unitService.getNumberContractCreateOriganzation(this.data.id).toPromise().then(
      data => {
        this.numContractCreate = data.total;
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã tạo', "", 3000);
      }
    )

  }
  convert(ceca_push_mode: any): any {
    if (ceca_push_mode == 'ALL') {
      return "Đẩy toàn bộ hợp đồng"
    } else if (ceca_push_mode == 'SELECTION') {
      return "Tuỳ biến";
    } else {
      return "Không đẩy HĐ nào";
    }
  }

}
