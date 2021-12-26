import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UnitService } from 'src/app/service/unit.service';
import { UploadService } from 'src/app/service/upload.service';
import { UserService } from 'src/app/service/user.service';
import { networkList } from "../../../data/data";

@Component({
  selector: 'app-infor-user',
  templateUrl: './infor-user.component.html',
  styleUrls: ['./infor-user.component.scss']
})
export class InforUserComponent implements OnInit {

  submitted = false;
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
  datas: any;
  attachFile:any;

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
      this.addInforForm = this.fbd.group({
        name: this.fbd.control("", [Validators.required]),
        email: this.fbd.control("", [Validators.required, Validators.email]),
        birthday: null,
        phone: this.fbd.control("", [Validators.required, Validators.pattern("[0-9 ]{10}")]),
        organizationId: this.fbd.control("", [Validators.required]),
        role: this.fbd.control("", [Validators.required]),
        status: 1
      });
     
      this.addKpiForm = this.fbd.group({
      phoneKpi: this.fbd.control(null, [Validators.pattern("[0-9 ]{10}")]),
      networkKpi: null
      });
   
    this.addHsmForm = this.fbd.group({
      nameHsm: null
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
    this.user = this.userService.getInforUser();
    this.appService.setTitle('THÔNG TIN TÀI KHOẢN');

    this.userService.getUserByEmail(this.user.email).subscribe(
      dataByEmail => {
        this.addInforForm = this.fbd.group({
          name: this.fbd.control(dataByEmail.name, [Validators.required]),
          email: this.fbd.control(dataByEmail.email, [Validators.required, Validators.email]),
          birthday: dataByEmail.birthday==null?null:new Date(dataByEmail.birthday),
          phone: this.fbd.control(dataByEmail.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
          organizationId: this.fbd.control(dataByEmail.organization_id, [Validators.required]),
          role: this.fbd.control(dataByEmail.type_id, [Validators.required]),
          status: dataByEmail.status
        });

        this.addKpiForm = this.fbd.group({
          phoneKpi: this.fbd.control(dataByEmail.phone_sign, [Validators.pattern("[0-9 ]{10}")]),
          networkKpi: dataByEmail.phone_tel
        });

        this.addHsmForm = this.fbd.group({
          nameHsm: dataByEmail.hsm_name
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 1000);
      }
    )
  }

  updateInforUser(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addInforForm.invalid) {
      return;
    }
    const data = {
      id: "",
      name: this.addInforForm.value.name,
      email: this.addInforForm.value.email,
      birthday: this.addInforForm.value.birthday,
      phone: this.addInforForm.value.phone,
      organizationId: this.addInforForm.value.organizationId,
      role: this.addInforForm.value.role,
      status: this.addInforForm.value.status
    }
    console.log(data);
    
    this.userService.updateUser(data).subscribe(
      data => {
        console.log(data);
        this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 10000);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/user-infor']);
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 1000);
      }
    )
  }

  updateSignFileImageUser(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addInforForm.invalid) {
      return;
    }
    const data = {
      id: "",
      name: this.addInforForm.value.name,
      email: this.addInforForm.value.email,
      birthday: this.addInforForm.value.birthday,
      phone: this.addInforForm.value.phone,
      organizationId: this.addInforForm.value.organizationId,
      role: this.addInforForm.value.role,
      status: this.addInforForm.value.status,
      phoneKpi: this.addInforForm.value.phoneKpi,
      networkKpi: this.addInforForm.value.networkKpi,
      nameHsm: this.addInforForm.value.nameHsm,
      fileImage: this.attachFile,
      sign_image: []
    }
    console.log(data);
    
    
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
    }
    this.toastService.showSuccessHTMLWithTimeout("no.update.information.success", "", 10000);
  
    this.toastService.showSuccessHTMLWithTimeout("no.update.sign.file.image.success", "", 10000);
  }

  updateSignKpiUser(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addKpiForm.invalid) {
      return;
    }
    const data = {
      phoneKpi: this.addKpiForm.value.phoneKpi,
      networkKpi: this.addKpiForm.value.networkKpi
    }
    console.log(data);

    this.userService.updateUser(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout("no.update.sign.kpi.success", "", 10000);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/user-infor']);
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 1000);
      }
    )
  }

  updateSignHsmUser(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addHsmForm.invalid) {
      return;
    }
    const data = {
      nameHsm: this.addHsmForm.value.nameHsm
    }
    console.log(data);
    
    this.userService.updateUser(data).subscribe(
      data => {
        this.toastService.showSuccessHTMLWithTimeout("no.update.sign.hsm.success", "", 10000);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/main/user-infor']);
        });
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Cập nhật thông tin thất bại', "", 1000);
      }
    )
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
      console.log(reader.result);
      this.imgSignPCSelect = reader.result? reader.result.toString() : '';
    };
  }

  addFileAttach() {
    // @ts-ignore
    document.getElementById('attachFileSignature').click();
  }

}
