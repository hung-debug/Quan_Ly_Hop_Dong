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
import {variable} from "../../../../../config/variable";
import {Helper} from "../../../../../core/Helper";
import {environment} from "../../../../../../environments/environment";
import * as $ from 'jquery';

import interact from 'interactjs'
import {ContractService} from "../../../../../service/contract.service";

@Component({
  selector: 'app-sample-contract',
  templateUrl: './sample-contract.component.html',
  styleUrls: ['./sample-contract.component.scss']
})
export class SampleContractComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() datas: any;
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
  // list_sign_name: any = [
  //   {name: "Đỗ Thành Dương", id: "1"},
  //   {name: "Đỗ Thanh Dương", id: "2"},
  //   {name: "Phạm Văn Luân", id: "3"},
  //   {name: "Phạm Văn Lâm", id: "4"}
  // ];

  list_sign_name: any = [];
  signCurent: any;

  isView: any;
  countAttachFile = 0;
  widthDrag: any;

  isEnableSelect: boolean = true;
  isEnableText: boolean = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService
  ) {
    this.step = variable.stepSampleContract.step3
  }

  ngOnInit() {
    // console.log(this.datas);

    this.datas.contract_user_sign = this.contractService.objDefaultSampleContract().contract_user_sign;

    // console.log(this.datas.contract_user_sign)
    this.scale = 1;
    this.datas.contract_user_sign.forEach((item: any) => {
      if (item['sign_config'] && typeof (item["sign_config"]) == 'string') {
        item['sign_config'] = JSON.parse(item['sign_config']);
      }
    })

    // this.list_sign_name.forEach((item: any) => {
    //   item['selected'] = false;
    // })
    if (this.datas.userForm.userSigns && this.datas.userForm.userSigns.length > 0) {
      this.datas.userForm.userSigns.forEach((item: any) => {
        item['selected'] = false;
        item['sign_unit'] = 'organization'
        this.list_sign_name.push(item)
      })
    }

    if (this.datas.partners.partnerSigns && this.datas.partners.partnerSigns.length > 0) {
      this.datas.partners.partnerSigns.forEach((item: any) => {
        item['selected'] = false;
        item['sign_unit'] = 'partner'
        this.list_sign_name.push(item)
      })
    } else if (this.datas.partners.partnerUsers && this.datas.partners.partnerUsers.length > 0) {
      this.datas.partners.partnerUsers.forEach((item: any) => {
        item['selected'] = false;
        item['sign_unit'] = 'partner'
        this.list_sign_name.push(item)
      })
    }

    if (!this.signCurent) {
      this.signCurent = {
        offsetWidth: 0,
        offsetHeight: 0
      }

    }

    // convert base64 file pdf to url
    this.pdfSrc = Helper._getUrlPdf(this.datas.file_content);
    // render pdf to canvas
    this.getPage();

    // event drag and drop
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
      edges: {right: true, bottom: true}, // Cho phép resize theo chiều nào.
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

    // event resize element
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
    this.signCurent = this.convertToSignConfig().filter((p: any) => p.id == event.target.id)[0];
    if (this.signCurent) {
      if (event.rect.width <= 280) {
        this.signCurent.dataset_x = x;
        this.signCurent.dataset_y = y;
        this.objSignInfo.id = event.target.id;
        this.objSignInfo.traf_x = x;
        this.objSignInfo.traf_y = y;
        this.objSignInfo.offsetWidth = event.rect.width;
        this.objSignInfo.offsetHeight = event.rect.height;

        this.signCurent.offsetWidth = event.rect.width;
        this.signCurent.offsetHeight = event.rect.height;
        console.log(this.signCurent, this.objSignInfo)
        this.tinhToaDoSign("canvas-step3-" + this.signCurent.page, this.signCurent.offsetWidth, this.signCurent.offsetHeight, this.objSignInfo);
        let _array = Object.values(this.obj_toa_do);
        this.signCurent.position = _array.join(",");
      }
    }
  }

  resizableListener = (event: any) => {
    var target = event.target

    // update the element's style
    target.style.width = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'

  }


  // Hàm showEventInfo là event khi thả (nhả click chuột) đối tượng ký vào canvas, sẽ chạy vào hàm.
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
        this.datas.contract_user_sign.forEach((element: any, index: any) => {
          if (element.id == id) {
            let _obj: any = {
              sign_unit: element.sign_unit,
              name: element.name,
              text_attribute_name: element.text_attribute_name
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
          layerY = canvasInfo.top <= 0 ? event.rect.top + Math.abs(canvasInfo.top) : event.rect.top - Math.abs(canvasInfo.top);
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
          //
          this.objSignInfo['id'] = this.signCurent['id'];
          //
          this.tinhToaDoSign(event.relatedTarget.id, this.signCurent.offsetWidth, this.signCurent.offsetHeight, this.objSignInfo);
          this.signCurent.position = _array.join(",");
          _sign.style.display = '';
          // @ts-ignore
          _sign.style["z-index"] = '1';
          this.isEnableSelect = false;

          // show toa do keo tha chu ky (demo)
          // this.location_sign_x = this.signCurent['dataset_x'];
          // this.location_sign_y  = this.signCurent['dataset_y'];
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
        this.datas.contract_user_sign.forEach((res: any) => {
          if (res.sign_config.length > 0) {
            let arrSignConfigItem = res.sign_config;
            arrSignConfigItem.forEach((element: any) => {
              if (element.id == this.signCurent['id']) {
                let _arrPage = event.relatedTarget.id.split("-");
                // hiển thị ô nhập tên trường khi kéo thả đối tượng Text
                if (res.sign_unit == 'text') {
                  this.isEnableText = true;
                  setTimeout(() => {
                    //@ts-ignore
                    document.getElementById('text-input-element').focus();
                  }, 10)
                } else this.isEnableText = false;
                element['number'] = _arrPage[_arrPage.length - 1];
                element['position'] = this.signCurent['position'];
                element['dataset_x'] = this.signCurent['dataset_x'];
                element['dataset_y'] = this.signCurent['dataset_y'];
                if (!this.objDrag[this.signCurent['id']].count) {
                  // element['offsetWidth'] = this.datas.configs.e_document.format_signature_image.signature_width;
                  if (res.sign_unit == 'text' || res.sign_unit == 'so_tai_lieu') {
                    element['offsetWidth'] = '135';
                    element['offsetHeight'] = '28';
                  } else {
                    element['offsetWidth'] = '135';
                    element['offsetHeight'] = '85';
                  }
                  this.objSignInfo.offsetWidth = element['offsetWidth'];
                  this.objSignInfo.offsetHeight = element['offsetHeight'];
                  // this.objSignInfo.text_attribute_name = 'hello';
                  this.list_sign_name.forEach((item: any) => {
                    item['selected'] = false;
                  })
                  // document.getElementById('select-dropdown'). = 0;
                  // @ts-ignore
                  document.getElementById('select-dropdown').value = "";
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

  // Hàm tính tọa độ ký
  tinhToaDoSign(idCanvas: any, signWidth: any, signHeight: any, objTranf?: any) {
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

  // Hàm event khi bắt đầu kéo (drag) đối tượng ký
  dragMoveListener = (event: any) => {
    this.objSignInfo.id = event.currentTarget.id;
    var target = event.target
    this.isMove = true;
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
    if (!this.datas.isView) {
      this.objDrag = {};
      let count_total = 0;
      this.datas.contract_user_sign.forEach((element: any) => {
        if (element.sign_config.length > 0) {
          let arrSignConfigItem = element.sign_config;
          arrSignConfigItem.forEach((item: any) => {
            if (item['position']) {
              this.objDrag[item.id] = {
                count: 2
              }
              count_total++;
            }
          })
        }
      });
      if (count_total == 0) {
        this.isEnableSelect = true;
        this.isEnableText = false;
        //@ts-ignore
        document.getElementById('select-dropdown').value = "";
      }
    }
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

    // if (sizeChange == "width" && e) {
    //   let signElement = document.getElementById(this.objSignInfo.id);
    //   if (signElement) {
    //     let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
    //     if (isObjSign) {
    //       if (sizeChange == 'width') {
    //         style.width = parseInt(e) + 'px';
    //       } else {
    //         style.height = parseInt(e) + 'px';
    //       }
    //     }
    //   }
    // } else {
    if (d['offsetWidth']) {
      style.width = parseInt(d['offsetWidth']) + "px";
    }
    // }

    // if (sizeChange == "height" && e) {
    //   let signElement = document.getElementById(this.objSignInfo.id);
    //   if (signElement) {
    //     let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
    //     if (isObjSign) {
    //       if (sizeChange == 'width') {
    //         style.width = parseInt(e) + 'px';
    //       } else {
    //         style.height = parseInt(e) + 'px';
    //       }
    //     }
    //   }
    // } else {
    if (d['offsetHeight']) {
      style.height = parseInt(d['offsetHeight']) + "px";
    }
    // }

    return style;
  }

  // Hàm thay đổi kích thước màn hình => scroll thuộc tính hiển thị kích thước và thuộc tính
  // @ts-ignore
  changeDisplay() {
    if (window.innerHeight < 670) {
      return {
        "overflow": "auto",
        "height": "calc(50vh - 100px)"
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
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name
        }
      }
      if (d.name) {
        this.list_sign_name.forEach((item: any) => {
          // if (item.id == d.id) {
          if (item.name == d.name) {
            item.selected = true;
          } else item.selected = false;
        })
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

  // Hàm remove đối tượng đã được kéo thả vào trong file hợp đồng canvas
  onCancel(e: any, data: any) {
    data.dataset_x = 0;
    data.dataset_y = 0;
    data.number = 0;
    data.offsetWidth = 0;
    data.offsetHeight = 0;
    data.position = "";
    let signElement = document.getElementById(data.id);
    if (signElement) {
      this.objSignInfo.traf_x = 0;
      this.objSignInfo.traf_y = 0;
      this.objSignInfo.offsetHeight = 0;
      this.objSignInfo.offsetWidth = 0;
      //@ts-ignore
      document.getElementById('select-dropdown').value = "";
      // this.signCurent.offsetWidth = 0;
      // this.signCurent.offsetHeight = 0;
    }
    this.datas.contract_user_sign.forEach((element: any, user_sign_index: any) => {
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

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datas.contract_user_sign];
    cloneUserSign.forEach(element => {
      arrSignConfig = arrSignConfig.concat(element.sign_config);
    })
    return arrSignConfig;
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
    console.log(e, property);
    let signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
      if (isObjSign) {
        if (property == 'location') {
          if (locationChange == 'x') {
            isObjSign.dataset_x = parseInt(e);
            signElement.setAttribute("data-x", isObjSign.dataset_x);
          } else {
            isObjSign.dataset_y = parseInt(e);
            signElement.setAttribute("data-y", isObjSign.dataset_y);
          }
        } else if (property == 'size') {
          if (locationChange == 'width') {
            isObjSign.offsetWidth = parseInt(e);
            signElement.setAttribute("width", isObjSign.offsetWidth);
          } else {
            isObjSign.offsetHeight = parseInt(e);
            signElement.setAttribute("height", isObjSign.offsetHeight);
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
        console.log(this.signCurent)
        console.log(this.objSignInfo)
      }
    }
  }

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

  back(e: any, step?: any) {
    // if (!this.datas.isView) {
    this.nextOrPreviousStep(step);
  }

  next() {
    if (!this.validData()) return;
    else {
      console.log(this.datas);
      this.step = variable.stepSampleContract.step4;
      this.datas.stepLast = this.step
      this.nextOrPreviousStep(this.step);
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeSampleContract.emit(step);
  }

  validData() {
    let data_not_drag = this.datas.contract_user_sign.filter((p: any) => p.sign_config.length > 0)[0];
    if (!data_not_drag) {
      alert('Vui lòng chọn ít nhất 1 đối tượng kéo thả!')
      return false;
    } else {
      let count = 0;
      let arrSign_organization: { name: any; signature_party: any; }[] = [];
      let arrSign_partner: { name: any; signature_party: any; }[] = [];
      this.datas.contract_user_sign.forEach((element: any) => {
        if (element.sign_config.length > 0) {
          element.sign_config.forEach((item: any) => {
            if (!item.name) {
              count++;
            } else {
              let data_sign = {
                name: item.name,
                signature_party: item.signature_party
              }
              if (item.signature_party == "organization")
                arrSign_organization.push(data_sign);
              else arrSign_partner.push(data_sign);
            }
          })
        }
      })
      if (count > 0) {
        alert('Vui lòng chọn người ký cho đối tượng đã kéo thả!')
        return false;
      } else {
        let data_organization = this.list_sign_name.filter((p: any) => p.sign_unit == "organization");
        // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
        if (arrSign_organization.length < data_organization.length) {
          alert('Thiếu đối tượng ký của tổ chức, vui lòng chọn đủ người ký!');
          return false;
        }
        // valid khi kéo kiểu ký vào nhiều hơn list danh sách đối tượng ký.
        // if (arrSign_organization.length >= data_organization.length) {
        //   let total_not_confilic = 0;
        //   data_organization.forEach((item: any) => {
        //     arrSign_organization.forEach((element: any) => {
        //       if (item.name == element.name) {
        //         total_not_confilic++;
        //       }
        //     })
        //   })
        //
        //   if (total_not_confilic > 0) {
        //     alert('Thiếu đối tượng ký của tổ chức, vui lòng chọn đủ người ký!')
        //     return false;
        //   }
        //
        //   // let data_partner = this.list_sign_name.filter((p: any) => p.signature_party == "partner");
        //
        // }

        let data_partner = this.list_sign_name.filter((p: any) => p.sign_unit == "partner");
        // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
        if (arrSign_partner.length < data_partner.length) {
          alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!');
          return false;
        }
        // valid khi kéo kiểu ký vào nhiều hơn list danh sách đối tượng ký.
        // if (arrSign_organization.length >= data_partner.length) {
        //   let total_not_confilic = 0;
        //   data_partner.forEach((item: any) => {
        //     arrSign_organization.forEach((element: any) => {
        //       if (item.name != element.name) {
        //         total_not_confilic++;
        //       }
        //     })
        //   })
        //
        //   if (total_not_confilic > 0) {
        //     alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!')
        //     return false;
        //   }
        // }

      }
    }
    return true;
  }

  getName(data: any) {
    if (data.sign_unit == 'organization') {
      return 'Tổ chức của tôi - ' + data.name;
    } else if (data.sign_unit == 'partner') {
      return 'Đối tác - ' + data.name;
    }
  }

}
