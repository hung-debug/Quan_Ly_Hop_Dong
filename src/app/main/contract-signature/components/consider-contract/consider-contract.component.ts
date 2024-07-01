import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ContractService } from '../../../../service/contract.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import * as $ from 'jquery';
import { ProcessingHandleEcontractComponent } from '../../shared/model/processing-handle-econtract/processing-handle-econtract.component';
import interact from 'interactjs';
import { variable } from '../../../../config/variable';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppService } from '../../../../service/app.service';
import { ConfirmSignOtpComponent } from './confirm-sign-otp/confirm-sign-otp.component';
import { ImageDialogSignComponent } from './image-dialog-sign/image-dialog-sign.component';
import { PkiDialogSignComponent } from './pki-dialog-sign/pki-dialog-sign.component';
import { HsmDialogSignComponent } from './hsm-dialog-sign/hsm-dialog-sign.component';
import { CertDialogSignComponent } from './cert-dialog-sign/cert-dialog-sign.component';
import { forkJoin, from, throwError, timer } from 'rxjs';
import { ToastService } from '../../../../service/toast.service';
import { UploadService } from '../../../../service/upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { encode } from 'base64-arraybuffer';
import { UserService } from '../../../../service/user.service';
// @ts-ignore
import domtoimage from 'dom-to-image';
import { concatMap, delay, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  networkList,
  chu_ky_anh,
  chu_ky_so,
} from '../../../../config/variable';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EkycDialogSignComponent } from './ekyc-dialog-sign/ekyc-dialog-sign.component';
import { UnitService } from 'src/app/service/unit.service';
import { Helper } from 'src/app/core/Helper';
import { CheckViewContractService } from 'src/app/service/check-view-contract.service';
import { TranslateService } from '@ngx-translate/core';
import { DowloadPluginService } from 'src/app/service/dowload-plugin.service';
import { DetectCoordinateService } from 'src/app/service/detect-coordinate.service';
import { TimeService } from 'src/app/service/time.service';
import { vgca_sign_issued } from 'src/assets/plugins/vgcaplugin';
import { WebSocketSubject } from "rxjs/webSocket";
import { WebsocketService } from 'src/app/service/websocket.service';
import { environment } from 'src/environments/environment';
import { RemoteDialogSignComponent } from './remote-dialog-sign/remote-dialog-sign.component';

