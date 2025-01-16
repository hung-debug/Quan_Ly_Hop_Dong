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
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';
import { ChangeDetectorRef } from '@angular/core';;
import { DeleteConfigDialogComponent } from './delete-config-dialog/delete-config-dialog.component';
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
    private cdr: ChangeDetectorRef

  ) {
    this.addForm = this.fbd.group({
      api: this.fbd.control("", [Validators.required]),
      url: this.fbd.control("", [Validators.required]),
      apikey: this.fbd.control("", [
        this.apiKeyExactValidator()
      ]),
      body: this.fbd.control(""),
      orgId: this.fbd.control(""),
      checkStatus: [''],
      apiListFormArray: this.fbd.array([this.createFormGroup()])
    });
  }
  createFormGroup(): FormGroup {
    return this.fbd.group({
      api: this.fbd.control("", [Validators.required]),
      url: this.fbd.control("", [Validators.required]),
      apikey: this.fbd.control("", [this.apiKeyExactValidator()]),
      body: this.fbd.control(""),
      orgId: this.fbd.control(""),
      checkStatus: ['']
    });
  }
  lang: any;
  apiList: any[] = [];
  api: any = "";
  body: any;
  checkStatus: any;
  checkRole: any;
  idApi: any;
  
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
    await this.getListApiWebHook();
    if(this.addForm.value.apiListFormArray.length == 0){
      const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;
      apiListFormArray.push(this.createFormGroup());
    }
    
  }
  
  apiKeyExactValidator(): ValidatorFn {
    const uuidRegex = /^[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const isValid = uuidRegex.test(value);
      if (!isValid) {
        return { pattern: true }; // Lỗi không đúng định dạng UUID
      }
      if (value.length !== 36) {
        return { length: true }; // Lỗi không đủ 36 ký tự
      }
      if (/\s/.test(value)) {
        return { whitespace: true }; // Lỗi có khoảng trắng
      }
      return null; // Hợp lệ
    };
  }
  removeForm(index: number) {
    (this.addForm.get('apiListFormArray') as FormArray).removeAt(index);
  }
  
  addNewForm() {
    const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;
    apiListFormArray.push(this.createFormGroup());
    // console.log("apiListFormArray111111111",apiListFormArray);
    
    // console.log("apiListFormArraylength",apiListFormArray.length);

  }
  selectedLabels: string[] = [];
  async getListApiWebHook() {
    try {
      let getlistApiWebHook =  await this.systemConfigService.getlistApiWebHook().toPromise();
      // console.log("getlistApiWebHook",getlistApiWebHook);
      
      // this.apiList.push(getlistApiWebHook[0]);
      this.apiList = getlistApiWebHook;
      // console.log("this.apiList",this.apiList);
      
      this.apiList = this.apiList.map((item: any) => ({
        id: item.id,
        label: item.type, // Hiển thị tên API trong dropdown
        value: { id: item.id, type: item.type }, // Dữ liệu được chọn khi chọn API
        body: item.body,
        apikey: item.apikey,
        url: item.url,
        orgId: item.orgId,
        checkStatus:"",
        // disabled: !!item.id,
        ...item,
      }));
      
      let sampleWebHook = await this.systemConfigService.getSampleApiWebHook().toPromise();
      // console.log("sampleWebHook",sampleWebHook);
      const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;
      const formArray = this.addForm.get('apiListFormArray') as FormArray;
      // console.log("formArray",formArray);
      // console.log("22222222222222222",apiListFormArray);

      apiListFormArray.clear();
      if(this.apiList.length && (this.apiList[0]?.id || this.apiList[1]?.id)) {
        const formArray = this.addForm.get('apiListFormArray') as FormArray;
        console.log("a",formArray);
      
        this.apiList.forEach(async (api) => {
          // console.log("api", api);
  
          const formGroup = this.fbd.group({
            api: [api ? api : '', Validators.required],
            apikey: [api ? api.apikey : '', [this.apiKeyExactValidator()]],
            body: [api.body ? JSON.stringify(api.body, null, 2) : '', Validators.required],
            url: [api ? api.url : '', Validators.required],
            orgId: [api ? api.orgId : ''],
            checkStatus: '',
            // disabled: !!api.id,
          });
          if(api.id){
            apiListFormArray.push(formGroup);
            formGroup.patchValue({
              // Đảm bảo rằng giá trị được cập nhật đúng vào formGroup
              apikey: api.apikey,
              body: JSON.stringify(api.body, null, 2),
              url: api.url,
              orgId: api.orgId,
              // disabled: !!api.id,
            });
            let getlistApiWebHook = await this.systemConfigService.getlistApiWebHook().toPromise();
            // console.log("getlistApiWebHook", getlistApiWebHook);
          }
          
        });

        // console.log("apiListFormArray",apiListFormArray);

      } else if(this.apiList[0]?.id === null || this.apiList[1]?.id === null){
        // console.log("b");
        // this.addForm.patchValue({
        //   api: sampleWebHook[0]?.typeName,
        //   body: sampleWebHook[0]?.body ? JSON.stringify(sampleWebHook[0]?.body, null, 2) : '',
        // });
        
        // sampleWebHook.forEach(sampleApi =>{
        //   if(sampleApi?.typeName === 'GET_CONTRACT_STATUS'){
        //     const formGroup = this.fbd.group({
        //       api: [sampleApi?.typeName, Validators.required],
        //       body: [sampleApi?.body ? JSON.stringify(sampleWebHook[0]?.body, null, 2) : ''],
        //     });
        //     apiListFormArray.push(formGroup); // Thêm form từ sample
        //   } else if(sampleApi?.typeName === 'GET_RECIPIENT_STATUS'){
        //     const formGroup = this.fbd.group({
        //       api: [sampleApi?.typeName, Validators.required],
        //       body: [sampleApi?.body ? JSON.stringify(sampleWebHook[1]?.body, null, 2) : ''],
        //     });
        //     apiListFormArray.push(formGroup); // Thêm form từ sample
        //   }
        // })

      }

      this.populateFormArray();
    } catch (error) {
      console.log("error", error)
    }
  }
  
  getFilteredOptions(index: number): any[] {
    const formArray = this.addForm.get('apiListFormArray') as FormArray;
    const selectedValues = formArray.controls.map((control, i) => {
      // Lấy giá trị đã chọn từ các form khác
      return i !== index ? control.value.api?.label : null;
    }).filter(label => label); // Lọc giá trị không hợp lệ
  
    // Lọc bỏ các giá trị đã chọn
    return this.apiList.filter(option => !selectedValues.includes(option.label));
  }

  populateFormArray() {

  }
  
  get apiListFormArray(): FormArray {
    return this.addForm.get('apiListFormArray') as FormArray;
  }
  getFormGroup(index: number): FormGroup {
    return this.apiListFormArray.at(index) as FormGroup;
  }
  isFieldInvalid(index: number, field: string): any {
    const formGroup = this.getFormGroup(index);
    const control = formGroup.get(field);
    return control?.invalid && (control.dirty || control.touched || this.submitted);
  }
  
  async checkStatusApiWebHook(i: number){
    const formArray = this.addForm.get('apiListFormArray') as FormArray;
    // let sampleWebHook = await this.systemConfigService.getSampleApiWebHook().toPromise(); // get giá trị mẫu của form
    // console.log("sampleWebHook",sampleWebHook);
    // Lấy form group tại chỉ số i
    const formGroup = formArray.at(i) as FormGroup;
    // console.log("formGroup", formGroup);
    const listApi = formGroup.value;
    // this.addForm.value.apiListFormArray.forEach((listApi: any) =>{
    // console.log("listApi",listApi);
    let cleanStringBody = JSON.stringify(listApi?.api?.body).replace(/\\{2}/g, '\\').replace(/^"+|"+$/g, '');

    let body = listApi.api.id ? JSON.parse(cleanStringBody) : JSON.parse(listApi.body);
    
    const dataApi = {
      id: listApi.api.id,
      type: listApi.api.label,
      // body: JSON.parse(cleanStringBody),
      body: body,
      apikey: listApi.apikey,
      url: listApi.url,
      orgId: listApi.api.orgId
    }
    // console.log("dataApi",dataApi);
    if(dataApi.url){
      this.systemConfigService.checkStatusWebHook(dataApi).subscribe(
        async (data) => {
          if(data.success === true){
            // this.checkStatus = "Thành công";
            formGroup.get('checkStatus')?.setValue('Thành công');
            // this.checkStatus = formGroup.value.checkStatus;
            // this.getListApiWebHook();
            this.spinner.hide();
          }
        }, error => {
          // this.checkStatus = "Thất bại";
          // console.log("ttttt11111')",formGroup.get('checkStatus' + i));
          // this.checkStatus = formGroup.value.checkStatus;
          formGroup.get('checkStatus')?.setValue('Thất bại');
          this.spinner.hide();
        }
      )
    }else{
      // console.log("2222222222222')",formGroup.get('checkStatus' + i));
      // this.checkStatus = "Thất bại";
      formGroup.get('checkStatus')?.setValue('Thất bại');
    }
  }
  
  selectedApiWebId: number | null = null;
  async onApiChange(event: any, index: any): Promise<void> {
    try {
      let sampleWebHook = await this.systemConfigService.getSampleApiWebHook().toPromise(); // get giá trị mẫu của form
      // console.log("sampleWebHook",sampleWebHook);
      
      // console.log("this.addFor",this.addForm.value);
      // Kiểm tra giá trị được chọn
      const selectedApi = event.value;
      // console.log("Selected API:", selectedApi);
      this.selectedApiWebId = selectedApi.id;
      // Tìm đối tượng trong apiList
      const selectedResponse = this.apiList.find(item => item.id === selectedApi.id);
      this.idApi = selectedResponse.id;
      this.body = selectedResponse.body;
      // console.log("selectedResponse",selectedResponse);
      let selectedSample = sampleWebHook.find(item => item.typeName == selectedApi.label);
      const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;
      
      const selectedLabel = event.value.label;
      // Thêm giá trị vào danh sách đã chọn nếu không tồn tại
      if (!this.selectedLabels.includes(selectedLabel)) {
        this.selectedLabels.push(selectedLabel);
      }
      
      if (selectedResponse.id) {
        const formGroup = apiListFormArray.at(index) as FormGroup;
        
        const formattedString = JSON.stringify(selectedResponse.body).replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
        const jsonObject = JSON.parse(formattedString);
        formGroup.patchValue({
          label: selectedResponse.api || '',
          url: selectedResponse.url || '',
          apikey: selectedResponse.apikey || '',
          body: selectedResponse.body ? JSON.stringify(jsonObject, null, 2) : '',
          orgId: selectedResponse.orgId || '',
          // disabled: !!selectedResponse.id,
        });
        

        // console.log("this.apiListthis.apiList",this.apiList);
        
        // console.log("Updated FormArray Values:", apiListFormArray.value);
        // console.log("this.addFormmmmm",this.addForm.value);
        // console.log("formGroup",formGroup);
      } else if (selectedApi?.id === null) {
        const formattedString = JSON.stringify(selectedSample?.body).replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
        const jsonObject = JSON.parse(formattedString);
        const formGroup = apiListFormArray.at(index) as FormGroup;
        const sampleBody = selectedSample?.body 
          ? JSON.stringify(jsonObject, null, 2) 
          : '';
          
        formGroup.patchValue({
          body: sampleBody,
        })
      }else {
        this.addForm.patchValue({
          body: '',
          apikey: '',
          url: ''
        });
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Error in onApiChange:", error);
    }
  }
  // async onApiChange(event: any): Promise<void> {
  //   console.log("event", event);

  //   // const selectedApiId = event.value; // Lấy ID của API được chọn từ sự kiện onChange
    
  //   // const selectedApi = this.apiList.find(item => item.id === selectedApiId);
  //   // if (selectedApi) {
  //   //   // Cập nhật `FormGroup` cụ thể dựa trên chỉ số `index`
  //   //   const formGroup = (this.addForm.get('apiListFormArray') as FormArray).at(index) as FormGroup;
  //   //   formGroup.patchValue({
  //   //     body: selectedApi.body ? JSON.stringify(selectedApi.body, null, 2) : '',
  //   //     apikey: selectedApi.apikey,
  //   //     url: selectedApi.url
  //   //   });
  //   // }
    
  //   // Lấy dữ liệu body sample api
  //   let sampleWebHook = await this.systemConfigService.getSampleApiWebHook().toPromise();
  //   console.log("apiListFormArray",this.apiListFormArray);
    
  //   const selectedApiId = event.value.id; // Lấy ID của API được chọn từ sự kiện onChange
  //   console.log("selectedApiType",selectedApiId);
  //   const selectedResponse = this.apiList.find(item => item.id === selectedApiId);
  //   console.log("selectedResponse",selectedResponse);
  //   if (selectedResponse) {
  //     console.log("1");
      
  //     // Cập nhật body với giá trị body của API mẫu với id null
  //     if(selectedApiId === null){
  //       console.log("ab");
  //       this.body = sampleWebHook[0]?.body ? JSON.stringify(sampleWebHook[0]?.body, null, 2) : '';
  //       this.addForm.patchValue({
  //         body: this.body,
  //       });
  //     }else{
  //       console.log("bc");
  //       console.log("selectedResponse",selectedResponse);
  //       this.body = selectedResponse.body ? JSON.stringify(selectedResponse.body, null, 2) : '';
  //       console.log("this.body",this.body);
  //       console.log("this.addForm",this.addForm);
        
  //       this.addForm.patchValue({
  //         body: this.body,
  //         apikey: selectedResponse.apikey,
  //         url: selectedResponse.url
  //       });
  //       console.log("this.addForm1",this.addForm);
        
  //     }
  //   } else {
  //     console.log("2");
  //     // Trường hợp không tìm thấy API phù hợp, reset body về trống
  //     this.body = '';
  //     this.addForm.patchValue({
  //       body: '',
  //       apikey:'',
  //       url:''
  //     });
  //   }


  //   // this.id = selectedResponse.id
  //   // let idApi = this.id
  //   // console.log("selectedResponse", selectedResponse);
  //   // console.log("selectedResponse 1", this.addForm);
  //   // if (selectedResponse) {
  //   //   // Cập nhật body với giá trị body của API được chọn
  //   //   this.body = selectedResponse.body ? JSON.stringify(selectedResponse.body, null, 2) : '';
  //   //   console.log("body",this.body);
      
  //   //   this.addForm.value.apiListFormArray.map((x: any) => {
  //   //     console.log("x", x);
  //   //   console.log("id",this.id);
  //   //   console.log("selectedApiType", selectedApiId);
  //   //   // console.log("selectedApiId == id",selectedApiId === idApi);
  //   //     if (x.api.id === idApi) {
  //   //       console.log("a");
  //   //       this.addForm.patchValue({
  //   //         body: this.body,
  //   //         apikey: selectedResponse.apikey,
  //   //         url: selectedResponse.url
  //   //       });
  //   //     }else{
  //   //       console.log("a1");
  //   //       this.addForm.patchValue({
  //   //         body: '',
  //   //         apikey:'',
  //   //         url:''
  //   //       });
  //   //     }

  //   //   })

  //   //   // this.addForm.patchValue({
  //   //   //   body: this.body,
  //   //   //   apikey: selectedResponse.apikey,
  //   //   //   url: selectedResponse.url
  //   //   // });
  //   // } else {
  //   //   // Trường hợp không tìm thấy API phù hợp, reset body về trống
  //   //   this.body = '1';
  //   //   this.addForm.patchValue({
  //   //     body: '2'
  //   //   });
  //   // }
  // }

  validateApiKey(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    const value = inputElement.value;
    // Cập nhật giá trị trong FormControl
    this.addForm.get("apikey")?.setValue(inputElement.value);
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
    const dataApiArray: any[] = [];
    // let cleanStringBody = this.addForm.value.body.replace(/\\{2}/g, '\\').replace(/^"+|"+$/g, '');
      // Kiểm tra toàn bộ danh sách trong apiListFormArray trước
      // console.log("this.addForm.value.apiListFormArray",this.addForm.value.apiListFormArray);
    const invalidApi = this.addForm.value.apiListFormArray.some((listApi: any) => {
      // console.log("listApi",listApi);
      
      return listApi.apikey === '';
    });
    // if (invalidApi) {
    //   console.log("invalidApi",invalidApi);
    //   console.log("this.addForm.invalid",this.addForm.invalid);
    //   // console.log("listApi.apikey",listApi.apikey);
      
    //   this.toastService.showErrorHTMLWithTimeout('Kết nối API thất bại', "", 3000);
    //   return;
    // }
    // console.log("listApi1", listApi);
    const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;
    // console.log("apiListFormArray", apiListFormArray)
    let successCount = 0; // Đếm số lượng API lưu thành công
    const totalCount = apiListFormArray.controls.length; // Tổng số API
    // console.log("apiListFormArray11111",apiListFormArray);
    // console.log("totalCount",totalCount);
    
    // apiListFormArray.controls.forEach(async(formGroup: any) => {
    for (const formGroup of apiListFormArray.controls){
      console.log("formGroup ttttt", formGroup)
      const listApi = formGroup.value;
      //console.log("listApi",listApi);
      //console.log("this.addForm.value.apiListFormArray",this.addForm.value.apiListFormArray);
      
      if (!listApi.apikey || !listApi.url || !listApi.body) {
        // formGroup.markAsTouched();
        formGroup.get('checkStatus')?.setValue('Thất bại'); // Đánh dấu trạng thái thất bại
        continue;
      }
      
      let cleanStringBody = JSON.stringify(listApi.api.body).replace(/\\{2}/g, '\\').replace(/^"+|"+$/g, '');
      // console.log("cleanStringBody",cleanStringBody);
      let body = listApi.api.id ? JSON.parse(cleanStringBody) : JSON.parse(listApi.body);
      const dataApi = {
        id: listApi.api?.id,
        type: listApi.api.label,
        // body: JSON.parse(cleanStringBody),
        body: body,
        apikey: listApi.apikey,
        url: listApi.url,
        orgId: listApi.api.orgId
      }
      //console.log("dataApi",dataApi);
      
      // dataApiArray.push(dataApi);
      // console.log("dataApiArray",dataApiArray);

      this.spinner.show();

      try {
        // Nếu có `id`, gọi API cập nhật
        if (dataApi.id) {
          const data = await this.systemConfigService.checkStatusWebHook(dataApi).toPromise();
  
          if (data.success) {
            formGroup.get('checkStatus')?.setValue('Thành công');
            successCount++;
            // Cập nhật cấu hình webhook nếu API thành công
            await this.systemConfigService.getUpdateApiWebHook(dataApi).toPromise();
          } else {
            formGroup.get('checkStatus')?.setValue('Thất bại');
          }
        } else {
          // Nếu không có `id`, gọi API thêm mới
          let addedApi = await this.systemConfigService.getAddApIWebHook(dataApi).toPromise();
          // formGroup.get('checkStatus')?.setValue('Thành công');
          // successCount++;
          // console.log("formGroup",formGroup);
          // console.log("formGroup.get('api')",formGroup.get('api'));
          // console.log("addedApi",addedApi);
          let stringBody = JSON.stringify(addedApi.body).replace(/\\{2}/g, '\\').replace(/^"+|"+$/g, '');
          // console.log("stringBody",stringBody);
          const parsedBody = JSON.parse(stringBody);
          const formattedBody = JSON.stringify(parsedBody, null, 2);
          let bodyApi = JSON.parse(stringBody)
          // console.log("bodyApi",bodyApi);
          // if (addedApi && addedApi.id) {
            // formGroup.value.patchValue({
            //   // api: {
            //     // ...listApi.api,
            //     // id: addedApi.id,
            //   // },
            //   id: addedApi.id, // Cập nhật `id` mới từ server
            //   url: addedApi.url,
            //   apikey: addedApi.apikey,
            //   // body: JSON.parse(addedApi.body),
            //   body: formattedBody
            // });
            formGroup.value.api.id = addedApi.id;
            formGroup.value.api.body = addedApi.body;
            formGroup.value.api.url = addedApi.url;
            formGroup.value.api.apikey = addedApi.apikey;
            // if(formGroup.value.api.id){
            //   formGroup.value.api.disabled = true;
            // }
            console.log("formGroup 111111", formGroup)
            // console.log("addedApi.id", addedApi.id)
          //   //apiListFormArray.push(data)
            
          //   console.log("formGroup",formGroup);
            
          //   // let updateApi = await this.systemConfigService.getUpdateApiWebHook(addedApi).toPromise();
          //   // console.log("updateApi",updateApi);
          //   // dataApi.id = updateApi.id;
          //   // console.log("dataApi456",dataApi);
            formGroup.get('checkStatus')?.setValue('Thành công');
            successCount++;
          //   console.log("apiListFormArrayapiListFormArray",apiListFormArray)
          // } else {
          //   formGroup.get('checkStatus')?.setValue('Thất bại');
          // }
        }
      } catch (error) {
        console.log("error",error); 
        formGroup.get('checkStatus')?.setValue('Thất bại');
      }
      // })
    }
    this.spinner.hide();
    if (successCount === totalCount) {
      this.toastService.showSuccessHTMLWithTimeout(
        `Lưu thành công toàn bộ ${successCount}/${totalCount} API.`,
        "",
        3000
      );
    } else if (successCount > 0) {
      this.toastService.showSuccessHTMLWithTimeout(
        `Lưu thành công ${successCount}/${totalCount} API.`,
        "",
        3000
      );
    } else {
      this.toastService.showErrorHTMLWithTimeout(
        `Không có API nào được lưu thành công (${successCount}/${totalCount}).`,
        "",
        3000
      );
    }
    // let apiKey = this.addForm.get("apikey");
    // const formsData = (this.addForm.get('apiListFormArray') as FormArray).value;
    // const dataApi = {
    //   id: this.addForm.value.api.id,
    //   type: this.addForm.value.api.type,
    //   body: JSON.parse(cleanStringBody),
    //   apikey: this.addForm.value.apikey,
    //   url: this.addForm.value.url,
    //   orgId: this.addForm.value.api.orgId
    // }
    // // stop here if form is invalid
    // if (this.addForm.invalid || apiKey?.value === '') {
    //   this.toastService.showErrorHTMLWithTimeout('Kết nối API thất bại ', "", 3000);
    //   return;
    // }
    // this.spinner.show();
    // if(dataApi.id){
    //   this.systemConfigService.checkStatusWebHook(dataApi).subscribe(
    //     async (data) => {
    //       if(data.success === true){
    //         this.checkStatus = "Thành công";
    //         this.spinner.hide();
    //         this.systemConfigService.getUpdateApiWebHook(dataApi).subscribe(
    //           async (data) => {
    //             this.toastService.showSuccessHTMLWithTimeout('Cập nhật cấu hình webhook tổ chức thành công!', "", 3000);
    //             this.spinner.hide();
    //           }, error => {
    //             this.toastService.showErrorHTMLWithTimeout('Lỗi cập nhật cấu hình webhook tổ chức', "", 3000);
    //             this.spinner.hide();
    //           }
    //         )
    //       }

    //     }, error => {
    //       this.checkStatus = "Thất bại"
    //       this.toastService.showErrorHTMLWithTimeout('Kết nối API thất bại', "", 3000);
    //       this.spinner.hide();
    //     }
    //   )

    // }else{
    //   this.systemConfigService.getAddApIWebHook(dataApi).subscribe(
    //     async (data) => {
    //       this.toastService.showSuccessHTMLWithTimeout('Thêm mới cấu hình webhook tổ chức thành công!', "", 3000);
          
    //     }, error => {
    //       this.toastService.showErrorHTMLWithTimeout('Lỗi thêm mới cấu hình webhook tổ chức', "", 3000);
    //       this.spinner.hide();
    //     }
    //   )
    // }


  }
  
  deleteConfig(i: any){
    let data: any = "";
    const formArray = this.addForm.get('apiListFormArray') as FormArray;

    // Lấy form group tại chỉ số i
    const formGroup = formArray.at(i) as FormGroup;
    const listApi = formGroup.value;
    // console.log("listApi1", listApi);
    // console.log("listApi.api",listApi.api);
    
    if (sessionStorage.getItem('lang') == 'vi' || !sessionStorage.getItem('lang')) {
      data = {
        title: 'XÁC NHẬN XÓA CẤU HÌNH',
        api_name: listApi.api.type,
      };
    } else if (sessionStorage.getItem('lang') == 'en') {
      data = {
        title: 'DELETE CONFIG CONFIRMATION',
        api_name: listApi.api.type,
      };
    }

    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteConfigDialogComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      const formArrayLength = formArray.length;
      if(result?.action === 'delete'){
        if (formArrayLength > 1) {
          if(listApi.api.id){
            // Trường hợp có nhiều form => Xóa cả dữ liệu và form
            this.systemConfigService.getDeleteApiWebHook(listApi.api.type).subscribe(
              (data) => {
                if (data.success) {
                  this.toastService.showSuccessHTMLWithTimeout("Xóa cấu hình webhook thành công!", "", 3000);
                  formArray.removeAt(i); // Xóa form khỏi FormArray
                  console.log("formGroup12",formGroup);
                  this.getListApiWebHook();
                } else {
                  this.toastService.showErrorHTMLWithTimeout("Xóa cấu hình webhook không thành công!", "", 3000);
                }
              },
              (error) => {
                this.toastService.showErrorHTMLWithTimeout("Lỗi xóa cấu hình webhook!", "", 3000);
              }
            );
          }else{
            formArray.removeAt(i);
          }
  
        } else {
          console.log("b");
          // Trường hợp chỉ còn 1 form => Chỉ xóa dữ liệu
          this.systemConfigService.getDeleteApiWebHook(listApi.api.type).subscribe(
            (data) => {
              if (data.success) {
                this.toastService.showSuccessHTMLWithTimeout("Xóa dữ liệu webhook thành công!", "", 3000);
  
                // Reset dữ liệu trong form thay vì xóa form
                // formGroup.reset({
                //   id:'',
                //   apikey: '',
                //   url: '',
                //   body: '',
                //   disabled: false
                // });
                // formGroup.value.api.id = '';
                // formGroup.value.api.body = '';
                // formGroup.value.api.url = '';
                // formGroup.value.api.apikey = '';

                // formGroup.value.body = '';
                // formGroup.value.url = '';
                // formGroup.value.apikey = '';
                // if(formGroup.value.id){
                //   formGroup.value.api.disabled = true;
                // }else{
                //   formGroup.value.api.disabled = false;
                // }
                console.log("formGroup",formGroup);
                // Reset dữ liệu trong form thay vì xóa form
                formGroup.reset({
                  id:'',
                  apikey: '',
                  url: '',
                  body: '',
                });
                // this.getListApiWebHook();
                // this.ensureAtLeastOneEmptyForm();
              } else {
                this.toastService.showErrorHTMLWithTimeout("Xóa dữ liệu webhook không thành công!", "", 3000);
              }
            },
            (error) => {
              this.toastService.showErrorHTMLWithTimeout("Lỗi xóa dữ liệu webhook!", "", 3000);
            }
          );
        }
      } else {
        console.log("avbc");
        
        return
      }

    });
  }
  
}