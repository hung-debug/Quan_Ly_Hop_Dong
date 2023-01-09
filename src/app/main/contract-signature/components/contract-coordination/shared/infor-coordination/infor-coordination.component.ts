import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  QueryList,
  ElementRef,
  OnDestroy,
  AfterViewInit, Output, EventEmitter
} from '@angular/core';
import {variable} from "../../../../../../config/variable";
import {Helper} from "../../../../../../core/Helper";
import * as $ from 'jquery';

import interact from 'interactjs'
import {ContractService} from "../../../../../../service/contract.service";
import {environment} from "../../../../../../../environments/environment";
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {
  ProcessingHandleEcontractComponent
} from "../../../../shared/model/processing-handle-econtract/processing-handle-econtract.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../../../service/toast.service";
import {AppService} from "../../../../../../service/app.service";
import {throwError} from "rxjs";
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckViewContractService } from 'src/app/service/check-view-contract.service';

@Component({
  selector: 'app-infor-coordination',
  templateUrl: './infor-coordination.component.html',
  styleUrls: ['./infor-coordination.component.scss']
})
export class InforCoordinationComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() datas: any;
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

  isView: any;
  countAttachFile = 0;
  widthDrag: any;

  isEnableSelect: boolean = true;
  isEnableText: boolean = false;
  isChangeText: boolean = false;
  idContract: any;
  data_contract: any = {};
  isDataFileContract: any;
  isDataContract: any;
  isDataObjectSignature: any;
  currentUser: any;
  recipientId: any;
  view: any;
  valid: boolean = false;
  loaded: boolean = false;
  confirmCoordition: number = 1;

  checkView: boolean = true;

  sum: number[] = [];
  top: any[]= [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private modalService: NgbModal,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private toastService: ToastService,
    private appService: AppService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private checkViewContractService: CheckViewContractService
  ) {
    this.step = variable.stepSampleContract.step3;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
  }

  async ngOnInit() {
    this.appService.setTitle('THÔNG TIN HỢP ĐỒNG');
    // console.log(this.datas);

    this.idContract = Number(this.activeRoute.snapshot.paramMap.get('id'));

    this.checkView = await this.checkViewContractService.callAPIcheckViewContract(this.idContract, false);

    if(!this.idContract || this.checkView) {
      this.getDataContractSignature();
    } else {
      this.router.navigate(['/page-not-found']);
    }

  }

  indexY: number = 0;
  autoScroll() {
    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, this.coordinateY[this.indexY]);

    if (this.indexY <= this.coordinateY.length - 1) {
      this.indexY++;
    } else {
      this.indexY = 0;
      pdffull.scrollTo(0, 0);
    }
  }

  scroll(event: any) {
    //đổi màu cho nút back page
    let canvas1: any = document.getElementById('canvas-step3-1');

    if(event.srcElement.scrollTop < canvas1.height/2) {
      this.page1 = false;
    } else {
      this.page1 = true;
    }

    //đổi màu cho nút next page
    let canvasLast: any = document.getElementById('canvas-step3-'+this.pageNumber);
    let step3: any = document.getElementById('pdf-viewer-step-3');
    if(event.srcElement.scrollTop < Number(canvasLast.getBoundingClientRect().top - step3.getBoundingClientRect().top)) {
      this.pageLast = true;
    } else {
      this.pageLast = false;
    }

    this.pageNum = Number(Math.floor(event.srcElement.scrollTop/canvas1.height) + 1);

    let scrollTop = Number(event.srcElement.scrollTop);

    for(let i = 0; i < this.sum.length;i++) {
      if(this.sum[i] < scrollTop && scrollTop < this.sum[i+1]) {
        this.pageNum = Number(i+2);
      }
    }
  }


  getDataContractSignature() {

    let arr = this.convertToSignConfig();

    arr.forEach((items: any) => {
      this.coordinateY.push(items.coordinate_y);
      this.idElement.push(items.id);
    });

    this.coordinateY.sort();
    
    this.activeRoute.queryParams
      .subscribe(params => {
          this.recipientId = params.recipientId;
          this.view = params.view;
        }
      );
    // this.contractService.getDetailContract(this.idContract).subscribe(rs => {
    //   console.log(rs);
    // this.isDataContract = rs[0];
    // this.isDataFileContract = rs[1];
    // this.isDataObjectSignature = rs[2];
    if (this.datas.is_data_contract &&
      this.datas.i_data_file_contract[1] &&
      this.datas.i_data_file_contract[1].length &&
      this.datas.is_data_object_signature[2] &&
      this.datas.is_data_object_signature[2].length) {
      this.valid = true;
    }

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
    let data_sign_config_so_tai_lieu = this.datas.is_data_object_signature.filter((p: any) => p.sign_unit == 'so_tai_lieu');

    this.datas.contract_user_sign_index = this.contractService.getDataFormatContractUserSign();

    this.datas.contract_user_sign_index.forEach((element: any) => {
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

    // this.datas.action_title = 'Xác nhận';
    this.activeRoute.url.subscribe(params => {
      // console.log(params);
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
    // this.pdfSrc = this.datas.i_data_file_contract[0].path;
    let fileContract_1 = this.datas.i_data_file_contract.filter((p: any) => p.type == 1)[0];
    let fileContract_2 = this.datas.i_data_file_contract.filter((p: any) => p.type == 2)[0];
    if (fileContract_2) {
      this.pdfSrc = fileContract_2.path;
    } else {
      this.pdfSrc = fileContract_1.path;
    }
    // render pdf to canvas
    this.getPage();
    this.loaded = true;
    // }, (res: any) => {
    //   // @ts-ignore
    //   this.handleError();
    // })
  }

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

        for(let i = 0; i <= this.pageNumber;i++) {
          this.top[i] = 0;

          if(i < this.pageNumber)
            this.sum[i] = 0;
        }

        for(let i = 1; i <= this.pageNumber; i++) {
          let canvas: any = document.getElementById('canvas-step3-'+i);
          this.top[i] = canvas.height;
        }
        

        for(let i = 0; i < this.pageNumber; i++) {
          this.top[i+1] += this.top[i];
          this.sum[i] = this.top[i+1];
        }
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
          // @ts-ignore
          // document.getElementById('thumbnail-canvas').scrollTop = $(selector).offset().top - 95;
        }
      });
    });
  }


  // hàm set kích thước cho đối tượng khi được kéo thả vào trong hợp đồng
  changePosition(d?: any, e?: any, sizeChange?: any) {
    let style: any = {
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#EBF8FF'
    }

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
  changeColorDrag(role: any, isDaKeo?: any) {
    if (isDaKeo) {
      return 'ck-da-keo';
    } else {
      return 'employer-ck';
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

        this.objSignInfo.offsetWidth = parseInt(d.width);
        this.objSignInfo.offsetHeight = parseInt(d.height);
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
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datas.is_data_object_signature];
    cloneUserSign.forEach(element => {
      if ((element.recipient && ![2, 3].includes(element.recipient.status)) || (!element.recipient && ![2, 3].includes(element.status))) {
        arrSignConfig = arrSignConfig.concat(element);
      }
    })
    // return arrSignConfig;
    return arrSignConfig;
  }

  processHandleContract() {
    const data = this.datas;
    // @ts-ignore
    const dialogRef = this.dialog.open(ProcessingHandleEcontractComponent, {
      width: '1000px',
      backdrop: 'static',
      keyboard: true,
      data
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('the close dialog');
    }, null, () => {
    }).unsubscribe();

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

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeSampleContract.emit(step);
  }

  dieuphoi() {
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

  getFileAttach() {
    let file_attach = this.datas.i_data_file_contract.filter((p: any) => p.type == 3);
    return file_attach;
  }

  pageNum: number = 1;
  page1: boolean = false;
  pageLast: boolean = true;
  idElement: any[] = [];
  coordinateY: any[] = [];

  async submitEvents(e: any) {
    if (e == 1) {
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
        // Kiểm tra ô ký đã ký chưa (status = 2)
        this.spinner.show();
        let id_recipient_signature = null;
        for (const d of this.datas.is_data_contract.participants) {
          for (const q of d.recipients) {
            if (q.email == this.currentUser.email && q.status == 1) {
              id_recipient_signature = q.id;
              break
            }
          }
          if (id_recipient_signature) break;
        }

        //neu co id nguoi xu ly thi moi kiem tra
        
        if (id_recipient_signature) {
          this.contractService.considerRejectContract(id_recipient_signature, textRefuse).subscribe(
            (result) => {
              this.spinner.hide();
              this.toastService.showSuccessHTMLWithTimeout('Hủy hợp đồng thành công!', '', 3000);
              this.router.navigate(['/main/contract-signature/receive/wait-processing']);
            }, error => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', '', 3000);
            }, () => {
              // this.getLoadChangeDataRefuse();
            }
          )
        }
      }
    }
  }

}
