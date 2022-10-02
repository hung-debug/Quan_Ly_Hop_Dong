import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/service/app.service';
import * as contractModel from './model/contract-model';

import { ContractSignatureService } from '../../service/contract-signature.service';
import { CONTRACT_RECEIVE_COORDINATOR } from './model/contract-model';
import { variable } from '../../config/variable';
import { HttpClient } from '@angular/common/http';
import { ContractService } from '../../service/contract.service';
import { FilterListDialogComponent } from './dialog/filter-list-dialog/filter-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadService } from 'src/app/service/upload.service';
import { ToastService } from 'src/app/service/toast.service';
import * as moment from 'moment';
import { sideList } from 'src/app/config/variable';
import { DatePipe } from '@angular/common';
import { DialogSignManyComponentComponent } from './dialog/dialog-sign-many-component/dialog-sign-many-component.component';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { encode } from 'base64-arraybuffer';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-contract',
  templateUrl: './contract-signature.component.html',
  styleUrls: ['./contract-signature.component.scss'],
})
export class ContractSignatureComponent implements OnInit {
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

  p: number = 1;
  page: number = 5;
  pageStart: number = 0;
  pageEnd: number = 0;
  pageTotal: number = 0;
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

  typeDisplay: string = 'signOne';

  contract_signatures: any = 'c';
  signatures: any = 's9';

  consider: any = 'c9';
  secretary: any = 's8';
  coordinates: any = 'c8';
  signCertDigital: any;
  nameCompany: any;

