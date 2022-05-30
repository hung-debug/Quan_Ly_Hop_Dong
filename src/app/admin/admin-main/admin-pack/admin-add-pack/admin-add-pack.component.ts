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
        price: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        calc: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        type: this.fbd.control(""),
        condition: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        time: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        number_contract: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        describe: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        status: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      });

    }

  ngOnInit(): void {    
   

    this.loadedListComboBox();

    this.datas = this.data;

    //lay du lieu form cap nhat
    if( this.data.id != null){
      //lay danh sach to chuc
      
      this.adminPackService.getPackById(this.data.id).subscribe(
        data => {
          this.addForm = this.fbd.group({
            code: this.fbd.control(data.code, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            price: this.fbd.control(data.price, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            calc: this.fbd.control(data.calc, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            type: this.fbd.control(data.type),
            condition: this.fbd.control(data.condition, [Validators.pattern(parttern_input.input_form)]),
            time: this.fbd.control(data.time, [Validators.required, Validators.pattern(parttern_input.input_form)]),
            number_contract: this.fbd.control(data.number_contract, [Validators.required, Validators.pattern(parttern_input.input_form)]),
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
        price: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        calc: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        type: this.fbd.control(""),
        condition: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        time: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        number_contract: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        describe: this.fbd.control("", [Validators.pattern(parttern_input.input_form)]),
        status: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
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
    const data = {
      id: "",
      code: this.addForm.value.code,
      name: this.addForm.value.name,
      price: this.addForm.value.price,
      calc: this.addForm.value.calc,
      type: this.addForm.value.type,
      condition: this.addForm.value.condition,
      time: this.addForm.value.time,
      number_contract: this.addForm.value.number_contract,
      describe: this.addForm.value.describe,
      status: this.addForm.value.status
    }
    console.log(data);

    //truong hop sua ban ghi
    if(this.data.id !=null){
      data.id = this.data.id;
      //neu thay doi ten thi can check lai
      if(data.name != this.nameOld){
        //kiem tra ten to chuc da ton tai trong he thong hay chua
        this.adminPackService.checkNameUnique(data, data.name).subscribe(
          dataByName => {
            console.log(dataByName);
            if(dataByName.code == '00'){

              //ham check ma
              this.update(data);

            }else if(dataByName.code == '01'){
              this.toastService.showErrorHTMLWithTimeout('Tên tổ chức đã tồn tại trong hệ thống', "", 3000);
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          }
        )
      //neu khong thay doi thi khong can check ten
      }else{
        //update
        this.update(data);
      }
      

    //truong hop them moi ban ghi
    }else{
      //kiem tra ten to chuc da ton tai trong he thong hay chua
      this.adminPackService.checkNameUnique(data, data.name).subscribe(
        dataByName => {
          console.log(dataByName);
          if(dataByName.code == '00'){

            //kiem tra ma to chuc da ton tai trong he thong hay chua
            this.adminPackService.checkCodeUnique(data, data.code).subscribe(
              dataByCode => {

                if(dataByCode.code == '00'){
                  //update
                  this.update(data);
                }else if(dataByCode.code == '01'){
                  this.toastService.showErrorHTMLWithTimeout('Mã tổ chức đã tồn tại trong hệ thống', "", 3000);
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
              }
            )
              
            }else if(dataByName.code == '01'){
              this.toastService.showErrorHTMLWithTimeout('Tên tổ chức đã tồn tại trong hệ thống', "", 3000);
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          }
        )
    }
  }

  onChangeLoaiGoi() {
    console.log("test")
  }

}
