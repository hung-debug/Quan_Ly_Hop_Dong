import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { AppService } from 'src/app/service/app.service';
import { ContractSignatureService } from 'src/app/service/contract-signature.service';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { UploadService } from 'src/app/service/upload.service';
import interact from "interactjs";
import {variable} from "../../../config/variable";
import Swal from 'sweetalert2';
import * as $ from "jquery";
import {ProcessingHandleEcontractComponent} from "../../contract-signature/shared/model/processing-handle-econtract/processing-handle-econtract.component"

@Component({
  selector: 'app-detail-contract',
  templateUrl: './detail-contract.component.html',
  styleUrls: ['./detail-contract.component.scss']
})
export class DetailContractComponent implements OnInit, OnDestroy {

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
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  objPdfProperties: any = {
    pages: [],
  };
  confirmConsider = 1;
  confirmSignature = 1;

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

  isPartySignature: any = [
    {id: 1, name: 'Công ty cổ phần công nghệ tin học EFY Việt Nam'},
    {id: 2, name: 'Công ty newEZ Việt Nam'},
    {id: 3, name: 'Tập đoàn Bảo Việt'}
  ];

  optionsSign: any = [
    {item_id: 1, item_text: 'Ký ảnh'},
    {item_id: 2, item_text: 'Ký số bằng USB token'},
    {item_id: 3, item_text: 'Ký số bằng sim PKI'},
    {item_id: 4, item_text: 'Ký số bằng HSM'}
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

  constructor(
    private contractSignatureService: ContractSignatureService,
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastService : ToastService,
    private uploadService : UploadService,
    private dialog: MatDialog
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  ngOnInit(): void {
    this.appService.setTitle('THÔNG TIN CHI TIẾT HỢP ĐỒNG');
    this.getDataContractSignature();
  }

  getDataContractSignature() {
    this.idContract = this.activeRoute.snapshot.paramMap.get('id');
    this.activeRoute.queryParams
      .subscribe(params => {
          this.recipientId = params.recipientId;
          console.log(this.recipientId);
        }
      );
    this.contractService.getDetailContract(this.idContract).subscribe(rs => {
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
      })

      let data_sign_config_cks = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_so');
      let data_sign_config_cka = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_anh');
      let data_sign_config_text = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'text');
      // let data_sign_config_so_tai_lieu = this.datas.determine_contract.filter((p: any) => p.sign_unit == 'so_tai_lieu');

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
          // Array.prototype.push.apply(element.sign_config, data_sign_config_so_tai_lieu);
        }
      })
      // }

      // this.datas = this.datas.concat(this.data_contract.contract_information);

      this.datas.action_title = 'Xác nhận';
      this.activeRoute.url.subscribe(params => {
        console.log(params);
        if (params && params.length > 0) {
          params.forEach(item => {
            if (item.path == 'consider-contract') {
              this.datas.roleContractReceived = 2;
            } else if (item.path == 'personal-signature-contract') {
              this.datas.roleContractReceived = 3;
            }
          })
        }
      });


      this.scale = 1;

      if (!this.signCurent) {
        this.signCurent = {
          offsetWidth: 0,
          offsetHeight: 0
        }
      }

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
      }
      // render pdf to canvas
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
        this.arrPage.push({page: page});
        canvas.className = 'dropzone';
        canvas.id = "canvas-step3-" + page;
        // canvas.style.paddingLeft = '15px';
        // canvas.style.border = '9px solid transparent';
        // canvas.style.borderImage = 'url(assets/img/shadow.png) 9 9 repeat';
        let idPdf = 'pdf-viewer-step-3'
        let viewer = document.getElementById(idPdf);
        if (viewer) {
          viewer.appendChild(canvas);
        }
        this.renderPage(page, canvas);
      }
    }).then(() => {
      setTimeout(() => {
        this.setPosition();
        this.eventMouseover();
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
    }, 100)
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
    //This gives us the page's dimensions at full scale
    //@ts-ignore
    this.thePDF.getPage(pageNumber).then((page) => {
      // let viewport = page.getViewport(this.scale);
      let viewport = page.getViewport({scale: this.scale});
      let test = document.querySelector('.viewer-pdf');

      this.canvasWidth = viewport.width;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      let _objPage = this.objPdfProperties.pages.filter((p: any) => p.page_number == pageNumber)[0];
      if (!_objPage) {
        this.objPdfProperties.pages.push({
          page_number: pageNumber,
          width: parseInt(viewport.width),
          height: viewport.height,
        });
      }
      page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
      if (test) {
        let paddingPdf = ((test.getBoundingClientRect().width) - viewport.width) / 2;
        $('.viewer-pdf').css('padding-left', paddingPdf + 'px');
        $('.viewer-pdf').css('padding-right', paddingPdf + 'px');
      }
      this.activeScroll();
    });
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
    style.backgroundColor = d.value ? '' : '#EBF8FF';
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
    if (window.innerHeight < 670) {
      return {
        "overflow": "auto",
        "height": "calc(50vh - 113px)"
      }
    } else return {}
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
    //   let arrSignConfig: any = [];
    //   arrSignConfig = this.datas.is_data_object_signature;
      // return this.datas.is_data_object_signature.filter(
      //   (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived
      // );
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
      width: '497px',
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

  submitEvents(e: any) {
    if (e && e == 1 && !this.validateSignature() && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2))) {
      this.toastService.showErrorHTMLWithTimeout('Vui lòng thao tác vào ô ký hoặc ô text đã bắt buộc', '', 1000);
      return;
    }
    if (e && e == 1 && !((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2))) {
      Swal.fire({
        title: this.getTextAlertConfirm(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b0bec5',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          if ([2, 3].includes(this.datas.roleContractReceived)) {
            this.signContractSubmit();
          }
        }
      });
    } else if (e && e == 1 && ((this.datas.roleContractReceived == 2 && this.confirmConsider == 2) ||
      (this.datas.roleContractReceived == 3 && this.confirmSignature == 2))) {
      this.rejectContract();
    }
    if (e && e == 2) {
      this.downloadContract(this.idContract);
    }
  }

  confirmOtpSignContract() {
    const data = {
      title: 'Xác nhận otp',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(ConfirmSignOtpComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   this.openPopupSignContract(this.typeSign);
    // })
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
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(ImageDialogSignComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('the close dialog');
    //   let is_data = result
    // })
  }

  pkiDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ PKI',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(PkiDialogSignComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('the close dialog');
    //   let is_data = result
    // })
  }

  hsmDialogSignOpen() {
    const data = {
      title: 'CHỮ KÝ HSM',
      is_content: 'forward_contract'
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '497px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = data;
    // const dialogRef = this.dialog.open(HsmDialogSignComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('the close dialog');
    //   let is_data = result
    // })
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

  signContractSubmit() {

    for(const signUpdate of this.isDataObjectSignature) {
      console.log('ki anh', signUpdate);
      if (signUpdate && signUpdate.type == 2 && this.datas.roleContractReceived == 3
        && signUpdate?.recipient?.email === this.currentUser.email
        && signUpdate?.recipient?.role === this.datas?.roleContractReceived
      ) {

        const formData = {
          "name": "image.jpg",
          "content": signUpdate.value
        }
        this.contractService.uploadFileImageBase64Signature(formData).subscribe(data => {
          this.datas.filePath = data?.fileObject?.filePath;


          if (this.datas.filePath) {
            signUpdate.value = this.datas.filePath;
          }
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 1000);
        });
      }
    }
    setTimeout(() => {
      this.signContract();
    },2000);

  }

  signContract() {
    const signUpdate = this.isDataObjectSignature.filter(
      (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived)
      .map((item: any) =>  {
      return {
        id: item.id,
        name: item.name,
        value: item.value,
        font: item.font,
        font_size: item.font_size
      }});
    this.contractService.updateInfoContractConsider(signUpdate, this.recipientId).subscribe(
      (result) => {
        this.toastService.showSuccessHTMLWithTimeout(
          this.datas?.roleContractReceived == 3 ? 'Ký hợp đồng thành công' : 'Xem xét hợp đồng thành công'
          , '', 1000);
        this.router.navigate(['/main/contract-signature/receive/processed']);
      }, error => {
        this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 1000);
      }
    )
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
          this.toastService.showSuccessHTMLWithTimeout('Hủy hợp đồng thành công', '', 1000);
          this.router.navigate(['/main/contract-signature/receive/processed']);
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 1000);
        }
      )
    } else {
      // this.toastService.showWarningHTMLWithTimeout('Bạn cần nhập lý do hủy hợp đồng', '', 1000)
    }

  }

  validateSignature() {
    const validSign = this.isDataObjectSignature.filter(
      (item: any) => item?.recipient?.email === this.currentUser.email && item?.recipient?.role === this.datas?.roleContractReceived && item.required && !item.value && item.type != 3
    )
    return validSign.length == 0;
  }

  t() {
    console.log(this);
  }

  downloadContract(id:any){
    this.contractService.getFileContract(id).subscribe((data) => {
        //console.log(data);
        this.uploadService.downloadFile(data[0].path).subscribe((response: any) => {
          //console.log(response);

          let url = window.URL.createObjectURL(response);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = data[0].name;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.toastService.showSuccessHTMLWithTimeout("no.contract.download.file.success", "", 10000);
        }), (error: any) => this.toastService.showErrorHTMLWithTimeout("no.contract.download.file.error", "", 10000);
      },
      error => {
        this.toastService.showErrorHTMLWithTimeout("no.contract.get.file.error", "", 10000);
      }
    );
  }

  checkIsViewContract() {
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
  }

}
