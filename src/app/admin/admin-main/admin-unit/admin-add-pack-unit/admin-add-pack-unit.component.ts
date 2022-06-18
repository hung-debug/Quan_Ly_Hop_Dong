import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { parttern_input } from 'src/app/config/parttern';
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
  listCodeDichVu: any[];
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

  idPack: any;

  submitted = false;

  endDate: any;

  flagTime: boolean = false;
  startDate: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminAddPackUnitComponent>,
    private adminUnitService: AdminUnitService,
    private adminPackService: AdminPackService,
    private toastService: ToastService
  ) {
    this.addForm = this.fbd.group({
      packCode: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      namePack: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      totalBeforeVAT: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      totalAfterVAT: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      duration: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      numberOfContracts: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      type: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      calculatorMethod: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      purchaseDate: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      paymentType: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      paymentStatus: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      paymentDate: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      startDate: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
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
        packCode: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        namePack: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        totalBeforeVAT: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        totalAfterVAT: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        duration: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        numberOfContracts: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        type: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        calculatorMethod: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        purchaseDate: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        paymentType: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        paymentStatus: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        paymentDate: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        startDate: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        endDate: this.fbd.control(''),
      });

      console.log('date ', this.addForm.value.purchaseDate);
    } else {
      console.log('vao form cap nhat');

      this.adminUnitService
        .getPackUnitByIdPack(this.data.id, this.data.idPack)
        .subscribe((response) => {
          console.log('response id pack ', response);
          console.log('response start date', response.startDate);

          this.addForm = this.fbd.group({
            packCode: this.fbd.control(response.code, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            namePack: this.fbd.control(response.name, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            totalBeforeVAT: this.fbd.control(response.totalBeforeVAT, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            totalAfterVAT: this.fbd.control(response.totalAfterVAT, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            duration: this.fbd.control(response.duration, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            numberOfContracts: this.fbd.control(response.numberOfContracts, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            type: this.fbd.control(
              this.convertServiceType(response.serviceType),
              [
                Validators.required,
                Validators.pattern(parttern_input.input_form),
              ]
            ),
            calculatorMethod: this.fbd.control(
              this.convertCalculatorMethod(response.calculatorMethod),
              [
                Validators.required,
                Validators.pattern(parttern_input.input_form),
              ]
            ),
            purchaseDate: this.fbd.control(new Date(response.purchaseDate), [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            paymentType: this.fbd.control(
              this.convertPaymentType(response.paymentType),
              [
                Validators.required,
                Validators.pattern(parttern_input.input_form),
              ]
            ),
            paymentStatus: this.fbd.control(
              this.convertPaymentStatus(response.paymentStatus),
              [
                Validators.required,
                Validators.pattern(parttern_input.input_form),
              ]
            ),
            paymentDate: this.fbd.control(new Date(response.paymentDate), [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),

            startDate: this.fbd.control(new Date(response.startDate), [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            endDate: this.fbd.control(
              this.getPaymentDate(new Date(response.endDate))
            ),
          });

          console.log('start date ', this.addForm.value.startDate);
        });
    }
  }
  convertCalculatorMethod(calculatorMethod: string): string {
    if (calculatorMethod == 'BY_TIME') {
      this.flagTime = true;
      return 'Theo thời gian';
    } else if (calculatorMethod == 'BY_CONTRACT_NUMBERS') {
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

  getPaymentDate(paymentDate: any): any {
    if (paymentDate != null) {
      return new Date(paymentDate).toLocaleDateString('fr-CA');
    }
    console.log('ngay thang toan null');
    return null;
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
        const listCode: any[] = [];

        console.log('response ', response);

        this.listDichVu = response;

        response.forEach((key: any) => {
          listCode.push(key.code);
        });

        this.listCodeDichVu = listCode;
      });
  }

  flag: number = 0;
  onChangeMaGoi(event: any) {
    if (this.flagTime === true) {
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

          console.log('duration model ', this.addForm.value.duration);

          if (this.flag == 1)
            this.endDate = new Date(
              startDate1.setMonth(startDate1.getMonth() + this.duration)
            ).toLocaleDateString('fr-CA');

          console.log('this end date ', this.endDate);

          this.flagTime = true;
          this.flag = 1;
        } else if (
          this.listDichVu[i].calculatorMethod == 'BY_CONTRACT_NUMBERS'
        ) {
          console.log('vao day so luong');
          this.calculatorMethod = 'Theo số lượng hợp đồng';
          this.numberOfContracts = this.listDichVu[i].numberOfContracts;
          this.duration = '';
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
    } else if (event.value.id == 'UNPAID') {
      this.flagNgayThanhToan = false;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  onChangeStartDate(event: any) {
    if (this.flagTime === true) {

      console.log("vao day time");

      const startDate1 = new Date(this.addForm.value.startDate);

      console.log("duration ", this.addForm.value.duration);

      if(this.data.idPack == null) {
        this.endDate = this.getPaymentDate(
          new Date(
            startDate1.setMonth(
              startDate1.getMonth() + this.duration
            )
          ).toLocaleDateString('fr-CA')
        );
      } else {
        this.endDate = this.getPaymentDate(
          new Date(
            startDate1.setMonth(
              startDate1.getMonth() + this.addForm.value.duration
            )
          ).toLocaleDateString('fr-CA')
        );
      }
    
    }
  }

  onSubmit() {
    this.submitted = true;
    // if (this.addForm.invalid) {
    //   return;
    // }
    const dataForm = {
      id: this.data.id,
      idPack: this.idPack,
      purchaseDate: this.addForm.value.purchaseDate,
      paymentDate: this.addForm.value.paymentDate,
      paymentType: this.addForm.value.paymentType,
      paymentStatus: this.addForm.value.paymentStatus,
      startDate: this.addForm.value.startDate,
      endDate: this.addForm.value.endDate,
    };

    if (
      this.addForm.value.paymentDate == null || this.addForm.value.paymentDate == '') {
      console.log('pay ment date null');
      dataForm.paymentDate = null;
    } else {
      dataForm.paymentDate = JSON.stringify(
        this.addForm.value.paymentDate
      ).substring(1, 11);
    }

    if (
      this.addForm.value.endDate == null ||
      this.addForm.value.endDate == ''
    ) {
      dataForm.endDate = null;
    } else {
      dataForm.endDate = JSON.stringify(this.addForm.value.endDate).substring(
        1,
        11
      );
    }

    console.log('date submit ', dataForm.purchaseDate);

    if (this.data.idPack == null) {
      this.addPackUnit(dataForm);
    } else {
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

        // this.dialogRef.close();

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
}
