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
  apiListFilter: any = [];
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
  apiData: any;
  selectedApiBeforeChange: any;
  isRoleWebHook: boolean = false;
  selectedResponse: any;
  noSelectedResponse: any;
  addForm: FormGroup;
  submitted = false;
  id: any;
  submittedForms: boolean[] = [];
  
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
    const formArray = this.addForm.get('apiListFormArray') as FormArray;
    this.submittedForms = new Array(formArray.length).fill(false);
    
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
      if(!value){
        return { required: true}
      }
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
  
  isAddForm : boolean = false
  addNewForm() {
    const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;
    apiListFormArray.push(this.createFormGroup());
    this.isAddForm = true;
    this.submittedForms.push(false);
  }
  selectedLabels: string[] = [];
  async getListApiWebHook() {
    try {
      let getlistApiWebHook =  await this.systemConfigService.getlistApiWebHook().toPromise();
      this.apiList = getlistApiWebHook;
      
      this.apiList = this.apiList.map((item: any) => ({
        id: item.id,
        label: item.type, // Hiển thị tên API trong dropdown
        value: { id: item.id, type: item.type }, // Dữ liệu được chọn khi chọn API
        body: this.formatBodyIfNeeded(item.body),
        apikey: item.apikey,
        url: item.url,
        orgId: item.orgId,
        checkStatus:"",
        ...item,
      }));
      
      let sampleWebHook = await this.systemConfigService.getSampleApiWebHook().toPromise();
      const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;

      apiListFormArray.clear();
      if(this.apiList.length && (this.apiList[0]?.id || this.apiList[1]?.id)) {
      
        this.apiList.forEach(async (api) => {
  
          const formGroup = this.fbd.group({
            api: [api ? api : '', Validators.required],
            apikey: [api ? api.apikey : '', [this.apiKeyExactValidator()]],
            // body: [api.body ? JSON.stringify(api.body, null, 2) : '', Validators.required],
            body: [api.body ? JSON.stringify(this.formatBodyIfNeeded(api.body), null, 2) : '', Validators.required],
            url: [api ? api.url : '', Validators.required],
            orgId: [api ? api.orgId : ''],
            checkStatus: '',
          });
          if(api.id){
            apiListFormArray.push(formGroup);
            formGroup.patchValue({
              // Đảm bảo rằng giá trị được cập nhật đúng vào formGroup
              apikey: api.apikey,
              // body: JSON.stringify(api.body, null, 2),
              body: JSON.stringify(this.formatBodyIfNeeded(api.body), null, 2),
              url: api.url,
              orgId: api.orgId,
              checkStatus: api.checkStatus
            });
            let getlistApiWebHook = await this.systemConfigService.getlistApiWebHook().toPromise();
          }
          
        });

      } else if(this.apiList[0]?.id === null || this.apiList[1]?.id === null){

      }
    } catch (error) {
      // console.log("error", error)
    }
  }
  
  getFilteredOptions(index: number): any[] {
    if(this.apiListFilter.length) {
      this.apiList = this.apiListFilter;
    }
    const formArray = this.addForm.get('apiListFormArray') as FormArray;
    const selectedValues = formArray.controls.map((control, i) => {
      // Lấy giá trị đã chọn từ các form khác
      return i !== index ? control.value.api?.label : null;
    }).filter(label => label); // Lọc giá trị không hợp lệ
    return this.apiList.filter(option => !selectedValues.includes(option.label));
  }

  
  get apiListFormArray(): FormArray {
    return this.addForm.get('apiListFormArray') as FormArray;
  }
  getFormGroup(index: number): FormGroup {
    return this.apiListFormArray.at(index) as FormGroup;
  }
  isFieldInvalid(index: number, field: string): any {
    const formArray = this.addForm.get('apiListFormArray') as FormArray;
    const formGroup = formArray.at(index) as FormGroup;
    const control = formGroup.get(field);

    // Kiểm tra trạng thái submitted hoặc touched/dirty cho form cụ thể
    return (
      control?.invalid && 
      (control?.touched || control?.dirty || this.submittedForms[index])
    );
  }
  
  async checkStatusApiWebHook(i: number){
    const formArray = this.addForm.get('apiListFormArray') as FormArray;

    const formGroup = formArray.at(i) as FormGroup;

    const listApi = formGroup.value;

    let cleanStringBody = JSON.stringify(listApi?.api?.body).replace(/(\w+):/g, '"$1":').replace(/'/g, '"');

    let body = listApi.api.id ? JSON.parse(cleanStringBody) : JSON.parse(listApi.body);

    const dataApi = {
      id: listApi.api.id,
      type: listApi.api.label,
      body: listApi.api.label == 'GET_CONTRACT_STATUS' ? body : JSON.parse(listApi.body),
      apikey: listApi.apikey,
      url: listApi.url,
      orgId: listApi.api.orgId
    }
    if(dataApi.url){
      this.systemConfigService.checkStatusWebHook(dataApi).subscribe(
        async (data) => {
          if(data.success === true){
            formGroup.get('checkStatus')?.setValue('Thành công');
            this.spinner.hide();
          }
        }, error => {
          formGroup.get('checkStatus')?.setValue('Thất bại');
          this.spinner.hide();
        }
      )
    }else{
      formGroup.get('checkStatus')?.setValue('Thất bại');
    }
  }
  
  selectedApiWebId: number | null = null;

  onDropdownShow(i: number): void {
    // Ép kiểu AbstractControl thành FormArray
    const formArray = this.addForm.get('apiListFormArray') as FormArray;
    // Lấy giá trị của dropdown tại vị trí index i
    this.selectedApiBeforeChange = formArray?.at(i)?.get('api')?.value;
  }
  
  formatBodyIfNeeded(input: any) {
    // Kiểm tra nếu input là chuỗi thì chuyển thành object
    if (typeof input === "string") {
      try {
        input = JSON.parse(input); // Parse chuỗi JSON
      } catch (e) {
        // console.error("Input không phải JSON hợp lệ:", e);
        return null; // Trả về null nếu không hợp lệ
      }
    }
  
    // Nếu input là object và có key 'recipient' là mảng
    if (input && input.recipient && Array.isArray(input.recipient)) {
      return {
        contractId: input.contractId || null, // Giữ nguyên contractId nếu có
        recipient: input.recipient.map((item: any) => {
          // Giữ nguyên tất cả các trường của mỗi đối tượng trong recipient
          return { ...item };
        })
      };
    }
  
    // Nếu không cần format hoặc input không hợp lệ
    return input;
  }

  async onApiChange(event: any, index: any): Promise<void> {
    try {
      let sampleWebHook = await this.systemConfigService.getSampleApiWebHook().toPromise(); // get giá trị mẫu của form
      const selectedApi = event.value;

      // Debug hoặc thực hiện logic với allControls
      this.selectedApiWebId = selectedApi?.id;
      // Tìm đối tượng trong apiList
      const selectedResponse = this.apiList.find(item => item.id === selectedApi?.id);
      let noSelectedResponse = this.apiList.find(item => item.id != selectedApi?.id);

      this.apiData = selectedResponse;
      this.body = selectedResponse.body;
      let selectedSample = sampleWebHook.find(item => item.typeName == selectedApi?.label);
      const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;

      const selectedLabel = event.value.label;

      // Thêm giá trị vào danh sách đã chọn nếu không tồn tại
      if (!this.selectedLabels.includes(selectedLabel)) {
        this.selectedLabels.push(selectedLabel);
      }
      
      if (selectedResponse.id) {
        const formGroup = apiListFormArray?.at(index) as FormGroup;
        
        const formattedString = JSON.stringify(selectedResponse.body).replace(/(\w+):/g, '"$1":').replace(/'/g, '"');

        let jsonObject = JSON.parse(formattedString);

        let body = formGroup.controls.api.value.body || '';
        body = this.formatBodyIfNeeded(body);
        jsonObject = this.formatBodyIfNeeded(jsonObject);
          formGroup.patchValue({
            id: formGroup.controls.api.value.id || '',
            label: formGroup.controls.api.value.label || '',
            url: formGroup.controls.api.value.url || '',
            apikey: formGroup.controls.api.value.apikey || '',
            body: formGroup.controls.api.value.label == 'GET_CONTRACT_STATUS' ? JSON.stringify(jsonObject, null, 2) : JSON.stringify(body, null, 2),
          });
          this.cdr.detectChanges();
      } else 
      if (!selectedApi?.id) {
        
        const formattedString = JSON.stringify(selectedSample?.body)?.replace(/\\{2}/g, '\\')?.replace(/^"+|"+$/g, '');

        const jsonObject = JSON.parse(formattedString);
        const formGroup = apiListFormArray.at(index) as FormGroup;
        const sampleBody = selectedSample?.body ? JSON.stringify(jsonObject, null, 2) : '';

        formGroup.patchValue({
          body: sampleBody,
        })
        // console.log("12345",this.addForm.value.apiListFormArray.length);
        if(this.selectedApiBeforeChange.id && this.addForm.value.apiListFormArray.length == 1) {
          // console.log("this.selectedApiBeforeChange", this.selectedApiBeforeChange)
          formGroup.controls.api.value.id = this.selectedApiBeforeChange.id;
          formGroup.controls.api.value.body = sampleBody
          formGroup.controls.api.value.type = selectedResponse.type;
          formGroup.controls.api.value.apikey = this.selectedApiBeforeChange.apikey;
          formGroup.controls.api.value.url = this.selectedApiBeforeChange.url;
          // formGroup.value.api.id = this.selectedApiBeforeChange.id;
          formGroup.controls.api.value.label = selectedResponse.label;
          selectedResponse.id = this.selectedApiBeforeChange.id;
          selectedResponse.value.id = this.selectedApiBeforeChange.id;
          noSelectedResponse.id = "";
          noSelectedResponse.value.id = "";
          this.apiListFilter = [selectedResponse, noSelectedResponse];
        }

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

  validateApiKey(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    const value = inputElement.value;
    this.addForm.get("apikey")?.setValue(inputElement.value);
  }
  
  processValidForm(index: number, formGroup: FormGroup): void {
    // Xử lý form hợp lệ ở đây
    // console.log(`Đang xử lý form hợp lệ tại chỉ số ${index}:`, formGroup.value);
  
  }
  
  async onSubmit() {
    this.submitted = true;
    // Kiểm tra toàn bộ danh sách trong apiListFormArray trước
    const invalidApi = this.addForm.value.apiListFormArray.some((listApi: any) => {
      return listApi.apikey === '';
    });

    const apiListFormArray = this.addForm.get('apiListFormArray') as FormArray;

    this.submittedForms = this.addForm.value.apiListFormArray.map(() => true);
    const formArray = this.addForm.get('apiListFormArray') as FormArray;
    
      // Kiểm tra tính hợp lệ của từng form
    let hasInvalidForm = false;
    formArray.controls.forEach((control, index) => {
      this.submittedForms[index] = true;
      const formGroup = control as FormGroup;
      if (formGroup.invalid) {
        hasInvalidForm = true;
    
        // Kích hoạt trạng thái `touched` cho tất cả các control trong formGroup
        Object.keys(formGroup.controls).forEach((key) => {
          const control = formGroup.get(key);
          control?.markAsTouched(); // Đánh dấu là "touched"
          control?.updateValueAndValidity(); // Cập nhật trạng thái hợp lệ
        });
      }else {
        // Nếu form hợp lệ, xử lý logic của bạn ở đây
        this.processValidForm(index, formGroup);
      }
    });

    if (hasInvalidForm) {
      // Có ít nhất một form không hợp lệ
      this.apiKeyExactValidator()
      // return;
    }
    let successCount = 0; // Đếm số lượng API lưu thành công
    const totalCount = apiListFormArray.controls.length; // Tổng số API

    for (const formGroup of apiListFormArray.controls){
      const listApi = formGroup.value;
      if (!listApi.apikey || !listApi.url || !listApi.body) {
        formGroup.get('checkStatus')?.setValue('Thất bại'); // Đánh dấu trạng thái thất bại
        this.spinner.hide();
        // return;
      }
      let body = listApi?.api?.id ? listApi?.api?.body : JSON.parse(listApi?.body);
      let bodyData = this.formatBodyIfNeeded(body);
      const dataApi = {
        id: listApi.api?.id,
        type: listApi.api.label,
        body: listApi?.api?.label == 'GET_CONTRACT_STATUS' ? bodyData : JSON.parse(listApi?.body),
        apikey: listApi.apikey,
        url: listApi.url,
        orgId: listApi.api.orgId
      }
      this.spinner.show();

      try {
        // Nếu có `id`, gọi API cập nhật
        if (dataApi.id) {
          const data = await this.systemConfigService.checkStatusWebHook(dataApi).toPromise();
  
          if (data.success) {
            formGroup.get('checkStatus')?.setValue('Thành công');
            successCount++;
            // Cập nhật cấu hình webhook nếu API thành công
            let updateWebhook = await this.systemConfigService.getUpdateApiWebHook(dataApi).toPromise();
            formGroup.value.api.id = updateWebhook.id;
            formGroup.value.api.body = updateWebhook.body;
            formGroup.value.api.url = updateWebhook.url;
            formGroup.value.api.apikey = updateWebhook.apikey;
            formGroup.value.api.type = updateWebhook.type;
          } else {
            formGroup.get('checkStatus')?.setValue('Thất bại');
          }
        } else {
          const data = await this.systemConfigService.checkStatusWebHook(dataApi).toPromise();
          if(data.success){
            formGroup.get('checkStatus')?.setValue('Thành công');

            // Nếu không có `id`, gọi API thêm mới
            let addedApi = await this.systemConfigService.getAddApIWebHook(dataApi).toPromise();
            let stringBody = JSON.stringify(addedApi.body).replace(/\\{2}/g, '\\').replace(/^"+|"+$/g, '');

            const parsedBody = JSON.parse(stringBody);
            formGroup.value.api.id = addedApi.id;
            formGroup.value.api.body = addedApi.body;
            formGroup.value.api.url = addedApi.url;
            formGroup.value.api.apikey = addedApi.apikey;
            formGroup.get('checkStatus')?.setValue('Thành công');
            successCount++;
          }else{
            formGroup.get('checkStatus')?.setValue('Thất bại');
            this.spinner.hide();
            return;
          }
        }
      } catch (error) {
        console.log("error",error); 
        formGroup.get('checkStatus')?.setValue('Thất bại');
        this.spinner.hide();
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
      await this.getListApiWebHook();
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
      return
    }
    if(this.addForm.value.apiListFormArray.length == 1){
      await this.getListApiWebHook();
    }

  }
  
  deleteConfig(i: any){
    let data: any = "";
    const formArray = this.addForm.get('apiListFormArray') as FormArray;

    // Lấy form group tại chỉ số i
    const formGroup = formArray.at(i) as FormGroup;
    const listApi = formGroup.value;
    
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
    dialogRef.afterClosed().subscribe(async (result: any) => {
      const formArrayLength = formArray.length;
      if(result?.action === 'delete'){
        if (formArrayLength > 1) {
          if(listApi.api.id){
            // Trường hợp có nhiều form => Xóa cả dữ liệu và form
            this.systemConfigService.getDeleteApiWebHook(listApi.api.label).subscribe(
              async (data) => {
                if (data.success) {
                  this.toastService.showSuccessHTMLWithTimeout("Xóa cấu hình webhook thành công!", "", 3000);
                  // await this.getListApiWebHook();
                  formArray.removeAt(i); // Xóa form khỏi FormArray
                  let getlistApiWebHook =  await this.systemConfigService.getlistApiWebHook().toPromise();
                  this.apiList = getlistApiWebHook;
                  
                  this.apiList = this.apiList.map((item: any) => ({
                    id: item.id,
                    label: item.type, // Hiển thị tên API trong dropdown
                    value: { id: item.id, type: item.type }, // Dữ liệu được chọn khi chọn API
                    body: this.formatBodyIfNeeded(item.body),
                    apikey: item.apikey,
                    url: item.url,
                    orgId: item.orgId,
                    checkStatus:"",
                    ...item,
                  }));
                  
                  // 🛠 Ép UI cập nhật
                  this.cdr.detectChanges();
                  // await this.ngOnInit();
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
            this.cdr.detectChanges();
            await this.ngOnInit();
          }
  
        } else {
          // Trường hợp chỉ còn 1 form => Chỉ xóa dữ liệu
          this.systemConfigService.getDeleteApiWebHook(listApi.api.label).subscribe(
            async (data) => {
              if (data.success) {
                this.toastService.showSuccessHTMLWithTimeout("Xóa dữ liệu webhook thành công!", "", 3000);
                formGroup.reset({
                  id:'',
                  apikey: '',
                  url: '',
                  body: '',
                });
                await this.ngOnInit();
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
        return
      }
      // Reset trạng thái form
      this.submittedForms = new Array(formArray.length).fill(false);

    });
  }
  
}