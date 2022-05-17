import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUserService } from 'src/app/service/admin/admin-user.service';
import { AppService } from 'src/app/service/app.service';
import { ToastService } from 'src/app/service/toast.service';
import {parttern_input} from "../../../../config/parttern";
@Component({
  selector: 'app-admin-add-user',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.component.scss']
})
export class AdminAddUserComponent implements OnInit {

  submitted = false;
  get f() { return this.addForm.controls; }

  action: string;
  private sub: any;
  id:any=null;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  networkList: Array<any> = [];
  roleList: Array<any> = [];
  phoneOld:any;

  addForm: FormGroup;
  datas: any;
  attachFile:any;
  sign_image:null;
  imgSignBucket:null;
  imgSignPath:null;
  isEditRole:boolean=false;

  organizationName:any;
  roleName:any;
  userRoleCode:string='';

  //phan quyen
  isQLND_01:boolean=true;  //them moi nguoi dung
  isQLND_02:boolean=true;  //sua nguoi dung

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService,
              private toastService : ToastService,
              private adminUserService : AdminUserService,
              private route: ActivatedRoute,
              private fbd: FormBuilder,
              public router: Router,
              public dialog: MatDialog,
    ) {
    this.addForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
      email: this.fbd.control("", [Validators.required, Validators.email]),
      phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
      role: this.fbd.control("", [Validators.required]),
      password: this.fbd.control("", [Validators.required]),
    });
  }
  
  getDataOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if (!this.data.id) {
        this.appService.setTitle('user.add');
        this.isEditRole = true;
        if(this.isQLND_01){
          this.addForm = this.fbd.group({
            name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.input_form)]),
            email: this.fbd.control("", [Validators.required, Validators.email]),
            birthday: null,
            phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
            role: this.fbd.control("", [Validators.required]),
            password: this.fbd.control("", [Validators.required]),
          });
        }
      } else {
        this.id = this.data.id;
        this.appService.setTitle('user.update');

        this.adminUserService.getUserById(this.id).subscribe(
          data => {
            console.log(data);
            this.addForm = this.fbd.group({
              name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.input_form)]),
              email: this.fbd.control(data.email, [Validators.required, Validators.email]),
              birthday: data.birthday==null?null:new Date(data.birthday),
              phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
              organizationId: this.fbd.control(data.organization_id, [Validators.required]),
              role: this.fbd.control(data.role_id, [Validators.required]),
              password: this.fbd.control("", [Validators.required]),
              status: data.status,

              phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
              networkKpi: data.phone_tel,

              nameHsm: this.fbd.control(data.hsm_name , Validators.pattern(parttern_input.input_form)),

              fileImage:null
            }); 
            this.phoneOld = data.phone;
            this.imgSignPCSelect = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].presigned_url:null;
            this.imgSignBucket = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].bucket:null;
            this.imgSignPath = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].path:null;
            console.log(this.addForm);

          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin người dùng', "", 3000);
          }
        )
      }
    });
  }

  ngOnInit(): void {
    this.getDataOnInit();
  }

  onCancel(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/user']);
    });
  }

  update(data:any){
    this.adminUserService.updateUser(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout('Cập nhật thành công!', "", 3000);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/user']);
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Cập nhật thất bại', "", 3000);
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
      fileImage: this.attachFile,
      sign_image: []
    }
    console.log(data);
    
    if(this.id !=null){
      //neu thay doi so dien thoai thi can check lai
      if(data.phone != this.phoneOld){
        this.adminUserService.checkPhoneUser(data.phone).subscribe(
          dataByPhone => {
            if(dataByPhone.code == '00'){
              //ham update nguoi dung
              this.update(data);
              
            }else if(dataByPhone.code == '01'){
              this.toastService.showErrorHTMLWithTimeout('Số điện thoại đã tồn tại trong hệ thống', "", 3000);
            }
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          }
        )
      }else{
        //ham update
        this.update(data);
      }
      
    }else{
      this.adminUserService.checkPhoneUser(data.phone).subscribe(
        dataByPhone => {
          if(dataByPhone.code == '00'){

            //kiem tra email da ton tai trong he thong hay chua
            this.adminUserService.getUserByEmail(data.email).subscribe(
              dataByEmail => {
                if(dataByEmail.id == 0){
                  //call api them moi
                  this.adminUserService.addUser(data).subscribe(
                    data => {
                      this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 3000);
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigate(['/main/user']);
                      });
                    }, error => {
                      this.toastService.showErrorHTMLWithTimeout('Thêm mới thất bại', "", 3000);
                    }
                  )
                }else{
                  this.toastService.showErrorHTMLWithTimeout('Email đã tồn tại trong hệ thống', "", 3000);
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
              }
            )
          }else if(dataByPhone.code == '01'){
            this.toastService.showErrorHTMLWithTimeout('Số điện thoại đã tồn tại trong hệ thống', "", 3000);
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
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
