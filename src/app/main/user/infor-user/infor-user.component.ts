import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UploadService } from 'src/app/service/upload.service';
import { UserService } from 'src/app/service/user.service';
import { networkList, supplier } from "../../../config/variable";
import {parttern_input, parttern} from "../../../config/parttern"
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';
import { error } from 'console';
import { ImageCropperComponentv2 } from '../image-cropper/image-cropperv2.component';
import { ContractService } from 'src/app/service/contract.service';
import { environment } from 'src/environments/environment';
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
  supplierList: Array<any> = [];
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

  imgSignBucketMark: any;
  imgSignPathMark: any;

  phoneOld:any;
  currentUser: any;
  environment: any = "";

  organizationName:any;
  roleName:any;
  maxDate: Date = moment().toDate();
  isDisable: any;
  isHsmIcorp: boolean = true
  // Tham chiếu đến các component ImageCropper
  @ViewChild('imageCropperSign') imageCropperSign: ImageCropperComponentv2;
  @ViewChild('imageCropperMark') imageCropperMark: ImageCropperComponentv2;

  // Các biến liên quan đến ảnh Sign
  selectedFileSign: File | null = null; // File ảnh Sign được chọn
  croppedImageSign: string | null = null; // Dữ liệu base64 của ảnh Sign sau khi crop
  showCropperSign: boolean = false; // Cờ để hiển thị/ẩn component cropper cho ảnh Sign

  // Các biến liên quan đến ảnh Mark
  selectedFileMark: File | null = null; // File ảnh Mark được chọn
  croppedImageMark: string | null = null; // Dữ liệu base64 của ảnh Mark sau khi crop
  showCropperMark: boolean = false; // Cờ để hiển thị/ẩn component cropper cho ảnh Mark

  selectedCode: string | null = null; // Lưu mã ('sign' hoặc 'mark') để biết ảnh nào đang được xử lý

  // Biến cờ để kiểm tra xem cả hai ảnh đã được chọn hay chưa
  isSignSelected: boolean = false;
  isMarkSelected: boolean = false;
  constructor(private appService: AppService,
    private toastService : ToastService,
    private userService : UserService,
    private unitService : UnitService,
    private route: ActivatedRoute,
    private fbd: FormBuilder,
    public router: Router,
    private roleService: RoleService,
    private uploadService:UploadService,
    private spinner: NgxSpinnerService,
    private contractService: ContractService,
    ) {
      this.addInforForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        birthday: null,
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        organizationId: this.fbd.control("", [Validators.required]),
        role: this.fbd.control("", [Validators.required]),
        status: 1,
        organization_change:null,
        login_type: 'EMAIL'
      });
     
      this.addKpiForm = this.fbd.group({
      phoneKpi: this.fbd.control(null, [Validators.pattern("[0-9 ]{10}")]),
      networkKpi: null,
      is_show_phone_pki: true,
      });
   
      this.addHsmForm = this.fbd.group({
        supplier: null,
        uuid: null,
        nameHsm: this.fbd.control("", Validators.pattern(parttern_input.new_input_form)),
        taxCodeHsm: this.fbd.control("",[
            Validators.pattern(parttern.cardid),
            ]
          ),
        password1Hsm: null
      });
      
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;


 }

  async ngOnInit(): Promise<void> {
    this.environment = environment
    //lay danh sach to chuc
    this.unitService.getUnitList('', '').subscribe(data => {
      this.orgList = data.entities;
    });
    this.addInforForm.get('login_type')?.disable();
    //lay danh sach vai tro
    this.roleService.getRoleList('', '').subscribe(data => {
      this.roleList = data.entities;
    });

    try {
      let listSupplierPki = await this.contractService.getListSupplier(2).toPromise();
      if(listSupplierPki) {
        this.networkList = listSupplierPki.map((supplier: any) => ({
          id: supplier.pkiIndex,
          name: supplier.supplierName,
          code: supplier.code
        }));
        this.networkList.sort((a, b) => a.id - b.id);
      }

      let listSupplierHsm = await this.contractService.getListSupplier(1).toPromise();
      if(listSupplierHsm) {
        this.supplierList = listSupplierHsm.map((item: any) => ({
          id: item.code,
          name: item.supplierName
        }));
      }
    } catch (error) {
      console.log('error', error)
    }
    //this.networkList = networkList;
    //this.supplierList = supplier;
    this.user = this.userService.getInforUser();
    this.appService.setTitle('user.information');
    this.appService.setSubTitle('');

    this.id = this.user.customer_id;
    let arrUser = await this.userService.getUserById(this.id).toPromise();
    this.isDisable = arrUser.login_type;

    this.userService.getUserById(this.id).subscribe(
      data => {
        if (data.login_type == null) {
          data.login_type = 'EMAIL';
        }
        if(data.login_type == 'EMAIL'){
          this.addInforForm.get('email')?.disable();
        }else if(data.login_type == 'SDT'){
          this.addInforForm.get('phone')?.disable();
        }else if(data.login_type == 'EMAIL_AND_SDT'){
          this.addInforForm.get('email')?.disable();
          this.addInforForm.get('phone')?.disable();
        }

        this.addInforForm = this.fbd.group({
          name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
          email: this.fbd.control(data.email, [Validators.required, Validators.email]),
          birthday: data.birthday==null?null:new Date(data.birthday),
          phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
          organizationId: this.fbd.control(data.organization_id, [Validators.required]),
          role: this.fbd.control(data.role_id, [Validators.required]),
          status: data.status,
          organization_change: data.organization_change,
          login_type: data.login_type ? data.login_type : 'EMAIL',
        });
        this.phoneOld = data.phone;

        //set name
        if(data.organization_id != null){
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
          this.roleService.getRoleById(data?.role_id).subscribe(data => {
            this.roleName = data.name;
          });
        }

        this.addKpiForm = this.fbd.group({
          phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
          networkKpi: data.phone_tel,
          is_show_phone_pki: data.is_show_phone_pki, 
        });
        this.isHsmIcorp = data.hsm_supplier === "mobifone";
        this.addHsmForm = this.fbd.group({
          nameHsm: this.fbd.control(data.hsm_name, Validators.pattern(parttern_input.new_input_form)),
          taxCodeHsm: this.fbd.control(data.tax_code, [
              Validators.pattern(parttern.cardid),
            ]
            ),
          supplier: this.fbd.control(data.hsm_supplier),
          uuid: this.fbd.control(data.uuid),
          password1Hsm: this.fbd.control(data.hsm_pass)
        });

        this.imgSignPCSelect = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].presigned_url:null;
        this.imgSignBucket = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].bucket:null;
        this.imgSignPath = data.sign_image != null && data.sign_image.length>0?data.sign_image[0].path:null;

        this.imgSignPCSelectMark = data.stampImage != null && data.stampImage.length>0?data.stampImage[0].presigned_url:null;
        this.imgSignBucketMark = data.stampImage != null && data.stampImage.length>0?data.stampImage[0].bucket:null;
        this.imgSignPathMark = data.stampImage != null && data.stampImage.length>0?data.stampImage[0].path:null;

        this.addInforFormOld = this.fbd.group({
          name: this.fbd.control(data.name, [Validators.required, Validators.pattern(parttern_input.new_input_form)]),
          email: this.fbd.control(data.email, [Validators.required, Validators.email]),
          birthday: data.birthday==null?null:new Date(data.birthday),
          phone: this.fbd.control(data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
          organizationId: this.fbd.control(data.organization_id, [Validators.required]),
          role: this.fbd.control(data.role_id, [Validators.required]),
          status: data.status,
        });
        this.addKpiFormOld = this.fbd.group({
          phoneKpi: this.fbd.control(data.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
          networkKpi: data.phone_tel,
          is_show_phone_pki: data.is_show_phone_pki,
        });
        this.addHsmFormOld = this.fbd.group({
          supplier: this.fbd.control(data.hsm_supplier),
          uuid: this.fbd.control(data.uuid),
          nameHsm: this.fbd.control(data.hsm_name, Validators.pattern(parttern_input.new_input_form)),
          taxCodeHsm: this.fbd.control(data.tax_code, [
            Validators.pattern(parttern.cardid),
          ]),
          password1Hsm: this.fbd.control(data.hsm_pass)
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
      }
    )
  }

  onSupplierChange(event: any) {
    this.isHsmIcorp = event.value === "mobifone";
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

    if(this.imgSignBucketMark != null && this.imgSignPathMark != null){
      const sign_image_content:any = {bucket: this.imgSignBucketMark, path: this.imgSignPathMark};
      const sign_image:never[]=[];
      (sign_image as string[]).push(sign_image_content);
      data.stampImage = sign_image;
    }

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
  }

  updateSign(data: any) {
    // Upload ảnh Sign
    if (this.selectedFileSign) {
      this.uploadService.uploadFile(this.selectedFileSign).subscribe(
        (dataFile: any) => {
          this.imgSignPath = dataFile.file_object.file_path;
          this.imgSignBucket = dataFile.file_object.bucket;

          if (this.imgSignBucket != null && this.imgSignPath != null) {
            const sign_image_content: any = { bucket: this.imgSignBucket, path: this.imgSignPath };
            const sign_image: never[] = [];
            (sign_image as string[]).push(sign_image_content);
            data.sign_image = sign_image;
          }

          // Sau khi upload ảnh Sign thành công, tiếp tục upload ảnh Mark (nếu có)
          this.uploadMark(data);
        },
        error => {
          console.error("Lỗi upload ảnh sign:", error);
          this.toastService.showErrorHTMLWithTimeout('Lỗi upload ảnh sign', "", 3000);
          this.spinner.hide();
        }
      );
    } else {
      // Nếu không có ảnh Sign mới, giữ lại thông tin ảnh cũ (nếu có)
      if (this.imgSignBucket && this.imgSignPath) {
        const sign_image_content: any = { bucket: this.imgSignBucket, path: this.imgSignPath };
        const sign_image: never[] = [];
        (sign_image as string[]).push(sign_image_content);
        data.sign_image = sign_image;
      }
      // Tiếp tục upload ảnh Mark (nếu có)
      this.uploadMark(data);
    }
  }
  uploadMark(data: any) {
    // Upload ảnh Mark
    if (this.selectedFileMark) {
      this.uploadService.uploadFile(this.selectedFileMark).subscribe(
        (dataFile: any) => {
          this.imgSignPathMark = dataFile.file_object.file_path;
          this.imgSignBucketMark = dataFile.file_object.bucket;

          if (this.imgSignBucketMark != null && this.imgSignPathMark != null) {
            const stamp_image_content: any = { bucket: this.imgSignBucketMark, path: this.imgSignPathMark };
            const stampImage: never[] = [];
            (stampImage as string[]).push(stamp_image_content);
            data.stampImage = stampImage;
          }

          // Sau khi upload ảnh Mark thành công, gọi API updateUser
          this.callUpdateUserAPI(data);
        },
        error => {
          console.error("Lỗi upload ảnh mark:", error);
          this.toastService.showErrorHTMLWithTimeout('Lỗi upload ảnh mark', "", 3000);
          this.spinner.hide();
        }
      );
    } else {
      // Nếu không có ảnh Mark mới, giữ lại thông tin ảnh cũ (nếu có)
      if (this.imgSignBucketMark && this.imgSignPathMark) {
        const stamp_image_content: any = { bucket: this.imgSignBucketMark, path: this.imgSignPathMark };
        const stampImage: never[] = [];
        (stampImage as string[]).push(stamp_image_content);
        data.stampImage = stampImage;
      }
      // Gọi API updateUser
      this.callUpdateUserAPI(data);
    }
  }
  callUpdateUserAPI(data: any) {
    this.userService.updateUser(data).subscribe(
      response => {
        this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 3000);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/main/user-infor']);
        });
        this.spinner.hide();
      },
      error => {
        console.error("Lỗi cập nhật thông tin người dùng:", error);
        this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 3000);
        this.spinner.hide();
      }
    );
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
      fileImageMark: this.attachFileMark,
      sign_image: [],
      login_type: this.addInforForm.value.login_type,
      phoneKpi: this.addKpiFormOld.value.phoneKpi,
      networkKpi: this.addKpiFormOld.value.networkKpi,
      is_show_phone_pki: this.addKpiFormOld.value.is_show_phone_pki,
      hsm_supplier: this.addHsmFormOld.value.supplier,
      uuid: this.addHsmFormOld.value.uuid,
      nameHsm: this.addHsmFormOld.value.nameHsm,

      organization_change: this.addInforForm.value.organization_change
    }
    //neu thay doi so dien thoai thi can check lai
    if(data.phone != this.phoneOld){
      this.userService.checkPhoneUser(data.phone, this.currentUser.loginType).subscribe(
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

  async updateSignUser() {
    this.submittedSign = true;
    if (this.addKpiForm.invalid || this.addHsmForm.invalid) {
      return;
    }
    this.spinner.show();

    // Kiểm tra và crop ảnh Sign (nếu có)
    if (this.selectedFileSign && this.showCropperSign) {
      this.selectedCode = 'sign';
      this.imageCropperSign.cropImage(); // Gọi hàm cropImage() của component ImageCropper
      return;
    }

    // Kiểm tra và crop ảnh Mark (nếu có)
    if (this.selectedFileMark && this.showCropperMark) {
      this.selectedCode = 'mark';
      this.imageCropperMark.cropImage(); // Gọi hàm cropImage() của component ImageCropper
      return;
    }

    // Nếu không có ảnh nào cần crop, tiếp tục quá trình
    this.continueUpdateSignUser();
  }

  continueUpdateSignUser() {
    const data = {
      id: this.id,
      name: this.addInforFormOld.value.name,
      email: this.addInforFormOld.value.email,
      birthday: this.addInforFormOld.value.birthday,
      phone: this.addInforFormOld.value.phone,
      organizationId: this.addInforFormOld.value.organizationId,
      role: this.addInforFormOld.value.role,
      status: this.addInforFormOld.value.status,

      fileImage: this.selectedFileSign,
      sign_image: [],

      fileImageMark: this.selectedFileMark,
      stampImage: [],

      phoneKpi: this.addKpiForm.value.phoneKpi,
      networkKpi: this.addKpiForm.value.networkKpi,
      is_show_phone_pki: this.addKpiForm.value.is_show_phone_pki,
      hsm_supplier: this.addHsmForm.value.supplier,
      uuid: this.addHsmForm.value.uuid,
      nameHsm: this.addHsmForm.value.nameHsm,
      taxCodeHsm: this.addHsmForm.value.taxCodeHsm,
      password1Hsm: this.addHsmForm.value.password1Hsm

    };

    this.updateSign(data);
  }

  attachFileMark: any = null;
  fileChangedAttach(e: any, code: string) {
    // Reset các biến liên quan đến ảnh trước khi xử lý file mới
    this.resetImage(code);

    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        if (file.size <= 50000000) {
          const extension = file.name.split('.').pop()?.toLowerCase();
          if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
            if (code === 'sign') {
              this.selectedFileSign = file;
              this.isSignSelected = true;
            } else if (code === 'mark') {
              this.selectedFileMark = file;
              this.isMarkSelected = true;
            }
            this.handleUpload(e, code);
          } else {
            this.toastService.showErrorHTMLWithTimeout("File tài liệu yêu cầu định dạng JPG, PNG, JPGE", "", 3000);
          }
        } else {
          this.selectedFileSign = null;
          this.selectedFileMark = null;
          this.isSignSelected = false;
          this.isMarkSelected = false;
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
      this.selectedCode = code;
      if (code === 'sign') {
        this.imgSignPCSelect = reader.result?.toString() || '';
        this.showCropperSign = true; // Hiển thị component cropper cho ảnh Sign
      } else if (code === 'mark') {
        this.imgSignPCSelectMark = reader.result?.toString() || '';
        this.showCropperMark = true; // Hiển thị component cropper cho ảnh Mark
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
  // Hàm chuyển đổi base64 thành File
  base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(',');
    let mime = '';
    const match = arr[0].match(/:(.*?);/);
    if (match && match[1]) {
      mime = match[1];
    }
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Hàm được gọi khi ảnh Sign đã được crop
  onCroppedSign(croppedImage: string) {
    this.croppedImageSign = croppedImage; // Lưu dữ liệu base64 của ảnh đã crop
    this.imgSignPCSelect = croppedImage; // Cập nhật ảnh hiển thị
    this.showCropperSign = false; // Ẩn component cropper
    this.selectedFileSign = this.base64ToFile(croppedImage, 'cropped-sign.png'); // Tạo File từ base64
    this.updateSignUser(); // Tiếp tục quá trình cập nhật
  }

  // Hàm được gọi khi ảnh Mark đã được crop
  onCroppedMark(croppedImage: string) {
    this.croppedImageMark = croppedImage; // Lưu dữ liệu base64 của ảnh đã crop
    this.imgSignPCSelectMark = croppedImage; // Cập nhật ảnh hiển thị
    this.showCropperMark = false; // Ẩn component cropper
    this.selectedFileMark = this.base64ToFile(croppedImage, 'cropped-mark.png'); // Tạo File từ base64
    this.updateSignUser(); // Tiếp tục quá trình cập nhật
  }
    // Hàm reset các biến liên quan đến ảnh
    resetImage(code: string) {
      if (code === 'sign') {
        this.selectedFileSign = null;
        this.croppedImageSign = null;
        this.imgSignPCSelect ='';
        this.showCropperSign = false;
        this.isSignSelected = false;
      } else if (code === 'mark') {
        this.selectedFileMark = null;
        this.croppedImageMark = null;
        this.imgSignPCSelectMark = '';
        this.showCropperMark = false;
        this.isMarkSelected = false;
      }
    }
}