  constructor(
    private modalService: NgbModal,
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
    private spinner: NgxSpinnerService
  ) {
    this.constantModel = contractModel;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (typeof params.filter_name != 'undefined' && params.filter_name) {
        this.filter_name = params.filter_name;
      } else {
        this.filter_name = '';
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
    });
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
  }

  signMany() {
    this.typeDisplay = 'signMany';

    console.log('vao day');

    this.contractService
      .getContractMyProcessListSignMany()
      .subscribe((data) => {
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
          this.contractsSignMany[v].typeOfSign = key.sign_type[0].name;
          this.contractsSignMany[v].checked = false;
        });
      });
  }

  cancelSignMany() {
    this.typeDisplay = 'signOne';
  }

  getContractList() {
    if (this.filter_status % 10 == 1) {
      this.filter_status = 1;
    }

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
          this.page
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
        });
    } else if (this.filter_status == 1 || this.filter_status == 4) {
      if (this.typeDisplay == 'signOne')
        this.contractService
          .getContractMyProcessList(
            this.filter_name,
            this.filter_type,
            this.filter_contract_no,
            this.filter_from_date,
            this.filter_to_date,
            this.filter_status,
            this.p,
            this.page
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
              this.contracts[v].typeOfSign = key.sign_type[0].name;
            });
          });
      else {
        this.contractService
          .getContractMyProcessListSignMany()
          .subscribe((data) => {
            this.contractsSignMany = data;
            if (this.pageTotal == 0) {
              this.p = 0;
              this.pageStart = 0;
              this.pageEnd = 0;
            } else {
              this.setPage();
            }
            this.contractsSignMany.forEach((key: any, v: any) => {
              this.contractsSignMany[v].contractId =
                key.participant.contract.id;
              this.contractsSignMany[v].contractName =
                key.participant.contract.name;
              this.contractsSignMany[v].contractNumber =
                key.participant.contract.code;
              this.contractsSignMany[v].contractSignTime =
                key.participant.contract.sign_time;
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
              this.contractsSignMany[v].typeOfSign = key.sign_type[0].name;
              this.contractsSignMany[v].checked = false;
            });
          });
      }
    } else {
      console.log(this.filter_status % 10);
      this.contractService
        .getContractMyProcessDashboard(
          this.filter_status % 10,
          this.p,
          this.page
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
        });
    }
  }

  sortParticipant(list: any) {
    if (list && list.length > 0) {
      return list.sort(
        (beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type
      );
    }
    return list;
  }

  getNameOrganization(item: any, index: any) {
    return sideList[index].name + ' : ' + item.name;
  }

  //auto search
  autoSearch(event: any) {
    this.p = 1;
    this.filter_name = event.target.value;
    this.getContractList();
  }

  private convertActionStr(): string {
    this.p = 1;
    return 'contract.list.received';
  }

  private convertStatusStr() {
    if (this.status == 'wait-processing') {
      this.filter_status = 1;
    } else if (this.status == 'processed') {
      this.filter_status = 4;
    } else if (this.status == 'share') {
      this.filter_status = -1;
    } else if (this.status == 'wait-processing-dashboard') {
      this.filter_status = 11;
    } else if (this.status == 'wait-processing-prepare-expires-dashboard') {
      this.filter_status = 12;
    } else if (this.status == 'processed-waiting-dashboard') {
      this.filter_status = 13;
    } else if (this.status == 'processed-complete-dashboard') {
      this.filter_status = 14;
    }
  }

  setPage() {
    this.pageStart = (this.p - 1) * this.page + 1;
    this.pageEnd = this.p * this.page;
    if (this.pageTotal < this.pageEnd) {
      this.pageEnd = this.pageTotal;
    }
  }

  signManyContract() {
    //Nếu chọn hợp đồng khác loại ký thì ko cho ký
    for (let i = 0; i < this.contractsSignMany.length; i++) {
      for (let j = i + 1; j < this.contractsSignMany.length; j++) {
        if (
          this.contractsSignMany[i].typeOfSign !=
          this.contractsSignMany[j].typeOfSign
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
    let signId = this.contractsSignMany[0].sign_type[0].id;

    let idSignMany: any = [];
    let recipientId: any = [];
    let taxCode: any = [];
    let subscribe: any = [];
    let idContract: any = [];
    let fileC: any = [];

    //Lấy id đã tick
    //2: usb token
    //4: hsm
    //id truyen len cua hsm la recipient id: idSignMany = recipientId
    //id truyen len cua usb token la field id
    if (signId == 4)
      idSignMany = this.contractsSignMany
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);
    else if (signId == 2) {
      idSignMany = this.contractsSignMany
        .filter((opt) => opt.checked)
        .map((opt) => opt.fields[0].id);
      recipientId = this.contractsSignMany
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);
      idContract = this.contractsSignMany
        .filter((opt) => opt.checked)
        .map((opt) => opt.participant.contract.id);

      //Lay ra mang chua tat ca ma so thue cua cac hop dong ky bang usb token
      for (let i = 0; i < recipientId.length; i++) {
        console.log('recipient id i ', recipientId[i]);
        subscribe[i] = this.contractServiceV1
          .getDetermineCoordination(recipientId[i])
          .subscribe((response) => {
            let lengthRes = response.recipients.length;

            for (let i = 0; i < lengthRes; i++) {
              taxCode.push(response.recipients[i].fields[0].recipient.cardId);
            }
          });
      }

      //Lấy ra url của các hợp đồng cần ký
      for(let i = 0; i < idContract.length; i++) {
        this.contractServiceV1.getFileContract(idContract[i]).subscribe((response) => {
          console.log("response ", response[0].path);
          fileC.push(response[0].path);
        });
      }
    }

    const dialogRef = this.dialog.open(DialogSignManyComponentComponent, {
      width: '580px',
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result == 1) {

          //Mã số thuế tại các hợp đồng cần giống nhau
          for (let i = 0; i < taxCode.length; i++) {
            for (let j = i + 1; j < taxCode.length; j++) {
              console.log('vao day');
              if (taxCode[i] != taxCode[j]) {
                this.toastService.showErrorHTMLWithTimeout(
                  'Mã số thuế tại các hợp đồng khác nhau',
                  '',
                  3000
                );
                return;
              }
            }
          }

         
        //ky bang usb token
        if (signId == 2) {
          this.spinner.show();

          let base64String: any = [];
          let x: any = [];
          let y: any = [];
          let h: any = [];
          let w: any = [];
          let page: any = [];
  
          for(let i = 0; i < fileC.length; i++) {
            //get base64 from url
            base64String[i] = await this.contractServiceV1.getDataFileUrlPromise(fileC[i])
            base64String[i] = encode(base64String[i]);

            //Lấy toạ độ ô ký của từng hợp đồng
            this.contractServiceV1.getDataObjectSignatureLoadChange(idContract[i]).subscribe((response) => {
              console.log("sig ", response);
              for(let j = 0; j < response.length; j++) {
                if(recipientId[i] = response[j].recipient.id) {
                  x.push(response[j].coordinate_x);
                  y.push(response[j].coordinate_y);
                  h.push(response[j].height);
                  w.push(response[j].width);
                  page.push(response[j].page);
                }
              }
            })
          }

          let signI = "";
              const imageRender = <HTMLElement>document.getElementById('export-html');
              if (imageRender) {
                const textSignB = await domtoimage.toPng(imageRender);
                signI = textSignB.split(",")[1];
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

                      //Gọi api ký usb token nhiều lần
                      for(let i = 0; i < fileC.length; i++) {
                        let dataSignMobi: any = await this.contractServiceV1.postSignDigitalMobiMulti(this.signCertDigital.Serial, base64String[i], signI, page[i],h[i], w[i],x[i], y[i]);

                        if (!dataSignMobi.data.FileDataSigned) {
                          console.log("file data signed ");
            
                          this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token', '', 3000);
                          return false;
                        }

                        const sign = await this.contractServiceV1.updateDigitalSignatured(idSignMany[i], dataSignMobi.data.FileDataSigned);
                        if (!sign.recipient_id) {
                          console.log("recipent_id")

                          this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token', '', 3000);
                          return false;
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
                  `<a href='https://drive.google.com/file/d/1-pGPF6MIs2hILY3-kUQOrrYFA8cRu7HD/view' target='_blank'>Tại đây</a>  và cài đặt`,
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#b0bec5',
                confirmButtonText: 'Xác nhận',
              });
            }
          );
        } else if (signId == 4) {
          //Ký nhiều hsm
        }
      }
    });
  }

  testCheckBox(item: any) {
    console.log('vao day checkbox ');
    const checkBox = document.getElementById(
      'check'
    ) as HTMLInputElement | null;

    if (checkBox != null) {
      if (checkBox.checked === true) {
        console.log('item ', item);
      }
    }
  }

  searchContract() {
    const data = {
      title: 'TÌM KIẾM HỢP ĐỒNG',
      filter_name: this.filter_name,
      filter_type: this.filter_type,
      filter_contract_no: this.filter_contract_no,
      filter_from_date: this.filter_from_date,
      filter_to_date: this.filter_to_date,
      status: this.status,
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
        //console.log(data);
        this.uploadService
          .downloadFile(data.path)
          .subscribe((response: any) => {
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

  openConsiderContract(item: any) {
    this.router.navigate(['main/c/c9/' + item.contractId], {
      queryParams: { recipientId: item.id },
    });
  }

  openDetail(id: number) {
    this.router.navigate(['main/form-contract/detail/' + id]);
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
              queryParams: { recipientId: item.id },
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
          // let data_coordination = {...this.datas, ...res};
          localStorage.setItem(
            'data_coordinates_contract_id',
            JSON.stringify({ data_coordinates_id: res.id })
          );
          this.router.navigate([
            'main/c/' + this.coordinates + '/' + item.contractId,
          ]);
        }
      },
      (res: any) => {
        alert('Có lỗi! vui lòng liên hệ với nhà phát triển để xử lý!');
      }
    );
  }

  openSecretaryContract(item: any) {
    this.router.navigate(['main/c/s8/' + item.contractId], {
      queryParams: { recipientId: item.id },
    });
  }

  t(item: any) {
    console.log(item);
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
