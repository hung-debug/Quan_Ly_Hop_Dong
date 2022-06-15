import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { parttern_input } from 'src/app/config/parttern';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';

@Component({
  selector: 'app-admin-add-pack-unit',
  templateUrl: './admin-add-pack-unit.component.html',
  styleUrls: ['./admin-add-pack-unit.component.scss'],
})
export class AdminAddPackUnitComponent implements OnInit {
  datas: any;
  listCodeDichVu: any[];
  listDichVu: any[];
  namePack: string;
  totalBeforeVAT: string;
  totalAfterVAT: string;
  duration: string;
  numberOfContracts: string;
  calculatorMethod: string = "";
  type: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminAddPackUnitComponent>,
    private adminPackService: AdminPackService
  ) {
    // this.addForm = this.fbd.group({
    //   packId: this.fbd.control('', [
    //     Validators.required,
    //     Validators.pattern(parttern_input.input_form),
    //   ]),
    // });
  }

  ngOnInit(): void {
    this.getPackList();
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

  onChangeMaGoi(event: any) {
    let id = '';
    for (let i = 0; i < this.listDichVu.length; i++) {
      if (this.listDichVu[i].code == event.value) {
        id = this.listDichVu[i].id;
        this.namePack = this.listDichVu[i].name;
        this.totalBeforeVAT = this.listDichVu[i].totalBeforeVAT;
        this.totalAfterVAT = this.listDichVu[i].totalAfterVAT;


        if (this.listDichVu[i].calculatorMethod == 'BY_TIME') {
          console.log('vao day thoi gian');
          this.calculatorMethod = "Theo thời gian";
          this.duration = this.listDichVu[i].duration;
          this.numberOfContracts = '';
        } else if (
          this.listDichVu[i].calculatorMethod == 'BY_CONTRACT_NUMBERS'
        ) {
          console.log('vao day so luong');
          this.calculatorMethod = "Theo số lượng hợp đồng";
          this.numberOfContracts = this.listDichVu[i].numberOfContracts;
          this.duration = '';
        }

        if(this.listDichVu[i].type == 'NORMAL') {
          this.type = "Bình thường";          
        } else if(this.listDichVu[i].type == 'PROMOTION') {
          this.type = "Khuyến mại";
        }

        break;
      }
    }

    console.log('id ', id);
  }

  cancel() {
    this.dialogRef.close();
  }
}