@Component({
  selector: 'app-consider-contract',
  templateUrl: './consider-contract.component.html',
  styleUrls: ['./consider-contract.component.scss'],
})
export class ConsiderContractComponent
  implements OnInit, OnDestroy, AfterViewInit {
  datas: any;
  data_contract: any;
  data_coordinates: any;
  @Input() step: any;
  @ViewChild('itemElement') itemElement: QueryList<ElementRef> | undefined;
  @Output() stepChangeSampleContract = new EventEmitter<string>();
  pdfSrc: any;
  thePDF: any = null;
  pageNumber = 1;
  pageMobile = 1;
  canvasWidth = 0;
  ratioPDF = 595 / 1240;
  currentHeight = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  defaultScale: any = 1.0;
  objPdfProperties: any = {
    pages: [],
  };
  confirmConsider = null;
  confirmSignature = null;

  taxCodePartnerStep2: any;

  pageNum: number = 1;

  dataVersion2: any;
  type: any = 0;

  currPage = 1; //Pages are 1-based not 0-based
  numPages = 0;
  x0: any = 'abc';
  y0: any = 'bcd';
  listEmail: any = [];
  coordinates_signature: any;
  obj_toa_do = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };
  text = 'Chữ ký';
  mouseoverLeftLayer = {
    layerX: 0,
    layerY: 0,
  };
  isMove = false;

  objSignInfo: any = {
    id: '',
    showObjSign: false,
    nameObj: '',
    emailObj: '',
    traf_x: 0,
    traf_y: 0,
    x1: 0,
    y1: 0,
    offsetHeight: 0,
    offsetWidth: 0,
  };

  list_sign_name: any = [];
  signCurent: any;
  currentUser: any;

  isView: any;
  view = true;
  countAttachFile = 0;
  widthDrag: any;

  isEnableSelect: boolean = true;
  isEnableText: boolean = false;
  isChangeText: boolean = false;
  loaded: boolean = false;
  loadedPdfView: boolean = false;
  allFileAttachment: any[];
  allRelateToContract: any[];

  optionsSign: any = [
    { item_id: 1, item_text: 'Ký ảnh' },
    { item_id: 2, item_text: 'Ký số bằng USB token' },
    { item_id: 3, item_text: 'Ký số bằng sim PKI' },
    { item_id: 4, item_text: 'Ký số bằng HSM' },
  ];
  typeSign: any = 0;
  isOtp: boolean = false;
  recipientId: any;
  recipient: any;
  idContract: any;
  isDataFileContract: any;
  isDataContract: any;
  isDataObjectSignature: any;
  valid: boolean = false;
  signCertDigital: any;
  dataNetworkPKI: any;
  nameCompany: any;
  base64GenCompany: any;
  textSign: any;
  textSignBase64Gen: any;
  signInfoPKIU: any = {};
  // heightText: any = 200;
  widthText: any = '';
  loadingText: string = 'Đang xử lý...';
  phoneOtp: any;
  isDateTime: any;
  userOtp: any;
  dataHsm: any;
  dataCert: any;
  trustedUrl: any;
  idPdfSrcMobile: any;

  sessionIdUsbToken: any;
  emailRecipients: any;
  //id tổ chức của người tạo hợp đồng
  orgId: any;

  phonePKI: any;
  usbTokenVersion: number;

  coordinateY: any[] = [];
  idElement: any[] = [];

  loginType: any;
  difX: number;
  arrDifPage: any = [];

  sum: number[] = [];
  top: any[] = [];
  multiSignInPdf: boolean = false;
  widthSign: number;
  heightSign: number;
  company: string | null = null;
  nameHsm: string | null = null;
  name: string | null = null;
  mst: string | null = null;
  cccd: string | null = null;
  cmnd: string | null = null;
  cert_id: any;
  dataCardId: any;
  ekycDocType: string = ''
  isContainSignField: boolean = true;
  isNB: boolean = false;
  signBoxData: any = {};

  defaultValue: number = 100;


  constructor(
    private contractService: ContractService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastService: ToastService,
    private uploadService: UploadService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    private deviceService: DeviceDetectorService,
    private unitService: UnitService,
    private checkViewContractService: CheckViewContractService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ConsiderContractComponent>,
    private downloadPluginService: DowloadPluginService,
    private detectCoordinateService: DetectCoordinateService,
    private timeService: TimeService,
    private websocketService: WebsocketService,

  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;

    this.loginType = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.type;

  }

  pdfSrcMobile: any;

  async ngOnInit(): Promise<void> {
    if (environment.flag == "NB") {
      this.isNB = true
    } else {
      this.isNB = false
    }
    this.getDeviceApp();

    this.appService.setTitle('THÔNG TIN HỢP ĐỒNG');

    this.idContract = this.activeRoute.snapshot.paramMap.get('id');

    const checkViewContract = await this.checkViewContractService.callAPIcheckViewContract(this.idContract, false);


    if (checkViewContract) {
      this.actionRoleContract();
    } else {
      this.router.navigate(['/page-not-found']);
    }

    if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
      this.type = 1;
    } else this.type = 0;

    let recipientIdParam: any 
    this.activeRoute.queryParams.subscribe((param: any) => recipientIdParam = param.recipientId)
    await this.getRemoteSigningCurrentStatusCall(recipientIdParam)
    await this.getCurrentFieldsData()
  }

  async getCurrentFieldsData() {
    let res = await this.contractService.getDetermineCoordination(this.recipientId).toPromise()
    let recipData: any = []
    recipData = res?.recipients.filter((item: any) => item.email == this.currentUser.email)
    this.isContainSignField = recipData[0]?.fields.some((ele: any) => ele.type == 3)
  }

  firstPageMobile() {
    this.pageMobile = 1;
    this.page1 = false;
    this.pageLast = true;
  }

  previousPageMobile() {
    if (this.pageMobile > 1) {
      this.pageMobile--;
    }
  }

  onNextPageMobile() {
    if (this.pageMobile < this.pageNumber) {
      this.pageMobile++;
      this.page1 = true;
    }
  }

  lastPageMobile() {
    this.pageMobile = this.pageNumber;
    this.page1 = true;
    this.pageLast = false;
  }

  pagechanging(event: any) {
    if (event.pageNumber > 1 && event.pageNumber < this.pageNumber) {
      this.page1 = true;
      this.pageLast = true;
    } else if (event.pageNumber == 1) {
      this.page1 = false;
      this.pageLast = true;
    } else if ((event.pageNumber = this.pageNumber)) {
      this.page1 = true;
      this.pageLast = false;
    }
  }

  afterLoadComplete(event: any) {
    this.pageNumber = event._pdfInfo.numPages;
  }

  pageBefore: number;
  status: any;
  actionRoleContract() {
    this.activeRoute.queryParams.subscribe((params) => {
      this.recipientId = params.recipientId ? params.recipientId : params.id;
      this.pageBefore = params.page;
      this.status = params.status;

      //kiem tra xem co bi khoa hay khong
      this.contractService.getStatusSignImageOtp(this.recipientId).subscribe(
        (data) => {
          if (!data.locked) {
            this.getDataContractSignature();
          } else {
            this.toastService.showErrorHTMLWithTimeout(
              'Bạn đã nhập sai OTP 5 lần liên tiếp.<br>Quay lại sau ' +
              this.datepipe.transform(data.nextAttempt, 'dd/MM/yyyy HH:mm'),
              '',
              3000
            );
            this.router.navigate([
              '/main/form-contract/detail/' + this.idContract,
            ]);
          }
        },
        (error) => {
          return this.toastService.showErrorHTMLWithTimeout("error.server","",3000)
        }
      );
    });
  }
  
  changeScale(values: any){
    switch (values){
      case "-":
        if(this.scale > 0.25){
          this.scale = this.scale - 0.25;
          this.defaultValue = this.scale * 100
          // for (let page = 1; page <= this.pageNumber; page++) {
          //   let canvas = document.getElementById('canvas-step3-' + page);
          //   this.renderPageZoomInOut(page, canvas);
          // }
          this.getPage();

        }else{
          break;
        }
        break;
      case "+":
        if(this.scale < 5){
          this.scale = this.scale + 0.25;
          this.defaultValue = this.scale * 100
          // for (let page = 1; page <= this.pageNumber; page++) {
          //   let canvas = document.getElementById('canvas-step3-' + page);
          //   this.renderPageZoomInOut(page, canvas);
          // }
          this.getPage();
        }else{
          break;
        }
        break;
      default:
        break;
    }
  }
  
  changeRotate(values: any){
    
  }

  page1: boolean = false;
  pageLast: boolean = true;
  scroll(event: any) {
    //đổi màu cho nút back page
    let canvas1: any = document.getElementById('canvas-step3-1');

    if (event.srcElement.scrollTop < canvas1.height / 2) {
      this.page1 = false;
    } else {
      this.page1 = true;
    }

    //đổi màu cho nút next page
    let canvasLast: any = document.getElementById(
      'canvas-step3-' + this.pageNumber
    );
    let step3: any = document.getElementById('pdf-viewer-step-3');
    if (
      event.srcElement.scrollTop <
      Number(
        canvasLast.getBoundingClientRect().top -
        step3.getBoundingClientRect().top
      )
    ) {
      this.pageLast = true;
    } else {
      this.pageLast = false;
    }

    this.pageNum = Number(
      Math.floor(event.srcElement.scrollTop / canvas1.height) + 1
    );

    let scrollTop = Number(event.srcElement.scrollTop);

    for (let i = 0; i < this.sum.length; i++) {
      if (this.sum[i] < scrollTop && scrollTop < this.sum[i + 1]) {
        this.pageNum = Number(i + 2);
      }
    }
  }

  indexY: number = 0;
  autoScroll() {
    let pdffull: any = document.getElementById('pdf-full');

    if (this.confirmSignature == 1)
      pdffull.scrollTo(0, this.coordinateY[this.indexY]);

    if (this.indexY <= this.coordinateY.length - 1) {
      this.indexY++;
    } else {
      this.indexY = 0;
      pdffull.scrollTo(0, 0);
    }
  }

  async getVersionUsbToken(orgId: any) {
    const dataOrg = await this.contractService
      .getDataNotifyOriganzationOrgId(orgId)
      .toPromise();


    if (dataOrg.usb_token_version == 1) {
      this.usbTokenVersion = 1;
    } else if (dataOrg.usb_token_version == 2) {

      this.usbTokenVersion = 2;
    }
  }

  timerId: any;
  typeSignDigital: any;
  isTimestamp: string = 'false';
  isNotTextSupport: boolean = false;
  originalContractName: string = "";
  getDataContractSignature() {
    this.contractService.getDetailContract(this.idContract).subscribe(
      async (rs) => {
        this.isDataContract = rs[0];
        this.isDataFileContract = rs[1];
        this.isDataObjectSignature = rs[2];
        this.checkNotSupportText(rs[2])
        if (this.isDataContract?.originalContractId) {
          this.contractService.getDetailInforContract(this.isDataContract?.originalContractId).subscribe(
            (res: any) => {
              this.originalContractName = res?.name
            }, (err: any) => {
            }
          )
        }
        // this.contractService.getDetailContract()
        //Hợp đồng huỷ status = 32 => link 404 đối với những người xử lý trong hợp đồng đó trừ người tạo
        if (this.isDataContract.status == 32) {
          //lấy người tạo
          const callApiBpmn = await this.contractService
            .viewFlowContract(this.idContract)
            .toPromise();

          if (!this.mobile) {
            if (callApiBpmn.createdBy.email != this.currentUser.email) {
              this.toastService.showErrorHTMLWithTimeout(
                'not.process.contract',
                '',
                3000
              );
              return;
            }
          } else {
            alert(this.translate.instant('not.process.contract'));
            return;
          }
        }

        //Show thông báo khi hợp đồng hết hiệu lực
        if(this.isDataContract.release_state != 'CON_HIEU_LUC') {
          if(!this.mobile) {
            this.toastService.showErrorHTMLWithTimeout('expire.time.contract.notif','',3000);
          } else {
            alert(this.translate.instant('expire.time.contract.notif'));
          }
        }


        if (this.isDataContract.ceca_push == 1) {
          this.isTimestamp = 'true';
        } else {
          this.isTimestamp = 'false';
        }

        if (rs[0] && rs[1] && rs[1].length && rs[2] && rs[2].length) {
          this.valid = true;
        }
        this.data_contract = {
          is_data_contract: rs[0],
          i_data_file_contract: rs[1],
          is_data_object_signature: rs[2],
        };

        this.orgId = this.data_contract.is_data_contract.organization_id;

        await this.getVersionUsbToken(this.orgId);

        this.datas = this.data_contract;
        if (this.datas?.is_data_contract?.type_id) {
          this.contractService.getContractTypes(this.datas?.is_data_contract?.type_id).subscribe((data) => {
            if (this.datas?.is_data_contract) {
              this.datas.is_data_contract.type_name = data;
            }
          });
        }

        if (
          this.data_contract?.is_data_contract?.status == 31 ||
          this.data_contract?.is_data_contract?.status == 30
        ) {
          this.router.navigate([
            '/main/form-contract/detail/' + this.idContract,
          ]);
        }
        this.allFileAttachment = this.datas.i_data_file_contract.filter(
          (f: any) => f.type == 3
        );
        this.allRelateToContract = this.datas.is_data_contract.refs;
        from(this.datas.is_data_contract.refs)
          .pipe(
            concatMap((rcE: any) => {
              return this.contractService.getFileContract(rcE.ref_id);
            }),
            tap((res) => {
              for (const eR of res) {
                if (eR.type == 2) {
                  for (const re of this.datas.is_data_contract.refs) {
                    if (re.ref_id == eR.contract_id) {
                      re.path = eR.path;
                    }
                  }
                }
              }
            })
          )
          .subscribe();
        this.checkIsViewContract();

        this.datas.is_data_object_signature.forEach((element: any) => {
          // 1: van ban, 2: ky anh, 3: ky so
          // tam thoi de 1: ky anh, 2: ky so
          if (element.type == 1) {
            element['sign_unit'] = 'text';
          }
          if (element.type == 2) {
            element['sign_unit'] = 'chu_ky_anh';
          }
          if (element.type == 3) {
            element['sign_unit'] = 'chu_ky_so';
          }
          if (element.type == 4) {
            element['sign_unit'] = 'so_tai_lieu';
          }
          if (element.type == 5) {
            element['sign_unit'] = 'text';
            element['text_type'] = 'currency';
          }

          if (element.recipient) {
            // set name (nguoi dc uy quyen hoac chuyen tiep)
            element.name = element.name;
          }
        });

        let data_sign_config_cks = this.datas.is_data_object_signature.filter(
          (p: any) => p.sign_unit == 'chu_ky_so'
        );
        let data_sign_config_cka = this.datas.is_data_object_signature.filter(
          (p: any) => p.sign_unit == 'chu_ky_anh'
        );
        let data_sign_config_text = this.datas.is_data_object_signature.filter(
          (p: any) => p.sign_unit == 'text'
        );
        let data_sign_config_so_tai_lieu =
          this.datas.is_data_object_signature.filter(
            (p: any) => p.sign_unit == 'so_tai_lieu'
          );

        this.datas.contract_user_sign =
          this.contractService.getDataFormatContractUserSign();

        this.datas.contract_user_sign.forEach((element: any) => {
          //
          if (element.sign_unit == 'chu_ky_so') {
            Array.prototype.push.apply(
              element.sign_config,
              data_sign_config_cks
            );
          } else if (element.sign_unit == 'chu_ky_anh') {
            Array.prototype.push.apply(
              element.sign_config,
              data_sign_config_cka
            );
          } else if (element.sign_unit == 'text') {
            Array.prototype.push.apply(
              element.sign_config,
              data_sign_config_text
            );
          } else if (element.sign_unit == 'so_tai_lieu') {
            Array.prototype.push.apply(
              element.sign_config,
              data_sign_config_so_tai_lieu
            );
          }
        });

        this.datas.action_title = 'Xác nhận';
        this.datas.roleContractReceived = this.recipient.role;

        for (const signUpdate of this.isDataObjectSignature) {
          if (signUpdate && (signUpdate.type == 3 || signUpdate.type == 2 || ((signUpdate?.recipient?.role == 4 && this.isNB))) &&
            [3, 4].includes(this.datas.roleContractReceived) &&
            signUpdate?.recipient?.email === this.currentUser.email &&
            signUpdate?.recipient?.role === this.datas?.roleContractReceived
          ) {
            if (signUpdate.recipient?.sign_type) {
              const typeSD = signUpdate.recipient?.sign_type.find(
                (t: any) => t.id != 1
              );
              if (typeSD) {
                this.typeSignDigital = typeSD.id;
              }
            }

            break;
          }
        }

        this.scale = 1.0;

        if (!this.signCurent) {
          this.signCurent = {
            offsetWidth: 0,
            offsetHeight: 0,
          };
        }
        this.fetchDataUserSimPki();

        const imgSignAcc = await this.userService.getSignatureUserById(this.currentUser.id).toPromise();
        this.datas.imgSignAcc = imgSignAcc;

        const markSignAcc = await this.userService.getMarkUserById(this.currentUser.id).toPromise();
        this.datas.markSignAcc = markSignAcc;

        // convert base64 file pdf to url
        if (this.datas?.i_data_file_contract) {
          let fileC = null;
          const pdfC2 = this.datas.i_data_file_contract.find(
            (p: any) => p.type == 2
          );
          const pdfC1 = this.datas.i_data_file_contract.find(
            (p: any) => p.type == 1
          );
          if (pdfC2) {
            fileC = pdfC2.path;
          } else if (pdfC1) {
            fileC = pdfC1.path;
          } else {
            return;
          }
          this.pdfSrc = fileC;

          let image_base64 = '';

          let arr = this.convertToSignConfig();
          this.signBoxData['coordinateY'] = []
          this.signBoxData.idElement = []

          arr.forEach((items: any) => {
            if (items.type == 2 || items.type == 3) {
              this.signBoxData.coordinateY.push(items.coordinate_y)
              this.signBoxData.idElement.push(items.id)
            } else {
              this.coordinateY.push(items.coordinate_y);
              this.idElement.push(items.id);
            }
          });

          this.coordinateY.sort();

          if (this.mobile) {
            if (arr[0])
              if (arr[0].recipient.sign_type[0].id == 5 || arr[0].recipient.sign_type[0].id == 1) {
                image_base64 = chu_ky_anh;
              } else {
                image_base64 = chu_ky_so;
              }
          }

          if (this.mobile && this.recipient.status < 2) {
            if (image_base64) {
              const recipient = await this.contractService.getDetermineCoordination(this.recipientId).toPromise();

              let fieldRecipientId: any = [];
              let countNotBoxSign: number = 0
              recipient.recipients.forEach((ele: any) => {
                if (ele.id == this.recipientId) {
                  fieldRecipientId = ele.fields.filter((item: any) => item.type !== 3 && item.type !== 2);
                  ele.fields.forEach((item: any) => {
                    if (item.type !== 2 && item.type !== 3) countNotBoxSign++
                  })
                }
              });
              if ((fieldRecipientId?.length == 0 || countNotBoxSign == 0) && this.recipient.sign_type[0].id !== 7) {
                const pdfMobile = await this.contractService.getFilePdfForMobile(this.recipientId, image_base64).toPromise();
                this.pdfSrcMobile = pdfMobile.filePath;
              } else if (fieldRecipientId.length >= 1) {
                this.multiSignInPdf = true;
                alert('Hợp đồng có chứa ô text/ ô số hợp đồng. Vui lòng thực hiện xử lý trên web hoặc ứng dụng di động!');
              } else if (this.recipient.sign_type[0].id == 7) {
                alert('Loại ký này không hỗ trợ trên web mobile. Vui lòng thực hiện ký trên web!');
              } else {
              }
            } else {
              this.pdfSrcMobile = this.pdfSrc;
            }
          } else {
            if (this.recipient.status >= 2) {
              setTimeout(() => {
                this.router.navigate([
                  '/main/form-contract/detail/' + this.idContract,
                ]);
              }, 1000);
            }
          }
        }
        // render pdf to canvas
        if (!this.mobile) this.getPage();
        this.loaded = true;
      },
      (res: any) => {
        // @ts-ignore
        this.handleError();
      }
    );
  }

  checkNotSupportText(signData: any) {
    signData = signData.filter((item: any) => item.recipient_id == this.recipientId)
    signData.forEach((element: any) => {
      if ([3,7,8].includes(element.recipient.sign_type[0].id) && signData.some((p: any) => p.type !== 3)) this.isNotTextSupport = true
    })
    if (this.isNotTextSupport) {
      this.containNotSupportTextSwalfire()
    }
  }
  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getListSignName(listSignForm: any = [], type_unit: string) {
    listSignForm.forEach((item: any) => {
      item['selected'] = false;
      item['sign_unit'] = type_unit;
      item['signType'] = item.signType;
      item['is_disable'] = false;
      this.list_sign_name.push(item);
    });
  }

  setWidth(d: any) {
    return {
      'width.px': this.widthDrag / 2,
    };
  }

  // view pdf qua canvas
  count: number = 0;
  coorX: any;
  async getPage() {
    // @ts-ignore
    const pdfjs = await import('pdfjs-dist/build/pdf');
    // @ts-ignore
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    pdfjs
      .getDocument(this.pdfSrc)
      .promise.then((pdf: any) => {
        this.thePDF = pdf;
        this.pageNumber = pdf.numPages || pdf.pdfInfo.numPages;
        this.removePage();
        this.arrPage = [];
        for (let page = 1; page <= this.pageNumber; page++) {
          let canvas = document.createElement('canvas');
          this.arrPage.push({ page: page });
          canvas.className = 'dropzone';
          canvas.id = 'canvas-step3-' + page;

          let idPdf = 'pdf-viewer-step-3';
          let viewer = document.getElementById(idPdf);
          if (viewer) {
            viewer.appendChild(canvas);
          }

          this.renderPage(page, canvas);
        }
      })
      .then(() => {
        setTimeout(() => {
          this.setPosition();
          this.eventMouseover();
          this.loadedPdfView = true;

          for (let i = 0; i <= this.pageNumber; i++) {
            this.top[i] = 0;

            if (i < this.pageNumber) this.sum[i] = 0;
          }

          for (let i = 1; i <= this.pageNumber; i++) {
            let canvas: any = document.getElementById('canvas-step3-' + i);
            this.top[i] = canvas.height;
          }

          for (let i = 0; i < this.pageNumber; i++) {
            this.top[i + 1] += this.top[i];
            this.sum[i] = this.top[i + 1];
          }

          //vuthanhtan
          let canvasWidth: any[] = [];
          for (let i = 1; i <= this.pageNumber; i++) {
            let canvas: any = document.getElementById('canvas-step3-' + i);
            this.top[i] = canvas.height;
            canvasWidth.push(canvas.getBoundingClientRect().left)
          }
          this.difX = Math.max(...canvasWidth) - Math.min(...canvasWidth);

          for (let i = 0; i < this.pageNumber; i++) {
            if (canvasWidth[i] == Math.min(...canvasWidth))
              this.arrDifPage.push('min');
            else
              this.arrDifPage.push('max');
          }
          if(this.count == 0){
            this.setX();
            this.count ++;
          }
        }, 100);
      });
  }

  setX() {
    let i = 0;
    this.datas.contract_user_sign.forEach((element: any) => {
      element.sign_config.forEach((item: any) => {
        const htmlElement: HTMLElement | null = document.getElementById(item.id);
        if (htmlElement) {
          var oldX = Number(htmlElement.getAttribute('data-x'));
          if (oldX) {
            var newX = oldX + this.difX;
            htmlElement.setAttribute('data-x', newX.toString());
          }
        }
        if (this.arrDifPage[Number(item.page) - 1] == 'max') {
          item.coordinate_x += this.difX;
        }
      })
    })
  }

  eventMouseover() { }

  ngAfterViewInit() {
    setTimeout(() => {
      // @ts-ignore
      // document.getElementById('input-location-x').focus();
      let width_drag_element = document.getElementById('width-element-info');
      this.widthDrag = width_drag_element
        ? width_drag_element.getBoundingClientRect().right -
        width_drag_element.getBoundingClientRect().left -
        15
        : '';

      const imageRender = <HTMLElement>document.getElementById('export-html');
      if (imageRender) {
        domtoimage
          .toPng(imageRender, this.getOptions(imageRender))
          .then((res: any) => {
            this.base64GenCompany = res.split(',')[1];
          });
      }
    }, 100);
    this.setPosition();
    this.eventMouseover();
  }

  // set lại vị trí đối tượng kéo thả đã lưu trước đó
  setPosition() {
    if (this.convertToSignConfig().length > 0) {
      this.convertToSignConfig().forEach((element: any) => {
        let a = document.getElementById(element.id);
        if (a) {
          if (element['coordinate_x'] && element['coordinate_y']) {
            // @ts-ignore
            a.style['z-index'] = '1';
          }
          a.setAttribute('data-x', element['coordinate_x']);
          a.setAttribute('data-y', element['coordinate_y']);
        }
      });
    }
  }

  removePage() {
    for (let page = 1; page <= this.pageNumber; page++) {
      let idCanvas = 'canvas-step3-' + page;
      let viewCanvas = document.getElementById(idCanvas);
      if (viewCanvas) {
        viewCanvas.remove();
      }
    }
  }

  pageRendering: any;
  pageNumPending: any = null;
  // hàm render các page pdf, file content, set kích thước width & height canvas
  renderPage(pageNumber: any, canvas: any) {
    //@ts-ignore
    this.thePDF.getPage(pageNumber).then((page) => {
      let viewport = page.getViewport({ scale: this.scale });

      let test = document.querySelector('.viewer-pdf');

      this.canvasWidth = viewport.width;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      let _objPage = this.objPdfProperties.pages.filter(
        (p: any) => p.page_number == pageNumber
      )[0];
      if (!_objPage) {
        this.objPdfProperties.pages.push({
          page_number: pageNumber,
          width: parseInt(viewport.width),
          height: viewport.height,
        });
      }

      var renderContext: any = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      };

      var interval = setInterval(() => {
        page.render(renderContext);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
      }, 2000);

      if (test) {
        let paddingPdf =
          (test.getBoundingClientRect().width - viewport.width) / 2;
        $('.viewer-pdf').css('padding-left', paddingPdf + 'px');
        $('.viewer-pdf').css('padding-right', paddingPdf + 'px');
      }
      this.activeScroll();
    });
  }
  
  resetToDefault(){
    if(this.scale != 1){
      this.scale = this.defaultScale;
      this.defaultValue = this.scale * 100
      this.getPage();
    }
    
  }
  
  // rotateCanvas() {
  //   const canvas = this.pdfCanvas.nativeElement;
  //   const context = canvas.getContext('2d');
  //   context.translate(canvas.width / 2, canvas.height / 2);
  //   context.rotate(this.rotationAngle * Math.PI / 180);
  //   context.translate(-canvas.width / 2, -canvas.height / 2);
  // }

  activeScroll() {
    document
      .getElementsByClassName('viewer-pdf')[0]
      .addEventListener('scroll', () => {
        const Imgs = [].slice.call(document.querySelectorAll('.dropzone'));
        Imgs.forEach((item: any) => {
          if (
            (item.getBoundingClientRect().top <= window.innerHeight / 2 &&
              item.getBoundingClientRect().bottom >= 0 &&
              item.getBoundingClientRect().top >= 0) ||
            (item.getBoundingClientRect().bottom >= window.innerHeight / 2 &&
              item.getBoundingClientRect().bottom <= window.innerHeight &&
              item.getBoundingClientRect().top <= 0)
          ) {
            let page = item.id.split('-')[2];
            $('.page-canvas').css('border', 'none');
            let selector = '.page-canvas.page' + page;
            $(selector).css('border', '2px solid #ADCFF7');
          }
        });
      });
  }

  // hàm set kích thước cho đối tượng khi được kéo thả vào trong hợp đồng
  changePosition(d?: any, e?: any, sizeChange?: any, backgroundColor?: string) {
    let style: any = 
    (d.sign_unit != 'chu_ky_anh' && d.sign_unit != 'chu_ky_so') ?
    {
      transform:
        'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      position: 'absolute',
      backgroundColor: d.valueSign ? '' : backgroundColor,
      "justify-content": "left"
    } :
    {
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": !d.valueSign ? '#FFFFFF' : '',
      "border": !this.otpValueSign ? "1px dashed #6B6B6B" : (this.otpValueSign) ? 'none' : '',
      "border-radius": "6px"
    }
    if (d.sign_unit != 'chu_ky_anh' && d.sign_unit != 'chu_ky_so' && this.isNotTextSupport) {
      style.backgroundColor = "#eff2f5"
      style.cursor = "not-allowed"
    } 

    // style.backgroundColor = d.valueSign ? '' : backgroundColor;
    style.display =
      (this.confirmConsider && this.confirmConsider == 1) ||
        (this.confirmSignature && this.confirmSignature == 1 && !this.isRemoteSigningType) ||
        (this.confirmSignature == 1 && this.isRemoteSigningType && !this.isRemoteSigningExpired && !this.isRemoteSigningProcessing)
        ? ''
        : 'none';
    if (d['width']) {
      style.width = parseInt(d['width']) + 'px';
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + 'px';
    }

    return style;
  }

  // Hàm thay đổi kích thước màn hình => scroll thuộc tính hiển thị kích thước và thuộc tính
  // @ts-ignore
  changeDisplay() {
    if (window.innerHeight < 670 && window.innerHeight > 634) {
      return {
        overflow: 'auto',
        height: 'calc(50vh - 113px)',
      };
    } else if (window.innerHeight <= 634) {
      return {
        overflow: 'auto',
        height: 'calc(50vh - 170px)',
      };
    } else return {};
  }

  // hàm stype đối tượng boder kéo thả
  changeColorDrag(role: any, valueSign: any, isDaKeo?: any) {
    if (isDaKeo && !valueSign.valueSign) {
      return 'ck-da-keo';
    } else if (!valueSign.valueSign) {
      return 'employer-ck';
    } else {
      return '';
    }
  }

  // get select người ký
  getSignSelect(d: any) {
    // lấy lại id của đối tượng ký khi click
    let set_id = this.convertToSignConfig().filter((p: any) => p.id == d.id)[0];
    let signElement;
    if (set_id) {
      this.objSignInfo.id = set_id.id;
      signElement = document.getElementById(this.objSignInfo.id);
    } else signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter(
        (p: any) => p.id == this.objSignInfo.id
      )[0];
      if (isObjSign) {
        this.objSignInfo.traf_x = d.coordinate_x;
        this.objSignInfo.traf_y = d.coordinate_y;

        this.objSignInfo.offsetWidth = parseInt(d.offsetWidth);
        this.objSignInfo.offsetHeight = parseInt(d.offsetHeight);

        this.isEnableText = d.sign_unit == 'text';

        this.isChangeText = d.sign_unit == 'so_tai_lieu';
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name;
        }
      }
      if (d.name) {
        this.list_sign_name.forEach((item: any) => {
          if (d.sign_unit == 'chu_ky_anh') {
            if (!item.signType.filter((p: any) => p.item_id == 1)[0]) {
              item.is_disable = true;
            } else item.is_disable = false;
          } else if (d.sign_unit == 'chu_ky_so') {
            if (!item.signType.filter((p: any) => p.item_id == 2)[0]) {
              item.is_disable = true;
            } else item.is_disable = false;
          } else item.is_disable = false;

          if (item.name == d.name) {
            item.selected = true;
          } else item.selected = false;
        });
      } else {
        //@ts-ignore
        document.getElementById('select-dropdown').value = '';
      }
    }
  }

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    if (
      this.datas &&
      this.isDataObjectSignature &&
      this.isDataObjectSignature.length
    ) {
      return this.datas.is_data_object_signature.filter(
        (item: any) =>
          item?.recipient?.email === this.currentUser.email &&
          item?.recipient?.role === this.datas?.roleContractReceived
      );
    } else {
      return [];
    }
  }

  processHandleContract() {
    // alert('Luồng xử lý hợp đồng!');
    const data = this.datas;
    // @ts-ignore
    const dialogRef = this.dialog.open(ProcessingHandleEcontractComponent, {
      width: '1000px',
      backdrop: 'static',
      keyboard: true,
      data,
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      let is_data = result;
    });
  }

  showThumbnail() {
    this.objSignInfo.showObjSign = false;
  }

  // tạo id cho đối tượng chưa được kéo thả
  getIdSignChuaKeo(id: any) {
    return 'chua-keo-' + id;
  }

  ngOnDestroy() {
    if (this.pdfSrcMobile) {
      clearInterval(this.pdfSrcMobile);
    }

    interact('.pdf-viewer-step-3').unset();
    interact('.drop-zone').unset();
    interact('.resize-drag').unset();
    interact('.not-out-drop').unset();
    interact.removeDocument(document);

    // Close the WebSocket connection when leaving the component
    this.websocketService.closeConnection();
  }

  resizableListener = (event: any) => {
    var target = event.target;

    // update the element's style
    target.style.width = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';
  };

  resizeSignature = (event: any) => {
    let x = parseFloat(event.target.getAttribute('data-x')) || 0;
    let y = parseFloat(event.target.getAttribute('data-y')) || 0;
    // translate when resizing from top or left edges
    this.signCurent = this.convertToSignConfig().filter(
      (p: any) => p.id == event.target.id
    )[0];
    if (this.signCurent) {
      if (event.rect.width <= 280) {
        this.signCurent.coordinate_x = x;
        this.signCurent.coordinate_y = y;
        this.objSignInfo.id = event.target.id;
        this.objSignInfo.traf_x = x;
        this.objSignInfo.traf_y = y;
        this.objSignInfo.width = event.rect.width;
        this.objSignInfo.height = event.rect.height;

        this.signCurent.width = event.rect.width;
        this.signCurent.height = event.rect.height;
        let _array = Object.values(this.obj_toa_do);
        this.signCurent.position = _array.join(',');
      }
    }
  };

  dragMoveListener = (event: any) => {
    this.objSignInfo.id = event.currentTarget.id;
    var target = event.target;
    this.isMove = true;
    // // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // // translate the element
    target.style.webkitTransform = target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';
    // // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  };

  getTrafX() {
    if (Math.round(this.objSignInfo.traf_x) <= 0) {
      return Math.round(this.objSignInfo.traf_x);
    } else return Math.round(this.objSignInfo.traf_x) - 1;
  }

  getTrafY() {
    return Math.round(this.objSignInfo.traf_y);
  }

  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.nextOrPreviousStep(step);
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeSampleContract.emit(step);
  }

  dieuphoi() {
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

  getNameContract(data: any) {
    return (' ' + data.file_name + ',').replace(/,\s*$/, '');
  }

  eKYC: boolean = false;
  eKYCContractUse: any;
  smsContractUse: any;
  eKYCContractBuy: any;
  smsContractBuy: any;
  ArrRecipientsNew: any;
  markImage: boolean = false;
  srcMark: any;
  currentNullValuePages: any;
  currentNullElement: any
  isRemoteSigningExpired: boolean = false
  isRemoteSigningProcessing: boolean = false

  isRemoteSigningType: boolean = false
  countReject: number = 0

  async checkDifferentName() {
    const nameUpdate = await this.contractService.getInforPersonProcess(this.recipientId).toPromise()
    return nameUpdate.name != this.recipient.name;
  }

  async submitEvents(e: any) {
    const isDifferentName = await this.checkDifferentName();
    if (isDifferentName) {
      this.toastService.showErrorHTMLWithTimeout(
        'Bạn không có quyền xử lý hợp đồng này!',
        '',
        3000
      );
      if (this.type == 1) {
        this.router.navigate(['/login']);
        this.dialog.closeAll();
        return
      } else {
        this.router.navigate(['/main/dashboard']);
        this.dialog.closeAll();
        return
      }
    }
    let haveSignPKI = false;
    let haveSignImage = false;
    let haveSignCert = false;
    let haveSignHsm = false;
    let haveSignRemote = false;

    let typeSignDigital: any = null;
    let typeSignImage: any = null;
    let isRemoteSigning: boolean = false
    const counteKYC = this.recipient?.sign_type.filter(
      (p: any) => p.id == 5
    ).length;
    isRemoteSigning = this.recipient.sign_type.some((item: any) => item.id == 8)
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;
    
    this.contractService.getRemoteSigningCurrentStatus(this.recipientId).subscribe(
      (res) => {
        if (res.isPresent && res.status == "DANG_XU_LY") {
          // this.toastService.showWarningHTMLWithTimeout("Hợp đồng đang được xử lý, vui lòng ký hợp đồng trên app CA2 RS và reload lại trang!","",3000)
          this.remoteSigningProcessingStatusSwalfire(res.status)
          return
          // this.toastService.showWarningHTMLWithTimeout("Vui lòng ký hợp đồng trên app CA2 RS và reload lại trang!","",3000)
        } else if (res.status == "HOAN_THANH") {
          // this.remoteSigningProcessingStatusSwalfire(res.status).then(res => {
          //   if (res.isConfirmed) {
          //     window.location.reload()
          //   }
          // })
          this.toastService.showSuccessHTMLWithTimeout('success_sign','',3000)
          this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(
                ['/main/form-contract/detail/' + this.idContract],
                {
                  queryParams: {
                    recipientId: this.recipientId,
                    consider: true,
                    action: 'sign',
                  },
                  skipLocationChange: true,
                }
              );
            });
        }
        else {
          if (res.status == "TU_CHOI" && this.countReject == 0) {
            this.remoteSigningProcessingStatusSwalfire(res.status)
            this.countReject++
          } else {
            this.contractService.getDetermineCoordination(this.recipientId).subscribe(async (response) => {
              this.ArrRecipientsNew = response.recipients.filter(
                (x: any) => x.email === this.currentUser.email
              );

              if (this.ArrRecipientsNew.length === 0) {
                this.toastService.showErrorHTMLWithTimeout(
                  'Bạn không có quyền xử lý hợp đồng này!',
                  '',
                  3000
                );
                if (this.type == 1) {
                  this.router.navigate(['/login']);
                  this.dialog.closeAll();
                  return;
                } else {
                  this.router.navigate(['/main/dashboard']);
                  this.dialog.closeAll();
                  return;
                }
              }

              if (counteKYC > 0) {
                if (this.mobile) {
                  if (this.confirmSignature == 1) {
                    this.eKYC = true;
                    this.eKYCSignOpen();
                    return;
                  } else if (this.confirmSignature == 2) {
                    this.rejectContract();
                    return;
                  }
                } else {
                  if (this.confirmSignature == 1) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Vui lòng ký eKYC trên ứng dụng điện thoại',
                      '',
                      3000
                    );
                    return;
                  } else if (this.confirmSignature == 2) {
                    this.rejectContract();
                    return;
                  }
                }
              }

              if (e && e == 1 && !this.confirmConsider && !this.confirmSignature) {
                this.toastService.showErrorHTMLWithTimeout(
                  'Vui lòng chọn đồng ý hoặc từ chối hợp đồng',
                  '',
                  3000
                );
                return;
              }
              if (isRemoteSigning && (res.status == "QUA_THOI_GIAN_KY" || res.status == "THAT_BAI" || res.status == "TU_CHOI") ||
                this.isNotTextSupport
              ) {
                this.validateSignature = () => true
              }
              if (
                (e &&
                e == 1 &&
                !this.validateSignature() &&
                !(
                  (this.datas.roleContractReceived == 2 &&
                    this.confirmConsider == 2 &&
                    counteKYC <= 0) ||
                  (this.datas.roleContractReceived == 3 &&
                    this.confirmSignature == 2) ||
                  (this.datas.roleContractReceived == 4 && this.confirmSignature == 2)
                ))
              ) {
                if (!this.mobile) {
                  for (let item of this.currentNullElement) {
                    if (!item.value && item.type !== 4 && item.type !== 2) {
                      this.toastService.showErrorHTMLWithTimeout(
                        `Vui lòng nhập nội dung ô: ${item.name} (trang ${item.page})`,
                        '',
                        3000
                      );
                      return;
                    } else if (item.type == 4) {
                        this.toastService.showErrorHTMLWithTimeout(
                          `Vui lòng nhập nội dung ô: Số hợp đồng (trang ${item.page})`,
                          '',
                          3000
                        );
                        return;
                    } else {
                      this.toastService.showErrorHTMLWithTimeout(`Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc (trang ${item.page})`, '', 3000);
                      return;
                    }
                  }
                } else {
                  if (this.confirmSignature == 2) {
                    this.toastService.showErrorHTMLWithTimeout('Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc', '', 3000);
                    return;
                  } else {
                    this.imageDialogSignOpen(e, haveSignImage);
                    return;
                  }
                }
              } else if (
                e &&
                e == 1 &&
                !(
                  (this.datas.roleContractReceived == 2 &&
                    this.confirmConsider == 2) ||
                  (this.datas.roleContractReceived == 3 &&
                    this.confirmSignature == 2) ||
                  (this.datas.roleContractReceived == 4 && this.confirmSignature == 2)
                )
              ) {
                // let typeSignDigital = null;
                // let typeSignImage = null;
                if (this.recipient?.sign_type) {
                  const typeSD = this.recipient?.sign_type.find(
                    (t: any) => t.id != 1
                  );

                  const typeSImage = this.recipient?.sign_type.find(
                    (t: any) => t.id == 1
                  );
                  if (typeSD) {
                    typeSignDigital = typeSD.id;
                  }
                  if (typeSImage) {
                    typeSignImage = typeSImage.id;
                  }
                }

                if (typeSignDigital && typeSignDigital == 3) {
                  haveSignPKI = true;
                  this.dataNetworkPKI = {
                    networkCode: this.signInfoPKIU.networkCode,
                    phone: this.signInfoPKIU.phone,
                  };
                } else if (typeSignDigital && typeSignDigital == 4) {
                  haveSignHsm = true;

                  this.dataHsm = {
                    supplier: '',
                    ma_dvcs: '',
                    username: '',
                    password: '',
                    password2: '',
                    imageBase64: '',
                  };

                } else if (typeSignDigital == 6) {
                  haveSignCert = true;

                  this.dataCert = {
                    cert_id: '',
                    image_base64: '',
                    field: '',
                    width: '',
                    height: '',
                    isTimestamp: '',
                  }
                } else if (typeSignDigital && typeSignDigital == 8) {
                  haveSignRemote = true;

                  this.dataCert = {
                    cert_id: '',
                    image_base64: '',
                    field: '',
                    width: '',
                    height: '',
                    isTimestamp: '',
                  }

                }
        
                if (typeSignImage && typeSignImage == 1) {
                  haveSignImage = true;
                }
        
                if (typeSignImage && typeSignImage == 4) {
                  haveSignImage = true;
                }
              }
              if (
                e &&
                e == 1 &&
                !(
                  (this.datas.roleContractReceived == 2 &&
                    this.confirmConsider == 2) ||
                  (this.datas.roleContractReceived == 3 &&
                    this.confirmSignature == 2) ||
                  (this.datas.roleContractReceived == 4 && this.confirmSignature == 2)
                ) &&
                this.ArrRecipientsNew.length > 0 
              ) {
                let swalfire = null;
                if (typeSignDigital) {
                  swalfire = this.getSwalFire('digital');
                } else {
                  swalfire = this.getSwalFire('image');
                }
        
                swalfire.then(async (result) => {
                  if (result.isConfirmed) {
                    if (result.value == 'yes') {
                      this.markImage = true;
                    } else {
                      this.markImage = false;
                    }

                    let isConnect = false

                    if (this.recipient.sign_type.some((item: any) => item.id == 7 )) {
                      try {
                        isConnect = await this.websocketService.connect()
                      } catch (error) {
                        console.error(error)
                      }
                      if (!isConnect){
                          Swal.fire({
                            html:
                              'Vui lòng bật tool ký số hoặc tải ' +
                              `<a href='/assets/upload/VGCAServices.zip' target='_blank'>Tại đây</a> và cài đặt`,
                            icon: 'warning',
                            confirmButtonColor: '#0041C4',
                            cancelButtonColor: '#b0bec5',
                            confirmButtonText: 'Xác nhận',
                          });
                          return
                      }
                    }
                    let determineCoordination: any
                    try {
                      determineCoordination = await this.contractService.getDetermineCoordination(this.recipientId).toPromise();
                    } catch (error) {
                      return this.toastService.showErrorHTMLWithTimeout("Lỗi lấy thông tin người ký","",3000)
                    }
                    let isInRecipient = false;
                    const participants = this.datas?.is_data_contract?.participants;
                    if ((this.recipient.sign_type.some((item: any) => item.id == 7 ))) {
                      let checkCurrentSigning: any = await this.checkCurrentSigningCall()
                      if (!checkCurrentSigning) {
                        return
                      } else if (checkCurrentSigning) {
                        this.signBCY(this.pdfSrc, this.recipient.fields[0].id)
                        return
                      }
                    }

                    for (const participant of participants) {
                      for (const card of participant.recipients) {
                        for (const item of determineCoordination.recipients) {
                          if (item.card_id == card.card_id) {
                            isInRecipient = true;
                          }
                        }
                      }
                    }
                    if (!isInRecipient) {

                      this.toastService.showErrorHTMLWithTimeout(
                        'Bạn không có quyền xử lý hợp đồng này!',
                        '',
                        3000
                      );
                      if (this.type == 1) {
                        this.router.navigate(['/login']);
                        this.dialogRef.close();
                        this.spinner.hide();
                        return
                      } else {
                        this.router.navigate(['/main/dashboard']);
                        this.dialogRef.close();
                        this.spinner.hide();
                        return
                      }
                    }
                    this.currentUser = JSON.parse(
                      localStorage.getItem('currentUser') || ''
                    ).customer.info;

                    this.contractService.getDetermineCoordination(this.recipientId).subscribe(async (response) => {
                      //  = response.recipients[0].email
                      this.ArrRecipientsNew = response.recipients.filter(
                        (x: any) => x.email === this.currentUser.email
                      );

                      if (this.ArrRecipientsNew.length === 0) {
                        this.toastService.showErrorHTMLWithTimeout(
                          'Bạn không có quyền xử lý hợp đồng này!',
                          '',
                          3000
                        );
                        if (this.type == 1) {
                          this.router.navigate(['/login']);
                          this.dialog.closeAll();
                          return;
                        } else {
                          this.router.navigate(['/main/dashboard']);
                          this.dialog.closeAll();
                          return;
                        }
                      }


                      // Kiểm tra ô ký đã ký chưa (status = 2)
                      this.spinner.show();
                      let id_recipient_signature: any = null;
                      let phone_recipient_signature: any = null;
                      //
                      for (const d of this.datas.is_data_contract.participants) {
                        for (const q of d.recipients) {
                          if (q.email == this.currentUser.email && q.status == 1) {
                            id_recipient_signature = q.id;
                            this.phoneOtp = phone_recipient_signature = q.phone;
                            this.userOtp = q.name;
                            break;
                          }
                        }
                        if (id_recipient_signature) break;
                      }

                      //neu co id nguoi xu ly thi moi kiem tra
                      if (id_recipient_signature) {
                        this.contractService
                          .getCheckSignatured(id_recipient_signature)
                          .subscribe(
                            (res: any) => {
                              if (res && res.status == 2) {
                                this.spinner.hide();
                                this.toastService.showErrorHTMLWithTimeout(
                                  'contract_signature_success',
                                  '',
                                  3000
                                );
                              } else {
                                if (
                                  [2, 3, 4].includes(this.datas.roleContractReceived) &&
                                  haveSignImage
                                ) {
                                  this.confirmOtpSignContract(
                                    id_recipient_signature,
                                    phone_recipient_signature
                                  );
                                  this.spinner.hide();
                                } else if (
                                  [2, 3, 4].includes(this.datas.roleContractReceived) &&
                                  haveSignPKI
                                ) {
                                  if(this.markImage){
                                    this.openMarkSign('pki');
                                  }else{
                                    this.pkiDialogSignOpen();
                                    this.spinner.hide();
                                  }
                                } else if (
                                  [2, 3, 4].includes(this.datas.roleContractReceived) &&
                                  haveSignHsm
                                ) {
                                  if (this.markImage) {
                                    this.openMarkSign('hsm');

                                  } else {
                                    this.hsmDialogSignOpen(this.recipientId);
                                    this.spinner.hide();
                                  }
                                  this.spinner.hide();
                                } else if (
                                  [2, 3, 4].includes(this.datas.roleContractReceived) &&
                                  haveSignCert
                                ) {
                                  if (this.markImage) {
                                    this.openMarkSign('cert');
                                  } else {
                                    this.certDialogSignOpen(this.recipientId);
                                    this.spinner.hide();
                                  }
                                  this.spinner.hide();
                                } else if (
                                  [2, 3, 4].includes(this.datas.roleContractReceived) &&
                                  haveSignRemote
                                ) {
                                  if (this.markImage) {
                                    this.openMarkSign('remote');

                                  } else {
                                    this.remoteDialogSignOpen(this.recipientId);
                                    this.spinner.hide();
                                  }
                                  this.spinner.hide();
                                }

                                else if (
                                  [2, 3, 4].includes(this.datas.roleContractReceived)
                                ) {
                                  this.signContractSubmit();
                                }
                              }
                            },
                            (error: HttpErrorResponse) => {
                              this.spinner.hide();
                              this.toastService.showErrorHTMLWithTimeout(
                                'error_check_signature',
                                '',
                                3000
                              );
                            }
                          );
                      } else {
                        if (
                          [2, 3, 4].includes(this.datas.roleContractReceived) &&
                          haveSignPKI
                        ) {                      
                          this.pkiDialogSignOpen();
                          this.spinner.hide();
                        } else if (
                          [2, 3, 4].includes(this.datas.roleContractReceived)
                        ) {
                          this.signContractSubmit();
                        }
                      }
                    });
                  }
                });
              } else if (
                e &&
                e == 1 &&
                ((this.datas.roleContractReceived == 2 &&
                  this.confirmConsider == 2) ||
                  (this.datas.roleContractReceived == 3 &&
                    this.confirmSignature == 2) ||
                  (this.datas.roleContractReceived == 4 &&
                    this.confirmSignature == 2))
              ) {
                await this.rejectContract();
              }
              if (e && e == 2) {
                this.downloadContract(this.idContract);
              }
            });
          }
        }
    })

  }

  imageDialogSignOpen(e: any, haveSignImage: boolean) {
    const data = {
      title: 'KÝ HỢP ĐỒNG ',
      is_content: 'forward_contract',
      orgId: this.orgId,
      imgSignAcc: this.datas.imgSignAcc
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async (result: any) => {

      let is_data = result;
      this.otpValueSign = result
      this.datas.is_data_object_signature.valueSign = result;
      if (result) {
        if (
          e &&
          e == 1 &&
          !(
            (this.datas.roleContractReceived == 2 &&
              this.confirmConsider == 2) ||
            (this.datas.roleContractReceived == 3 &&
              this.confirmSignature == 2) ||
            (this.datas.roleContractReceived == 4 && this.confirmSignature == 2)
          )
        ) {
          let id_recipient_signature: any = null;
          let phone_recipient_signature: any = null;
          //
          for (const d of this.datas.is_data_contract.participants) {
            for (const q of d.recipients) {
              if (q.email == this.currentUser.email && q.status == 1) {
                id_recipient_signature = q.id;
                this.phoneOtp = phone_recipient_signature = q.phone;
                this.userOtp = q.name;
                break;
              }
            }
            if (id_recipient_signature) break;
          }

          //neu co id nguoi xu ly thi moi kiem tra
          if (id_recipient_signature) {
            this.contractService
              .getCheckSignatured(id_recipient_signature)
              .subscribe(
                (res: any) => {
                  if (res && res.status == 2) {
                    this.spinner.hide();
                    this.toastService.showErrorHTMLWithTimeout(
                      'contract_signature_success',
                      '',
                      3000
                    );
                  } else {
                    if ([2, 3, 4].includes(this.datas.roleContractReceived)) {
                      this.confirmOtpSignContract(
                        id_recipient_signature,
                        phone_recipient_signature
                      );
                      this.spinner.hide();
                    }
                  }
                },
                (error: HttpErrorResponse) => {
                  this.spinner.hide();
                  this.toastService.showErrorHTMLWithTimeout(
                    'error_check_signature',
                    '',
                    3000
                  );
                }
              );
          }
        } else if (
          e &&
          e == 1 &&
          ((this.datas.roleContractReceived == 2 &&
            this.confirmConsider == 2) ||
            (this.datas.roleContractReceived == 3 &&
              this.confirmSignature == 2) ||
            (this.datas.roleContractReceived == 4 &&
              this.confirmSignature == 2))
        ) {
          await this.rejectContract();
        }
      }
    });
  }

  openMarkSign(code: string, signUpdatePayload?: any, notContainSignImage?: any) {
    this.spinner.hide();
    const data = {
      title: this.translate.instant('mark.contract').toUpperCase(),
      is_content: 'forward_contract',
      markSignAcc: this.datas.markSignAcc,
      mark: true,
    };

    // @ts-ignore
    const dialogRef = this.dialog.open(ImageDialogSignComponent, {
      width: '1024px',
      backdrop: 'static',
      data: data,
      code: code
    });


    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.srcMark = res;

        this.spinner.show();

        if (code == 'hsm'){
          this.hsmDialogSignOpen(this.recipientId);
        }
        else if (code == 'cert'){
          this.certDialogSignOpen(this.recipientId);
        }
        else if (code == 'usb1'){
          this.signTokenVersion1(signUpdatePayload, notContainSignImage);
        }
        else if (code == 'usb2'){
          this.getSessionId(this.taxCodePartnerStep2, signUpdatePayload, notContainSignImage);
        }
        else if (code == 'remote'){
          this.remoteDialogSignOpen(this.recipientId);
        }
        else if (code == 'pki'){        
          this.pkiDialogSignOpen();  
        }
      }
    });
  }

  getSwalFire(code: string) {
    if ((code == 'digital' && !this.mobile && this.recipient.sign_type.some((item: any) => item.id !== 7) && this.isContainSignField)) {
      return Swal.fire({
        title: this.getTextAlertConfirm(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0041C4',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: this.translate.instant('confirm'),
        cancelButtonText: this.translate.instant('contract.status.canceled'),
        input: 'select',
        inputOptions: {
          no: this.translate.instant('no'),
          yes: this.translate.instant('yes'),
        },

        inputLabel: this.translate.instant('stamp.contract.questions'),
      });
    } else {
      return Swal.fire({
        title: this.getTextAlertConfirm(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0041C4',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: this.translate.instant('confirm'),
        cancelButtonText: this.translate.instant('contract.status.canceled'),
      });
    }
  }

  openPopupSignContract(typeSign: any) {
    if (typeSign == 1) {
    } else if (typeSign == 3) {
    } else if (typeSign == 4) {
      // this.hsmDialogSignOpen(this.recipientId);
    }
  }

  getTextAlertConfirm() {
    if (this.datas.roleContractReceived == 2) {
      if (this.confirmConsider == 1) {
        return 'Bạn có chắc chắn xác nhận hợp đồng này?';
      } else if (this.confirmConsider == 2) {
        return 'Bạn có chắc chắn từ chối hợp đồng này?';
      }
    } else if ([3, 4].includes(this.datas.roleContractReceived)) {
      if (this.confirmSignature == 1 && (this.datas.roleContractReceived == 3 || (!this.isContainSignField && this.datas.roleContractReceived == 4))) {
        return 'Bạn có đồng ý với nội dung của hợp đồng và xác nhận ký?';
      } else if (
        this.confirmSignature == 1 &&
        this.datas.roleContractReceived == 4 && this.isContainSignField
      ) {
        return 'Bạn có đồng ý với nội dung của hợp đồng và xác nhận đóng dấu?';
      } else if (this.confirmSignature == 2) {
        return 'Bạn không đồng ý với nội dung của hợp đồng và không xác nhận ký?';
      }
    }
  }

  getNameCoordination() { }

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  width: any;
  font: any;
  font_size: any;
  currentBoxSignType: any
  async signDigitalDocument() {
    let typeSignDigital = this.typeSignDigital;
    let checkCurrentSigningStatus: any = false;
    checkCurrentSigningStatus = await this.checkCurrentSigningCall()
    if (!checkCurrentSigningStatus) return false;
    if (typeSignDigital == 2) {
      if (this.signCertDigital) {
        for (const signUpdate of this.isDataObjectSignature) {
          if (signUpdate && (signUpdate.type == 1 || signUpdate.type == 3 || signUpdate.type == 4 || signUpdate.type == 5) && [3, 4].includes(this.datas.roleContractReceived) &&
            signUpdate?.recipient?.email === this.currentUser.email && signUpdate?.recipient?.role === this.datas?.roleContractReceived) {
            let fileC: any
            try {
              fileC = await this.contractService.getFileContractPromise(
                this.idContract
              );
            } catch (error) {
              return this.toastService.showErrorHTMLWithTimeout("get.contract.data.err","",3000)
            }
            const pdfC2 = fileC.find((p: any) => p.type == 2);
            const pdfC1 = fileC.find((p: any) => p.type == 1);
            if (pdfC2) {
              fileC = pdfC2.path;
            } else if (pdfC1) {
              fileC = pdfC1.path;
            } else {
              return;
            }
            let signI = null;

            if (this.usbTokenVersion == 1)
              this.prepareInfoSignUsbTokenV1(signUpdate.page);
            else if (this.usbTokenVersion == 2)
              this.prepareInfoSignUsbTokenV2(signUpdate.page);

            if (signUpdate.type == 1 || signUpdate.type == 4 || signUpdate.type == 5) {
              let imageRender = null;
              if (signUpdate.type == 4) {
                this.textSign = this.contractNoValueSign
              } else {
                this.textSign = signUpdate.valueSign
              }
              this.width = signUpdate.width;

              await of(null).pipe(delay(150)).toPromise();
              imageRender = <HTMLElement>(document.getElementById('text-sign'));

              this.font = signUpdate.font;
              this.font_size = signUpdate.font_size;

              this.widthText = this.calculatorWidthText(this.textSign, signUpdate.font);

              if (this.usbTokenVersion == 1) {
                signUpdate.signDigitalY = signUpdate.signDigitalY - signUpdate.page - 5;
                signUpdate.signDigitalWidth = signUpdate.signDigitalX + imageRender.offsetWidth;
                signUpdate.signDigitalHeight = signUpdate.signDigitalY + imageRender.offsetHeight;
              } else if (this.usbTokenVersion == 2) {
                signUpdate.signDigitalY = signUpdate.signDigitalY - signUpdate.page - 5;
                signUpdate.signDigitalWidth = imageRender.offsetWidth;
                signUpdate.signDigitalHeight = imageRender.offsetHeight;
              }

              await of(null).pipe(delay(120)).toPromise();

              if (imageRender) {
                const textSignB = await domtoimage.toPng(imageRender);
                signI = this.textSignBase64Gen = textSignB.split(',')[1];
              }
            } else if (signUpdate.type == 3 || ((signUpdate?.recipient?.role == 4 && this.isNB))) {
              //lấy ảnh chữ ký usb token
              let imageRender: any = '';

              try {
                this.isDateTime = await this.timeService.getRealTime().toPromise();
              } catch(err) {
                this.isDateTime = new Date();
              }

              if(!this.isDateTime) this.isDateTime = new Date();

              if (this.usbTokenVersion == 1) {
                if (this.markImage) {
                  await of(null).pipe(delay(150)).toPromise();
                  imageRender = <HTMLElement>(document.getElementById('export-html-image'));
                  // signUpdate.signDigitalWidth = signUpdate.signDigitalX + imageRender.offsetWidth;
                } else {
                  // await of(null).pipe(delay(150)).toPromise();
                  // imageRender = <HTMLElement>(document.getElementById('export-html'));
                  imageRender = null
                  signI = null
                }

                if (imageRender) {
                  try {
                    if (signUpdate.type !== 3) {
                      const textSignB = await domtoimage.toPng(imageRender, this.getOptions(imageRender));
                      signI = textSignB.split(',')[1];
                    } else {
                      signI = this.srcMark.split(',')[1]
                    }
                  } catch (err) {

                  }
                }
                try {
                  const getSignatureInfoTokenV1Data: any = await this.contractService.getSignatureInfoTokenV1(
                    this.signCertDigital.Base64, signI
                  ).toPromise()
                  signI = getSignatureInfoTokenV1Data.data
                } catch (error) {
                  this.spinner.hide()
                  console.log(error);
                }
              } else if (this.usbTokenVersion == 2) {
                if (this.markImage) {
                  await of(null).pipe(delay(150)).toPromise();
                  imageRender = <HTMLElement>(document.getElementById('export-html2-image'));
                  signUpdate.signDigitalWidth = imageRender.offsetWidth;
                } else {
                  // await of(null).pipe(delay(150)).toPromise();
                  // imageRender = <HTMLElement>(document.getElementById('export-html2'));
                  imageRender = null
                  signI = null
                }

                if (imageRender) {
                  if (signUpdate.type == 3 || ((signUpdate?.recipient?.role == 4 && this.isNB))) {
                    signI = this.srcMark.split(',')[1]
                  } else {
                    const textSignB = await domtoimage.toPng(imageRender, this.getOptions(imageRender));
                    signI = textSignB.split(',')[1];
                  }
                }
              }
            }

            const signDigital = JSON.parse(JSON.stringify(signUpdate));
            signDigital.Serial = this.signCertDigital.Serial;

            let base64String: any
            try {
              base64String = await this.contractService.getDataFileUrlPromise(fileC);
            } catch (error) {
              return this.toastService.showErrorHTMLWithTimeout("get.contract.data.err","",3000)
            }

            signDigital.valueSignBase64 = encode(base64String);

            if (this.usbTokenVersion == 2) {
              try {
                await this.createEmptySignature(signUpdate, signDigital, signI);
              } catch (err) {
                this.toastService.showErrorHTMLWithTimeout(
                  'Lỗi ký usb token ' + err,
                  '',
                  3000
                );
                return false;
              }

              if (this.failUsbToken) {
                return false;
              }

              const sign = await this.contractService.updateDigitalSignatured(
                signUpdate.id,
                this.base64Data
              );
              if (!sign.recipient_id) {
                this.spinner.hide()
                this.toastService.showErrorHTMLWithTimeout(
                  'Lỗi ký USB Token',
                  '',
                  3000
                );
                return false;
              }
            } else if (this.usbTokenVersion == 1) {
              const dataSignMobi: any =
                await this.contractService.postSignDigitalMobi(
                  signDigital,
                  signI
                );

              if (!dataSignMobi.data.FileDataSigned) {
                this.spinner.hide()
                this.toastService.showErrorHTMLWithTimeout(
                  'Lỗi ký USB Token',
                  '',
                  3000
                );
                return false;
              }
              const sign = await this.contractService.updateDigitalSignatured(
                signUpdate.id,
                dataSignMobi.data.FileDataSigned
              );

              if (!sign.recipient_id) {
                this.toastService.showErrorHTMLWithTimeout(
                  'Lỗi đẩy file sau khi ký usb token',
                  '',
                  3000
                );
                return false;
              }
            }
          }
        }
        if (this.usbTokenVersion == 2) {
          await this.signV2FixingProcess()
        }
        return true;
      } else {
        this.toastService.showErrorHTMLWithTimeout(
          'Lỗi ký USB Token',
          '',
          3000
        );
        return false;
      }
    } else if (typeSignDigital == 3) {
      const objSign = this.isDataObjectSignature.filter(
        (signUpdate: any) =>
          signUpdate &&
          signUpdate.type == 3 &&
          [3, 4].includes(this.datas.roleContractReceived) &&
          signUpdate?.recipient?.email === this.currentUser.email &&
          signUpdate?.recipient?.role === this.datas?.roleContractReceived
      );
      let fileC: any
      try {
        fileC = await this.contractService.getFileContractPromise(
          this.idContract
        );
      } catch (error) {
        return this.toastService.showErrorHTMLWithTimeout("get.contract.data.err","",3000)
      }
      const pdfC2 = fileC.find((p: any) => p.type == 2);
      const pdfC1 = fileC.find((p: any) => p.type == 1);
      if (pdfC2) {
        fileC = pdfC2.path;
      } else if (pdfC1) {
        fileC = pdfC1.path;
      } else {
        return;
      }

      this.phonePKI = this.dataNetworkPKI.phone;
      this.nameCompany = this.recipient.name;

      try {
        this.isDateTime = await this.timeService.getRealTime().toPromise();
      } catch(err) {
        this.isDateTime = new Date();
      }

      if(!this.isDateTime) this.isDateTime = new Date();
      await of(null).pipe(delay(120)).toPromise();

      let imageRender: HTMLElement | null = null;

      if (this.markImage) {
        imageRender = <HTMLElement>(
          document.getElementById('export-html-pki-image')
        );
      } else {
        imageRender = <HTMLElement>document.getElementById('export-html-pki');
      }

      let image_base64 = '';
      if (imageRender) {
        const textSignB = await domtoimage.toPng(imageRender, this.getOptions(imageRender));
        image_base64 = this.textSignBase64Gen = textSignB.split(',')[1];
      }
       
      if (fileC && objSign.length) {
        if(this.markImage == true){
          const checkSign = await this.contractService.signPkiDigital(
            this.dataNetworkPKI.phone,
            this.dataNetworkPKI.networkCode.toLowerCase(),
            this.recipientId,
            this.datas.is_data_contract.name,
            image_base64,
            this.isTimestamp,
            this.dataNetworkPKI.hidden_phone ? false : true,
          );
          // await this.signContractSimKPI();
          if (!checkSign || (checkSign && !checkSign.success)) {
            this.toastService.showErrorHTMLWithTimeout(
              'Ký số không thành công!',
              '',
              3000
            );
            return false;
          } else {
            return true;
          }
        } else{
          const checkSign = await this.contractService.signPkiDigital(
            this.dataNetworkPKI.phone,
            this.dataNetworkPKI.networkCode.toLowerCase(),
            this.recipientId,
            this.datas.is_data_contract.name,
            "",
            this.isTimestamp,
            this.dataNetworkPKI.hidden_phone ? false : true,
          );
          // await this.signContractSimKPI();
          if (!checkSign || (checkSign && !checkSign.success)) {
            this.toastService.showErrorHTMLWithTimeout(
              'Ký số không thành công!',
              '',
              3000
            );
            return false;
          } else {
            return true;
          }
        }
        
      }
    } else if (typeSignDigital == 4) {
      // HSM SIGN
      for (const signUpdate of this.isDataObjectSignature) {
        if (
          signUpdate &&
          (signUpdate.type == 1 ||
            signUpdate.type == 3 ||
            signUpdate.type == 4 || signUpdate.type == 5) &&
          [3, 4].includes(this.datas.roleContractReceived) &&
          signUpdate?.recipient?.email === this.currentUser.email &&
          signUpdate?.recipient?.role === this.datas?.roleContractReceived
        ) {
          const objSign = this.isDataObjectSignature.filter(
            (signUpdate: any) =>
              signUpdate &&
              (signUpdate.type == 3 || ((signUpdate?.recipient?.role == 4 && this.isNB))) &&
              [3, 4].includes(this.datas.roleContractReceived) &&
              signUpdate?.recipient?.email === this.currentUser.email &&
              signUpdate?.recipient?.role === this.datas?.roleContractReceived
          );

          let fileC: any
          try {
            fileC = await this.contractService.getFileContractPromise(
              this.idContract
            );
          } catch (error) {
            return this.toastService.showErrorHTMLWithTimeout("get.contract.data.err","",3000)
          }

          const pdfC2 = fileC.find((p: any) => p.type == 2);
          const pdfC1 = fileC.find((p: any) => p.type == 1);
          if (pdfC2) {
            fileC = pdfC2.path;
          } else if (pdfC1) {
            fileC = pdfC1.path;
          } else {
            return;
          }

          let signI = null;

          if (!this.mobile)
            this.convertXForHsm(signUpdate.page);
          let fieldHsm = {
            id: signUpdate.id,
            coordinate_x: signUpdate.signDigitalX ?? signUpdate.coordinate_x,
            coordinate_y: signUpdate.coordinate_y,
            width: signUpdate.width ,
            height: signUpdate.height,
            page: signUpdate.page,
          };

          if (signUpdate.type == 1 || signUpdate.type == 4 || signUpdate.type == 5) {
            if (signUpdate.type == 4) {
              this.textSign = this.contractNoValueSign
            } else {
              this.textSign = signUpdate.valueSign
            }

            this.font = signUpdate.font;
            this.font_size = signUpdate.font_size;

            this.width = signUpdate.width;

            await of(null).pipe(delay(120)).toPromise();
            const imageRender = <HTMLElement>(
              document.getElementById('text-sign')
            );

            if (imageRender) {
              const textSignB = await domtoimage.toPng(imageRender);
              signI = this.textSignBase64Gen = textSignB.split(',')[1];
            }
          } else if (signUpdate.type == 3 || ((signUpdate?.recipient?.role == 4 && this.isNB))) {

            try {
              this.isDateTime = await this.timeService.getRealTime().toPromise();
            } catch(err) {
              this.isDateTime = new Date();
            }
            if(!this.isDateTime) this.isDateTime = new Date();
            await of(null).pipe(delay(150)).toPromise();
            let imageRender: HTMLElement | null = null;

            //render khi role là 4 (văn thư) hoặc role khác (người ký)
            if (this.markImage) {
              imageRender = <HTMLElement>(
                document.getElementById('export-html-hsm1-image')
              );
            } else {
              imageRender = <HTMLElement>(
                document.getElementById('export-html-hsm1')
              );
            }

            // fieldHsm.coordinate_y = fieldHsm.coordinate_y - 8;
            // fieldHsm.height = imageRender.offsetHeight / 1.5;
            // fieldHsm.width = imageRender.offsetWidth / 1.5;

            if (imageRender) {
              const textSignB = await domtoimage.toPng(
                imageRender,
                this.getOptions(imageRender)
              );
              signI = textSignB.split(',')[1];
            }
          }
          if (!this.mobile || this.mobile) {
            this.dataHsm = {
              field: fieldHsm,
              supplier: this.dataHsm.supplier,
              ma_dvcs: this.dataHsm.ma_dvcs,
              username: this.dataHsm.username,
              password: this.dataHsm.password,
              password2: this.dataHsm.password2,
              imageBase64: (!this.markImage && signUpdate.type==3) ? null : (this.markImage && signUpdate.type==3) ? this.srcMark.split(',')[1] : signI,
            };
          } else {
            this.dataHsm = {
              field: fieldHsm,
              supplier: this.dataHsm.supplier,
              ma_dvcs: this.dataHsm.ma_dvcs,
              username: this.dataHsm.username,
              password: this.dataHsm.password,
              password2: this.dataHsm.password2,
              imageBase64: (!this.markImage && signUpdate.type==3) ? null :
                            (this.markImage && signUpdate.type==3) ? this.srcMark.split(',')[1] : signI,
            };
          }
          if (fileC && objSign.length) {
            if (!this.mobile || this.mobile) {
              const checkSign = await this.contractService.signHsm(
                this.dataHsm,
                this.recipientId,
                this.isTimestamp,
                signUpdate.type
              );
              if (!checkSign || (checkSign && !checkSign.success)) {
                if (!checkSign.message) {
                  this.toastService.showErrorHTMLWithTimeout(
                    'Đăng nhập không thành công',
                    '',
                    3000
                  );
                } else if (checkSign.message) {
                  if (checkSign.message.includes('Cannot authenticate hsm')) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Không thể xác thực hsm',
                      '',
                      3000
                    );
                  } else if (checkSign.message.includes('Tax code do not match')) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'taxcode.not.match',
                      '',
                      3000
                    );
                  } else {
                    this.toastService.showErrorHTMLWithTimeout(
                      checkSign.message,
                      '',
                      3000
                    );
                  }
                }

                return false;
              } else {
                if (checkSign.success === true) {
                  if (pdfC2) {
                    fileC = pdfC2.path;
                  } else if (pdfC1) {
                    fileC = pdfC1.path;
                  }
                }
              }
            } else {
              const checkSign = await this.contractService.signHsmOld(
                this.dataHsm,
                this.recipientId
              );

              if (!checkSign || (checkSign && !checkSign.success)) {
                if (!checkSign.message) {
                  this.toastService.showErrorHTMLWithTimeout(
                    'Đăng nhập không thành công',
                    '',
                    3000
                  );
                } else if (checkSign.message) {
                  this.toastService.showErrorHTMLWithTimeout(
                    checkSign.message,
                    '',
                    3000
                  );
                }

                return false;
              } else {
                if (checkSign.success === true) {
                  if (pdfC2) {
                    fileC = pdfC2.path;
                  } else if (pdfC1) {
                    fileC = pdfC1.path;
                  }
                }
              }
            }
          }
        }
      }
      return true;
    } else if (typeSignDigital == 5) {
      const objSign = this.isDataObjectSignature.filter(
        (signUpdate: any) =>
          signUpdate &&
          (signUpdate.type == 3 || signUpdate.type == 2) &&
          [3, 4].includes(this.datas.roleContractReceived) &&
          signUpdate?.recipient?.email === this.currentUser.email &&
          signUpdate?.recipient?.role === this.datas?.roleContractReceived
      );

      let fileC: any
      try {
        fileC = await this.contractService.getFileContractPromise(
          this.idContract
        );
      } catch (error) {
        return this.toastService.showErrorHTMLWithTimeout("get.contract.data.err","",3000)
      }
      const pdfC2 = fileC.find((p: any) => p.type == 2);
      const pdfC1 = fileC.find((p: any) => p.type == 1);
      if (pdfC2) {
        fileC = pdfC2.path;
      } else if (pdfC1) {
        fileC = pdfC1.path;
      } else {
        return;
      }

      if (fileC && objSign.length) return true;
    } else if (typeSignDigital == 6) {
      for (const signUpdate of this.isDataObjectSignature) {
        if (
          signUpdate &&
          (signUpdate.type == 1 ||
            signUpdate.type == 3 ||
            signUpdate.type == 4 ||
            signUpdate.type == 5)  &&
          [3, 4].includes(this.datas.roleContractReceived) &&
          signUpdate?.recipient?.email === this.currentUser.email &&
          signUpdate?.recipient?.role === this.datas?.roleContractReceived
        ) {
          const objSign = this.isDataObjectSignature.filter(
            (signUpdate: any) =>
              signUpdate &&
              (signUpdate.type == 3 || ((signUpdate?.recipient?.role == 4 && this.isNB))) &&
              [3, 4].includes(this.datas.roleContractReceived) &&
              signUpdate?.recipient?.email === this.currentUser.email &&
              signUpdate?.recipient?.role === this.datas?.roleContractReceived
          );

          let fileC: any
          try {
            fileC = await this.contractService.getFileContractPromise(
              this.idContract
            );
          } catch (error) {
            return this.toastService.showErrorHTMLWithTimeout("get.contract.data.err","",3000)
          }

          const pdfC2 = fileC.find((p: any) => p.type == 2);
          const pdfC1 = fileC.find((p: any) => p.type == 1);
          if (pdfC2) {
            fileC = pdfC2.path;
          } else if (pdfC1) {
            fileC = pdfC1.path;
          } else {
            return;
          }

          //for test
          let inforCert: any
          try {
            inforCert = await this.contractService
              .certInfoCert(this.cert_id)
              .toPromise();
          } catch (error) {
            return this.toastService.showErrorHTMLWithTimeout("get.cert.data.err","",3000)
          }
          this.name = inforCert.name;
          this.company = inforCert.company;
          this.cardId = inforCert.mst;
          this.cccd = inforCert.cccd;
          this.cmnd = inforCert.cmnd;
          let signI = null;
          // this.nameCompany = this.recipient.name;
          if (!this.mobile)
            this.convertXForHsm(signUpdate.page);

          let fieldCert = {
            page: signUpdate.page,
            coordinate_x: signUpdate.signDigitalX ?? signUpdate.coordinate_x,
            coordinate_y: signUpdate.coordinate_y,
            width: signUpdate.signDigitalWidth,
            height: signUpdate.signDigitalHeight,
          };
          if (signUpdate.type == 1 || signUpdate.type == 4 || signUpdate.type == 5) {
            if (signUpdate.type == 4) {
              this.textSign = this.contractNoValueSign
            } else {
              this.textSign = signUpdate.valueSign
            }

            this.font = signUpdate.font;
            this.font_size = signUpdate.font_size;

            this.width = signUpdate.width;

            await of(null).pipe(delay(120)).toPromise();
            const imageRender = <HTMLElement>(
              document.getElementById('text-sign')
            );

            fieldCert.width = imageRender.clientWidth;
            fieldCert.height = imageRender.clientHeight;

            if (imageRender) {
              const textSignB = await domtoimage.toPng(imageRender);
              signI = this.textSignBase64Gen = textSignB.split(',')[1];
            }
          } else if (signUpdate.type == 3 || ((signUpdate?.recipient?.role == 4 && this.isNB))) {
            // this.nameCompany = this.recipient.name;

            this.widthSign = signUpdate.width;
            this.heightSign = signUpdate.height;

            try {
              this.isDateTime = await this.timeService.getRealTime().toPromise();
            } catch(err) {
              this.isDateTime = new Date();
            }

            if(!this.isDateTime) this.isDateTime = new Date();
            await of(null).pipe(delay(150)).toPromise();
            let imageRender: HTMLElement | null = null;
            try {
              if (this.markImage) {
                imageRender = <HTMLElement>(document.getElementById('export-html-cert-image'));
              } else {
                imageRender = <HTMLElement>(document.getElementById('export-html-cert-image'));
              }
            } catch (error) {
            }
            // fieldHsm.height = imageRender.offsetHeight / 1.5;
            // fieldHsm.width = imageRender.offsetWidth / 1.5;

            // fieldCert.height = imageRender.offsetHeight;
            // fieldCert.width = imageRender.offsetWidth;
            try {
              if (imageRender) {
                const textSignB = await domtoimage.toPng(
                  imageRender,
                  this.getOptions(imageRender)
                );
                signI = textSignB.split(',')[1];
              }
            } catch (error) {
              console.log(error);
            }

          }
          let fieldCert1 = {
            id: signUpdate.id,
            page: signUpdate.page,
            coordinate_x: signUpdate.signDigitalX ?? signUpdate.coordinate_x,
            coordinate_y: signUpdate.coordinate_y,
            width: signUpdate.width,
            height: signUpdate.height,
          };

          if (!this.mobile || this.mobile) {
            this.dataCert = {
              cert_id: this.cert_id,
              image_base64: (this.markImage && signUpdate.type==3) ? this.srcMark.split(',')[1] : signI,
              field: fieldCert1,
              width: null,
              height: null,
              isTimestamp: this.isTimestamp,
              type: signUpdate.type
            };
          } else {

            this.dataCert = {
              cert_id: this.cert_id,
              image_base64: (this.markImage && signUpdate.type==3) ? this.srcMark.split(',')[1] : signI,
              field: fieldCert1,
              width: null,
              height: null,
              isTimestamp: this.isTimestamp,
              type: signUpdate.type
            };

          }

          if (fileC && objSign.length) {
            if (!this.mobile) {
              try {
                const checkSign = await this.contractService.signCert(
                  this.recipientId, this.dataCert
                );

                if (!checkSign || (checkSign && !checkSign.success)) {
                  if (!checkSign.message) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Đăng nhập không thành công',
                      '',
                      3000
                    );
                  } else if (checkSign.message) {
                    this.toastService.showErrorHTMLWithTimeout(
                      checkSign.message,
                      '',
                      3000
                    );
                  }

                  return false;
                } else {
                  if (checkSign.success === true) {
                    if (pdfC2) {
                      fileC = pdfC2.path;
                    } else if (pdfC1) {
                      fileC = pdfC1.path;
                    }
                  }
                }
              } catch (error) {
                this.toastService.showErrorHTMLWithTimeout("error.server","",3000)
                return false
              }
            } else {
              try {
                const checkSign = await this.contractService.signCertMobile(
                  this.recipientId, this.dataCert
                );

                if (!checkSign || (checkSign && !checkSign.success)) {
                  if (!checkSign.message) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Đăng nhập không thành công',
                      '',
                      3000
                    );
                  } else if (checkSign.message) {
                    this.toastService.showErrorHTMLWithTimeout(
                      checkSign.message,
                      '',
                      3000
                    );
                  }
                  return false;
                } else {
                  if (checkSign.success === true) {
                    if (pdfC2) {
                      fileC = pdfC2.path;
                    } else if (pdfC1) {
                      fileC = pdfC1.path;
                    }
                  }
                }
              } catch (error) {
                this.toastService.showErrorHTMLWithTimeout("error.server","",3000)
                return false
              }
            }
          }
        }
      }
      return true;
    } else if (typeSignDigital == 8) {
      this.currentBoxSignType = typeSignDigital
      // REMOTE SIGNING
      let boxSign: any

      for (let i = 0; i < this.isDataObjectSignature.length; i++) {
        if (this.isDataObjectSignature[i].type == 3) {
          boxSign = this.isDataObjectSignature[i]
          boxSign.index = i
          break
        }
      }
      boxSign = this.isDataObjectSignature.splice(boxSign.index, 1)[0]
      this.isDataObjectSignature.push(boxSign)
      for (const signUpdate of this.isDataObjectSignature) {
        if (
          signUpdate &&
          (signUpdate.type == 1 ||
            signUpdate.type == 3 ||
            signUpdate.type == 4 || signUpdate.type == 5) &&
          [3, 4].includes(this.datas.roleContractReceived) &&
          signUpdate?.recipient?.email === this.currentUser.email &&
          signUpdate?.recipient?.role === this.datas?.roleContractReceived
        ) {
          const objSign = this.isDataObjectSignature.filter(
            (signUpdate: any) =>
              signUpdate &&
              signUpdate.type == 3 &&
              [3, 4].includes(this.datas.roleContractReceived) &&
              signUpdate?.recipient?.email === this.currentUser.email &&
              signUpdate?.recipient?.role === this.datas?.roleContractReceived
          );

          let fileC: any
          try {
            fileC = await this.contractService.getFileContractPromise(
              this.idContract
            );
          } catch (error) {
            return this.toastService.showErrorHTMLWithTimeout("get.contract.data.err","",3000)
          }

          const pdfC2 = fileC.find((p: any) => p.type == 2);
          const pdfC1 = fileC.find((p: any) => p.type == 1);
          if (pdfC2) {
            fileC = pdfC2.path;
          } else if (pdfC1) {
            fileC = pdfC1.path;
          } else {
            return;
          }

          let signI = null;

          if (!this.mobile)
            this.convertXForHsm(signUpdate.page);
          let fieldRemoteSigning = {
            id: signUpdate.id,
            coordinate_x: signUpdate.signDigitalX,
            coordinate_y: signUpdate.coordinate_y,
            width: signUpdate.width ,
            height: signUpdate.height,
            page: signUpdate.page,
          };

          if (signUpdate.type == 1 || signUpdate.type == 4 || signUpdate.type == 5) {
            // this.textSign = this.contractNoValueSign

            // this.font = signUpdate.font;
            // this.font_size = signUpdate.font_size;

            // this.width = signUpdate.width;

            // await of(null).pipe(delay(120)).toPromise();
            // const imageRender = <HTMLElement>(
            //   document.getElementById('text-sign')
            // );

            // if (imageRender) {
            //   const textSignB = await domtoimage.toPng(imageRender);
            //   signI = this.textSignBase64Gen = textSignB.split(',')[1];
            // }
          } else if (signUpdate.type == 3) {

            try {
              this.isDateTime = await this.timeService.getRealTime().toPromise();
            } catch(err) {
              this.isDateTime = new Date();
            }
            if(!this.isDateTime) this.isDateTime = new Date();
            await of(null).pipe(delay(150)).toPromise();
            let imageRender: HTMLElement | null = null;

            //render khi role là 4 (văn thư) hoặc role khác (người ký)
            if (this.markImage) {
              imageRender = <HTMLElement>(
                document.getElementById('export-remote-signing-remote-image')
              );
            } else {
              imageRender = null
            }

            // fieldHsm.coordinate_y = fieldHsm.coordinate_y - 8;
            // fieldHsm.height = imageRender.offsetHeight / 1.5;
            // fieldHsm.width = imageRender.offsetWidth / 1.5;

            if (imageRender) {
              const textSignB = await domtoimage.toPng(
                imageRender,
                this.getOptions(imageRender)
              );
              signI = textSignB.split(',')[1];
            }
          }

          if (!this.isRemoteSigningExpired && signUpdate.type == 3 ) {
            this.dataCert = {
              field: fieldRemoteSigning,
              cert_id: this.dataCert.cert_id,
              imageBase64: (!this.markImage && signUpdate.type==3) ? null :
                            (this.markImage && signUpdate.type==3) ? this.srcMark.split(',')[1] : signI,
            };

            if (fileC && objSign.length) {
              try {
                const checkSign = await this.contractService.signRemote(
                  this.dataCert,
                  this.recipientId,
                  this.isTimestamp,
                  signUpdate.type
                );
                if (!checkSign || (checkSign && !checkSign.success)) {
                  if (!checkSign.message) {
                    this.toastService.showErrorHTMLWithTimeout(
                      'Đăng nhập không thành công',
                      '',
                      3000
                    );
                  } else if (checkSign.message) {
                    this.toastService.showErrorHTMLWithTimeout(
                      checkSign.message,
                      '',
                      3000
                    );
                  }

                  return false;
                } else {
                  if (checkSign.success === true) {
                    if (pdfC2) {
                      fileC = pdfC2.path;
                    } else if (pdfC1) {
                      fileC = pdfC1.path;
                    }
                  }
                }
              } catch (error) {
                return this.toastService.showErrorHTMLWithTimeout("error.server","",3000)
              }

            }
          } else {
            // truong hop qua han ky remote signing
            if (signUpdate.type == 3) {
              this.dataCert = {
                field: fieldRemoteSigning,
                cert_id: this.dataCert.cert_id,
                imageBase64: (!this.markImage && signUpdate.type==3) ? null :
                              (this.markImage && signUpdate.type==3) ? this.srcMark.split(',')[1] : signI,
              };

              if (fileC && objSign.length) {
                try {
                  const checkSign = await this.contractService.signRemote(
                    this.dataCert,
                    this.recipientId,
                    this.isTimestamp,
                    signUpdate.type
                  );
                  if (!checkSign || (checkSign && !checkSign.success)) {
                    if (!checkSign.message) {
                      this.toastService.showErrorHTMLWithTimeout(
                        'Đăng nhập không thành công',
                        '',
                        3000
                      );
                    } else if (checkSign.message) {
                      this.toastService.showErrorHTMLWithTimeout(
                        checkSign.message,
                        '',
                        3000
                      );
                    }

                    return false;
                  } else {
                    if (checkSign.success === true) {
                      if (pdfC2) {
                        fileC = pdfC2.path;
                      } else if (pdfC1) {
                        fileC = pdfC1.path;
                      }
                    }
                  }
                } catch (error) {
                  return this.toastService.showErrorHTMLWithTimeout("error.server","",3000)
                }
              }
            }
          }
        }
      }
      return true;
    }
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

  calculatorWidthText(text: any, font: any) {
    const canvas: any = document.createElement('canvas');

    const context = canvas.getContext('2d');
    context.font = font;

    const metrics = context.measureText(text);

    return metrics.width;
  }

  async signUsb(signUpdate: any, response: any) {
    try {
      var json_res = JSON.parse(response);

      if (json_res.ResponseCode == 0) {
        alert(json_res.Base64Result);

        const sign = await this.contractService.updateDigitalSignatured(
          signUpdate.id,
          json_res.Base64Result
        );
        if (!sign.recipient_id) {
          this.toastService.showErrorHTMLWithTimeout(
            'Lỗi ký USB Token',
            '',
            3000
          );
          return false;
        }
      } else {
        alert(json_res.ResponseMsg);
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  }

  otp: boolean = false;
  async signContractSubmit() {
    this.spinner.show();
    const signUploadObs$ = [];
    let indexSignUpload: any[] = [];
    let iu = 0;

    let formData = {};
    let eKYC = 0;
    let otpOrEkyc = false;
    for (const signUpdate of this.isDataObjectSignature) {
      if (
        signUpdate &&
        signUpdate.type == 2 &&
        [3, 4].includes(this.datas.roleContractReceived) &&
        signUpdate?.recipient?.email === this.currentUser.email &&
        signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {
        otpOrEkyc = true;
        if (signUpdate.valueSign) {
          this.eKYC = false;
          eKYC = 0;
          formData = {
            content: signUpdate.valueSign,
            organizationId:
              this.data_contract?.is_data_contract?.organization_id,
          };
        } else {
          this.eKYC = true;
          eKYC = 1;
          const imageRender = <HTMLElement>(document.getElementById('export-html-ekyc'));

          const textSignB = domtoimage.toPng(imageRender, this.getOptions(imageRender));

          const valueBase64 = (await textSignB).split(',')[1];

          formData = {
            content: 'data:image/png;base64,' + valueBase64,
            name: 'image_' + new Date().getTime() + '.jpg',
            organizationId:
              this.data_contract?.is_data_contract?.organization_id,
            ocrResponseName: signUpdate.recipient.name || '',
            signType: 'eKYC'
          };
        }
      }
    }

    if (otpOrEkyc == true) {
      signUploadObs$.push(
        this.contractService.uploadFileImageBase64Signature(formData)
      );
      indexSignUpload.push(iu);
    }

    iu++;

    forkJoin(signUploadObs$).subscribe(
      async (results) => {
        let ir = 0;
        for (const resE of results) {
          this.datas.filePath = resE?.file_object?.file_path;
          if (this.datas.filePath && eKYC == 0) {
            this.isDataObjectSignature[indexSignUpload[ir]].value =
              this.datas.filePath;
          }
          ir++;
        }

        if (eKYC == 0) await this.signContract(false);
      },
      (error) => {
        this.toastService.showErrorHTMLWithTimeout(
          'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
          '',
          3000
        );
      }
    );

    if (signUploadObs$.length == 0 || eKYC == 1) {
      await this.signContract(true);
    }
  }

  async signContract(notContainSignImage?: boolean) {
    const signUpdateTemp = JSON.parse(
      JSON.stringify(this.isDataObjectSignature)
    );

    let signUpdatePayload = '';
    //neu khong chua chu ky anh
    if (notContainSignImage) {
      signUpdatePayload = signUpdateTemp
        .filter(
          (item: any) =>
            item?.recipient?.email === this.currentUser.email &&
            item?.recipient?.role === this.datas?.roleContractReceived
        )
        .map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            value:
              item.type == 1 || item.type == 4 ? item.valueSign : item.value,
            font: item.font,
            font_size: item.font_size,
          };
        });
    } else {
      this.isDateTime = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
      await of(null).pipe(delay(100)).toPromise();

      const imageRender = <HTMLElement>(
        document.getElementById('export-signature-image-html')
      );

      let signI: any;
      if (imageRender) {
        const textSignB = await domtoimage.toPng(
          imageRender,
          this.getOptions(imageRender)
        );
        signI = textSignB.split(',')[1];
      }

      const imageRenderEkyc = <HTMLElement>(
        document.getElementById('export-html-ekyc')
      );
      if (imageRenderEkyc) {
        const textSignB = await domtoimage.toPng(imageRenderEkyc);
        signI = textSignB.split(',')[1];
      }

      signUpdatePayload = signUpdateTemp
        .filter(
          (item: any) =>
            item?.recipient?.email === this.currentUser.email &&
            item?.recipient?.role === this.datas?.roleContractReceived
        )
        .map((item: any) => {
          if (this.dataOTP) {
            return {
              otp: this.dataOTP.otp,
              signInfo: signI,
              processAt: this.datepipe.transform(
                new Date(),
                "yyyy-MM-dd'T'HH:mm:ss'Z'"
              ),
              fields: [
                {
                  id: item.id,
                  name: item.name,
                  value: item.value,
                  font: item.font,
                  font_size: item.font_size,
                },
              ],
            };
          }
        });

      if (signUpdatePayload) {
        signUpdatePayload = signUpdatePayload[0];
      }
    }

    let typeSignDigital = null;
    for (const signUpdate of this.isDataObjectSignature) {
      if (
        signUpdate &&
        (signUpdate.type == 3 || ((signUpdate?.recipient?.role == 4 && this.isNB))) &&
        [3, 4].includes(this.datas.roleContractReceived) &&
        signUpdate?.recipient?.email === this.currentUser.email &&
        signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {
        if (signUpdate.recipient?.sign_type) {
          const typeSD = signUpdate.recipient?.sign_type.find(
            (t: any) => t.id != 1
          );
          if (typeSD) {
            typeSignDigital = typeSD.id;
          }
        }
        break;
      }
    }

    //Check ký usb token
    if (typeSignDigital && typeSignDigital == 2) {
      const determineCoordination = await this.contractService
        .getDetermineCoordination(this.recipientId)
        .toPromise();
      const lengthRes = determineCoordination.recipients.length;
      for (let i = 0; i < lengthRes; i++) {
        const id = determineCoordination.recipients[i].id;

        if (id == this.recipientId) {
          this.taxCodePartnerStep2 =
            determineCoordination.recipients[i].card_id;

          break;
        }
      }

      if (this.usbTokenVersion == 1) {
        if (this.markImage) {
          this.openMarkSign('usb1', signUpdatePayload, notContainSignImage);
        } else {
          this.signTokenVersion1(signUpdatePayload, notContainSignImage);
        }
      } else if (this.usbTokenVersion == 2) {
        if (this.markImage) {
          this.openMarkSign('usb2', signUpdatePayload, notContainSignImage);
        } else {
          this.getSessionId(this.taxCodePartnerStep2, signUpdatePayload, notContainSignImage);
        }
      }
    } else {
      await this.signImageC(signUpdatePayload, notContainSignImage);
    }
  }

  async signTokenVersion1(signUpdatePayload: any, notContainSignImage: any) {
    let dataDigital: any = null;

    try {
      dataDigital = await this.contractService.getAllAccountsDigital();
    } catch (error) {
      this.spinner.hide();
      Swal.fire({
        html:
          'Vui lòng bật tool ký số hoặc tải ' +
          `<a href='/assets/upload/mobi_token_sign_setup.zip' target='_blank'>Tại đây</a>  và cài đặt`,
        icon: 'warning',
        confirmButtonColor: '#0041C4',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });

      return false;
    }

    if (dataDigital && dataDigital.data.Serial) {
      this.signCertDigital = dataDigital.data;
      this.nameCompany = dataDigital.data.CN;

      const checkTaxCodeBase64 = await this.contractService.checkTaxCodeExist(this.taxCodePartnerStep2, dataDigital.data.Base64).toPromise();

      const determineCoordination = await this.contractService.getDetermineCoordination(this.recipientId).toPromise();

      let isInRecipient = false;
      const participants = this.datas?.is_data_contract?.participants;

      for (const participant of participants) {
        for (const card of participant.recipients) {
          for (const item of determineCoordination.recipients) {
            if (item.card_id == card.card_id) {
              isInRecipient = true;
            }
          }
        }
      }
      if (!isInRecipient) {

        this.toastService.showErrorHTMLWithTimeout(
          'Bạn không có quyền xử lý hợp đồng này!', '', 3000
        );
        timer(3000).subscribe(() => {
          // Reload trang sau khi hiển thị thông báo
          window.location.reload();
        });
        return
      }
      this.currentUser = JSON.parse(
        localStorage.getItem('currentUser') || ''
      ).customer.info;

      this.contractService
        .getDetermineCoordination(this.recipientId)
        .subscribe(async (response) => {
          //  = response.recipients[0].email
          this.ArrRecipientsNew = response.recipients.filter(
            (x: any) => x.email === this.currentUser.email
          );

          if (this.ArrRecipientsNew.length === 0) {
            this.toastService.showErrorHTMLWithTimeout(
              'Bạn không có quyền xử lý hợp đồng này!',
              '',
              3000
            );
            if (this.type == 1) {
              this.router.navigate(['/login']);
              this.dialog.closeAll();
              return;
            } else {
              this.router.navigate(['/main/dashboard']);
              this.dialog.closeAll();
              return;
            }
          }

          if (checkTaxCodeBase64.success) {
            await this.signImageC(signUpdatePayload, notContainSignImage);
          } else {
            this.spinner.hide();
            Swal.fire({
              title: `Mã số thuế/CMT/CCCD trên chữ ký số không trùng khớp`,
              icon: 'warning',
              confirmButtonColor: '#0041C4',
              cancelButtonColor: '#b0bec5',
              confirmButtonText: 'Xác nhận',
            });
          }
        })
    } else {
      this.spinner.hide();
      Swal.fire({
        title: `Vui lòng cắm USB Token hoặc chọn chữ ký số!`,
        icon: 'warning',
        confirmButtonColor: '#0041C4',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
    }
  }

  //get sessionid for usb token
  async getSessionId(
    taxCode: any,
    signUpdatePayload: any,
    notContainSignImage: any
  ) {
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

    let apiSessionId: any = '';

    //Lay sessionId cua usb token
    try {
      apiSessionId = await this.contractService.signUsbToken(
        'request=' + json_req
      );
    } catch (error) {
      this.spinner.hide();
      this.downloadPluginService.getLinkDownLoadV2();
      return;
    }

    const sessionId = JSON.parse(window.atob(apiSessionId.data)).SessionId;
    this.sessionIdUsbToken = sessionId;

    if (!sessionId) {
      this.spinner.hide();
      this.downloadPluginService.getLinkDownLoadV2();
      return;
    } else {
      this.getCertificate(
        sessionId,
        taxCode,
        signUpdatePayload,
        notContainSignImage
      );
    }
  }

  b64DecodeUnicode(str: any) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  certInfoBase64: any;
  async getCertificate(
    hSession: any,
    taxCode: any,
    signUpdatePayload: any,
    notContainSignImage: any
  ) {
    var json_req = JSON.stringify({
      OperationId: 2,
      SessionId: hSession,
      checkOCSP: 0,
    });

    json_req = window.btoa(json_req);

    const apiCert = await this.contractService.signUsbToken(
      'request=' + json_req
    );
    const cert = JSON.parse(window.atob(apiCert.data));

    if (cert.certInfo && cert.ResponseCode == 0) {
      this.signCertDigital = cert.certInfo.SerialNumber;

      const utf8 = require('utf8');

      try {
        this.nameCompany = utf8.decode(cert.certInfo.CommonName);
      } catch (err) {
        this.nameCompany = cert.certInfo.CommonName;
      }

      this.certInfoBase64 = cert.certInfo.Base64Encode;
    } else {
      this.toastService.showErrorHTMLWithTimeout(
        'Lỗi không lấy được thông tin usb token ' + cert.ResponseMsg,
        '',
        3000
      );
      this.spinner.hide();
      return;
    }

    const checkTaxCode = await this.contractService
      .checkTaxCodeExist(taxCode, this.certInfoBase64)
      .toPromise();

    if (checkTaxCode.success == true) {
      this.signImageC(signUpdatePayload, notContainSignImage);
    } else {
      this.spinner.hide();

      Swal.fire({
        title: `Mã số thuế trên chữ ký số không trùng mã số thuế của tổ chức`,
        icon: 'warning',
        confirmButtonColor: '#0041C4',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
    }
  }

  fixingRecipientIds: any
  async signV2FixingProcess() {
    let createEmptyFixingRes: any
    try {
      const checkV2Infor = await this.contractService.checkTokenV2Infor().toPromise()
      if (checkV2Infor.status == false) {
        console.log('bye bye');
        return
      } else {
        console.log('processing');
        this.fixingRecipientIds = checkV2Infor.listRecipientId

        if (this.fixingRecipientIds.length > 0) {
          for (const recipId of this.fixingRecipientIds) {
            createEmptyFixingRes = await this.contractService.createEmptyFixing(this.certInfoBase64, recipId).toPromise()
            const base64TempData = createEmptyFixingRes.base64TempData;
            const hexDigestTempFile = createEmptyFixingRes.hexDigestTempFile;
            const fieldName = createEmptyFixingRes.fieldName;

            await this.callDCSignerFixing(base64TempData, hexDigestTempFile, fieldName, recipId);
          }
        }
      }
    } catch (error) {
      return console.log("signV2FixingProcess error")
    }

  }

  async callDCSignerFixing(
    base64TempData: any,
    hexDigestTempFile: any,
    fieldName: any,
    recipientIdFixing: any
  ) {
    var json_req = JSON.stringify({
      OperationId: 5,
      SessionId: this.sessionIdUsbToken,
      DataToBeSign: base64TempData,
      checkOCSP: 0,
      reqDigest: 0,
      algDigest: 'SHA_256',
    });

    json_req = window.btoa(json_req);
    try {
      const callServiceDCSigner = await this.contractService.signUsbToken(
        'request=' + json_req
      );

      const dataSignatureToken = JSON.parse(
        window.atob(callServiceDCSigner.data)
      );

      if (dataSignatureToken.ResponseCode != 0) {
        console.warn("dataSignatureToken.ResponseMsg")
        this.failUsbToken = true;
        return;
      }

      const signatureToken = dataSignatureToken.Signature;

      await this.callMergeTimeStampFixing(
        signatureToken,
        fieldName,
        hexDigestTempFile,
        recipientIdFixing
      );
    } catch (err: any) {
      console.warn("err ? err.statusText : 'callMergeTimeStamp error'")
      return;
    }
  }

  async callMergeTimeStampFixing(
    signatureToken: any,
    fieldName: any,
    hexDigestTempFile: any,
    recipientIdFixing: any
  ) {
    let isTimestamp: any = false
    await this.contractService
      .meregeTimeStampFixing(
        recipientIdFixing,
        this.idContract,
        signatureToken,
        fieldName,
        this.certInfoBase64,
        hexDigestTempFile,
        isTimestamp
      )
      .toPromise();
    // this.base64Data = mergeTimeStamp.base64Data;
  }

  async createEmptySignature(signUpdate: any, signDigital: any, image: any) {
    let boxType = signDigital.type
    const emptySignature = await this.contractService.createEmptySignature(this.recipientId, signUpdate, signDigital, image, this.certInfoBase64, boxType).toPromise();

    const base64TempData = emptySignature.base64TempData;
    const hexDigestTempFile = emptySignature.hexDigestTempFile;
    const fieldName = emptySignature.fieldName;

    await this.callDCSigner(base64TempData, hexDigestTempFile, fieldName);
  }

  failUsbToken: boolean = false;
  async callDCSigner(
    base64TempData: any,
    hexDigestTempFile: any,
    fieldName: any
  ) {
    var json_req = JSON.stringify({
      OperationId: 5,
      SessionId: this.sessionIdUsbToken,
      DataToBeSign: base64TempData,
      checkOCSP: 0,
      reqDigest: 0,
      algDigest: 'SHA_256',
    });

    json_req = window.btoa(json_req);

    try {
      const callServiceDCSigner = await this.contractService.signUsbToken(
        'request=' + json_req
      );

      const dataSignatureToken = JSON.parse(
        window.atob(callServiceDCSigner.data)
      );

      if (dataSignatureToken.ResponseCode != 0) {
        this.spinner.hide()
        this.toastService.showErrorHTMLWithTimeout(
          'Lỗi ký usb token ' + dataSignatureToken.ResponseMsg,
          '',
          3000
        );
        this.failUsbToken = true;
        return;
      }

      const signatureToken = dataSignatureToken.Signature;

      await this.callMergeTimeStamp(
        signatureToken,
        fieldName,
        hexDigestTempFile
      );
    } catch (err: any) {
      this.spinner.hide()
      this.toastService.showErrorHTMLWithTimeout(
        `Lỗi ký usb token (${err ? err.statusText : 'error'})` ,
        '',
        3000
      );
      return;
    }
  }

  base64Data: any;
  async callMergeTimeStamp(
    signatureToken: any,
    fieldName: any,
    hexDigestTempFile: any
  ) {
    const mergeTimeStamp = await this.contractService
      .meregeTimeStamp(
        this.recipientId,
        this.idContract,
        signatureToken,
        fieldName,
        this.certInfoBase64,
        hexDigestTempFile,
        this.isTimestamp
      )
      .toPromise();
    this.base64Data = mergeTimeStamp.base64Data;
  }

  filePath: any = '';
  async signImageC(signUpdatePayload: any, notContainSignImage: any) {
    let signDigitalStatus = null;
    let signUpdateTempN: any[] = [];
    if (signUpdatePayload) {
      signUpdateTempN = JSON.parse(JSON.stringify(signUpdatePayload));
      if (notContainSignImage) {
        signDigitalStatus = await this.signDigitalDocument();

        if (this.eKYC == false) {
          signUpdateTempN = signUpdateTempN
            .filter(
              (item: any) =>
                item?.recipient?.email === this.currentUser.email &&
                item?.recipient?.role === this.datas?.roleContractReceived
            )
            .map((item: any) => {
              return {
                id: item.id,
                name: item.name,
                value: null,
                font: item.font,
                font_size: item.font_size,
                bucket: null,
                processAt: null,
              };
            });
        } else {
          try {
            this.isDateTime = await this.timeService.getRealTime().toPromise();
          } catch(err) {
            this.isDateTime = new Date();
          }

          if(!this.isDateTime) this.isDateTime = new Date();
          await of(null).pipe(delay(150)).toPromise();

          //đẩy chữ ký vào file pdf
          const imageRender = <HTMLElement>(
            document.getElementById('export-html-ekyc')
          );
          const textSignB = domtoimage.toPng(
            imageRender,
            this.getOptions(imageRender)
          );

          const valueBase64 = (await textSignB).split(',')[1];

          const formData = {
            name: 'image_' + new Date().getTime() + '.jpg',
            content: 'data:image/png;base64,' + valueBase64,
            organizationId:
              this.data_contract?.is_data_contract?.organization_id,
            ocrResponseName: signUpdateTempN[0].name,
            signType: 'eKYC'

          };

          this.contractService.uploadFileImageBase64Signature(formData).subscribe((responseBase64) => {
            // signUpdateTempN[0].value = responseBase64.file_object.file_path;
            // signUpdateTempN[0].bucket = responseBase64.file_object.bucket;
            // signUpdateTempN[0].processAt = this.isDateTime;

            // signUpdateTempN[0].signerType = 'eKYC'
            // signUpdateTempN[0].signerName = signUpdateTempN[0].name
            // signUpdateTempN[0].signerTaxCode = this.cardId
            signUpdateTempN.forEach((item: any) => {
              item.value = responseBase64.file_object.file_path;
              item.bucket = responseBase64.file_object.bucket;
              item.processAt = this.isDateTime;
              item.signerType = 'eKYC'
              item.signerName = signUpdateTempN[0].name
              item.signerTaxCode = this.cardId
            })

            this.contractService.updateInfoContractConsider(signUpdateTempN, this.recipientId).subscribe(
              async (result) => {
                if (!notContainSignImage) {
                  await this.signDigitalDocument();
                }

                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => {
                    this.router.navigate(
                      ['/main/form-contract/detail/' + this.idContract],
                      {
                        queryParams: {
                          recipientId: this.recipientId,
                          consider: true,
                          action: 'sign',
                        },
                        skipLocationChange: true,
                      }
                    );
                  });

                setTimeout(() => {
                  if (!this.mobile) {
                    this.toastService.showSuccessHTMLWithTimeout(
                      [3, 4].includes(this.datas.roleContractReceived)
                        ? 'Ký hợp đồng thành công'
                        : 'Xem xét hợp đồng thành công',
                      '',
                      3000
                    );
                  } else {
                    if ([3, 4].includes(this.datas.roleContractReceived)) {
                      alert('Ký hợp đồng thành công');
                    } else {
                      alert('Xem xét hợp đồng thành công');
                    }
                  }

                  this.spinner.hide();
                }, 1000);
              },
              (error) => {
                this.toastService.showErrorHTMLWithTimeout(
                  'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
                  '',
                  3000
                );
                this.spinner.hide();
              }
            );

            return;
          });
        }
      }
    }

    if (notContainSignImage && !signDigitalStatus && this.datas.roleContractReceived != 2) {
      this.spinner.hide();
      return;
    }

    if (notContainSignImage && this.eKYC == false && this.currentBoxSignType !== 8) {
      signUpdateTempN[0] = {
        "processAt": this.isDateTime
      };
      this.contractService.updateInfoContractConsider(signUpdateTempN, this.recipientId).subscribe(
        async (result) => {
          if (!notContainSignImage) {
            await this.signDigitalDocument();
          }

          this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(
                ['/main/form-contract/detail/' + this.idContract],
                {
                  queryParams: {
                    recipientId: this.recipientId,
                    consider: true,
                    action: 'sign',
                  },
                  skipLocationChange: true,
                }
              );
            });

          setTimeout(() => {
            if (!this.mobile) {
              this.toastService.showSuccessHTMLWithTimeout(
                [3, 4].includes(this.datas.roleContractReceived)
                  ? 'success_sign'
                  : 'success_watch',
                '',
                3000
              );
            } else {
              if ([3, 4].includes(this.datas.roleContractReceived)) {
                alert('Ký hợp đồng thành công');
              } else {
                alert('Xem xét hợp đồng thành công');
              }
            }

            this.spinner.hide();
          }, 1000);
        },
        (error) => {
          this.toastService.showErrorHTMLWithTimeout(
            'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
            '',
            3000
          );
          this.spinner.hide();
        }
      );
    } else {
      if (this.eKYC == false && this.currentBoxSignType !== 8) {
        this.contractService.updateInfoContractConsiderImg(signUpdateTempN, this.recipientId).subscribe(
          async (result) => {
            if (result?.success == false) {
              if (result.message == 'Wrong otp') {
                if (!this.mobile)
                  this.toastService.showErrorHTMLWithTimeout(
                    'Mã OTP không đúng hoặc quá hạn',
                    '',
                    3000
                  );
                else alert('Mã OTP không đúng hoặc quá hạn');
                this.spinner.hide();
              } else {
                if (!this.mobile) {
                  this.toastService.showErrorHTMLWithTimeout(
                    'Ký hợp đồng không thành công',
                    '',
                    3000
                  );
                } else {
                  alert('Ký hợp đồng không thành công');
                }
                this.spinner.hide();
              }
            } else {
              if (!notContainSignImage) {
                //Ký số
                await this.signDigitalDocument();
              }

              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(
                    ['/main/form-contract/detail/' + this.idContract],
                    {
                      queryParams: {
                        recipientId: this.recipientId,
                        consider: true,
                        action: 'sign',
                      },
                      skipLocationChange: true,
                    }
                  );
                });

              setTimeout(() => {
                if (!this.mobile) {
                  this.toastService.showSuccessHTMLWithTimeout(
                    [3, 4].includes(this.datas.roleContractReceived)
                      ? 'success_sign'
                      : 'success_watch',
                    '',
                    3000
                  );
                } else {
                  if ([3, 4].includes(this.datas.roleContractReceived)) {
                    alert('Ký hợp đồng thành công');
                  } else {
                    alert('Xem xét hợp đồng thành công');
                  }
                }

                this.spinner.hide();
              }, 1000);
            }
          },
          (error) => {
            this.toastService.showErrorHTMLWithTimeout(
              'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
              '',
              3000
            );
            this.spinner.hide();
          }
        );
      }
      if (this.currentBoxSignType == 8) {
        this.spinner.hide()
        this.remoteDialogSuccessOpen().then(result => {
          if (result.isDismissed) {
            // this.router.navigate([
            //   'main/form-contract/detail/' + this.idContract,
            // ]);
          }
        })
      }
    }
  }

  async signContractSimKPI() {
    const signUploadObs$ = [];
    let indexSignUpload: any[] = [];
    let iu = 0;
    for (const signUpdate of this.isDataObjectSignature) {
      if (
        signUpdate &&
        signUpdate.type == 3 &&
        [3, 4].includes(this.datas.roleContractReceived) &&
        signUpdate?.recipient?.email === this.currentUser.email &&
        signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {
        const formData = {
          name: 'image_' + new Date().getTime() + '.jpg',
          content:
            'data:image/png;base64,' + this.contractService.imageMobiBase64,
          organizationId: this.data_contract?.is_data_contract?.organization_id,
          signType: '',
          ocrResponseName: ''
        };

        signUploadObs$.push(
          this.contractService
            .uploadFileImageBase64Signature(formData)
            .toPromise()
        );
        indexSignUpload.push(iu);
      }
      iu++;
    }

    let ir = 0;
    for (const signLinkP of signUploadObs$) {
      const imgLinksRes = await signLinkP;

      this.datas.filePath = imgLinksRes?.file_object?.file_path;

      if (this.datas.filePath) {
        this.isDataObjectSignature[indexSignUpload[ir]].value =
          this.datas.filePath;
      }
      ir++;
    }
    const signUpdateTemp = JSON.parse(
      JSON.stringify(this.isDataObjectSignature)
    );
    const signUpdatePayload = signUpdateTemp
      .filter(
        (item: any) =>
          item?.recipient?.email === this.currentUser.email &&
          item.type == 3 &&
          item?.recipient?.role === this.datas?.roleContractReceived
      )
      .map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          value: item.value,
          font: item.font,
          font_size: item.font_size,
        };
      });
    const signRes =
      await this.contractService.updateInfoContractConsiderToPromise(
        signUpdatePayload,
        this.recipientId
      );
  }

  getFilePdfForMobile() {
    let fieldId: number = 0;
    let fieldName: string = '';

    //this.idContract: id hợp đồng
    this.contractService
      .getDetailContract(this.idContract)
      .subscribe(async (response) => {


        let organization_id = response[0].organization_id;

        for (let i = 0; i < response[2].length; i++) {
          if ((response[2][i].recipient = this.recipientId)) {
            fieldId = response[2][i].id;
            fieldName = response[2][i].name;
          }
        }

        const imageRender = <HTMLElement>(
          document.getElementById('image_keo_tha')
        );

        const textSignB = domtoimage.toPng(
          imageRender,
          this.getOptions(imageRender)
        );

        const valueBase64 = (await textSignB).split(',')[1];

        const formData = {
          name: 'image_mobile' + new Date().getTime() + '.jpg',
          content: 'data:image/png;base64,' + valueBase64,
          organizationId: organization_id,
          signType: '',
          ocrResponseName: ''
        };

        this.contractService
          .uploadFileImageBase64Signature(formData)
          .subscribe((responseBase64) => {


            const filePath = responseBase64.file_object.file_path;

            const data = [
              {
                font: 'Arial',
                font_size: 14,
                id: this.recipientId,
                name: fieldName,
                value: filePath,
              },
            ];

            this.contractService
              .updateInfoContractConsider(data, this.recipientId)
              .subscribe((responseEnd) => {
                this.contractService
                  .getDetailContract(this.idContract)
                  .subscribe((responseLink) => { });
              });
          });
      });
  }

  async rejectContract() {
    let rejectQuestion = '';
    let confirm = '';
    let cancel = '';
    let cancelSuccess = '';
    let error = '';
    let rejectReason = '';
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;

    if (localStorage.getItem('lang') == 'vi') {
      rejectQuestion =
        'Bạn có chắc chắn muốn từ chối hợp đồng này không? Vui lòng nhập lý do từ chối';
      confirm = 'Xác nhận';
      cancel = 'Huỷ';
      cancelSuccess = 'Từ chối hợp đồng thành công';
      error = 'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý';
      rejectReason = 'Bạn cần nhập lý do từ chối hợp đồng';
    } else if (localStorage.getItem('lang') == 'en') {
      rejectQuestion =
        'Are you sure want to decline this contract? Please enter the reason';
      confirm = 'Confirm';
      cancel = 'Cancel';
      cancelSuccess = 'Successfully refused contract';
      error = 'Error! Please contact to developers';
      rejectReason = 'You need to enter the reason for refusing the contract';
    }

    this.rejectContractLang(
      rejectQuestion,
      confirm,
      cancel,
      cancelSuccess,
      error,
      rejectReason
    );
  }

  async rejectContractLang(
    rejectQuestion: string,
    confirm: string,
    cancel: string,
    cancelSuccess: string,
    error1: string,
    rejectReason: string
  ) {
    let inputValue = '';
    const { value: textRefuse } = await Swal.fire({
      title: rejectQuestion,
      input: 'textarea',
      inputValue: inputValue,
      showCancelButton: true,
      confirmButtonColor: '#0041C4',
      cancelButtonColor: '#b0bec5',
      confirmButtonText: confirm,
      cancelButtonText: cancel,
      inputValidator: (value) => {
        if (!value) {
          return rejectReason;
        } else {
          return null;
        }
      },
    });

    if (textRefuse) {
      this.contractService
        .getDetermineCoordination(this.recipientId)
        .subscribe(async (response) => {
          //  = response.recipients[0].email

          this.ArrRecipientsNew = response.recipients.filter(
            (x: any) => x.email === this.currentUser.email
          );

          if (this.ArrRecipientsNew.length === 0) {
            this.toastService.showErrorHTMLWithTimeout(
              'Bạn không có quyền xử lý hợp đồng này!',
              '',
              3000
            );
            if (this.type == 1) {
              this.router.navigate(['/login']);
              this.dialog.closeAll();
              return;
            } else {
              this.router.navigate(['/main/dashboard']);
              this.dialog.closeAll();
              return;
            }
          }

          this.contractService
            .considerRejectContract(this.recipientId, textRefuse)
            .subscribe(
              (result) => {
                this.toastService.showSuccessHTMLWithTimeout(
                  cancelSuccess,
                  '',
                  3000
                );
                this.spinner.hide();
                this.router.navigate([
                  '/main/form-contract/detail/reject/' + this.idContract,
                ]);
              },
              (error) => {
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout(error1, '', 3000);
              }
            );
        });
    }
  }

  validateSignature() {
    const validSign = this.isDataObjectSignature.filter(
      (item: any) =>
        item?.recipient?.email === this.currentUser.email &&
        item?.recipient?.role === this.datas?.roleContractReceived &&
        item.required &&
        (!item.valueSign && !this.otpValueSign) &&
        item.type != 3
    );
    this.currentNullValuePages = validSign.map((item: any) => item.page.toString())
    this.currentNullValuePages = [...new Set(this.currentNullValuePages)]
    this.currentNullElement = validSign
    return validSign.length == 0;
  }

  t() {

  }

  downloadContract(id: any) {
    this.contractService.getFileZipContract(id).subscribe(
      (data) => {
        this.uploadService
          .downloadFile(data.path)
          .subscribe((response: any) => {
            //

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

  checkIsViewContract() {
    if (this.datas?.is_data_contract?.participants?.length) {
      for (const participant of this.datas.is_data_contract.participants) {
        for (const recipient of participant.recipients) {
          if (this.recipientId == recipient.id) {
            this.recipient = recipient;
            this.isRemoteSigningType = recipient.sign_type.some((item: any) => item.id == 8)
            if (this.currentUser?.email != this.recipient?.email) {
              this.router.navigate([
                'main/form-contract/detail/' + this.idContract,
              ]);
            }
            return;
          }
        }
      }
    }
  }

  fetchDataUserSimPki() {
    let typeSignDigital = null;
    if (this.recipient?.sign_type) {
      const typeSD = this.recipient?.sign_type.find((t: any) => t.id != 1);
      if (typeSD) {
        typeSignDigital = typeSD.id;
      }
    }
    if (
      this.recipient?.email == this.currentUser.email &&
      typeSignDigital &&
      typeSignDigital == 3
    ) {
      const nl = networkList;
      this.currentUser = JSON.parse(
        localStorage.getItem('currentUser') || ''
      ).customer.info;
      this.userService.getUserById(this.currentUser.id).subscribe((data) => {
        const itemNameNetwork = nl.find((nc: any) => nc.id == data.phone_tel);
        this.signInfoPKIU.phone = data.phone_sign;
        this.signInfoPKIU.phone_tel = data.phone_tel;
        this.signInfoPKIU.networkCode =
          itemNameNetwork && itemNameNetwork.name
            ? itemNameNetwork.name.toLowerCase()
            : null;
      });
    }
  }

  cccdFront: any;
  cardId: any;
  eKYCSignOpen() {
    // //Còn số lượng eKYC thì cho ký eKYC
    this.unitService
      .getNumberContractUseOriganzation(this.orgId)
      .toPromise()
      .then(
        (data) => {
          this.eKYCContractUse = data.ekyc;

          //lay so luong hop dong da mua
          this.unitService
            .getNumberContractBuyOriganzation(this.orgId)
            .toPromise()
            .then(
              (data) => {
                this.eKYCContractBuy = data.ekyc;
                if (
                  Number(this.eKYCContractUse) + Number(1) >
                  Number(this.eKYCContractBuy)
                ) {
                  this.toastService.showErrorHTMLWithTimeout(
                    'Tổ chức đã sử dụng hết số lượng eKYC đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ',
                    '',
                    3000
                  );
                } else {
                  this.eKYC = true;
                  this.eKYCStart(this.ekycDocType);
                  return;
                }
              },
              (error) => {
                this.toastService.showErrorHTMLWithTimeout(
                  'Lỗi lấy số lượng hợp đồng đã mua',
                  '',
                  3000
                );
              }
            );
        },
        (error) => {
          this.toastService.showErrorHTMLWithTimeout(
            'Lỗi lấy số lượng hợp đồng đã dùng',
            '',
            3000
          );
        }
      );
  }

  async eKYCStart(ekycDocType: string) {
    const data = {
      id: 0,
      title: 'Xác thực CMT/CCCD mặt trước',
      noti: 'Vui lòng đưa CMT/CCCD mặt trước vào gần khung hình',
      recipientId: this.recipientId,
      contractId: this.idContract,
      ekycDocType: ekycDocType
    };
    let checkCurrentSigningStatus: any = await this.checkCurrentSigningCall()
    if (!checkCurrentSigningStatus) return

    const dialogConfig = new MatDialogConfig();
    // dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.data = data;
    dialogConfig.disableClose = true;
    // dialogConfig.width = '100000000000000000000000000000px';

    const dialogRef = this.dialog.open(EkycDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.cccdFront = result;

      if (this.recipient.name && this.recipient.card_id) {
        this.nameCompany = this.recipient.name;
        this.cardId = this.recipient.card_id;
      } else {
        this.contractService
          .detectCCCD(this.cccdFront, data.contractId, data.recipientId)
          .subscribe((response) => {
            if (response.name) {
              this.nameCompany = response.name;
              this.cardId = response.id;
            }
          });
      }

      if (result) this.eKYCSignOpenAfter();
    });
  }

  eKYCSignOpenAfter() {
    const data = {
      id: 1,
      title: 'Xác thực CMT/CCCD mặt sau',
      noti: 'Vui lòng đưa CMT/CCCD mặt sau vào gần khung hình',
      contractId: this.idContract,
    };

    const dialogRef = this.dialog.open(EkycDialogSignComponent, {
      data: data,
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      const dialogConfig = new MatDialogConfig();

      const dataFace = {
        cccdFront: this.cccdFront,
        contractId: this.idContract,
        recipientId: this.recipientId,
      };

      dialogConfig.data = dataFace;
      dialogConfig.disableClose = true;

      if (result) {
        const final = this.dialog.open(EkycDialogSignComponent, dialogConfig);

        final.afterClosed().subscribe(async (result: any) => {
          if (result == 2) {

            await this.signContractSubmit();
          }
        });
      }
    });
  }

  getValueByKey(inputString: string, key: string) {
    const elements = inputString.split(', ');
    for (const element of elements) {
      const [currentKey, value] = element.split('=');
      if (currentKey === key) {
        return value;
      }
    }
    return null; // Return null if the key is not found
  }

  async certDialogSignOpen(recipientId: number) {
    this.spinner.hide();
    const dataCert = {
      title: 'KÝ CHỨNG THƯ SỐ',
      recipientId: recipientId,
      isDataObjectSignature: this.isDataObjectSignature
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '740px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = dataCert;
    dialogConfig.panelClass = 'custom-dialog-container';

    const dialogRef = this.dialog.open(CertDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async (result: any) => {

      if (result) {
        const uidCert = this.getValueByKey(result.certInformation, "UID")
        this.dataCardId = uidCert?.split(":")[1];
        const certSignerName = this.getValueByKey(result.certInformation, "CN")
        this.nameCompany = certSignerName;

        this.cert_id = result.id;
        await this.signContractSubmit();
      }
    });
  }

  async hsmDialogSignOpen(recipientId: number) {
    this.spinner.hide();
    const data = {
      title: 'CHỮ KÝ HSM',
      is_content: 'forward_contract',
      recipientId: recipientId,
      dataContract: this.recipient,
    };
    const determineCoordination = await this.contractService.getDetermineCoordination(recipientId).toPromise();

    let isInRecipient = false;
    const participants = this.datas?.is_data_contract?.participants;

    for (const participant of participants) {
      for (const card of participant.recipients) {
        for (const item of determineCoordination.recipients) {
          if (item.card_id == card.card_id) {


            isInRecipient = true;
          }
        }
      }
    }
    if (!isInRecipient) {

      this.toastService.showErrorHTMLWithTimeout(
        'Bạn không có quyền xử lý hợp đồng này!',
        '',
        3000
      );
      if (this.type == 1) {
        this.router.navigate(['/login']);
        this.dialogRef.close();
        this.spinner.hide();
        return
      } else {
        this.router.navigate(['/main/dashboard']);
        this.dialogRef.close();
        this.spinner.hide();
        return
      }
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
    this.contractService.getDetermineCoordination(this.recipientId).subscribe(async (response) => {
      const ArrRecipients = response.recipients.filter((ele: any) => ele.id);


      let ArrRecipientsNew = false
      ArrRecipients.map((item: any) => {
        if (item.email === this.currentUser.email) {
          ArrRecipientsNew = true
          return
        }
      });


      if (!ArrRecipientsNew) {

        this.toastService.showErrorHTMLWithTimeout(
          'Bạn không có quyền xử lý hợp đồng này!',
          '',
          3000
        );
        if (this.type == 1) {
          this.router.navigate(['/login']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        } else {
          this.router.navigate(['/main/dashboard']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        }
      };

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '497px';
      dialogConfig.hasBackdrop = true;
      dialogConfig.data = data;
      dialogConfig.panelClass = 'custom-dialog-container';
      dialogConfig.autoFocus = false

      const dialogRef = this.dialog.open(HsmDialogSignComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(async (result: any) => {
        let signI = null;
        let imageRender = null;

        this.cardId = result.ma_dvcs.trim();

        if (result) {
          this.dataHsm.supplier = result.supplier
          this.dataHsm.ma_dvcs = result.ma_dvcs;
          this.dataHsm.username = result.username;
          this.dataHsm.password = result.password;
          this.dataHsm.password2 = result.password2;

          await this.signContractSubmit();
        }
      });
    })
  }

  async remoteDialogSignOpen(recipientId: number) {
    this.spinner.hide();
    const data = {
      title: 'CHỮ KÝ REMOTE SIGNING',
      is_content: 'forward_contract',
      recipientId: recipientId,
      dataContract: this.recipient,
    };
    const determineCoordination = await this.contractService.getDetermineCoordination(recipientId).toPromise();

    let isInRecipient = false;
    const participants = this.datas?.is_data_contract?.participants;

    for (const participant of participants) {
      for (const card of participant.recipients) {
        for (const item of determineCoordination.recipients) {
          if (item.card_id == card.card_id) {


            isInRecipient = true;
          }
        }
      }
    }
    if (!isInRecipient) {

      this.toastService.showErrorHTMLWithTimeout(
        'Bạn không có quyền xử lý hợp đồng này!',
        '',
        3000
      );
      if (this.type == 1) {
        this.router.navigate(['/login']);
        this.dialogRef.close();
        this.spinner.hide();
        return
      } else {
        this.router.navigate(['/main/dashboard']);
        this.dialogRef.close();
        this.spinner.hide();
        return
      }
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
    this.contractService.getDetermineCoordination(this.recipientId).subscribe(async (response) => {
      const ArrRecipients = response.recipients.filter((ele: any) => ele.id);


      let ArrRecipientsNew = false
      ArrRecipients.map((item: any) => {
        if (item.email === this.currentUser.email) {
          ArrRecipientsNew = true
          return
        }
      });


      if (!ArrRecipientsNew) {

        this.toastService.showErrorHTMLWithTimeout(
          'Bạn không có quyền xử lý hợp đồng này!',
          '',
          3000
        );
        if (this.type == 1) {
          this.router.navigate(['/login']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        } else {
          this.router.navigate(['/main/dashboard']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        }
      };

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '497px';
      dialogConfig.hasBackdrop = true;
      dialogConfig.data = data;
      dialogConfig.panelClass = 'custom-dialog-container';

      const dialogRef = this.dialog.open(RemoteDialogSignComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(async (result: any) => {
        let signI = null;
        let imageRender = null;

        this.cardId = result.ma_dvcs.trim();

        if (result) {
          this.dataCert.cert_id = result.ma_dvcs;

          await this.signContractSubmit();
        }
      });
    })
  }

  pkiDialogSignOpen() {
    this.spinner.hide();
    const data = {
      title: 'CHỮ KÝ PKI',
      type: 3,
      sign: this.signInfoPKIU,
      data: this.datas,
      recipientId: this.recipientId,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.width = '497px';
    dialogConfig.height = '330px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(PkiDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result && result.phone && result.networkCode) {
        this.loadingText =
          'Yêu cầu ký đã được gửi tới số điện thoại của bạn.\n Vui lòng Xác nhận để thực hiện dịch vụ';
        this.signInfoPKIU.phone = result.phone;
        this.signInfoPKIU.phone_tel = result.phone_tel;
        this.signInfoPKIU.networkCode = result.networkCode;
        this.signInfoPKIU.hidden_phone = result.hidden_phone;
        if (result.phone && result.phone_tel && result.networkCode) {
          this.dataNetworkPKI = {
            networkCode: this.signInfoPKIU.networkCode,
            phone: this.signInfoPKIU.phone,
            hidden_phone: this.signInfoPKIU.hidden_phone,
          };

          await this.signContractSubmit();
        } else {
          this.toastService.showErrorHTMLWithTimeout(
            'Vui lòng nhập số điện thoại và chọn nhà mạng',
            '',
            3000
          );
        }
      }
    });
  }

  dataOTP: any;
  async confirmOtpSignContract(
    id_recipient_signature: any,
    phone_recipient_signature: any
  ) {
    let checkCurrentSigningStatus: any = await this.checkCurrentSigningCall()
    if (!checkCurrentSigningStatus) return
    const data = {
      title: 'XÁC NHẬN OTP',
      is_content: 'forward_contract',
      recipient_id: id_recipient_signature,
      phone: phone_recipient_signature,
      name: this.userOtp,
      contract_id: this.datas.is_data_contract.id,
      datas: this.datas,
      currentUser: this.currentUser,
      orgId: this.orgId,
      otpValueSign: this.otpValueSign
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-dialog-container';
    // dialogConfig.maxWidth = '480px';
    // dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ConfirmSignOtpComponent, dialogConfig);
  }

  confirmOtp(otp: any) {

    this.dataOTP = {
      otp: otp,
    };
    this.signContractSubmit();
  }

   prepareInfoSignUsbTokenV1(page: any) {
    const canvasPageSign: any = document.getElementById('canvas-step3-' + page);
    const heightPage = canvasPageSign.height;

    const canvasPageSignElement: any = canvasPageSign.getBoundingClientRect();
    const canvasPageSignLeft: any = canvasPageSignElement.left;

    let currentHeight: number = 0;
    for (let i = 1; i < page; i++) {
      const canvas: any = document.getElementById('canvas-step3-' + i);
      currentHeight += canvas.height;
    }

    const minCanvas = this.detectCoordinateService.getMinCanvasX(this.pageNumber);

    this.isDataObjectSignature.map((sign: any) => {
      if (
        (sign.type == 3 || sign.type == 1 || sign.type == 4 || sign.type == 5) &&
        sign?.recipient?.email === this.currentUser.email &&
        sign?.recipient?.role === this.datas?.roleContractReceived &&
        sign?.page == page
      ) {
        sign.signDigitalX = sign.coordinate_x - (canvasPageSignLeft - minCanvas) /* * this.ratioPDF*/;
        sign.signDigitalY = heightPage - (sign.coordinate_y - currentHeight) - sign.height + sign.page * 5 /* * this.ratioPDF*/;

        sign.signDigitalHeight =
          sign.signDigitalY + sign.height /* * this.ratioPDF*/;
        sign.signDigitalWidth = sign.signDigitalX + sign.width;

        return sign;
      } else {
        return sign;
      }
    });
  }

  convertXForHsm(page: any) {
    const canvasPageSign: any = document.getElementById('canvas-step3-' + page);

    const canvasPageSignElement: any = canvasPageSign.getBoundingClientRect();
    const canvasPageSignLeft: any = canvasPageSignElement.left;

    let currentHeight: number = 0;
    for (let i = 1; i < page; i++) {
      const canvas: any = document.getElementById('canvas-step3-' + i);
      currentHeight += canvas.height;
    }

    const minCanvas = this.detectCoordinateService.getMinCanvasX(this.pageNumber);

    this.isDataObjectSignature.map((sign: any) => {
      if (
        (sign.type == 3 || sign.type == 1 || sign.type == 4 || sign.type == 5) &&
        sign?.recipient?.email === this.currentUser.email &&
        sign?.recipient?.role === this.datas?.roleContractReceived &&
        sign?.page == page
      ) {
        sign.signDigitalX = sign.coordinate_x - (canvasPageSignLeft - minCanvas);

        return sign;
      } else {
        return sign;
      }
    });
  }

  prepareInfoSignUsbTokenV2(page: any) {
    const canvasPageSign: any = document.getElementById('canvas-step3-' + page);
    const heightPage = canvasPageSign.height;

    const canvasPageSignElement: any = canvasPageSign.getBoundingClientRect();
    const canvasPageSignLeft: any = canvasPageSignElement.left;

    let currentHeight: number = 0;
    for (let i = 1; i < page; i++) {
      const canvas: any = document.getElementById('canvas-step3-' + i);
      currentHeight += canvas.height;
    }

    const minCanvas = this.detectCoordinateService.getMinCanvasX(this.pageNumber);

    this.isDataObjectSignature.map((sign: any) => {
      if (
        (sign.type == 3 || sign.type == 1 || sign.type == 4 || sign.type == 5) &&
        sign?.recipient?.email === this.currentUser.email &&
        sign?.recipient?.role === this.datas?.roleContractReceived &&
        sign?.page == page
      ) {
        sign.signDigitalX = sign.coordinate_x - (canvasPageSignLeft - minCanvas) /* * this.ratioPDF*/;
        sign.signDigitalY = heightPage - (sign.coordinate_y - currentHeight) - sign.height + sign.page * 5.86 /* * this.ratioPDF*/;

        sign.signDigitalWidth = sign.width /* * this.ratioPDF*/;
        sign.signDigitalHeight = sign.height;

        return sign;
      } else {
        return sign;
      }
    });
  }

  mobile: boolean = false;
  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  openPdf(path: any, event: any) {
    this.contractService.openPdf(path, event);
  }

  flagFocus: boolean = false;
  switchesValueChange($event: any) {
    if ($event == 'text') {
      this.flagFocus = true;
    } else {
      this.flagFocus = false;
    }
  }

  contractNoValue: boolean = false;
  contractNoValueSign: string;
  otpValueSign: any = "";
  contractNoValueChange($event: any) {
    this.contractNoValueSign = $event;
  }

  otpValueChange($event: any) {
    this.otpValueSign = $event;
  }

  async signBCY(pdfContractPath: any, fieldId: any){
    let params = {
      FileUploadHandler: `${environment.apiUrl}/api/v1/processes/digital-sign-bcy?field_id=${fieldId}`,
      SessionId: "",
      FileName: pdfContractPath,
      DocNumber: "",
      IssuedDate: new Date()
    }

    return new Promise((resolve: any, reject: any) => {
      vgca_sign_issued(JSON.stringify(params), (res: any) => {
        let response = JSON.parse(res)
        if (response.Status == 0 && response.FileServer) {
          let data: any = []
          data[0] = {
            "processAt": new Date()
          };
          this.contractService.updateInfoContractConsider(data, this.recipientId).subscribe(
            (res) => {
              this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(
                  ['/main/form-contract/detail/' + this.idContract],
                  {
                    queryParams: {
                      recipientId: this.recipientId,
                      consider: true,
                      action: 'sign',
                    },
                    skipLocationChange: true,
                  }
                );
              });

              setTimeout(() => {
                if (!this.mobile) {
                  this.toastService.showSuccessHTMLWithTimeout(
                    [3, 4].includes(this.datas.roleContractReceived)
                      ? 'Ký hợp đồng thành công'
                      : 'Xem xét hợp đồng thành công',
                    '',
                    3000
                  );
                } else {
                  if ([3, 4].includes(this.datas.roleContractReceived)) {
                    alert('Ký hợp đồng thành công');
                  } else {
                    alert('Xem xét hợp đồng thành công');
                  }
                }

              }, 1000);
            }
          )
          resolve('success')
        } else  {
          reject('false')
        }
      })
    })
  }

  remoteDialogSuccessOpen() {
    return Swal.fire({
      title: "THÔNG BÁO",
      text: "Hệ thống đã thực hiện gửi hợp đồng đến hệ thống CA2 RS, vui lòng mở App CA2 Remote Signing để ký hợp đồng!",
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#b0bec5',
      cancelButtonText: "Thoát",
      customClass: {
        title: 'my-custom-title-class',
      },
    });
  }

  async getRemoteSigningCurrentStatusCall(recipId: any) {
    this.contractService.getRemoteSigningCurrentStatus(recipId).subscribe(
      (res: any) => {
        if (res?.status == "QUA_THOI_GIAN_KY" || res?.status == "TU_CHOI" || res.status == "THAT_BAI") {
          this.isRemoteSigningExpired = true
          if (res.status == "TU_CHOI") this.countReject++
        }

        if (res?.status == "DANG_XU_LY") {
          this.isRemoteSigningProcessing = true
        }
        if (res?.status == "QUA_THOI_GIAN_KY" || res?.status == "DANG_XU_LY" || res?.status == "TU_CHOI") {
          this.remoteSigningProcessingStatusSwalfire(res?.status)
        }
      }
    )
  }

  remoteSigningProcessingStatusSwalfire(code: string) {
    return Swal.fire({
      title: this.getTextAlertRemoteSigningProcess(code),
      icon: code == 'HOAN_THANH' ? 'success' : 'warning',
      showCancelButton: false,
      confirmButtonColor: '#0041C4',
      // cancelButtonColor: '#b0bec5',
      confirmButtonText: this.translate.instant('confirm'),
      // cancelButtonText: this.translate.instant('contract.status.canceled'),
    });
  }

  getTextAlertRemoteSigningProcess(code: any) {
    switch (code) {
      case "QUA_THOI_GIAN_KY":
        return "Hợp đồng đã quá thời gian ký trên app CA2 RS, vui lòng thực hiện ký lại trên web!"
      case "DANG_XU_LY":
        return "Hợp đồng đang được xử lý, vui lòng thực hiện ký trên app CA2 RS và reload lại trang!"
      case "HOAN_THANH":
        return "Hợp đồng đã ký thành công!"
      case "TU_CHOI":
        return "Đã từ chối ký hợp đồng trên app CA2 RS, vui lòng thực hiện ký lại trên web!"
    }
  }

  containNotSupportTextSwalfire() {
    return Swal.fire({
      title: "Hệ thống <b>không hỗ trợ</b> loại ký của bạn <b>nhập ô text/số hợp đồng</b>. Nếu đồng ý với điều khoản hợp đồng, bấm <b>Đồng ý</b>, <b>bỏ qua ô text/số hợp đồng</b> và bấm <b>Xác nhận</b> với điều khoản.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0041C4',
      // cancelButtonColor: '#b0bec5',
      confirmButtonText: this.translate.instant('Đồng ý'),
      cancelButtonText: this.translate.instant('contract.status.canceled'),
      allowOutsideClick: false
    });
  }

  openDetailOriginalContract(data: any){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/form-contract/detail/' +data.originalContractId],
      {
        queryParams: {
          'page': 1,
          'filter_type': '',
          'filter_contract_no':'',
          'filter_from_date': '',
          'filter_to_date': '',
          'isOrg': 'off',
          'organization_id': '',
          'status': 'complete'
        },
        skipLocationChange: false
      });
    });
  }

  currentSigningStatus: any = null;
  async checkCurrentSigningCall() {
    let currentSigningStatus: any = null;
    try {
      currentSigningStatus = await this.contractService.checkCurrentSigning(this.recipientId).toPromise()
    } catch (error) {
      this.spinner.hide()
      this.toastService.showErrorHTMLWithTimeout("Lỗi ký số. Vui lòng thử lại sau ít phút", "", 3000)
      return false
    }

    if (!currentSigningStatus.success) {
      if (currentSigningStatus.message) {
        this.spinner.hide()
        this.toastService.showErrorHTMLWithTimeout(currentSigningStatus.message, "", 3000)
        return false
      } else {
        this.spinner.hide()
        this.toastService.showErrorHTMLWithTimeout("Lỗi ký số. Vui lòng thử lại sau ít phút", "", 3000)
        return false
      }
    } else if (currentSigningStatus.success) {
      return true
    }
  }
}