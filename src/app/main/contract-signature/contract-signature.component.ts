import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import * as contractModel from './model/contract-model';
import { variable } from '../../config/variable';

import { ContractSignatureService } from '../../service/contract-signature.service';
import { ContractService } from '../../service/contract.service';
import { FilterListDialogComponent } from './dialog/filter-list-dialog/filter-list-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UploadService } from 'src/app/service/upload.service';
import { ToastService } from 'src/app/service/toast.service';
import * as moment from 'moment';
import { sideList } from 'src/app/config/variable';
import { DatePipe } from '@angular/common';
import { DialogSignManyComponentComponent } from './dialog/dialog-sign-many-component/dialog-sign-many-component.component';
import { DialogViewManyComponentComponent } from './dialog/dialog-view-many-component/dialog-view-many-component.component';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { encode } from 'base64-arraybuffer';
import domtoimage from 'dom-to-image';
import { HsmDialogSignComponent } from './components/consider-contract/hsm-dialog-sign/hsm-dialog-sign.component';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DialogReasonCancelComponent } from './shared/model/dialog-reason-cancel/dialog-reason-cancel.component';
import { environment } from 'src/environments/environment';
import { ImageDialogSignComponent } from './components/consider-contract/image-dialog-sign/image-dialog-sign.component';
import { UserService } from 'src/app/service/user.service';
import { DowloadPluginService } from 'src/app/service/dowload-plugin.service';
import { CertDialogSignComponent } from './components/consider-contract/cert-dialog-sign/cert-dialog-sign.component';
import { TimeService } from 'src/app/service/time.service';
// import { ContractService } from 'src/app/service/contract.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract-signature.component.html',
  styleUrls: ['./contract-signature.component.scss'],
})
export class ContractSignatureComponent implements OnInit {
  @ViewChild('myInputRef', { static: false }) myInput: ElementRef;

  constantModel: any;

  datas: any = {
    step: variable.stepSampleContract.step_coordination,
    contract: {},
    action_title: 'Điều phối',
  };

  action: string;
  status: string;
  type: string;
  private sub: any;
  searchText: string;
  closeResult: string = '';
  public contracts: any[] = [];
  public contractsSignMany: any[] = [];
  pageOptions: any[] = [5, 10, 20, 50, 100];

  p: number = 1;
  page: number = 5;
  pageDownload: number = 20;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  totalPage: number = 0;
  statusPopup: number = 1;
  notificationPopup: string = '';

  title: any = '';

  //filter contract
  filter_name: any = '';
  filter_type: any = '';
  filter_contract_no: any = '';
  filter_from_date: any = '';
  filter_to_date: any = '';
  filter_status: any = 1;
  contractStatus: any = '';

  typeDisplay: string = 'signOne';
  // typeDisplay: string = 'downloadOne';

  contract_signatures: any = 'c';
  signatures: any = 's9';

  consider: any = 'c9';
  secretary: any = 's8';
  coordinates: any = 'c8';
  signCertDigital: any;
  nameCompany: any;
  dataHsm: any;
  dataCert: any;
  isDateTime: any = new Date();
  srcMark: any;
  checkedAll: boolean = false;
  cert_id: any;
  organization_id: any = '';
  public contractDownloadList: any[] = [];
  public contractViewList: any[] = [];
  currentUser: any;
  keyword: string = '';
  name: string | null = null;
  mst: string | null = null;
  cccd: string | null = null;
  cmnd: string | null = null;
  cardId: any;
  company: any;
  widthSign: number;
  markImage: boolean = false;
  signImage: string | null = null;
  position: string | null = null;

