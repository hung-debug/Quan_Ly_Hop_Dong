import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, throwError } from 'rxjs';
import { AppService } from 'src/app/service/app.service';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { UploadService } from 'src/app/service/upload.service';
import interact from 'interactjs';
import { variable } from '../../../config/variable';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { ProcessingHandleEcontractComponent } from '../../contract-signature/shared/model/processing-handle-econtract/processing-handle-econtract.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CheckViewContractService } from 'src/app/service/check-view-contract.service';

import { Location } from '@angular/common';
import { concatMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/core/Helper';
import { encode } from 'base64-arraybuffer';

@Component({
  selector: 'app-detail-contract',
  templateUrl: './detail-contract.component.html',
  styleUrls: ['./detail-contract.component.scss'],
})
export class DetailContractComponent implements OnInit, OnDestroy {
  datas: any;
  data_contract: any;
  data_coordinates: any;
  @Input() step: any;
  @ViewChild('itemElement') itemElement: QueryList<ElementRef> | undefined;
  @Output() stepChangeSampleContract = new EventEmitter<string>();
  pdfSrc: any;
  thePDF: any = null;
  pageNumber = 1;
  canvasWidth = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  objPdfProperties: any = {
    pages: [],
  };
  confirmConsider = null;
  confirmSignature = null;
  pageMobile = 1;

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

  isPartySignature: any = [
    { id: 1, name: 'Công ty cổ phần công nghệ tin học EFY Việt Nam' },
    { id: 2, name: 'Công ty newEZ Việt Nam' },
    { id: 3, name: 'Tập đoàn Bảo Việt' },
  ];

  optionsSign: any = [
    { item_id: 1, item_text: this.translate.instant('sign_by_eKYC') },
    { item_id: 2, item_text: this.translate.instant('sign_by_token') },
    { item_id: 3, item_text: this.translate.instant('sign_by_pki') },
    { item_id: 4, item_text: this.translate.instant('sign_by_hsm') },
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
  allFileAttachment: any[];
  role: any;
  status: any;
  pdfSrcMobile: string;
  trustedUrl: any;
  action: any;

  consider: boolean = false;

  sum: number[] = [];
  top: any[] = [];

  pageBefore: number;

  filter_name: any;
  filter_type: any;
  filter_contract_no: any;
  filter_from_date: any;
  filter_to_date: any;
  isOrg: any;
  organization_id: any;

  statusLink: any;
  signBefore: boolean = false;

  constructor(
    private contractService: ContractService,
    private checkViewContractService: CheckViewContractService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastService: ToastService,
    private uploadService: UploadService,
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private _location: Location,
    private httpClient: HttpClient
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || ''
    ).customer.info;
  }

  async ngOnInit(): Promise<void> {
    this.getDeviceApp();

    this.route.queryParams.subscribe((params) => {
      this.pageBefore = params.page;

      if (params.action == 'sign') {
        this.signBefore = true;
      }

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
      if (typeof params.isOrg != 'undefined' && params.isOrg) {
        this.isOrg = params.isOrg;
      } else {
        this.isOrg = '';
      }
      if (
        typeof params.organization_id != 'undefined' &&
        params.organization_id
      ) {
        this.organization_id = params.organization_id;
      } else {
        this.organization_id = '';
      }

      if (typeof params.status != 'undefined' && params.status) {
        this.statusLink = params.status;
      } else {
        this.statusLink = '';
      }

      if(typeof params.action != 'undefined' && params.action){
        this.action = params.action;
      }else{
        this.action = '';
      }
    });

    this.appService.setTitle(this.translate.instant('contract.detail'));

    //Lấy thông tin id hợp đồng
    this.idContract = this.activeRoute.snapshot.paramMap.get('id');

    if (await this.checkViewContractService.callAPIcheckViewContract(this.idContract,false)) {
      this.getDataContractSignature();
    } else {
      this.router.navigate(['/page-not-found']);
    }
  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.actionBack();
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

  forward: boolean = false;
  async getDataContractSignature() {
    this.route.queryParams.subscribe((params) => {
      this.recipientId = params.recipientId;
      this.consider = params.consider;
    });

    this.contractService.getDetailContract(this.idContract).subscribe(
      async (rs) => {

        this.isDataContract = rs[0];
        this.isDataFileContract = rs[1];
        this.isDataObjectSignature = rs[2];

         //Hợp đồng huỷ status = 32 => link 404 đối với những người xử lý trong hợp đồng đó trừ người tạo
         if(this.isDataContract.status == 32) {
          const callApiBpmn = await this.contractService
          .viewFlowContract(this.idContract)
          .toPromise();

          if(!this.mobile) {
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

        if (rs[0] && rs[1] && rs[1].length && rs[2] && rs[2].length) {
          this.valid = true;
        }
        this.data_contract = {
          is_data_contract: rs[0],
          i_data_file_contract: rs[1],
          is_data_object_signature: rs[2],
        };

        this.datas = this.data_contract;

        if(this.datas.is_data_contract.originalContractId)
        this.contractService.getDataCoordination(this.datas.is_data_contract.originalContractId).subscribe((item) =>{
          this.datas.is_data_contract.original_contract_name =  item.name;
        })

        if(this.datas.is_data_contract.liquidationContractId)
        this.contractService.getDataCoordination(this.datas.is_data_contract.liquidationContractId).subscribe((item) =>{
          this.datas.is_data_contract.liquidation_contract_name =  item.name;
        })

        let email = JSON.parse(localStorage.getItem('currentUser') || '')
          ?.customer.info.email;


        rs[0].participants.forEach((part: any) => {
          part.recipients.forEach((rec: any) => {

            if (rec.email == email && rec.status == 4) {
              this.forward = true;
              return;
            }
          });
        });

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

        

        this.allFileAttachment = this.datas.i_data_file_contract.filter(
          (f: any) => f.type == 3
        );
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
            element['text_type'] = 'currency'
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
        // let data_sign_config_so_tai_lieu = this.datas.determine_contract.filter((p: any) => p.sign_unit == 'so_tai_lieu');

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
            // Array.prototype.push.apply(element.sign_config, data_sign_config_so_tai_lieu);
          }
        });
        if (this.datas?.is_data_contract?.type_id) {
          this.contractService
            .getContractTypes(this.datas?.is_data_contract?.type_id)
            .subscribe((data) => {
              if (this.datas?.is_data_contract) {
                this.datas.is_data_contract.type_name = data;
              }
            });
        }

        this.datas.action_title = 'Xác nhận';
        //neu nguoi truy cap khong o trong luong ky
        if (!this.recipient?.role) {
          this.role = '';
          this.status = this.datas.is_data_contract.status;
        } else {
          this.role = this.recipient.role;
          this.status = this.recipient.status;
          this.datas.roleContractReceived = this.recipient.role;
        }

        this.scale = 1;

        if (!this.signCurent) {
          this.signCurent = {
            offsetWidth: 0,
            offsetHeight: 0,
          };
        }

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
          if (!fileC) {
            this.toastService.showErrorHTMLWithTimeout(
              'Thiếu dữ liệu file hợp đồng!',
              '',
              3000
            );
          } else {
            this.pdfSrc = fileC;
            this.pdfSrcMobile =
              'https://docs.google.com/viewerng/viewer?url=' +
              this.pdfSrc +
              '&embedded=true';
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.pdfSrcMobile
            );
          }
        }
        // render pdf to canvas

        if (!this.mobile) {
          this.getPage();
        }

        this.loaded = true;
      },
      (res: any) => {
        // @ts-ignore
        this.handleError();
      }
    );
  }

  downloadPDF(url: string): Observable<Blob> {
    const options = { responseType: 'blob' as 'json' };
    return this.httpClient
      .get<Blob>(url, options)
      .pipe(map((res) => new Blob([res], { type: 'application/pdf' })));
  }

  reLoadData() {
    this.contractService.getDetailContract(this.idContract).subscribe(
      (rs) => {
        this.datas['is_data_contract'] = rs[0];
      },
      (res: any) => {
        // @ts-ignore
        this.handleError();
      }
    );
  }

  openPdf(path: any, event: any) {
    this.contractService.openPdf(path, event);
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
          // canvas.style.paddingLeft = '15px';
          // canvas.style.border = '9px solid transparent';
          // canvas.style.borderImage = 'url(assets/img/shadow.png) 9 9 repeat';
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

  eventMouseover() {}

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
          // if (element['position']) { // @ts-ignore
          if (element['coordinate_x'] && element['coordinate_y']) {
            // @ts-ignore
            a.style['z-index'] = '1';
          }
          // else
          //   a.style.display = 'none';
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

  // hàm render các page pdf, file content, set kích thước width & height canvas
  renderPage(pageNumber: any, canvas: any) {
    //This gives us the page's dimensions at full scale
    //@ts-ignore
    this.thePDF.getPage(pageNumber).then((page) => {
      // let viewport = page.getViewport(this.scale);
      let viewport = page.getViewport({ scale: this.scale });

      console.log("rotate ",viewport.rotation);
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
    if (document.getElementsByClassName('viewer-pdf')[0]) {
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
  }

  // hàm set kích thước cho đối tượng khi được kéo thả vào trong hợp đồng
  changePosition(d?: any, e?: any, sizeChange?: any, backgroundColor?: string) {
    let style: any = {
      transform:
        'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      position: 'absolute',
      backgroundColor: '#EBF8FF',
    };
    style.backgroundColor = d.value ? '' : '#EBF8FF';
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
    if (window.innerHeight < 670) {
      return {
        overflow: 'auto',
        height: 'calc(50vh - 113px)',
      };
    } else return {};
  }

  // hàm stype đối tượng boder kéo thả
  changeColorDrag(role: any, valueSign: any, isDaKeo?: any) {
    if (isDaKeo && !valueSign.value) {
      return 'ck-da-keo';
    } else if (!valueSign.value) {
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
      // set lại id cho đối tượng ký đã click
      this.objSignInfo.id = set_id.id;
      // this.objSignInfo.offsetWidth = set_id.offsetWidth;
      // this.objSignInfo.offsetHeight = set_id.offsetWidth;
      signElement = document.getElementById(this.objSignInfo.id);
    } else signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter(
        (p: any) => p.id == this.objSignInfo.id
      )[0];
      // let is_name_signature = this.list_sign_name.filter((item: any) => item.name == this.objSignInfo.name)[0];
      if (isObjSign) {
        this.objSignInfo.traf_x = d.coordinate_x;
        this.objSignInfo.traf_y = d.coordinate_y;
        // this.signCurent.name = d.name;

        this.objSignInfo.offsetWidth = parseInt(d.offsetWidth);
        this.objSignInfo.offsetHeight = parseInt(d.offsetHeight);
        // this.signCurent.offsetWidth = d.offsetWidth;
        // this.signCurent.offsetHeight = d.offsetHeight;
        // 

        this.isEnableText = d.sign_unit == 'text';
        this.isChangeText = d.sign_unit == 'so_tai_lieu';
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name;
        }
      }
      if (d.name) {
        this.list_sign_name.forEach((item: any) => {
          // if (item.id == d.id) {
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
      return this.datas.is_data_object_signature;
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
      
      // this.reLoadData();
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
    interact('.pdf-viewer-step-3').unset();
    interact('.drop-zone').unset();
    interact('.resize-drag').unset();
    interact('.not-out-drop').unset();
    interact.removeDocument(document);
  }

  // edit location doi tuong ky
  changePositionSign(e: any, locationChange: any, property: any) {
    // 
    let signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter(
        (p: any) => p.id == this.objSignInfo.id
      )[0];
      if (isObjSign) {
        if (property == 'location') {
          if (locationChange == 'x') {
            isObjSign.coordinate_x = parseInt(e);
            signElement.setAttribute('data-x', isObjSign.coordinate_x);
          } else {
            isObjSign.coordinate_y = parseInt(e);
            signElement.setAttribute('data-y', isObjSign.coordinate_y);
          }
        } else if (property == 'size') {
          if (locationChange == 'width') {
            isObjSign.width = parseInt(e);
            signElement.setAttribute('width', isObjSign.width);
          } else {
            isObjSign.height = parseInt(e);
            signElement.setAttribute('height', isObjSign.height);
          }
        } else if (property == 'text') {
          isObjSign.text_attribute_name = e;
          signElement.setAttribute(
            'text_attribute_name',
            isObjSign.text_attribute_name
          );
        } else {
          let data_name = this.list_sign_name.filter(
            (p: any) => p.id == e.target.value
          )[0];
          if (data_name) {
            isObjSign.name = data_name.name;
            signElement.setAttribute('name', isObjSign.name);

            isObjSign.signature_party = data_name.sign_unit;
            signElement.setAttribute(
              'signature_party',
              isObjSign.signature_party
            );
          }
        }
        // 
        // 
      }
    }
  }

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

  submitEvents(e: any) {
    if (
      e &&
      e == 1 &&
      !this.validateSignature() &&
      !(
        (this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
        (this.datas.roleContractReceived == 3 && this.confirmSignature == 2)
      )
    ) {
      this.toastService.showErrorHTMLWithTimeout(
        'Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc',
        '',
        3000
      );
      return;
    }
    if (
      e &&
      e == 1 &&
      !(
        (this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
        (this.datas.roleContractReceived == 3 && this.confirmSignature == 2)
      )
    ) {
      Swal.fire({
        title: this.getTextAlertConfirm(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          if ([2, 3].includes(this.datas.roleContractReceived)) {
            this.signContractSubmit();
          }
        }
      });
    } else if (
      e &&
      e == 1 &&
      ((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
        ([3, 4].includes(this.datas.roleContractReceived) &&
          this.confirmSignature == 2))
    ) {
      this.rejectContract();
    }
    if (e && e == 2) {
      this.downloadContract(this.idContract);
    }
  }

  endContract() {
    this.actionBack();
  }

  actionBack() {
    if (this.pageBefore && this.isOrg) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/main/contract/create/' + this.statusLink], {
          queryParams: {
            page: this.pageBefore,
            filter_type: this.filter_type,
            filter_contract_no: this.filter_contract_no,
            filter_from_date: this.filter_from_date,
            filter_to_date: this.filter_to_date,
            isOrg: this.isOrg,
            organization_id: this.organization_id,
            status: this.statusLink,
            filter_name:this.filter_name
          },
          skipLocationChange: true,
        });
      });
    } else if(this.pageBefore) {
       //Ket thuc hop dong nhan
       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/main/c/receive/' + this.statusLink], {
          queryParams: {
            page: this.pageBefore,
            filter_type: this.filter_type,
            filter_contract_no: this.filter_contract_no,
            filter_from_date: this.filter_from_date,
            filter_to_date: this.filter_to_date,
            isOrg: this.isOrg,
            organization_id: this.organization_id,
            status: this.statusLink,
            filter_name:this.filter_name
          },
          skipLocationChange: true,
        });
      });
    } else if (this.router.url.includes('forward') || this.signBefore) {
      this.router.navigate(['/main/c/receive/wait-processing']);
    } else {
      if (this.router.url.includes('reject')) {
        this.router.navigate(['/main/c/receive/wait-processing']);
      } else {
        if (this.isOrg) {
          this._location.back();
        } else {
          this.router.navigate(['/login']);
          this.contractService.deleteToken().subscribe();
        }
      }
    }
  }

  mobile: boolean = false;
  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  confirmOtpSignContract() {
    const data = {
      title: 'Xác nhận otp',
      is_content: 'forward_contract',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
  }

  openPopupSignContract(typeSign: any) {
    if (typeSign == 1) {
      this.imageDialogSignOpen();
    } else if (typeSign == 3) {
      this.pkiDialogSignOpen();
    } else if (typeSign == 4) {
      this.hsmDialogSignOpen();
    }
  }

  imageDialogSignOpen() {
    const data = {
      title: 'KÝ HỢP ĐỒNG ',
      is_content: 'forward_contract',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   
    //   let is_data = result
    // })
  }

  pkiDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ PKI',
      is_content: 'forward_contract',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(PkiDialogSignComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   
    //   let is_data = result
    // })
  }

  hsmDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ HSM',
      is_content: 'forward_contract',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
  }

  getTextAlertConfirm() {
    if (this.datas.roleContractReceived == 2) {
      if (this.confirmConsider == 1) {
        return 'Bạn có chắc chắn xác nhận hợp đồng này?';
      } else if (this.confirmConsider == 2) {
        return 'Bạn có chắc chắn từ chối hợp đồng này?';
      }
    } else if (this.datas.roleContractReceived == 3) {
      if (this.confirmSignature == 1) {
        return 'Bạn có đồng ý với nội dung của hợp đồng và xác nhận ký?';
      } else if (this.confirmSignature == 2) {
        return 'Bạn không đồng ý với nội dung của hợp đồng và không xác nhận ký?';
      }
    }
  }

  getNameCoordination() {
    let nameFile = [];
    for (
      let i = 0;
      i < this.datas.contract_information.file_related_contract;
      i++
    ) {}
  }

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

  signContractSubmit() {
    for (const signUpdate of this.isDataObjectSignature) {
      if (
        signUpdate &&
        signUpdate.type == 2 &&
        this.datas.roleContractReceived == 3 &&
        signUpdate?.recipient?.email === this.currentUser.email &&
        signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {
        const formData = {
          name: 'image.jpg',
          content: signUpdate.value,
        };
        this.contractService.uploadFileImageBase64Signature(formData).subscribe(
          (data) => {
            this.datas.filePath = data?.fileObject?.filePath;

            if (this.datas.filePath) {
              signUpdate.value = this.datas.filePath;
            }
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
    }
    setTimeout(() => {
      this.signContract();
    }, 2000);
  }

  signContract() {
    const signUpdate = this.isDataObjectSignature
      .filter(
        (item: any) =>
          item?.recipient?.email === this.currentUser.email &&
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
    this.contractService
      .updateInfoContractConsider(signUpdate, this.recipientId)
      .subscribe(
        (result) => {
          this.toastService.showSuccessHTMLWithTimeout(
            this.datas?.roleContractReceived == 3
              ? 'Ký hợp đồng thành công'
              : 'Xem xét hợp đồng thành công',
            '',
            1000
          );
          this.router.navigate(['/main/contract-signature/receive/processed']);
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

  async rejectContract() {
    let inputValue = '';
    const { value: textRefuse } = await Swal.fire({
      title:
        'Bạn có chắc chắn hủy hợp đồng này không? Vui lòng nhập lý do hủy:',
      input: 'text',
      inputValue: inputValue,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#b0bec5',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Bạn cần nhập lý do hủy hợp đồng!';
        } else {
          return null;
        }
      },
    });

    if (textRefuse) {
      this.contractService
        .considerRejectContract(this.recipientId, textRefuse)
        .subscribe(
          (result) => {
            this.toastService.showSuccessHTMLWithTimeout(
              'Hủy hợp đồng thành công',
              '',
              3000
            );
            this.router.navigate([
              '/main/contract-signature/receive/processed',
            ]);
          },
          (error) => {
            this.toastService.showErrorHTMLWithTimeout(
              'Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý',
              '',
              3000
            );
          }
        );
    } else {
      // this.toastService.showWarningHTMLWithTimeout('Bạn cần nhập lý do hủy hợp đồng', '', 3000)
    }
  }

  validateSignature() {
    const validSign = this.isDataObjectSignature.filter(
      (item: any) =>
        item?.recipient?.email === this.currentUser.email &&
        item?.recipient?.role === this.datas?.roleContractReceived &&
        item.required &&
        !item.value &&
        item.type != 3
    );
    return validSign.length == 0;
  }

  t() {
    
  }

  downloadContract(id: any) {
    if (this.isDataContract.status == 30) {
      this.contractService.getFileZipContract(id).subscribe((data) => {
          
          this.uploadService
            .downloadFile(data.path)
            .subscribe((response: any) => {
              //

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
  }

  checkIsViewContract() {
    if (this.consider) {
      if (this.datas?.is_data_contract?.participants?.length) {
        for (const participant of this.datas.is_data_contract.participants) {
          for (const recipient of participant.recipients) {
            if (this.recipientId == recipient.id) {
              this.recipient = recipient;
              return;
            }
          }
        }
      }
    } else {
      let recipients: any[] = [];
      if (this.datas?.is_data_contract?.participants?.length) {
        for (const participant of this.datas.is_data_contract.participants) {
          for (const recipient of participant.recipients) {
            if (this.currentUser.email == recipient.email) {
              recipients.push(recipient);
            }
          }
        }
      }

      if (recipients.length == 2) {
        // for (const participant of this.datas.is_data_contract.participants) {
        //   for (const recipient of participant.recipients) {
        //     if (
        //       this.currentUser.email == recipient.email &&
        //       recipient.role != 1
        //     ) {
        //       this.recipient = recipient;
        //       return;
        //     }
        //   }
        // }
        this.recipient = recipients[recipients.length - 1];
      } else if (recipients.length == 1) {
        for (const participant of this.datas.is_data_contract.participants) {
          for (const recipient of participant.recipients) {
            if (this.currentUser.email == recipient.email) {
              this.recipient = recipient;
              return;
            }
          }
        }
      }
    }
  }

  checkStatusUser(status: any, role: any) {
    if (this.isDataContract.status == 30 && status != 4) {
      return this.translate.instant('download');
    } else if (this.isDataContract.status == 32) {
      return this.translate.instant('canceled');
    } else if (this.isDataContract.status == 31) {
      return this.translate.instant('refused');
    } else if (this.isDataContract.release_state == 'HET_HIEU_LUC') {
      return this.translate.instant('overdued');
    }

    if (status == 3) {
      return 'Đã từ chối';
    } else if (status == 4) {
      return 'Đã uỷ quyền/chuyển tiếp';
    }

    let res = '';
    if (status == 0) {
      res += 'Chưa ';
    } else if (status == 1) {
      res += 'Đang ';
    } else if (status == 2 || status == 3) {
      res += 'Đã ';
    }
    if (role == 1) {
      res += 'điều phối';
    } else if (role == 2) {
      res += 'xem xét';
    } else if (role == 3) {
      res += 'ký';
    } else if (role == 4) {
      res = res + ' đóng dấu';
    }
    return res;
  }

  pageNum: number = 1;
  page1: boolean = false;
  pageLast: boolean = true;

  pageRendering: any;
  pageNumPending: any = null;
  firstPage() {
    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, 0);

    this.pageNum = 1;
  }

  lastPage() {
    let canvas: any = document.getElementById(
      'canvas-step3-' + this.pageNumber
    );

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(
      0,
      canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top
    );

    this.pageNum = this.pageNumber;
  }

  onNextPage() {
    if (this.pageNum >= this.thePDF?.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  previousPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  queueRenderPage(num: any) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      let canvas: any = document.getElementById('canvas-step3-' + num);

      let canvas1: any = document.getElementById('pdf-viewer-step-3');

      let pdffull: any = document.getElementById('pdf-full');

      pdffull.scrollTo(
        0,
        canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top
      );
    }
  }

  onEnter(event: any) {
    let canvas: any = document.getElementById(
      'canvas-step3-' + event.target.value
    );

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(
      0,
      canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top
    );
  }

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

  openDetailLiquidatedContract(data: any){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/form-contract/detail/' + data.liquidationContractId],
      {
        queryParams: {
          'page': 1,
          'filter_type': '', 
          'filter_contract_no':'',
          'filter_from_date': '',
          'filter_to_date': '',
          'isOrg': 'off',
          'organization_id': '',
          'status': 'liquidated'
        },
        skipLocationChange: false
      });
    });
  }
}
