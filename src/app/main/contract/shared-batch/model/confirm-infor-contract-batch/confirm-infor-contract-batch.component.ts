import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from 'src/app/config/variable';
import { Helper } from 'src/app/core/Helper';
import { ContractService } from 'src/app/service/contract.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-confirm-infor-contract-batch',
  templateUrl: './confirm-infor-contract-batch.component.html',
  styleUrls: ['./confirm-infor-contract-batch.component.scss']
})
export class ConfirmInforContractBatchComponent implements OnInit, OnDestroy, AfterViewInit {

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

  // isPartySignature: any = [
  //   {id: 1, name: 'Công ty cổ phần công nghệ tin học EFY Việt Nam'},
  //   {id: 2, name: 'Công ty newEZ Việt Nam'},
  //   {id: 3, name: 'Tập đoàn Bảo Việt'}
  // ]

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private modalService: NgbModal,
    private dialog: MatDialog
  ) {
    this.step = variable.stepBatchContract.step2
  }

  ngOnInit() {
    console.log(this.datas);

    this.scale = 1;

    if (!this.signCurent) {
      this.signCurent = {
        offsetWidth: 0,
        offsetHeight: 0
      }
    }

    this.pdfSrc = Helper._getUrlPdf(environment.base64_file_content_demo);
    //this.pdfSrc = Helper._getUrlPdf(this.datas.file_content);
    this.getPage();
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


  // Hàm showEventInfo là event khi thả (nhả click chuột) đối tượng ký vào canvas, sẽ chạy vào hàm.


  // Hàm tính tọa độ ký

  // Hàm event khi bắt đầu kéo (drag) đối tượng ký

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
      }, 100)
    })
  }

  eventMouseover() {
    // if (!this.datas.isView) {
    //   this.objDrag = {};
    //   let count_total = 0;
    //   this.datas.contract_user_sign.forEach((element: any) => {
    //     if (element.sign_config.length > 0) {
    //       let arrSignConfigItem = element.sign_config;
    //       arrSignConfigItem.forEach((item: any) => {
    //         if (item['position']) {
    //           this.objDrag[item.id] = {
    //             count: 2
    //           }
    //           count_total++;
    //         }
    //       })
    //     }
    //   });
    //   if (count_total == 0) {
    //     this.isEnableSelect = true;
    //     this.isEnableText = false;
    //     //@ts-ignore
    //     document.getElementById('select-dropdown').value = "";
    //   }
    // }
  }

  ngAfterViewInit() {
    this.setPosition();
    this.eventMouseover();
  }

  // set lại vị trí đối tượng kéo thả đã lưu trước đó
  setPosition() {
    if (this.convertToSignConfig().length > 0) {
      this.convertToSignConfig().forEach((element: any) => {
        let a = document.getElementById(element.id);
        if (a) {
          if (element['position']) { // @ts-ignore
            a.style["z-index"] = '1';
          }
          // else
          //   a.style.display = 'none';
          a.setAttribute("data-x", element['dataset_x']);
          a.setAttribute("data-y", element['dataset_y']);
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
          // @ts-ignore
          // document.getElementById('thumbnail-canvas').scrollTop = $(selector).offset().top - 95;
        }
      });
    });
  }


  // hàm set kích thước cho đối tượng khi được kéo thả vào trong hợp đồng
  changePosition(d?: any, e?: any, sizeChange?: any) {
    let style: any = {
      "transform": 'translate(' + d['dataset_x'] + 'px, ' + d['dataset_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#EBF8FF'
    }

    if (d['offsetWidth']) {
      style.width = parseInt(d['offsetWidth']) + "px";
    }

    if (d['offsetHeight']) {
      style.height = parseInt(d['offsetHeight']) + "px";
    }

    return style;
  }

  // Hàm thay đổi kích thước màn hình => scroll thuộc tính hiển thị kích thước và thuộc tính
  // @ts-ignore
  changeDisplay() {
    if (window.innerHeight < 670) {
      return {
        "overflow-y": "auto",
        "height": "calc(100vh - 250px)"
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
        this.objSignInfo.traf_x = d.dataset_x;
        this.objSignInfo.traf_y = d.dataset_y;
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

  // getIdSignClick() {
  //   let set_id = this.convertToSignConfig().filter((p: any) => p.id == d.id)[0];
  //   return set_id.id;
  //   // this.datas.contract_user_sign.forEach((element: any, index: any) => {
  //   //   if (element.id == id) {
  //   //     if (element.sign_config.length == 0) {
  //   //       this.objSignInfo['id'] = 'signer-' + index + '-index-0_' + element.id; // Thêm id cho chữ ký trong hợp đồng
  //   //     } else {
  //   //       this.objSignInfo['id'] = 'signer-' + index + '-index-' + (element.sign_config.length) + '_' + element.id;
  //   //     }
  //   //     // element['sign_config'].push(_obj);
  //   //   }
  //   // })
  // }

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datas.contract_user_sign];
    cloneUserSign.forEach(element => {
      arrSignConfig = arrSignConfig.concat(element.sign_config);
    })
    return arrSignConfig;
  }

  processHandleContract() {
    // alert('Luồng xử lý hợp đồng!');
    const data = this.datas;
    // @ts-ignore
    // const dialogRef = this.dialog.open(ProcessingHandleEcontractComponent, {
    //   width: '497px',
    //   backdrop: 'static',
    //   keyboard: true,
    //   data
    // })
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('the close dialog');
    // }, null, () => {
    // }).unsubscribe();

  }

  showThumbnail() {
    this.objSignInfo.showObjSign = false;
  }

  // tạo id cho đối tượng chưa được kéo thả
  getIdSignChuaKeo(id: any) {
    return "chua-keo-" + id;
  }

  ngOnDestroy() {
    // interact('.pdf-viewer-step-3').unset();
    // interact('.drop-zone').unset();
    // interact('.resize-drag').unset();
    // interact('.not-out-drop').unset();
    // interact.removeDocument(document);
  }

  // edit location doi tuong ky
  // changePositionSign(e: any, locationChange: any, property: any) {
  //   // console.log(e, this.objSignInfo, this.signCurent);
  //   let signElement = document.getElementById(this.objSignInfo.id);
  //   if (signElement) {
  //     let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
  //     if (isObjSign) {
  //       if (property == 'location') {
  //         if (locationChange == 'x') {
  //           isObjSign.dataset_x = parseInt(e);
  //           signElement.setAttribute("data-x", isObjSign.dataset_x);
  //         } else {
  //           isObjSign.dataset_y = parseInt(e);
  //           signElement.setAttribute("data-y", isObjSign.dataset_y);
  //         }
  //       } else if (property == 'size') {
  //         if (locationChange == 'width') {
  //           isObjSign.offsetWidth = parseInt(e);
  //           signElement.setAttribute("width", isObjSign.offsetWidth);
  //         } else {
  //           isObjSign.offsetHeight = parseInt(e);
  //           signElement.setAttribute("height", isObjSign.offsetHeight);
  //         }
  //       } else if (property == 'text') {
  //         isObjSign.text_attribute_name = e;
  //         signElement.setAttribute("text_attribute_name", isObjSign.text_attribute_name);
  //       } else {
  //         let data_name = this.list_sign_name.filter((p: any) => p.id == e.target.value)[0];
  //         if (data_name) {
  //           isObjSign.name = data_name.name;
  //           signElement.setAttribute("name", isObjSign.name);
  //
  //           isObjSign.signature_party = data_name.sign_unit;
  //           signElement.setAttribute("signature_party", isObjSign.signature_party);
  //         }
  //       }
  //       // console.log(this.signCurent)
  //       // console.log(this.objSignInfo)
  //     }
  //   }
  // }

  // getTrafX() {
  //   if (Math.round(this.objSignInfo.traf_x) <= 0) {
  //     return Math.round(this.objSignInfo.traf_x)
  //   } else
  //     return Math.round(this.objSignInfo.traf_x) - 1;
  // }
  //
  // getTrafY() {
  //   return Math.round(this.objSignInfo.traf_y)
  // }

  // edit size doi tuong ky
  // changeSizeSign(e: any, sizeChange: any) {
  //   let signElement = document.getElementById(this.objSignInfo.id);
  //   if (signElement) {
  //     let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
  //     if (isObjSign) {
  //
  //     }
  //   }
  // }

  // back(e: any, step?: any) {
  //   // if (!this.datas.isView) {
  //   this.nextOrPreviousStep(step);
  // }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeSampleContract.emit(step);
  }

  dieuphoi() {
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

  // getNameContract(data: any) {
  //   return (' ' + data.file_name + ',').replace(/,\s*$/, "");
  // }



  // getNameCoordination() {
  //   let nameFile = [];
  //   for (let i = 0; i < this.datas.contract_information.file_related_contract; i++) {
  //
  //   }
  // }

  getNameTypeId() {

  }

}