  constructor(
    private appService: AppService,
    private contractServiceV1: ContractService,
    private contractService: ContractSignatureService,
    public isContractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private uploadService: UploadService,
    private toastService: ToastService,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private downloadPluginService: DowloadPluginService,
    private timeService: TimeService
  ) {
    this.constantModel = contractModel;

    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

      if (typeof params.type_display != 'undefined' && params.type_display) {
        this.typeDisplay = params.type_display;
      } else {
        this.typeDisplay = 'signOne';
      }

      if (typeof params.filter_name != 'undefined' && params.filter_name) {
        this.filter_name = params.filter_name;
      }

      if (typeof params.filter_type != 'undefined' && params.filter_type) {
        this.filter_type = params.filter_type;
      } else {
        this.filter_type = '';
      }
      if (
        typeof params.filter_contract_no != 'undefined' &&
        params.filter_contract_no
      ) {
        this.filter_contract_no = params.filter_contract_no;
      } else {
        this.filter_contract_no = '';
      }
      if (
        typeof params.filter_from_date != 'undefined' &&
        params.filter_from_date
      ) {
        this.filter_from_date = params.filter_from_date;
      } else {
        this.filter_from_date = '';
      }
      if (
        typeof params.filter_to_date != 'undefined' &&
        params.filter_to_date
      ) {
        this.filter_to_date = params.filter_to_date;
      } else {
        this.filter_to_date = '';
      }
      if (
        typeof params.contractStatus != 'undefined' &&
        params.contractStatus
      ) {
        this.contractStatus = params.contractStatus;
      } else {
        this.contractStatus = '';
      }

      if (typeof params.page != 'undefined' && params.page) {
        this.p = params.page;
      }

      if (
        typeof params.organization_id != 'undefined' &&
        params.organization_id
      ) {
        this.organization_id = params.organization_id;
      } else {
        this.organization_id = '';
      }
    });

    if (sessionStorage.getItem('receivePageNum')) {
      this.page = Number(sessionStorage.getItem('receivePageNum'));
    }

    this.sub = this.route.params.subscribe((params) => {
      // this.action = params['action'];
      this.status = params['status'];

      //set title
      this.convertStatusStr();
      this.action = 'receive';
      this.type = 'wait-for-me';
      this.appService.setTitle(this.convertActionStr());

      this.getContractList();
    });

    this.markSignAcc();
  }

  async markSignAcc() {
    const markSignAcc = await this.userService.getMarkUserById(this.currentUser.id).toPromise();
    this.datas.markSignAcc = markSignAcc;
  }

  documentId: any = [];
  signMany() {
    if (this.myInput) {
      this.myInput.nativeElement.value = null;
    }

    this.setNullFilter();

    this.spinner.show();
    this.typeDisplay = 'signMany';

    this.contractService.getContractMyProcessListSignMany(this.keyword).subscribe((data) => {

      this.spinner.hide();
      this.contractsSignMany = data;
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }
      this.contractsSignMany.forEach((key: any, v: any) => {
        this.contractsSignMany[v].contractId = key.participant.contract.id;

        this.contractsSignMany[v].contractName =
          key.participant.contract.name;

        this.contractsSignMany[v].contractNumber =
          key.participant.contract.code;

        //Ngay het han hop dong
        this.contractsSignMany[v].contractSignTime =
          key.participant.contract.sign_time;

        //Ngay tao hop dong
        this.contractsSignMany[v].contractCreateTime =
          key.participant.contract.created_time;

        this.contractsSignMany[v].contractStatus =
          key.participant.contract.status;

        this.contractsSignMany[v].contractCecaPush =
          key.participant.contract.ceca_push;

        this.contractsSignMany[v].contractCecaStatus =
          key.participant.contract.ceca_status;

        this.contractsSignMany[v].contractReleaseState =
          key.participant.contract.release_state;

        this.contractsSignMany[v].checked = false;

        //Gan document id
        this.contractsSignMany[v].documentId = key.fields[0]?.documentId;
      });
    });
  }
  viewMany() {
    if (this.myInput) {
      this.myInput.nativeElement.value = null;
    }
    this.spinner.show();
    this.typeDisplay = 'viewMany';
    this.setNullFilter();

    this.contractService.getViewContractMyProcessList().subscribe((data) => {

      this.checkedAll = false;
      this.contractViewList = data;
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }


      this.contractViewList.forEach((key: any, v: any) => {
        this.contractViewList[v].contractId =
          key.participant.contract.id;
        this.contractViewList[v].contractName =
          key.participant.contract.name;
        this.contractViewList[v].contractNumber =
          key.participant.contract.code;
        this.contractViewList[v].contractSignTime =
          key.participant.contract.sign_time;
        this.contractViewList[v].contractCreateTime =
          key.participant.contract.created_time;
        this.contractViewList[v].contractStatus =
          key.participant.contract.status;
        this.contractViewList[v].contractCecaPush =
          key.participant.contract.ceca_push;
        this.contractViewList[v].contractCecaStatus =
          key.participant.contract.ceca_status;
        this.contractViewList[v].contractReleaseState =
          key.participant.contract.release_state;
      });


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

  downloadMany() {
    this.spinner.show();
    this.typeDisplay = 'downloadMany';

    this.contractService.getContractMyProcessList(this.filter_name, this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status,
      this.p, 20, 30).subscribe((data) => {
        this.checkedAll = false;
        this.dataChecked = [];


        this.contractDownloadList = data.entities;
        this.pageTotal = data.total_elements;
        this.totalPage = data.total_pages;
        //

        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPageDownload();
        }
        this.contractDownloadList.forEach((key: any, v: any) => {
          this.contractDownloadList[v].contractId =
            key.participant.contract.id;
          this.contractDownloadList[v].contractName =
            key.participant.contract.name;
          this.contractDownloadList[v].contractNumber =
            key.participant.contract.code;
          this.contractDownloadList[v].contractSignTime =
            key.participant.contract.sign_time;
          this.contractDownloadList[v].contractCreateTime =
            key.participant.contract.created_time;
          this.contractDownloadList[v].contractStatus =
            key.participant.contract.status;
          this.contractDownloadList[v].contractCecaPush =
            key.participant.contract.ceca_push;
          this.contractDownloadList[v].contractCecaStatus =
            key.participant.contract.ceca_status;
          this.contractDownloadList[v].contractReleaseState =
            key.participant.contract.release_state;
        });
        const checkedDownloadFiles = this.dataChecked.map(el => el.selectedId)
        for (let i = 0; i < this.contractDownloadList.length; i++) {
          let checkIf = checkedDownloadFiles.some(el => el === this.contractDownloadList[i].id)
          if (checkIf) {
            this.contractDownloadList[i].checked = true;
          } else {
            this.contractDownloadList[i].checked = false;
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

  cancelSignMany() {
    this.typeDisplay = 'signOne';

    this.setNullFilter();

    if (this.myInput) {
      this.myInput.nativeElement.value = null;
      this.keyword = '';
    }

    this.getListAfterCancel();
  }

  setNullFilter() {
    this.filter_type = '';
    this.filter_contract_no = '';
    this.filter_from_date = '';
    this.filter_to_date = '';
  }

  getListAfterCancel() {
    this.contractService
      .getContractMyProcessList(
        '',
        this.filter_type,
        this.filter_contract_no,
        this.filter_from_date,
        this.filter_to_date,
        this.filter_status,
        this.p,
        this.page,
        this.contractStatus
      )
      .subscribe((data) => {
        this.contracts = data.entities;
        this.pageTotal = data.total_elements;
        if (this.pageTotal == 0) {
          this.p = 0;
          this.pageStart = 0;
          this.pageEnd = 0;
        } else {
          this.setPage();
        }
        this.contracts.forEach((key: any, v: any) => {
          this.contracts[v].contractId = key.participant.contract.id;
          this.contracts[v].contractName = key.participant.contract.name;
          this.contracts[v].contractNumber = key.participant.contract.code;
          this.contracts[v].contractSignTime =
            key.participant.contract.sign_time;
          this.contracts[v].contractCreateTime =
            key.participant.contract.created_time;
          this.contracts[v].contractStatus =
            key.participant.contract.status;
          this.contracts[v].contractCecaPush =
            key.participant.contract.ceca_push;
          this.contracts[v].contractCecaStatus =
            key.participant.contract.ceca_status;
          this.contracts[v].contractReleaseState =
            key.participant.contract.release_state;
        });
      }, error => {
        setTimeout(() => this.router.navigate(['/login']));
        this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
      });
  }

  cancelDownloadMany() {
    this.typeDisplay = 'signOne';
    this.spinner.show();
    window.location.reload();
  }

  cancelViewMany() {
    this.typeDisplay = 'signOne';
    this.dataChecked = [];

    this.setNullFilter();

    if (this.myInput) {
      this.myInput.nativeElement.value = null;
      this.keyword = '';
    }

    this.getListAfterCancel();
  }

  getPageData() {
    window.scrollTo({ top: 0 });
    if (this.typeDisplay == 'signOne') {
      this.getContractList();
    }
    else if (this.typeDisplay == 'downloadMany') {
      this.downloadMany();
    }
  }

  getContractList() {
    if (this.filter_status % 10 == 1) {
      this.filter_status = 1;
    }
    this.contractServiceV1.sidebarContractEvent.subscribe((event: any) => {
      if (event = 'contract-signature')
        this.p = 1;
    });

    //get list contract share
    if (this.filter_status == -1) {
      this.contractService
        .getContractShareList(
          this.filter_name,
          this.filter_type,
          this.filter_contract_no,
          this.filter_from_date,
          this.filter_to_date,
          this.filter_status,
          this.p,
          this.page,
          this.contractStatus
        )
        .subscribe(
          (data) => {
            this.contracts = data.entities;
            this.pageTotal = data.total_elements;
            if (this.pageTotal == 0) {
              this.p = 0;
              this.pageStart = 0;
              this.pageEnd = 0;
            } else {
              this.setPage();
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
    } else if (this.filter_status == 1 || this.filter_status == 4) {
      if (
        this.typeDisplay == 'signOne' ||
        this.typeDisplay === 'downloadMany'
      ) {
        if (this.typeDisplay === 'downloadMany') {
          this.contractStatus = 30;
        }
        this.contractService
          .getContractMyProcessList(
            this.filter_name,
            this.filter_type,
            this.filter_contract_no,
            this.filter_from_date,
            this.filter_to_date,
            this.filter_status,
            this.p,
            this.page,
            this.contractStatus
          )
          .subscribe(
            (data) => {
              this.contracts = data.entities;
              this.pageTotal = data.total_elements;
              if (this.pageTotal == 0) {
                this.p = 0;
                this.pageStart = 0;
                this.pageEnd = 0;
              } else {
                this.setPage();
              }
              this.spinner.hide();
              this.contracts.forEach((key: any, v: any) => {
                this.contracts[v].contractId = key.participant.contract.id;
                this.contracts[v].contractName = key.participant.contract.name;
                this.contracts[v].contractNumber =
                  key.participant.contract.code;
                this.contracts[v].contractSignTime =
                  key.participant.contract.sign_time;
                this.contracts[v].contractCreateTime =
                  key.participant.contract.created_time;
                this.contracts[v].contractStatus =
                  key.participant.contract.status;
                this.contracts[v].contractCecaPush =
                  key.participant.contract.ceca_push;
                this.contracts[v].contractCecaStatus =
                  key.participant.contract.ceca_status;
                this.contracts[v].contractReleaseState =
                  key.participant.contract.release_state;
              });
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
      } else {
        if (this.typeDisplay == 'signMany') {
          this.contractService.getContractMyProcessListSignMany(this.keyword, this.filter_type,
            this.filter_contract_no,
            this.filter_from_date,
            this.filter_to_date).subscribe((data) => {
              this.contractsSignMany = data;
              if (this.pageTotal == 0) {
                this.p = 0;
                this.pageStart = 0;
                this.pageEnd = 0;
              } else {
                this.setPage();
              }
              this.contractsSignMany.forEach((key: any, v: any) => {
                this.contractsSignMany[v].contractId = key.participant.contract.id;
                this.contractsSignMany[v].contractName = key.participant.contract.name;
                this.contractsSignMany[v].contractNumber = key.participant.contract.code;
                this.contractsSignMany[v].contractSignTime = key.participant.contract.sign_time;
                this.contractsSignMany[v].contractCreateTime = key.participant.contract.created_time;
                this.contractsSignMany[v].contractStatus = key.participant.contract.status;
                this.contractsSignMany[v].contractCecaPush = key.participant.contract.ceca_push;
                this.contractsSignMany[v].contractCecaStatus = key.participant.contract.ceca_status;
                this.contractsSignMany[v].contractReleaseState = key.participant.contract.release_state;
                this.contractsSignMany[v].typeOfSign = key.sign_type[0].name;
                this.contractsSignMany[v].checked = false;
              });

              this.spinner.hide();
            }, error => {
              setTimeout(() => this.router.navigate(['/login']));
              this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
            });
        } else if (this.typeDisplay == 'viewMany') {
          this.contractService.getViewContractMyProcessList(this.keyword, this.filter_type,
            this.filter_contract_no,
            this.filter_from_date,
            this.filter_to_date).subscribe((data) => {
              this.contractViewList = data;
              if (this.pageTotal == 0) {
                this.p = 0;
                this.pageStart = 0;
                this.pageEnd = 0;
              } else {
                this.setPage();
              }
              this.contractsSignMany.forEach((key: any, v: any) => {
                this.contractsSignMany[v].contractId = key.participant.contract.id;
                this.contractsSignMany[v].contractName = key.participant.contract.name;
                this.contractsSignMany[v].contractNumber = key.participant.contract.code;
                this.contractsSignMany[v].contractSignTime = key.participant.contract.sign_time;
                this.contractsSignMany[v].contractCreateTime = key.participant.contract.created_time;
                this.contractsSignMany[v].contractStatus = key.participant.contract.status;
                this.contractsSignMany[v].contractCecaPush = key.participant.contract.ceca_push;
                this.contractsSignMany[v].contractCecaStatus = key.participant.contract.ceca_status;
                this.contractsSignMany[v].contractReleaseState = key.participant.contract.release_state;
                this.contractsSignMany[v].typeOfSign = key.sign_type[0].name;
                this.contractsSignMany[v].checked = false;
              });

              this.spinner.hide();
            }, error => {
              setTimeout(() => this.router.navigate(['/login']));
              this.toastService.showErrorHTMLWithTimeout('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!', "", 3000);
            });
        }
      }
    } else {
      this.contractService
        .getContractMyProcessDashboard(
          this.filter_status % 10,
          this.p,
          this.page
        )
        .subscribe(
          (data) => {
            this.contracts = data.entities;
            this.pageTotal = data.total_elements;
            if (this.pageTotal == 0) {
              this.p = 0;
              this.pageStart = 0;
              this.pageEnd = 0;
            } else {
              this.setPage();
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

  sortParticipant(list: any) {
    // if (list && list.length > 0) {
    //   return list.sort(
    //     (beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type
    //   );
    // }
    return list;
  }

  getNameOrganization(item: any, index: any, item1?: any) {
    return sideList[index].name + ' : ' + item.name;
  }

  //auto search
  autoSearch(event: any) {
    setTimeout(() => {
      if (this.typeDisplay == 'signOne') {
        this.filter_name = event.target.value;
      } else if (this.typeDisplay == 'signMany' || this.typeDisplay == 'downloadMany') {
        this.keyword = event.target.value;
      }

      this.getContractList();
    }, 1000)
  }

  private convertActionStr(): string {
    return 'contract.list.received';
  }

  dataChecked: any[] = [];
  toggleOne(item: any, index1: any) {
    let data = {
      id: index1,
      sign_type: item.sign_type[0].id,
      card_id: item.cardId,
      checked: item.checked,
    };

    if (item.checked === true) {
      this.dataChecked.push(data);

      let lengthItem = this.dataChecked.length;
      if (lengthItem >= 2) {
        if (
          this.dataChecked[lengthItem - 1].sign_type !=
          this.dataChecked[lengthItem - 2].sign_type
        ) {
          this.toastService.showErrorHTMLWithTimeout(
            'Các hợp đồng đang chọn có loại ký khác nhau ',
            '',
            3000
          );
          return;
        }



        if (
          this.dataChecked[lengthItem - 1].card_id !=
          this.dataChecked[lengthItem - 2].card_id
        ) {
          this.toastService.showErrorHTMLWithTimeout(
            'Hợp đồng vừa chọn có mã số thuế khác hợp đồng đầu tiên ',
            '',
            3000
          );
          return;
        }
      }
    } else {
      this.dataChecked = this.dataChecked.filter((item) => item.id != index1);
    }
  }

  toggle() {
    const checkBox = document.getElementById('all') as HTMLInputElement | null;

    if (checkBox != null) {
      let checkBoxList = document.getElementsByName('item');

      if (checkBox.checked === true) {
        for (let i = 0; i < checkBoxList.length; i++) {
          var checkBoxGet: any = checkBoxList[i];
          checkBoxGet.checked = true;
          this.contractsSignMany[i].checked = true;
        }
      } else {
        for (let i = 0; i < checkBoxList.length; i++) {
          var checkBoxGet: any = checkBoxList[i];
          checkBoxGet.checked = false;
          this.contractsSignMany[i].checked = false;
        }
      }
    }
  }

  toggleDownload(checkedAll: boolean) {
    this.dataChecked = [];

    if (checkedAll) {


      for (let i = 0; i < this.contractDownloadList.length; i++) {
        this.contractDownloadList[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.contractDownloadList.length; i++) {
        this.contractDownloadList[i].checked = true;
        this.dataChecked.push({
          id: this.contractDownloadList[i].participant?.contract?.id,
          selectedId: this.contractDownloadList[i].id
        })
      }
    }
  }

  downloadManyContract() {
    if (this.dataChecked.length === 0) {
      return
    }
    this.spinner.show();
    const myDate = new Date();
    // Replace 'yyyy-MM-dd' with your desired date format
    const formattedDate = this.datepipe.transform(myDate, 'ddMMyyyy');
    const ids = this.dataChecked.map((el) => el.id).toString();
    this.contractService.getContractMyProcessListDownloadMany(ids).subscribe((data) => {
      const file = new Blob([data], { type: 'application/zip' });
      let fileUrl = window.URL.createObjectURL(file);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = fileUrl;
      a.download = 'Contracts' + '_' + formattedDate;
      a.click();
      window.URL.revokeObjectURL(fileUrl);
      a.remove();
      window.location.reload();
    },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout(
          'no.contract.download.file.error',
          '',
          3000
        );
      }
    );
  }

  toggleOneView(item: any, index1: any) {
    let data = {
      id: item.id,
      selectedId: item.id
    }


    this.contractViewList[index1].checked = item.checked
    if (this.dataChecked.some(el => el.id === data.id)) {
      this.dataChecked = this.dataChecked.filter((item) => {
        return item.id != data.id
      })
    } else {
      this.dataChecked.push(data);
    }
  }

  toggleOneDownload(item: any, index1: any) {
    let data = {
      id: item.participant?.contract?.id,
      selectedId: item.id
    }
    this.contractDownloadList[index1].checked = item.checked
    if (this.dataChecked.some(el => el.id === data.id)) {
      this.dataChecked = this.dataChecked.filter((item) => {
        return item.id != data.id
      })
    } else {
      this.dataChecked.push(data);
    }
  }

  toggleOneDownloadShare(item: any) {
    let data = {
      id: item.participants[0]?.contract_id,
      selectedId: item.id
    }
    if (this.dataChecked.some(el => el.id === data.id)) {
      this.dataChecked = this.dataChecked.filter((item) => {
        return item.id != data.id;
      });
    } else {
      this.dataChecked.push(data);
    }
  }

  toggleDownloadShare(checkedAll: boolean) {
    this.dataChecked = [];
    if (checkedAll) {
      for (let i = 0; i < this.contracts.length; i++) {
        this.contracts[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.contracts.length; i++) {
        this.contracts[i].checked = true;
        this.dataChecked.push({
          id: this.contracts[i].participants[0]?.contract_id,
          selectedId: this.contracts[i].id
        })
      }
    }
  }

  private convertStatusStr() {
    if (this.myInput) {
      this.myInput.nativeElement.value = null;
    }

    if (this.status == 'wait-processing') {
      this.filter_status = 1;
    } else if (this.status == 'processed') {
      this.filter_status = 4;
      this.typeDisplay = 'signOne';
    } else if (this.status == 'share') {
      this.filter_status = -1;
      this.typeDisplay = 'signOne';
    } else if (this.status == 'wait-processing-dashboard') {
      this.contractStatus = 20;
      this.filter_status = 11;
    } else if (this.status == 'wait-processing-prepare-expires-dashboard') {
      this.filter_status = 12;
    } else if (this.status == 'processed-waiting-dashboard') {
      this.filter_status = 13;
    } else if (this.status == 'processed-complete-dashboard') {
      this.filter_status = 14;
    }

  }

  changePageNumber(e: any) {
    this.spinner.show();
    this.p = 1;
    this.page = e.target.value;
    sessionStorage.setItem('receivePageNum', this.page.toString());
    this.getContractList();
  }

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = this.p * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  getPageStartEnd() {
    const temp: number = this.pageStart;
    if (this.pageStart < 0) {
      this.pageStart = 1;
      this.pageEnd = Math.abs(temp) + 1;
    }
    if (this.pageTotal <= this.pageEnd && this.pageTotal > 0) {
      this.pageEnd = this.pageTotal;
    }
    return this.pageStart + '-' + this.pageEnd;
  }

  setPageDownload() {
    this.pageStart = (this.p - 1) * 20 + 1;
    this.pageEnd = this.p * 20;

    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  watchManyContract() {
    let contractsSignManyChecked = this.contractsSignMany.filter(
      (opt) => opt.checked
    );

    let idRecipient: any = [];
    let idContract: any = [];

    //id recipient
    //id contract
    contractsSignManyChecked.forEach((ele: any) => {
      idRecipient.push(ele.id);
      idContract.push(ele.participant.contract.id);
    });

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/main/form-contract/multi-sign-list'], {
        queryParams: {
          idRecipient: idRecipient,
          idContract: idContract,
        },
        skipLocationChange: true,
      });
    });
  }

  toggleView(checkedAll: boolean) {
    //han che cac checkbox true tick truoc dan den push trung value
    this.dataChecked = [];
    if (checkedAll) {
      for (let i = 0; i < this.contractViewList.length; i++) {
        this.contractViewList[i].checked = false;
      }
    } else {
      for (let i = 0; i < this.contractViewList.length; i++) {
        this.contractViewList[i].checked = true;
        this.dataChecked.push({
          id: this.contractViewList[i].id,
          selectedId: this.contractViewList[i].id
        })
      }
    }
  }

  viewManyContract() {
    this.dialogViewManyComponentComponent();
  }
  async dialogViewManyComponentComponent() {
    if (this.dataChecked.length === 0) {
      return
    }
    const dialogRef = this.dialog.open(DialogViewManyComponentComponent, {
      width: '580px',
    });
    dialogRef.afterClosed().subscribe(async (isSubmit: any) => {

      if (isSubmit) {
        for (let index = 0; index < this.dataChecked.length; index++) {
          this.contractServiceV1
            .updateInfoContractConsider([], this.dataChecked[index].id)
            .subscribe(
              (result) => {

                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => {
                    this.router.navigate(['/main/c/receive/processed']);
                  });
              },
              (error) => {
                this.toastService.showErrorHTMLWithTimeout(
                  'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
                  '',
                  3000
                );
              }
            );
        }
        this.toastService.showSuccessHTMLWithTimeout('Xem xét hợp đồng thành công',
          '',
          1000
        );
      }
    })
  }

  signManyContract() {
    //Nếu chọn hợp đồng khác loại ký thì ko cho ký
    let contractsSignManyChecked = this.contractsSignMany.filter(
      (opt) => opt.checked
    );

    for (let i = 0; i < contractsSignManyChecked.length; i++) {
      for (let j = i + 1; j < contractsSignManyChecked.length; j++) {
        if (
          contractsSignManyChecked[i].sign_type[0].id != contractsSignManyChecked[j].sign_type[0].id
        ) {
          this.toastService.showErrorHTMLWithTimeout(
            'Vui lòng chọn những hợp đồng cùng loại ký',
            '',
            3000
          );
          return;
        }
      }
    }

    //Lay hop dong ky nhieu bang hsm hay usb token
    let signId = contractsSignManyChecked[0].sign_type[0].id;

    let recipientId: any = [];
    let taxCode: any = [];
    let idSignMany: any = [];

    //Lấy id đã tick
    //2: usb token
    //4: hsm
    //id truyen len cua hsm la recipient id: idSignMany = recipientId
    //id truyen len cua usb token la field id
    if (signId == 4) {
      idSignMany = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);

      recipientId = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);

      //Lay ra mang chua tat ca ma so thue cua cac hop dong ky bang usb token
      for (let i = 0; i < recipientId.length; i++) {
        this.contractServiceV1
          .getDetermineCoordination(recipientId[i])
          .subscribe((response) => {
            response.recipients.forEach((item: any) => {
              if (item.id == recipientId[i]) {
                taxCode.push(item.fields[0].recipient.cardId);
              }
            });
          });
      }
    } else if (signId == 2) {
      recipientId = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);

      for (let i = 0; i < recipientId.length; i++) {
        this.contractServiceV1
          .getDetermineCoordination(recipientId[i])
          .subscribe((response) => {
            response.recipients.forEach((item: any) => {
              if (item.id == recipientId[i]) {
                taxCode.push(item.fields[0].recipient.cardId);
              }
            });
          });
      }
    } else if (signId == 6) {
      idSignMany = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);

      recipientId = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);

      //Lay ra mang chua tat ca ma so thue cua cac hop dong ky bang usb token
      for (let i = 0; i < recipientId.length; i++) {
        this.contractServiceV1
          .getDetermineCoordination(recipientId[i])
          .subscribe((response) => {
            response.recipients.forEach((item: any) => {
              if (item.id == recipientId[i]) {
                taxCode.push(item.fields[0].recipient.cardId);
              }
            });
          });
      }
    }

    this.openDialogSignManyComponent(recipientId, taxCode, idSignMany, signId);
  }

  async openDialogSignManyComponent(recipientId: any, taxCode: any, idSignMany: any, signId: any) {
    const dialogRef = this.dialog.open(DialogSignManyComponentComponent, {
      width: '580px',
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      //result = 1 tương ứng với nhấn nút đồng ý và ký
      if (result.agree == 1) {
        //Mã số thuế tại các hợp đồng cần giống nhau
        for (let i = 0; i < taxCode.length; i++) {
          for (let j = i + 1; j < taxCode.length; j++) {
            if (taxCode[i] != taxCode[j]) {
              this.toastService.showErrorHTMLWithTimeout('Mã số thuế tại các hợp đồng khác nhau', '', 3000);
              return;
            }
          }
        }

        if (result.mark) {
          const data = {
            title: 'ĐÓNG DẤU HỢP ĐỒNG ',
            is_content: 'forward_contract',
            markSignAcc: this.datas.markSignAcc,
            mark: true,
          };

          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '1024px';
          dialogConfig.hasBackdrop = true;
          dialogConfig.data = data;

          const dialogRef = this.dialog.open(
            ImageDialogSignComponent,
            dialogConfig
          );

          dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
              this.srcMark = res;
              this.actionSignMulti(signId, recipientId, taxCode, result, idSignMany);
              // this.spinner.hide();
            }

          });
        } else {
          this.actionSignMulti(signId, recipientId, taxCode, result, idSignMany);
        }
      }
    });
  }

  async actionSignMulti(signId: any, recipientId: any, taxCode: any, result: any, idSignMany: any) {
    if (signId == 2) {
      this.spinner.show();

      let contractsSignManyChecked = this.contractsSignMany.filter(
        (opt) => opt.checked
      );

      let idSignMany: any = [];
      let idContract: any = [];
      let fileC: any = [];
      let documentId: any = [];

      //lấy field id được tích vào
      idSignMany = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.fields[0].id);

      //lấy recipientId
      recipientId = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.id);

      //Lấy id hợp đồng được tích vào
      idContract = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.participant.contract.id);

      //Lấy id file được tích vào
      documentId = contractsSignManyChecked.filter((opt) => opt.checked).map((opt) => opt.fields[0].documentId);

      //Lay ra mang chua tat ca ma so thue cua cac hop dong ky bang usb token
      for (let i = 0; i < recipientId.length; i++) {
        try {
          const determineCoordination = await this.contractServiceV1.getDetermineCoordination(recipientId[i]).toPromise();
          determineCoordination.recipients.forEach((item: any) => {
            if (item.id == recipientId[i]) {
              taxCode.push(item.fields[0].recipient.cardId);
            }
          });
        } catch (err) {
          this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin người tham gia hợp đồng', '', 3000);
          return false;
        }
      }

      for (let i = 0; i < idContract.length; i++) {
        try {
          let fileContract = await this.contractServiceV1.getFileContract(idContract[i]).toPromise();

          const pdfC2 = fileContract.find((p: any) => p.type == 2);
          const pdfC1 = fileContract.find((p: any) => p.type == 1);

          if (pdfC2) {
            fileContract = pdfC2.path;
          } else if (pdfC1) {
            fileContract = pdfC1.path;
          } else {
            return;
          }

          fileC.push(fileContract);
        } catch (err) {
          this.toastService.showErrorHTMLWithTimeout(
            'Lỗi lấy file cần ký',
            '',
            3000
          );
          return false;
        }
      }

      this.signUsbTokenMany(fileC, idContract, recipientId, documentId, taxCode, idSignMany, result.mark);
    } else if (signId == 4) {
      //Ký nhiều hsm
      //Mở popup ký hsm
      const data = {
        id: 1,
        title: 'CHỮ KÝ HSM',
        is_content: 'forward_contract',
      };

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '497px';
      dialogConfig.hasBackdrop = true;
      dialogConfig.data = data;

      const dialogRef = this.dialog.open(
        HsmDialogSignComponent,
        dialogConfig
      );

      dialogRef.afterClosed().subscribe(async (resultHsm: any) => {
        if (resultHsm) {
          this.nameCompany = resultHsm.ma_dvcs;
          let imageRender = null;

          this.isDateTime = this.timeService.getRealTime().toPromise();
          await of(null).pipe(delay(100)).toPromise();

          if (result.mark) {
            imageRender = <HTMLElement>(document.getElementById('export-html-hsm-image'));
          } else {
            imageRender = <HTMLElement>(document.getElementById('export-html-hsm'));
          }

          let signI = '';

          if (imageRender) {
            const textSignB = await domtoimage.toPng(imageRender, this.getOptions(imageRender));
            signI = textSignB.split(',')[1];
          }

          this.dataHsm = {
            ma_dvcs: resultHsm.ma_dvcs,
            username: resultHsm.username,
            password: resultHsm.password,
            password2: resultHsm.password2,
            image_base64: signI,
            processAt: this.isDateTime
          };

          this.spinner.show();

          //Call api ký nhiều hsm
          const checkSign = await this.contractServiceV1.signHsmMulti(
            this.dataHsm,
            idSignMany
          );

          let countSuccess = 0;

          for (let i = 0; i < checkSign.length; i++) {
            if (checkSign[i].result.success == false) {
              this.spinner.hide();

              if (checkSign[i].result.message == 'Tax code do not match!') {
                this.toastService.showErrorHTMLWithTimeout(
                  'taxcode.not.match',
                  '',
                  3000
                );
              } else if (
                checkSign[i].result.message == 'Mat khau cap 2 khong dung!'
              ) {
                this.toastService.showErrorHTMLWithTimeout(
                  'Mật khẩu cấp 2 không đúng',
                  '',
                  3000
                );
              } else if (
                checkSign[i].result.message == 'License ky so HSM het han!'
              ) {
                this.toastService.showErrorHTMLWithTimeout(
                  'License ký số HSM hết hạn!',
                  '',
                  3000
                );
              } else {
                this.toastService.showErrorHTMLWithTimeout(
                  checkSign[i].result.message,
                  '',
                  3000
                );
              }
              return;
            } else {
              countSuccess++;
            }
          }

          if (countSuccess == checkSign.length) {
            this.spinner.hide();
            this.toastService.showSuccessHTMLWithTimeout(
              'sign.success',
              '',
              3000
            );

            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['main/c/receive/processed']);
              });
          }
        }
      });
    } else if (signId == 6) {
      let contractsSignManyChecked = this.contractsSignMany.filter(
        (opt) => opt.checked
      );

      //Ký nhiều CTS
      const dataCert = {
        id: 1,
        title: 'KÝ CHỨNG THƯ SỐ',
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '500px';
      dialogConfig.hasBackdrop = true;
      dialogConfig.data = dataCert;
      dialogConfig.panelClass = 'custom-dialog-container';
      const dialogRef = this.dialog.open(
        CertDialogSignComponent,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe(async (resultCert: any) => {
        if (resultCert) {

          this.cert_id = resultCert;
          let countSuccess = 0;
          try {
            const inforCert = await this.contractServiceV1.certInfoCert(this.cert_id).toPromise();
            this.name = inforCert.name;
            this.company = inforCert.company;
            this.cardId = inforCert.mst;
            this.cccd = inforCert.cccd;
            this.cmnd = inforCert.cmnd;
          } catch (err) {

          }

          // const idList = clusteredLists.map((list: any) => list.map((item: any) => item.id));
          // const widthList = clusteredLists.map((list: any) => list.map((item: any) => item.fields[0].width));

          let isResult: boolean = true;

          // for(let i = 0; i < clusteredLists.length; i++) {
          // this.widthSign = widthList[i][0];
          await of(null).pipe(delay(150)).toPromise();
          let imageRender: HTMLElement | null = null;
          //check role là văn thư hoặc người ký để lấy các template khác nhau
          if (this.srcMark) {
            imageRender = <HTMLElement>(document.getElementById('export-html-cert-image'));
          } else {
            imageRender = <HTMLElement>(document.getElementById('export-html-cert'));
          }
          let signI = '';

          if (imageRender) {
            const textSignB = await domtoimage.toPng(imageRender, this.getOptions(imageRender));
            signI = textSignB.split(',')[1];
          }

          for (let i = 0; i < contractsSignManyChecked.length; i++) {
            const signSlots = contractsSignManyChecked[i].fields;

            if (signSlots?.length > 0) {
              for (let y = 0; y < signSlots.length; y++) {

                const signCertPayload = {
                  cert_id: this.cert_id,
                  image_base64: signI,
                  field: null,
                  width: signSlots[y].width,
                  height: signSlots[y].height
                };

                try {
                  this.spinner.show()
                  const checkSign = await this.contractServiceV1.signCertMulti(contractsSignManyChecked[i].id, signCertPayload);
                  countSuccess++;
                  if (countSuccess == checkSign.length) {
                    this.spinner.hide();
                    this.toastService.showSuccessHTMLWithTimeout(
                      'sign.multi.success',
                      '',
                      3000
                    );

                    this.router
                      .navigateByUrl('/', { skipLocationChange: true })
                      .then(() => {
                        this.router.navigate(['main/c/receive/processed']);
                      });
                  }
                } catch (err) {
                  this.spinner.hide()
                  // this.toastService.showErrorHTMLWithTimeout(err,'',3000);
                }
              }
            }
          }


        }
      })
    }
  }

  //Ký usb token v1
  async signTokenVersion1(fileC: any, idContract: any, recipientId: any, documentId: any, taxCode: any, idSignMany: any, isMark: boolean) {
    //ky bang usb token
    let base64String: any = [];

    //Toa do x
    let x: any = [];

    //Toa do y
    let y: any = [];

    //Chieu cao chu ky
    let h: any = [];

    //Chieu rong chu ky
    let w: any = [];

    //Page can ky
    let page: any = [];

    //Chieu dai cau page can ky
    let heightPage: any = [];

    let currentHeight: any = [];

    //tao mang currentHeight toan so 0;
    for (let i = 0; i < fileC.length; i++) {
      currentHeight[i] = 0;
    }

    for (let i = 0; i < fileC.length; i++) {
      const base64StringPdf = await this.contractServiceV1.getDataFileUrlPromise(fileC[i]);

      base64String.push(encode(base64StringPdf));

      //Lấy toạ độ ô ký của từng hợp đồng
      const dataObjectSignature = await this.contractServiceV1
        .getDataObjectSignatureLoadChange(idContract[i])
        .toPromise();

      for (let j = 0; j < dataObjectSignature.length; j++) {
        if (dataObjectSignature[j].recipient) {
          if (recipientId[i] == dataObjectSignature[j].recipient.id) {
            x.push(dataObjectSignature[j].coordinate_x);
            y.push(dataObjectSignature[j].coordinate_y);
            h.push(dataObjectSignature[j].height);
            w.push(dataObjectSignature[j].width);

            //Lấy ra trang ký của từng file hợp đồng
            page.push(dataObjectSignature[j].page);
          }
        }
      }

      //Lấy thông tin page của hợp đồng
      const infoPage = await this.contractServiceV1.getInfoPage(documentId[i]).toPromise();

      for (let j = 0; j < infoPage.length; j++) {
        if (infoPage[j].page < page[i]) {
          currentHeight[i] += infoPage[j].height;
        } else if (infoPage[j].page == page[i]) {
          currentHeight[i] += 0;
          heightPage[i] = infoPage[j].height;
          break;
        }
      }
    }

    //Lay thong tin cua usb token
    this.contractServiceV1.getAllAccountsDigital().then(
      async (data) => {
        if (data.data.Serial) {
          //Check trung mst
          this.contractServiceV1
            .checkTaxCodeExist(taxCode[0], data.data.Base64)
            .subscribe(async (response) => {
              if (response.success == true) {
                this.signCertDigital = data.data;
                this.nameCompany = data.data.CN;

                let signI = '';
                let imageRender = null;
                this.isDateTime = await this.timeService.getRealTime().toPromise();

                await of(null).pipe(delay(100)).toPromise();

                if (isMark) {
                  imageRender = <HTMLElement>(document.getElementById('export-html-image'));
                } else {
                  imageRender = <HTMLElement>(document.getElementById('export-html'));
                }

                if (imageRender) {
                  const textSignB = await domtoimage.toPng(imageRender, this.getOptions(imageRender));
                  signI = textSignB.split(',')[1];
                }

                //Lấy chiều dài của các trang trong các hợp đồng ký
                //Gọi api ký usb token nhiều lần
                for (let i = 0; i < fileC.length; i++) {
                  w[i] = x[i] + w[i];

                  // //Tính lại h, y theo chiều dài của các trang trong hợp đồng ký
                  y[i] = heightPage[i] - (y[i] - currentHeight[i]) - h[i];

                  h[i] = y[i] + h[i];

                  let dataSignMobi: any = null;
                  try {
                    dataSignMobi =
                      await this.contractServiceV1.postSignDigitalMobiMulti(this.signCertDigital.Serial, base64String[i], signI, page[i], h[i], w[i], x[i], y[i]);
                  } catch (err) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Lỗi call api ký USB Token ',
                      '',
                      3000
                    );
                    return false;
                  }

                  if (!dataSignMobi.data.FileDataSigned || !dataSignMobi) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Lỗi ký USB Token ' + dataSignMobi.data.ErrorDetail,
                      '',
                      3000
                    );
                    return false;
                  }

                  let sign: any = null;
                  try {
                    sign = await this.contractServiceV1.updateDigitalSignatured(
                      idSignMany[i],
                      dataSignMobi.data.FileDataSigned
                    );

                  } catch (err) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Lỗi  đẩy file sau khi ký USB Token ',
                      '',
                      3000
                    );
                    return false;
                  }

                  if (!sign.recipient_id || !sign) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Lỗi đẩy file sau khi ký USB Token ',
                      '',
                      3000
                    );
                    return false;
                  }

                  let updateInfo: any = null;
                  try {
                    updateInfo = await this.contractServiceV1.updateInfoContractConsiderPromise([{
                      processAt: this.isDateTime
                    }],recipientId[i]);
                  } catch (err) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Lỗi cập nhật trạng thái hợp đồng ',
                      '',
                      3000
                    );
                    return false;
                  }

                  if (!updateInfo.id || !updateInfo) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Lỗi cập nhật trạng thái hợp đồng ',
                      '',
                      3000
                    );
                    return false;
                  }

                  if (i == fileC.length - 1) {
                    this.spinner.hide();
                    this.toastService.showSuccessHTMLWithTimeout(
                      'sign.success',
                      '',
                      3000
                    );

                    this.router
                      .navigateByUrl('/', { skipLocationChange: true })
                      .then(() => {
                        this.router.navigate(['main/c/receive/processed']);
                      });
                  }
                }
              } else {
                this.spinner.hide();
                Swal.fire({
                  title: `Mã số thuế/CMT/CCCD trên chữ ký số không trùng khớp`,
                  icon: 'warning',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#b0bec5',
                  confirmButtonText: 'Xác nhận',
                });
              }
            });
        } else {
          this.spinner.hide();
          Swal.fire({
            title: `Vui lòng cắm USB Token hoặc chọn chữ ký số!`,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b0bec5',
            confirmButtonText: 'Xác nhận',
          });
        }
      },
      (err) => {
        this.spinner.hide();
        Swal.fire({
          html:
            'Vui lòng bật tool ký số hoặc tải ' +
            `<a href='/assets/upload/mobi_pki_sign_setup.zip' target='_blank'>Tại đây</a>  và cài đặt`,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b0bec5',
          confirmButtonText: 'Xác nhận',
        });
      }
    );
  }

  getOptions(imageRender: any) {
    const scale = 5;
    const options = {
      quality: 0.99,
      width: imageRender.clientWidth * scale,
      height: imageRender.clientHeight * scale,
      style: { transform: 'scale(' + scale + ')', transformOrigin: 'top left' },
    };
    return options;
  }

  async signTokenVersion2(fileC: any, idContract: any, recipientId: any, documentId: any, taxCode: any, idSignMany: any, isMark: boolean) {
    //ky bang usb token
    let base64String: any = [];

    //Toa do x
    let x: any = [];

    //Toa do y
    let y: any = [];

    //Chieu cao chu ky
    let h: any = [];

    //Chieu rong chu ky
    let w: any = [];

    //Page can ky
    let page: any = [];

    //Chieu dai cau page can ky
    let heightPage: any = [];

    let ceca_push: any = [];

    let currentHeight: any = [];

    //tao mang currentHeight toan so 0;
    for (let i = 0; i < fileC.length; i++) {
      currentHeight[i] = 0;
    }

    for (let i = 0; i < fileC.length; i++) {
      const base64StringPdf = await this.contractServiceV1.getDataFileUrlPromise(fileC[i]);

      base64String.push(encode(base64StringPdf));

      //Lấy toạ độ ô ký của từng hợp đồng
      const dataObjectSignature = await this.contractServiceV1
        .getDataObjectSignatureLoadChange(idContract[i])
        .toPromise();

      for (let j = 0; j < dataObjectSignature.length; j++) {
        if (dataObjectSignature[j].recipient) {
          if (recipientId[i] == dataObjectSignature[j].recipient.id) {
            x.push(dataObjectSignature[j].coordinate_x);
            y.push(dataObjectSignature[j].coordinate_y);
            h.push(dataObjectSignature[j].height);
            w.push(dataObjectSignature[j].width);

            //Lấy ra trang ký của từng file hợp đồng
            page.push(dataObjectSignature[j].page);
          }
        }
      }

      //Lấy thông tin page của hợp đồng
      const infoPage = await this.contractServiceV1
        .getInfoPage(documentId[i])
        .toPromise();

      for (let j = 0; j < infoPage.length; j++) {
        if (infoPage[j].page < page[i]) {
          currentHeight[i] += infoPage[j].height;
        } else if (infoPage[j].page == page[i]) {
          currentHeight[i] += 0;
          heightPage[i] = infoPage[j].height;
          break;
        }
      }

      //Lấy trạng thái ceca của từng hợp đồng
      const cecaContract = await this.contractServiceV1
        .getListDataCoordination(idContract[i])
        .toPromise();

      if (cecaContract.ceca_push == 1) {
        ceca_push.push(true);
      } else {
        ceca_push.push(false);
      }
    }

    //Lay thong tin cua usb token
    var LibList_MACOS = ['nca_v6.dylib'];
    var LibList_WIN = [
      'ShuttleCsp11_3003.dll',
      'eps2003csp11.dll',
      'nca_v6.dll',
    ];

    var OSName = 'Unknown';
    if (window.navigator.userAgent.indexOf('Windows NT 6.2') != -1)
      OSName = 'Windows 8';
    if (window.navigator.userAgent.indexOf('Windows NT 6.1') != -1)
      OSName = 'Windows 7';
    if (window.navigator.userAgent.indexOf('Windows NT 6.0') != -1)
      OSName = 'Windows Vista';
    if (window.navigator.userAgent.indexOf('Windows NT 5.1') != -1)
      OSName = 'Windows XP';
    if (window.navigator.userAgent.indexOf('Windows NT 5.0') != -1)
      OSName = 'Windows 2000';
    if (window.navigator.userAgent.indexOf('Mac') != -1) OSName = 'Mac/iOS';
    if (window.navigator.userAgent.indexOf('X11') != -1) OSName = 'UNIX';
    if (window.navigator.userAgent.indexOf('Linux') != -1) OSName = 'Linux';
    //=================>>Check OS<<=================

    var OperationId = 1;
    var pkcs11Lib = [];
    if (OSName == 'Mac/iOS') {
      pkcs11Lib = LibList_MACOS;
    } else if (OSName == 'UNIX' || OSName == 'Linux') {
      alert('Not Support');
      return;
    } else {
      pkcs11Lib = LibList_WIN;
      OperationId = OperationId;
    }

    var json_req = JSON.stringify({
      pkcs11Lib: pkcs11Lib,
      OperationId: OperationId,
    });

    json_req = window.btoa(json_req);

    //Lay sessionId cua usb token
    const apiSessionId = await this.contractServiceV1.signUsbToken(
      'request=' + json_req
    );
    const sessionId = JSON.parse(window.atob(apiSessionId.data)).SessionId;

    if (!sessionId) {
      this.downloadPluginService.getLinkDownLoadV2();
      return;
    }

    //Lay thong tin chung thu so cua usb token
    var json_req_cert = JSON.stringify({
      OperationId: 2,
      SessionId: sessionId,
      checkOCSP: 0,
    });
    json_req_cert = window.btoa(json_req_cert);

    const apiCert = await this.contractServiceV1.signUsbToken(
      'request=' + json_req_cert
    );
    const cert = JSON.parse(window.atob(apiCert.data));

    const utf8 = require('utf8');

    let certInfoBase64 = '';
    if (cert.certInfo) {
      certInfoBase64 = cert.certInfo.Base64Encode;
      this.nameCompany = utf8.decode(cert.certInfo.CommonName);
    } else {
      this.toastService.showErrorHTMLWithTimeout(
        'Lỗi không lấy được thông tin usb token',
        '',
        3000
      );
      return;
    }

    //check trùng mã số thuế
    const checkTaxCode = await this.contractServiceV1
      .checkTaxCodeExist(taxCode[0], certInfoBase64)
      .toPromise();

    if (checkTaxCode.success) {
      let signUpdate = {
        id: Number,
      };
      let signDigital = {
        signDigitalX: Number,
        signDigitalY: Number,
        signDigitalWidth: Number,
        signDigitalHeight: Number,
        page: Number,
      };

      let signI = '';

      this.isDateTime = await this.timeService.getRealTime().toPromise();
      await of(null).pipe(delay(100)).toPromise();
      let imageRender = null;

      if (isMark) {
        imageRender = <HTMLElement>document.getElementById('export-html-image');
      } else {
        imageRender = <HTMLElement>document.getElementById('export-html');
      }

      if (imageRender) {
        const textSignB = await domtoimage.toPng(
          imageRender,
          this.getOptions(imageRender)
        );
        signI = textSignB.split(',')[1];
      }

      for (let i = 0; i < fileC.length; i++) {
        y[i] = heightPage[i] - (y[i] - currentHeight[i]) - h[i];

        signUpdate.id = idSignMany[i];
        signDigital.signDigitalX = x[i];
        signDigital.signDigitalY = y[i];
        signDigital.signDigitalWidth = w[i];
        signDigital.signDigitalHeight = h[i];
        signDigital.page = page[i];
        const emptySignature = await this.contractServiceV1
          .createEmptySignature(
            recipientId[i],
            signUpdate,
            signDigital,
            signI,
            certInfoBase64
          )
          .toPromise();
        const base64TempData = emptySignature.base64TempData;
        const fieldName = emptySignature.fieldName;
        const hexDigestTempFile = emptySignature.hexDigestTempFile;

        var json_req = JSON.stringify({
          OperationId: 5,
          SessionId: sessionId,
          DataToBeSign: base64TempData,
          checkOCSP: 0,
          reqDigest: 0,
          algDigest: 'SHA_256',
        });

        json_req = window.btoa(json_req);

        try {
          const callServiceDCSigner = await this.contractServiceV1.signUsbToken(
            'request=' + json_req
          );

          const dataSignatureToken = JSON.parse(
            window.atob(callServiceDCSigner.data)
          );

          const signatureToken = dataSignatureToken.Signature;

          const mergeTimeStamp = await this.contractServiceV1
            .meregeTimeStamp(
              recipientId[i],
              idContract[i],
              signatureToken,
              fieldName,
              certInfoBase64,
              hexDigestTempFile,
              ceca_push[i]
            )
            .toPromise();
          const filePdfSigned = mergeTimeStamp.base64Data;


          const sign = await this.contractServiceV1.updateDigitalSignatured(
            idSignMany[i],
            filePdfSigned
          );

          if (!sign.recipient_id) {
            this.toastService.showErrorHTMLWithTimeout(
              'Lỗi ký usb token không cập nhật được recipient id',
              '',
              3000
            );
            return false;
          }

          const updateInfo =
            await this.contractServiceV1.updateInfoContractConsiderPromise(
              [{
                processAt: this.isDateTime
              }],
              recipientId[i]
            );

          if (!updateInfo.id) {
            this.toastService.showErrorHTMLWithTimeout(
              'Lỗi cập nhật trạng thái hợp đồng ',
              '',
              3000
            );
          }

          if (i == fileC.length - 1) {
            this.spinner.hide();
            this.toastService.showSuccessHTMLWithTimeout(
              'sign.success',
              '',
              3000
            );

            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['main/c/receive/processed']);
              });
          }
        } catch (err) {
          this.toastService.showErrorHTMLWithTimeout(
            'Lỗi ký usb token ' + err,
            '',
            3000
          );
          return;
        }
      }
    } else {
      this.spinner.hide();
      Swal.fire({
        title: `Mã số thuế/CMT/CCCD trên chữ ký số không trùng mã số thuế/CMT/CCCD của tổ chức`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
    }
  }

  async signUsbTokenMany(fileC: any, idContract: any, recipientId: any, documentId: any, taxCode: any, idSignMany: any, isMark: boolean) {
    const dataOrg = await this.contractServiceV1.getDataNotifyOriganzation().toPromise();

    if (dataOrg.usb_token_version == 1) {
      this.signTokenVersion1(fileC, idContract, recipientId, documentId, taxCode, idSignMany, isMark);
    } else if (dataOrg.usb_token_version == 2) {
      this.signTokenVersion2(fileC, idContract, recipientId, documentId, taxCode, idSignMany, isMark);
    }
  }

  async getBase64String(fileC: any) {
    return await this.contractServiceV1.getDataFileUrlPromise(fileC);
  }

  searchContract() {
    let title: any = '';

    if (sessionStorage.getItem('lang') == 'en') {
      title = 'CONTRACT SEARCH';
    } else if (sessionStorage.getItem('lang') == 'vi') {
      title = 'TÌM KIẾM HỢP ĐỒNG';
    }

    const data = {
      title: title,
      filter_name: this.filter_name,
      filter_type: this.filter_type,
      filter_contract_no: this.filter_contract_no,
      filter_from_date: this.filter_from_date,
      filter_to_date: this.filter_to_date,
      status: this.status,
      type_display: this.typeDisplay
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(FilterListDialogComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result;
    });
  }

  downloadContract(id: any) {
    this.isContractService.getFileZipContract(id).subscribe(
      (data) => {
        //
        this.uploadService
          .downloadFile(data.path)
          .subscribe((response: any) => {
            let url = window.URL.createObjectURL(response);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = data.filename;

            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            this.toastService.showSuccessHTMLWithTimeout(
              'no.contract.download.file.success',
              '',
              3000
            );
          }),
          (error: any) =>
            this.toastService.showErrorHTMLWithTimeout(
              'no.contract.download.file.error',
              '',
              3000
            );
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout(
          'no.contract.get.file.error',
          '',
          3000
        );
      }
    );
  }

  // @ts-ignore
  ViewReasonCancel(ContractId: number) {
    const data = { contractId: ContractId };
    const dialogRef = this.dialog.open(DialogReasonCancelComponent, {
      width: '500px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result;
    });
  }

  openConsiderContract(item: any) {
    this.router.navigate(['main/c/c9/' + item.contractId], {
      queryParams: { recipientId: item.id },
    });
  }

  openDetail(id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/main/form-contract/detail/' + id], {
        queryParams: {
          page: this.p,
          filter_type: this.filter_type,
          filter_contract_no: this.filter_contract_no,
          filter_from_date: this.filter_from_date,
          filter_to_date: this.filter_to_date,
          organization_id: this.organization_id,
          status: this.status,
          filter_name: this.filter_name
        },
        skipLocationChange: false,
      });
    });
  }

  openConsiderContractViewProcesse(item: any) {
    if (item.status == 2) {
      this.router.navigate(
        ['main/c/receive/wait-processing/consider-contract/' + item.contractId],
        {
          queryParams: { recipientId: item.id },
        }
      );
    }
  }

  getSignContract(data: any) {
    if (
      !data.participant ||
      !data.participant.contract.sign_time ||
      new Date(
        moment(data.participant.contract.sign_time).format('yyyy/MM/DD')
      ).valueOf() < new Date(moment().format('yyyy/MM/DD')).valueOf()
    ) {
      return false;
    } else if (data.status == 1 && data.role == 3) {
      return true;
    } else return false;
  }

  openSignatureContract(item: any) {
    //kiem tra xem co bi khoa hay khong
    this.contractServiceV1.getStatusSignImageOtp(item.id).subscribe(
      (data) => {
        if (!data.locked) {
          this.router.navigate(
            [
              'main/' +
              this.contract_signatures +
              '/' +
              this.signatures +
              '/' +
              item.contractId,
            ],
            {
              queryParams: {
                recipientId: item.id,
                page: this.p,
                status: this.status,
              },
            }
          );
        } else {
          this.toastService.showErrorHTMLWithTimeout(
            'Bạn đã nhập sai OTP 5 lần liên tiếp.<br>Quay lại sau ' +
            this.datepipe.transform(data.nextAttempt, 'dd/MM/yyyy HH:mm'),
            '',
            3000
          );
        }
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi', '', 3000);
      }
    );
  }

  openCoordinatorContract(item: any) {
    this.isContractService.getListDataCoordination(item.contractId).subscribe(
      (res: any) => {
        if (res) {
          if (localStorage.getItem('data_coordinates_contract_id')) {
            localStorage.removeItem('data_coordinates_contract_id');
          }
          localStorage.setItem(
            'data_coordinates_contract_id',
            JSON.stringify({ data_coordinates_id: res.id })
          );

          this.router.navigate(
            ['main/c/' + this.coordinates + '/' + item.contractId],
            {
              queryParams: {
                page: this.p,
                status: this.status,
              },
            }
          );
        }
      },
      (res: any) => {
        alert('Có lỗi! vui lòng liên hệ với nhà phát triển để xử lý!');
      }
    );
  }

  openSecretaryContract(item: any) {
    this.router.navigate(['main/c/s8/' + item.contractId], {
      queryParams: {
        recipientId: item.id,
        page: this.p,
        status: this.status,
      },
    });
  }

  t(item: any) {

  }

  getNameStatusCeca(status: any, ceca_push: any, ceca_status: any) {
    if (status == 30) {
      if (ceca_push == 0) {
        return '';
      } else if (ceca_push == 1) {
        if (ceca_status == -1) {
          return '[Gửi lên CeCA thất bại]';
        } else if (ceca_status == 1) {
          return '[Chờ BCT xác thực]';
        } else if (ceca_status == -2) {
          return '[Xác thực thất bại]';
        } else if (ceca_status == 0) {
          return '[BCT xác thực thành công]';
        } else {
          return '[Chưa gửi lên CeCA]';
        }
      }
      return '[Không xác định]';
    }
    return '';
  }
}
