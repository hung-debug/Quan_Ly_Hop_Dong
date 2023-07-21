import { Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DigitalCertificateService } from 'src/app/service/digital-certificate.service';
import { parttern_input } from "../../../config/parttern";
import { parttern } from '../../../config/parttern';
import { log } from 'console';
import { UnitService } from 'src/app/service/unit.service';
@Component({
  selector: 'app-user',
  templateUrl: './digital-certificate-edit.component.html',
  styleUrls: ['./digital-certificate-edit.component.scss']
})

export class DigitalCertificateEditComponent implements OnInit {
  datas: any;
  addForm: FormGroup;
  emailUser: any[];
  email: any = [];
  status: any = "";
  keystoreSerialNumber: any = "";
  keyStoreFileName: any = "";
  keystoreDateStart: any = "";
  keystoreDateEnd: any = "";
  subject: any = "";
  sub: any[];
  unit: any = "";
  pattern = parttern;
  emailList: any = [];
  submitted = false;
  listSelectedEmail: any = [];
  listID: any[];
  errorEmail: any = '';
  errorOrg: any = '';
  orgList: Array<any> = [];
  orgIdSelected: any;
  code:string = "";
  orgID: any;
  selectedNodeOrganization:any = '';
  listOrgCombobox: any[];
  organization_id:any = "";
  lang: any;
  orgListTmp: any[] = [];
  array_empty: any = [];

