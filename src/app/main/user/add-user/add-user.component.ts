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
import { networkList } from "../../../config/variable";
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

  //phan quyen
  isQLND_01:boolean=true;  //them moi nguoi dung
  isQLND_02:boolean=true;  //sua nguoi dung

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


  userRoleCode:string='';

  getDataOnInit(){
    let orgId = this.userService.getAuthCurrentUser().organizationId;
    if(this.isQLND_01 || this.isQLND_02){
      //lay danh sach to chuc
      this.unitService.getUnitList('', '').subscribe(data => {
        console.log(data.entities);
        console.log(orgId);
        this.orgList = data.entities.filter((p: any) => p.id == orgId);
      });

      //lay danh sach vai tro
      this.roleService.getRoleList('', '').subscribe(data => {
        console.log(data);
        this.roleList = data.entities;
      });

      this.networkList = networkList;
    }

    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if (this.action == 'add') {
        this.appService.setTitle('user.add');
        this.isEditRole = true;
        if(this.isQLND_01){
          this.addForm = this.fbd.group({
            name: this.fbd.control("", [Validators.required]),
            email: this.fbd.control("", [Validators.required, Validators.email]),
            birthday: null,
            phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
            organizationId: this.fbd.control(orgId, [Validators.required]),
            role: this.fbd.control("", [Validators.required]),
            status: 1,

            phoneKpi: this.fbd.control(null, [Validators.pattern("[0-9 ]{10}")]),
            networkKpi: null,

            nameHsm: null,

            fileImage:null
          });
        }
      } else if (this.action == 'edit') {
        this.id = params['id'];
        this.appService.setTitle('user.update');

        if(this.isQLND_02){
          this.userService.getUserById(this.id).subscribe(
            data => {
              console.log(data);
              this.addForm = this.fbd.group({
                name: this.fbd.control(data.name, [Validators.required]),
                email: this.fbd.control(data.email, [Validators.required, Validators.email]),
                birthday: data.birthday==null?null:new Date(data.birthday),
                phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
                organizationId: this.fbd.control(data.organization_id, [Validators.required]),
                role: this.fbd.control(data.role_id, [Validators.required]),
                status: data.status,

                phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
                networkKpi: data.phone_tel,

                nameHsm: data.hsm_name,

                fileImage:null
              });
              this.phoneOld = data.phone;
              this.imgSignPCSelect = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].presigned_url:null;
              this.imgSignBucket = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].bucket:null;
              this.imgSignPath = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].path:null;
              console.log(this.addForm);

              //set name
              if(data.organization_id != null){
                this.unitService.getUnitById(data.organization_id).subscribe(
                  data => {
                    this.organizationName = data.name
                  }, error => {
                    this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                  }
                )
              }
              //neu nguoi truy cap co ma vai tro la ADMIN thi duoc quyen sua
              if(this.userRoleCode.toUpperCase() == 'ADMIN'){
                this.isEditRole = true;
              }else{
                if(data.role_id != null){
                  //lay danh sach vai tro
                  this.roleService.getRoleById(data.role_id).subscribe(data => {
                    this.roleName = data.name;
                  });
                }
              }
              
            }, error => {
              this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
            }
          )
        }
      }
    });
  }

  ngOnInit(): void {
    //lay id user
    let userId = this.userService.getAuthCurrentUser().id;
    
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data.role_id).subscribe(
          data => {
            this.userRoleCode = data.code;
            console.log(data);
            let listRole: any[];
            listRole = data.permissions;
            this.isQLND_01 = listRole.some(element => element.code == 'QLND_01');
            this.isQLND_02 = listRole.some(element => element.code == 'QLND_02');

            this.getDataOnInit();
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
          }
        );
      
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
      }
    )

      
  }

  updateInforUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 3000);
  }

  updateSignFileImageUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.file.image.success", "", 3000);
  }

  updateSignKpiUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.kpi.success", "", 3000);
  }

  updateSignHsmUser(){
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.hsm.success", "", 3000);
  }

  onCancel(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/user']);
    });
  }

  update(data:any){
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
            this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 3000);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['/main/user']);
            });
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 3000);
          }
        )
      },
      error => {
        this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
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
          this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin thành công!', "", 3000);
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/main/user']);
          });
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 3000);
        }
      )
    }
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
                    }
                    //update thong tin to chuc
                    this.unitService.updateUnit(dataUpdateUnit).subscribe(
                      data => {
                        //this.toastService.showSuccessHTMLWithTimeout('Cập nhật số điện thoại tổ chức thành công!', "", 3000);
                        
                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Có lỗi cập nhật số điện thoại tổ chức', "", 3000);
                      }
                    )
                  }
                  
                }, error => {
                  this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                }
              )

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
      this.userService.checkPhoneUser(data.phone).subscribe(
        dataByPhone => {
          if(dataByPhone.code == '00'){

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
                          this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 3000);
                          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                            this.router.navigate(['/main/user']);
                          });
                        }, error => {
                          this.toastService.showErrorHTMLWithTimeout('Thêm mới thất bại', "", 3000);
                        }
                      )
                    },
                    error => {
                      this.toastService.showErrorHTMLWithTimeout("no.push.file.contract.error", "", 3000);
                      return false;
                    });
                  }else{
      
                    //call api them moi
                    this.userService.addUser(data).subscribe(
                      data => {
                        this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 3000);
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                          this.router.navigate(['/main/user']);
                        });
                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Thêm mới thất bại', "", 3000);
                      }
                    )
                  }
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
