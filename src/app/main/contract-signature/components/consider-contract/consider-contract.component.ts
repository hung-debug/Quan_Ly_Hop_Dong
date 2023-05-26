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
import { forkJoin, from, throwError, timer } from 'rxjs';
import { ToastService } from '../../../../service/toast.service';
import { UploadService } from '../../../../service/upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { encode } from 'base64-arraybuffer';
import { UserService } from '../../../../service/user.service';
// @ts-ignore
import domtoimage from 'dom-to-image';
import { concatMap, delay, map, tap } from 'rxjs/operators';
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

  sum: number[] = [];
  top: any[] = [];
  multiSignInPdf: boolean = false;

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
    this.getDeviceApp();

    this.appService.setTitle('THÔNG TIN HỢP ĐỒNG');

    this.idContract = this.activeRoute.snapshot.paramMap.get('id');

    const checkViewContract = await this.checkViewContractService.callAPIcheckViewContract(this.idContract,false);
    console.log(checkViewContract);

    if (checkViewContract) {
      this.actionRoleContract();
    } else {
      this.router.navigate(['/page-not-found']);
    }

    if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
      this.type = 1;
    } else this.type = 0;
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
          this.toastService.showErrorHTMLWithTimeout('Có lỗi', '', 3000);
        }
      );
    });
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
    console.log('da ', dataOrg);

    if (dataOrg.usb_token_version == 1) {
      this.usbTokenVersion = 1;
    } else if (dataOrg.usb_token_version == 2) {
      console.log('2 ', 2);
      this.usbTokenVersion = 2;
    }
  }

  timerId: any;
  typeSignDigital: any;
  isTimestamp: string = 'false';
  getDataContractSignature() {
    this.contractService.getDetailContract(this.idContract).subscribe(
      async (rs) => {
        this.isDataContract = rs[0];
        this.isDataFileContract = rs[1];
        this.isDataObjectSignature = rs[2];

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
        console.log(this.datas.is_data_object_signature);
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
            element['text_type']='currency';
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
          // console.log(element.sign_unit, element.sign_config);
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
          if (signUpdate && (signUpdate.type == 3 || signUpdate.type == 2) &&
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
          
          arr.forEach((items: any) => {
            this.coordinateY.push(items.coordinate_y);
            this.idElement.push(items.id);
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

          if (this.mobile && this.recipient.status != 2 && this.recipient.status != 3) {
            if (image_base64) {
              const recipient = await this.contractService.getDetermineCoordination(this.recipientId).toPromise();

              let fieldRecipientId: any = null;
              recipient.recipients.forEach((ele: any) => {
                if (ele.id == this.recipientId) {
                  fieldRecipientId = ele.fields;
                }
              });

              if (fieldRecipientId.length == 1) {
                const pdfMobile = await this.contractService.getFilePdfForMobile(this.recipientId, image_base64).toPromise();
                this.pdfSrcMobile = pdfMobile.filePath;
              } else {
                this.multiSignInPdf = true;
                alert('Hợp đồng có chứa ô text/ ô số hợp đồng. Vui lòng thực hiện xử lý trên web hoặc ứng dụng di động!');
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
        }, 100);
      });
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
    let style: any = {
      transform:
        'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      position: 'absolute',
      backgroundColor: backgroundColor,
    };
    style.backgroundColor = d.valueSign ? '' : backgroundColor;
    style.display =
      (this.confirmConsider && this.confirmConsider == 1) ||
        (this.confirmSignature && this.confirmSignature == 1)
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
      console.log('the close dialog');
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

  // Hàm showEventInfo là event khi thả (nhả click chuột) đối tượng ký vào canvas, sẽ chạy vào hàm.
  showEventInfo = (event: any) => {
    let canvasElement: HTMLElement | null;
    if (event.relatedTarget && event.relatedTarget.id) {
      canvasElement = document.getElementById(event.relatedTarget.id);
      let canvasInfo = canvasElement
        ? canvasElement.getBoundingClientRect()
        : '';

      this.coordinates_signature = event.rect;
      let id = event.target.id;

      let signElement = <HTMLElement>document.getElementById(id);
      let rect_location = signElement.getBoundingClientRect();
      if (id.includes('chua-keo')) {
        //Khi kéo vào trong hợp đồng thì sẽ thêm 1 object vào trong mảng sign_config
        event.target.style.webkitTransform = event.target.style.transform =
          'none'; // Đẩy chữ ký về vị trí cũ
        event.target.setAttribute('data-x', 0);
        event.target.setAttribute('data-y', 0);
        id = event.target.id.replace('chua-keo-', '');
        // this.datas.documents.document_user_sign_clone.forEach((element, index) => {
        this.datas.contract_user_sign.forEach((element: any, index: any) => {
          if (element.id == id) {
            let _obj: any = {
              sign_unit: element.sign_unit,
              name: element.name,
              text_attribute_name: element.text_attribute_name,
              required: 1,
            };
            if (element.sign_config.length == 0) {
              _obj['id'] = 'signer-' + index + '-index-0_' + element.id; // Thêm id cho chữ ký trong hợp đồng
            } else {
              _obj['id'] =
                'signer-' +
                index +
                '-index-' +
                element.sign_config.length +
                '_' +
                element.id;
            }
            element['sign_config'].push(_obj);
          }
        });
        // lay doi tuong vua duoc keo moi vao hop dong
        this.signCurent = this.convertToSignConfig().filter(
          (p: any) => !p.position && !p.coordinate_x && !p.coordinate_y
        )[0];
      } else {
        // doi tuong da duoc keo tha vao hop dong
        this.signCurent = this.convertToSignConfig().filter(
          (p: any) => p.id == id
        )[0];
      }

      if (this.signCurent) {
        if (!this.objDrag[this.signCurent['id']]) {
          this.objDrag[this.signCurent['id']] = {};
        }
        // this.isMove = false;
        let layerX;
        // @ts-ignore
        if ('left' in canvasInfo) {
          // layerX = event.rect.left - canvasInfo.left;
          layerX = rect_location.left - canvasInfo.left;
        }

        let layerY = 0;
        //@ts-ignore
        if ('top' in canvasInfo) {
          // layerY = canvasInfo.top <= 0 ? event.rect.top + Math.abs(canvasInfo.top) : event.rect.top - Math.abs(canvasInfo.top);
          layerY =
            canvasInfo.top <= 0
              ? rect_location.top + Math.abs(canvasInfo.top)
              : rect_location.top - Math.abs(canvasInfo.top);
        }
        let pages = event.relatedTarget.id.split('-');
        let page = Helper._attemptConvertFloat(pages[pages.length - 1]) as any;

        /* test set location signature
        Duongdt
         */
        if (page > 1) {
          let countPage = 0;
          for (let i = 1; i < page; i++) {
            let canvasElement = document.getElementById(
              'canvas-step3-' + i
            ) as HTMLElement;
            let canvasInfo = canvasElement.getBoundingClientRect();
            countPage += canvasInfo.height;
          }
          let canvasElement = document.getElementById(
            'canvas-step3-' + page
          ) as HTMLElement;
          let canvasInfo = canvasElement.getBoundingClientRect();
          // @ts-ignore
          layerY =
            countPage +
            canvasInfo.height -
            (canvasInfo.height - layerY) +
            5 * (page - 1);
        }
        //END

        let _array = Object.values(this.obj_toa_do);
        let _sign = <HTMLElement>document.getElementById(this.signCurent['id']);
        if (_sign) {
          _sign.style.transform =
            'translate(' + layerX + 'px,' + layerY + 'px)';
          this.signCurent['coordinate_x'] = layerX;
          this.signCurent['coordinate_y'] = layerY;
          _sign.setAttribute('data-x', layerX + 'px');
          _sign.setAttribute('data-y', layerY + 'px');
          this.objSignInfo.traf_x = layerX;
          this.objSignInfo.traf_y = layerY;
          //
          this.objSignInfo['id'] = this.signCurent['id'];
          //
          this.signCurent.position = _array.join(',');
          _sign.style.display = '';
          // @ts-ignore
          _sign.style['z-index'] = '1';
          this.isEnableSelect = false;
        }

        this.objSignInfo.traf_x = Math.round(this.signCurent['coordinate_x']);
        this.objSignInfo.traf_y = Math.round(this.signCurent['coordinate_y']);

        this.signCurent['position'] = _array.join(',');
        this.signCurent['left'] = this.obj_toa_do.x1;
        //@ts-ignore
        if ('top' in canvasInfo) {
          this.signCurent['top'] = (
            rect_location.top - canvasInfo.top
          ).toFixed();
        }
        let name_accept_signature = '';

        // lay lai danh sach signer sau khi keo vao hop dong
        this.datas.contract_user_sign.forEach((res: any) => {
          if (res.sign_config.length > 0) {
            let arrSignConfigItem = res.sign_config;
            arrSignConfigItem.forEach((element: any) => {
              if (element.id == this.signCurent['id']) {
                let _arrPage = event.relatedTarget.id.split('-');
                // gán hình thức kéo thả => disable element trong list sign
                name_accept_signature = res.sign_unit;
                // hiển thị ô nhập tên trường khi kéo thả đối tượng Text
                if (res.sign_unit == 'text') {
                  this.isEnableText = true;
                  setTimeout(() => {
                    //@ts-ignore
                    document.getElementById('text-input-element').focus();
                  }, 10);
                } else this.isEnableText = false;

                if (res.sign_unit == 'so_tai_lieu') {
                  this.isChangeText = true;
                } else {
                  this.isChangeText = false;
                }

                // element['number'] = _arrPage[_arrPage.length - 1];
                element['page'] = _arrPage[_arrPage.length - 1];
                element['position'] = this.signCurent['position'];
                element['coordinate_x'] = this.signCurent['coordinate_x'];
                element['coordinate_y'] = this.signCurent['coordinate_y'];
                if (!this.objDrag[this.signCurent['id']].count) {
                  // element['width'] = this.datas.configs.e_document.format_signature_image.signature_width;
                  if (
                    res.sign_unit == 'text' ||
                    res.sign_unit == 'so_tai_lieu'
                  ) {
                    if (
                      res.sign_unit == 'so_tai_lieu' &&
                      this.datas.contract_no
                    ) {
                      element['width'] = rect_location.width;
                      element['height'] = rect_location.height;
                    } else {
                      element['width'] = '135';
                      element['height'] = '28';
                    }
                  } else {
                    element['width'] = '135';
                    element['height'] = '85';
                  }

                  this.objSignInfo.width = element['width'];
                  this.objSignInfo.height = element['height'];
                  this.objSignInfo.text_attribute_name = '';
                  this.list_sign_name.forEach((item: any) => {
                    item['selected'] = false;
                  });
                  // document.getElementById('select-dropdown'). = 0;
                  // @ts-ignore
                  // document.getElementById('select-dropdown').value = "";
                  this.objDrag[this.signCurent['id']].count = 2;
                } else {
                  element['width'] = event.target.offsetWidth;
                  element['height'] = event.target.offsetHeight;
                }
              }
            });
          }
        });
      }
    } else {
      if (event.type == 'dragend') {
        if (!event.dragenter && event.target.id.includes('chua-keo')) {
          event.target.style.webkitTransform = event.target.style.transform =
            'none';
          event.target.setAttribute('data-x', 0);
          event.target.setAttribute('data-y', 0);
        } else if (!event.dragenter && !event.target.id.includes('chua-keo')) {
          let id = event.target.id;
          let signCurent = this.convertToSignConfig().filter(
            (p: any) => p.id == id
          )[0];
          // translate the element
          if (signCurent) {
            event.target.style.webkitTransform = event.target.style.transform =
              'translate(' +
              signCurent['coordinate_x'] +
              'px, ' +
              signCurent['coordinate_y'] +
              'px)';
            // update the posiion attributes
            event.target.setAttribute('data-x', signCurent['coordinate_x']);
            event.target.setAttribute('data-y', signCurent['coordinate_y']);
          }
        }
      }
    }
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

  async checkDifferentName(){
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
    let haveSignHsm = false;

    let typeSignDigital: any = null;
    let typeSignImage: any = null;

    const counteKYC = this.recipient?.sign_type.filter(
      (p: any) => p.id == 5
    ).length;
    console.log("datas", this.datas);

    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;

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
        if (
          e &&
          e == 1 &&
          !this.validateSignature() &&
          !(
            (this.datas.roleContractReceived == 2 &&
              this.confirmConsider == 2 &&
              counteKYC <= 0) ||
            (this.datas.roleContractReceived == 3 &&
              this.confirmSignature == 2) ||
            (this.datas.roleContractReceived == 4 && this.confirmSignature == 2)
          )
        ) {
          if (!this.mobile) {
            this.toastService.showErrorHTMLWithTimeout(
              'Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc',
              '',
              3000
            );
            return;
          } else {
            if (this.confirmSignature == 2) {
              this.toastService.showErrorHTMLWithTimeout('Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc','',3000);
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
              ma_dvcs: '',
              username: '',
              password: '',
              password2: '',
              imageBase64: '',
            };
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

          if (typeSignDigital && typeSignDigital != 3) {
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
              const determineCoordination = await this.contractService.getDetermineCoordination(this.recipientId).toPromise();
              console.log("determineCoordination", determineCoordination);
              let isInRecipient = false;
              const participants = this.datas?.is_data_contract?.participants;
              console.log("participants", participants);
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
                console.log("isInRecipient", isInRecipient);
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
                  // console.log(this.datas);
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
                              this.pkiDialogSignOpen();
                              this.spinner.hide();
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

  imageDialogSignOpen(e: any, haveSignImage: boolean) {
    const data = {
      title: 'KÝ HỢP ĐỒNG ',
      is_content: 'forward_contract',
      orgId: this.orgId,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      console.log('the close dialog image ', result);
      let is_data = result;

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
          // console.log(this.datas);
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

  openMarkSign(code: string,signUpdatePayload?: any,notContainSignImage?: any) {
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
      data: data
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if(res) {
        this.srcMark = res;

        this.spinner.show();

        if (code == 'hsm') 
          this.hsmDialogSignOpen(this.recipientId);
        else if (code == 'usb1')
          this.signTokenVersion1(signUpdatePayload, notContainSignImage);
        else if (code == 'usb2')
          this.getSessionId(this.taxCodePartnerStep2,signUpdatePayload,notContainSignImage);
      }
    });
  }

  getSwalFire(code: string) {
    if (code == 'digital') {
      return Swal.fire({
        title: this.getTextAlertConfirm(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
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
        confirmButtonColor: '#3085d6',
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
      if (this.confirmSignature == 1 && this.datas.roleContractReceived == 3) {
        return 'Bạn có đồng ý với nội dung của hợp đồng và xác nhận ký?';
      } else if (
        this.confirmSignature == 1 &&
        this.datas.roleContractReceived == 4
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
  async signDigitalDocument() {
    let typeSignDigital = this.typeSignDigital;

    //= 2 => Ky usb token
    if (typeSignDigital == 2) {
      if (this.signCertDigital) {
        for (const signUpdate of this.isDataObjectSignature) {
          if (signUpdate && (signUpdate.type == 1 || signUpdate.type == 3 || signUpdate.type == 4) && [3, 4].includes(this.datas.roleContractReceived) &&
            signUpdate?.recipient?.email === this.currentUser.email && signUpdate?.recipient?.role === this.datas?.roleContractReceived) {
            let fileC = await this.contractService.getFileContractPromise(this.idContract);
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
              
            if (signUpdate.type == 1 || signUpdate.type == 4) {
              let imageRender = null;

              this.textSign = signUpdate.valueSign;
              this.width = signUpdate.width;

              await of(null).pipe(delay(150)).toPromise();
              imageRender = <HTMLElement>(document.getElementById('text-sign'));

              this.font = signUpdate.font;
              this.font_size = signUpdate.font_size;

              this.widthText = this.calculatorWidthText(this.textSign, signUpdate.font);

              if(this.usbTokenVersion == 1) {
                signUpdate.signDigitalY = signUpdate.signDigitalY -signUpdate.page - 5;
                signUpdate.signDigitalWidth = signUpdate.signDigitalX + imageRender.offsetWidth;
                signUpdate.signDigitalHeight = signUpdate.signDigitalY + imageRender.offsetHeight;
              } else if(this.usbTokenVersion == 2) {
                signUpdate.signDigitalY = signUpdate.signDigitalY -signUpdate.page - 5;
                signUpdate.signDigitalWidth = imageRender.offsetWidth;
                signUpdate.signDigitalHeight = imageRender.offsetHeight;
              }
             

              await of(null).pipe(delay(120)).toPromise();

              if (imageRender) {
                const textSignB = await domtoimage.toPng(imageRender);
                signI = this.textSignBase64Gen = textSignB.split(',')[1];
              }
            } else if (signUpdate.type == 3) {
              //lấy ảnh chữ ký usb token
              let imageRender: any = '';

              if (this.usbTokenVersion == 1) {
                if (this.markImage) {
                  await of(null).pipe(delay(150)).toPromise();
                  imageRender = <HTMLElement>(document.getElementById('export-html-image'));
                  signUpdate.signDigitalWidth = signUpdate.signDigitalX + imageRender.offsetWidth;
                } else {
                  await of(null).pipe(delay(150)).toPromise();
                  imageRender = <HTMLElement>(document.getElementById('export-html'));
                }

                if (imageRender) {
                  try {
                    const textSignB = await domtoimage.toPng(imageRender,this.getOptions(imageRender));

                    signI = textSignB.split(',')[1];
                  } catch (err) {
                    console.log('err ', err);
                  }
                }
              } else if (this.usbTokenVersion == 2) {
                if (this.markImage) {
                  await of(null).pipe(delay(150)).toPromise();
                  imageRender = <HTMLElement>(document.getElementById('export-html2-image'));
                  signUpdate.signDigitalWidth = imageRender.offsetWidth;
                } else {
                  imageRender = <HTMLElement>(document.getElementById('export-html2'));
                }

                if (imageRender) {
                  const textSignB = await domtoimage.toJpeg(imageRender,this.getOptions(imageRender));
                  signI = textSignB.split(',')[1];
                }
              }
            }

            const signDigital = JSON.parse(JSON.stringify(signUpdate));
            signDigital.Serial = this.signCertDigital.Serial;

            const base64String = await this.contractService.getDataFileUrlPromise(fileC);
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
                this.toastService.showErrorHTMLWithTimeout(
                  'Lỗi ký USB Token',
                  '',
                  3000
                );
                return false;
              }
            } else if (this.usbTokenVersion == 1) {
              console.log('vao day ');
              const dataSignMobi: any =
                await this.contractService.postSignDigitalMobi(
                  signDigital,
                  signI
                );

              if (!dataSignMobi.data.FileDataSigned) {
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
      let fileC = await this.contractService.getFileContractPromise(
        this.idContract
      );
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

      await of(null).pipe(delay(120)).toPromise();

      let imageRender = null;

      if (this.markImage) {
        imageRender = <HTMLElement>(
          document.getElementById('export-html-pki-image')
        );
      } else {
        imageRender = <HTMLElement>document.getElementById('export-html-pki');
      }

      let image_base64 = '';
      if (imageRender) {
        const textSignB = await domtoimage.toJpeg(imageRender);
        image_base64 = this.textSignBase64Gen = textSignB.split(',')[1];
      }

      if (fileC && objSign.length) {
        const checkSign = await this.contractService.signPkiDigital(
          this.dataNetworkPKI.phone,
          this.dataNetworkPKI.networkCode.toLowerCase(),
          this.recipientId,
          this.datas.is_data_contract.name,
          image_base64,
          this.isTimestamp
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
    } else if (typeSignDigital == 4) {
      for (const signUpdate of this.isDataObjectSignature) {
        if (
          signUpdate &&
          (signUpdate.type == 1 ||
            signUpdate.type == 3 ||
            signUpdate.type == 4) &&
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

          let fileC = await this.contractService.getFileContractPromise(
            this.idContract
          );

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
          let fieldHsm = {
            coordinate_x: signUpdate.coordinate_x,
            coordinate_y: signUpdate.coordinate_y,
            width: signUpdate.signDigitalWidth,
            height: signUpdate.signDigitalHeight,
            page: signUpdate.page,
          };
          if (signUpdate.type == 1 || signUpdate.type == 4) {
            this.textSign = signUpdate.valueSign;

            this.font = signUpdate.font;
            this.font_size = signUpdate.font_size;

            this.width = signUpdate.width;

            await of(null).pipe(delay(120)).toPromise();
            const imageRender = <HTMLElement>(
              document.getElementById('text-sign')
            );

            fieldHsm.width = imageRender.clientWidth;
            fieldHsm.height = imageRender.clientHeight;

            if (imageRender) {
              const textSignB = await domtoimage.toPng(imageRender);
              signI = this.textSignBase64Gen = textSignB.split(',')[1];
            }
          } else if (signUpdate.type == 3) {
            await of(null).pipe(delay(150)).toPromise();

            let imageRender: HTMLElement | null = null;

            //render khi role là 4 (văn thư) hoặc role khác (người ký)
            if (this.datas.roleContractReceived == 4) {
              imageRender = <HTMLElement>(
                document.getElementById('export-html-hsm1-image')
              );
            } else {
              imageRender = <HTMLElement>(
                document.getElementById('export-html-hsm1')
              );
            }

            // fieldHsm.coordinate_y = fieldHsm.coordinate_y - 8;
            fieldHsm.height = imageRender.offsetHeight / 1.5;
            fieldHsm.width = imageRender.offsetWidth / 1.5;

            if (imageRender) {
              const textSignB = await domtoimage.toPng(
                imageRender,
                this.getOptions(imageRender)
              );
              signI = textSignB.split(',')[1];
            }
          }

          if (!this.mobile) {
            this.dataHsm = {
              field: fieldHsm,
              ma_dvcs: this.dataHsm.ma_dvcs,
              username: this.dataHsm.username,
              password: this.dataHsm.password,
              password2: this.dataHsm.password2,
              imageBase64: signI,
            };
          } else {
            this.dataHsm = {
              ma_dvcs: this.dataHsm.ma_dvcs,
              username: this.dataHsm.username,
              password: this.dataHsm.password,
              password2: this.dataHsm.password2,
              imageBase64: signI,
            };
          }

          if (fileC && objSign.length) {
            if (!this.mobile) {
              const checkSign = await this.contractService.signHsm(
                this.dataHsm,
                this.recipientId,
                this.isTimestamp
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

      let fileC = await this.contractService.getFileContractPromise(
        this.idContract
      );
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

          const textSignB = domtoimage.toPng(imageRender,this.getOptions(imageRender));

          const valueBase64 = (await textSignB).split(',')[1];

          formData = {
            content: 'data:image/png;base64,' + valueBase64,
            name: 'image_' + new Date().getTime() + '.jpg',
            organizationId:
              this.data_contract?.is_data_contract?.organization_id,
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
        signUpdate.type == 3 &&
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
          this.getSessionId(this.taxCodePartnerStep2,signUpdatePayload,notContainSignImage);
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
        confirmButtonColor: '#3085d6',
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
      console.log("determineCoordination", determineCoordination);
      let isInRecipient = false;
      const participants = this.datas?.is_data_contract?.participants;
      console.log("participants", participants);
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
        console.log("isInRecipient", isInRecipient);
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
              confirmButtonColor: '#3085d6',
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
        confirmButtonColor: '#3085d6',
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
      Swal.fire({
        html:
          'Vui lòng bật tool ký số hoặc tải ' +
          `<a href='https://drive.google.com/file/d/1MPnntDPSoTX8AitnSEruZB_ovB9M8gOU/view' target='_blank'>Tại đây</a>  và cài đặt`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
      return;
    }

    const sessionId = JSON.parse(window.atob(apiSessionId.data)).SessionId;
    this.sessionIdUsbToken = sessionId;

    if (!sessionId) {
      this.spinner.hide();
      Swal.fire({
        html:
          'Vui lòng bật tool ký số hoặc tải ' +
          `<a href='https://drive.google.com/file/d/1MPnntDPSoTX8AitnSEruZB_ovB9M8gOU/view' target='_blank'>Tại đây</a>  và cài đặt`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
      });
    }
  }

  async createEmptySignature(signUpdate: any, signDigital: any, image: any) {
    const emptySignature = await this.contractService.createEmptySignature(this.recipientId,signUpdate,signDigital,image,this.certInfoBase64).toPromise();

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
        console.log('da ', dataSignatureToken);
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
    } catch (err) {
      this.toastService.showErrorHTMLWithTimeout(
        'Lỗi ký usb token ' + err,
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
              };
            });
        } else {
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
          };

          this.contractService.uploadFileImageBase64Signature(formData).subscribe((responseBase64) => {
              // signUpdateTempN.value = responseBase64.file_object.file_path;
              signUpdateTempN[0].value = responseBase64.file_object.file_path;

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

    if (notContainSignImage && this.eKYC == false) {
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
      if (this.eKYC == false) {
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
                        ? 'success_sign1'
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
      console.log(imgLinksRes);
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
        console.log('response organization ', response);

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
        };

        this.contractService
          .uploadFileImageBase64Signature(formData)
          .subscribe((responseBase64) => {
            console.log('response base 64 ', responseBase64);

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
      confirmButtonColor: '#3085d6',
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
          console.log('ArrRecipientsNew123444444', response.recipients);
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
        !item.valueSign &&
        item.type != 3
    );

    return validSign.length == 0;
  }

  t() {
    console.log(this);
  }

  downloadContract(id: any) {
    this.contractService.getFileZipContract(id).subscribe(
      (data) => {
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

  checkIsViewContract() {
    if (this.datas?.is_data_contract?.participants?.length) {
      for (const participant of this.datas.is_data_contract.participants) {
        for (const recipient of participant.recipients) {
          if (this.recipientId == recipient.id) {
            this.recipient = recipient;
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
                  this.eKYCStart();
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

  eKYCStart() {
    const data = {
      id: 0,
      title: 'Xác thực CMT/CCCD mặt trước',
      recipientId: this.recipientId,
      contractId: this.idContract,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.data = data;
    dialogConfig.disableClose = true;
    // dialogConfig.width = '100000000000000000000000000000px';  

    const dialogRef = this.dialog.open(EkycDialogSignComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.cccdFront = result;

      this.contractService
        .detectCCCD(this.cccdFront, data.contractId, data.recipientId)
        .subscribe((response) => {
          console.log('response ', response);

          this.nameCompany = response.name;
          this.cardId = response.id;
        });

      if (result) this.eKYCSignOpenAfter();
    });
  }

  eKYCSignOpenAfter() {
    const data = {
      id: 1,
      title: 'Xác thực CMT/CCCD mặt sau',
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
            console.log('Nhận dạng khuôn mặt thành công ');
            await this.signContractSubmit();
          }
        });
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
    console.log("determineCoordination", determineCoordination);
    let isInRecipient = false;
    const participants = this.datas?.is_data_contract?.participants;
    console.log("participants", participants);
    for (const participant of participants) {
      for (const card of participant.recipients) {
        for (const item of determineCoordination.recipients) {
          if (item.card_id == card.card_id) {
            console.log("item.card_id", item.card_id);
            console.log("card.card_id", card.card_id);
            isInRecipient = true;
          }
        }
      }
    }
    if (!isInRecipient) {
      console.log("isInRecipient", isInRecipient);
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
      console.log("ArrRecipients", ArrRecipients);

      let ArrRecipientsNew = false
      ArrRecipients.map((item: any) => {
        if (item.email === this.currentUser.email) {
          ArrRecipientsNew = true
          return
        }
      });
      console.log("ArrRecipientsNew111", ArrRecipientsNew);

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

      const dialogRef = this.dialog.open(HsmDialogSignComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(async (result: any) => {
        let signI = null;
        let imageRender = null;

        this.cardId = result.ma_dvcs.trim();

      console.log("src mark ", this.srcMark);

      // if (this.markImage) {
      //   imageRender = <HTMLElement>(document.getElementById('export-html-hsm1-image'));

      //   console.log("image render", imageRender);
      // } else {
      //   imageRender = <HTMLElement>document.getElementById('export-html-hsm1');
      // }

      // if (imageRender) {

      //   try {
      //   const textSignB = await domtoimage.toPng(imageRender);

      //   console.log("te ", textSignB);
      //   signI = textSignB.split(',')[1];
      //   } catch(err) {
      //     console.log("err ",err);
      //   }
      // }

      console.log("vao day ");

        if (result) {
          this.dataHsm.ma_dvcs = result.ma_dvcs;
          this.dataHsm.username = result.username;
          this.dataHsm.password = result.password;
          this.dataHsm.password2 = result.password2;

          await this.signContractSubmit();
        }
      });
    })
  }

  pkiDialogSignOpen() {
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
        if (result.phone && result.phone_tel && result.networkCode) {
          this.dataNetworkPKI = {
            networkCode: this.signInfoPKIU.networkCode,
            phone: this.signInfoPKIU.phone,
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
  confirmOtpSignContract(
    id_recipient_signature: any,
    phone_recipient_signature: any
  ) {
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
    console.log(otp);
    this.dataOTP = {
      otp: otp,
    };
    this.signContractSubmit();
  }

  prepareInfoSignUsbTokenV1(page: any) {
    const canvasPageSign: any = document.getElementById('canvas-step3-' + page);
    const heightPage = canvasPageSign.height;

    let currentHeight: number = 0;
    for (let i = 1; i < page; i++) {
      const canvas: any = document.getElementById('canvas-step3-' + i);
      currentHeight += canvas.height;
    }

    this.isDataObjectSignature.map((sign: any) => {
      if (
        (sign.type == 3 || sign.type == 1 || sign.type == 4) &&
        sign?.recipient?.email === this.currentUser.email &&
        sign?.recipient?.role === this.datas?.roleContractReceived &&
        sign?.page == page
      ) {
        sign.signDigitalX = sign.coordinate_x /* * this.ratioPDF*/;
        sign.signDigitalY = heightPage - (sign.coordinate_y - currentHeight) - sign.height + sign.page * 5.86 /* * this.ratioPDF*/;

        sign.signDigitalHeight =
          sign.signDigitalY + sign.height /* * this.ratioPDF*/;
        sign.signDigitalWidth = sign.signDigitalX + sign.width;

        return sign;
      } else {
        return sign;
      }
    });
  }

  prepareInfoSignUsbTokenV2(page: any) {
    const canvasPageSign: any = document.getElementById('canvas-step3-' + page);
    const heightPage = canvasPageSign.height;

    let currentHeight: number = 0;
    for (let i = 1; i < page; i++) {
      const canvas: any = document.getElementById('canvas-step3-' + i);
      currentHeight += canvas.height;
    }

    this.isDataObjectSignature.map((sign: any) => {
      if (
        (sign.type == 3 || sign.type == 1 || sign.type == 4) &&
        sign?.recipient?.email === this.currentUser.email &&
        sign?.recipient?.role === this.datas?.roleContractReceived &&
        sign?.page == page
      ) {
        sign.signDigitalX = sign.coordinate_x /* * this.ratioPDF*/;
        sign.signDigitalY = heightPage - (sign.coordinate_y - currentHeight) - sign.height + sign.page * 6 /* * this.ratioPDF*/;

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
  contractNoValueChange($event: any) {
    this.contractNoValueSign = $event;
  }
}
