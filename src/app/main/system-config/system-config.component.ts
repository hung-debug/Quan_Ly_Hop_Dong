import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { SystemConfigService } from 'src/app/service/system-config.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';

@Component({
  selector: 'system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.scss']
})

export class SystemConfigComponent implements OnInit {
// apiListFormArray: any;
  constructor(
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    public dialog: MatDialog,
    public translate: TranslateService,
    private systemConfigService: SystemConfigService,
    private fbd: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,

  ) {
    this.addForm = this.fbd.group({
      api: this.fbd.control("", [Validators.required]),
      url: this.fbd.control("", [Validators.required]),
      apikey: this.fbd.control("", [
        // Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^[a-zA-Z0-9\S]+$/) // Chỉ chấp nhận ký tự không dấu và không khoảng trắng
      ]),
      body: this.fbd.control(""),
      // method: 'POST',
      orgId: this.fbd.control(""),
      apiListFormArray: this.fbd.array([])
    });
  }

  lang: any;
  apiList: any[] = [];
  api: any = "";
  body: any;
  checkStatus: any;
  checkRole: any;
  // formsArray: any[] = [{
  //   api: this.fbd.control("", [Validators.required]),
  //   url: this.fbd.control("", [Validators.required]),
  //   apikey: this.fbd.control("", [Validators.required]),
  //   body: this.fbd.control(""),
  //   // method: 'POST',
  //   orgId: this.fbd.control("", [Validators.required]),
  //   // apiListFormArray: this.fbd.array([])
  // }];
  
  isRoleWebHook: boolean = false;
  addForm: FormGroup;
  submitted = false;
  id: any
  get f() { return this.addForm.controls; }

