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
import { RoleService } from 'src/app/service/role.service';
import { networkList } from "../../../data/data";
import * as moment from "moment";
import { UploadService } from 'src/app/service/upload.service';
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
  id:any=null;

  dropdownOrgSettings: any = {};
  orgList: Array<any> = [];
  networkList: Array<any> = [];
  roleList: Array<any> = [];

  addForm: FormGroup;
  datas: any;
  attachFile:any;
  sign_image:null;
  imgSignBucket:null;
  imgSignPath:null;

  constructor(private appService: AppService,
    private toastService : ToastService,
    private userService : UserService,
    private unitService : UnitService,
    private route: ActivatedRoute,
    private fbd: FormBuilder,
    public router: Router,
    private roleService: RoleService,
    private uploadService:UploadService
    ) {
      this.addForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        birthday: null,
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        organizationId: this.fbd.control("", [Validators.required]),
        role: this.fbd.control("", [Validators.required]),
        status: 1,

        phoneKpi: this.fbd.control(null, [Validators.pattern("[0-9 ]{10}")]),
        networkKpi: null,

        nameHsm: null,

        fileImage:null
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
      this.roleList = data;
    });

    this.networkList = networkList;

    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if (this.action == 'add') {
        this.appService.setTitle('user.add');

        this.addForm = this.fbd.group({
          name: this.fbd.control("", [Validators.required]),
          email: this.fbd.control("", [Validators.required, Validators.email]),
          birthday: null,
          phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
          organizationId: this.fbd.control("", [Validators.required]),
          role: this.fbd.control("", [Validators.required]),
          status: 1,

          phoneKpi: this.fbd.control(null, [Validators.pattern("[0-9 ]{10}")]),
          networkKpi: null,

          nameHsm: null,

          fileImage:null
        });
      } else if (this.action == 'edit') {
        this.id = params['id'];
        this.appService.setTitle('user.update');

        this.userService.getUserById(this.id).subscribe(
          data => {
            console.log(data);
            this.addForm = this.fbd.group({
              name: this.fbd.control(data.name, [Validators.required]),
              email: this.fbd.control(data.email, [Validators.required, Validators.email]),
              birthday: data.birthday==null?null:new Date(data.birthday),
              phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
              organizationId: this.fbd.control(data.organization_id, [Validators.required]),
              role: this.fbd.control(data.type_id, [Validators.required]),
              status: data.status,

              phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
              networkKpi: data.phone_tel,

              nameHsm: data.hsm_name,

              fileImage:null
            });
            this.imgSignPCSelect = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].presigned_url:null;
            this.imgSignBucket = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].bucket:null;
            this.imgSignPath = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].path:null;
            console.log(this.addForm);
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
      fileImage: this.attachFile,
      sign_image: []
    }
    console.log(data);
    
    if(this.id !=null){
      data.id = this.id;
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
              this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate(['/main/user']);
              });
            }, error => {
              this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 1000);
            }
          )
        },
        error => {
          this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 10000);
          return false;
        });
      }else{
        if(this.imgSignBucket != null && this.imgSignPath != null){
          const sign_image_content:any = {bucket: this.imgSignBucket, path: this.imgSignPath};
          const sign_image:never[]=[];
          (sign_image as string[]).push(sign_image_content);
          data.sign_image = sign_image;
        }
        console.log(data);
        this.userService.updateUser(data).subscribe(
          data => {
            this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 1000);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['/main/user']);
            });
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 1000);
          }
        )
      }
    }else{
      //kiem tra email da ton tai trong he thong hay chua
      this.userService.getUserByEmail(data.email).subscribe(
        dataByEmail => {
          if(dataByEmail.id == 0){

            if(data.fileImage != null){
              this.uploadService.uploadFile(data.fileImage).subscribe((dataFile) => {
                console.log(JSON.stringify(dataFile));
                const sign_image_content:any = {bucket: dataFile.file_object.bucket, path: dataFile.file_object.file_path};
                const sign_image:never[]=[];
                (sign_image as string[]).push(sign_image_content);
                data.sign_image = sign_image;
                console.log(data);
      
                //call api them moi
                this.userService.addUser(data).subscribe(
                  data => {
                    this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 1000);
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                      this.router.navigate(['/main/user']);
                    });
                  }, error => {
                    this.toastService.showErrorHTMLWithTimeout('Thêm mới thất bại', "", 1000);
                  }
                )
              },
              error => {
                this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 10000);
                return false;
              });
            }else{

              //call api them moi
              this.userService.addUser(data).subscribe(
                data => {
                  this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 1000);
                  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                    this.router.navigate(['/main/user']);
                  });
                }, error => {
                  this.toastService.showErrorHTMLWithTimeout('Thêm mới thất bại', "", 1000);
                }
              )
            }
          }else{
            this.toastService.showErrorHTMLWithTimeout('Email đã tồn tại trong hệ thống', "", 1000);
          }
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
          this.attachFile = file;
          console.log(this.attachFile);
        } else {
          this.attachFile = null;
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
      //console.log(reader.result);
      this.imgSignPCSelect = reader.result? reader.result.toString() : '';
    };
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }
}
