import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SecurityContext,
  ViewChild
} from '@angular/core';
import { ContractService } from "../../../../service/contract.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as $ from "jquery";
import {
  ProcessingHandleEcontractComponent
} from "../../shared/model/processing-handle-econtract/processing-handle-econtract.component";
import interact from "interactjs";
import { variable } from "../../../../config/variable";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2'
import { AppService } from "../../../../service/app.service";
import { ConfirmSignOtpComponent } from "./confirm-sign-otp/confirm-sign-otp.component";
import { ImageDialogSignComponent } from "./image-dialog-sign/image-dialog-sign.component";
import { PkiDialogSignComponent } from "./pki-dialog-sign/pki-dialog-sign.component";
import { HsmDialogSignComponent } from "./hsm-dialog-sign/hsm-dialog-sign.component";
import { forkJoin, from, throwError, timer } from "rxjs";
import { ToastService } from "../../../../service/toast.service";
import { UploadService } from "../../../../service/upload.service";
import { NgxSpinnerService } from "ngx-spinner";
import { encode } from "base64-arraybuffer";
import { UserService } from "../../../../service/user.service";
// @ts-ignore
import domtoimage from 'dom-to-image';
import { concatMap, delay, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { networkList, chu_ky_anh, chu_ky_so } from "../../../../config/variable";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {DeviceDetectorService} from "ngx-device-detector";
import { DomSanitizer } from '@angular/platform-browser';
import { EkycDialogSignComponent } from './ekyc-dialog-sign/ekyc-dialog-sign.component';

@Component({
  selector: 'app-consider-contract',
  templateUrl: './consider-contract.component.html',
  styleUrls: ['./consider-contract.component.scss']
})
export class ConsiderContractComponent implements OnInit, OnDestroy, AfterViewInit {
  datas: any;
  data_contract: any;
  data_coordinates: any;
  @Input() step: any;
  @ViewChild('itemElement') itemElement: QueryList<ElementRef> | undefined
  @Output() stepChangeSampleContract = new EventEmitter<string>();
  pdfSrc: any;
  thePDF = null;
  pageNumber = 1;
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

  currPage = 1; //Pages are 1-based not 0-based
  numPages = 0;
  x0: any = "abc";
  y0: any = "bcd";
  listEmail: any = [];
  coordinates_signature: any;
  obj_toa_do = {
    x1: 0, y1: 0, x2: 0, y2: 0
  }
  text = 'Chữ ký';
  mouseoverLeftLayer = {
    layerX: 0,
    layerY: 0,
  }
  isMove = false;

  objSignInfo: any = {
    id: "",
    showObjSign: false,
    nameObj: "",
    emailObj: "",
    traf_x: 0,
    traf_y: 0,
    x1: 0,
    y1: 0,
    offsetHeight: 0,
    offsetWidth: 0
  }

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

  isPartySignature: any = [
    { id: 1, name: 'Công ty cổ phần công nghệ tin học EFY Việt Nam' },
    { id: 2, name: 'Công ty newEZ Việt Nam' },
    { id: 3, name: 'Tập đoàn Bảo Việt' }
  ];

  optionsSign: any = [
    { item_id: 1, item_text: 'Ký ảnh' },
    { item_id: 2, item_text: 'Ký số bằng USB token' },
    { item_id: 3, item_text: 'Ký số bằng sim PKI' },
    { item_id: 4, item_text: 'Ký số bằng HSM' }
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
  heightText: any = 200;
  widthText: any = 200;
  loadingText: string = 'Đang xử lý...';
  phoneOtp:any;
  isDateTime:any;
  userOtp:any;
  dataHsm: any;
  trustedUrl: any;
  idPdfSrcMobile: any;

  sessionIdUsbToken: any;

  domain: any = `https://127.0.0.1:14424/`;

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
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  pdfSrcMobile: any;

  ngOnInit(): void {
    
    this.getDeviceApp();

    console.log("vao consider contract ");

    this.appService.setTitle('THÔNG TIN HỢP ĐỒNG');

    this.idContract = this.activeRoute.snapshot.paramMap.get('id');

    // this.getFilePdfForMobile();

    this.activeRoute.queryParams.subscribe(params => {
      this.recipientId = params.recipientId;

      //kiem tra xem co bi khoa hay khong
      this.contractService.getStatusSignImageOtp(this.recipientId).subscribe(
        data => {
          if(!data.locked){
            this.getDataContractSignature();
          }else{
            this.toastService.showErrorHTMLWithTimeout('Bạn đã nhập sai OTP 5 lần liên tiếp.<br>Quay lại sau ' + this.datepipe.transform(data.nextAttempt, "dd/MM/yyyy HH:mm"), "", 3000);
            this.router.navigate(['/main/form-contract/detail/' + this.idContract]);
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi', "", 3000);
        }
      )
    });
  }



  timerId: any;
  getDataContractSignature() {

    this.contractService.getDetailContract(this.idContract).subscribe(async rs => {
      console.log(rs);
      this.isDataContract = rs[0];
      this.isDataFileContract = rs[1];
      this.isDataObjectSignature = rs[2];
      if (rs[0] && rs[1] && rs[1].length && rs[2] && rs[2].length) {
        this.valid = true;
      }
      this.data_contract = {
        is_data_contract: rs[0],
        i_data_file_contract: rs[1],
        is_data_object_signature: rs[2]
      };
      /*let data_coordination = localStorage.getItem('data_coordinates_contract');
      if (data_coordination) {
        this.datas = JSON.parse(data_coordination).data_coordinates;
        this.datas = Object.assign(this.datas, this.data_contract);
      }*/
      this.datas = this.data_contract;
      if (this.datas?.is_data_contract?.type_id) {
        this.contractService.getContractTypes(this.datas?.is_data_contract?.type_id).subscribe(data => {
          if (this.datas?.is_data_contract) {
            this.datas.is_data_contract.type_name = data;
          }
        })
      }

      console.log("status ",this.data_contract?.is_data_contract?.status);

      if (this.data_contract?.is_data_contract?.status == 31 || this.data_contract?.is_data_contract?.status == 30) {
        this.router.navigate(['/main/form-contract/detail/' + this.idContract]);
      }
      this.allFileAttachment = this.datas.i_data_file_contract.filter((f: any) => f.type == 3);
      this.allRelateToContract = this.datas.is_data_contract.refs;
      from(this.datas.is_data_contract.refs).pipe(
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
      ).subscribe();
      this.checkIsViewContract();

      this.datas.is_data_object_signature.forEach((element: any) => {
        // 1: van ban, 2: ky anh, 3: ky so
        // tam thoi de 1: ky anh, 2: ky so
        if (element.type == 1) {
          element['sign_unit'] = 'text'
        }
        if (element.type == 2) {
          element['sign_unit'] = 'chu_ky_anh'
        }
        if (element.type == 3) {
          element['sign_unit'] = 'chu_ky_so'
        }
        if (element.type == 4) {
          element['sign_unit'] = 'so_tai_lieu'
        }

        if (element.recipient) { // set name (nguoi dc uy quyen hoac chuyen tiep)
          element.name = element.recipient.name;
        }

      })

      let data_sign_config_cks = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_so');
      let data_sign_config_cka = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_anh');
      let data_sign_config_text = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'text');
      let data_sign_config_so_tai_lieu = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'so_tai_lieu');

      this.datas.contract_user_sign = this.contractService.getDataFormatContractUserSign();

      this.datas.contract_user_sign.forEach((element: any) => {
        // console.log(element.sign_unit, element.sign_config);
        if (element.sign_unit == 'chu_ky_so') {
          Array.prototype.push.apply(element.sign_config, data_sign_config_cks);
        } else if (element.sign_unit == 'chu_ky_anh') {
          Array.prototype.push.apply(element.sign_config, data_sign_config_cka);
        } else if (element.sign_unit == 'text') {
          Array.prototype.push.apply(element.sign_config, data_sign_config_text);
        } else if (element.sign_unit == 'so_tai_lieu') {
          Array.prototype.push.apply(element.sign_config, data_sign_config_so_tai_lieu);
        }
      })
      // }

      // this.datas = this.datas.concat(this.data_contract.contract_information);

      this.datas.action_title = 'Xác nhận';
      this.datas.roleContractReceived = this.recipient.role;


      this.scale = 1;

      if (!this.signCurent) {
        this.signCurent = {
          offsetWidth: 0,
          offsetHeight: 0
        }
      }
      this.fetchDataUserSimPki();

      this.userService.getSignatureUserById(this.currentUser.id).subscribe((res) => {
        if (res) {
          this.datas.imgSignAcc = res;
        }
      })

      // convert base64 file pdf to url
      if (this.datas?.i_data_file_contract) {
        let fileC = null;
        const pdfC2 = this.datas.i_data_file_contract.find((p: any) => p.type == 2);
        const pdfC1 = this.datas.i_data_file_contract.find((p: any) => p.type == 1);
        if (pdfC2) {
          fileC = pdfC2.path;
        } else if (pdfC1) {
          fileC = pdfC1.path;
        } else {
          return;
        }
        this.pdfSrc = fileC;

        let image_base64 = "";

        let arr = this.convertToSignConfig();
        
        if(this.mobile) {
          if(arr[0])
            if(arr[0].recipient.sign_type[0].id == 5 || arr[0].recipient.sign_type[0].id == 1) {
              image_base64 = chu_ky_anh;
            } else {
              image_base64 = chu_ky_so;
            }
        }

        console.log("image_base64 ",image_base64); 

        if(this.mobile && this.recipient.status != 2 && this.recipient.status != 3) {
          if(image_base64)
            this.contractService.getFilePdfForMobile(this.recipientId, image_base64).subscribe((response) => {
              
            this.pdfSrcMobile = response.filePath;
            
            })
          else
            this.pdfSrcMobile = this.pdfSrc;
        } else {
          if(this.mobile) {
            setTimeout(() => {
              this.router.navigate(['/main/form-contract/detail/' + this.idContract]);
            }, 1000)
          }           

        }
      }
      // render pdf to canvas
      if(!this.mobile)
        this.getPage();
      this.loaded = true;
    }, (res: any) => {
      // @ts-ignore
      this.handleError();
    })
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
      this.list_sign_name.push(item)
    })
  }

  setWidth(d: any) {
    return {
      'width.px': (this.widthDrag / 2)
    }
  }

  // view pdf qua canvas
  async getPage() {
    // @ts-ignore
    const pdfjs = await import('pdfjs-dist/build/pdf');
    // @ts-ignore
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    pdfjs.getDocument(this.pdfSrc).promise.then((pdf: any) => {
      this.thePDF = pdf;
      this.pageNumber = (pdf.numPages || pdf.pdfInfo.numPages)
      this.removePage();
      this.arrPage = [];
      for (let page = 1; page <= this.pageNumber; page++) {
        let canvas = document.createElement("canvas");
        this.arrPage.push({ page: page });
        canvas.className = 'dropzone';
        canvas.id = "canvas-step3-" + page;

        // canvas.style.transform = 'scale(2,2)';

        // canvas.style.paddingLeft = '15px';
        // canvas.style.border = '9px solid transparent';
        // canvas.style.borderImage = 'url(assets/img/shadow.png) 9 9 repeat';
        let idPdf = 'pdf-viewer-step-3'
        let viewer = document.getElementById(idPdf);
        if (viewer) {
          viewer.appendChild(canvas);
        }

        // console.log("page before render ", page);
        this.renderPage(page, canvas);
      }
    }).then(() => {
      setTimeout(() => {
        this.setPosition();
        this.eventMouseover();
        this.loadedPdfView = true;
      }, 100)
    })
  }

  eventMouseover() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // @ts-ignore
      // document.getElementById('input-location-x').focus();
      let width_drag_element = document.getElementById('width-element-info');
      this.widthDrag = width_drag_element ? ((width_drag_element.getBoundingClientRect().right - width_drag_element.getBoundingClientRect().left) - 15) : '';

      const imageRender = <HTMLElement>document.getElementById('export-html');
      if (imageRender) {
        domtoimage.toPng(imageRender).then((res: any) => {
          this.base64GenCompany = res.split(",")[1];
        })
      }
    }, 100)
    this.setPosition();
    this.eventMouseover();
  }

  // set lại vị trí đối tượng kéo thả đã lưu trước đó
  setPosition() {
    console.log("this convert to sign config ", this.convertToSignConfig())
    if (this.convertToSignConfig().length > 0) {
      this.convertToSignConfig().forEach((element: any) => {
        let a = document.getElementById(element.id);
        if (a) {
          // if (element['position']) { // @ts-ignore
          if (element['coordinate_x'] && element['coordinate_y']) { // @ts-ignore
            a.style["z-index"] = '1';
          }
          // else
          //   a.style.display = 'none';
          a.setAttribute("data-x", element['coordinate_x']);
          a.setAttribute("data-y", element['coordinate_y']);
        }
      });
    }
  }

  removePage() {
    for (let page = 1; page <= this.pageNumber; page++) {
      let idCanvas = "canvas-step3-" + page;
      let viewCanvas = document.getElementById(idCanvas);
      if (viewCanvas) {
        viewCanvas.remove();
      }
    }
  }

  // hàm render các page pdf, file content, set kích thước width & height canvas
  renderPage(pageNumber: any, canvas: any) {

    console.log("page render 2 ", pageNumber);

    setTimeout(() => {
      // this.setPosition();
      // this.eventMouseover();
      // this.loadedPdfView = true;

       //This gives us the page's dimensions at full scale
    //@ts-ignore
    this.thePDF.getPage(pageNumber).then((page) => {
      // let viewport = page.getViewport(this.scale);
      let viewport = page.getViewport({ scale: this.scale });
      let test = document.querySelector('.viewer-pdf');

      this.canvasWidth = viewport.width;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // if(this.first < this.pageNumber)
        this.prepareInfoSignUsbToken(pageNumber, canvas.height);
      let _objPage = this.objPdfProperties.pages.filter((p: any) => p.page_number == pageNumber)[0];
      if (!_objPage) {
        this.objPdfProperties.pages.push({
          page_number: pageNumber,
          width: parseInt(viewport.width),
          height: viewport.height,
        });
      }
      page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
      if (test) {
        let paddingPdf = ((test.getBoundingClientRect().width) - viewport.width) / 2;
        $('.viewer-pdf').css('padding-left', paddingPdf + 'px');
        $('.viewer-pdf').css('padding-right', paddingPdf + 'px');
      }
      this.activeScroll();
    });
    }, 100)
  }

  activeScroll() {
    document.getElementsByClassName('viewer-pdf')[0].addEventListener('scroll', () => {
      const Imgs = [].slice.call(document.querySelectorAll('.dropzone'));
      Imgs.forEach((item: any) => {
        if (item.getBoundingClientRect().top <= (window.innerHeight / 2) &&
          (item.getBoundingClientRect().bottom >= 0) &&
          (item.getBoundingClientRect().top >= 0) ||
          (item.getBoundingClientRect().bottom >= (window.innerHeight / 2)) &&
          (item.getBoundingClientRect().bottom <= window.innerHeight) &&
          (item.getBoundingClientRect().top <= 0)) {
          let page = item.id.split("-")[2];
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
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#EBF8FF'
    }
    style.backgroundColor = d.valueSign ? '' : '#EBF8FF';
    style.display = ((this.confirmConsider && this.confirmConsider == 1) || (this.confirmSignature && this.confirmSignature == 1)) ? '' : 'none';
    if (d['width']) {
      style.width = parseInt(d['width']) + "px";
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + "px";
    }

    return style;
  }

  // Hàm thay đổi kích thước màn hình => scroll thuộc tính hiển thị kích thước và thuộc tính
  // @ts-ignore
  changeDisplay() {
    if (window.innerHeight < 670 && window.innerHeight > 634) {
      return {
        "overflow": "auto",
        "height": "calc(50vh - 113px)"
      }
    } else if (window.innerHeight <= 634) {
      return {
        "overflow": "auto",
        "height": "calc(50vh - 170px)"
      }
    } else return {}
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
      // set lại id cho đối tượng ký đã click
      this.objSignInfo.id = set_id.id;
      // this.objSignInfo.offsetWidth = set_id.offsetWidth;
      // this.objSignInfo.offsetHeight = set_id.offsetWidth;
      signElement = document.getElementById(this.objSignInfo.id);
    } else
      signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
      // let is_name_signature = this.list_sign_name.filter((item: any) => item.name == this.objSignInfo.name)[0];
      if (isObjSign) {
        this.objSignInfo.traf_x = d.coordinate_x;
        this.objSignInfo.traf_y = d.coordinate_y;
        // this.signCurent.name = d.name;

        this.objSignInfo.offsetWidth = parseInt(d.offsetWidth);
        this.objSignInfo.offsetHeight = parseInt(d.offsetHeight);
        // this.signCurent.offsetWidth = d.offsetWidth;
        // this.signCurent.offsetHeight = d.offsetHeight;
        // console.log(this.signCurent)

        this.isEnableText = d.sign_unit == 'text';

        this.isChangeText = d.sign_unit == 'so_tai_lieu';
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name
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
        })
      } else {
        //@ts-ignore
        document.getElementById('select-dropdown').value = "";
      }
    }
  }

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    if (this.datas && this.isDataObjectSignature && this.isDataObjectSignature.length) {

        return this.datas.is_data_object_signature.filter(
          (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived);

    } else {
      return [];
    }
  }

  processHandleContract() {
    // alert('Luồng xử lý hợp đồng!');
    const data = this.datas;
    // @ts-ignore
    const dialogRef = this.dialog.open(ProcessingHandleEcontractComponent, {
      width: '800px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
      let is_data = result
    })

  }

  showThumbnail() {
    this.objSignInfo.showObjSign = false;
  }

  // tạo id cho đối tượng chưa được kéo thả
  getIdSignChuaKeo(id: any) {
    return "chua-keo-" + id;
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

  // edit location doi tuong ky
  changePositionSign(e: any, locationChange: any, property: any) {
    // console.log(e, this.objSignInfo, this.signCurent);
    let signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
      if (isObjSign) {
        if (property == 'location') {
          if (locationChange == 'x') {
            isObjSign.coordinate_x = parseInt(e);
            signElement.setAttribute("data-x", isObjSign.coordinate_x);
          } else {
            isObjSign.coordinate_y = parseInt(e);
            signElement.setAttribute("data-y", isObjSign.coordinate_y);
          }
        } else if (property == 'size') {
          if (locationChange == 'width') {
            isObjSign.width = parseInt(e);
            signElement.setAttribute("width", isObjSign.width);
          } else {
            isObjSign.height = parseInt(e);
            signElement.setAttribute("height", isObjSign.height);
          }
        } else if (property == 'text') {
          isObjSign.text_attribute_name = e;
          signElement.setAttribute("text_attribute_name", isObjSign.text_attribute_name);
        } else {
          let data_name = this.list_sign_name.filter((p: any) => p.id == e.target.value)[0];
          if (data_name) {
            isObjSign.name = data_name.name;
            signElement.setAttribute("name", isObjSign.name);

            isObjSign.signature_party = data_name.sign_unit;
            signElement.setAttribute("signature_party", isObjSign.signature_party);
          }
        }
        // console.log(this.signCurent)
        // console.log(this.objSignInfo)
      }
    }
  }

  getTrafX() {
    if (Math.round(this.objSignInfo.traf_x) <= 0) {
      return Math.round(this.objSignInfo.traf_x)
    } else
      return Math.round(this.objSignInfo.traf_x) - 1;
  }

  getTrafY() {
    return Math.round(this.objSignInfo.traf_y)
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
    return (' ' + data.file_name + ',').replace(/,\s*$/, "");
  }

  eKYC: boolean = false;
  async submitEvents(e: any) {
    let haveSignPKI = false;
    let haveSignImage = false;
    let haveSignHsm = false;

    const counteKYC = this.recipient?.sign_type.filter((p: any) => p.id == 5).length;

    console.log("counterKYC ", counteKYC);

    if(counteKYC > 0){
      if(this.confirmSignature == 1) {
        this.eKYC = true;
        this.eKYCSignOpen();
        return;
      }
    }
    if (e && e == 1 && !this.confirmConsider && !this.confirmSignature) {
      this.toastService.showErrorHTMLWithTimeout('Vui lòng chọn đồng ý hoặc từ chối hợp đồng', '', 3000);
      return;
    }
    if (e && e == 1 && !this.validateSignature() && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2) || (this.datas.roleContractReceived == 4 && this.confirmSignature == 2))) {
        if(!this.mobile) {
          this.toastService.showErrorHTMLWithTimeout('Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc', '', 3000);
          return;
        } else {
          if(this.confirmSignature == 2) {
            this.toastService.showErrorHTMLWithTimeout('Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc', '', 3000);
            return;
          } else {
             this.imageDialogSignOpen(e, haveSignImage);
             return;
          }

        }
    } else if (e && e == 1 && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2) || (this.datas.roleContractReceived == 4 && this.confirmSignature == 2))) {
      let typeSignDigital = null;
      let typeSignImage = null;
      if (this.recipient?.sign_type) {
        const typeSD = this.recipient?.sign_type.find((t: any) => t.id != 1);
        const typeSImage = this.recipient?.sign_type.find((t: any) => t.id == 1);
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
          phone: this.signInfoPKIU.phone
        }
      } else if(typeSignDigital && typeSignDigital == 4) {
        haveSignHsm = true;

        this.dataHsm = {
            ma_dvcs: "",
            username: "",
            password: "",
            password2: "",
            imageBase64: ""         
        }
      }

      if (typeSignImage && typeSignImage == 1) {
        haveSignImage = true;
      }

      if (typeSignImage && typeSignImage == 4) {
        haveSignImage = true;
      }
    }
    if (e && e == 1 && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2) || (this.datas.roleContractReceived == 4 && this.confirmSignature == 2))) {
      Swal.fire({
        title: this.getTextAlertConfirm(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Kiểm tra ô ký đã ký chưa (status = 2)
          this.spinner.show();
          let id_recipient_signature:any = null;
          let phone_recipient_signature:any = null;
          // console.log(this.datas);
          for (const d of this.datas.is_data_contract.participants) {
            for (const q of d.recipients) {
              if (q.email == this.currentUser.email && q.status == 1) {
                id_recipient_signature = q.id;
                this.phoneOtp = phone_recipient_signature = q.phone;
                this.userOtp = q.name;
                break
              }
            }
            if (id_recipient_signature) break;
          }

          //neu co id nguoi xu ly thi moi kiem tra
          if (id_recipient_signature) {
            this.contractService.getCheckSignatured(id_recipient_signature).subscribe((res: any) => {
              if (res && res.status == 2) {
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout('contract_signature_success', "", 3000);
              } else {
                if ([2, 3, 4].includes(this.datas.roleContractReceived) && haveSignImage) {
                  this.confirmOtpSignContract(id_recipient_signature, phone_recipient_signature);
                  this.spinner.hide();
                } else if ([2, 3, 4].includes(this.datas.roleContractReceived) && haveSignPKI) {
                  console.log("pki ");
                  this.pkiDialogSignOpen();
                  this.spinner.hide();
                } else if([2, 3, 4].includes(this.datas.roleContractReceived) && haveSignHsm) {
                  this.hsmDialogSignOpen(this.recipientId);
                  this.spinner.hide();
                } else if ([2, 3, 4].includes(this.datas.roleContractReceived)) {
                  this.signContractSubmit();
                }
              }
            }, (error: HttpErrorResponse) => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout('error_check_signature', "", 3000);
            })
          } else {
            if ([2, 3, 4].includes(this.datas.roleContractReceived) && haveSignPKI) {
              this.pkiDialogSignOpen();
              this.spinner.hide();
            } else if([2, 3, 4].includes(this.datas.roleContractReceived) && haveSignHsm) {
              this.hsmDialogSignOpen(this.recipientId);
              this.spinner.hide();
            } else if ([2, 3, 4].includes(this.datas.roleContractReceived)) {
              this.signContractSubmit();
            }
          }


        }
      });
    } else if (e && e == 1 && ((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2) ||
      (this.datas.roleContractReceived == 4 && this.confirmSignature == 2)
    )) {
      await this.rejectContract();
    }
    if (e && e == 2) {
      this.downloadContract(this.idContract);
    }
  }



  openPopupSignContract(typeSign: any) {
    if (typeSign == 1) {
      // this.imageDialogSignOpen();
    } else if (typeSign == 3) {
      // this.pkiDialogSignOpen();
    } else if (typeSign == 4) {
      this.hsmDialogSignOpen(this.recipientId);
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
      } else if (this.confirmSignature == 1 && this.datas.roleContractReceived == 4) {
        return 'Bạn có đồng ý với nội dung của hợp đồng và xác nhận đóng dấu?';
      } else if (this.confirmSignature == 2) {
        return 'Bạn không đồng ý với nội dung của hợp đồng và không xác nhận ký?';
      }
    }
  }

  getNameCoordination() {
    let nameFile = [];
    for (let i = 0; i < this.datas.contract_information.file_related_contract; i++) {

    }
  }

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  typeUsbToken: any = [];
  async signDigitalDocument() {
    let typeSignDigital = 0;

    for (const signUpdate of this.isDataObjectSignature) {
      console.log("sign update ",signUpdate);
      if (signUpdate && (signUpdate.type == 3 || signUpdate.type == 2) && [3, 4].includes(this.datas.roleContractReceived)
        && signUpdate?.recipient?.email === this.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {
        if (signUpdate.recipient?.sign_type) {
          const typeSD = signUpdate.recipient?.sign_type.find((t: any) => t.id != 1);
          if (typeSD) {
            typeSignDigital = typeSD.id;
          }
        }

        break;
      }
    }

    console.log("type sign digital ", typeSignDigital);

    //= 2 => Ky usb token
    if (typeSignDigital == 2) {

      // if (this.signCertDigital && this.signCertDigital.Serial) {
      //   for (const signUpdate of this.isDataObjectSignature) {
      //     if (signUpdate && (signUpdate.type == 3 || signUpdate.type == 1 || signUpdate.type == 4) && [3, 4].includes(this.datas.roleContractReceived)
      //       && signUpdate?.recipient?.email === this.currentUser.email
      //       && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      //     ) {
      //       let fileC = await this.contractService.getFileContractPromise(this.idContract);
      //       const pdfC2 = fileC.find((p: any) => p.type == 2);
      //       const pdfC1 = fileC.find((p: any) => p.type == 1);
      //       if (pdfC2) {
      //         fileC = pdfC2.path;
      //       } else if (pdfC1) {
      //         fileC = pdfC1.path;
      //       } else {
      //         return;
      //       }
      //       let signI = null;
      //       if (signUpdate.type == 1 || signUpdate.type == 4) {
      //         this.textSign = signUpdate.valueSign;
      //         /*this.heightText = signUpdate.width;
      //         this.widthText = signUpdate.height;*/
      //         this.heightText = 150;
      //         this.widthText = 150;
      //         await of(null).pipe(delay(100)).toPromise();
      //         const imageRender = <HTMLElement>document.getElementById('text-sign');

      //         if (imageRender) {
      //           const textSignB = await domtoimage.toPng(imageRender);
      //           signI = this.textSignBase64Gen = textSignB.split(",")[1];
      //         }
      //       } else if (signUpdate.type == 3) {
      //         await of(null).pipe(delay(100)).toPromise();
      //         const imageRender = <HTMLElement>document.getElementById('export-html');
      //         if (imageRender) {
      //           const textSignB = await domtoimage.toPng(imageRender);
      //           signI = textSignB.split(",")[1];
      //         }
      //       }

      //       console.log("signI ", signI);

      //       const signDigital = JSON.parse(JSON.stringify(signUpdate));
      //       signDigital.Serial = this.signCertDigital.Serial;
      //       const base64String = await this.contractService.getDataFileUrlPromise(fileC);
      //       signDigital.valueSignBase64 = encode(base64String);

      //       // const dataSignMobi: any = await this.contractService.postSignDigitalMobi(signDigital, signI);

      //       const dataSignMobi: any = await this.contractService.postSignDigitalMobiMulti( signDigital.Serial ,signDigital.valueSignBase64, signI,signDigital.page.toString(),
      //       signDigital.signDigitalHeight, signDigital.signDigitalWidth, signDigital.signDigitalX, signDigital.signDigitalY);

      //       console.log("data sign mobi ", dataSignMobi);

      //       if (!dataSignMobi.data.FileDataSigned) {
      //         console.log("file data signed ");

      //         this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token', '', 3000);
      //         return false;
      //       }
      //       const sign = await this.contractService.updateDigitalSignatured(signUpdate.id, dataSignMobi.data.FileDataSigned);
      //       if (!sign.recipient_id) {
      //         console.log("recipent_id")

      //         this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token', '', 3000);
      //         return false;
      //       }
      //     }
      //   }
      //   return true;
      // } else {
      //   console.log("not sign cert digital ");
      //   this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token', '', 3000);
      //   return false;
      // }


      console.log("this sign cert digital ", this.signCertDigital);
      if (this.signCertDigital) {
        // this.signCertDigital = resSignDigital.data;
        for (const signUpdate of this.isDataObjectSignature) {
          if (signUpdate && (signUpdate.type == 3 || signUpdate.type == 1 || signUpdate.type == 4) && [3, 4].includes(this.datas.roleContractReceived)
            && signUpdate?.recipient?.email === this.currentUser.email
            && signUpdate?.recipient?.role === this.datas?.roleContractReceived
          ) {
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
            if (signUpdate.type == 1 || signUpdate.type == 4) {
              this.textSign = signUpdate.valueSign;
              /*this.heightText = signUpdate.width;
              this.widthText = signUpdate.height;*/
              this.heightText = 150;
              this.widthText = 150;
              await of(null).pipe(delay(100)).toPromise();
              const imageRender = <HTMLElement>document.getElementById('text-sign');

              console.log("image render ", imageRender);

              if (imageRender) {
                const textSignB = await domtoimage.toJpeg(imageRender);
                signI = this.textSignBase64Gen = textSignB.split(",")[1];
              }
            } else if (signUpdate.type == 3) {
              await of(null).pipe(delay(100)).toPromise();
              const imageRender = <HTMLElement>document.getElementById('export-html');
              if (imageRender) {
                const textSignB = await domtoimage.toJpeg(imageRender);
                signI = textSignB.split(",")[1];
              }
            }

            if(signI != null) {
              const signDigital = JSON.parse(JSON.stringify(signUpdate));
              signDigital.Serial = this.signCertDigital;
              const base64String = await this.contractService.getDataFileUrlPromise(fileC);
              signDigital.valueSignBase64 = encode(base64String);
  
              console.log("sign 4 ", signDigital.valueSignBase64);
  
              var json_req = JSON.stringify({
                OperationId: 10,
                SessionId: this.sessionIdUsbToken,
                checkOCSP: 0,
                reqDigest: 1,
                algDigest: "SHA_1",
                extFile: "pdf",
                invisible: 0,
                pageIndex: Number(signDigital.page - 1),
                offsetX: Math.floor(signDigital.signDigitalX),
                offsetY: Math.floor(signDigital.signDigitalY),
                sigWidth: Math.floor(signDigital.signDigitalWidth),
                sigHeight: Math.floor(signDigital.signDigitalHeight),
                logoData: signI,
                DataToBeSign: signDigital.valueSignBase64,
                showSignerInfo: 0,
                sigId:""
              });
  
              console.log("json_req ",json_req);
  
              json_req = window.btoa(json_req);
  
              var httpReq: any = "";
              var response = "";
              if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                  httpReq = new XMLHttpRequest();
              }
              else {// code for IE6, IE5
                  httpReq = new ActiveXObject("Microsoft.XMLHTTP");
              }
              httpReq.onreadystatechange =  async () => {
                  if (httpReq.readyState == 4 && httpReq.status == 200) {
  
                    console.log("htppreq ",httpReq.responseText);
  
                      response = window.atob(httpReq.responseText);

                      signDigital.valueBase64 = JSON.parse(response).Base64Result;

                      console.log("result ", signDigital.valueBase64);
                      
                      var process = false;
                      try {
                          var json_res = JSON.parse(response);
  
                          console.log("json_res ",json_res)
  
                          if (json_res.ResponseCode == 0) {
                              alert("Successfully. Result: " + json_res.PathFile);
  
                              alert(json_res.Base64Result);
  
                                const sign = await this.contractService.updateDigitalSignatured(signUpdate.id, json_res.Base64Result);
                                  if (!sign.recipient_id) {
                                    console.log("recipent_id")
  
                                    this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token', '', 3000);
                                    return false;
                                  } else {
                                    return true;
                                  }
                          } else {
                            console.log("response ky ", response);
                            console.log("response ky msg ", json_res);
                            alert(json_res.ResponseMsg);
                          }
                      }
                      catch (err) {
                          alert("Error: " + err);
                      }
                  }
              }
              httpReq.open("POST", this.domain + "process", true);
              httpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              httpReq.send("request=" + json_req);
            }
          }
        }

        console.log("type usb token ", this.typeUsbToken);
        return false;
      } else {
        console.log("not sign cert digital ");
        this.toastService.showErrorHTMLWithTimeout('Lỗi ký USB Token', '', 3000);
        return false;
      }
    } else if (typeSignDigital == 3) {
      const objSign = this.isDataObjectSignature.filter((signUpdate: any) => (signUpdate && signUpdate.type == 3 && [3, 4].includes(this.datas.roleContractReceived)
        && signUpdate?.recipient?.email === this.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived));
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
      if (fileC && objSign.length) {
        const checkSign = await this.contractService.signPkiDigital(this.dataNetworkPKI.phone, this.dataNetworkPKI.networkCode, this.recipientId, this.datas.is_data_contract.name);
        console.log(checkSign);
        // await this.signContractSimKPI();
        if (!checkSign || (checkSign && !checkSign.success)) {
          this.toastService.showErrorHTMLWithTimeout('Ký số không thành công!', '', 3000);
          return false;
        } else {
          return true;
        }
      }

    } else if(typeSignDigital == 4) {
      //Ký hsm
      const objSign = this.isDataObjectSignature.filter((signUpdate: any) => (signUpdate && signUpdate.type == 3 && [3, 4].includes(this.datas.roleContractReceived)
      && signUpdate?.recipient?.email === this.currentUser.email
      && signUpdate?.recipient?.role === this.datas?.roleContractReceived));

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

      if (fileC && objSign.length) {
        
        const checkSign = await this.contractService.signHsm(this.dataHsm, this.recipientId);;

        if (!checkSign || (checkSign && !checkSign.success)) {
          
          if(!checkSign.message) {
            this.toastService.showErrorHTMLWithTimeout('Đăng nhập không thành công','',3000);
          } else if(checkSign.message) {
            this.toastService.showErrorHTMLWithTimeout(checkSign.message,'',3000);
          }
          
          return false;
        } else {
          if(checkSign.success === true) {
            if (pdfC2) {
              fileC = pdfC2.path;
            } else if (pdfC1) {
              fileC = pdfC1.path;
            } else {
              return;
            }
            console.log("fileC ",fileC);
            return true;
          } 
        }
 
      }
      
    } else if(typeSignDigital == 5) {
      console.log("vao day ky ekyc ");
      console.log("sign update ", this.isDataObjectSignature);

      const objSign = this.isDataObjectSignature.filter((signUpdate: any) => (signUpdate && (signUpdate.type == 3 || signUpdate.type == 2) && [3, 4].includes(this.datas.roleContractReceived)
      && signUpdate?.recipient?.email === this.currentUser.email
      && signUpdate?.recipient?.role === this.datas?.roleContractReceived));

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

      if(fileC && objSign.length)
        return true;
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
      if (signUpdate && signUpdate.type == 2 && [3, 4].includes(this.datas.roleContractReceived)
        && signUpdate?.recipient?.email === this.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {

        otpOrEkyc = true;
        if(signUpdate.valueSign) {
          this.eKYC = false;
          eKYC = 0;
          formData = {
            "content": signUpdate.valueSign,
            organizationId: this.data_contract?.is_data_contract?.organization_id
          }
        } else {
          this.eKYC = true;
          eKYC = 1;
          const imageRender = <HTMLElement>document.getElementById('export-html-ekyc');
    
          console.log("image render ", imageRender);
    
          const textSignB =  domtoimage.toPng(imageRender);
    
          console.log("textSignB ", textSignB);
    
          const valueBase64 = (await textSignB).split(",")[1];

          console.log("value base64 ", valueBase64);

          formData = {
            "content": "data:image/png;base64,"+valueBase64,
            "name": "image_" + new Date().getTime() + ".jpg",
            organizationId: this.data_contract?.is_data_contract?.organization_id
          }
        }
     

      
      }
    }

    console.log("formData ",formData);
    
    if(otpOrEkyc == true) {
      signUploadObs$.push(this.contractService.uploadFileImageBase64Signature(formData));
      indexSignUpload.push(iu);  
    }

    iu++;

    forkJoin(signUploadObs$).subscribe(async results => {
      let ir = 0;
      for (const resE of results) {
        this.datas.filePath = resE?.file_object?.file_path;
        if (this.datas.filePath && eKYC == 0) {
          this.isDataObjectSignature[indexSignUpload[ir]].value = this.datas.filePath;
        }
        ir++;
      }

      if(eKYC == 0)
        await this.signContract(false);
    }, error => {
      this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
    });

    if (signUploadObs$.length == 0 || eKYC == 1) {
      console.log("co the la ky ekyc ");
      await this.signContract(true);
    }

  }

  async signContract(notContainSignImage?: boolean) {
    console.log("sign contract");

    const signUpdateTemp = JSON.parse(JSON.stringify(this.isDataObjectSignature));

    let signUpdatePayload = "";
    //neu khong chua chu ky anh
    if (notContainSignImage) {
      console.log("ko chua chu ky anh ");
      signUpdatePayload = signUpdateTemp.filter(
        (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
        .map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            value: (item.type == 1 || item.type == 4) ? item.valueSign : item.value,
            font: item.font,
            font_size: item.font_size
          }
        });

        console.log("sign update payload ",signUpdatePayload);
    }else{

      this.isDateTime = this.datepipe.transform(new Date(), "dd/MM/yyyy HH:mm");
      await of(null).pipe(delay(100)).toPromise();

      const imageRender = <HTMLElement>document.getElementById('export-signature-image-html');

      let signI:any;
      if (imageRender) {
        const textSignB = await domtoimage.toPng(imageRender);
        signI = textSignB.split(",")[1];
      }

      const imageRenderEkyc = <HTMLElement>document.getElementById('export-html-ekyc');
      if (imageRenderEkyc) {
        const textSignB = await domtoimage.toPng(imageRenderEkyc);
        signI = textSignB.split(",")[1];
      }

      console.log("sign update temp ", signUpdateTemp);

      signUpdatePayload = signUpdateTemp.filter(
        (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
        .map((item: any) => {
          if(this.dataOTP) {
            return {
              otp: this.dataOTP.otp,
              signInfo: signI,
              processAt: this.datepipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
              fields:[
                {
                  id: item.id,
                  name: item.name,
                  value: item.value,
                  font: item.font,
                  font_size: item.font_size
                }]
            }
          } 
         
        });

      console.log("sign update payload ", signUpdatePayload);

      if(signUpdatePayload){
        signUpdatePayload = signUpdatePayload[0];
      }
    }

    let typeSignDigital = null;
    for (const signUpdate of this.isDataObjectSignature) {
      if (signUpdate && signUpdate.type == 3 && [3, 4].includes(this.datas.roleContractReceived)
        && signUpdate?.recipient?.email === this.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {
        if (signUpdate.recipient?.sign_type) {
          const typeSD = signUpdate.recipient?.sign_type.find((t: any) => t.id != 1);
          if (typeSD) {
            typeSignDigital = typeSD.id;
          }
        }
        break;
      }
    }

    if (typeSignDigital && typeSignDigital == 2) {
      //Đối với ký usb token
      // let checkSetupTool = false;

      // this.contractService.getAllAccountsDigital().then(async (data) => {

      //   console.log("data all accounts digital ", data);
      //   if (data.data.Serial) {
         
      //     this.contractService.checkTaxCodeExist(this.taxCodePartnerStep2, data.data.Base64).subscribe(async (response) => {
      //       if(response.success == true) {
      //         this.signCertDigital = data.data;
      //         this.nameCompany = data.data.CN;
      //         checkSetupTool = true;
      //         if (!checkSetupTool) {
      //           this.spinner.hide();
      //           return;
      //         } else {
      //           await this.signImageC(signUpdatePayload, notContainSignImage);
      //         }
      //       } else {
      //         this.spinner.hide();
      //         Swal.fire({
      //           title: `Mã số thuế/CMT/CCCD trên chữ ký số không trùng khớp`,
      //           icon: 'warning',
      //           confirmButtonColor: '#3085d6',
      //           cancelButtonColor: '#b0bec5',
      //           confirmButtonText: 'Xác nhận'
      //         });
      //       }
      //     })

      //   } else {
      //     this.spinner.hide();
      //     Swal.fire({
      //       title: `Vui lòng cắm USB Token hoặc chọn chữ ký số!`,
      //       icon: 'warning',
      //       confirmButtonColor: '#3085d6',
      //       cancelButtonColor: '#b0bec5',
      //       confirmButtonText: 'Xác nhận'
      //     });
      //   }
      // }, err => {
      //   this.spinner.hide();
      //   Swal.fire({
      //     html: "Vui lòng bật tool ký số hoặc tải " + `<a href='https://drive.google.com/file/d/1-pGPF6MIs2hILY3-kUQOrrYFA8cRu7HD/view' target='_blank'>Tại đây</a>  và cài đặt`,
      //     icon: 'warning',
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#b0bec5',
      //     confirmButtonText: 'Xác nhận'
      //   });
      // })

      //get session
      // console.log("get session id");

      this.getSessionId(this.taxCodePartnerStep2, signUpdatePayload, notContainSignImage);
      
    } else {
      console.log("vao day ");
      await this.signImageC(signUpdatePayload, notContainSignImage);
    }

  }

  //get sessionid for usb token
  getSessionId(taxCode: any, signUpdatePayload: any, notContainSignImage: any) {
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

    console.log('pkcs11Lib ', pkcs11Lib);

    var json_req = JSON.stringify({
      pkcs11Lib: pkcs11Lib,
      OperationId: OperationId,
    });

    json_req = window.btoa(json_req);

    console.log('json req ', json_req);

    var httpReq: any = '';

    var response = '';
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      httpReq = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      httpReq = new ActiveXObject('Microsoft.XMLHTTP');
    }

    httpReq.open('POST', this.domain + 'process', true);
    httpReq.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded'
    );
    httpReq.send('request=' + json_req);

    httpReq.onreadystatechange = () => {
      if (httpReq.readyState == 4 && httpReq.status == 200) {
        response = window.atob(httpReq.responseText);

        console.log('response ', response);

        var process = false;
        try {
          var json_res = JSON.parse(response);
          if (json_res.ResponseCode == 0) {
            var hSession = json_res.SessionId;

            this.sessionIdUsbToken = hSession;

            alert('Comunication with SignPlugin OK');

            this.getCertificate(hSession, taxCode, signUpdatePayload, notContainSignImage);
          } else {
            alert(json_res.ResponseMsg);
          }
        } catch (err) {
          console.log('err ');
        }
        if (response == '') {
          alert('Please setup SignPlugin and F5 to try again');
          // window.location = './' + signplugin_installer;
          return;
        }
      } else if (httpReq.readyState == 4 && httpReq.status != 200) {
        alert('Please setup SignPlugin and F5 to try again');
        // window.location = './' + signplugin_installer;
        return;
      }
    };
  }

  b64DecodeUnicode(str: any) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

  getCertificate(hSession: any, taxCode: any, signUpdatePayload: any, notContainSignImage: any) {
    var json_req = JSON.stringify({
      OperationId: 2,
      SessionId: hSession,
      checkOCSP: 0,
    });

    json_req = window.btoa(json_req);

    var httpReq: any = '';
    var response = '';
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      httpReq = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      httpReq = new ActiveXObject('Microsoft.XMLHTTP');
    }
    httpReq.onreadystatechange = () => {
      if (httpReq.readyState == 4 && httpReq.status == 200) {
        response = this.b64DecodeUnicode(httpReq.responseText);

        console.log('response name company ', response);

        var process = false;
        try {
          var json_res = JSON.parse(response);

          console.log('json_res ', json_res.certInfo.Base64Encode);

          this.signCertDigital = json_res.certInfo.SerialNumber;
          this.nameCompany = json_res.certInfo.CommonName;

          console.log("serial number ", this.signCertDigital);

          this.contractService.checkTaxCodeExist(
            taxCode,
            json_res.certInfo.Base64Encode
          ).subscribe((response) => {
            console.log('response ', response);

            if (response.success == true) {


              this.signImageC(signUpdatePayload, notContainSignImage);
            } else {
              Swal.fire({
                title: `Mã số thuế trên chữ ký số không trùng mã số thuế của tổ chức`,
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#b0bec5',
                confirmButtonText: 'Xác nhận',
              });
            }
          });
        } catch (err) {
          alert('Error: ' + err);
        }
      }
    };
    httpReq.open('POST', this.domain + 'process', true);
    httpReq.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded'
    );
    httpReq.send('request=' + json_req);
  }

  filePath: any = "";
  async signImageC(signUpdatePayload: any, notContainSignImage: any) {
    console.log("notContainSignImage ", notContainSignImage);
    console.log("sigunupdatepayload ",signUpdatePayload);
    let signDigitalStatus = null;
    let signUpdateTempN: any[] = [];
    if(signUpdatePayload){
      signUpdateTempN = JSON.parse(JSON.stringify(signUpdatePayload));

      if (notContainSignImage) {
        signDigitalStatus = await this.signDigitalDocument();

        if(this.eKYC == false) {
          signUpdateTempN = signUpdateTempN.filter(
            (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
            .map((item: any) => {
              console.log("item sign image c ", item);
              return {
                id: item.id,
                name: item.name,
                value: null,
                font: item.font,
                font_size: item.font_size
              }
            });
        } else {
            //đẩy chữ ký vào file pdf
          const imageRender = <HTMLElement>document.getElementById('export-html-ekyc');
          const textSignB =  domtoimage.toPng(imageRender);
                    
          const valueBase64 = (await textSignB).split(",")[1];


          const formData = {
                "name": "image_" + new Date().getTime() + ".jpg",
                "content": "data:image/png;base64," + valueBase64,
                organizationId: this.data_contract?.is_data_contract?.organization_id
          }

          this.contractService.uploadFileImageBase64Signature(formData).subscribe((responseBase64) => {
            // signUpdateTempN.value = responseBase64.file_object.file_path;
            signUpdateTempN[0].value = responseBase64.file_object.file_path;

            console.log(signUpdateTempN);
      
            this.contractService.updateInfoContractConsider(signUpdateTempN, this.recipientId).subscribe(
              async (result) => {
                if (!notContainSignImage) {
                  await this.signDigitalDocument();
                }
                setTimeout(() => {
                  this.router.navigate(['/main/form-contract/detail/' + this.idContract]);
                  // this.toastService.showSuccessHTMLWithTimeout(
                  //   [3, 4].includes(this.datas.roleContractReceived) ? 'Ký hợp đồng thành công' : 'Xem xét hợp đồng thành công'
                  //   , '', 3000);

                  if(!this.mobile) {
                    this.toastService.showSuccessHTMLWithTimeout(
                      [3, 4].includes(this.datas.roleContractReceived) ? 'success_sign' : 'success_watch'
                      , '', 3000);
                  } else {
                    if([3, 4].includes(this.datas.roleContractReceived)) {
                      alert("Ký hợp đồng thành công");
                    } else {
                      alert("Xem xét hợp đồng thành công");
                    }
                  }
      

                  this.spinner.hide();
                }, 1000);
              }, error => {
                this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
                this.spinner.hide();
              }
            )

            return;
          })

          console.log("sign update temp out api ", signUpdateTempN);

        }
      
      }
    }

    console.log("not contain sign image ",notContainSignImage);

    if (notContainSignImage && !signDigitalStatus && this.datas.roleContractReceived != 2) {
      console.log("vao day ");
      this.spinner.hide();
      return;
    }

    if(notContainSignImage && this.eKYC == false){
      console.log("ko phai ky anh ");

      console.log(signUpdateTempN);

      this.contractService.updateInfoContractConsider(signUpdateTempN, this.recipientId).subscribe(
        async (result) => {
          if (!notContainSignImage) {
            console.log("update info contract consider ");
            await this.signDigitalDocument();
          }
          setTimeout(() => {
            this.router.navigate(['/main/form-contract/detail/' + this.idContract]);
        
            if(!this.mobile) {
              this.toastService.showSuccessHTMLWithTimeout(
                [3, 4].includes(this.datas.roleContractReceived) ? 'success_sign' : 'success_watch'
                , '', 3000);
            } else {
              if([3, 4].includes(this.datas.roleContractReceived)) {
                alert("Ký hợp đồng thành công");
              } else {
                alert("Xem xét hợp đồng thành công");
              }
            }

            this.spinner.hide();
          }, 1000);
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
          this.spinner.hide();
        }
      )
    }else{
      if(this.eKYC == false) {
        this.contractService.updateInfoContractConsiderImg(signUpdateTempN, this.recipientId).subscribe(
          async (result) => {
            if(result?.success == false){
              if(result.message == 'Wrong otp'){
                if(!this.mobile)
                  this.toastService.showErrorHTMLWithTimeout('Mã OTP không đúng hoặc quá hạn', '', 3000);
                else
                  alert('Mã OTP không đúng hoặc quá hạn');
                this.spinner.hide();
              }else{
                if(!this.mobile) {
                  this.toastService.showErrorHTMLWithTimeout('Ký hợp đồng không thành công', '', 3000);
                } else {
                  alert('Ký hợp đồng không thành công');
                }
                this.spinner.hide();
              }
            }else{
              if (!notContainSignImage) {
                //Ký số
                await this.signDigitalDocument();
              }
              setTimeout(() => {
                this.router.navigate(['/main/form-contract/detail/' + this.idContract]);
                // this.toastService.showSuccessHTMLWithTimeout(
                //   [3, 4].includes(this.datas.roleContractReceived) ? 'Ký hợp đồng thành công' : 'Xem xét hợp đồng thành công'
                //   , '', 3000);

                if(!this.mobile) {
                  this.toastService.showSuccessHTMLWithTimeout(
                    [3, 4].includes(this.datas.roleContractReceived) ? 'success_sign' : 'success_watch'
                    , '', 3000);
                } else {
                  if([3, 4].includes(this.datas.roleContractReceived)) {
                    alert("Ký hợp đồng thành công");
                  } else {
                    alert("Xem xét hợp đồng thành công");
                  }
                }
    
                this.spinner.hide();
              }, 1000);
            }
  
          }, error => {
            this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
            this.spinner.hide();
          }
        )
      }
    }

  }

  async signContractSimKPI() {
    const signUploadObs$ = [];
    let indexSignUpload: any[] = [];
    let iu = 0;
    for (const signUpdate of this.isDataObjectSignature) {
      if (signUpdate && signUpdate.type == 3 && [3, 4].includes(this.datas.roleContractReceived)
        && signUpdate?.recipient?.email === this.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {

        const formData = {
          "name": "image_" + new Date().getTime() + ".jpg",
          "content": "data:image/png;base64," + this.contractService.imageMobiBase64,
          organizationId: this.data_contract?.is_data_contract?.organization_id
        }

        console.log("form data ", formData);

        signUploadObs$.push(this.contractService.uploadFileImageBase64Signature(formData).toPromise());
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
        this.isDataObjectSignature[indexSignUpload[ir]].value = this.datas.filePath;
      }
      ir++;
    }
    const signUpdateTemp = JSON.parse(JSON.stringify(this.isDataObjectSignature));
    const signUpdatePayload = signUpdateTemp.filter(
      (item: any) => item?.recipient?.email === this.currentUser.email && item.type == 3 &&
        item?.recipient?.role === this.datas?.roleContractReceived)
      .map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          value: item.value,
          font: item.font,
          font_size: item.font_size
        }
      });
    const signRes = await this.contractService.updateInfoContractConsiderToPromise(signUpdatePayload, this.recipientId);
  }

  getFilePdfForMobile() {
    let fieldId: number = 0;
    let fieldName: string = "";

    //this.idContract: id hợp đồng
    this.contractService.getDetailContract(this.idContract).subscribe(async (response) => {
      console.log("response organization ", response);

      let organization_id = response[0].organization_id;

      for(let i = 0; i < response[2].length; i++) {
        if(response[2][i].recipient = this.recipientId) {
          fieldId = response[2][i].id;
          fieldName = response[2][i].name;
        } 
      }

      const imageRender = <HTMLElement>document.getElementById('image_keo_tha');

      console.log("image render ", imageRender);

      const textSignB =  domtoimage.toPng(imageRender);

      console.log("textSignB ", textSignB);

      const valueBase64 = (await textSignB).split(",")[1];;

      const formData = {
        "name": "image_mobile" + new Date().getTime() + ".jpg",
        "content": "data:image/png;base64," + valueBase64,
        organizationId: organization_id
      }

      this.contractService.uploadFileImageBase64Signature(formData).subscribe((responseBase64) => {

        console.log("response base 64 ", responseBase64);

        const filePath = responseBase64.file_object.file_path;

        const data =    [{
          "font":"Arial",
          "font_size":14,
          "id":this.recipientId,
          "name":fieldName,
          "value":filePath
       }]

        this.contractService.updateInfoContractConsider(data, this.recipientId).subscribe((responseEnd) => {
          this.contractService.getDetailContract(this.idContract).subscribe((responseLink) => {
            console.log("response link ", responseLink);
          })
        })

      })

    })
  }

  async rejectContract() {
    let inputValue = '';
    const { value: textRefuse } = await Swal.fire({
      title: 'Bạn có chắc chắn hủy hợp đồng này không? Vui lòng nhập lý do hủy:',
      input: 'text',
      inputValue: inputValue,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#b0bec5',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Bạn cần nhập lý do hủy hợp đồng!'
        } else {
          return null;
        }
      }
    })

    if (textRefuse) {
      this.contractService.considerRejectContract(this.recipientId, textRefuse).subscribe(
        (result) => {
          this.toastService.showSuccessHTMLWithTimeout('Hủy hợp đồng thành công', '', 3000);
          this.spinner.hide();
          this.router.navigate(['/main/form-contract/detail/' + this.idContract]);
        }, error => {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
        }
      )
    } else {
      // this.toastService.showWarningHTMLWithTimeout('Bạn cần nhập lý do hủy hợp đồng', '', 3000)
    }

  }

  validateSignature() {
    const validSign = this.isDataObjectSignature.filter(
      (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived && item.required && !item.valueSign && item.type != 3
    );
    return validSign.length == 0;
  }

  t() {
    console.log(this);
  }

  downloadContract(id: any) {
    this.contractService.getFileZipContract(id).subscribe((data) => {

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

  checkIsViewContract() {
    if (this.datas?.is_data_contract?.participants?.length) {
      for (const participant of this.datas.is_data_contract.participants) {
        for (const recipient of participant.recipients) {
          if (this.recipientId == recipient.id) {
            this.recipient = recipient;
            if (this.currentUser?.email != this.recipient?.email) {
              this.router.navigate(['main/form-contract/detail/' + this.idContract]);
            }
            return;
          }
        }
      }
    }
  }

  fetchDataUserSimPki() {
    let typeSignDigital = null
    if (this.recipient?.sign_type) {
      const typeSD = this.recipient?.sign_type.find((t: any) => t.id != 1);
      if (typeSD) {
        typeSignDigital = typeSD.id;
      }
    }
    if (this.recipient?.email == this.currentUser.email
      && typeSignDigital && typeSignDigital == 3
    ) {
      const nl = networkList;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
      this.userService.getUserById(this.currentUser.id).subscribe(
        (data) => {
          const itemNameNetwork = nl.find((nc: any) => nc.id == data.phone_tel);
          this.signInfoPKIU.phone = data.phone_sign;
          this.signInfoPKIU.phone_tel = data.phone_tel;
          this.signInfoPKIU.networkCode = (itemNameNetwork && itemNameNetwork.name) ? itemNameNetwork.name.toLowerCase() : null;
        }
      )
    }
  }

  cccdFront: any;
  cardId: any;
  eKYCSignOpen() {
    const data = {
      id: 0,
      title: 'Xác thực CMT/CCCD mặt trước',
      recipientId: this.recipientId,
      contractId: this.idContract
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(EkycDialogSignComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.cccdFront = result;

      this.contractService.detectCCCD(this.cccdFront).subscribe((response) => {
        console.log("response ",response);

        this.nameCompany = response.name;
        this.cardId = response.id;

        console.log("name company ", this.cardId);
      })

      if(result)
        this.eKYCSignOpenAfter();
    })
  }

  eKYCSignOpenAfter() {
    const data = {
      id: 1,
      title: 'Xác thực CMT/CCCD mặt sau',
      contractId: this.idContract
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(EkycDialogSignComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {

      const dialogConfig = new MatDialogConfig();

      const dataFace = {
        cccdFront: this.cccdFront,
        contractId: this.idContract
      }

      dialogConfig.data = dataFace;
      dialogConfig.disableClose = true;

      if(result) {
        const final = this.dialog.open(EkycDialogSignComponent,dialogConfig);

        final.afterClosed().subscribe((async (result: any) => {
  
          if(result == 2) {
            console.log("Nhận dạng khuôn mặt thành công ");
            await this.signContractSubmit();
          }
        }))
      }
     
    })
  }

  hsmDialogSignOpen(recipientId: number) {
    const data = {
      title: 'CHỮ KÝ HSM',
      is_content: 'forward_contract',
      recipientId: recipientId,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;

    const dialogRef = this.dialog.open(HsmDialogSignComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      console.log("dong hsm ");
      console.log("result ", result);
      if (result) {
        this.dataHsm = {
          ma_dvcs: result.ma_dvcs,
          username: result.username,
          password: result.password,
          password2: result.password2,
          imageBase64: "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",
        }

        await this.signContractSubmit();
  
      }
    })
  }

  imageDialogSignOpen(e : any, haveSignImage: boolean) {
    const data = {
      title: 'KÝ HỢP ĐỒNG ',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      console.log('the close dialog image ', result);
      let is_data = result;

      this.datas.is_data_object_signature.valueSign = result;

      console.log("datas ", this.datas.is_data_object_signature.valueSign);

      if(result) {
        if (e && e == 1 && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
        (this.datas.roleContractReceived == 3 && this.confirmSignature == 2) || (this.datas.roleContractReceived == 4 && this.confirmSignature == 2))) {

          let id_recipient_signature:any = null;
          let phone_recipient_signature:any = null;
          // console.log(this.datas);
          for (const d of this.datas.is_data_contract.participants) {
            for (const q of d.recipients) {
              if (q.email == this.currentUser.email && q.status == 1) {
                id_recipient_signature = q.id;
                this.phoneOtp = phone_recipient_signature = q.phone;
                this.userOtp = q.name;
                break
              }
            }
            if (id_recipient_signature) break;
          }

          //neu co id nguoi xu ly thi moi kiem tra
          if (id_recipient_signature) {

            this.contractService.getCheckSignatured(id_recipient_signature).subscribe((res: any) => {

              if (res && res.status == 2) {
                this.spinner.hide();
                this.toastService.showErrorHTMLWithTimeout('contract_signature_success', "", 3000);
              } else {
                if ([2, 3, 4].includes(this.datas.roleContractReceived)) {

                  this.confirmOtpSignContract(id_recipient_signature, phone_recipient_signature);
                  this.spinner.hide();
                } 
              }
            }, (error: HttpErrorResponse) => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout('error_check_signature', "", 3000);
            })
          } 
      } else if (e && e == 1 && ((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
        (this.datas.roleContractReceived == 3 && this.confirmSignature == 2) ||
        (this.datas.roleContractReceived == 4 && this.confirmSignature == 2)
      )) {
        await this.rejectContract();
      }
      }
    })
  }

  pkiDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ PKI',
      type: 3,
      sign: this.signInfoPKIU,
      data: this.datas,
      recipientId: this.recipientId
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.height = '330px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(PkiDialogSignComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result && result.phone && result.networkCode) {
        this.loadingText = 'Yêu cầu ký đã được gửi tới số điện thoại của bạn.\n Vui lòng Xác nhận để thực hiện dịch vụ';
        this.signInfoPKIU.phone = result.phone;
        this.signInfoPKIU.phone_tel = result.phone_tel;
        this.signInfoPKIU.networkCode = result.networkCode;
        if (result.phone && result.phone_tel && result.networkCode) {
          this.dataNetworkPKI = {
            networkCode: this.signInfoPKIU.networkCode,
            phone: this.signInfoPKIU.phone
          }
          await this.signContractSubmit();
        } else {
          this.toastService.showErrorHTMLWithTimeout("Vui lòng nhập số điện thoại và chọn nhà mạng", "", 3000);
        }
      }
    })
  }

  dataOTP:any;
  confirmOtpSignContract(id_recipient_signature:any, phone_recipient_signature:any) {
    const data = {
      title: 'XÁC NHẬN OTP',
      is_content: 'forward_contract',
      recipient_id: id_recipient_signature,
      phone: phone_recipient_signature,
      name: this.userOtp,
      contract_id: this.datas.is_data_contract.id,
      datas: this.datas,
      currentUser: this.currentUser,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ConfirmSignOtpComponent, dialogConfig);
  }

  confirmOtp(otp:any) {
    console.log(otp);
    this.dataOTP = {
           otp: otp
    }
    this.signContractSubmit();
  }

  prepareInfoSignUsbToken(page: any, heightPage: any) {

      this.isDataObjectSignature.map((sign: any) => {
        if ((sign.type == 3 || sign.type == 1 || sign.type == 4)
          && sign?.recipient?.email === this.currentUser.email
          && sign?.recipient?.role === this.datas?.roleContractReceived
          && sign?.page == page) {

          sign.signDigitalX = sign.coordinate_x/* * this.ratioPDF*/;
          sign.signDigitalY = (heightPage - (sign.coordinate_y - this.currentHeight) - sign.height)/* * this.ratioPDF*/;
          // sign.signDigitalWidth = (sign.coordinate_x + sign.width)/* * this.ratioPDF*/;
          // sign.signDigitalHeight = (heightPage - (sign.coordinate_y - this.currentHeight))/* * this.ratioPDF*/;

          sign.signDigitalWidth = sign.width;
          sign.signDigitalHeight = sign.height;

          //Lấy thông tin mã số thuế của đối tác ký 
          this.contractService.getDetermineCoordination(sign.recipient_id).subscribe((response) => {

            const lengthRes = response.recipients.length;
            for(let i = 0; i < lengthRes; i++) {

              console.log("vao vong for ");

              const id = response.recipients[i].id;

              if(id == sign.recipient_id) {
                this.taxCodePartnerStep2 = response.recipients[i].fields[0].recipient.cardId;

                break;
              }
            }
          })

          return sign;
        } else {
          return sign;
        }
      });
    
    this.currentHeight += heightPage;
  }

  mobile: boolean = false;
  getDeviceApp() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }


}


