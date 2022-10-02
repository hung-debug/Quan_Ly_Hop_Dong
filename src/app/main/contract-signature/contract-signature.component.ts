import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import { HsmDialogSignComponent } from './components/consider-contract/hsm-dialog-sign/hsm-dialog-sign.component';

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
  nameCompany:any;
  dataHsm: any;

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

    let contractsSignManyChecked = this.contractsSignMany.filter((opt) => opt.checked);

    console.log("contracts sign many checked ", contractsSignManyChecked);
    for (let i = 0; i < contractsSignManyChecked.length; i++) {
      for (let j = i + 1; j < contractsSignManyChecked.length; j++) {
        if (
          contractsSignManyChecked[i].sign_type[0].id !=
          contractsSignManyChecked[j].sign_type[0].id
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
      idSignMany = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);
    else if (signId == 2) {
      idSignMany = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.fields[0].id);
      recipientId = contractsSignManyChecked
        .filter((opt) => opt.checked)
        .map((opt) => opt.id);
      idContract = contractsSignManyChecked
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
    dialogRef.afterClosed().toPromise().then(async (result: any) => {

      //result = 1 tương ứng với nhấn nút đồng ý và ký
      if (result == 1) {


          //Mã số thuế tại các hợp đồng cần giống nhau
          for (let i = 0; i < taxCode.length; i++) {
            for (let j = i + 1; j < taxCode.length; j++) {
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

         
        if (signId == 2) {
          this.spinner.show();          

          //ky bang usb token

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

                        if(i == fileC.length) {
                          this.spinner.hide();
                          return;
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

          const dialogRef = this.dialog.open(HsmDialogSignComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(async (resultHsm: any) => {
            if (resultHsm) {

              this.dataHsm = {
                     taxCode: resultHsm.ma_dvcs,
                     username: resultHsm.username,
                     password: resultHsm.password,
                     password2: resultHsm.password2,
                     imageBase64: "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",
              }

              this.spinner.show();
              

              //Call api ký nhiều hsm
              const checkSign = await this.contractServiceV1.signHsmMulti(this.dataHsm, idSignMany);
        
            }
          })
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
