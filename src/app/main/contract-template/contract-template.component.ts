import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/service/app.service';
import { ContractTemplateService } from 'src/app/service/contract-template.service';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { DeleteContractTemplateDialogComponent } from './dialog/delete-contract-template-dialog/delete-contract-template-dialog.component';
import { ReleaseContractTemplateDialogComponent } from './dialog/release-contract-template-dialog/release-contract-template-dialog.component';
import { ShareContractTemplateDialogComponent } from './dialog/share-contract-template-dialog/share-contract-template-dialog.component';
import { StopContractTemplateDialogComponent } from './dialog/stop-contract-template-dialog/stop-contract-template-dialog.component';
import { sideList } from 'src/app/config/variable';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-contract-template',
  templateUrl: './contract-template.component.html',
  styleUrls: ['./contract-template.component.scss']
})
export class ContractTemplateComponent implements OnInit {
  public contractsTemplate: any[] = [];
  p:number = 1;
  page:number = 5;
  pageStart:number = 0;
  pageEnd:number = 0;
  pageTotal:number = 0;
  inputTimeout: any
  numberPage: number;
  enterPage: number = 1;
  isShare: string = 'off';
  stateOptions: any[];
  contractTypeList: any[] = [];

  name:any="";
  type:any="";
  loaded:boolean=false;

  //phan quyen
  isQLMHD_01:boolean=false;  //them moi mau hop dong
  isQLMHD_02:boolean=true;  //sua mau hop dong
  isQLMHD_03:boolean=true;  //ngung phat hanh mau hop dong
  isQLMHD_04:boolean=true;  //phat hanh mau hop dong
  isQLMHD_05:boolean=true;  //chia se mau hop dong
  isQLMHD_06:boolean=false;  //tim kiem mau hop dong
  isQLMHD_07:boolean=true;  //xoa mau hop dong
  isQLMHD_08:boolean=true;  //xem thong tin chi tiet mau hop dong
  isQLMHD_09:boolean=true;  //Clone mau hop dong
  isQLHD_14:boolean=true;   //tao hop dong don le theo mau
  isQLHD_15:boolean=true;   //tao hop dong don le theo lo

  constructor(private appService: AppService,
              private contractTemplateService: ContractTemplateService,
              private router: Router,
              private dialog: MatDialog,
              private contractTypeService: ContractTypeService,
              private userService: UserService,
              private roleService: RoleService,
              private toastService: ToastService,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              ) {

    this.stateOptions = [
      { label: 'contract-template.create', value: 'off' },
      { label: 'contract-template.share', value: 'on' },
    ];
  }

