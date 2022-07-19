import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { ToastService } from 'src/app/service/toast.service';
import { parttern_input } from '../../../../config/parttern';
import {
  theThucTinhList,
  loaiGoiDichVuList,
} from '../../../../config/variable';

@Component({
  selector: 'app-admin-add-pack',
  templateUrl: './admin-add-pack.component.html',
  styleUrls: ['./admin-add-pack.component.scss'],
})
export class AdminAddPackComponent implements OnInit {
  addForm: FormGroup;
  datas: any;
  codeOld: any;
  nameOld: any;
  parentName: any;
  emailOld: any;
  phoneOld: any;

  theThucTinh: Array<any> = [];
  loaiGoi: Array<any> = [];

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  submitted = false;

  //name input thoi gian va so luong hop dong
  timeName: any;
  numberContractName: any;

  //1 => time: white, so luong: gray
  //2 => so luong: white, time: gray
  //3 => all gray
  flagComboBoxTheThucTinh: any;

  get f() {
    return this.addForm.controls;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<AdminAddPackComponent>,
    public router: Router,
    public dialog: MatDialog,
    private adminPackService: AdminPackService
  ) {
    this.addForm = this.fbd.group({
      code: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      name: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),

      totalBeforeVAT: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.number_form),
      ]),
      totalAfterVAT: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.number_form),
      ]),

      calc: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.input_form),
      ]),
      type: this.fbd.control(''),

      time: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.number_form),
      ]),

      number_contract: this.fbd.control('', [
        Validators.required,
        Validators.pattern(parttern_input.number_form),
      ]),
      describe: this.fbd.control('', [
        Validators.pattern(parttern_input.input_form),
      ]),
      status: this.fbd.control(''),
    });
  }

  ngOnInit(): void {
    //dungpt
    //gan data cho combobox
    this.loadedListComboBox();

    this.flagComboBoxTheThucTinh = 3;

    this.datas = this.data;

    //lay du lieu form cap nhat
    if (this.data.id != null) {
      console.log('this flag ', this.flagComboBoxTheThucTinh);

      this.adminPackService.getPackById(this.data.id).subscribe(
        (data) => {
          this.addForm = this.fbd.group({
            code: this.fbd.control(data.code, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),
            name: this.fbd.control(data.name, [
              Validators.required,
              Validators.pattern(parttern_input.input_form),
            ]),

            totalBeforeVAT: this.fbd.control(data.totalBeforeVAT, [
              Validators.required,
              Validators.pattern(parttern_input.number_form),
            ]),
            totalAfterVAT: this.fbd.control(data.totalAfterVAT, [
              Validators.required,
              Validators.pattern(parttern_input.number_form),
            ]),

            calc: this.convertCalc(data.calculatorMethod),
            type: this.convertType(data.type),

            time: this.fbd.control(data.duration),
            number_contract: this.fbd.control(data.numberOfContracts),

            describe: this.fbd.control(data.description),

            status: this.convertStatus(data.status),
          });

          if(this.flagComboBoxTheThucTinh == 1) {
            this.addForm.controls.time.setValidators([Validators.required, Validators.pattern(parttern_input.input_form)]);
          } else if(this.flagComboBoxTheThucTinh == 2) {
            this.addForm.controls.number_contract.setValidators([Validators.required, Validators.pattern(parttern_input.input_form)]);
          }

        },
        (error) => {
          this.toastService.showErrorHTMLWithTimeout(
            'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
            '',
            3000
          );
        }
      );

      //khoi tao form them moi
    } else {
      this.addForm = this.fbd.group({
        code: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        name: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),

        totalBeforeVAT: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.number_form),
        ]),
        totalAfterVAT: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.number_form),
        ]),

        calc: this.fbd.control('', [
          Validators.required,
          Validators.pattern(parttern_input.input_form),
        ]),
        type: this.fbd.control(''),

        time: this.fbd.control({ value: '', disabled: true }, [
          Validators.required,
          Validators.pattern(parttern_input.number_form),
        ]),

        number_contract: this.fbd.control({ value: '', disabled: true }, [
          Validators.required,
          Validators.pattern(parttern_input.number_form),
        ]),
        describe: this.fbd.control(''),
        status: 1,
      });
    }
  }

  convertType(type: any): number {
    if (type == 'NORMAL') {
      return 1;
    } else if (type == 'PROMOTION') {
      return 2;
    }
    return 0;
  }

  convertCalc(calc: any): number {
    if (calc == 'BY_TIME') {
      this.addForm.controls.number_contract.disable();

      this.flagComboBoxTheThucTinh = 1;

      return 1;
    } else if (calc == 'BY_CONTRACT_NUMBERS') {
      this.addForm.controls.time.disable();

      this.flagComboBoxTheThucTinh = 2;

      return 2;
    }

    return 0;
  }

  convertStatus(status: any): number {
    if (status == 'ACTIVE') {
      return 1;
    } else if (status == 'IN_ACTIVE') {
      return 0;
    }

    return -1;
  }

  loadedListComboBox() {
    this.theThucTinh = theThucTinhList;
    this.loaiGoi = loaiGoiDichVuList;
  }

  update(data: any) {
    this.adminPackService.updatePack(data).subscribe(
      (data) => {
        this.toastService.showSuccessHTMLWithTimeout(
          'Cập nhật thông tin thành công!',
          '',
          3000
        );
        this.dialogRef.close();
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/admin-main/pack']);
          });
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout(
          'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
          '',
          3000
        );
      }
    );
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addForm.invalid) {
      console.log('invalid');
      return;
    }

    console.log("time ", this.addForm.controls.time);

    let dataForm = {
      id: this.data.id,
      code: this.addForm.value.code,
      name: this.addForm.value.name,
      totalBeforeVAT: this.addForm.value.totalBeforeVAT,
      totalAfterVAT: this.addForm.value.totalAfterVAT,
      calc: this.addForm.value.calc,
      type: this.addForm.value.type,
      time: this.addForm.value.time,
      number_contract: this.addForm.value.number_contract,
      describe: this.addForm.value.describe,
      status: this.addForm.value.status,
    };

    if (this.addForm.value.calc == 1) {
      dataForm.calc = 'BY_TIME';
    } else if (this.addForm.value.calc == 2) {
      dataForm.calc = 'BY_CONTRACT_NUMBERS';
    }

    if (this.addForm.value.type == 1) {
      dataForm.type = 'NORMAL';
    } else if (this.addForm.value.type == 2) {
      dataForm.type = 'PROMOTION';
    }

    if (this.addForm.value.status == 1) {
      dataForm.status = 'ACTIVE';
    } else if (this.addForm.value.status == 2) {
      dataForm.status = 'IN_ACTIVE';
    }

    //truong hop sua ban ghi
    if (this.data.id != null && this.data.id != undefined) {
      this.adminPackService.updatePack(dataForm).subscribe(
        (data) => {
          if (data.id != null && data.id != undefined) {
            this.toastService.showSuccessHTMLWithTimeout(
              'Cập nhật thành công!',
              '',
              3000
            );
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['admin-main/pack']);
              });

            this.dialog.closeAll();
          } else {
            if (data.errors[0].code == 1008) {
              this.toastService.showErrorHTMLWithTimeout(
                'Mã dịch vụ đã được sử dụng',
                '',
                3000
              );
            }
          }
        },
        (error) => {
          console.log('error ');
          console.log(error);
          this.toastService.showErrorHTMLWithTimeout(
            'Cập nhật thất bại',
            '',
            3000
          );
        }
      );

      //truong hop them moi ban ghi
    } else {
      this.adminPackService.addPack(dataForm).subscribe(
        (data) => {
          console.log('data add ');
          console.log(data);

          if (data.id != null && data.id != undefined) {
            this.toastService.showSuccessHTMLWithTimeout(
              'Thêm mới thành công!',
              '',
              3000
            );
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['admin-main/pack']);
              });

            this.dialog.closeAll();
          } else {
            if (data.errors[0].code == 1008) {
              this.toastService.showErrorHTMLWithTimeout(
                'Mã dịch vụ đã được sử dụng',
                '',
                3000
              );
            }
          }
        },
        (error) => {
          console.log('error ');
          console.log(error);
          this.toastService.showErrorHTMLWithTimeout(
            'Thêm mới thất bại',
            '',
            3000
          );
        }
      );
    }
  }

  //dungpt
  //Bat su kien khi combobox the thuc tinh thay doi
  onChangeTheThucTinh(event: any) {

    console.log("event ", event);

    if (event.value == 1) {
      this.addForm.controls.time.setValidators([Validators.required, Validators.pattern(parttern_input.number_form)]);

      //Chon thoi gian

      this.addForm.controls.time.enable();
      this.addForm.controls.number_contract.disable();

      this.numberContractName = '';


      console.log("vao day nhe event 1");
      this.flagComboBoxTheThucTinh = 1;
    } else if (event.value == 2) {
      this.addForm.controls.number_contract.setValidators([Validators.required, Validators.pattern(parttern_input.number_form)]);
      //Chon so hop dong

      this.addForm.controls.number_contract.enable();
      this.addForm.controls.time.disable();
      this.timeName = '';


      console.log("vao day nhe event 2");
      this.flagComboBoxTheThucTinh = 2;
    } else {
      this.addForm.controls.time.disable();
      this.addForm.controls.number_contract.disable();
      this.numberContractName = '';
      this.timeName = '';

      this.flagComboBoxTheThucTinh = 3;
    }
  }
}
