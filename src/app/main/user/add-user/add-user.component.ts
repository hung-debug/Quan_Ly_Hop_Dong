import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { AppService } from 'src/app/service/app.service';
import { UnitService } from 'src/app/service/unit.service';
import { RoleService } from 'src/app/service/role.service';
import { networkList } from "../../../config/variable";
import { UploadService } from 'src/app/service/upload.service';
import {parttern_input, parttern} from "../../../config/parttern";
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

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
  isMailSame: boolean = false;

  organizationName:any;
  roleName:any;
  userRoleCode:string='';
  maxDate: Date = moment().toDate();

  orgIdOld:any;
  is_show_phone_pki: boolean = true;
  isDisable: any;
  user:any;
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
              private uploadService:UploadService,
              private spinner: NgxSpinnerService
    ) {
    this.addForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
      email: this.fbd.control("", [Validators.required, Validators.email]),
      birthday: null,
      phone: this.fbd.control("", [Validators.required, Validators.pattern("^[+]*[0-9]{10,11}$")]),
      organizationId: this.fbd.control("", [Validators.required]),
      role: this.fbd.control("", [Validators.required]),
      status: 1,
      is_show_phone_pki: true,
      login_type: 'EMAIL',
      phoneKpi: this.fbd.control(null, [Validators.pattern("^[+]*[0-9]{10,11}$")]),
      networkKpi: null,

      nameHsm: this.fbd.control("", Validators.pattern(parttern_input.new_input_form)),
      taxCodeHsm: this.fbd.control("",Validators.pattern(parttern_input.taxCode_form)),
      password1Hsm: this.fbd.control(""),

      fileImage:null,

      organization_change:null
    });
  }

  getDataOnInit(){
    let orgId = this.userService.getAuthCurrentUser().organizationId;

    if(this.isQLND_01 || this.isQLND_02){
      //lay danh sach to chuc
      this.unitService.getUnitList('', '').subscribe(data => {
        this.orgList = data.entities;
      });
      this.networkList = networkList;
    }

    if(this.isQLND_02) {
      this.isEditRole = true
    }

    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];

      //set title
      if (this.action == 'add') {
        this.appService.setTitle('user.add');

        //lay danh sach vai tro
        this.roleService.getRoleList('', '').subscribe(data => {
          this.roleList = data.entities;
        });

        this.isEditRole = true;
        if(this.isQLND_01){
          this.addForm = this.fbd.group({
            name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
            email: this.fbd.control("", [Validators.required, Validators.email]),
            birthday: null,
            phone: this.fbd.control("", [Validators.required, Validators.pattern("^[+]*[0-9]{10,11}$")]),
            organizationId: this.fbd.control(orgId, [Validators.required]),
            role: this.fbd.control("", [Validators.required]),
            status: 1,
            is_show_phone_pki: true,
            login_type: 'EMAIL',
            phoneKpi: this.fbd.control(null, [Validators.pattern("^[+]*[0-9]{10,11}$")]),
            networkKpi: null,

            nameHsm: this.fbd.control("", Validators.pattern(parttern_input.new_input_form)),
            taxCodeHsm: this.fbd.control("",Validators.pattern(parttern.cardid)),
            password1Hsm: this.fbd.control(""),

            fileImage:null
          });
        }
        this.spinner.hide();
      } else if (this.action == 'edit') {
        this.id = params['id'];
        this.appService.setTitle('user.update');
        this.addForm.get('login_type')?.disable();
        this.roleService.getRoleList('', '').subscribe(data => {
          this.roleList = data.entities;
        });

        if(this.isQLND_02){
          this.userService.getUserById(this.id).subscribe(
            data => {
              
              if (data.login_type == null) {
                data.login_type = 'EMAIL';
              }
              if(data.login_type == 'EMAIL'){
                this.addForm.get('email')?.disable();
              }else if(data.login_type == 'SDT'){
                this.addForm.get('phone')?.disable();
              }else if(data.login_type == 'EMAIL_AND_SDT'){
                this.addForm.get('email')?.disable();
                this.addForm.get('phone')?.disable();
              }

              if(data.role_id != null){
                //lay vai tro cua user
                this.roleService.getRoleById(data?.role_id).subscribe(dataRoleUser => {
                  this.roleName = dataRoleUser.name;
                  this.orgIdOld = data.organization_id;
                  this.addForm = this.fbd.group({
                    name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
                    email: this.fbd.control(data.email, [Validators.required, Validators.email]),
                    birthday: data.birthday==null?null:new Date(data.birthday),
                    phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
                    organizationId: this.fbd.control(data.organization_id, [Validators.required]),
                    role: this.fbd.control(Number(data.role_id), [Validators.required]),
                    status: data.status,
                    is_show_phone_pki: data.is_show_phone_pki,
                    login_type: data.login_type ? data.login_type : 'EMAIL',
                    phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
                    networkKpi: data.phone_tel,

                    nameHsm: this.fbd.control(data.hsm_name , Validators.pattern(parttern_input.new_input_form)),
                    taxCodeHsm: this.fbd.control(data.tax_code,Validators.pattern(parttern.cardid)),
                    password1Hsm: this.fbd.control(data.hsm_pass),

                    fileImage:null,

                    organization_change: data.organization_change
                  });
                  this.phoneOld = data.phone;

                  this.imgSignPCSelect = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].presigned_url:null;
                  this.imgSignBucket = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].bucket:null;
                  this.imgSignPath = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].path:null;

                  this.imgSignPCSelectMark = data.stampImage != null && data.stampImage.length>0?data.stampImage[0].presigned_url:null;
                  this.imgSignBucketMark = data.stampImage != null && data.stampImage.length>0?data.stampImage[0].bucket:null;
                  this.imgSignPathMark = data.stampImage != null && data.stampImage.length>0?data.stampImage[0].path:null;

                  //set name
                  if(data.organization_id != null){
                    this.unitService.getUnitById(data.organization_id).subscribe(
                      data => {
                        this.organizationName = data.name
                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin tổ chức', "", 3000);
                      }
                    )
                  }

                  //neu nguoi truy cap co ma vai tro la ADMIN thi duoc quyen sua
                  if(this.userRoleCode.toUpperCase() == 'ADMIN'){
                    this.isEditRole = true;

                    //lay danh sach vai tro
                     this.roleService.getRoleByOrgId(orgId).subscribe(dataRole => {
                      //this.roleList = data.entities;
                      this.roleList = [];
                      let checkDupRolePersent = false;
                      dataRole.entities.forEach((key: any) => {
                        if(key.id == data.role_id){
                          checkDupRolePersent = true;
                        }
                        var role = {
                            id:  key.id,
                            name:  key.name,
                            inactive: false
                          }
                        this.roleList.push(role);
                      });
                    });
                  }

                  this.spinner.hide();
                });
              }
            }, error => {
              this.spinner.hide();
              setTimeout(() => this.router.navigate(['/login']));
              this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);

            }
          )
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    //lay id user
    this.spinner.show();
    let userId = this.userService.getAuthCurrentUser().id;
    
    const idUser = this.route.snapshot.paramMap.get('id'); // ID sẽ ở url

    let arrUser = await this.userService.getUserById(idUser).toPromise();
    this.isDisable = arrUser.login_type;

    this.isMailSame = sessionStorage.getItem('isMailSame') == "true" ? true : false;
    this.addForm.get('login_type')?.setValue('EMAIL');

    this.userService.getUserById(userId).subscribe(
      data => {

        //lay id role
        this.roleService.getRoleById(data?.role_id).subscribe(
          data => {

            let listRole: any[];
            this.userRoleCode = data.code;
            listRole = data.permissions;

            this.isQLND_01 = listRole.some(element => element.code == 'QLND_01');
            this.isQLND_02 = listRole.some(element => element.code == 'QLND_02') || this.isMailSame;

            this.getDataOnInit();
          }, error => {
            this.spinner.hide();
            // this.toastService.showErrorHTMLWithTimeout('Lấy thông tin phân quyền', "", 3000);
            this.router.navigate(['/login'])
          }
        );

      }, error => {
        this.spinner.hide();
        // this.toastService.showErrorHTMLWithTimeout('Hết phiên đăng nhập, Vui lòng đăng nhập lại', "", 3000);
        this.router.navigate(['/login'])
      }
    )
  }

  onCancel(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/user']);
    });
  }

  checkChangeUnit(data:any){
    //kiem tra xem nguoi dung co chuyen to chuc hay khong
    if(data.organizationId != this.orgIdOld){
      //kiem tra xem nguoi dung da xu ly xong het cac hop dong hay chua
      this.userService.getCheckContractUser(this.id).subscribe(
        dataCheckContract => {
          if(dataCheckContract.success){
            this.update(data);
          }else{
            this.toastService.showErrorHTMLWithTimeout('Không thể chuyển đơn vị cho người dùng tồn tại tài liệu chưa xử lý', "", 3000);
            this.spinner.hide();
          }

        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Kiểm tra tài liệu theo người dùng thất bại', "", 3000);
          this.spinner.hide();
        }
      )
    }else{
      this.update(data);
    }
  }

  imgSignBucketMark: any;
  imgSignPathMark: any
  async update(data:any){
    data.id = this.id;
      if(this.imgSignBucket != null && this.imgSignPath != null && !data.fileImage){
        const sign_image_content:any = {bucket: this.imgSignBucket, path: this.imgSignPath};
        const sign_image:never[]=[];
        (sign_image as string[]).push(sign_image_content);
        data.sign_image = sign_image;
      } else if(data.fileImage) {
        try {
          const fileImage = await this.uploadService.uploadFile(data.fileImage).toPromise();
          const sign_image_content:any = {bucket: fileImage.file_object.bucket, path: fileImage.file_object.file_path};
          const sign_image:never[]=[];
          (sign_image as string[]).push(sign_image_content);
          data.sign_image = sign_image;
        } catch(err) {

        }
      }

      if(this.imgSignBucketMark != null && this.imgSignPathMark != null && !data.fileImageMark){
        const sign_image_content:any = {bucket: this.imgSignBucketMark, path: this.imgSignPathMark};
        const sign_image:never[]=[];
        (sign_image as string[]).push(sign_image_content);
        data.stampImage = sign_image;
      } else if(data.fileImageMark) {
        try {
          const fileImageMark = await this.uploadService.uploadFile(data.fileImageMark).toPromise();
          const sign_image_content:any = {bucket: fileImageMark.file_object.bucket, path: fileImageMark.file_object.file_path};
          const sign_image:never[]=[];
          (sign_image as string[]).push(sign_image_content);
          data.stampImage = sign_image;
        } catch(err) {

        }
      }


      this.userService.updateUser(data).subscribe(
        dataOut => {

          let emailCurrent = this.userService.getAuthCurrentUser().email;
          //neu nguoi thao tac chuyen to chuc cho chinh minh thi can logout de lay lai thong tin to chuc moi
          if(data.organizationId != this.orgIdOld && emailCurrent == data.email){
            this.toastService.showSuccessHTMLWithTimeout('Cập nhật thành công. Vui lòng đăng nhập lại!', "", 3000);
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/login']);

          }else{
            this.toastService.showSuccessHTMLWithTimeout('Cập nhật thành công!', "", 3000);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['/main/user']);
            });
          }

          this.spinner.hide();
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Cập nhật thất bại', "", 3000);
          this.spinner.hide();
        }
      )
  }

  getRoleByOrg(orgId:any){
    this.addForm.patchValue({
      role: null,
    });
    this.roleService.getRoleByOrgId(orgId).subscribe(data => {
      this.roleList = data.entities;
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    this.spinner.show();
    const data = {
      id: "",
      name: this.addForm.value.name,
      email: this.addForm.value.email.trim().toLowerCase(),
      birthday: this.addForm.value.birthday,
      phone: this.addForm.value.phone.trim(),
      organizationId: this.addForm.value.organizationId,
      role: this.addForm.value.role,
      status: this.addForm.value.status,
      is_show_phone_pki: this.addForm.value.is_show_phone_pki,
      login_type: this.addForm.value.login_type,
      phoneKpi: this.addForm.value.phoneKpi,
      networkKpi: this.addForm.value.networkKpi,
      nameHsm: this.addForm.value.nameHsm,
      taxCodeHsm: this.addForm.value.taxCodeHsm,
      password1Hsm: this.addForm.value.password1Hsm,
      fileImage: this.attachFile,
      fileImageMark: this.attachFileMark,
      sign_image: [],
      stampImage: [],
      organization_change: this.addForm.value.organizationId!= this.orgIdOld?1:this.addForm.value.organization_change
    }

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
                      path: dataUnit.path
                    }
                    //update thong tin to chuc
                    this.unitService.updateUnit(dataUpdateUnit).subscribe(
                      data => {
                        //this.toastService.showSuccessHTMLWithTimeout('Cập nhật số điện thoại tổ chức thành công!', "", 3000);

                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Lỗi cập nhật số điện thoại tổ chức', "", 3000);
                        this.spinner.hide();
                      }
                    )
                  }

                }, error => {
                  this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                  this.spinner.hide();
                }
              )
              //ham update nguoi dung
              this.checkChangeUnit(data);
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
        // this.attachFile ? data.sign_image = this.attachFile : data.sign_image = []
        // this.attachFileMark ? data.stampImage = this.attachFileMark : data.stampImage = []
        //ham update
        this.checkChangeUnit(data);
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

                      const sign_image_content:any = {bucket: dataFile.file_object.bucket, path: dataFile.file_object.file_path};
                      const sign_image:never[]=[];
                      (sign_image as string[]).push(sign_image_content);
                      data.sign_image = sign_image;


                      //call api them moi
                      this.userService.addUser(data).subscribe(
                        data => {
                          if(data.success == true){
                            this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 3000);
                            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                              this.router.navigate(['/main/user']);
                            });
                            this.spinner.hide();
                          }else{
                            this.toastService.showErrorHTMLWithTimeout(data.data, "", 3000);
                          }

                        }, error => {
                          this.toastService.showErrorHTMLWithTimeout('Thêm mới thất bại', "", 3000);
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

                    //call api them moi
                    this.userService.addUser(data).subscribe(
                      data => {
                        if(data.success == true){
                          this.toastService.showSuccessHTMLWithTimeout('Thêm mới thành công!', "", 3000);
                          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                            this.router.navigate(['/main/user']);
                          });
                          this.spinner.hide();
                        } else {
                          this.toastService.showErrorHTMLWithTimeout(data.data, "", 3000);
                          this.spinner.hide();
                        }

                      }, error => {
                        this.toastService.showErrorHTMLWithTimeout('Thêm mới thất bại', "", 3000);
                        this.spinner.hide();
                      }
                    )
                  }
                }else{
                  this.toastService.showErrorHTMLWithTimeout('Email đã tồn tại trong hệ thống', "", 3000);
                  this.spinner.hide();
                }
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
                this.spinner.hide();
              }
            )
          }else if(dataByPhone.code == '01'){
            this.toastService.showErrorHTMLWithTimeout('Số điện thoại đã tồn tại trong hệ thống', "", 3000);
            this.spinner.hide();
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
          this.spinner.hide();
        }
      )
    }
  }

  attachFileMark: any;
  fileChangedAttach(e: any, code: string) {
    let files = e.target.files;
    for(let i = 0; i < files.length; i++){

      const file = e.target.files[i];
      if (file) {
        // giới hạn file upload lên là 5mb
        if (e.target.files[0].size <= 50000000) {
          const file_name = file.name;
          const extension = file.name.split('.').pop();
          if (extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'png' || extension.toLowerCase() == 'jpge') {
            this.handleUpload(e, code);

            if(code == 'sign')
              this.attachFile = file;
            else if(code == 'mark')
              this.attachFileMark = file;
          }else{
            this.toastService.showErrorHTMLWithTimeout("File tài liệu yêu cầu định dạng JPG, PNG, JPGE", "", 3000);
          }

        } else {
          this.attachFile = null;
          this.attachFileMark = null;
          this.toastService.showErrorHTMLWithTimeout("Yêu cầu file nhỏ hơn 50MB", "", 3000);
          break;
        }
      }
    }
  }

  imgSignPCSelect: string;
  imgSignPCSelectMark: string;
  handleUpload(event: any, code: string) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if(code == 'sign') {
        this.imgSignPCSelect = reader.result? reader.result.toString() : '';
      }
      else if(code == 'mark') {
        this.imgSignPCSelectMark = reader.result? reader.result.toString() : '';
      }
    };
  }

  addFileAttach(code: string) {

    if(code == 'sign')
      // @ts-ignore
      document.getElementById('attachFileSignature').click();
    else if(code == 'mark')
      // @ts-ignore
      document.getElementById('attachFileMark').click();
  }

  ngOnDestroy(): void {
      sessionStorage.removeItem('isMailSame');
  }
}