  get f() { return this.addForm.controls; }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private appService: AppService,
    public dialogRef: MatDialogRef<DigitalCertificateEditComponent>,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private DigitalCertificateService: DigitalCertificateService,
    private unitService: UnitService,
  ) {
    this.addForm = this.fbd.group({
      password: this.fbd.control("", [Validators.pattern(parttern.password)]),
      status: 1,
      email: this.fbd.control("", [Validators.required]),
      orgId: this.fbd.control("", [Validators.required])
    });
  }
  async ngOnInit(): Promise<void> {
    this.datas = this.data;

    // await this.getData();
    // await this.getListAllEmail();
    // this.getOrg({ filter: '' })
    this.unitService.getUnitList('', '').subscribe(data => {
      this.getData()
      if(this.lang == 'vi')
        this.orgListTmp.push({name: "Tất cả", id:""});
      else if(this.lang == 'en')
        this.orgListTmp.push({name: "All", id:""});

      let dataUnit = data.entities.sort((a:any,b:any) => a.path.toString().localeCompare(b.path.toString()));
      for(var i = 0; i < dataUnit.length; i++){
        this.orgListTmp.push(dataUnit[i]);
      }

      this.orgList = this.orgListTmp;
      this.convertData();
      this.selectedNodeOrganization = this.listOrgCombobox.filter((p: any) => p.data == this.organization_id);
    }, error => {
      setTimeout(() => this.router.navigate(['/login']));
      this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
    }
    );

  }

  async getData() {
    await this.DigitalCertificateService.getCertById(this.datas.id).toPromise().then(
      data => {
        this.emailList.push(...data.customers);

        const listCustomer = data.customers.map((item: any) => item.email);
        this.addForm = this.fbd.group({
          password: this.fbd.control("", [Validators.pattern(parttern.password)]),
          status: this.fbd.control(data.status),
          email: this.fbd.control(listCustomer, [Validators.required]),
          orgId: this.fbd.control('', [Validators.required])
        });
        this.keystoreSerialNumber = data.keystoreSerialNumber,
          this.keyStoreFileName = data.keyStoreFileName,
          this.keystoreDateStart = data.keystoreDateStart,
          this.keystoreDateEnd = data.keystoreDateEnd,
          this.status = data.status,
          this.sub = data.certInformation.split(",")
        const subjectt = this.sub.find(item => item.includes('CN='))
        this.subject = subjectt.split("=")[1]
        const unitt = this.sub.find(item => item.includes('O='))
        this.unit = unitt.split("=")[1]
        this.listID = data.customers
        this.orgID = data.orgAdminCreate.toString()
        // this.addForm.patchValue({ orgId: this.orgID });
      }
    )

  }

  changeOrg(){
    this.organization_id = this.selectedNodeOrganization?this.selectedNodeOrganization.data:"";
    this.addForm.patchValue({
      email: this.addForm.value.email? this.addForm.value.email : []
    })
    this.getListAllEmailOnFillter(this.organization_id)
  }

  convertData(){
    this.array_empty=[];
    this.orgList.forEach((element: any, index: number) => {

      let is_edit = false;
      let dataChildren = this.findChildren(element);
      let data:any="";
      data = {
        label: element.name,
        data: element.id,
        expanded: true,
        children: dataChildren
      };

      this.array_empty.push(data);
      //this.removeElementFromStringArray(element.id);
    })
    this.listOrgCombobox = this.array_empty;
  }

  findChildren(element:any){
    let dataChildren:any[]=[];
    let arrCon = this.orgList.filter((p: any) => p.parent_id == element.id);

    arrCon.forEach((elementCon: any, indexCOn: number) => {
      let is_edit = false;

      dataChildren.push(
      {
        label: elementCon.name,
        data: elementCon.id,
        expanded: true,
        children: this.findChildren(elementCon)
      });
      this.removeElementFromStringArray(elementCon.id);
    })
    return dataChildren;
  }
  removeElementFromStringArray(element: string) {
    this.orgList.forEach((value,index)=>{
        if(value.id==element){
          this.orgList.splice(index,1);
        }

    });
  }

  handleCancel() {
    this.dialogRef.close();
  }
  async getListAllEmail(event?: any) {
    this.emailList = []
    this.addForm.patchValue({ email: [''] });
    let email: any = null
    if (!event) {
      email = ""
    } else {
      email = event.filter;
    }

    await this.DigitalCertificateService.getListOrgByEmail(email || '',event?.value || '').toPromise().then((response) => {
      if (response && response.length > 0) {
        response.forEach((item: any) => {
          if (!this.emailList.some((existingItem: any) => existingItem.email === item.email)) {
            this.emailList.push(item);
          }
        });
      }

    });

    this.spinner.hide();
  }

  onSelectionChange() {
    let selectedValues = []
    selectedValues = this.addForm.get('email')?.value;
    selectedValues.forEach((value: any) => {
      const option = this.emailList.find((opt: any) => opt.email === value);
      if (option) {
        value = option.email;
      }
    });
    this.addForm.patchValue({ email: selectedValues });
  }
  save() {
    this.submitted = true;
    if(!this.validData()){
      return;
    }
    let id_customer = this.listID.filter((value, index, self) => {
      // Kiểm tra xem có index đầu tiên của value.id trong mảng không
      return self.findIndex(obj => obj.id === value.id) === index;
    }).map(item => item.id);

    let checkDelete = false;

    // moi lan save thi can xoa toan bo list customer trc r add email moi vao
    this.DigitalCertificateService.deleteUserCTS(this.datas.id, id_customer)
      .subscribe((deleteUser: any) => {
        if (deleteUser.success == false) {
          this.toastService.showErrorHTMLWithTimeout(deleteUser.message, "", 3000)
        } else {
          checkDelete = true;
          this.DigitalCertificateService.updateCTS(this.data.id, this.addForm.value.status, this.addForm.value.email).subscribe(response => {
            if (response.success == false) {
              this.toastService.showErrorHTMLWithTimeout(response.message, "", 3000)
            }
            if (checkDelete = true) {
              this.toastService.showSuccessHTMLWithTimeout('Cập nhật thông tin chứng thư số thành công', "", 3000)
              this.dialog.closeAll();
              window.location.reload();
            }
          })
        }
      })
  }

  getListAllEmailOnFillter(event: any) {
    this.emailList = []
    if (this.addForm.value.email.length > 0) {
      for (const item of this.addForm.value.email) {
        this.emailList.push({email: item})
      }
    }
    let email: any = event.filter || ''
    this.DigitalCertificateService.getListOrgByEmail(email, this.addForm.value.orgId.data || '').subscribe((response) => {
      if (response && response.length > 0) {
        for (const item of response) {
          if (item?.email != this.emailList.find((value: any) => value.email == item.email)?.email) {
            this.emailList.push({email: item.email})
          }
        }
      }
    });
  }

  validateEmail() {
    this.errorEmail = "";
    if (!this.addForm.controls.email.valid) {
      this.errorEmail = "error.email.required";
      return false;
    }
    return true;
  }

  clearError() {
    // if (this.datas.contractFile) {
    //   this.errorContractFile = '';
    // }
  }
  validateOrg() {
    this.errorOrg = "";
    if (!this.addForm.controls.orgId.valid) {
      this.errorOrg = "error.org.required";
      return false;
    }
    return true;
  }

  validData() {
    this.clearError();
    let validateResult = {
      email: this.validateEmail(),
      orgId:this.validateOrg()
    }
    if (!validateResult.email|| !validateResult.orgId) {
      return false;
    }
    return true
  }
}
