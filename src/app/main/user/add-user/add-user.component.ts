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

  // addForm: FormGroup;
  // datas: any;
  // constructor(
  //   @Inject(MAT_DIALOG_DATA) public data: any,
  //   private fbd: FormBuilder,
  //   private userService : UserService,
  //   private toastService : ToastService,
  //   public dialogRef: MatDialogRef<AddUserComponent>,
  //   public router: Router,
  //   public dialog: MatDialog,) { }

  // // options sample with default values
  // options: DatepickerOptions = {
  //   minYear: getYear(new Date()) - 30, // minimum available and selectable year
  //   maxYear: getYear(new Date()) + 30, // maximum available and selectable year
  //   placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
  //   format: 'dd/MM/yyyy', // date format to display in input
  //   formatTitle: 'MM/yyyy',
  //   formatDays: 'EEEEE',
  //   firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
  //   locale: locale, // date-fns locale
  //   position: 'bottom',
  //   inputClass: '', // custom input CSS class to be applied
  //   calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
  //   scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
  //   // keyboardEvents: true // enable keyboard events
  // };

  // ngOnInit(): void {
  //   this.datas = this.data;
  //   this.addForm = this.fbd.group({
  //     name: this.fbd.control("", [Validators.required]),
  //     email: this.fbd.control("", [Validators.required]),
  //     phone: this.fbd.control("", [Validators.required]),
  //     organizationId: null,
  //     birthday: null,
  //     role: null,
  //     status: 1,
  //   });
  // }

  // onSubmit() {
  //   const data = {
  //     name: this.addForm.value.name,
  //     email: this.addForm.value.email,
  //     phone: this.addForm.value.phone,
  //     organizationId: this.addForm.value.organizationId,
  //     birthday: this.addForm.value.birthday,
  //     role: this.addForm.value.role,
  //     status: this.addForm.value.status,
  //   }
  //   this.userService.addUser(data).subscribe(
  //     data => {
  //       this.toastService.showSuccessHTMLWithTimeout('Thêm mới người dùng thành công!', "", 1000);
  //       this.dialogRef.close();
  //       this.router.navigate(['/main/unit']);
  //     }, error => {
  //       this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
  //     }
  //   )
  // }
  user:any;
  name:any;
  email:any;
  phone:any;
  birthday:any;
  organization_name:any;

  phoneKpi:any;
  networkKpi:any;

  nameHsm:any;

  action: string;
  private sub: any;

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
        email: this.fbd.control("", [Validators.required]),
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
          email: this.fbd.control("", [Validators.required]),
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

        this.unitService.getUnitById(id).subscribe(
          data => {
            this.addForm = this.fbd.group({
              name: this.fbd.control(data.name, [Validators.required]),
              short_name: this.fbd.control(data.short_name, [Validators.required]),
              code: this.fbd.control(data.code, [Validators.required]),
              email: this.fbd.control(data.email, [Validators.required]),
              phone: this.fbd.control(data.phone, [Validators.required]),
              fax: this.fbd.control(data.fax),
              status: this.fbd.control(data.status),
              parent_id: this.fbd.control(data.parent_id),
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
    const data = {
      id: "",
      name: this.addForm.value.nameOrg,
      short_name: this.addForm.value.short_name,
      code: this.addForm.value.code,
      email: this.addForm.value.email,
      phone: this.addForm.value.phone,
      fax: this.addForm.value.fax,
      status: this.addForm.value.status,
      parent_id: this.addForm.value.parent_id,
    }
  //   console.log(data);
  //   if(this.data.id !=null){
  //     data.id = this.data.id;
  //     this.unitService.updateUnit(data).subscribe(
  //       data => {
  //         this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 1000);
  //         this.dialogRef.close();
  //         this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //           this.router.navigate(['/main/unit']);
  //         });
  //       }, error => {
  //         this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
  //       }
  //     )
  //   }else{
  //     this.unitService.addUnit(data).subscribe(
  //       data => {
  //         this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 1000);
  //         this.dialogRef.close();
  //         this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //           this.router.navigate(['/main/unit']);
  //         });
  //       }, error => {
  //         this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
  //       }
  //     )
  //   }
  }
}
