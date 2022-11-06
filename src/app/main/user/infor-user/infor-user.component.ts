import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UploadService } from 'src/app/service/upload.service';
import { UserService } from 'src/app/service/user.service';
import { networkList } from "../../../config/variable";
import {parttern_input} from "../../../config/parttern"
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-infor-user',
  templateUrl: './infor-user.component.html',
  styleUrls: ['./infor-user.component.scss']
})
export class InforUserComponent implements OnInit {

  submitted = false;
  submittedSign = false;
  get f() { return this.addInforForm.controls; }
  get fKpi() { return this.addKpiForm.controls; }
  get fHsm() { return this.addHsmForm.controls; }

  action: string;
  private sub: any;
  id:any=null;

  user:any;
  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  networkList: Array<any> = [];
  roleList: Array<any> = [];

  addInforForm: FormGroup;
  addKpiForm: FormGroup;
  addHsmForm: FormGroup;

  addInforFormOld: FormGroup;
  addKpiFormOld: FormGroup;
  addHsmFormOld: FormGroup;

  datas: any;
  attachFile:any;
  imgSignBucket:any;
  imgSignPath:any;
  phoneOld:any;

  organizationName:any;
  roleName:any;
  maxDate: Date = moment().toDate();

  constructor(private appService: AppService,
    private toastService : ToastService,
    private userService : UserService,
    private unitService : UnitService,
    private route: ActivatedRoute,
    private fbd: FormBuilder,
    public router: Router,
    private roleService: RoleService,
    private uploadService:UploadService,
    private spinner: NgxSpinnerService
    ) {
      this.addInforForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        birthday: null,
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        organizationId: this.fbd.control("", [Validators.required]),
        role: this.fbd.control("", [Validators.required]),
        status: 1,
        organization_change:null
      });
     
      this.addKpiForm = this.fbd.group({
      phoneKpi: this.fbd.control(null, [Validators.pattern("[0-9 ]{10}")]),
      networkKpi: null
      });
   
      this.addHsmForm = this.fbd.group({
        nameHsm: this.fbd.control("", Validators.pattern(parttern_input.input_form)),
        taxCodeHsm: this.fbd.control("",Validators.pattern(parttern_input.taxCode_form)),
        password1Hsm: null
      });

 }

  ngOnInit(): void {
    //lay danh sach to chuc
    this.unitService.getUnitList('', '').subscribe(data => {
      console.log(data.entities);
      this.orgList = data.entities;
    });

    //lay danh sach vai tro
    this.roleService.getRoleList('', '').subscribe(data => {
      console.log(data);
      this.roleList = data.entities;
    });

    this.networkList = networkList;
    this.user = this.userService.getInforUser();
    this.appService.setTitle('user.information');

    this.id = this.user.customer_id;
    this.userService.getUserById(this.id).subscribe(
      data => {
        this.addInforForm = this.fbd.group({
          name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.input_form)]),
          email: this.fbd.control(data.email, [Validators.required, Validators.email]),
          birthday: data.birthday==null?null:new Date(data.birthday),
          phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
          organizationId: this.fbd.control(data.organization_id, [Validators.required]),
          role: this.fbd.control(data.role_id, [Validators.required]),
          status: data.status,
          organization_change: data.organization_change
        });
        this.phoneOld = data.phone;

        //set name
        if(data.organization_id != null){
          console.log("data org ", data.organization_id);
          this.unitService.getUnitById(data.organization_id).subscribe(
            data => {
              this.organizationName = data.name;
            }, error => {
              this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
            }
          )
        }
        if(data.role_id != null){
          //lay danh sach vai tro
          this.roleService.getRoleById(data.role_id).subscribe(data => {
            this.roleName = data.name;
          });
        }

        this.addKpiForm = this.fbd.group({
          phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
          networkKpi: data.phone_tel
        });

        this.addHsmForm = this.fbd.group({
          nameHsm: this.fbd.control(data.hsm_name, Validators.pattern(parttern_input.input_form)),
          taxCodeHsm: this.fbd.control(data.tax_code, Validators.pattern(parttern_input.taxCode_form)),
          password1Hsm: this.fbd.control(data.hsm_pass)
        });
        console.log(data);
        this.imgSignPCSelect = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].presigned_url:null;
        this.imgSignBucket = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].bucket:null;
        this.imgSignPath = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].path:null;

        this.addInforFormOld = this.fbd.group({
          name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.input_form)]),
          email: this.fbd.control(data.email, [Validators.required, Validators.email]),
          birthday: data.birthday==null?null:new Date(data.birthday),
          phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
          organizationId: this.fbd.control(data.organization_id, [Validators.required]),
          role: this.fbd.control(data.role_id, [Validators.required]),
          status: data.status,
        });
        this.addKpiFormOld = this.fbd.group({
          phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
          networkKpi: data.phone_tel
        });
        this.addHsmFormOld = this.fbd.group({
          nameHsm: this.fbd.control(data.hsm_name, Validators.pattern(parttern_input.input_form)),
          taxCodeHsm: this.fbd.control(data.tax_code, Validators.pattern(parttern_input.taxCode_form)),
          password1Hsm: this.fbd.control(data.hsm_pass)
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }
  
  fieldTextType: boolean = false;
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  update(data:any){

    //lay lai thong tin anh cu truoc do => day lai
    if(this.imgSignBucket != null && this.imgSignPath != null){
      const sign_image_content:any = {bucket: this.imgSignBucket, path: this.imgSignPath};
      const sign_image:never[]=[];
      (sign_image as string[]).push(sign_image_content);
      data.sign_image = sign_image;
    }
    this.userService.updateUser(data).subscribe(
      data => {
        console.log(data);
        this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 3000);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/user-infor']);
        });
        this.spinner.hide();
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 3000);
        this.spinner.hide();
      }
    )
  }

  updateSign(data:any){
    //neu co up anh moi => day lai anh, update lai thong tin
    if(data.fileImage != null){
      this.uploadService.uploadFile(data.fileImage).subscribe((dataFile) => {
        console.log(JSON.stringify(dataFile));
        const sign_image_content:any = {bucket: dataFile.file_object.bucket, path: dataFile.file_object.file_path};
        const sign_image:never[]=[];
        (sign_image as string[]).push(sign_image_content);
        data.sign_image = sign_image;
        console.log(data);

        this.userService.updateUser(data).subscribe(
          data => {
            this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 3000);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['/main/user-infor']);
            });
            this.spinner.hide();
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 3000);
            this.spinner.hide();
          }
        )
      },
      error => {
        this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
        this.spinner.hide();
        return false;
      });
    }else{
      //lay lai thong tin anh cu truoc do => day lai
      if(this.imgSignBucket != null && this.imgSignPath != null){
        const sign_image_content:any = {bucket: this.imgSignBucket, path: this.imgSignPath};
        const sign_image:never[]=[];
        (sign_image as string[]).push(sign_image_content);
        data.sign_image = sign_image;
      }
      this.userService.updateUser(data).subscribe(
        data => {
          console.log(data);
          this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 3000);
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/user-infor']);
          });
          this.spinner.hide();
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 3000);
          this.spinner.hide();
        }
      )
    }
  }

  updateUser(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addInforForm.invalid) {
      return;
    }
    this.spinner.show();
    const data = {
      id: this.id,
      name: this.addInforForm.value.name,
      email: this.addInforForm.value.email,
      birthday: this.addInforForm.value.birthday,
      phone: this.addInforForm.value.phone,
      organizationId: this.addInforForm.value.organizationId,
      role: this.addInforForm.value.role,
      status: this.addInforForm.value.status,

      fileImage: this.attachFile,
      sign_image: [],

      phoneKpi: this.addKpiFormOld.value.phoneKpi,
      networkKpi: this.addKpiFormOld.value.networkKpi,

      nameHsm: this.addHsmFormOld.value.nameHsm,

      organization_change: this.addInforForm.value.organization_change
    }
    console.log(data);
    //neu thay doi so dien thoai thi can check lai
    if(data.phone != this.phoneOld){
      this.userService.checkPhoneUser(data.phone).subscribe(
        dataByPhone => {
          if(dataByPhone.code == '00'){

            //kiem tra xem email dang sua co phai email cua admin to chuc khong
            //lay thong tin to chuc cua user (email) check voi email, neu trung => cap nhat so dien thoai cho to chuc do
            this.unitService.getUnitById(data.organizationId).subscribe(
              dataUnit => {
                if(dataUnit.email == data.email){
                  const dataUpdateUnit = {
                    id: data.organizationId,
                    phone: data.phone,
                    name: dataUnit.name,
                    short_name: dataUnit.short_name,
                    code: dataUnit.code,
                    email: dataUnit.email,
                    fax: dataUnit.fax,
                    status: dataUnit.status,
                    parent_id: dataUnit.parent_id,
                    path: dataUnit.path
                  }
                  //update thong tin to chuc
                  this.unitService.updateUnit(dataUpdateUnit).subscribe(
                    data => {
                      //this.toastService.showSuccessHTMLWithTimeout('Cập nhật số điện thoại tổ chức thành công!', "", 3000);
                      
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Có lỗi cập nhật số điện thoại tổ chức', "", 3000);
                      this.spinner.hide();
                    }
                  )
                }
                
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                this.spinner.hide();
              }
            )

            //ham update
            this.update(data);
          }else if(dataByPhone.code == '01'){
            this.toastService.showErrorHTMLWithTimeout('Số điện thoại đã tồn tại trong hệ thống', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )
    }else{
      //ham update
      this.update(data);
    }
  }

  updateSignUser(){
    this.submittedSign = true;
    // stop here if form is invalid
    if (this.addKpiForm.invalid || this.addHsmForm.invalid) {
      return;
    }
    this.spinner.show();
    const data = {
      id: this.id,
      name: this.addInforFormOld.value.name,
      email: this.addInforFormOld.value.email,
      birthday: this.addInforFormOld.value.birthday,
      phone: this.addInforFormOld.value.phone,
      organizationId: this.addInforFormOld.value.organizationId,
      role: this.addInforFormOld.value.role,
      status: this.addInforFormOld.value.status,

      fileImage: this.attachFile,
      sign_image: [],

      phoneKpi: this.addKpiForm.value.phoneKpi,
      networkKpi: this.addKpiForm.value.networkKpi,

      nameHsm: this.addHsmForm.value.nameHsm,
      taxCodeHsm: this.addHsmForm.value.taxCodeHsm,
      password1Hsm: this.addHsmForm.value.password1Hsm

    }

    console.log("data update sign user ", data);

    //ham update
    this.updateSign(data);
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
          if (extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'png' || extension.toLowerCase() == 'jpge') {
            this.handleUpload(e);
            this.attachFile = file;
            console.log(this.attachFile);
          }else{
            this.toastService.showErrorHTMLWithTimeout("File hợp đồng yêu cầu định dạng JPG, PNG, JPGE", "", 3000);
          }

        } else {
          this.attachFile = null;
          this.toastService.showErrorHTMLWithTimeout("Yêu cầu file nhỏ hơn 50MB", "", 3000);
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
      //console.log(reader.result);
      this.imgSignPCSelect = reader.result? reader.result.toString() : '';
    };
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }

}