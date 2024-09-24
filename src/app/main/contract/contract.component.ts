import { UploadService } from 'src/app/service/upload.service';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';

import { ToastService } from 'src/app/service/toast.service';
import {  HttpErrorResponse } from '@angular/common/http';
import { CancelContractDialogComponent } from './dialog/cancel-contract-dialog/cancel-contract-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterListDialogComponent } from './dialog/filter-list-dialog/filter-list-dialog.component';
import { ContractConnectDialogComponent } from './dialog/contract-connect-dialog/contract-connect-dialog.component';
import { AddConnectDialogComponent } from './dialog/add-connect-dialog/add-connect-dialog.component';
import { ShareContractDialogComponent } from './dialog/share-contract-dialog/share-contract-dialog.component';
import { DeleteContractDialogComponent } from './dialog/delete-contract-dialog/delete-contract-dialog.component';
import { DeleteMultiContractDialogComponent } from './dialog/delete-multi-contract-dialog/delete-multi-contract-dialog.component';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';
import { sideList } from 'src/app/config/variable';
import { DialogReasonCancelComponent } from '../contract-signature/shared/model/dialog-reason-cancel/dialog-reason-cancel.component';
import { ContractSignatureService } from '../../service/contract-signature.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { EditExpirationSigningTimeComponent } from './edit-expiration-signing-time/edit-expiration-signing-time.component';
import { UploadAttachFilesComponent } from './dialog/upload-attach-files-dialog/upload-attach-files-dialog.component';
import { ProcessingHandleEcontractComponent } from '../contract-signature/shared/model/processing-handle-econtract/processing-handle-econtract.component';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit, AfterViewInit {
  datas: any;
  data_contract: any;
  idContract: any;
  action: string;
  status: string;
  type: string;
  private sub: any;
  public contracts: any[] = [];
  public contractsDownload: any[] = [];
  p: number = 1;
  page: number = 10;
  pageDownload: number = 10;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  totalPage: number = 0;
  statusPopup: number = 1;
  notificationPopup: string = '';
  pageOptions: any[] = [10, 20, 50, 100];
  scrollY: any;
  inputTimeout: any
  numberPage: number;
  enterPage: number = 1;
  title: any = "";
  id: any = "";
  notification: any = "";
  isOrg: string = 'off';

  stateOptions: any[];
  organization_id: any = "";

  //filter contract
  searchObj: any = {
    filter_name: "",
    partner: ""
  }
  filter_name: any = "";
  partner: any = "";
  filter_type: any = "";
  filter_contract_no: any = "";
  filter_from_date: any = "";
  filter_to_date: any = "";
  filter_status: any = "";
  filter_remain_day: any = "";
  filter_is_org_me_and_children: any = "";
  message: any;
  subscription: Subscription;
  roleMess: any = "";
  checkedAll: boolean = false;
  typeDisplay: string = 'view';
  dataDeleteDraftChecked: any[] = [];
  idCheckBox: any[] = [];
  color: any;
  backgroundColor: any;

  //phan quyen
  isQLHD_01: boolean = true;  //them moi hop dong
  isQLHD_02: boolean = true;  //sua hop dong
  isQLHD_03: boolean = true;  //xem danh sach hop dong cua to chuc toi va to chuc con
  isQLHD_04: boolean = true;  //xem danh sach hop dong cua to chuc toi
  isQLHD_05: boolean = true;  //Xem danh sach hop dong cua toi
  isQLHD_06: boolean = true;  //tim kiem hop dong
  isQLHD_07: boolean = true;  //xem thong tin chi tiet hop dong
  isQLHD_08: boolean = true;  //sao chep hop dong
  isQLHD_09: boolean = true;  //huy hop hong
  isQLHD_10: boolean = true;  //xem lich su hop dong
  isQLHD_11: boolean = true;  //tao hop dong lien quan
  isQLHD_12: boolean = true;  //xem hop dong lien quan
  isQLHD_13: boolean = true;  //chia se hop dong
  isQLHD_16: boolean = true;  //thanh lý hợp đồng


  constructor(private appService: AppService,
    private contractService: ContractService,
    private ContractSignatureService: ContractSignatureService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private uploadService: UploadService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private roleService: RoleService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private activeRoute: ActivatedRoute,
  ) {

    this.stateOptions = [
      { label: 'contract.me', value: 'off' },
      { label: 'contract.organization', value: 'on' },
    ];
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      if (typeof params.filter_name != 'undefined' && params.filter_name) {
        this.filter_name = params.filter_name;
      }

      if (typeof params.filter_type != 'undefined' && params.filter_type) {
        this.filter_type = params.filter_type;
      } else {
        this.filter_type = "";
      }
      if (typeof params.filter_contract_no != 'undefined' && params.filter_contract_no) {
        this.filter_contract_no = params.filter_contract_no;
      } else {
        this.filter_contract_no = "";
      }
      if (typeof params.filter_from_date != 'undefined' && params.filter_from_date) {
        this.filter_from_date = params.filter_from_date;
      } else {
        this.filter_from_date = "";
      }
      if (typeof params.filter_to_date != 'undefined' && params.filter_to_date) {
        this.filter_to_date = params.filter_to_date;
      } else {
        this.filter_to_date = "";
      }

      if (typeof params.isOrg != 'undefined' && params.isOrg) {
        this.isOrg = params.isOrg;
      }

      if (typeof params.status != 'undefined' && params.status) {
        this.status = params.status;
      } else {
        this.status = "";
      }

      if (typeof params.page != 'undefined' && params.page) {
        this.p = params.page;
      }

      if (typeof params.organization_id != 'undefined' && params.organization_id) {
        this.organization_id = params.organization_id;
      } else {
        this.organization_id = "";
      }

      this.sub = this.route.params.subscribe(params => {
        this.contracts = [];
        this.pageTotal = 0;
        this.action = params['action'];
        this.status = params['status'];

        //set status
        this.convertStatusStr();

        this.appService.setTitle("contract.list.created");

        //lay id user
        let userId = this.userService.getAuthCurrentUser().id;
        this.userService.getUserById(userId).subscribe(
          data => {
            //lay id role
            this.roleService.getRoleById(data?.role_id).subscribe(
              data => {
                let listRole: any[];
                listRole = data.permissions;
                this.isQLHD_01 = listRole.some(element => element.code == 'QLHD_01');
                this.isQLHD_02 = listRole.some(element => element.code == 'QLHD_02');
                this.isQLHD_03 = listRole.some(element => element.code == 'QLHD_03');
                this.isQLHD_04 = listRole.some(element => element.code == 'QLHD_04');
                this.isQLHD_05 = true;
                this.isQLHD_06 = listRole.some(element => element.code == 'QLHD_06');
                this.isQLHD_07 = listRole.some(element => element.code == 'QLHD_07');
                this.isQLHD_08 = listRole.some(element => element.code == 'QLHD_08');
                this.isQLHD_09 = listRole.some(element => element.code == 'QLHD_09');
                this.isQLHD_10 = listRole.some(element => element.code == 'QLHD_10');
                this.isQLHD_11 = listRole.some(element => element.code == 'QLHD_11');
                this.isQLHD_12 = listRole.some(element => element.code == 'QLHD_12');
                this.isQLHD_13 = listRole.some(element => element.code == 'QLHD_13');
                this.isQLHD_16 = listRole.some(element => element.code == 'QLHD_16');

                //neu co quyen xem danh sach hop dong cua to chuc minh va to chuc con
                this.filter_is_org_me_and_children = this.isQLHD_03;

                this.getContractList();

                if(sessionStorage.getItem('createdPageNum')) this.page = Number(sessionStorage.getItem('createdPageNum'));
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
      });
    });
  }


  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    if(window.scrollY>0){
      this.scrollY = window.scrollY;
    }
  }

  cancelMany() {
    let contractsSignManyChecked = this.contracts.filter(
      (opt) => opt.checked
    );

    let idMany = contractsSignManyChecked
      .filter((opt) => opt.checked)
      .map((opt) => opt.id);

    if (idMany.length == 0) {
      this.toastService.showErrorHTMLWithTimeout("not.select.contract", "", 3000);
      return;
    }

    this.cancelContract(idMany);
  }

  dataReleaseChecked: any[] = [];
  toggleOneRelease(item: any){
    let data = {
      id: item.participants[0]?.contract_id,
      selectedId: item.id
    }
    if(this.dataReleaseChecked.some(element => element.id === data.id)){
      this.dataReleaseChecked = this.dataReleaseChecked.filter((item) => {
        return item.id != data.id
      })
    } else {
      this.dataReleaseChecked.push(data);
    }
  }


  dataChecked: any[] = [];
  toggleOneDownload(item: any){


    let data = {
      id: item.participants[0]?.contract_id,
      selectedId: item.id
    }
    if(this.dataChecked.some(el => el.id === data.id)){
      this.dataChecked = this.dataChecked.filter((item) => {
        return item.id != data.id
      })
    } else {
      this.dataChecked.push(data);
    }
  }

  onCheckboxChange(item: any) {
    if (item.checked) {
      this.idCheckBox.push(item.id);  
    } else {
      const index = this.idCheckBox.indexOf(item.id);
      if (index > -1) {
        this.idCheckBox.splice(index, 1);
      }
    }
    console.log('this.idCheckBox', this.idCheckBox)
  }

  selectContract(item: any){
    if(!item.checked) this.checkedAll = false;
    else {
      let checked = true;
      for (let i = 0; i < this.contracts.length; i++){
        if(!this.contracts[i].checked) {
          checked = false;
          break;
        }
      }

      this.checkedAll = checked;
    }
  }

  toggleReleaseAll(checkedAll: boolean){
    this.dataReleaseChecked = [];
    if(checkedAll){


      for(let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = true;
        this.dataReleaseChecked.push({
          id: this.contracts[i].participants[0]?.contract_id,
          selectedId : this.contracts[i].id
        })
      }
    }

  }

  toggleDownload(checkedAll: boolean){
    this.dataChecked = [];

    if(checkedAll){


      for(let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = true;
        if(this.contracts[i].participants && this.contracts[i].participants.length) {
          this.dataChecked.push({
            id: this.contracts[i].participants[0]?.contract_id,
            selectedId : this.contracts[i].id
          })
        }
      }
    }
  }


  releaseMany(){
    if(this.dataReleaseChecked.length === 0){
      return;
    }
    this.spinner.show();
    const ids = this.dataReleaseChecked.map(el => el.id);
    this.contractService.confirmContractRelease(ids).subscribe(
      (data) => {
        this.toastService.showSuccessHTMLWithTimeout('release.contract.success', '', 3000);
        this.spinner.hide();
        window.location.reload();
      },
      (error) => {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout('release.contract.error', '', 3000);
      }
    )
  }

  async downloadManyContract() {
    if (this.dataChecked.length === 0) {
      this.toastService.showErrorHTMLWithTimeout('not.select.contract','',3000);
      return
    }
    this.spinner.show();
    const myDate = new Date();
    // Replace 'yyyy-MM-dd' with your desired date format
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy');
    const ids = await this.dataChecked.map(el => el.id).toString();
    
    this.ContractSignatureService.getContractMyProcessListDownloadMany(ids).subscribe(
      (data) => {
        const file = new Blob([data], {type: 'application/zip'});
        let fileUrl = window.URL.createObjectURL(file);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = fileUrl;
        a.download = 'Contracts'+ '_' + formattedDate;
        a.click();
        window.URL.revokeObjectURL(fileUrl);
        a.remove();
        // window.location.reload();
        this.downloadMany();
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout('no.contract.download.file.error', '', 3000);
      }
    );
  }

  downloadMany() {
    this.spinner.show();
    this.typeDisplay = 'downloadMany';
    this.roleMess = "";
    if (this.isOrg == 'on' && !this.isQLHD_04 && !this.isQLHD_03) {
      this.roleMess = "Danh sách hợp đồng tổ chức chưa được phân quyền";
    }

    if (!this.roleMess) {
      let isOrg = this.isOrg;

      if(!this.isQLHD_03 && !this.isQLHD_04) {
        isOrg ='off';
      }

    this.contractService.getContractList(isOrg, this.organization_id, this.filter_name, this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page).subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      this.totalPage = data.total_pages;
      
      this.checkedAll = false;
      this.dataChecked = [];
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPageDownload();
      }
      const checkedDownloadFiles = this.dataChecked.map(el=>el.selectedId)

      for(let i = 0; i< this.contracts.length; i++){
        let checkIf = checkedDownloadFiles.some(el => el === this.contracts[i].id)
        if(checkIf){
          this.contracts[i].checked = true;
        } else {
          this.contracts[i].checked = false;
        }
      }
        this.spinner.hide();
      },
        (error) => {
          setTimeout(() => this.router.navigate(['/login']));
          this.toastService.showErrorHTMLWithTimeout(
            'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!',
            '',
            3000
          );
        }
      );
    }
  }

  release() {
    this.spinner.show();
    this.typeDisplay = 'release';
    this.roleMess = "";

    if (this.isOrg == 'on' && !this.isQLHD_04 && !this.isQLHD_03) {
      this.roleMess = "Danh sách hợp đồng tổ chức chưa được phân quyền";
    }

    if (!this.roleMess) {

      let isOrg = this.isOrg;

      if(!this.isQLHD_03 && !this.isQLHD_04) {
        isOrg ='off';
      }

    this.contractService.getContractList(isOrg, this.organization_id, this.filter_name, this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page, true).subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      this.checkedAll = false;
      this.dataChecked = [];
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPageDownload();
      }
      const checkedDownloadFiles = this.dataChecked.map(el=>el.selectedId)

      for(let i = 0; i< this.contracts.length; i++){
        let checkIf = checkedDownloadFiles.some(el => el === this.contracts[i].id)
        if(checkIf){
          this.contracts[i].checked = true;
        } else {
          this.contracts[i].checked = false;
        }
      }

        this.spinner.hide();
      },
        (error) => {
          setTimeout(() => this.router.navigate(['/login']));
          this.toastService.showErrorHTMLWithTimeout(
            'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!',
            '',
            3000
          );
        }
      );
    }
  }

  multiDeleteDraft(action: string){
    this.spinner.show();
    this.typeDisplay = 'multiDeleteDraft';
    this.roleMess = "";
    if (this.isOrg == 'off' && !this.isQLHD_05) {
      this.roleMess = "Danh sách hợp đồng của tôi chưa được phân quyền";

    } else if (this.isOrg == 'on' && !this.isQLHD_04) {
      this.roleMess = "Danh sách hợp đồng tổ chức của tôi chưa được phân quyền";
    }
    if (!this.roleMess) {

      let isOrg = this.isOrg;

      if(!this.isQLHD_03) {
        isOrg ='off';
      }
    if (action == 'multiDelete') {
      this.p = 0
    }

    this.contractService.getContractList(isOrg, this.organization_id, this.filter_name, this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page).subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      this.checkedAll = false;
      this.dataChecked = [];
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPageDownload();
      }
      const checkedDownloadFiles = this.dataChecked.map(el=>el.selectedId)

      for(let i = 0; i< this.contracts.length; i++){
        let checkIf = checkedDownloadFiles.some(el => el === this.contracts[i].id)
        if(checkIf){
          this.contracts[i].checked = true;
        } else {
          this.contracts[i].checked = false;
        }
      }

        this.spinner.hide();
      },
        (error) => {
          setTimeout(() => this.router.navigate(['/login']));
          this.toastService.showErrorHTMLWithTimeout(
            'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!',
            '',
            3000
          );
        }
      );
    }
    this.dataDeleteDraftChecked = []
  }

  multiDeleteDraftMany(){
    if(this.dataDeleteDraftChecked.length === 0){
      this.toastService.showWarningHTMLWithTimeout('choose.contract.draft', '', 3000);
      return;
    }
    let data: any = "";
    let selectedContracts = this.dataDeleteDraftChecked.map((item: any) => item.selectedId)
    if (sessionStorage.getItem('lang') == 'vi' || !sessionStorage.getItem('lang')) {
      data = {
        title: 'XÁC NHẬN XÓA HỢP ĐỒNG',
        contractIds: selectedContracts
      };
    } else if (sessionStorage.getItem('lang') == 'en') {
      data = {
        title: 'CONTRACT DELETE CONFIRMATION',
        contractIds: selectedContracts
      };
    }

    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteMultiContractDialogComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }


  toggleDeleteDraftAll(checkedAll: boolean){
    this.dataDeleteDraftChecked = [];
    this.idCheckBox = [];

    if(checkedAll){
      for(let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.contracts.length; i++){
        this.contracts[i].checked = true;
        this.idCheckBox.push(this.contracts[i].id);
        this.dataDeleteDraftChecked.push({
          id: this.contracts[i].participants[0]?.contract_id,
          selectedId : this.contracts[i].id
        })
      }
    }

  }

  toggleOneDraft(item: any){

    let data = {
      id: item.id,
      selectedId: item.id
    }

    if(this.dataDeleteDraftChecked.some(element => element.id === data.id)){
      this.dataDeleteDraftChecked = this.dataDeleteDraftChecked.filter((item) => {
        return item.id != data.id
      })
    } else {
      this.dataDeleteDraftChecked.push(data);
    }
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
  }

  getPageData() {
    window.scrollTo({ top: 0 });
     if (this.typeDisplay == 'downloadMany') {
      this.downloadMany();
    }
  }

  cancelDownloadMany() {
    this.typeDisplay = 'signOne';
    this.spinner.show();
    window.location.reload();
  }

  cancelDeleteDraftMany(){
    this.typeDisplay = 'signOne';
    this.spinner.show();
    window.location.reload();
  }

  cancelRelease(){
    this.spinner.show();
    this.typeDisplay = 'signOne';
    window.location.reload();
  }



  processHandleContract(contractId: any) {
    let processData: any = {
      is_data_contract: {
        id: null
      },
      content: null,
    }

    processData.is_data_contract.id = contractId

    // @ts-ignore
    const dialogRef = this.dialog.open(ProcessingHandleEcontractComponent, {
      width: '1000px',
      backdrop: 'static',
      keyboard: true,
      data: processData
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result;
    });
  }

  getContractList() {
    this.pageTotal = 0;
    this.scrollY = 0;
    this.roleMess = "";
    this.typeDisplay="view";
    this.contracts = [];
    this.idCheckBox = [];
    this.contractService.sidebarContractEvent.subscribe((event: any) => {
      if(event='contract-signature')
      this.p = 1;
    })

    if (this.isOrg == 'on' && !this.isQLHD_04 && !this.isQLHD_03) {
      this.roleMess = "Danh sách hợp đồng tổ chức chưa được phân quyền";
    }

    if (!this.roleMess) {
      let isOrg = this.isOrg;
      this.enterPage = this.p;
      if(!this.isQLHD_03 && !this.isQLHD_04) {
        isOrg ='off';
      }

      //get list contract
      this.contractService.getContractList(isOrg, this.organization_id, this.filter_name, this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page).subscribe(data => {
        this.contracts = data.entities;
        this.pageTotal = data.total_elements;
        this.checkedAll = false;
        this.dataChecked = [];
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
        this.spinner.hide();
        const checkedDownloadFiles = this.dataChecked.map(el=>el.selectedId)

        for(let i = 0; i< this.contracts.length; i++){
          let checkIf = checkedDownloadFiles.some(el => el === this.contracts[i].id)
          if(checkIf){
            this.contracts[i].checked = true;
          } else {
            this.contracts[i].checked = false;
          }
        }
      });
    }
  }

  sortParticipant(list: any) {
    // return list.sort((beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type);
    return list;
  }

  getNameOrganization(item: any, index: any) {
    if(item.type == 3 && item.recipients.length > 0)
      return sideList[index].name + " : " + item.recipients[0].name;
    return sideList[index].name + " : " + item.name;
  }

  changeTab() {
    this.p = 1;
    this.enterPage = 1;
    this.getContractList();
  }

  private convertStatusStr() {
    // this.p = 1;
    this.contracts = [];
    if (this.status == 'draft') {
      this.filter_status = 0;
      this.color = '#DDBC0A';
      this.backgroundColor = '#DDBC0A1A';
      this.appService.setSubTitle('contract.status.draft');
    } else if (this.status == 'processing') {
      this.filter_status = 20;
      this.color = '#2D6BE7';
      this.backgroundColor = '#EEF5FF';
      this.appService.setSubTitle('contract.status.processing');
    } else if (this.status == 'expire') {
      this.filter_status = 33;
      this.color = '#F6AA51';
      this.backgroundColor = '#F6AA511A';
      this.appService.setSubTitle('contract.status.expire');
    } else if (this.status == 'overdue') {
      this.filter_status = 34;
      this.color = '#525963';
      this.backgroundColor = '#5259631A';
      this.appService.setSubTitle('contract.status.overdue');
    } else if (this.status == 'fail') {
      this.filter_status = 31;
      this.color = '#F05046';
      this.backgroundColor = '#F050461A';
      this.appService.setSubTitle('contract.status.fail');
    } else if (this.status == 'cancel') {
      this.filter_status = 32;
      this.color = '#EA328B';
      this.backgroundColor = '#EA328B1A';
      this.appService.setSubTitle('contract.status.cancel');
    } else if (this.status == 'complete') {
      this.filter_status = 30;
      this.color = '#24BD33';
      this.backgroundColor = '#24BD331A';
      this.appService.setSubTitle('contract.status.complete');
    } else if (this.status =='liquidated') {
      this.filter_status = 40;
      this.color = '#23D2EA';
      this.backgroundColor = '#23D2EA1A';
      this.appService.setSubTitle('contract.status.liquidated');
    }
  }

  changePageNumber(e: any){
    this.enterPage = 1;
    this.spinner.show();
    this.p = 1;
    this.page = e.target.value;
    sessionStorage.setItem('receivePageNum', this.page.toString());
    
    if(this.typeDisplay == 'downloadMany'){
      this.downloadMany();
    } else {
      this.getContractList();
    }
    
  }

  setPageDownload() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  getPageStartEnd() {
    const temp: number = this.pageStart;
    if(this.pageStart < 0) {
      this.pageStart = 1;
      this.pageEnd = Math.abs(temp) + 1;
    }
    if (this.pageTotal <= this.pageEnd && this.pageTotal > 0) {
      this.pageEnd = this.pageTotal;
    }
    // return this.pageStart + '-' + this.pageEnd;
    return this.pageEnd;
  }

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }
  // @ts-ignore
  ViewReasonCancel(ContractId: number) {
    const data = { contractId: ContractId }
    const dialogRef = this.dialog.open(DialogReasonCancelComponent, {
      width: '500px',
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }

  autoSearch(event: any) {
    this.p = 1;
    this.filter_name = event.target.value;
    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      this.getContractList();
    }, 1000);
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
    if(this.typeDisplay == 'downloadMany'){
      this.downloadMany();
    } else {
      this.getContractList();
    }
  }
  
  countPage() {
    this.numberPage = Math.ceil(this.pageTotal / this.page);
    return this.numberPage;
  }

  openDetail(id: number) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/form-contract/detail/' + id],
      {
        queryParams: {
          'page': this.p,
          'filter_type': this.filter_type,
          'filter_contract_no': this.filter_contract_no,
          'filter_from_date': this.filter_from_date,
          'filter_to_date': this.filter_to_date,
          'isOrg': this.isOrg,
          'organization_id': this.organization_id,
          'status': this.status,
          filter_name: this.filter_name
        },
        skipLocationChange: false
      });
    });
  }

  openCopy(id: number) {
    this.spinner.show();
    this.contractService.getContractCopy(id).subscribe((res: any) => {
      //
      this.toastService.showSuccessHTMLWithTimeout(`Sao chép hợp đồng ${res.name} thành công!`, "", 3000)
      this.getContractList();

    }, (error: HttpErrorResponse) => {
      this.toastService.showErrorHTMLWithTimeout(error.message, "", 3000)
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    })
  }

  openEdit(id: number) {
    setTimeout(() => {
      void this.router.navigate(['main/form-contract/edit/' + id]);
    }, 100)
  }

  openEditExpiration(item: any) {
    let title = this.translate.instant('edit.exp.sign.time')
    let data;
    if (item && item !== '') {
      data = {
        title: title,
        expirationSign: item.sign_time,
        contractId: item.id,
        scrollY: this.scrollY,
        status: 'one',
        refreshContractList: this.getContractList.bind(this) 
      }
    } else {
      const currentTime = new Date().toISOString();
      data = {
        title: title,
        expirationSign: currentTime,
        contractId: this.idCheckBox,
        scrollY: this.scrollY,
        status: 'multi',
        refreshContractList: this.getContractList.bind(this) 
      }
    }

     // @ts-ignore
    const dialogRef = this.dialog.open(EditExpirationSigningTimeComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result;
      //this.getContractList();
    })
  }

  addContractConnectNew(id: number) {
    this.router.navigate(['main/form-contract/add-contract-connect/' + id]);
  }

  addContractLiquidationNew(id: number){
    this.router.navigate(['main/form-contract/add-contract-liquidation/' + id]);
  }

  deleteItem(id: number) {
    this.statusPopup = 1;
    this.notificationPopup = "Xóa hợp đồng thành công";
  }

  searchContract() {
    let title: any = "";

    if (sessionStorage.getItem('lang') == 'en') {
      title = "CONTRACT SEARCH"
    } else if (sessionStorage.getItem('lang') == 'vi' || !sessionStorage.getItem('lang')) {
      title = "TÌM KIẾM HỢP ĐỒNG";
    }

    const data = {
      title: title,
      filter_type: this.filter_type,
      filter_contract_no: this.filter_contract_no,
      filter_from_date: this.filter_from_date,
      filter_to_date: this.filter_to_date,
      status: this.status,
      isOrg: this.isOrg,
      organization_id: this.organization_id,
      filter_is_org_me_and_children: this.filter_is_org_me_and_children
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(FilterListDialogComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result
    })
  }

  cancelContract(id: any) {
    let data: any = "";

    if (sessionStorage.getItem('lang') == 'vi' || !sessionStorage.getItem('lang')) {
      data = {
        title: 'XÁC NHẬN HỦY HỢP ĐỒNG',
        id: id
      };
    } else {
      data = {
        title: 'CONTRACT CANCELLATION CONFIRMATION',
        id: id
      };
    }

    // @ts-ignore
    const dialogRef = this.dialog.open(CancelContractDialogComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result
    })
  }

  contractConnect(id: any) {
    const data = {
      title: 'XEM HỢP ĐỒNG LIÊN QUAN',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ContractConnectDialogComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }

  addContractConnect(id: any) {
    const data = {
      title: 'THÊM HỢP ĐỒNG LIÊN QUAN',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(AddConnectDialogComponent, {
      width: '720px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result
    })
  }

  shareContract(id: any) {
    const data = {
      title: 'CHIA SẺ HỢP ĐỒNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(ShareContractDialogComponent, {
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

  deleteContract(id: any) {
    let data: any = "";

    if (sessionStorage.getItem('lang') == 'vi' || !sessionStorage.getItem('lang')) {
      data = {
        title: 'XÁC NHẬN XÓA HỢP ĐỒNG',
        id: id
      };
    } else if (sessionStorage.getItem('lang') == 'en') {
      data = {
        title: 'CONTRACT DELETE CONFIRMATION',
        id: id
      };
    }

    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteContractDialogComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result
    })
  }

  downloadContract(id: any) {
    this.contractService.getFileZipContract(id).subscribe((data) => {
      this.uploadService.downloadFile(data.path).subscribe((response: any) => {
        let url = window.URL.createObjectURL(response);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = data.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 3000);
      }), (error: any) => this.toastService.showErrorHTMLWithTimeout("no.contract.download.file.error", "", 3000);
    },
      error => {
        this.toastService.showErrorHTMLWithTimeout("no.contract.get.file.error", "", 3000);
      }
    );
  }

  getNameStatusCeca(status: any, ceca_push: any, ceca_status: any) {
    if (status == 30) {
      if (ceca_push == 0) {
        return "";
      } else if (ceca_push == 1) {
        if (ceca_status == -1) {
          return "Gửi lên CECA thất bại";
        } else if (ceca_status == 1) {
          return "Chờ BCT xác thực";
        } else if (ceca_status == -2) {
          return "Xác thực thất bại";
        } else if (ceca_status == 0) {
          return "BCT xác thực thành công";
        } else {
          return "Chưa gửi lên CECA";
        }
      }
      return "Không xác định";
    }
    return "";
  }

  uploadAttachFiles(contractData: any) {
    const data = {
      title: 'TẢI LÊN FILE ĐÍNH KÈM',
      contractId: contractData.id,
      contractName: contractData.name
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(UploadAttachFilesComponent, {
      width: '519px',
      height: '354px',
      overflow: 'auto',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result
    })
  }
}
