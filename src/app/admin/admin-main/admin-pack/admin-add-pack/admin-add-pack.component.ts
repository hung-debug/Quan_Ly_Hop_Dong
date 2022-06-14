import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminPackService } from 'src/app/service/admin/admin-pack.service';
import { ToastService } from 'src/app/service/toast.service';
import {parttern_input} from "../../../../config/parttern";
import {theThucTinhList, loaiGoiDichVuList} from "../../../../config/variable";



@Component({
  selector: 'app-admin-add-pack',
  templateUrl: './admin-add-pack.component.html',
  styleUrls: ['./admin-add-pack.component.scss']
})
export class AdminAddPackComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  codeOld:any;
  nameOld:any
  parentName:any;
  emailOld:any;
  phoneOld:any;

  theThucTinh: Array<any> = [];
  loaiGoi: Array<any> = []; 

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  submitted = false;

  //dungpt
  //name input thoi gian va so luong hop dong
  timeName: string;
  numberContractName: string;

  //1 => time: white, so luong: gray
  //2 => so luong: white, time: gray
  //3 => all gray
  flagComboBoxTheThucTinh:any;

  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AdminAddPackComponent>,
    public router: Router,
    public dialog: MatDialog,
    private adminPackService : AdminPackService,
    ) { 

      this.addForm = this.fbd.group({
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),

        totalBeforeVAT: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),
        totalAfterVAT: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),

        calc: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        type: this.fbd.control(""),
        condition: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),

        time: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),

        
        //dungpt
        //chinh validate so cua luong hop dong
        number_contract: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),
        describe: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        status: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      });

    }

  ngOnInit(): void {    
    //dungpt
    //gan data cho combobox
    this.loadedListComboBox();

    this.flagComboBoxTheThucTinh = 3;

    this.datas = this.data;

    //lay du lieu form cap nhat
    if( this.data.id != null){
      //lay danh sach to chuc
      
      this.adminPackService.getPackById(this.data.id).subscribe(
        data => {
          this.addForm = this.fbd.group({
            code: this.fbd.control(data.code, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.input_form)]),

            totalBeforeVAT: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),
            totalAfterVAT: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),
    

            calc: this.fbd.control(data.calc, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            type: this.fbd.control(data.type),
            condition: this.fbd.control(data.condition, [Validators.pattern(parttern_input.input_form)]),
            time: this.fbd.control({value: data.time, disabled: true}, [Validators.required, Validators.pattern(parttern_input.number_form)]),
            number_contract: this.fbd.control({value:data.number_contract, disabled: true}, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            describe: this.fbd.control(data.describe, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            status: this.fbd.control(data.status, [Validators.pattern(parttern_input.input_form)]),
          });
    
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )

    //khoi tao form them moi
    }else{
      
      this.addForm = this.fbd.group({
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),

        totalBeforeVAT: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),
        totalAfterVAT: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.number_form)]),


        calc: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        type: this.fbd.control(""),
        condition: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        time: this.fbd.control({value: '',disabled: true}, [Validators.required, Validators.pattern(parttern_input.number_form)]),
        number_contract: this.fbd.control({value: '',disabled: true}, [Validators.required, Validators.pattern(parttern_input.input_form)]),
        describe: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        status: 1,
      });
    }
  }

  loadedListComboBox()  {
   this.theThucTinh = theThucTinhList;
   this.loaiGoi = loaiGoiDichVuList;
  }

  update(data:any){
    this.adminPackService.updatePack(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/admin-main/pack']);
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }

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
      status: this.addForm.value.status
    }

    if(this.addForm.value.calc == 1) {
      dataForm.calc = 'BY_TIME';
    } else if(this.addForm.value.calc == 2) {
      dataForm.calc = 'BY_CONTRACT_NUMBERS';
    }

    if(this.addForm.value.type == 1) {
      dataForm.type = 'NORMAL';
    } else if(this.addForm.value.type == 2) {
      dataForm.type = 'PROMOTION';
    }

    if(this.addForm.value.status == 1) {
      dataForm.status = 'ACTIVE';
    } else if(this.addForm.value.status == 2) {
      dataForm.status = 'IN_ACTIVE';
    }

    console.log("number ",dataForm.number_contract)

    //truong hop sua ban ghi
    if(this.data.id !=null){
      // data.id = this.data.id;
      // //neu thay doi ten thi can check lai
      // if(data.name != this.nameOld){
      //   //kiem tra ten to chuc da ton tai trong he thong hay chua
      //   this.adminPackService.checkNameUnique(data, data.name).subscribe(
      //     dataByName => {
      //       console.log(dataByName);
      //       if(dataByName.code == '00'){

      //         //ham check ma
      //         this.update(data);

      //       }else if(dataByName.code == '01'){
      //         this.toastService.showErrorHTMLWithTimeout('Tên tổ chức đã tồn tại trong hệ thống', "", 3000);
      //       }
      //     }, error => {
      //       this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      //     }
      //   )
      // //neu khong thay doi thi khong can check ten
      // }else{
      //   //update
      //   this.update(data);
      // }
      

    //truong hop them moi ban ghi
    }else{
      if (dataForm.status == 1) {
        dataForm.status = 'ACTIVE';
      } else if (dataForm.status == 0) {
        dataForm.status = 'IN_ACTIVE';
      }
      this.adminPackService.addPack(dataForm).subscribe(
        (data) => {
          console.log('data add ');
          console.log(data);

          if (data.id  != null && data.id != undefined) {
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
            if (data.errors[0].code == 1001) {
              this.toastService.showErrorHTMLWithTimeout(
                'Email đã tồn tại trên hệ thống',
                '',
                3000
              );
            } else if (data.errors[0].code == 1003) {
              this.toastService.showErrorHTMLWithTimeout(
                'Tên tổ chức đã được sử dụng',
                '',
                3000
              );
            } else if (data.errors[0].code == 1006) {
              this.toastService.showErrorHTMLWithTimeout(
                'Mã số thuế đã tồn tại trên hệ thống',
                '',
                3000
              );
            } else if (data.errors[0].code == 1002) {
              this.toastService.showErrorHTMLWithTimeout(
                'SĐT đã được sử dụng',
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
  onChangeTheThucTinh(event :any) {
    if(event.value == 1) {
      //Chon thoi gian

      this.addForm.controls.time.enable();
      this.addForm.controls.number_contract.disable();

      this.numberContractName = "";

      this.flagComboBoxTheThucTinh = 1;
    } else if(event.value == 2) {
      //Chon so hop dong

      this.addForm.controls.number_contract.enable();
      this.addForm.controls.time.disable();
      this.timeName = "";

      this.flagComboBoxTheThucTinh = 2;
    } else {

      this.addForm.controls.time.disable();
      this.addForm.controls.number_contract.disable();
      this.numberContractName = "";
      this.timeName = "";

      this.flagComboBoxTheThucTinh = 3;

    }
  }

}
