import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {variable} from "../../../../../config/variable";
import {Helper} from "../../../../../core/Helper";
import {environment} from "../../../../../../environments/environment";
import * as $ from 'jquery';

import interact from 'interactjs'

@Component({
  selector: 'app-sample-contract',
  templateUrl: './sample-contract.component.html',
  styleUrls: ['./sample-contract.component.scss']
})
export class SampleContractComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  pdfSrc: any;
  thePDF = null;
  pageNumber = 1;
  canvasWidth = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale = 1;
  objPdfProperties: any = {
    pages: [],
  };

  currPage = 1; //Pages are 1-based not 0-based
  numPages = 0;
  x0: any = "abc";
  y0: any = "bcd";
  numberContractto: any;
  dateContractto: any;
  selectBox: any;
  pdfAsArray: any;
  dataVariableSoHopDong: any;
  dataVariableNgayHopDong: any;
  variableObj: any;
  number_contract: any;
  date_contract: any;
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

  isObjNumber: any;
  isObjDate: any;
  _yearNow: any;
  objSignInfo: any = {
    id: "",
    showObjSign: false,
    nameObj: "",
    emailObj: "",
    traf_x: 0,
    traf_y: 0,
    x1: 0,
    y1: 0
  }
  // listDelete = [];
  signCurent: any;
  formatDate: any;
  changeValuePdf: any;
  demoStaff: any;
  base64Demo: any;

  distanceValue = 2;
  sortSigner: any;
  isChecked: any;
  id = "";
  isView: any;
  countAttachFile = 0;
  arrExceptTaxCode: any = [];
  maxLength = null;

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
    this.step = variable.stepSampleContract.step3
  }

  async ngOnInit() {

    // this.pdfSrc = Helper._getUrlPdf(environment.base64_file_content_demo);
    this.pdfSrc = environment.url_file_content;
    // console.log(this.pdfSrc)
    await this.getPage();

    interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      //@ts-ignore
      accept: null,
      // Require a 75% element overlap for a drop to be possible
      overlap: 1,
    })

    interact('.not-out-drop').on('dragend', this.showEventInfo).draggable({
      listeners: {move: this.dragMoveListener, onend: this.showEventInfo},
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: '.drop-zone',
          endOnly: true
        })
      ]
    })

    interact('.not-out-drop').on('resizeend', this.resizeSignature).resizable({
      edges: {right: true, bottom: true},
      listeners: {
        move: this.resizableListener, onend: this.resizeSignature
      },
      modifiers: [
        // keep the edges inside the parent

        interact.modifiers.aspectRatio({
          // ratio may be the string 'preserve' to maintain the starting aspect ratio,
          // or any number to force a width/height ratio
          ratio: 'preserve',
          // To add other modifiers that respect the aspect ratio,
          // put them in the aspectRatio.modifiers array
          modifiers: [
            interact.modifiers.restrictEdges({
              outer: '.drop-zone'
            }),

            // minimum size
            interact.modifiers.restrictSize({
              //min: { width: 100, height: 32 }
            })
          ]
        })
      ],
      inertia: true
    })

    interact('.resize-drag').on('dragend', this.showEventInfo).draggable({
      listeners: {
        move: this.dragMoveListener, onend: this.showEventInfo
      },
      inertia: true,
      autoScroll: true,
      modifiers: []
    })
    interact.addDocument(document)

  }

  resizeSignature = (event: any) => {
    let x = (parseFloat(event.target.getAttribute('data-x')) || 0)
    let y = (parseFloat(event.target.getAttribute('data-y')) || 0)
    // translate when resizing from top or left edges
    // this.signCurent = this.convertToSignConfig().filter(p => p.id == event.target.id)[0];
    // if (this.signCurent) {
    //   if (event.rect.width <= 280) {
    //     this.signCurent.dataset_x = x;
    //     this.signCurent.dataset_y = y;
    //     this.objSignInfo.id = event.target.id;
    //     this.objSignInfo.traf_x = x;
    //     this.objSignInfo.traf_y = y;
    //     this.signCurent.offsetWidth = event.rect.width;
    //     this.signCurent.offsetHeight = event.rect.height;
    //     this.tinhToaDoSign("canvas-step3-" + this.signCurent.page, this.signCurent.offsetWidth, this.signCurent.offsetHeight, this.objSignInfo);
    //     let _array = Object.values(this.obj_toa_do);
    //     this.signCurent.position = _array.join(",");
    //   }
    // }
  }

  resizableListener = (event: any) => {
    var target = event.target

    // update the element's style
    target.style.width = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'

  }

  showEventInfo = (event: any) => {
    let canvasElement: HTMLElement | null;

    if (event.relatedTarget && event.relatedTarget.id) {
      canvasElement = document.getElementById(event.relatedTarget.id);
      let canvasInfo = canvasElement ? canvasElement.getBoundingClientRect() : '';
      this.coordinates_signature = event.rect;
      let id = event.target.id;
      if (id.includes('chua-keo')) {  //Khi kéo vào trong hợp đồng thì sẽ thêm 1 object vào trong mảng sign_config
        event.target.style.webkitTransform = event.target.style.transform = 'none';// Đẩy chữ ký về vị trí cũ
        event.target.setAttribute('data-x', 0);
        event.target.setAttribute('data-y', 0);
        id = event.target.id.replace("chua-keo-", "");
        // this.datas.documents.document_user_sign_clone.forEach((element, index) => {
        this.datas.documents.document_user_sign_clone.forEach((element: any, index: any) => {
          if (element.id == id) {
            let _obj: any = {
              sign_type: element.sign_type,
              sign_unit: element.sign_unit,
              name: element.name
            }
            if (element.sign_config.length == 0) {
              _obj['id'] = 'signer-' + index + '-index-0_' + element.id; // Thêm id cho chữ ký trong hợp đồng
            } else {
              _obj['id'] = 'signer-' + index + '-index-' + (element.sign_config.length) + '_' + element.id;
            }
            element['sign_config'].push(_obj);
          }
        })
        this.signCurent = this.convertToSignConfig().filter((p: any) => !p.position)[0];
      } else {
        this.signCurent = this.convertToSignConfig().filter((p: any) => p.id == id)[0];
      }

      if (this.signCurent) {
        if (!this.objDrag[this.signCurent['id']]) {
          this.objDrag[this.signCurent['id']] = {};
        }
        // this.isMove = false;
        let layerX;
        // @ts-ignore
        if ("left" in canvasInfo) {
          layerX = event.rect.left - canvasInfo.left;
        }

        let layerY;
        //@ts-ignore
        if ("top" in canvasInfo) {
          layerY = canvasInfo.top <= 0 ? event.rect.top + Math.abs(canvasInfo.top) : event.rect.top - Math.abs(canvasInfo.top);//;//15;
        }

        let pages = event.relatedTarget.id.split("-");
        let page = Helper._attemptConvertFloat(pages[pages.length - 1]);
        // @ts-ignore
        if (page > 1) {
          // @ts-ignore
          for (let i = 1; i < page; i++) {
            let canvasElement = document.getElementById("canvas-step3-" + i);
            // @ts-ignore
            let canvasInfo = canvasElement.getBoundingClientRect();
            layerY += canvasInfo.height + 2;
          }
          // @ts-ignore
          layerY += page / 3;
        }
        let _array = Object.values(this.obj_toa_do);
        this.cdRef.detectChanges(); // render lại view
        let _sign = <HTMLElement>document.getElementById(this.signCurent['id']);
        if (_sign) {
          _sign.style.transform = "translate(" + layerX + "px," + layerY + "px)";

          this.signCurent['dataset_x'] = layerX;
          this.signCurent['dataset_y'] = layerY;
          _sign.setAttribute("data-x", layerX + "px");
          _sign.setAttribute("data-y", layerY + "px");
          this.objSignInfo.traf_x = layerX;
          this.objSignInfo.traf_y = layerY;
          this.tinhToaDoSign(event.relatedTarget.id, this.signCurent.offsetWidth, this.signCurent.offsetHeight, this.objSignInfo);
          this.signCurent.position = _array.join(",");
          _sign.style.display = '';
          // @ts-ignore
          _sign.style["z-index"] = '1';


        }
        this.objSignInfo.traf_x = Math.round(this.signCurent['dataset_x']);
        this.objSignInfo.traf_y = Math.round(this.signCurent['dataset_y']);
        this.tinhToaDoSign(event.relatedTarget.id, event.rect.width, event.rect.height, this.objSignInfo);
        this.signCurent['position'] = _array.join(",");
        this.signCurent['left'] = this.obj_toa_do.x1;
        //@ts-ignore
        if ("top" in canvasInfo) {
          this.signCurent['top'] = (event.rect.top - canvasInfo.top).toFixed();
        }
        // lay lai danh sach signer sau khi keo vao hop dong
        this.datas.documents.document_user_sign_clone.forEach((res: any) => {
          if (res.sign_config.length > 0) {
            let arrSignConfigItem = res.sign_config;
            arrSignConfigItem.forEach((element:any) => {
              if (element.id == this.signCurent['id']) {

                let _arrPage = event.relatedTarget.id.split("-");
                element['number'] = _arrPage[_arrPage.length - 1];
                element['position'] = this.signCurent['position'];
                element['dataset_x'] = this.signCurent['dataset_x'];
                element['dataset_y'] = this.signCurent['dataset_y'];
                if (!this.objDrag[this.signCurent['id']].count) {
                  element['offsetWidth'] = this.datas.configs.e_document.format_signature_image.signature_width;
                  //element['offsetHeight'] = this.datas.configs.e_document.format_signature_image.signature_height;
                  this.objDrag[this.signCurent['id']].count = 2;
                } else {
                  element['offsetWidth'] = event.target.offsetWidth;
                  element['offsetHeight'] = event.target.offsetHeight;
                }
              }
            })
          }

        });
      }
    } else {
      if (event.type == 'dragend') {
        if (!event.dragenter && event.target.id.includes("chua-keo")) {
          event.target.style.webkitTransform = event.target.style.transform = 'none';
          event.target.setAttribute('data-x', 0);
          event.target.setAttribute('data-y', 0);

        } else if (!event.dragenter && !event.target.id.includes("chua-keo")) {
          let id = event.target.id;
          let signCurent = this.convertToSignConfig().filter((p: any) => p.id == id)[0];
          // translate the element
          if (signCurent) {
            event.target.style.webkitTransform = event.target.style.transform = 'translate(' + signCurent['dataset_x'] + 'px, ' + signCurent['dataset_y'] + 'px)'
            // update the posiion attributes
            event.target.setAttribute('data-x', signCurent['dataset_x'])
            event.target.setAttribute('data-y', signCurent['dataset_y'])
          }
        }
      }
    }
  }

  tinhToaDoSign(idCanvas:any, signWidth:any, signHeight:any, objTranf?:any) {
    let _arrPage = idCanvas.split("-");
    let page = _arrPage[_arrPage.length - 1];
    let traf_x = objTranf ? objTranf.traf_x : this.objSignInfo.traf_x;
    let traf_y = objTranf ? objTranf.traf_y : this.objSignInfo.traf_y;

    this.obj_toa_do.x1 = Math.round(traf_x);
    if (this.obj_toa_do.x1 < 0)
      this.obj_toa_do.x1 = 0;
    if (page > 1) {
      let canvasElementCurent = document.getElementById(idCanvas);
      // @ts-ignore
      let canvasInfoCurent = canvasElementCurent.getBoundingClientRect();
      let heightTotal = traf_y;
      for (let i = 1; i < page; i++) {
        let canvasElement = document.getElementById("canvas-step3-" + i);
        // @ts-ignore
        let canvasInfo = canvasElement.getBoundingClientRect();
        heightTotal -= canvasInfo.height + 2;
      }
      this.obj_toa_do.y1 = Math.round(canvasInfoCurent.height - heightTotal - signHeight + page / 3);

    } else {
      let canvasElement = document.getElementById("canvas-step3-1");
      // @ts-ignore
      let canvasInfo = canvasElement.getBoundingClientRect();
      this.obj_toa_do.y1 = Math.round(canvasInfo.height - traf_y - signHeight);

    }
    if (this.obj_toa_do.y1 < 0)
      this.obj_toa_do.y1 = 0;
    this.obj_toa_do.x2 = Math.round(this.obj_toa_do.x1 + signWidth);
    this.obj_toa_do.y2 = Math.round(this.obj_toa_do.y1 + signHeight);
    let _array = Object.values(this.obj_toa_do);
    return _array.join(",");
  }

  dragMoveListener = (event: any) => {
    // this.objSignInfo.id = event.currentTarget.id;
    var target = event.target
    // this.isMove = true;
    // // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    // // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    // // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y);
    //this.objSignInfo.traf_x = x;
    //this.objSignInfo.traf_y = y;
  }

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
    if (!this.datas.isView) {
      this.objDrag = {};
      // this.datas.documents.document_user_sign_clone.forEach(element => {
      //   // if (this.datas.documents.document.sign_position_type == 'DEFAULT') {
      //   //   this.objDrag[element.id] = {
      //   //     count: 0
      //   //   }
      //   // } else {
      //   if (element.sign_config.length > 0) {
      //     let arrSignConfigItem = element.sign_config;
      //     arrSignConfigItem.forEach(item => {
      //       if (item['position']) {
      //         this.objDrag[item.id] = {
      //           count: 2
      //         }
      //       }
      //     })
      //   }
      //   // }
      //
      //
      // });
    }
  }

  setPosition() {
    // if (this.convertToSignConfig().length > 0) {
    //   this.convertToSignConfig().forEach(element => {
    //     let a = document.getElementById(element.id);
    //     if (a) {
    //       if (element['position'])
    //         a.style["z-index"] = '1';
    //       // else
    //       //   a.style.display = 'none';
    //       a.setAttribute("data-x", element['dataset_x']);
    //       a.setAttribute("data-y", element['dataset_y']);
    //     }
    //   });
    // }
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
          document.getElementById('thumbnail-canvas').scrollTop = $(selector).offset().top - 95;
        }
      });
    });
  }


  changePosition(d?: any) {
    let style: any = {"transform": 'translate(' + d['dataset_x'] + 'px, ' + d['dataset_y'] + 'px)'}
    // if (d['offsetWidth']) {
    //
    //   if (d.sign_unit == 'BEN_NHAN') {
    //     if (d.sign_type == 'OTP') {
    //       style.width = (parseInt(d['offsetWidth'])) + "px";
    //     } else style.width = parseInt(d['offsetWidth']) + "px";
    //   } else {
    //     style.width = parseInt(d['offsetWidth']) + "px";
    //   }
    //
    // } else {
    //   if (this.datas.configs.e_document.format_signature_image.signature_width) {
    //     style.width = parseInt(this.datas.configs.e_document.format_signature_image.signature_width) + "px";
    //   }
    // }
    //
    // if (d['offsetHeight']) {
    //   if (d.sign_unit == 'BEN_NHAN') {
    //     if (d.sign_type == 'OTP') style.height = "";
    //     else style.height = parseInt(d['offsetHeight']) + "px";
    //   } else style.height = parseInt(d['offsetHeight']) + "px";
    // } else {
    //   if (this.datas.configs.e_document.format_signature_image.signature_height) {
    //     if (this.datas.configs.e_document.signature_display_type == "sign1"
    //       || this.datas.configs.e_document.signature_display_type == "sign4") {
    //     } //else
    //   }
    // }
    style.width = '180px';
    style.height = '102px';
    style.position = "absolute";
    return style;
  }


  changeColorDrag(role: any, isDaKeo?: any) {
    if (isDaKeo) {
      // if (role == 'BEN_LAP') {
        return 'employer-ck-da-keo';
      // } else {
      //   return 'staff-ck-da-keo';
      // }
    } else {
      // if (role == 'BEN_LAP') {
        return 'employer-ck';
      // } else {
      //   return 'staff-ck';
      // }
    }
  }

  onCancel(e: any, data: any) {
    this.datas.documents.document_user_sign_clone.forEach((element: any, user_sign_index: any) => {
      if (element.sign_config.length > 0) {
        element.sign_config = element.sign_config.filter((item: any) => item.id != data.id)
        element.sign_config.forEach((itemSign: any, sign_config_index: any) => {
          itemSign['id'] = 'signer-' + user_sign_index + '-index-' + sign_config_index + '_' + element.id;
        })
      }
    });
    this.eventMouseover();
    this.cdRef.detectChanges();
  }

  convertToSignConfig() {
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datas.documents.document_user_sign_clone];
    cloneUserSign.forEach(element => {
      element.sign_config.forEach((key: any) => {
        key['sign_type'] = element['sign_type'];
      })
      arrSignConfig = arrSignConfig.concat(element.sign_config);
    })
    return arrSignConfig;
  }

}
