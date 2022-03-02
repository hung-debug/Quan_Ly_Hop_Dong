import { UploadService } from 'src/app/service/upload.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';

import { ToastService } from 'src/app/service/toast.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CancelContractDialogComponent } from './dialog/cancel-contract-dialog/cancel-contract-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterListDialogComponent } from './dialog/filter-list-dialog/filter-list-dialog.component';
import { ContractConnectDialogComponent } from './dialog/contract-connect-dialog/contract-connect-dialog.component';
import { AddConnectDialogComponent } from './dialog/add-connect-dialog/add-connect-dialog.component';
import { ShareContractDialogComponent } from './dialog/share-contract-dialog/share-contract-dialog.component';
import { DeleteContractDialogComponent } from './dialog/delete-contract-dialog/delete-contract-dialog.component';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { TreeMapModule } from '@swimlane/ngx-charts';
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  action: string;
  status: string;
  type: string;
  private sub: any;
  searchText: string;
  closeResult: string = '';
  public contracts: any[] = [];
  p: number = 1;
  page: number = 5;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
  statusPopup: number = 1;
  notificationPopup: string = '';

  title: any = "";
  id: any = "";
  notification: any = "";

  //filter contract
  filter_name: any = "";
  filter_type: any = "";
  filter_contract_no: any = "";
  filter_from_date: any = "";
  filter_to_date: any = "";
  filter_status: any = "";
  filter_remain_day: any = "";
  message: any;
  subscription: Subscription;

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

  constructor(private modalService: NgbModal,
    private appService: AppService,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private http: HttpClient,
    private uploadService: UploadService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private roleService: RoleService,
  ) { }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (typeof params.filter_name != 'undefined' && params.filter_name) {
        this.filter_name = params.filter_name;
      } else {
        this.filter_name = "";
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
    });
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];
      this.status = params['status'];

      //set title
      this.convertStatusStr();

      this.appService.setTitle(this.convertActionStr());

      this.p = 1;
      this.getContractList();
    });

    //lay id user
    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        //lay id role
        this.roleService.getRoleById(data.role_id).subscribe(
          data => {
            console.log(data);
            let listRole: any[];
            listRole = data.permissions;
            this.isQLHD_01 = listRole.some(element => element.code == 'QLHD_01');
            this.isQLHD_02 = listRole.some(element => element.code == 'QLHD_02');
            this.isQLHD_03 = listRole.some(element => element.code == 'QLHD_03');
            this.isQLHD_04 = listRole.some(element => element.code == 'QLHD_04');
            this.isQLHD_05 = listRole.some(element => element.code == 'QLHD_05');
            this.isQLHD_06 = listRole.some(element => element.code == 'QLHD_06');
            this.isQLHD_07 = listRole.some(element => element.code == 'QLHD_07');
            this.isQLHD_08 = listRole.some(element => element.code == 'QLHD_08');
            this.isQLHD_09 = listRole.some(element => element.code == 'QLHD_09');
            this.isQLHD_10 = listRole.some(element => element.code == 'QLHD_10');
            this.isQLHD_11 = listRole.some(element => element.code == 'QLHD_11');
            this.isQLHD_12 = listRole.some(element => element.code == 'QLHD_12');
            this.isQLHD_13 = listRole.some(element => element.code == 'QLHD_13');
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
          }
        );

      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin phân quyền', "", 3000);
      }
    )

    // this.subscription = this.contractService.currentMessage.subscribe(message => this.message = message);
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  getContractList() {
    //get list contract
    this.contractService.getContractList(this.filter_name, this.filter_type, this.filter_contract_no, this.filter_from_date, this.filter_to_date, this.filter_status, this.p, this.page).subscribe(data => {
      this.contracts = data.entities;
      this.pageTotal = data.total_elements;
      console.log(this.contracts);
      if (this.pageTotal == 0) {
        this.p = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
      } else {
        this.setPage();
      }
      this.contracts.forEach((key: any, v: any) => {
        this.contracts[v].status = this.filter_status;
        let participants = key.participants;
        //console.log(participants);
        participants.forEach((key: any, val: any) => {
          if (key.type == 1) {
            this.contracts[v].sideA = key.name;
          } else {
            this.contracts[v].sideB = key.name;
          }
          console.log(this.contracts[v].sideA);
        })
      });
      console.log(this.contracts);
      console.log(this.pageTotal);
    });
  }

  private convertActionStr(): string {
    console.log(this.action);
    if (this.action == 'create') {
      this.type = 'mine';
      return 'contract.list.created';
    } else if (this.action == 'receive') {
      this.type = 'wait-for-me';
      return 'contract.list.received';
    } else {
      return '';
    }
  }

  private convertStatusStr() {
    if (this.status == 'draft') {
      this.filter_status = 0;
      this.title = 'contract.status.draft';
    } else if (this.status == 'wait-processing') {
      this.title = 'contract.status.wait-processing';
    } else if (this.status == 'processing') {
      this.filter_status = 20;
      this.title = 'contract.status.processing';
    } else if (this.status == 'processed') {
      this.title = 'contract.status.processed';
    } else if (this.status == 'expire') {
      this.filter_status = 33;
      this.title = 'contract.status.expire';
    } else if (this.status == 'overdue') {
      this.filter_status = 34;
      this.title = 'contract.status.overdue';
    } else if (this.status == 'fail') {
      this.filter_status = 31;
      this.title = 'contract.status.fail';
    } else if (this.status == 'cancel') {
      this.filter_status = 32;
      this.title = 'contract.status.cancel';
    } else if (this.status == 'complete') {
      this.filter_status = 30;
      this.title = 'contract.status.complete';
    } else {
      this.title = '';
    }
  }

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = (this.p) * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  autoSearch(event: any) {
    this.p = 1;
    this.filter_name = event.target.value;
    this.getContractList();
  }



  openDetail(id: number) {
    this.router.navigate(['main/form-contract/detail/' + id]);
  }

  openCopy(id: number) {
    // this.router.navigate(['main/form-contract/copy/' + id]);
    // console.log(this.contracts, id, this.status);
    if (this.status != 'complete') {
      this.spinner.show();
      this.contractService.getContractCopy(id).subscribe((res: any) => {
        console.log(res);
        this.toastService.showSuccessHTMLWithTimeout(`Sao chép hợp đồng ${res.name} thành công!`, "", 3000)
        this.getContractList();
        
      }, (error: HttpErrorResponse) => {
        this.toastService.showErrorHTMLWithTimeout(error.message, "", 3000)
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
      })

      // this.getDataContract(id, 'copy');
    }
  }

  openEdit(id: number) {
    // //@ts-ignore
    // if (JSON.parse(localStorage.getItem('is_action_contract_created'))) {
    //   localStorage.removeItem('is_action_contract_created');
    // }
    this.getDataContract(id, 'edit')
  }

  addContractConnectNew(id: number) {
    this.router.navigate(['main/form-contract/add-contract-connect/' + id]);
  }

  getDataContract(id: number, action: string) {
    setTimeout(() => {
      if (action == 'copy')
        void this.router.navigate(['main/form-contract/copy/' + id]);
      else void this.router.navigate(['main/form-contract/edit/' + id]);
    }, 100)

    // this.spinner.show();
    // this.contractService.getDetailContract(id).subscribe((rs: any) => {
    //   let data_api = {
    //     is_data_contract: rs[0],
    //     i_data_file_contract: rs[1],
    //     is_data_object_signature: rs[2]
    //   }
    //   this.contractService.changeMessage(data_api);
    //   setTimeout(() => {
    //     if (action == 'copy')
    //     void this.router.navigate(['main/form-contract/copy/' + id]);
    //     else void this.router.navigate(['main/form-contract/edit/' + id]);
    //   }, 100)
    // }, () => {
    //   this.spinner.hide();
    //   this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
    // }, () => {
    //   this.spinner.hide();
    // })
  }

  deleteItem(id: number) {
    this.statusPopup = 1;
    this.notificationPopup = "Xóa hợp đồng thành công";
  }

  searchContract() {
    const data = {
      title: 'TÌM KIẾM HỢP ĐỒNG',
      filter_type: this.filter_type,
      filter_contract_no: this.filter_contract_no,
      filter_from_date: this.filter_from_date,
      filter_to_date: this.filter_to_date,
      status: this.status
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(FilterListDialogComponent, {
      width: '580px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  cancelContract(id: any) {
    const data = {
      title: 'XÁC NHẬN HỦY HỢP ĐỒNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(CancelContractDialogComponent, {
      width: '500px',
      backdrop: 'static',
      keyboard: false,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
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
      console.log('the close dialog');
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
      console.log('the close dialog');
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
      console.log('the close dialog');
      let is_data = result
    })
  }

  deleteContract(id: any) {
    const data = {
      title: 'XÁC NHẬN XÓA HỢP ĐỒNG',
      id: id
    };
    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteContractDialogComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })
  }

  downloadContract(id: any) {
    this.contractService.getFileZipContract(id).subscribe((data) => {
      //console.log(data);
      this.uploadService.downloadFile(data.path).subscribe((response: any) => {
        //console.log(response);

        let url = window.URL.createObjectURL(response);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = data.name;
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

}