  ngOnInit(): void {
    this.appService.setTitle('contract-template.list');
    this.appService.setSubTitle('');
    //lay id user
    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data?.role_id).subscribe(
          async data => {
            let listRole: any[];
            listRole = data.permissions;
            this.isQLMHD_01 = listRole.some(element => element.code == 'QLMHD_01');
            this.isQLMHD_02 = listRole.some(element => element.code == 'QLMHD_02');
            this.isQLMHD_03 = listRole.some(element => element.code == 'QLMHD_03');
            this.isQLMHD_04 = listRole.some(element => element.code == 'QLMHD_04');
            this.isQLMHD_05 = listRole.some(element => element.code == 'QLMHD_05');
            this.isQLMHD_06 = listRole.some(element => element.code == 'QLMHD_06');
            this.isQLMHD_07 = listRole.some(element => element.code == 'QLMHD_07');
            this.isQLMHD_08 = listRole.some(element => element.code == 'QLMHD_08');
            this.isQLMHD_09 = listRole.some(element => element.code == 'QLMHD_09');
            this.isQLHD_14 = listRole.some(element => element.code == 'QLHD_14');
            this.isQLHD_15 = listRole.some(element => element.code == 'QLHD_15');

            this.getContractTemplateList();

            this.getContractType();

            this.loaded = true;

          }, error => {
            setTimeout(() => this.router.navigate(['/login']));
            this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);

          }
        );

      }, error => {
        setTimeout(() => this.router.navigate(['/login']));
        this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);

      }
    )

    this.route.queryParams.subscribe(async params => {
      if (typeof params.page != 'undefined' && params.page) {
        this.p = params.page;
      }
    });

  }
  async getContractType(){
    await this.contractTypeService.getContractTemplateTypeList("", "").toPromise().then(response => {
      this.contractTypeList = response;
    });
  }


  async getContractTemplateList(){
    this.enterPage = this.p;
    //get list contract template
    await this.contractTemplateService.getContractTemplateList(this.isShare, this.name, this.type, this.p, this.page).toPromise().then(response => {
      this.contractsTemplate = response.entities;
      this.pageTotal = response.total_elements;
      if(this.pageTotal == 0){
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      }else{
        this.setPage();
      }
    });
  }

  onInput(event: any) {
    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      this.autoSearchEnterPage(event);
    }, 1000);
  }

  validateInput(event: KeyboardEvent) {
    const input = event.key;
    if (input === ' ' || (isNaN(Number(input)) && input !== 'Backspace')) {
      event.preventDefault();
    }
  }

  autoSearchEnterPage(event: any) {
    if(event.target.value && event.target.value != 0 && event.target.value <= this.numberPage) {
      this.p = this.enterPage;
    } else {
      this.enterPage = this.p;
    }
    this.getContractTemplateList();
  }

  countPage() {
    this.numberPage = Math.ceil(this.pageTotal / this.page);
    return this.numberPage;
  }

  sortParticipant(list:any){
    return list.sort((beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type);
  }

  getNameOrganization(item:any, index:any){
    if(item.type == 1){
      return sideList[0].name + " : " + item.name;
    }else{
      let partnerLead = item.recipients.filter((p: any) => p.role == 1).length;
      let partnerView = item.recipients.filter((p: any) => p.role == 2).length;
      let partnerSign = item.recipients.filter((p: any) => p.role == 3).length;
      let partnerDoc = item.recipients.filter((p: any) => p.role == 4).length;
      let side = "";
      let conn = "";
      if(partnerLead > 0){
        side += conn + "Người điều phối (" + partnerLead + ")";
        conn = ", ";
      }
      if(partnerView > 0){
        side += conn + "Người xem xét (" + partnerView + ")";
        conn = ", ";
      }
      if(partnerSign > 0){
        side += conn + "Người ký (" + partnerSign + ")";
        conn = ", ";
      }
      if(partnerDoc > 0){
        side += conn + "Văn thư (" + partnerDoc + ")";
        conn = ", ";
      }
      return sideList[index].name + " : " + side;
    }

  }


  searchContract(){
    this.p = 1;
    this.enterPage = 1;
    this.getContractTemplateList();
  }

  setPage(){
    this.pageStart = (this.p-1)*this.page+1;
    this.pageEnd = (this.p)*this.page;
    if(this.pageTotal < this.pageEnd){
      this.pageEnd = this.pageTotal;
    }
  }

  add(){
    this.router.navigate(['/main/contract-template/form/add']);
  }

  cloneContractTemplateCall(id: number) {
      this.spinner.show();
      this.contractTemplateService.cloneContractTemplate(id).subscribe((res: any) => {
        //
        this.toastService.showSuccessHTMLWithTimeout(`Sao chép mẫu tài liệu ${res.name} thành công!`, "", 3000)
        this.getContractTemplateList();

      }, (error: HttpErrorResponse) => {
        this.toastService.showErrorHTMLWithTimeout(error.message, "", 3000)
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
      })
  }

  openEdit(id: number) {
    this.getDataContract(id, 'edit')
  }

  getDataContract(id: number, action: string) {
    setTimeout(() => {
      void this.router.navigate(['main/contract-template/form/edit/' + id]);
    }, 100)
  }

  openDetail(id:number){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/contract-template/form/detail/' + id],
      {
        queryParams: {
          'page': this.p,
        },
        skipLocationChange: false
      });
    });
  }

  deleteContractTemplate(id:any){
    const data = {
      title: 'XÁC NHẬN XÓA MẪU TÀI LIỆU',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteContractTemplateDialogComponent, {
      width: '520px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }

  stopContractTemplate(id:any){
    const data = {
      title: 'XÁC NHẬN DỪNG PHÁT HÀNH MẪU TÀI LIỆU',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(StopContractTemplateDialogComponent, {
      width: '620px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }

  releaseContractTemplate(id:any){
    const data = {
      title: 'XÁC NHẬN PHÁT HÀNH MẪU TÀI LIỆU',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ReleaseContractTemplateDialogComponent, {
      width: '560px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }

  shareContractTemplate(id:any){
    const data = {
      title: 'share.contract',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ShareContractTemplateDialogComponent , {
      width: '700px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }

  addContractForm(id: number) {
    this.router.navigate(['main/form-contract/add-form/' + id]);
  }

  addContractBatch(id: number) {
    this.router.navigate(['main/form-contract/add-batch/' + id]);
  }

  cloneFullStream(id: number) {
    setTimeout(() => {
      void this.router.navigate(['main/form-contract/add/' + id + '/KEEP_ALL']);
    }, 100)
  }

  cloneStreamOrganizational(id: number) {
    setTimeout(() => {
      void this.router.navigate(['main/form-contract/add/' + id + '/KEEP_MY_ORG']);
    }, 100)
  }
}