  async ngOnInit(): Promise<void> {
    
    if (sessionStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if (sessionStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }
    this.appService.setTitle("menu.config");
    this.appService.setSubTitle("system.config");
    
    let userId = this.userService.getAuthCurrentUser().id;
    const infoUser = await this.userService.getUserById(userId).toPromise();
    this.checkRole = infoUser.organization.parent_id;
    const inforRole = await this.roleService.getRoleById(infoUser.role_id).toPromise();
    const listRole = inforRole.permissions;
    
    this.isRoleWebHook = listRole.some((element: any) => element.code == 'CAUHINH_HETHONG');
    this.getListApiWebHook();
    
    //parentid null là thằng cha còn có giá trị là thằng con
  }

  // addNewForm() {
  //   // this.formsArray.push(this.formsArray); // Thêm một form mới vào mảng
  //   // console.log("this.formsArray.length2", this.formsArray);

  //   // const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;

  //   // console.log("apiListFormArray", apiListFormArray);

  //   // Thêm form group vào FormArray
  //   const apiFormGroup = this.fbd.group({
  //     api: ["", Validators.required],
  //     url: ["", Validators.required],
  //     apikey: ["", Validators.required],
  //     body: [""],
  //     orgId: ["", Validators.required]
  //   });
  
  //   (this.addForm.get('apiListFormArray') as FormArray).push(apiFormGroup);
  //   console.log("this.addForm",this.addForm);
    
  //   // console.log("this.formsArray", this.formsArray);
  //   // });

  // }

  async getListApiWebHook() {
    await this.systemConfigService.getlistApiWebHook().toPromise().then(response => {
      // console.log("res", response);
      let arrApiList : any[] = response[0];
      this.apiList.push(response[0]);
      // console.log("this.apiList",this.apiList);
      
      this.apiList = this.apiList.map((item: any) => ({
        id: item.id,
        type: item.type,
        body: item.body,
        apikey: item.apikey,
        url: item.url,
        orgId: item.orgId
      }));

      this.populateFormArray();
    });
  }

  populateFormArray() {
    // Lấy FormArray từ addForm
    const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;

    // Duyệt qua apiList và thêm từng phần tử vào FormArray
    this.apiList.forEach(item => {
      const apiFormGroup = this.fbd.group({
        id: [item.id],
        type: [item.type, Validators.required],
        body: [item.body],
        apikey: this.fbd.control("", [
          // Validators.required,
          Validators.maxLength(32),
          Validators.pattern(/^[a-zA-Z0-9\S]+$/) // Chỉ chấp nhận ký tự không dấu và không khoảng trắng
        ]),
        url: [item.url, Validators.required],
        orgId: [item.orgId]
      });

      // Thêm form group vào FormArray
      apiListFormArray.push(apiFormGroup);
      // console.log("apiFormGroup",apiFormGroup);
    });
  }
  
  get apiListFormArray(): FormArray {
    return this.addForm.get('apiListFormArray') as FormArray;
  }
  
  checkStatusApiWebHook(){
    let cleanStringBody = this.addForm.value.body.replace(/\\{2}/g, '\\').replace(/^"+|"+$/g, '');
    console.log("cleanStringBody",cleanStringBody);

    const dataApi = {
      id: this.addForm.value.api.id,
      type: this.addForm.value.api.type,
      body: JSON.parse(cleanStringBody),
      apikey: this.addForm.value.apikey,
      url: this.addForm.value.url,
      orgId: this.addForm.value.api.orgId
    }
    // console.log("dataApi", dataApi);
    
    this.systemConfigService.checkStatusWebHook(dataApi).subscribe(
      async (data) => {
        if(data.success === true){
          this.checkStatus = "Thành công"
        }
      }, error => {
        this.checkStatus = "Thất bại"
        this.spinner.hide();
      }
    )
  }


  onApiChange(event: any): void {
    console.log("event", event);

    // const selectedApiId = event.value; // Lấy ID của API được chọn từ sự kiện onChange
    
    // const selectedApi = this.apiList.find(item => item.id === selectedApiId);
    // if (selectedApi) {
    //   // Cập nhật `FormGroup` cụ thể dựa trên chỉ số `index`
    //   const formGroup = (this.addForm.get('apiListFormArray') as FormArray).at(index) as FormGroup;
    //   formGroup.patchValue({
    //     body: selectedApi.body ? JSON.stringify(selectedApi.body, null, 2) : '',
    //     apikey: selectedApi.apikey,
    //     url: selectedApi.url
    //   });
    // }
    const selectedApiId = event.value.id; // Lấy ID của API được chọn từ sự kiện onChange
    // console.log("selectedApiType",selectedApiId);
    const selectedResponse = this.apiList.find(item => item.id === selectedApiId);
    // console.log("selectedResponse",selectedResponse);
    if (selectedResponse) {
      // Cập nhật body với giá trị body của API được chọn
      this.body = selectedResponse.body ? JSON.stringify(selectedResponse.body, null, 2) : '';
      this.addForm.patchValue({
        body: this.body,
        apikey: selectedResponse.apikey,
        url: selectedResponse.url
      });
    } else {
      // Trường hợp không tìm thấy API phù hợp, reset body về trống
      this.body = '';
      this.addForm.patchValue({
        body: '',
        apikey:'',
        url:''
      });
    }
    // this.id = selectedResponse.id
    // idApi = this.id
    // console.log("selectedResponse", selectedResponse);
    // console.log("selectedResponse 1", this.addForm);
    // if (selectedResponse) {
    //   // Cập nhật body với giá trị body của API được chọn
    //   this.body = selectedResponse.body ? JSON.stringify(selectedResponse.body, null, 2) : '';
    //   console.log("body",this.body);
      
    //   this.addForm.value.apiListFormArray.map((x: any) => {
    //     console.log("x", x);
    //   console.log("id",this.id);
    //   console.log("selectedApiType", selectedApiId);
    //   // console.log("selectedApiId == id",selectedApiId === idApi);
    //     // if (x.id === idApi) {
    //       console.log("a");

          
    //       this.addForm.patchValue({
    //         body: this.body,
    //         apikey: selectedResponse.apikey,
    //         url: selectedResponse.url
    //       });
    //     // }else{
    //       console.log("a1");
    //       this.addForm.patchValue({
    //         body: '',
    //         apikey:'',
    //         url:''
    //       });
    //     // }

    //   })

    //   // this.addForm.patchValue({
    //   //   body: this.body,
    //   //   apikey: selectedResponse.apikey,
    //   //   url: selectedResponse.url
    //   // });
    // } else {
    //   // Trường hợp không tìm thấy API phù hợp, reset body về trống
    //   this.body = '';
    //   this.addForm.patchValue({
    //     body: ''
    //   });
    // }
  }

  validateApiKey(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    const value = inputElement.value;
  
    // Chặn ký tự không hợp lệ (dấu hoặc khoảng trắng)
    // const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Loại bỏ ký tự không hợp lệ
    // if (value !== sanitizedValue) {
    //   inputElement.value = sanitizedValue; // Cập nhật giá trị
    // }
  
    // Kiểm tra độ dài
    // if (sanitizedValue.length > 32) {
    //   inputElement.value = sanitizedValue.slice(0, 32); // Giới hạn tối đa 32 ký tự
    // }
  
    // Cập nhật giá trị trong FormControl
    this.addForm.get("apikey")?.setValue(inputElement.value);
    // this.addForm.get("apikey")?.updateValueAndValidity();
    // const apiKeyControl = this.addForm.get('apikey');
    // if (apiKeyControl?.value === '') {
    //   console.log('API Key đang trống!');
    // }
  }
  
  // Hàm liệt kê lỗi của form
  getFormValidationErrors(formGroup: FormGroup = this.addForm): any[] {
    const errors: any[] = [];
  
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        // Nếu control là FormGroup, đệ quy kiểm tra bên trong
        errors.push(...this.getFormValidationErrors(control));
      } else if (control instanceof FormArray) {
        // Nếu control là FormArray, kiểm tra từng phần tử trong mảng
        control.controls.forEach((arrayControl, index) => {
          if (arrayControl instanceof FormGroup) {
            errors.push(...this.getFormValidationErrors(arrayControl));
          } else if (arrayControl.errors) {
            errors.push({ field: `${key}[${index}]`, errors: arrayControl.errors });
          }
        });
      } else if (control && control.errors) {
        errors.push({ field: key, errors: control.errors });
      }
    });
  
    return errors;
  }
  
  
  async onSubmit() {
    this.submitted = true;
    let cleanStringBody = this.addForm.value.body.replace(/\\{2}/g, '\\').replace(/^"+|"+$/g, '');
    
    const dataApi = {
      id: this.addForm.value.api.id,
      type: this.addForm.value.api.type,
      body: JSON.parse(cleanStringBody),
      apikey: this.addForm.value.apikey,
      url: this.addForm.value.url,
      orgId: this.addForm.value.api.orgId
    }
    // stop here if form is invalid
    if (this.addForm.invalid) {
      this.toastService.showErrorHTMLWithTimeout('Kết nối API thất bại ', "", 3000);
      return;
    }

    if(dataApi.id){
      this.systemConfigService.checkStatusWebHook(dataApi).subscribe(
        async (data) => {
          if(data.success === true){
            this.checkStatus = "Thành công";
            this.systemConfigService.getUpdateApiWebHook(dataApi).subscribe(
              async (data) => {
                this.toastService.showSuccessHTMLWithTimeout('Cập nhật cấu hình webhook tổ chức thành công!', "", 3000);
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Lỗi cập nhật cấu hình webhook tổ chức', "", 3000);
                this.spinner.hide();
              }
            )
          }

        }, error => {
          this.checkStatus = "Thất bại"
          this.toastService.showErrorHTMLWithTimeout('Kết nối API thất bại', "", 3000);
          this.spinner.hide();
        }
      )

    }else{
      this.systemConfigService.getAddApIWebHook(dataApi).subscribe(
        async (data) => {
          this.toastService.showSuccessHTMLWithTimeout('Thêm mới cấu hình webhook tổ chức thành công!', "", 3000);
          
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Lỗi thêm mới cấu hình webhook tổ chức', "", 3000);
          this.spinner.hide();
        }
      )
    }


  }
}