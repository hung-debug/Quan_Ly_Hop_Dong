import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-contract-type',
  templateUrl: './add-contract-type.component.html',
  styleUrls: ['./add-contract-type.component.scss']
})
export class AddContractTypeComponent implements OnInit {

  addForm: FormGroup;
  datas: any;
  nameOld:any;
  codeOld:any;

  submitted = false;
  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private contractTypeService : ContractTypeService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddContractTypeComponent>,
    public router: Router,
    public dialog: MatDialog,) {
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required])
      });
    }

  ngOnInit(): void {
    this.datas = this.data;
    //lay du lieu form cap nhat
    if( this.data.id != null){
      this.contractTypeService.getContractTypeById(this.data.id).subscribe(
        data => {
          console.log(data);
          this.addForm = this.fbd.group({
            name: this.fbd.control(data.name, [Validators.required]),
            code: this.fbd.control(data.code, [Validators.required])
          });
          this.nameOld = data.name;
          this.codeOld = data.code;
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }else{
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        code: this.fbd.control("", [Validators.required])
      });
    }
  }

  checkName(data:any){
    //neu thay doi ten thi can check lai
    if(data.name != this.nameOld){
      //kiem tra ten
      this.contractTypeService.checkNameContractType(data.name).subscribe(
        dataByName => {
          //neu ten loai hop dong chua ton tai
          if(dataByName.success){
            
            //call update
            this.update(data);

          //neu ten loai hop dong da ton tai
          }else{
            this.toastService.showErrorHTMLWithTimeout('Tên loại hợp đồng đã tồn tại', "", 3000);
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )

    //neu khong thay doi ten thi bo qua check ten
    }else{
      //call update
      this.update(data);
    }
  }

  update(data:any){
    this.contractTypeService.updateContractType(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 3000);
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/contract-type']);
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
      id: this.data.id,
      name: this.addForm.value.name,
      code: this.addForm.value.code,
    }
    //ham sua
    if(this.data.id !=null){

      //neu thay doi ma thi can check lai
      if(data.code != this.codeOld){
        this.contractTypeService.checkCodeContractType(data.code).subscribe(
          dataByCode => {
            //neu ma loai hop dong chua ton tai
            if(dataByCode.success){
              
              //call ham check ten
              this.checkName(data);

            //neu ma loai hop dong da ton tai
            }else{
              this.toastService.showErrorHTMLWithTimeout('Mã loại hợp đồng đã tồn tại', "", 3000);
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          }
        )
      //neu khong thay doi ma thi bo qua check ma
      }else{
        //ham check ten
        this.checkName(data);
      }
    
    //ham them moi
    }else{
      //kiem tra ma loai hop dong
      this.contractTypeService.checkCodeContractType(data.code).subscribe(
        dataByCode => {
          //neu ma loai hop dong chua ton tai
          if(dataByCode.success){
            //kiem tra ten loai hop dong
            this.contractTypeService.checkNameContractType(data.name).subscribe(
              dataByName => {
                //neu ten loai hop dong chua ton tai
                if(dataByName.success){
                  this.contractTypeService.addContractType(data).subscribe(
                    data => {
                      this.toastService.showSuccessHTMLWithTimeout('Thêm mới loại hợp đồng thành công!', "", 3000);
                      this.dialogRef.close();
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigate(['/main/contract-type']);
                      });
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                    }
                  )
                //neu ten loai hop dong da ton tai
                }else{
                  this.toastService.showErrorHTMLWithTimeout('Tên loại hợp đồng đã tồn tại', "", 3000);
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
              }
            )
          //neu ma loai hop dong da ton tai
          }else{
            this.toastService.showErrorHTMLWithTimeout('Mã loại hợp đồng đã tồn tại', "", 3000);
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }
  }

}
