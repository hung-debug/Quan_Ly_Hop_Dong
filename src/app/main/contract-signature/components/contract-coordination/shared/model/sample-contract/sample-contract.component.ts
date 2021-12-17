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
import {variable} from "../../../../../../../config/variable";
import {Helper} from "../../../../../../../core/Helper";
import {environment} from "../../../../../../../../environments/environment";
import * as $ from 'jquery';

import interact from 'interactjs'
import {ContractService} from "../../../../../../../service/contract.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../../../../service/toast.service";

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
    height: 0,
    width: 0
  }

  list_sign_name: any = [];
  signCurent: any;

  isView: any;
  countAttachFile = 0;
  widthDrag: any;

  isEnableSelect: boolean = true;
  isEnableText: boolean = false;
  isChangeText: boolean = false;

  dataSignPosition: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
  ) {
    this.step = variable.stepSampleContract.step3
  }

  ngOnInit() {
    console.log(this.datas);
    this.datas.contract_user_sign = this.contractService.objDefaultSampleContract().contract_user_sign;

    // cập nhật defind dữ liệu
    let dataPosition: any[] = [];
    let dataNotPosition: any[] = [];
    this.datas.determine_contract.forEach((res: any) => {
      res.recipients.forEach((element: any) => {
        let data_duplicate = this.datas.is_data_object_signature.filter((p: any) => p.recipient_id == element.id)[0];
        if (data_duplicate) {
          // lấy ra dữ liệu bị trùng và update lại với dữ liệu mới;
          data_duplicate.name = element.name;
          data_duplicate.email = element.email;
          data_duplicate.phoneNumber = element.phoneNumber;
          data_duplicate.sign_type = element.sign_type;
          data_duplicate.is_otp = element.is_otp;
          data_duplicate['is_type_party'] = res.type;
          data_duplicate['role'] = data_duplicate.recipient.role;
          dataPosition.push(data_duplicate)
        } else {
          element['is_type_party'] = res.type;
          element['role'] = element.role;
          dataNotPosition.push(element)
        }
      })
    })

    console.log(dataNotPosition, dataPosition);

    let data_sign_position = dataPosition.filter((p: any) => p.role != 1);
    let dataNotSignPosition = dataNotPosition.filter((p: any) => p.role != 1);
    this.dataSignPosition = [...data_sign_position, ...dataNotSignPosition];

    this.dataSignPosition.forEach((res: any) => {
      if (res.sign_unit == 'text') {
        res['text_attribute_name'] = res.name;
      }
    })

    let data_sign_config_cks = this.dataSignPosition.filter((p: any) => p.sign_unit == 'chu_ky_so');
    let data_sign_config_cka = this.dataSignPosition.filter((p: any) => p.sign_unit == 'chu_ky_anh');
    let data_sign_config_text = this.dataSignPosition.filter((p: any) => p.sign_unit == 'text');
    let data_sign_config_so_tai_lieu = this.dataSignPosition.filter((p: any) => p.sign_unit == 'so_tai_lieu');

    this.datas.contract_user_sign = this.contractService.getDataFormatContractUserSign();

    this.datas.contract_user_sign.forEach((element: any) => {
      if (element.sign_unit == 'so_tai_lieu') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_so_tai_lieu);
      } else if (element.sign_unit == 'chu_ky_so') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_cks);
      } else if (element.sign_unit == 'text') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_text);
      } else if (element.sign_unit == 'chu_ky_anh') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_cka);
      }
    })

    console.log(this.datas.contract_user_sign)
    this.scale = 1;

    // this.list_sign_name.forEach((item: any) => {
    //   item['selected'] = false;
    // })
    if (this.dataSignPosition && this.dataSignPosition.length > 0) {
      // let data_list_user_sign: any[] = [];
      let data_user_sign = [...this.dataSignPosition];
      data_user_sign.forEach((element: any) => {
        if (element.is_type_party == 1) {
          // element.recipients.forEach((item: any) => {
          if (element.role == 3 || element.role == 4 || element.role == 2) {
            element['type_unit'] = 'organization';
            element['selected'] = false;
            element['is_disable'] = false;
            // item['type'] = element.type;
            this.list_sign_name.push(element);
          }
          // })
        } else if (element.is_type_party == 2 || element.is_type_party == 3) {
          // element.recipients.forEach((item: any) => {
          if (element.role == 3 || element.role == 4 || element.role == 2) {
            element['type_unit'] = 'partner'
            element['selected'] = false;
            element['is_disable'] = false;
            // element['type'] = element.type;
            this.list_sign_name.push(element);
          }
          // })
        }
      })
      // this.getListSignName(data_list_user_sign);
    }

    console.log(this.list_sign_name)


    if (!this.signCurent) {
      this.signCurent = {
        width: 0,
        height: 0
      }
    }

    // convert base64 file pdf to url
    this.pdfSrc = this.datas.i_data_file_contract[0].path;
    // this.pdfSrc = Helper._getUrlPdf(environment.base64_file_content_demo);
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

  getListSignName(listSignForm: any = []) {
    listSignForm.forEach((item: any) => {
      item['selected'] = false;
      // item['sign_unit'] = type_unit;
      // item['signType'] = item.signType;
      item['is_disable'] = false;
      this.list_sign_name.push(item)
    })
  }

  resizeSignature = (event: any) => {
    let x = (parseFloat(event.target.getAttribute('data-x')) || 0)
    let y = (parseFloat(event.target.getAttribute('data-y')) || 0)
    // translate when resizing from top or left edges
    this.signCurent = this.convertToSignConfig().filter((p: any) => p.id == event.target.id)[0];
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
        this.tinhToaDoSign("canvas-step3-" + this.signCurent.page, this.signCurent.width, this.signCurent.height, this.objSignInfo);
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
              text_attribute_name: element.text_attribute_name,
              required: 1
            }
            if (element.sign_config.length == 0) {
              _obj['id'] = 'signer-' + index + '-index-0_' + element.id; // Thêm id cho chữ ký trong hợp đồng
            } else {
              _obj['id'] = 'signer-' + index + '-index-' + (element.sign_config.length) + '_' + element.id;
            }
            element['sign_config'].push(_obj);
          }
        })
        this.signCurent = this.convertToSignConfig().filter((p: any) => !p.position && !p.coordinate_x && !p.coordinate_y)[0];
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
          this.signCurent['coordinate_x'] = layerX;
          this.signCurent['coordinate_y'] = layerY;
          _sign.setAttribute("data-x", layerX + "px");
          _sign.setAttribute("data-y", layerY + "px");
          this.objSignInfo.traf_x = layerX;
          this.objSignInfo.traf_y = layerY;
          //
          this.objSignInfo['id'] = this.signCurent['id'];
          //
          this.tinhToaDoSign(event.relatedTarget.id, this.signCurent.width, this.signCurent.height, this.objSignInfo);
          this.signCurent.position = _array.join(",");
          _sign.style.display = '';
          // @ts-ignore
          _sign.style["z-index"] = '1';
          this.isEnableSelect = false;

          // show toa do keo tha chu ky (demo)
          // this.location_sign_x = this.signCurent['coordinate_x'];
          // this.location_sign_y  = this.signCurent['coordinate_y'];
        }

        this.objSignInfo.traf_x = Math.round(this.signCurent['coordinate_x']);
        this.objSignInfo.traf_y = Math.round(this.signCurent['coordinate_y']);

        this.tinhToaDoSign(event.relatedTarget.id, event.rect.width, event.rect.height, this.objSignInfo);
        this.signCurent['position'] = _array.join(",");
        this.signCurent['left'] = this.obj_toa_do.x1;
        //@ts-ignore
        if ("top" in canvasInfo) {
          this.signCurent['top'] = (event.rect.top - canvasInfo.top).toFixed();
        }
        let name_accept_signature = '';
        // lay lai danh sach signer sau khi keo vao hop dong
        this.datas.contract_user_sign.forEach((res: any) => {
          if (res.sign_config.length > 0) {
            let arrSignConfigItem = res.sign_config;
            arrSignConfigItem.forEach((element: any) => {
              if (element.id == this.signCurent['id']) {
                let _arrPage = event.relatedTarget.id.split("-");
                // gán hình thức kéo thả => disable element trong list sign
                name_accept_signature = res.sign_unit;
                // hiển thị ô nhập tên trường khi kéo thả đối tượng Text
                if (res.sign_unit == 'text') {
                  this.isEnableText = true;
                  setTimeout(() => {
                    //@ts-ignore
                    document.getElementById('text-input-element').focus();
                  }, 10)
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
                  if (res.sign_unit == 'text' || res.sign_unit == 'so_tai_lieu') {
                    element['width'] = '135';
                    element['height'] = '28';
                  } else {
                    element['width'] = '135';
                    element['height'] = '85';
                  }
                  this.objSignInfo.width = element['width'];
                  this.objSignInfo.height = element['height'];
                  this.objSignInfo.text_attribute_name = '';
                  this.list_sign_name.forEach((item: any) => {
                    item['selected'] = false;
                  })
                  // document.getElementById('select-dropdown'). = 0;
                  // @ts-ignore
                  document.getElementById('select-dropdown').value = "";
                  this.objDrag[this.signCurent['id']].count = 2;
                } else {
                  element['width'] = event.target.offsetWidth;
                  element['height'] = event.target.offsetHeight;
                }
              }
            })
          }
        });
        this.list_sign_name.forEach((element: any) => {
          if (name_accept_signature == 'chu_ky_anh') {
            if (element.sign_type.some((p: any) => p.id == 1) && element.role != 2) {
              element.is_disable = false;
            } else element.is_disable = true;
          } else if (name_accept_signature == 'chu_ky_so') {
            if (element.sign_type.some((p: any) => p.id == 2) && element.role != 2) {
              element.is_disable = false;
            } else element.is_disable = true;
          } else element.is_disable = false;
        })
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
            event.target.style.webkitTransform = event.target.style.transform = 'translate(' + signCurent['coordinate_x'] + 'px, ' + signCurent['coordinate_y'] + 'px)'
            // update the posiion attributes
            event.target.setAttribute('data-x', signCurent['coordinate_x'])
            event.target.setAttribute('data-y', signCurent['coordinate_y'])
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
    if (d['width']) {
      style.width = parseInt(d['width']) + "px";
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
    if (d['height']) {
      style.height = parseInt(d['height']) + "px";
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
      // this.objSignInfo.width = set_id.width;
      // this.objSignInfo.height = set_id.width;
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

        this.objSignInfo.width = parseInt(d.width);
        this.objSignInfo.height = parseInt(d.height);

        this.isEnableText = d.sign_unit == 'text';
        this.isChangeText = d.sign_unit == 'so_tai_lieu';
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name
        }
      }

      // for để set lại list đối tượng ký
      this.list_sign_name.forEach((item: any) => {
        // if (item.id == d.id) {
        if (d.sign_unit == 'chu_ky_anh') {
          if (item.sign_type.some((p: any) => p.id == 1) && item.role != 2) {
            item.is_disable = false;
          } else item.is_disable = true;
        } else if (d.sign_unit == 'chu_ky_so') {
          if (item.sign_type.some((p: any) => p.id == 2) && item.role != 2) {
            item.is_disable = false;
          } else item.is_disable = true;
        } else item.is_disable = false;
        if (d.name && item.name == d.name) {
          item.selected = true;
        } else item.selected = false;
      })

      if (!d.name) //@ts-ignore
        document.getElementById('select-dropdown').value = "";

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
    data.coordinate_x = 0;
    data.coordinate_y = 0;
    // data.number = 0;
    data.page = 0;
    data.width = 0;
    data.height = 0;
    data.position = "";
    if (data.sign_unit == 'text') {
      this.isEnableText = false;
    }
    let signElement = document.getElementById(data.id);
    if (signElement) {
      this.objSignInfo.traf_x = 0;
      this.objSignInfo.traf_y = 0;
      this.objSignInfo.height = 0;
      this.objSignInfo.width = 0;
      //@ts-ignore
      document.getElementById('select-dropdown').value = "";
      // this.signCurent.width = 0;
      // this.signCurent.height = 0;
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

            isObjSign.signature_party = data_name.type_unit;
            signElement.setAttribute("signature_party", isObjSign.signature_party);

            isObjSign.recipient_id = data_name.id;
            signElement.setAttribute("recipient_id", isObjSign.recipient_id);

            isObjSign.status = data_name.status;
            signElement.setAttribute("status", isObjSign.status);

            isObjSign.type = data_name.type;
            signElement.setAttribute("type", isObjSign.type);
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
      let data_sample_contract: string | any[] = [];
      let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "value"];
      this.datas.contract_user_sign.forEach((element: any) => {
        if (element.sign_config.length > 0) {
          element.sign_config.forEach((item: any) => {
            item['font'] = 'Arial';
            item['font_size'] = 14;
            item['contract_id'] = this.datas.data_contract_document_id.contract_id;
            item['document_id'] = this.datas.data_contract_document_id.document_id;
            if (item.text_attribute_name) {
              item.name = item.text_attribute_name;
            }
            if (item.sign_unit == 'chu_ky_anh') {
              item['type'] = 2;
            } else if (item.sign_unit == 'chu_ky_so') {
              item['type'] = 3;
            } else if (item.sign_unit == 'so_tai_lieu') {
              item['type'] = 4;
            } else {
              item['type'] = 1;
            }
            // item['recipient_id'] = element.id;
            data_remove_arr_request.forEach((itemRemove: any) => {
              delete item[itemRemove];
            })
          })
          Array.prototype.push.apply(data_sample_contract, element.sign_config);
        }
      })

      console.log(data_sample_contract);
      this.contractService.getContractSample(data_sample_contract).subscribe((data) => {
          console.log(JSON.stringify(data));
          this.datas.is_data_object_signature = data_sample_contract;
          this.step = variable.stepSampleContract.step4;
          this.datas.stepLast = this.step
          this.nextOrPreviousStep(this.step);

        },
        error => {
          console.log("false connect file");
          return false;
        }
      );
      // Đây là dữ liệu mảng request truyền lên cho server


    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.datas.stepLast = step;
    this.stepChangeSampleContract.emit(step);
  }

  validData() {
    // console.log(this.datas);
    let data_not_drag = this.datas.contract_user_sign.filter((p: any) => p.sign_config.length > 0)[0];
    if (!data_not_drag) {
      this.spinner.hide();
      this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn ít nhất 1 đối tượng kéo thả!", "", 10000);
      // alert('Vui lòng chọn ít nhất 1 đối tượng kéo thả!')
      return false;
    } else {
      let count = 0;
      let count_text = 0;
      let arrSign_organization: { name: any; signature_party: any; }[] = [];
      let arrSign_partner: { name: any; signature_party: any; }[] = [];

      for (let i = 0; i < this.datas.contract_user_sign.length; i++) {
        if (this.datas.contract_user_sign[i].sign_config.length > 0) {
          for (let j = 0; j < this.datas.contract_user_sign[i].sign_config.length; j++) {
            let element = this.datas.contract_user_sign[i].sign_config[j];
            if (!element.name) {
              count++;
              break
            } else if (element.sign_unit == 'text' && !element.text_attribute_name) {
              count_text++;
              break
            } else {
              let data_sign = {
                name: element.name,
                signature_party: element.signature_party
              }
              if (element.signature_party == "organization")
                arrSign_organization.push(data_sign);
              else arrSign_partner.push(data_sign);
            }
          }
        }
      }

      if (count > 0) {
        // alert('Vui lòng chọn người ký cho đối tượng đã kéo thả!')
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn người ký cho đối tượng đã kéo thả!", "", 10000);
        return false;
      } else if (count_text > 0) {
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Thiếu tên trường cho đối tượng nhập Text!", "", 10000);
        return false;
      } else {
        let data_organization = this.list_sign_name.filter((p: any) => p.type_unit == "organization" && p.role != 2);
        // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
        if (arrSign_organization.length < data_organization.length) {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Thiếu đối tượng ký của tổ chức, vui lòng chọn đủ người ký!", "", 10000);
          return false;
        }

        if (!arrSign_organization.some((p: any) => p.role == 3)) {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Thiếu đối tượng người ký của tổ chức, vui lòng chọn đối tượng ký!", "", 10000);
          return false;
        } else if (!arrSign_organization.some((p: any) => p.role == 4)) {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Thiếu đối tượng ký văn thư của tổ chức, vui lòng chọn đối tượng ký!", "", 10000);
          return false;
        }

        let data_partner = this.list_sign_name.filter((p: any) => p.type_unit == "partner" && p.role != 2);
        // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
        if (arrSign_partner.length < data_partner.length) {
          // alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!');
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!", "", 10000);
          return false;
        }

        if (!arrSign_partner.some((p: any) => p.role == 3)) {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Thiếu đối tượng người ký của đối tác, vui lòng chọn đối tượng ký!", "", 10000);
          return false;
        } else if (!arrSign_partner.some((p: any) => p.role == 4)) {
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout("Thiếu đối tượng ký văn thư của đối tác, vui lòng chọn đối tượng ký!", "", 10000);
          return false;
        }

      }
    }
    return true;
  }

  getName(data: any) {
    if (data.type_unit == 'organization') {
      return 'Tổ chức của tôi - ' + data.name;
    } else if (data.type_unit == 'partner') {
      return 'Đối tác - ' + data.name;
    }
  }

}
