import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { paidStatusList, paidTypeList } from 'src/app/config/variable';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { AdminUnitService } from 'src/app/service/admin/admin-unit.service';
import { ToastService } from 'src/app/service/toast.service';
import { AdminDetailUnitComponent } from '../admin-detail-unit/admin-detail-unit.component';

@Component({
  selector: 'app-admin-add-pack-unit',
  templateUrl: './admin-add-pack-unit.component.html',
  styleUrls: ['./admin-add-pack-unit.component.scss'],
})
export class AdminAddPackUnitComponent implements OnInit {
  addForm: FormGroup;

  datas: any;
  listDichVu: any[];
  listPaidType: Array<any> = [];
  listStatusType: Array<any> = [];

  namePack: string;
  totalBeforeVAT: string;
  totalAfterVAT: string;
  duration: any;
  numberOfContracts: string;
  calculatorMethod: string = '';
  type: string;

  statusType: string;

  flagNgayThanhToan: boolean = false;
  flagPaymentDate: boolean = false;

  idPack: any;

  submitted = false;

  endDate: any;

  flagTime: number = 0;
  flagStatus: boolean = false;

  startDate: any;

  maxPaymentDate = new Date();

  paymentDate: any;

  serviceNumberContract: boolean;
  serviceTime: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminAddPackUnitComponent>,
    private adminUnitService: AdminUnitService,
    private adminPackService: AdminPackService,
    private toastService: ToastService
  ) {
    this.maxPaymentDate.setDate(this.maxPaymentDate.getDate());

    this.addForm = this.fbd.group({
      packCode: this.fbd.control('', [Validators.required]),
      namePack: this.fbd.control(''),
      totalBeforeVAT: this.fbd.control(''),
      totalAfterVAT: this.fbd.control(''),
      duration: this.fbd.control(''),
      numberOfContracts: this.fbd.control(''),
      type: this.fbd.control(''),
      calculatorMethod: this.fbd.control(''),
      purchaseDate: this.fbd.control('', [Validators.required]),
      paymentType: this.fbd.control('', [Validators.required]),
      paymentStatus: this.fbd.control('', [Validators.required]),
      paymentDate: this.fbd.control(''),
      startDate: this.fbd.control(''),
      endDate: this.fbd.control(''),
    });
  }

  get f() {
    return this.addForm.controls;
  }

  ngOnInit(): void {
    this.listPaidType = paidTypeList;
    this.listStatusType = paidStatusList;
    this.getPackList();

    if (this.data.idPack == null) {
      this.addForm = this.fbd.group({
        packCode: this.fbd.control('', [Validators.required]),
        namePack: this.fbd.control(''),
        totalBeforeVAT: this.fbd.control(''),
        totalAfterVAT: this.fbd.control(''),
        duration: this.fbd.control(''),
        numberOfContracts: this.fbd.control(''),
        type: this.fbd.control(''),
        calculatorMethod: this.fbd.control(''),
        purchaseDate: this.fbd.control('', [Validators.required]),
        paymentType: this.fbd.control('', [Validators.required]),
        paymentStatus: this.fbd.control('', [Validators.required]),
        paymentDate: this.fbd.control(''),
        startDate: this.fbd.control(''),
        endDate: this.fbd.control(''),
      });
    } else {
      console.log('vao form cap nhat');

      this.adminUnitService
        .getPackUnitByIdPack(this.data.id, this.data.idPack)
        .subscribe((response) => {
          console.log('response id pack ', response);
          console.log('response start date', response.startDate);

          this.addForm = this.fbd.group({
            packCode: this.fbd.control(response.code, [Validators.required]),
            namePack: this.fbd.control(response.name),
            totalBeforeVAT: this.fbd.control(response.totalBeforeVAT),
            totalAfterVAT: this.fbd.control(response.totalAfterVAT),
            duration: this.fbd.control(response.duration),
            numberOfContracts: this.fbd.control(response.numberOfContracts),
            type: this.fbd.control(
              this.convertServiceType(response.serviceType)
            ),
            calculatorMethod: this.fbd.control(
              this.convertCalculatorMethod(response.calculatorMethod)
            ),
            purchaseDate: this.fbd.control(new Date(response.purchaseDate), [
              Validators.required,
            ]),
            paymentType: this.fbd.control(
              this.convertPaymentType(response.paymentType),
              [Validators.required]
            ),
            paymentStatus: this.fbd.control(
              this.convertPaymentStatus(response.paymentStatus),
              [Validators.required]
            ),
            paymentDate: this.fbd.control(this.checkNull(response.paymentDate)),

            startDate: this.fbd.control(new Date(response.startDate)),
            endDate: this.fbd.control(this.checkNullEndDate(response.endDate)),
          });

          console.log('start date ', this.addForm.value.startDate);
        });
    }
  }
  checkNullEndDate(endDate: string): any {
    if (endDate != null) {
      return new Date(endDate)
        .toLocaleDateString('fr-CA')
        .split('-')
        .reverse()
        .join('/');
    }

    return null;
  }
  checkNull(paymentDate: string): any {
    if (paymentDate != null) {
      return new Date(paymentDate);
    }
    return null;
  }

  convertCalculatorMethod(calculatorMethod: string): string {
    if (calculatorMethod == 'BY_TIME') {
      console.log('vao day by time');

      this.flagTime = 1;

      return 'Theo thời gian';
    } else if (calculatorMethod == 'BY_CONTRACT_NUMBERS') {
      this.flagTime = 2;
      return 'Theo số lượng hợp đồng';
    }
    return '';
  }
  convertServiceType(serviceType: string): string {
    if (serviceType == 'NORMAL') {
      return 'Bình thường';
    } else if (serviceType == 'PROMOTION') {
      return 'Khuyến mại';
    }
    return '';
  }

  convertPaymentStatus(paymentStatus: string): any {
    if (paymentStatus == paidStatusList[0].id) {
      return paidStatusList[0];
    } else if (paymentStatus == paidStatusList[1].id) {
      return paidStatusList[1];
    }
    return '';
  }

  convertPaymentType(paymentType: string): any {
    if (paymentType == paidTypeList[0].id) {
      return paidTypeList[0];
    } else if (paymentType == paidTypeList[1].id) {
      return paidTypeList[1];
    }
    return '';
  }

  getPackList(): any {
    this.adminPackService
      .getPackListComboBox('', '', '', '', '', '', '')
      .subscribe((response) => {
        this.listDichVu = response;
      });
  }

  onChangeMaGoi(event: any) {
    if (this.flagTime === 1) {
      console.log('vao day');

      const startDate1 = new Date(this.startDate);

      console.log('duration model ', this.addForm.value.duration);

      this.endDate = new Date(
        startDate1.setMonth(startDate1.getMonth() + this.duration)
      ).toLocaleDateString('fr-CA');

      console.log('this end date ', this.endDate);
    }

    for (let i = 0; i < this.listDichVu.length; i++) {
      if (this.listDichVu[i].code == event.value) {
        this.idPack = this.listDichVu[i].id;
        this.namePack = this.listDichVu[i].name;
        this.totalBeforeVAT = this.listDichVu[i].totalBeforeVAT;
        this.totalAfterVAT = this.listDichVu[i].totalAfterVAT;

        if (this.listDichVu[i].calculatorMethod == 'BY_TIME') {
          console.log('vao day thoi gian');
          this.calculatorMethod = 'Theo thời gian';
          this.duration = this.listDichVu[i].duration;
          this.numberOfContracts = '';

          const startDate1 = new Date(this.startDate);

          this.endDate = '';

          if (this.startDate != null && this.startDate != undefined)
            this.endDate = new Date(
              startDate1.setMonth(startDate1.getMonth() + this.duration)
            )
              .toLocaleDateString('fr-CA')
              .split('-')
              .reverse()
              .join('/');

          console.log('this end date ', this.endDate);

          this.addForm.controls.startDate.setValidators([Validators.required]);
          this.addForm.controls.startDate.updateValueAndValidity();

          this.flagTime = 1;
        } else if (
          this.listDichVu[i].calculatorMethod == 'BY_CONTRACT_NUMBERS'
        ) {
          // this.startDate = '';
          this.endDate = '';

          console.log('vao day so luong');
          this.calculatorMethod = 'Theo số lượng hợp đồng';
          this.numberOfContracts = this.listDichVu[i].numberOfContracts;
          this.duration = '';

          this.addForm.controls.startDate.setValidators([]);
          this.addForm.controls.startDate.updateValueAndValidity();

          this.flagTime = 2;
        }

        if (this.listDichVu[i].type == 'NORMAL') {
          this.type = 'Bình thường';
        } else if (this.listDichVu[i].type == 'PROMOTION') {
          this.type = 'Khuyến mại';
        }

        break;
      }
    }
  }

  onChangeStatus(event: any) {
    if (event.value.id == 'PAID') {
      this.flagNgayThanhToan = true;
      this.addForm.controls.paymentDate.setValidators([Validators.required]);

      this.addForm.controls.paymentDate.updateValueAndValidity();
    } else if (event.value.id == 'UNPAID') {
      this.flagNgayThanhToan = false;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  onChangeStartDate(event: any) {
    if (this.flagTime === 1) {
      const startDate1 = new Date(this.addForm.value.startDate);

      this.endDate = new Date(
        startDate1.setMonth(startDate1.getMonth() + this.duration)
      )
        .toLocaleDateString('fr-CA')
        .split('-')
        .reverse()
        .join('/');
    }
  }

  onSubmit() {
    console.log('id org ', this.data.id);

    this.submitted = true;
    if (this.addForm.invalid) {
      console.log('invalid');
      return;
    }

    console.log('start date ', this.startDate);

    const dataForm = {
      id: this.data.id,
      idPack: this.idPack,
      purchaseDate: this.addForm.value.purchaseDate,
      paymentDate: this.addForm.value.paymentDate,
      paymentType: this.addForm.value.paymentType,
      paymentStatus: this.addForm.value.paymentStatus,
      startDate: this.addForm.value.startDate,
      endDate: this.endDate,
    };

    console.log('data form start date ', dataForm.startDate);

    if (
      this.addForm.value.paymentDate == null ||
      this.addForm.value.paymentDate == ''
    ) {
      dataForm.paymentDate = null;
    } else {
      dataForm.paymentDate = new Date(this.addForm.value.paymentDate)
        .toLocaleDateString('fr-CA')
        .split('/')
        .reverse()
        .join('-');
    }

    if (
      this.addForm.value.purchaseDate == null ||
      this.addForm.value.purchaseDate == ''
    ) {
      dataForm.purchaseDate = null;
    } else {
      dataForm.purchaseDate = new Date(this.addForm.value.purchaseDate)
        .toLocaleDateString('fr-CA')
        .split('/')
        .reverse()
        .join('-');
    }

    if (
      this.addForm.value.startDate == null ||
      this.addForm.value.startDate == ''
    ) {
      dataForm.startDate = null;
    } else {
      dataForm.startDate = new Date(this.addForm.value.startDate)
        .toLocaleDateString('fr-CA')
        .split('/')
        .reverse()
        .join('-');
    }

    if (this.data.idPack == null) {
      if (this.endDate == null || this.endDate == '') {
        dataForm.endDate = null;
      } else {
        dataForm.endDate = dataForm.endDate.split('/').reverse().join('-');
      }

      const subcription = this.adminUnitService.getUnitById(this.data.id).subscribe((response) => {
        let flagServiceTime = 0;
        let flagServiceContract = 0;
        for (let i = 0; i < response.services.length; i++) {
          //Check xem tổ chức đã sử dụng dịch vụ nào chưa
          //Nếu đang sử dụng dịch vụ theo thời gian => Không add dịch vụ theo thời gian
          //Nếu đang sử dụng dịch vụ theo số lượng hợp đồng => Không add dịch vụ theo số lượng hợp đồng
          if(response.services[i].calculatorMethod == 'BY_TIME' && response.services[i].usageStatus == 'USING') {
            flagServiceTime = 1;
          } else if(response.services[i].calculatorMethod == 'BY_CONTRACT_NUMBERS' && response.services[i].usageStatus == 'USING') {
            flagServiceContract = 1;
          }
        }

        subcription.unsubscribe();

        if(flagServiceTime == 1 && this.calculatorMethod == 'Theo thời gian') {
          console.log("dich vu theo thoi gian");
          this.toastService.showErrorHTMLWithTimeout('Tổ chức vẫn đang sử dụng một gói dịch vụ theo thời gian','',3000);
        } else if(flagServiceContract == 1 && this.calculatorMethod == 'Theo số lượng hợp đồng') {
          this.toastService.showErrorHTMLWithTimeout('Tổ chức vẫn đang sử dụng một gói dịch vụ theo số lượng hợp đồng','',3000);
        } else {
        this.addPackUnit(dataForm);
        }
      });
    } else {
      if (
        this.addForm.value.endDate == null ||
        this.addForm.value.endDate == ''
      ) {
        dataForm.endDate = null;
      } else {
        dataForm.endDate = this.addForm.value.endDate
          .split('/')
          .reverse()
          .join('-');
      }
      this.updatePackUnit(dataForm);
    }
  }

  updatePackUnit(dataForm: any) {
    console.log('ngay ket thuc ', this.addForm.value.endDate);
    this.adminUnitService
      .updatePackUnit(dataForm, this.data.idPack)
      .subscribe((response) => {
        console.log('res ', response);

        if (response.id != null && response.id != undefined) {
          this.toastService.showSuccessHTMLWithTimeout(
            'Cập nhật thành công!',
            '',
            3000
          );
          this.dialog.closeAll();

          const data = {
            title: 'unit.information',
            id: dataForm.id,
          };
          // @ts-ignore
          const dialogRef1 = this.dialog.open(AdminDetailUnitComponent, {
            width: '80%',
            height: '80%',
            backdrop: 'static',
            keyboard: false,
            data,
          });
          dialogRef1.afterClosed().subscribe((result: any) => {
            console.log('the close dialog');
          });
        }
      });
  }

  addPackUnit(dataForm: any) {
    this.adminUnitService.addPackUnit(dataForm).subscribe((response) => {
      if (response.id != null && response.id != undefined) {
        this.toastService.showSuccessHTMLWithTimeout(
          'Thêm mới thành công!',
          '',
          3000
        );

        this.dialog.closeAll();

        const data = {
          title: 'unit.information',
          id: dataForm.id,
        };
        // @ts-ignore
        const dialogRef1 = this.dialog.open(AdminDetailUnitComponent, {
          width: '80%',
          height: '80%',
          backdrop: 'static',

          keyboard: false,
          data,
        });
        dialogRef1.afterClosed().subscribe((result: any) => {
          console.log('the close dialog');
        });
      }
    });
  }

  onChangePaymentDate(event: any) {
    console.log('event ', event);
  }
}

