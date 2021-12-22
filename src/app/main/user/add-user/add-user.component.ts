import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import { DatepickerOptions } from 'ng2-datepicker';
import { AppService } from 'src/app/service/app.service';
import { UnitService } from 'src/app/service/unit.service';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  
  submitted = false;
  get f() { return this.addForm.controls; }

  action: string;
  private sub: any;
  id:any;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];

  addForm: FormGroup;
  datas: any;

  constructor(private appService: AppService,
    private toastService : ToastService,
    private userService : UserService,
    private unitService : UnitService,
    private route: ActivatedRoute,
    private fbd: FormBuilder,
    public router: Router,
    ) {
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        birthday: null,
        phone: this.fbd.control("", [Validators.required]),
        organizationId: this.fbd.control("", [Validators.required]),
        role: this.fbd.control("", [Validators.required]),
        status: 1,

        phoneKpi: null,
        networkKpi: null,

        nameHsm: null
      });
     }

  ngOnInit(): void {
    //lay danh sach to chuc
    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);
      this.orgList = data.entities;
    });

    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if (this.action == 'add') {
        this.appService.setTitle('THÊM MỚI NGƯỜI DÙNG');

        this.addForm = this.fbd.group({
          name: this.fbd.control("", [Validators.required]),
          email: this.fbd.control("", [Validators.required, Validators.email]),
          birthday: null,
          phone: this.fbd.control("", [Validators.required]),
          organizationId: this.fbd.control("", [Validators.required]),
          role: this.fbd.control("", [Validators.required]),
          status: 1,

          phoneKpi: null,
          networkKpi: null,

          nameHsm: null
        });
      } else if (this.action == 'edit') {
        let id = params['id'];
        this.appService.setTitle('CẬP NHẬT THÔNG TIN NGƯỜI DÙNG');

        this.userService.getUserById(id).subscribe(
          data => {
            this.addForm = this.fbd.group({
              name: this.fbd.control(data.name, [Validators.required]),
              email: this.fbd.control(data.email, [Validators.required, Validators.email]),
              birthday: data.birthday,
              phone: this.fbd.control(data.phone, [Validators.required]),
              organizationId: this.fbd.control(data.organization_id, [Validators.required]),
              role: this.fbd.control(data.type_id, [Validators.required]),
              status: data.status,

              phoneKpi: data.phone_sign,
              networkKpi: data.phone_tel,

              nameHsm: data.hsm_name
            });
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
          }
        )
      }
    });    
  }

  updateInforUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 10000);
  }

  updateSignFileImageUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.file.image.success", "", 10000);
  }

  updateSignKpiUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.kpi.success", "", 10000);
  }

  updateSignHsmUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.hsm.success", "", 10000);
  }

  onCancel(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/user']);
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    const data = {
      id: "",
      name: this.addForm.value.name,
      email: this.addForm.value.email,
      birthday: this.addForm.value.birthday,
      phone: this.addForm.value.phone,
      organizationId: this.addForm.value.organizationId,
      role: this.addForm.value.role,
      status: this.addForm.value.status,
      phoneKpi: this.addForm.value.phoneKpi,
      networkKpi: this.addForm.value.networkKpi,
      nameHsm: this.addForm.value.nameHsm,
    }
    console.log(data);
    if(this.id !=null){
      data.id = this.id;
      this.userService.updateUser(data).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 1000);
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/user']);
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
        }
      )
    }else{
      this.userService.addUser(data).subscribe(
        data => {
          this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 1000);
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/user']);
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
        }
      )
    }
  }

  fileChangedAttach(e: any) {
    console.log(e.target.files)
    let files = e.target.files;
    for(let i = 0; i < files.length; i++){

      const file = e.target.files[i];
      if (file) {
        // giới hạn file upload lên là 5mb
        if (e.target.files[0].size <= 50000000) {
          const file_name = file.name;
          const extension = file.name.split('.').pop();
          this.handleUpload(e);
          // this.datas.file_name_attach = file_name;
          //this.datas.file_name_attach = this.datas.file_name_attach + "," + file_name;
          // this.datas.attachFile = file;
          //this.datas.attachFile = e.target.files;
          console.log(this.datas.attachFile);
        } else {
          this.datas.file_name_attach = '';
          this.datas.attachFile = '';
          alert('Yêu cầu file nhỏ hơn 50MB');
          break;
        }
      }
    }
  }
  imgSignPCSelect: string;
  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.imgSignPCSelect = reader.result? reader.result.toString() : '';
    };
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }
}
