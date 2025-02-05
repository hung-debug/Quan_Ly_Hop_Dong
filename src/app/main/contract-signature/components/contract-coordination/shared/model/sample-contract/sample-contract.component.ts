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
import {HttpErrorResponse} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { DetectCoordinateService } from 'src/app/service/detect-coordinate.service';


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
  thePDF: any = null;
  pageNumber = 1;
  canvasWidth = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  objPdfProperties: any = {
    pages: [],
  };

  pageNum: number = 1;
  page1: boolean = false;
  pageLast: boolean = true;

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
  difX: number;
  arrDifPage: any = [];

  dataSignPosition: any;
  emailUser_sample: string;

  list_font: any;
  textSign: boolean = false;
  selectedTextType = 1;
  list_text_type: any = [
    { id: 1, name: 'default' },
    { id: 2, name: 'currency' },
  ];
  isContractNoNameNull: boolean = false;
  sum: number[] = [];
  top: any[]= [];
  ordering: number = 0;
  constructor(
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private detectCoordinateService: DetectCoordinateService,
    public translate: TranslateService,
  ) {
    this.step = variable.stepSampleContract.step3
  }

  ngOnInit() {
    console.log("điều phối")
    this.emailUser_sample = JSON.parse(localStorage.getItem('currentUser') || '').customer.info.email;
    if (!this.datas['arrDelete']) {
      this.datas.arrDelete = []; // biến arrDelete lưu id các đối tượng bị thay đổi dữ liệu => xoá
    }
    if (!this.datas.contract_user_sign) { // next first step
      this.getDataSignUpdateAction(); // defind data
      this.datas.contract_user_sign = this.contractService.getDataFormatContractUserSign(); // default data signature
      this.setDataSignContract(); // push mảng set dữ liệu ô ký
    } else {
      let isDefindDetermine = _.cloneDeep(this.datas.determine_contract);
      let isCloneDeter = isDefindDetermine.map(({recipients, type}: any) => {
        return recipients;
      });
      let isArrCoordination: any[] = [];
      for (const d of isCloneDeter) {
        if (d.some((p: any) => p.email == this.emailUser_sample)) {
          isArrCoordination = d;
          break;
        }
      }
      // for mảng lọc lại dữ liệu các đối tượng ô ký
      this.datas.contract_user_sign.forEach((res: any) => {
        let data_no_exist = _.cloneDeep(this.getActionNextMore(res, isArrCoordination, false)); // Lấy id các đối tượng bị thay đổi dữ liệu
        if (data_no_exist.length > 0) {
          let defind_data = data_no_exist.map(({id}: any) => {return id}); // lọc id
          Array.prototype.push.apply(this.datas.arrDelete, defind_data) // push arr arrDelete để sang bước 4 xoá dữ liệu ô ký
        }
        res.sign_config = this.getActionNextMore(res, isArrCoordination, true); // mảng dữ liệu ô ký
      })
    }

    this.scale = 1;

    if (this.datas.determine_contract) {
      let data_user_sign = [...this.datas.determine_contract];
      this.getListNameSign(data_user_sign);
    }

    if (!this.signCurent) {
      this.signCurent = {
        width: 0,
        height: 0
      }
    }


    // convert base64 file pdf to url
    let fileContract_1 = this.datas.i_data_file_contract.filter((p: any) => p.type == 1)[0];
    let fileContract_2 = this.datas.i_data_file_contract.filter((p: any) => p.type == 2)[0];
    if (fileContract_2) {
      this.pdfSrc = fileContract_2.path;
    } else {
      this.pdfSrc = fileContract_1.path;
    }

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
      edges: { left: true, right: true, bottom: true, top: true }, // Cho phép resize theo chiều nào.
      listeners: {
        move: this.resizableListener, onend: this.resizeSignature
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: '.drop-zone'
        }),

        // minimum size
        interact.modifiers.restrictSize({
          //min: { width: 100, height: 32 }
        }),
        // interact.modifiers.aspectRatio({
        //   // ratio may be the string 'preserve' to maintain the starting aspect ratio,
        //   // or any number to force a width/height ratio
        //   ratio: 'preserve',
        //   // To add other modifiers that respect the aspect ratio,
        //   // put them in the aspectRatio.modifiers array
        //   modifiers: [
        //     interact.modifiers.restrictEdges({
        //       outer: '.drop-zone'
        //     }),
        //
        //     // minimum size
        //     interact.modifiers.restrictSize({
        //       //min: { width: 100, height: 32 }
        //     })
        //   ]
        // })
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

  onEnter(event: any) {
    let canvas: any = document.getElementById('canvas-step3-'+event.target.value);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);
  }

  firstPage() {
    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, 0);

    this.pageNum = 1;
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

  lastPage() {
    let canvas: any = document.getElementById('canvas-step3-'+this.pageNumber);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);

    this.pageNum = this.pageNumber;
  }

  previousPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  pageRendering:any;
  pageNumPending: any = null;
  queueRenderPage(num: any) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      let canvas: any = document.getElementById('canvas-step3-'+num);

      let canvas1: any = document.getElementById('pdf-viewer-step-3');

      let pdffull: any = document.getElementById('pdf-full');

      pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top)
    }
  }

  onNextPage() {
    if (this.pageNum >= this.thePDF?.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }


  getActionNextMore(res: any, isArrCoordination: any, exist: boolean) {
    if (exist) {
      let data_have_position = res.sign_config.filter((p: any) => isArrCoordination.some((q: any) => q.sign_type && (
        (((p.sign_unit == 'chu_ky_anh' && q.sign_type.some(({id}: any) => id == 1 || id == 5) && p.recipient_id == q.id) ||
          ((p.sign_unit == 'chu_ky_so' && q.sign_type.some(({id}: any) => id == 2 || id == 3 || id == 4 || id == 6 || id == 7 || id == 8) && p.recipient_id == q.id) ||
            (p.sign_unit == 'text' && (q.sign_type.some(({id}: any) => id == 2 || id == 4 || id == 6) || q.role == 4) && p.recipient_id == q.id) ||
            (p.sign_unit == 'so_tai_lieu' && (q.sign_type.some(({id}: any) => id == 2 || id == 4 || id == 6) || q.role == 4) && p.recipient_id == q.id)))))));
      return data_have_position;
    } else {
      let data_have_position = res.sign_config.filter((p: any) => !isArrCoordination.some((q: any) => q.sign_type && (
        (((p.sign_unit == 'chu_ky_anh' && q.sign_type.some(({id}: any) => id == 1 || id == 5) && p.recipient_id == q.id) ||
          ((p.sign_unit == 'chu_ky_so' && q.sign_type.some(({id}: any) => id == 2 || id == 3 || id == 4 || id == 6 || id == 7 || id == 8) && p.recipient_id == q.id) ||
            (p.sign_unit == 'text' && (q.sign_type.some(({id}: any) => id == 2 || id == 4 || id == 6) || q.role == 4) && p.recipient_id == q.id) ||
            (p.sign_unit == 'so_tai_lieu' && (q.sign_type.some(({id}: any) => id == 2 || id == 4 || id == 6) || q.role == 4) && p.recipient_id == q.id)))))));
      return data_have_position;
    }
  }

  getListSignName(listSignForm: any = []) {
    listSignForm.forEach((item: any) => {
      item['selected'] = false;
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
        // giu nguyen w+h o ky khi resize ve min
        if (this.signCurent.sign_unit == 'chu_ky_so' || this.signCurent.sign_unit == 'chu_ky_anh'){
          this.signCurent.width <= 140 ? this.signCurent.width = 140 : this.signCurent.width = event.rect.width;
          this.signCurent.height <= 50 ? this.signCurent.height = 50 : this.signCurent.height = event.rect.height;
          this.objSignInfo.width = this.signCurent.height
          this.objSignInfo.height = this.signCurent.width
        } else {
          this.objSignInfo.width = event.rect.width;
          this.objSignInfo.height = event.rect.height;
        }
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

  soHopDong: any;
  // Hàm showEventInfo là event khi thả (nhả click chuột) đối tượng ký vào canvas, sẽ chạy vào hàm.
  showEventInfo = (event: any) => {
    let canvasElement: HTMLElement | null;

    if (event.relatedTarget && event.relatedTarget.id) {
      canvasElement = document.getElementById(event.relatedTarget.id);
      let canvasInfo = canvasElement ? canvasElement.getBoundingClientRect() : '';
      this.coordinates_signature = event.rect;
      let id = event.target.id;
      let signElement = <HTMLElement>document.getElementById(id);
      let rect_location = signElement.getBoundingClientRect();
      if (id.includes('chua-keo')) {  //Khi kéo vào trong tài liệu thì sẽ thêm 1 object vào trong mảng sign_config
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
              required: 1,
              font: element.font,
              font_size: element.font_size
            }
            if (element.sign_config.length == 0) {
              _obj['id'] = 'signer-' + index + '-index-0_' + element.id; // Thêm id cho chữ ký trong tài liệu
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
        this.isMove = false;
        let layerX = this.detectCoordinateService.detectX(event, rect_location, canvasInfo, this.canvasWidth, this.pageNumber)
        let layerY = this.detectCoordinateService.detectY(event, rect_location, canvasInfo);

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
          this.selectedTextType = 1;
        }

        this.objSignInfo.traf_x = Math.round(this.signCurent['coordinate_x']);
        this.objSignInfo.traf_y = Math.round(this.signCurent['coordinate_y']);

        this.tinhToaDoSign(event.relatedTarget.id, rect_location.width, rect_location.height, this.objSignInfo);
        this.signCurent['position'] = _array.join(",");
        this.signCurent['left'] = this.obj_toa_do.x1;
        //@ts-ignore
        if ("top" in canvasInfo) {
          this.signCurent['top'] = (rect_location.top - canvasInfo.top).toFixed();
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

                  if(this.soHopDong && this.soHopDong.role == 4) {
                    element.name = this.soHopDong.name;

                    element.signature_party = this.soHopDong.type_unit;
                    element.recipient_id = this.soHopDong.id;
                    element.status = this.soHopDong.status;
                    element.type = this.soHopDong.type;
                    element.email = this.soHopDong.email;
                    element.phone = this.soHopDong.phone;
                  } else if(res.sign_config.length > 0) {
                    this.soHopDong = {

                    };

                    for(let i = 0; i < res.sign_config.length; i++) {
                      let element1 = res.sign_config[i];

                      if(element1.name) {
                        this.soHopDong.name = element1.name;
                        this.soHopDong.type_unit = element1.signature_party;
                        this.soHopDong.id = element1.recipient_id;
                        this.soHopDong.status = element1.status;
                        this.soHopDong.type = element1.type;
                        this.soHopDong.email = element1.email;
                        this.soHopDong.phone = element1.phone;
                        break;
                      }
                    }

                    if(this.soHopDong && this.soHopDong.name) {
                      element.name = this.soHopDong.name;

                      element.signature_party = this.soHopDong.type_unit;
                      element.recipient_id = this.soHopDong.id;
                      element.status = this.soHopDong.status;
                      element.type = this.soHopDong.type;
                      element.email = this.soHopDong.email;
                      element.phone = this.soHopDong.phone;
                    }

                  }

                  this.isChangeText = true;

                } else {
                  this.isChangeText = false;
                }
                if(!element.ordering) {
                  element['ordering'] = this.ordering;
                }
                // element['number'] = _arrPage[_arrPage.length - 1];
                element['page'] = _arrPage[_arrPage.length - 1];
                element['position'] = this.signCurent['position'];
                element['coordinate_x'] = this.signCurent['coordinate_x'];
                element['coordinate_y'] = this.signCurent['coordinate_y'];
                element['dif_x'] = this.signCurent['dif_x'];
                if (!this.objDrag[this.signCurent['id']].count) {
                  // element['width'] = this.datas.configs.e_document.format_signature_image.signature_width;
                  if (res.sign_unit == 'text' || res.sign_unit == 'so_tai_lieu') {
                    if (res.sign_unit == 'so_tai_lieu' && this.datas.contract_no) {
                      // element['width'] = '';
                      // element['height'] = '';
                      element['width'] = rect_location.width;
                      element['height'] = rect_location.height;
                    } else {
                      if (event.target.className.includes('da-keo')){
                        element['width'] = event.target.offsetWidth;
                        element['height'] = event.target.offsetHeight;
                      } else {
                        element['width'] = '135';
                        element['height'] = '28';
                      }
                    }
                  } else {
                    // set size ô ký
                    if (event.target.className.includes('da-keo')){
                      element['width'] = event.target.offsetWidth;
                      element['height'] = event.target.offsetHeight;
                    } else {
                      element['width'] = '180';
                      element['height'] = '66';
                    }
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
        this.getCheckSignature(name_accept_signature);
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

  setDataSignContract() {
    let data_sign_config_cks = this.dataSignPosition.filter((p: any) => p.sign_unit == 'chu_ky_so');
    let data_sign_config_cka = this.dataSignPosition.filter((p: any) => p.sign_unit == 'chu_ky_anh');
    let data_sign_config_text = this.dataSignPosition.filter((p: any) => p.sign_unit == 'text');
    var data_sign_config_num_document = this.dataSignPosition.filter((p: any) => p.sign_unit == 'so_tai_lieu');

    this.datas.contract_user_sign.forEach((element: any) => {
      if (element.sign_unit == 'so_tai_lieu') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_num_document);
      } else if (element.sign_unit == 'chu_ky_so') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_cks);
      } else if (element.sign_unit == 'text') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_text);
      } else if (element.sign_unit == 'chu_ky_anh') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_cka);
      }
    })
  }

  getDataSignUpdateAction() {
    let dataPosition: any[] = [];
    let dataNotPosition: any[] = [];
    this.datas.determine_contract.forEach((element: any) => {
      if (element.recipients.some((q: any) => q.status == 1 && q.email == this.emailUser_sample)) {
        element.recipients.forEach((item: any) => {
          let dataChange = [];

            dataChange = this.datas.is_data_object_signature.filter((p: any) => p.recipient &&
                p.recipient.id == item.id &&
              ((p.recipient.email != item.email ||
                (p.type == 2 && !item.sign_type.some((q: any) => q.id == 1 || q.id == 5) ||
                (p.type == 3 && !item.sign_type.some((q: any) => q.id == 2 || q.id == 3 || q.id == 4 || q.id == 6 || q.id == 7 || q.id == 8)) ||
                ((p.type == 1 || p.type == 5) &&  item.role != 4 && !item.sign_type.some((q: any) => q.id == 2 || q.id == 4 || q.id == 6) ||
                (p.type == 4 && !item.role)
                )))));

          if (dataChange.length == 0) {
            if (item.fields && item.fields.length && item.fields.length > 0) {
              item.fields.forEach((res: any) => {
                res['id_have_data'] = res.id;
                res['is_type_party'] = element.type;
                res['role'] = res.recipient.role;
                if (res.type == 1)
                  res['sign_unit'] = 'text';
                if (res.type == 2)
                  res['sign_unit'] = 'chu_ky_anh';
                if (res.type == 3)
                  res['sign_unit'] = 'chu_ky_so';
                if (res.type == 4)
                  res['sign_unit'] = 'so_tai_lieu';
                if(res.type == 5) {
                  res['sign_unit'] = 'text'
                  res['text_type']='currency'
                }
                res.name = res.recipient.name;
                res.email = res.recipient.email;
                dataPosition.push(res);
              })
            } else {
              // item['is_type_party'] = this.datas.determine_contract.type;
              item['is_type_party'] = element.type;
              item['role'] = item.role;
              dataNotPosition.push(item)
            }
          } else {
            let isValueDelete = dataChange.map(({id}: any) => {return id})
            Array.prototype.push.apply(this.datas.arrDelete, isValueDelete);
          }
        })
      }
    })

    this.dataSignPosition = [...dataPosition, ...dataNotPosition];
    this.dataSignPosition.forEach((res: any) => {
      if (res.sign_unit == 'text') {
        res['text_attribute_name'] = res.name;
      }
    })
  }

  // List danh sách ký
  getListNameSign(data_user_sign: any) {
    let isUserSign = data_user_sign.filter((p: any) => p.type != 1);
    for (const d of isUserSign) {
      if (d.recipients.some((p: any) => p.status == 1 && p.email == this.emailUser_sample)) {
        for (const item of d.recipients) {
          if (item.role == 3 || item.role == 4 || item.role == 2) {
            item['type_unit'] = 'partner'
            item['selected'] = false;
            item['is_disable'] = false;
            item['type'] = d.type;
            this.list_sign_name.push(item);
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
    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y);
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
    this.spinner.show();
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
        this.spinner.hide();

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

        //vuthanhtan
        let canvasWidth: any [] = [];
        for(let i = 1; i <= this.pageNumber; i++) {
          let canvas: any = document.getElementById('canvas-step3-'+i);
          this.top[i] = canvas.height;
          canvasWidth.push(canvas.getBoundingClientRect().left)
        }
        this.difX = Math.max(...canvasWidth) - Math.min(...canvasWidth);

        for(let i = 0; i < this.pageNumber; i++) {
          if(canvasWidth[i] == Math.min(...canvasWidth))
          this.arrDifPage.push('min');
          else
          this.arrDifPage.push('max');
        }
        if(this.datas.isFirstLoadDrag != true)
        this.setX();
        this.datas.arrDifPage = this.arrDifPage;
        this.datas.difX = Math.max(...canvasWidth) - Math.min(...canvasWidth);
      }, 100)
    })
  }

  setX(){
    this.datas.isFirstLoadDrag = true;
    this.datas.contract_user_sign.forEach((element: any) => {
      element.sign_config.forEach((item: any) => {
        if(this.arrDifPage[Number(item.page)-1] == 'max' ){
          const htmlElement: HTMLElement | null = document.getElementById(item.id);
          if(htmlElement) {
            var oldX = Number(htmlElement.getAttribute('data-x'));
            if(oldX) {
              var newX = oldX + this.difX;
              htmlElement.setAttribute('data-x', newX.toString());
            }
          }
          item.coordinate_x += this.difX;
        }
      })
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
      let width_drag_element = document.getElementById('width-element-info');
      this.widthDrag = width_drag_element ? ((width_drag_element.getBoundingClientRect().right - width_drag_element.getBoundingClientRect().left) - 15) : '';
    }, 100)
    this.setPosition();
    this.eventMouseover();
  }

  setClass(dataDrag: any) {
    // if (this.datas.contract_user_sign.some((p: any) => p.sign_unit == 'so_tai_lieu' && p.sign_config.length > 0) && dataDrag.sign_unit == 'so_tai_lieu') {
    //   return 'none-drag';
    // } else return 'resize-drag'
    return 'resize-drag';
  }

  // set lại vị trí đối tượng kéo thả đã lưu trước đó
  setPosition() {
    if (this.convertToSignConfig().length > 0) {
      this.convertToSignConfig().forEach((element: any) => {
        let a = document.getElementById(element.id);
        if (a) {
          // chỉ lấy đối tượng ký của bên đối tác
          if ((!element.is_type_party || (element.is_type_party && element.is_type_party != 1)) && element['coordinate_x'] && element['coordinate_y']) { // @ts-ignore
            a.style["z-index"] = '1';
          }
          a.setAttribute("data-x", element['coordinate_x']);
          a.setAttribute("data-y", element['coordinate_y']);
        }
      });
    }

    if (this.getCurrentSignConfigs().length > 0) {
      this.getCurrentSignConfigs().forEach((element: any) => {
        let a = document.getElementById(element.id);
        if (a) {
          // chỉ lấy đối tượng ký của bên đối tác
          if ((!element.is_type_party || (element.is_type_party && element.is_type_party != 1)) && element['coordinate_x'] && element['coordinate_y']) { // @ts-ignore
            a.style["z-index"] = '1';
          }
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


  // hàm set kích thước cho đối tượng khi được kéo thả vào trong tài liệu
  changePosition(d?: any, e?: any, sizeChange?: any) {
    let style: any =
    (d.sign_unit != 'chu_ky_anh' && d.sign_unit != 'chu_ky_so') ?
    {
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#EBF8FF'
    } :
    {
      "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      "position": "absolute",
      "backgroundColor": '#FFFFFF',
      "border": "1px dashed #6B6B6B",
      "border-radius": "6px",
      "min-width": "140px",
      "min-height": "50px"
    }
    if (d['width']) {
      style.width = parseInt(d['width']) + "px";
    }

    if (d['height']) {
      style.height = parseInt(d['height']) + "px";
    }

    return style;
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

    if (d.sign_unit == 'text' || d.sign_unit == 'so_tai_lieu') {
      this.textSign = true;
      this.list_font = ["Arial", "Calibri", "Times New Roman"];
      this.selectedTextType = 1;
      if(d.type == 5 || d.text_type == 'currency')
        this.selectedTextType = 2;
    } else {
      this.textSign = false;
      this.objSignInfo.font_size = 13;
      d.font = 'Times New Roman';
      this.list_font = [d.font];
    }

    // lấy lại id của đối tượng ký khi click
    let set_id = this.convertToSignConfig().filter((p: any) => p.id == d.id)[0];

    let signElement;
    if (set_id) {
      // set lại id cho đối tượng ký đã click
      this.objSignInfo.id = set_id.id;


      signElement = document.getElementById(this.objSignInfo.id);
    } else
      signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
      if (isObjSign) {
        this.isEnableSelect = false;
        this.objSignInfo.traf_x = d.coordinate_x;
        this.objSignInfo.traf_y = d.coordinate_y;
        this.objSignInfo.width = parseInt(d.width);
        this.objSignInfo.height = parseInt(d.height);
        this.isEnableText = d.sign_unit == 'text';
        this.isChangeText = d.sign_unit == 'so_tai_lieu';
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name
        }
        this.getCheckSignature(d.sign_unit, d.name);

        if (!d.name) //@ts-ignore
          document.getElementById('select-dropdown').value = "";
      }
    }
  }

  // Hàm remove đối tượng đã được kéo thả vào trong file tài liệu canvas
  async onCancel(e: any, data: any) {
    let dataHaveId = true;

    this.isChangeText = false;
    this.soHopDong = {
    };

    if (data.id_have_data) {
      this.spinner.show();
      await this.contractService.deleteInfoContractSignature(data.id_have_data).toPromise().then((res: any) => {
        this.toastService.showSuccessHTMLWithTimeout(`Xóa đối tượng ký trong tài liệu!`, "", "3000");
        this.list_sign_name.forEach((p: any) => {
          if (p.fields && p.fields.length && p.fields.length > 0) {
            for (let i = 0; i < p.fields.length; i++) {
              if (p.fields[i] && p.fields[i].id_have_data == data.id_have_data) {
                delete p.fields[i];
              }
            }
          }
        })
        this.spinner.hide();
      }, (error: HttpErrorResponse) => {
        this.toastService.showErrorHTMLWithTimeout(`Đã xảy ra lỗi!`, "", "3000");
        this.spinner.hide();
        dataHaveId = false;
      })
    }

    if(dataHaveId) {
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
      }
      this.datas.contract_user_sign.forEach((element: any, user_sign_index: any) => {
        if (element.sign_config.length > 0) {
          element.sign_config = element.sign_config.filter((item: any) => item.id != data.id)
          element.sign_config.forEach((itemSign: any, sign_config_index: any) => {
            if(isNaN(Number(itemSign.id))) {
              itemSign['id'] = 'signer-' + user_sign_index + '-index-' + sign_config_index + '_' + element.id;
            }
          })
        }
      });
      this.eventMouseover();
      this.cdRef.detectChanges();
    }

  }

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datas.contract_user_sign];
    cloneUserSign.forEach(element => {
      arrSignConfig = arrSignConfig.concat(element.sign_config);
    })
    // arrSignConfig.forEach((element: any) => {
    //   element.name = this.datas.is_data_object_signature.filter((item: any) => item.id == element.recipient_id)[0]?.name
    //   element.email = this.datas.is_data_object_signature.filter((item: any) => item.id == element.recipient_id)[0]?.email
    //   if(element.recipient)
    //   element.recipient.email = this.datas.is_data_object_signature.filter((item: any) => item.id == element.recipient_id)[0]?.email
    // });

    arrSignConfig = arrSignConfig.sort((item1: any, item2: any) => item1.ordering - item2.ordering);

    // Tìm giá trị zIndex lớn nhất
    const maxZIndex = arrSignConfig.reduce((max: any, item: any) => {
      return item.ordering ? Math.max(max, item.ordering) : max;
    }, 0) || 1;

    this.ordering = maxZIndex + 1;

    return arrSignConfig;
  }

  getCurrentSignConfigs() {
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datas.contract_user_sign_index];
    cloneUserSign.forEach(element => {
      arrSignConfig = arrSignConfig.concat(element.sign_config);
    })

    let partnerRecipients: any[] = []
    this.datas.is_data_object_signature.forEach((ele: any) => {
      partnerRecipients.push(ele.id)
    })
    arrSignConfig = arrSignConfig.filter((item: any) => !partnerRecipients.includes(item.recipient_id))
    return arrSignConfig;
  }

  // getCheckSignature(isSignType: any, listSelect?: string) {
  //   this.list_sign_name.forEach((element: any) => {

  //     if (this.convertToSignConfig().some((p: any) => ((p.recipient ? p.recipient.email : p.email) == element.email && p.sign_unit == isSignType) || (isSignType == 'so_tai_lieu' && (p.recipient ? p.recipient.email : p.email) && p.sign_unit == 'so_tai_lieu'))) {
  //       if (isSignType != 'text') {
  //         if(isSignType == 'so_tai_lieu') {
  //           // element.is_disable = (element.role != 4 || (this.datas.contract_no && element.role == 4));

  //           element.is_disable = !(element.sign_type.some((p: any) => [2,4,6].includes(p.id)) || element.role == 4)
  //         } else if (isSignType == 'chu_ky_so') {
  //           element.is_disable = !element.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6)
  //         } else if (isSignType == 'chu_ky_anh') {
  //           element.is_disable = false
  //         }  else {
  //           element.is_disable = true
  //         }
  //       }
  //     } else {
  //       if (isSignType == 'chu_ky_anh') {
  //         element.is_disable = !(element.sign_type.some((p: any) => p.id == 1 || p.id == 5) && element.role != 2);
  //       } else if (isSignType == 'chu_ky_so') {
  //         element.is_disable = !(element.sign_type.some((p: any) => [2,4,6].includes(p.id)) && element.role != 2);
  //       } else if (isSignType == 'text') {
  //         element.is_disable = !(element.sign_type.some((p: any) => [2,4,6].includes(p.id)) || (element.role == 4 && !element.sign_type.some((p: any) => [3,7,8].includes(p.id)))); // ô text chỉ có ký usb token/hsm mới được chỉ định hoặc là văn thư
  //       } else {
  //         if (this.datas.contract_no) {
  //           element.is_disable = true;
  //         } else {
  //         // element.is_disable = (element.role != 4 || (this.datas.contract_no && element.role == 4));
  //         element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6) || element.role == 4 && element.sign_type.some((p: any) => p.id != 8 && p.id != 3 && p.id != 7))
  //         }
  //       }
  //     }
  //     // }

  //     if (listSelect) {
  //       element.selected = listSelect && element.name == listSelect;
  //     }
  //   })
  // }

  getCheckSignature(isSignType: any, listSelect?: string, value?: any) {
    // if(isSignType == 'chu_ky_so_con_dau_va_thong_tin' || isSignType == 'chu_ky_so_con_dau' || isSignType == 'chu_ky_so_thong_tin') {
    //   isSignType = 'chu_ky_so'
    // }
    let assignSign = this.convertToSignConfig();
    // p.recipient_id == element.id && p.sign_unit == isSignType)
    this.list_sign_name.forEach((element: any) => {
      if (isSignType == 'text' && value) {
        element.is_disable = true;
      } else {
        if (isSignType == 'text') {
          element.is_disable = !element.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6);
        } else if (isSignType.includes('chu_ky_so')) {
          let count = assignSign.filter((sign: any) => sign?.email === element?.email).length;
          if (element.sign_type[0]?.id == 3 || element.sign_type[0]?.id == 7 || element.sign_type[0]?.id == 8) {
            element.is_disable = count >= 1;
          } else {
            element.is_disable = !element.sign_type.some((p: any) => [2, 4, 6].includes(p.id));
          }
        } else if (isSignType == 'chu_ky_anh') {
          element.is_disable = !(element.sign_type.some((p: any) => p.id == 1 || p.id == 5));
        } else if(isSignType == 'so_tai_lieu') {
          console.log("this.datasForm.contract_no", this.datas.contract_no)
          if (this.datas.contract_no) {
            element.is_disable = true;
          } else {
            element.is_disable = !element.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6);
          }
        }
      }
      if (listSelect) {
        // element.is_disable = false;
        element.selected = listSelect && element.name == listSelect;
      }
    })
  }

  getConditionFiledSign(element: any, isSignType: string) {
    if ((element.fields && element.fields.length && element.fields.length > 0) &&
      (element.sign_type.some((id: number) => [1, 5].includes(id)) && isSignType == 'chu_ky_anh') || (element.sign_type.some((id: number) => [2, 3, 4].includes(id)) && isSignType == 'chu_ky_so') || (isSignType == 'text' && element.sign_type.some((id: number) => id == 2) || (isSignType == 'so_tai_lieu' && (element.role != 4 || (this.datas.contract_no && element.role == 4))))) {
        return true;
    } else return false;
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
    //
    let signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];
      if (isObjSign) {
        if (property == 'location') {
          if (locationChange == 'x') {
            isObjSign.coordinate_x = parseInt(e);
            signElement.setAttribute("data-x", isObjSign.coordinate_x);
          } else {
            let sum = 0;
            let count = 0;
            for(let i = 1; i < this.pageNumber;i++) {
              let canvas: any = document.getElementById('canvas-step3-' + i);
              sum += canvas.height;
              count++;

              if(sum >= e) {

                signElement?.setAttribute("page",count.toString());
                break;
              }
            }
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
          if(locationChange != 'text_type'){
            isObjSign.text_attribute_name = e;
            signElement.setAttribute("text_attribute_name", isObjSign.text_attribute_name);
          }
          if(locationChange== 'text_type'){
            let type_name = this.list_text_type.filter((p: any) => p.id == e.target.value)[0].name;

            isObjSign.text_type = type_name;
            signElement.setAttribute("text_type", isObjSign.text_type);
          }
        } else if (property == 'font') {
          isObjSign.font = e.target.value;
          signElement.setAttribute("font", isObjSign.font);

          this.datas.contract_user_sign.forEach((res: any) => {
            if (res.sign_config.length > 0) {
              let arrSignConfigItem: any = "";

              if (res.sign_unit == 'so_tai_lieu') {
                arrSignConfigItem = res.sign_config;

                arrSignConfigItem.forEach((element: any) => {
                  element.font = isObjSign.font;
                })
              }
            }
          });
        } else if (property == 'font_size') {
          isObjSign.font_size = e.target.value;
          signElement.setAttribute("font_size", isObjSign.font_size);

          this.datas.contract_user_sign.forEach((res: any) => {
            if (res.sign_config.length > 0) {
              let arrSignConfigItem: any = "";

              if (res.sign_unit == 'so_tai_lieu') {
                arrSignConfigItem = res.sign_config;

                arrSignConfigItem.forEach((element: any) => {
                  element.font_size = isObjSign.font_size;
                })
              }
            }
          });
        } else {
          // let data_name = this.list_sign_name.filter((p: any) => p.id == e.target.value)[0];
          let data_name = this.list_sign_name.filter((p: any) => p.email == e.target.value)[0];
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

            isObjSign.email = data_name.email;
            signElement.setAttribute("email", isObjSign.email);

            isObjSign.phone = data_name.phone;
            signElement.setAttribute("phone", isObjSign.phone);

            if(isObjSign.recipient) {
              isObjSign.recipient.id = data_name.id;
              isObjSign.recipient.name = data_name.name;
              isObjSign.recipient.email = data_name.email;
            }
          }

          let idTypeSign = data_name.sign_type[0].id;

          if((data_name.role == 4 || ((idTypeSign == 2 || idTypeSign == 4))) && this.isChangeText) {
            this.soHopDong = data_name;

            //Gán lại tất cả số tài liệu cho một người ký
            this.datas.contract_user_sign.forEach((res: any) => {
              if (res.sign_config.length > 0) {
                let arrSignConfigItem: any = "";

                if(res.sign_unit == 'so_tai_lieu' || this.datas.contract_no) {
                  arrSignConfigItem = res.sign_config;

                  arrSignConfigItem.forEach((element: any) => {
                    element.name = this.soHopDong.name;
                    element.signature_party = data_name.type_unit;
                    element.recipient_id = data_name.id;
                    element.status = data_name.status;
                    element.type = data_name.type;
                    element.email = data_name.email;
                    element.phone = data_name.phone;
                  })
                }

              }
            });
          }
        }

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
    this.nextOrPreviousStep(step);
  }

  next() {
    if (!this.validData()) return;
    this.step = variable.stepSampleContract.step4;
    this.datas.stepLast = this.step
    this.nextOrPreviousStep(this.step);
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    this.getRemoveCopyRight();
    this.datas.stepLast = step;
    this.stepChangeSampleContract.emit(step);
  }

  getRemoveCopyRight() {
    // let is_var_copyRight = sessionStorage.getItem('copy_right_show');
    // if (is_var_copyRight)
    //   sessionStorage.removeItem('copy_right_show')
  }

  validData(isSaveDraft?: any) {
    let data_not_drag = this.datas.contract_user_sign.filter((p: any) => p.sign_config.length > 0)[0];
    if (!data_not_drag) {
      this.spinner.hide();
      this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn ít nhất 1 đối tượng kéo thả!", "", 3000);
      return false;
    } else {
      let count = 0;
      let count_text = 0;
      let count_number = 0;
      let arrSign_organization: any[] = [];
      let arrSign_partner: any[] = [];

      let coordinate_x: number [] = [];
      let coordinate_y: number [] = [];
      let width: number [] = [];
      let height: number [] = [];

      let currentElement: any;
      let boxElements: any = [];

      if (environment.flag == 'KD') {
        for (let i = 0; i < this.datas.contract_user_sign.length; i++) {
          if (this.datas.contract_user_sign[i].sign_config.length > 0) {
            for (let j = 0; j < this.datas.contract_user_sign[i].sign_config.length; j++) {
              let element = this.datas.contract_user_sign[i].sign_config[j];
              if (!element.name && element.sign_unit != 'so_tai_lieu' && element.sign_unit != 'text') { // element.sign_unit != 'so_tai_lieu'
                currentElement = element
                count++;
                break
              } else if (element.sign_unit == 'so_tai_lieu') {

              } else if (element.sign_unit == 'text' && !element.text_attribute_name) {
                currentElement = element
                count_text++;
                break
              } else {
                let data_sign = {
                  name: element.name,
                  signature_party: element.signature_party,
                  recipient_id: element.recipient_id,
                  email: element.email,
                  sign_unit: element.sign_unit
                }
                if (element.signature_party == "organization" || element.is_type_party == 1)
                  arrSign_organization.push(data_sign);
                else arrSign_partner.push(data_sign);
              }

              if (element.coordinate_x) {
                coordinate_x.push(Number(element.coordinate_x));
                coordinate_y.push(Number(element.coordinate_y));
                width.push(Number(element.width));
                height.push(Number(element.height));
                boxElements.push(element)
              }
            }
          }

          if (this.datas.contract_user_sign[i].sign_unit === 'chu_ky_so') {
            let itemType = this.datas.contract_user_sign[i].type;
            for (let j = 0; j < itemType.length; j++) {
              let signConfigArray = itemType[j].sign_config;

              for (let n = 0; n < signConfigArray.length; n++) {
                let element = signConfigArray[n];
                if (!element.name && element.sign_unit != 'so_tai_lieu' && element.sign_unit != 'text') { // element.sign_unit != 'so_tai_lieu'
                  currentElement = element
                  count++;
                  break
                } else if (element.sign_unit == 'so_tai_lieu') {

                } else if (element.sign_unit == 'text' && !element.text_attribute_name) {
                  currentElement = element
                  count_text++;
                  break
                } else {
                  let data_sign = {
                    name: element.name,
                    signature_party: element.signature_party,
                    recipient_id: element.recipient_id,
                    email: element.email,
                    sign_unit: element.sign_unit
                  }
                  if (element.signature_party == "organization" || element.is_type_party == 1)
                    arrSign_organization.push(data_sign);
                  else arrSign_partner.push(data_sign);
                }

                if (element.coordinate_x) {
                  coordinate_x.push(Number(element.coordinate_x));
                  coordinate_y.push(Number(element.coordinate_y));
                  width.push(Number(element.width));
                  height.push(Number(element.height));
                  boxElements.push(element)
                }
              }
            }
          }
        }
      } else {
        for (let i = 0; i < this.datas.contract_user_sign.length; i++) {
          if (this.datas.contract_user_sign[i].sign_config.length > 0) {
            for (let j = 0; j < this.datas.contract_user_sign[i].sign_config.length; j++) {
              let element = this.datas.contract_user_sign[i].sign_config[j];
              if (!element.name && element.sign_unit != 'so_tai_lieu' && element.sign_unit != 'text') { // element.sign_unit != 'so_tai_lieu'
                currentElement = element
                count++;
                break
              } else if (element.sign_unit == 'so_tai_lieu' && !element.email && !element.name) {

              } else if (element.sign_unit == 'text' && !element.text_attribute_name) {
                currentElement = element
                count_text++;
                break
              } else {
                let data_sign = {
                  name: element.name,
                  signature_party: element.signature_party,
                  recipient_id: element.recipient_id,
                  email: element.email,
                  sign_unit: element.sign_unit
                }
                if (element.signature_party == "organization" || element.is_type_party == 1)
                  arrSign_organization.push(data_sign);
                else arrSign_partner.push(data_sign);
              }

              if (element.coordinate_x) {
                coordinate_x.push(Number(element.coordinate_x));
                coordinate_y.push(Number(element.coordinate_y));
                width.push(Number(element.width));
                height.push(Number(element.height));
                boxElements.push(element)
              }
            }
          }

          if (this.datas.contract_user_sign[i].sign_unit === 'chu_ky_so') {
            let itemType = this.datas.contract_user_sign[i].type;
            for (let j = 0; j < itemType.length; j++) {
              let signConfigArray = itemType[j].sign_config;

              for (let n = 0; n < signConfigArray.length; n++) {
                let element = signConfigArray[n];
                if (!element.name && element.sign_unit != 'so_tai_lieu' && element.sign_unit != 'text') { // element.sign_unit != 'so_tai_lieu'
                  currentElement = element
                  count++;
                  break
                } else if (element.sign_unit == 'so_tai_lieu' && !element.email && !element.name) {

                } else if (element.sign_unit == 'text' && !element.text_attribute_name) {
                  currentElement = element
                  count_text++;
                  break
                } else {
                  let data_sign = {
                    name: element.name,
                    signature_party: element.signature_party,
                    recipient_id: element.recipient_id,
                    email: element.email,
                    sign_unit: element.sign_unit
                  }
                  if (element.signature_party == "organization" || element.is_type_party == 1)
                    arrSign_organization.push(data_sign);
                  else arrSign_partner.push(data_sign);
                }

                if (element.coordinate_x) {
                  coordinate_x.push(Number(element.coordinate_x));
                  coordinate_y.push(Number(element.coordinate_y));
                  width.push(Number(element.width));
                  height.push(Number(element.height));
                  boxElements.push(element)
                }
              }
            }
          }
        }
      }

        //Trường hợp 1: ô 1 giao ô 2 trong vùng x2 thuộc (x1 đến x1+w); y2 thuộc (y1 đến y1+h) = góc phải dưới
        for (let i = 0; i < coordinate_x.length; i++) {
          for (let j = i + 1; j < coordinate_x.length; j++) {
            if (
              (Number(coordinate_x[i]) <= Number(coordinate_x[j]) && Number(coordinate_x[j]) <= (Number(coordinate_x[i]) + Number(width[i])))
              &&
              (Number(coordinate_y[i]) <= Number(coordinate_y[j]) && Number(coordinate_y[j] <= (Number(coordinate_y[i]) + Number(height[i]))))
              // && coordinate_y[i] <= coordinate_y[j] <= (coordinate_y[i] + height[i])
            ) {
              if(!isSaveDraft) {
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_so')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh và ô ký số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_anh')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                console.log("boxElements[i].sign_unit", boxElements[i].sign_unit)
                
                console.log("boxElements[j].sign_unit", boxElements[j])
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                  if ((!boxElements[i].text_type && !boxElements[j].text_type)
                  ) {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                  } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                            (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                  {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                  }
                }
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                    (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                    (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
                (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                    (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
            }
          }
        }

        //Trường hợp 2: ô 1 giao ô 2 trong vùng x2 thuộc (x1 đến x1+w); y2+h thuộc (y1 đến y1+h) = góc phải trên
        for (let i = 0; i < coordinate_x.length; i++) {
          for (let j = i + 1; j < coordinate_x.length; j++) {
            if (
              (Number(coordinate_x[i]) <= Number(coordinate_x[j]) && Number(coordinate_x[j]) <= (Number(coordinate_x[i]) + Number(width[i])))
              &&
              (Number(coordinate_y[i]) <= (Number(coordinate_y[j]) + Number(height[j])) && (Number(coordinate_y[j] + Number(height[j])) <= (Number(coordinate_y[i]) + Number(height[i]))))
              // && coordinate_y[i] <= coordinate_y[j] <= (coordinate_y[i] + height[i])
            ) {
              if(!isSaveDraft) {
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_so')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh và ô ký số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_anh')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                  if ((!boxElements[i].text_type && !boxElements[j].text_type)
                  ) {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                  } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                            (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                  {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                  }
                }
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                    (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                    (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
                (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                    (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
            }
          }
        }

        //Trường hợp 3: ô 1 giao ô 2 trong vùng x2+w thuộc (x1 đến x1+w); y2+h thuộc (y1 đến y1+h) = góc trái trên
        for (let i = 0; i < coordinate_x.length; i++) {
          for (let j = i + 1; j < coordinate_x.length; j++) {
            if (
              (Number(coordinate_x[j]) <= Number(coordinate_x[i]) && Number(coordinate_x[i]) <= (Number(coordinate_x[j]) + Number(width[j])))
              &&
              (Number(coordinate_y[j]) <= Number(coordinate_y[i]) && Number(coordinate_y[i] <= (Number(coordinate_y[j]) + Number(height[j]))))
            ) {
              if(!isSaveDraft) {
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_so')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh và ô ký số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_anh')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                  if ((!boxElements[i].text_type && !boxElements[j].text_type)
                  ) {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                  } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                            (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                  {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                  }
                }
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                    (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                    (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
                (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                    (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
            }
          }
        }

        //Trường hợp 4: ô 1 giao ô 2 trong vùng x2 thuộc (x1 đến x1+w); y2+h thuộc (y1 đến y1+h) = góc phải trên
        for (let i = 0; i < coordinate_x.length; i++) {
          for (let j = i + 1; j < coordinate_x.length; j++) {
            if (
              (Number(coordinate_x[j]) <= Number(coordinate_x[i]) && Number(coordinate_x[i]) <= (Number(coordinate_x[j]) + Number(width[j])))
              &&
              (Number(coordinate_y[j]) <= (Number(coordinate_y[i]) + Number(height[i])) && (Number(coordinate_y[i] + Number(height[i])) <= (Number(coordinate_y[j]) + Number(height[j]))))
              // && coordinate_y[i] <= coordinate_y[j] <= (coordinate_y[i] + height[i])
            ) {
              if(!isSaveDraft) {
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_so')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh và ô ký số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if (boxElements[i].sign_unit.includes('chu_ky_anh') && boxElements[j].sign_unit.includes('chu_ky_anh')) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký ảnh không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                  if ((!boxElements[i].text_type && !boxElements[j].text_type)
                  ) {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                  } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                            (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                  {
                    return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                  }
                }
                if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                    (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                }
                if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                    (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }

                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                    (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
                (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
                if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                    (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                  return this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
            }
          }
        }

      if (count > 0) {
        if(!isSaveDraft)
        this.toastService.showErrorHTMLWithTimeout("Vui lòng chọn người ký cho đối tượng đã kéo thả!", "", 3000);
        return false;
      } else if (count_number > 1) {
        if(!isSaveDraft)
        this.toastService.showErrorHTMLWithTimeout("Tài liệu chỉ được phép có 1 số tài liệu!", "", 3000);
        return false;
      } else if (count_text > 0) {
        if(!isSaveDraft)
        this.toastService.showErrorHTMLWithTimeout("Thiếu tên trường cho đối tượng nhập Text!", "", 3000);
        return false;
      } else {
        // valid đối tượng ký của đối tác
        let data_partner = this.list_sign_name.filter((p: any) => p.type_unit == "partner" && p.role != 2);
        let countError_partner = 0;
        let nameSign_partner = {
          name: '',
          sign_type: ''
        };

        if (environment.flag == "KD") {
          for (const element of data_partner) {
            if (element.sign_type.length > 0) {
              if (element.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6 || p.id == 7 || p.id == 8) && arrSign_partner.filter((item: any) => (item.email == element.email || item.phone == element.phone) && item.sign_unit == 'chu_ky_so').length == 0) {
                countError_partner++;
                nameSign_partner.name = element.name;
                nameSign_partner.sign_type = 'chu_ky_so';
                break
              }
              if (element.sign_type.some((p: any) => p.id == 1 || p.id == 5) && arrSign_partner.filter((item: any) => (item.email == element.email || item.phone == element.phone) && item.sign_unit == 'chu_ky_anh').length == 0) {
                countError_partner++;
                nameSign_partner.name = element.name;
                nameSign_partner.sign_type = 'chu_ky_anh';
                break
              }
            }
          }
          if (countError_partner > 0) {
            this.spinner.hide();
            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout(`Thiếu đối tượng2 ${nameSign_partner.sign_type == 'chu_ky_so' ? 'ký số' : 'ký ảnh hoặc eKYC'} của đối tác ${nameSign_partner.name}, vui lòng chọn đủ người ký!`, "", 3000);
            return false;
          }

          // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
          if (arrSign_partner.length < data_partner.length) {
            // alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!');
            this.spinner.hide();

            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout("Thiếu đối tượng ký của đối tác3, vui lòng chọn đủ người ký!", "", 3000);
            return false;
          }
        } else {
        // valid ký kéo thiếu ô ký cho từng loại ký
          for (const element of data_partner) {
            if (element.sign_type.length > 0) {
              if (element.sign_type.some((p: any) => [3,7,8].includes(p.id) || ([2,4,6].includes(p.id) && element.role !==4)) && arrSign_partner.filter((item: any) => ((element.email && item.email == element.email) || (element.phone && item.phone == element.phone)) && item.sign_unit == 'chu_ky_so').length == 0) {
                countError_partner++;
                nameSign_partner.name = element.name;
                nameSign_partner.sign_type = 'chu_ky_so';
                break
              }
              if (element.sign_type.some((p: any) => p.id == 1 || p.id == 5) && arrSign_partner.filter((item: any) => (item.email == element.email || item.phone == element.phone) && item.sign_unit == 'chu_ky_anh').length == 0) {
                countError_partner++;
                nameSign_partner.name = element.name;
                nameSign_partner.sign_type = 'chu_ky_anh';
                break
              }
            }
          }
          if (countError_partner > 0) {
            this.spinner.hide();
            // if(!isSaveDraft)
            this.toastService.showErrorHTMLWithTimeout(`Thiếu đối tượng1 ${nameSign_partner.sign_type == 'chu_ky_so' ? 'ký số' : 'ký ảnh'} của đối tác ${nameSign_partner.name}, vui lòng chọn đủ người ký!`, "", 3000);
            return false;
          }


          // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
          if (arrSign_partner.length < data_partner.length || !this.validateVanThuData(arrSign_partner, data_partner)) {
            // alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!');
            this.spinner.hide();
            // if(!isSaveDraft)
            this.toastService.showErrorHTMLWithTimeout("Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!", "", 3000);
            return false;
          }
        }
      }
    }
    return true;
  }

  validateVanThuData(arrOrg: any[], dataOrg: any[]) {
    let count: number = 0
    dataOrg.forEach(element => {
       if (arrOrg.findIndex(item => item.email == element.email) == - 1) count++
    })
    if (count == 0) return true
    else return false
  }

  getName(data: any) {
    let name = ''

    if (data.type_unit == 'organization') {
      if (data.name.length>27) {
        name = data.name.substring(0, 27) + ' ...'
      } else {
        name = data.name
      }
      return 'Tổ chức của tôi - ' + name;
    } else if (data.type_unit == 'partner') {
      if (data.name.length>35) {
        name = data.name.substring(0, 35) + ' ...'
      } else {
        name = data.name
      }
      return 'Đối tác - ' + name;
    }
  }

}
