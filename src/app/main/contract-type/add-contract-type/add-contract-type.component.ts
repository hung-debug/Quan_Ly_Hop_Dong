import { map } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { optionsCeCa } from 'src/app/config/variable';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import {parttern_input} from "../../../config/parttern";
import { parttern } from '../../../config/parttern';
import { environment } from 'src/environments/environment';

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

  optionsCeCa: Array<any> = [];

  optionsCeCaValue: any = 1;

  optionsGroupContract: any;
  groupContract: any;
  site: string;
  enviroment: any = ""
  ceca: boolean;
  groupContractId: any

  get f() { return this.addForm.controls; }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbd: FormBuilder,
    private contractTypeService : ContractTypeService,
    private toastService : ToastService,
    public dialogRef: MatDialogRef<AddContractTypeComponent>,
    public router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private contractService: ContractService
    ) {
      // this.addForm = this.fbd.group({
      //   name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
      //   code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
      //   ceca_push: 0,
      //   group_contract: this.fbd.control(1, [Validators.required]),
      // });

    }

  ngOnInit(): void {
    this.enviroment = environment
    this.datas = this.data;

    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }
    this.optionsCeCa = optionsCeCa;

    this.contractTypeService.getGroupContract().subscribe((response:any) =>{

      this.optionsGroupContract = response;

    })

    if(environment.flag == 'NB'){
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
        ceca_push: 0,
        group_contract: this.fbd.control("", [Validators.required]),
      });
    } else{
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
        code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
        ceca_push: 0,
        group_contract: this.fbd.control(""),
      });
    }



    //lay du lieu form cap nhat
    if( this.data.id != null){
      this.contractTypeService.getContractTypeById(this.data.id).subscribe(
        data => {
          if(environment.flag == 'NB'){
            this.addForm = this.fbd.group({
              name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
              code: this.fbd.control(data.code, [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
              ceca_push: this.convertCeCa(data.ceca_push),
              // group_contract: this.groupContract
              group_contract: this.fbd.control(data.groupId, [Validators.required]),
            });
          }else{
            this.addForm = this.fbd.group({
              name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
              code: this.fbd.control(data.code, [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
              ceca_push: this.convertCeCa(data.ceca_push),
              // group_contract: this.groupContract
              group_contract: this.fbd.control(data.groupId),
            });
          }

          this.nameOld = data.name;
          this.codeOld = data.code;
          // this.optionsGroupContractValue = data.groupId;
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        }
      )
    }else{
      if(environment.flag == 'NB'){
        this.addForm = this.fbd.group({
          name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
          code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
          ceca_push: 0,
          group_contract: this.fbd.control(this.groupContract, [Validators.required]),
        });
      }else{
        this.addForm = this.fbd.group({
          name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
          code: this.fbd.control("", [Validators.required, Validators.pattern(parttern.name_and_number), Validators.pattern(parttern_input.new_input_form)]),
          ceca_push: 0,
          group_contract: this.fbd.control(this.groupContract),
        });
      }

    }


    this.contractService.getDataNotifyOriganzation().subscribe((response) => {
      if(response.ceca_push_mode == 'NONE') {
        this.ceca = false;
      } else if(response.ceca_push_mode == 'SELECTION') {
        this.ceca = true
        if (environment.flag == 'NB') {
          this.optionsCeCaValue = 1;
        }
      }
    })
  }

  convertCeCa(ceca_push: any) {
    if(ceca_push == 1) {
      this.optionsCeCaValue = 1;
      return 1;
    } else {
      this.optionsCeCaValue = 0;
      return 0;
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
            this.toastService.showErrorHTMLWithTimeout('Tên loại tài liệu đã tồn tại', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
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
        this.spinner.hide();
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
        this.spinner.hide();
      }
    )
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data =
    environment.flag == 'NB'?
    {
      id: this.data.id,
      name: this.addForm.value.name,
      code: this.addForm.value.code,
      ceca_push: this.addForm.value.ceca_push,
      groupId: this.addForm.value.group_contract,
    } :
    {
      id: this.data.id,
      name: this.addForm.value.name,
      code: this.addForm.value.code,
      ceca_push: this.addForm.value.ceca_push,
    }

    this.spinner.show();
    // ham sua
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
              this.toastService.showErrorHTMLWithTimeout('Mã loại tài liệu đã tồn tại', "", 3000);
              this.spinner.hide();
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
            this.spinner.hide();
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
                      this.toastService.showSuccessHTMLWithTimeout('Thêm mới loại tài liệu thành công!', "", 3000);
                      this.dialogRef.close();
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigate(['/main/contract-type']);
                      });
                      this.spinner.hide();
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                      this.spinner.hide();
                    }
                  )
                //neu ten loai hop dong da ton tai
                }else{
                  this.toastService.showErrorHTMLWithTimeout('Tên loại tài liệu đã tồn tại', "", 3000);
                  this.spinner.hide();
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                this.spinner.hide();
              }
            )
          //neu ma loai hop dong da ton tai
          }else{
            this.toastService.showErrorHTMLWithTimeout('Mã loại tài liệu đã tồn tại', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )
    }
  }

}
