import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  QueryList,
  ElementRef,
   Output, EventEmitter, SimpleChanges, AfterViewInit
} from "@angular/core";
import { variable } from "src/app/config/variable";
import { Helper } from "src/app/core/Helper";
import * as $ from 'jquery';

import interact from 'interactjs'
import { ContractService } from "src/app/service/contract.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "src/app/service/toast.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';

import { ContractTemplateService } from "src/app/service/contract-template.service";
import * as _ from 'lodash';
import { TranslateService } from "@ngx-translate/core";
import { UserService } from 'src/app/service/user.service';
import { isPdfFile } from "pdfjs-dist";
import { CheckZoomService } from "src/app/service/check-zoom.service";
import { DetectCoordinateService } from "src/app/service/detect-coordinate.service";

@Component({
  selector: 'app-sample-contract-form',
  templateUrl: './sample-contract-form.component.html',
  styleUrls: ['./sample-contract-form.component.scss']
})

export class SampleContractFormComponent implements OnInit, AfterViewInit {
  @Input() datasForm: any;
  @Input() stepForm: any;
  @ViewChild('itemElement') itemElement: QueryList<ElementRef> | undefined

  @Output() stepChangeSampleContractForm = new EventEmitter<string>();
  @Input() save_draft_infor_form: any;

  pdfSrc: any;
  thePDF: any = null;
  pageNumber = 1;
  canvasWidth = 0;
  arrPage: any = [];
  arrDifPage: any = [];
  objDrag: any = {};
  scale: any;
  objPdfProperties: any = {
    pages: [],
  };
  orgId: any;
  difX: number;

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
    width: 0,
    font: 'Times New Roman',
    font_size: 13,
  }

  list_text_type: any = [
    { id: 1, name: 'default' },
    { id: 2, name: 'currency' },
  ];
  list_sign_name: any = [];
  signCurent: any;

  isView: any;
  countAttachFile = 0;
  widthDrag: any;

  selectedTextType = 1;
  isEnableSelect: boolean = true;
  isEnableText: boolean = false;
  isChangeText: boolean = false;
  dataSignPosition: any;

  listSignNameClone: any = [];
  data_sample_contract: any = [];
  isNoEmailObj: boolean = true;
  isChangeNumberContract: number;

  list_font: any;

  selectedFont: any="";
  size: any;

  sum: number[] = [];
  top: any[]= [];

  textSign: boolean = false;
  isContractNoNameNull: boolean = false;

  imageSign: number = 2;
  digitalSign: number = 3;
  textUnit: number = 1;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private router: Router,
    private contractTemplateService: ContractTemplateService,
    public translate: TranslateService,
    private userService: UserService,
    private checkZoomService: CheckZoomService,
    private detectCoordinateService: DetectCoordinateService
  ) {
    this.stepForm = variable.stepSampleContractForm.step3
  }

  ngOnInit() {

    console.log("contract no ", this.contractNo);
    this.onResize();

    if(this.datasForm.font) {
      this.selectedFont = this.datasForm.font;
    }

    if(this.datasForm.size) {
      this.size = this.datasForm.size;
    }

    this.list_font = ["Arial","Calibri","Times New Roman"];

    this.isChangeNumberContract = this.datasForm.contract_no; // save contract number check with input contract number object signature when change

    if (!this.datasForm.contract_user_sign) {
      if (this.datasForm.is_data_object_signature && this.datasForm.is_data_object_signature.length && this.datasForm.is_data_object_signature.length > 0) {
        this.datasForm.is_data_object_signature.forEach((res: any) => {
          res['id_have_data'] = res.id;
          if (res.type == 1) {
            res['sign_unit'] = 'text';
            res['text_attribute_name'] = res.name;
            res.name = res.text_attribute_name;
          }
          if (res.type == 2) {
            res['sign_unit'] = 'chu_ky_anh';
            res.name = res.recipient.name;
          }
          if (res.type == 3) {
            res['sign_unit'] = 'chu_ky_so'
            res.name = res.recipient.name;
          }
          if (res.type == 4) {
            res['sign_unit'] = 'so_tai_lieu'

            if(!res.name) {
              this.isContractNoNameNull = true;
            }
          }
          if (res.type == 5){
            res['sign_unit']=  'text';
            res['text_type'] = 'currency';
            res['text_attribute_name'] = res.name;
            res.name = res.text_attribute_name;
          }
        })
      }
      this.datasForm.contract_user_sign = this.contractTemplateService.getDataFormatContractUserSign();
      this.setDataSignContract();
    } else {
      this.isNoEmailObj = false;
    }
    this.defindDataContract();
    this.scale = 1;
    if (this.datasForm.is_determine_clone && this.datasForm.is_determine_clone.length > 0) {
      let data_user_sign = [...this.datasForm.is_determine_clone];
      this.getListNameSign(data_user_sign);
    }
    if (!this.signCurent) {
      this.signCurent = {
        width: 0,
        height: 0
      }
    }

    this.pdfSrc = this.datasForm.pdfUrl;

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
      listeners: { move: this.dragMoveListener, onend: this.showEventInfo },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: '.drop-zone',
          endOnly: true
        })
      ]
    })

    interact('.not-out-drop').on('resizeend', this.resizeSignature).resizable({
      edges: { right: true, bottom: true }, // Cho phép resize theo chiều nào.
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

    interact.addDocument(document);

    if(this.datasForm.is_data_object_signature.length > 0 && this.datasForm.is_data_object_signature[0].font) {
      const font = this.datasForm.is_data_object_signature[0].font;
      const font_size = this.datasForm.is_data_object_signature[0].font_size;

      if(font) {
        this.datasForm.font = font;
        this.selectedFont = this.datasForm.font;
      }

      if(font_size) {
        this.datasForm.size = font_size;
        this.size = this.datasForm.size;
      }
    }

    this.synchronized1(this.imageSign);
    this.synchronized1(this.digitalSign);
    this.synchronized1(this.textUnit);

    this.checkDifferent();
  }

  setX(){
    this.datasForm.isFirstLoadDrag = true;
    let i = 0;
    this.datasForm.contract_user_sign.forEach((element: any) => {
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

  synchronized1(numberSign: number) {
    for(let i = 0; i < this.datasForm.is_determine_clone.length; i++) {
      const clone = this.datasForm.is_determine_clone[i];

      for(let j = 0; j < this.datasForm.contract_user_sign[numberSign].sign_config.length; j++) {
        const signImage = this.datasForm.contract_user_sign[numberSign].sign_config[j];

        for(let k = 0; k < clone.recipients.length; k++) {
          if(clone.recipients[k].id == signImage.recipient_id) {
             this.datasForm.contract_user_sign[numberSign].sign_config[j].email = clone.recipients[k].email;
             this.datasForm.contract_user_sign[numberSign].sign_config[j].recipient.email = clone.recipients[k].email;
             this.datasForm.contract_user_sign[numberSign].sign_config[j].name = clone.recipients[k].name;
          }
        }
      }
    }
  }


  checkDifferent() {
    //Lấy tất cả recipientId trong clone
    const recipientIds = this.datasForm.is_determine_clone.flatMap((item:any) => item.recipients.map((recipient:any) => recipient.id));

    //Check mảng sign_config có id recipient trên thì giữ lại; còn lại xoá hết
    for(let i = 0; i < 4; i++) {
      for(let j = 0; j < this.datasForm.contract_user_sign[i].sign_config.length; j++) {
        const sign_config = this.datasForm.contract_user_sign[i].sign_config[j];

        if(sign_config.recipient_id && !recipientIds.includes(sign_config.recipient_id) && sign_config.sign_unit != 'text_currency') {
          this.datasForm.contract_user_sign[i].sign_config.splice(j,1);
        }
      }
    }
  }

  onResize(e?: any) {
    this.checkZoomService.onResize();
  }

  changeFont($event: any) {
    this.selectedFont = $event;
    this.datasForm.font = $event;
  }

  setDataSignContract() {
    if (!this.datasForm.is_data_object_signature) {
      this.datasForm.is_data_object_signature = [];
    }

    let data_sign_config_cks = this.datasForm.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_so');
    let data_sign_config_cka = this.datasForm.is_data_object_signature.filter((p: any) => p.sign_unit == 'chu_ky_anh');
    let data_sign_config_text = this.datasForm.is_data_object_signature.filter((p: any) => p.sign_unit == 'text');
    let data_sign_config_num_document = this.datasForm.is_data_object_signature.filter((p: any) => p.sign_unit == 'so_tai_lieu');

    this.datasForm.contract_user_sign.forEach((element: any) => {
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

  defindDataContract() {
    let dataDetermine: { id: any; sign_type: any; name: string }[] = [];
    this.datasForm.is_determine_clone.forEach((res: any) => {
      res.recipients.forEach((element: any) => {
        let isObj = {
          id: element.id,
          sign_type: element.sign_type,
          name: element.name,
          email: element.email,
          is_type_party: res.type,
          role: element.role,
        }
        dataDetermine.push(isObj);
      })
    })

    // lay du lieu vi tri va toa do ky cua buoc 3 da thao tac
    let dataContractUserSign: any[] = [];
    this.datasForm.contract_user_sign.forEach((res: any, index: number) => {
      if (res.sign_config.length !== 0) {
        res.sign_config.forEach((element: any) => {
          dataContractUserSign.push(element)
        })
      }
    })

    // Get data have change 1 in 3 value name, email, type sign
    let dataDiffirent: any[] = [];
    if (dataDetermine.length > 0) {
      dataDiffirent = dataContractUserSign.filter((val: any) => !dataDetermine.some((data: any) =>
        ((val.sign_unit == 'chu_ky_anh' && data.sign_type.some((q: any) => q.id == 1 || q.id == 5)) ||
          (val.sign_unit == 'text' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4))) ||
          (val.sign_unit == 'so_tai_lieu' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4))) ||
          (val.sign_unit == 'chu_ky_so' && data.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6))) &&
        ((val.recipient ? (((val.recipient.email && val.recipient.email == data.email) || !val.recipient.email)) : ((
            !val.name ||
            (val.sign_unit == 'text' && !val.recipient_id)) && ((val.email && val.email == data.email) || !val.email)))
        )));
    }

    // Get data no change of signature object
    dataContractUserSign = dataContractUserSign.filter(val => dataDetermine.some((data: any) =>
      ((val.sign_unit == 'chu_ky_anh' && data.sign_type.some((q: any) => q.id == 1 || q.id == 5)) ||
      (val.sign_unit == 'text' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4)))||
      (val.sign_unit == 'so_tai_lieu' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4))) ||
        (val.sign_unit == 'chu_ky_so' && data.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6))) &&
      ((val.recipient ? (((val.recipient.email && val.recipient.email == data.email) || !val.recipient.email)) : (( !val.name || (val.sign_unit == 'text' && !val.recipient_id)) && ((val.email && val.email == data.email) || !val.email))
      ))));

    //
    // }

    // xoa nhung du lieu doi tuong thay doi khi sua, remove element when change data step 2

    if (dataDiffirent.length > 0 && this.router.url.includes('edit')) {
      this.datasForm.contract_user_sign.forEach((res: any) => {
        if (res.sign_config.length > 0) {
          /*
          * begin xóa đối tượng ký đã bị thay đổi dữ liệu
          */
          res.sign_config.forEach((element: any) => {
            if (dataDiffirent.some((p: any) => p.id == element.id && p.recipient_id == element.recipient_id && p.id_have_data == element.id_have_data)) {
              if (dataDetermine.some((p: any) => p.id == element.recipient_id)) {
                this.removeDataSignChange(element.id_have_data);
              }
            }
          })
          /*
          end
          */
        }
      })
    }

    this.datasForm.contract_user_sign.forEach((resForm: any) => {
      if (resForm.sign_config.length > 0 && resForm.sign_unit != 'so_tai_lieu') {
        let arrConfig = [];
        arrConfig = resForm.sign_config.filter((val: any) =>
          !val.recipient_id || dataContractUserSign.some((data) => data.sign_unit == val.sign_unit)
        )
        resForm.sign_config = arrConfig; // set data with object not change data
        resForm.sign_config.forEach((items: any) => {
          items.id = items.id + '1'; // tránh trùng với id cũ, gây ra lỗi
          let data: any = {};
          data = dataDetermine.filter((data: any) =>
            items.recipient_id == data.template_recipient_id ||
            data.email == (items.recipient ? items.recipient.email : items.email))[0];
          if (data) {
            items.is_type_party = data.is_type_party;
          }
        })
      }
    })
    //
    if (this.isNoEmailObj) {
      // lấy ra người ký từ mẫu chưa có email để gán lại
      let dataNoEmail: any[] = [];
      this.datasForm.is_determine_clone.forEach((data: any) => {
        data.recipients.forEach((element: any) => {
          dataNoEmail.push(element);
        })
      })
      this.datasForm.contract_user_sign.forEach((dataForm: any) => {
        if (dataForm.sign_config.length > 0) {
          for (let i = 0; i < dataForm.sign_config.length; i++) {
            let dataObj = dataNoEmail.filter((p: any) => p.template_recipient_id && p.template_recipient_id == dataForm.sign_config[i].recipient_id)[0];
            if (!dataForm.sign_config[i].email && dataObj) {
              if (dataForm.sign_unit != 'so_tai_lieu' || (dataForm.sign_unit == 'so_tai_lieu' && !this.datasForm.contract_no)) {
                if (dataForm.sign_unit == 'text') {
                  dataForm.sign_config[i].text_attribute_name = dataForm.sign_config[i].name;
                }
                dataForm.sign_config[i].email = dataObj.email;
                dataForm.sign_config[i].name = dataObj.recipient ? dataObj.recipient.name : dataObj.name;
                dataForm.sign_config[i].recipient_id = dataObj.id;
                if (dataForm.sign_config[i].recipient && !dataForm.sign_config[i].recipient.email) {
                  dataForm.sign_config[i].recipient.email = dataObj.email;
                }
              } else {
                if (dataForm.sign_unit == 'text') {
                  dataForm.sign_config[i].text_attribute_name = dataForm.sign_config[i].name;
                }
                dataForm.sign_config[i].recipient_id = "";
                dataForm.sign_config[i].name = "";
                dataForm.sign_config[i].email = "";
                if (dataForm.sign_unit == 'so_tai_lieu' && this.datasForm.contract_no) {
                  dataForm.sign_config[i].value = this.datasForm.contract_no;
                }
              }
            } else {
              // add variable is_have_text check "text" accept input data content
              if (dataForm.sign_unit == 'text' && !dataForm.sign_config[i].recipient_id) {
                dataForm.sign_config[i].is_have_text = true;
                dataForm.sign_config[i].text_attribute_name = dataForm.sign_config[i].name;
              }
              dataForm.sign_config[i].name = "";
              if (dataForm.sign_unit == 'so_tai_lieu' && this.datasForm.contract_no) {
                dataForm.sign_config[i].value = this.datasForm.contract_no;
              }
            }
          }
        }
      })
      this.isNoEmailObj = true;
    } else {
      for (const element of this.datasForm.contract_user_sign) {
        if (element.sign_unit == 'so_tai_lieu') {
          for (const item of element.sign_config) {
            item.value = this.datasForm.contract_no;
            if (this.datasForm.contract_no) {
              item.name = "";
              item.recipient_id = "";
              item.email = "";
            }
          }
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.step == 'sample-contract-form') {
      this.next('save_draft');
    }
  }

  async removeDataSignChange(data: any) {
    // this.spinner.show();
    await this.contractService.deleteInfoContractSignature(data).toPromise().then((res: any) => {
    }, (error: HttpErrorResponse) => {
    })
  }

  getListNameSign(data_user_sign: any) {
    data_user_sign.forEach((element: any) => {
      if (element.type == 1 || element.type == 5) {
        element.recipients.forEach((item: any) => {
          if (item.role == 3 || item.role == 4 || item.role == 2) {
            item['type_unit'] = 'organization';
            item['selected'] = false;
            item['is_disable'] = false;
            // item['id'] = item.id;
            this.list_sign_name.push(item);
          }
        })
      } else if (element.type == 2 || element.type == 3) {
        element.recipients.forEach((item: any) => {

          if (item.role == 3 || item.role == 4 || item.role == 2) {
            item['type_unit'] = 'partner'
            item['selected'] = false;
            item['is_disable'] = false;
            item['type'] = element.type;
            // item['id'] = item.id;
            this.list_sign_name.push(item);
          }
        })
      }
    })
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
      // if (event.rect.width <= 280) {
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
      // }
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
      let signElement = <HTMLElement>document.getElementById(id);
      let rect_location = signElement.getBoundingClientRect();
      if (id.includes('chua-keo')) {  //Khi kéo vào trong hợp đồng thì sẽ thêm 1 object vào trong mảng sign_config
        event.target.style.webkitTransform = event.target.style.transform = 'none';// Đẩy chữ ký về vị trí cũ
        event.target.setAttribute('data-x', 0);
        event.target.setAttribute('data-y', 0);
        id = event.target.id.replace("chua-keo-", "");
        // this.datasForm.documents.document_user_sign_clone.forEach((element, index) => {
        this.datasForm.contract_user_sign.forEach((element: any, index: any) => {
          if (element.id == id) {
            let _obj: any = {
              sign_unit: element.sign_unit,
              name: element.name,
              text_attribute_name: element.text_attribute_name,
              required: 1,
              text_type: 'default'
            }
            if (element.sign_config.length == 0) {
              _obj['id'] = 'signer-' + index + '-index-0_' + element.id; // Thêm id cho chữ ký trong hợp đồng
            } else {
              _obj['id'] = 'signer-' + index + '-index-' + (element.sign_config.length) + '_' + element.id;
            }
            element['sign_config'].push(_obj);
          }
        })
        // lay doi tuong vua duoc keo moi vao hop dong

        if(this.isContractNoNameNull)
          this.signCurent = this.convertToSignConfig().filter((p: any) => (p.sign_unit != 'so_tai_lieu' && !p.name) && !p.position && !p.coordinate_x && !p.coordinate_y)[0];
        else
          this.signCurent = this.convertToSignConfig().filter((p: any) => !p.position && !p.coordinate_x && !p.coordinate_y)[0];
      } else {
        // doi tuong da duoc keo tha vao hop dong
        this.signCurent = this.convertToSignConfig().filter((p: any) => p.id == id)[0];
      }

      if (this.signCurent) {
        if (!this.objDrag[this.signCurent['id']]) {
          this.objDrag[this.signCurent['id']] = {};
        }

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
          // show toa do keo tha chu ky (demo)
          // this.location_sign_x = this.signCurent['coordinate_x'];
          // this.location_sign_y  = this.signCurent['coordinate_y'];
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
        let field_data = [];
        // lay lai danh sach signer sau khi keo vao hop dong
        this.datasForm.contract_user_sign.forEach((res: any) => {
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
                  } else if(res.sign_config.length > 0)  {
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
                    }
                  }
                  this.isChangeText = true;
                } else {
                  this.isChangeText = false;
                }

                // element['number'] = _arrPage[_arrPage.length - 1];
                element['page'] = _arrPage[_arrPage.length - 1];
                element['position'] = this.signCurent['position'];
                element['coordinate_x'] = this.signCurent['coordinate_x'];
                element['coordinate_y'] = this.signCurent['coordinate_y'];
                element['dif_x'] = this.signCurent['dif_x'];
                if (!this.objDrag[this.signCurent['id']].count) {
                  // element['width'] = this.datasForm.configs.e_document.format_signature_image.signature_width;
                  if (!element.width && !element.height) {
                    if (res.sign_unit == 'text' || res.sign_unit == 'so_tai_lieu') {
                      if (res.sign_unit == 'so_tai_lieu' && this.datasForm.contract_no) {
                        element['width'] = '';
                        element['height'] = '';
                      } else {
                        element['width'] = '135';
                        element['height'] = '28';
                      }
                    } else {
                      element['width'] = '135';
                      element['height'] = '85';
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

  getCheckSignature(isSignType: any, listSelect?: string, value?: any) {
    // p.recipient_id == element.id && p.sign_unit == isSignType)
    this.list_sign_name.forEach((element: any) => {
      if (isSignType == 'text' && value) {
        element.is_disable = true;
      } else {
          if (this.convertToSignConfig().some((p: any) => (p.recipient ? p.recipient.email : p.email) == element.email && p.sign_unit == isSignType)) {
            if (isSignType != 'text') {
              if(isSignType == 'so_tai_lieu') {
                element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4) || element.role == 4)
              } else {
                element.is_disable = true
              }
            }
          } else {
            if (isSignType == 'chu_ky_anh') {
              element.is_disable = !(element.sign_type.some((p: any) => p.id == 1 || p.id == 5) && element.role != 2);
            } else if (isSignType == 'chu_ky_so') {
              element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6) && element.role != 2);
            } else if (isSignType == 'text') {
              // element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4) || element.role == 4);
              element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4)); //disable van thu select text

            } else {
              if(this.datasForm.contract_no) {
                element.is_disable = true;
              } else {
                // element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4) || element.role == 4 )
                element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4)) //disable van thu select o^ so^'

              }
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
      (element.sign_type.some((id: number) => id == 1 || id == 5) && isSignType == 'chu_ky_anh') || (element.sign_type.some((id: number) => [2, 3, 4].includes(id)) && isSignType == 'chu_ky_so') || (isSignType == 'text' && (element.sign_type.some((id: number) => id == 2) || element.role == 4) || (isSignType == 'so_tai_lieu' && (element.role != 4 || (this.datasForm.contract_no && element.role == 4))))) {
      return true;
    } else return false;
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
    console.log(x, y);
    // // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    // // update the posiion attributes
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
    pdfjs.getDocument(this.pdfSrc).promise.then((pdf: any) => {
      this.thePDF = pdf;
      this.pageNumber = (pdf.numPages || pdf.pdfInfo.numPages)
      this.removePage();
      this.arrPage = [];
      for (let page = 1; page <= this.pageNumber; page++) {
        let canvas = document.createElement("canvas");
        // const viewport = pageObj.getViewport({ scale: 1 });
        this.arrPage.push({ page: page });
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
        if(this.datasForm.isFirstLoadDrag != true) this.setX();
        this.datasForm.arrDifPage = this.arrDifPage;
        this.datasForm.difX = Math.max(...canvasWidth) - Math.min(...canvasWidth);
      }, 100)
    })
  }

  eventMouseover() {
    if (!this.datasForm.isView) {
      this.objDrag = {};
      let count_total = 0;
      this.datasForm.contract_user_sign.forEach((element: any) => {
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
      let viewport = page.getViewport({ scale: this.scale });
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
      },1000)

      setTimeout(() => {
        clearInterval(interval)
      },2000);
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
    if (this.datasForm.contract_no && d.sign_unit == 'so_tai_lieu') {
      style.padding = '6px';
    }
    return style;
  }

  getAddSignUnit() {
    this.datasForm.is_data_object_signature.forEach((element: any) => {
      if (element.type == 1) {
        element['sign_unit'] = 'text';
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
    if(d.sign_unit == 'text' || d.sign_unit == 'so_tai_lieu') {
      this.textSign = true;
      this.list_font = ["Arial","Calibri","Times New Roman"];
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
      // let is_name_signature = this.list_sign_name.filter((item: any) => item.name == this.objSignInfo.name)[0];

      if (isObjSign) {
        this.isEnableSelect = false;
        this.objSignInfo.traf_x = d.coordinate_x;
        this.objSignInfo.traf_y = d.coordinate_y;
        // this.signCurent.name = d.name;

        this.objSignInfo.width = parseInt(d.width);
        this.objSignInfo.height = parseInt(d.height);

        this.isEnableText = d.sign_unit == 'text';
        this.isChangeText = d.sign_unit == 'so_tai_lieu';

        if(isObjSign.font) {
          this.objSignInfo.font = isObjSign.font;
        } else {
          this.objSignInfo.font = 'Times New Roman';
        }

        if(isObjSign.font_size) {
          this.objSignInfo.font_size = isObjSign.font_size;
        } else {
          this.objSignInfo.font_size = 13;
        }

        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name
        }

        this.getCheckSignature(d.sign_unit, d.name, d.is_have_text);

        if (d.is_have_text) {
          this.isEnableSelect = true;
        }


        if (!d.name && !d.recipient?.name) {
          //@ts-ignore
          document.getElementById('select-dropdown').value = "";
        } else {
          if(d.recipient_id) {
              //@ts-ignore
              document.getElementById('select-dropdown').value = d.recipient_id;
          } else {
              //@ts-ignore
              document.getElementById('select-dropdown').value = "";
          }
        }
      }
    }
  }

  // Hàm remove đối tượng đã được kéo thả vào trong file hợp đồng canvas
  async onCancel(e: any, data: any) {
    let dataHaveId = true;
    this.isChangeText = false;
    if (data.id_have_data && this.router.url.includes("edit")) {
      this.spinner.show();
      await this.contractService.deleteInfoContractSignature(data.id_have_data).toPromise().then((res: any) => {
        this.toastService.showSuccessHTMLWithTimeout('Bạn đã xóa đối tượng ký trong hợp đồng!', "", "3000");
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
        this.toastService.showErrorHTMLWithTimeout(error.message, "", "3000");
        this.spinner.hide();
        dataHaveId = false;
      })
    }
    if (dataHaveId) {
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
      this.datasForm.contract_user_sign.forEach((element: any, user_sign_index: any) => {
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
  }

  // Hàm tạo các đối tượng kéo thả
  convertToSignConfig() {
    let arrSignConfig: any = [];
    let cloneUserSign = [...this.datasForm.contract_user_sign];

    cloneUserSign.forEach(element => {
      if (this.datasForm.is_action_contract_created) {
        if ((element.recipient && ![2, 3].includes(element.recipient.status)) || (!element.recipient && ![2, 3].includes(element.status))) {
          arrSignConfig = arrSignConfig.concat(element.sign_config);
        }
      } else arrSignConfig = arrSignConfig.concat(element.sign_config);
    })

    //
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


  onContentTextEvent() {
    let arrCheckTextContent = [];
    let dataTextDuplicate = this.datasForm.contract_user_sign.filter((p: any) => p.sign_unit == "text")[0];
    for (let i = 0; i < dataTextDuplicate.sign_config.length; i++) {
      if (dataTextDuplicate.sign_config[i].text_attribute_name) {
        arrCheckTextContent.push(dataTextDuplicate.sign_config[i].text_attribute_name);
      }
    }

    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckTextContent.length; ++k) {
      var value: any = arrCheckTextContent[k];
      if (value in valueSoFar) {
        return true;
      }
      valueSoFar[value] = true;
    }
    return false;
  }

  // edit location doi tuong ky
  soHopDong: any;
  changePositionSign(e: any, locationChange: any, property: any) {
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
          if(locationChange != 'text_type') {
          isObjSign.text_attribute_name = e;
          signElement.setAttribute("text_attribute_name", isObjSign.text_attribute_name);
          } else if (locationChange == 'text_type') {
            let type_name = this.list_text_type.filter((p: any) => p.id == e.target.value)[0].name;

            isObjSign.text_type = type_name;
            signElement.setAttribute("text_type", isObjSign.text_type);
          }
        } else if (property == 'font') {
          isObjSign.font = e.target.value;
          signElement.setAttribute("font", isObjSign.font);

          this.datasForm.contract_user_sign.forEach((res: any) => {
            if (res.sign_config.length > 0) {
              let arrSignConfigItem: any = "";

              if(res.sign_unit == 'so_tai_lieu') {
                arrSignConfigItem = res.sign_config;

                arrSignConfigItem.forEach((element: any) => {
                  element.font = isObjSign.font;
                })
              }
            }
          });

        } else if(property == 'font_size') {
          isObjSign.font_size = e.target.value;
          signElement.setAttribute("font_size", isObjSign.font_size);

          this.datasForm.contract_user_sign.forEach((res: any) => {
            if (res.sign_config.length > 0) {
              let arrSignConfigItem: any = "";

              if(res.sign_unit == 'so_tai_lieu') {
                arrSignConfigItem = res.sign_config;

                arrSignConfigItem.forEach((element: any) => {
                  element.font_size = isObjSign.font_size;
                })
              }
            }
          });
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

            isObjSign.email = data_name.email;
            signElement.setAttribute("email", isObjSign.email);

            if (!isObjSign.height) {
              isObjSign.height = ['so_tai_lieu', 'text'].includes(isObjSign.sign_unit) ? 28 : 85;
              signElement.setAttribute("height", isObjSign.height);
            }

            if (!isObjSign.width) {
              isObjSign.width = 135;
              signElement.setAttribute("height", isObjSign.width);
            }

            if(data_name.role == 4 && this.isChangeText) {
              this.soHopDong = data_name;

              //Gán lại tất cả số hợp đồng cho một người ký
              this.datasForm.contract_user_sign.forEach((res: any) => {
                if (res.sign_config.length > 0) {
                  let arrSignConfigItem: any = "";

                  if(res.sign_unit == 'so_tai_lieu') {
                    arrSignConfigItem = res.sign_config;

                    arrSignConfigItem.forEach((element: any) => {
                      element.name = this.soHopDong.name;
                      element.signature_party = data_name.type_unit;
                      element.recipient_id = data_name.id;
                      element.status = data_name.status;
                      element.type = data_name.type;
                      element.email = data_name.email;
                    })
                  }
                }
              });
            }
          }
        }
      }
    }
  }

  contractNo: any;
  getValueText(e: any, d: any) {
    const num = e;
    d.value = num;

    if (d.sign_unit == 'so_tai_lieu') {
      this.datasForm.contract_no = e;
      this.contractNo = e;
    }
  }

  checkSignId(id: String){
    return isNaN(Number(id));
  }

  reverseInput(e: any, d: any){
    //
    // const num = this.removePeriodsFromCurrencyValue(e);
    // d.value = num;
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
    console.log("abc ", this.datasForm.contract_no);
    this.contractNo = this.datasForm.contract_no;
    this.nextOrPreviousStep(step);
  }

  isCheckRelease: boolean = false;
  async next(action: string) {
    if (action == 'next_step' && !this.validData()) {
      if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
        this.save_draft_infor_form.close_header = false;
        this.save_draft_infor_form.close_modal.close();
      }
      return;
    } else {
      let coutError = false;
      let contract_no = this.datasForm.contract_no;
      let code = this.datasForm.code;
      if (this.isChangeNumberContract != this.datasForm.contract_no) {
        await this.contractService.checkCodeUnique(this.datasForm.contract_no).toPromise().then(
          dataCode => {
            if (!dataCode.success) {
              this.toastService.showWarningHTMLWithTimeout('contract_number_already_exist', "", 3000);
              this.spinner.hide();
              coutError = true;
            }
          }, (error) => {
            coutError = true;
            this.toastService.showErrorHTMLWithTimeout('Lỗi kiểm tra số hợp đồng', "", 3000);
            this.spinner.hide();
          });

          if (!coutError) {
            if(action == 'save_draft') {
              this.datasForm.code = null;
              this.datasForm.contract_no = null;
            }
            await this.contractService.addContractStep1(this.datasForm, this.datasForm.contract_id, 'template_form').toPromise().then((data) => {

            }, (error) => {
              coutError = true;
            })
          }
      }

      this.datasForm.contract_no = contract_no;
      this.datasForm.code = code;
      if (coutError) return;

      if (action == 'save_draft') {
        if (this.router.url.includes("edit")) {
          let isHaveFieldId: any[] = [];
          let isNotFieldId: any[] = [];
          let isUserSign_clone = _.cloneDeep(this.datasForm.contract_user_sign);
          isUserSign_clone.forEach((res: any) => {
            res.sign_config.forEach((element: any) => {
              if (element.id_have_data) {
                isHaveFieldId.push(element)
              } else isNotFieldId.push(element);
            })
          })
          this.getDefindDataSignEdit(isHaveFieldId, isNotFieldId, action);
        } else {
          this.data_sample_contract = [];
          let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "is_have_text", "id_have_data", "text_type"];
          let isContractUserSign_clone = _.cloneDeep(this.datasForm.contract_user_sign);
          isContractUserSign_clone.forEach((element: any) => {
            if (element.sign_config.length > 0) {
              element.sign_config.forEach((item: any) => {
                item['font'] = item.font ? item.font : 'Times New Roman';
                item['font_size'] = item.font_size ? item.font_size : 13;
                item['contract_id'] = this.datasForm.contract_id;
                item['document_id'] = this.datasForm.document_id;
                if (item.text_attribute_name) {
                  item.name = item.text_attribute_name;
                }
                if (item.sign_unit == 'chu_ky_anh') {
                  item['type'] = 2;
                } else if (item.sign_unit == 'chu_ky_so') {
                  item['type'] = 3;
                } else if (item.sign_unit == 'so_tai_lieu') {
                  item['type'] = 4;
                  if (this.datasForm.contract_no) {
                    if (!item.name)
                      item.name = "";

                    if (!item.recipient_id)
                      item.recipient_id = "";

                    if (!item.status)
                      item.status = 0;
                  }
                } else if(item.sign_unit == 'text'){
                  if(item.text_type == 'currency'){
                    item['type'] = 5; } else {
                    item['type'] = 1;}
                }

                data_remove_arr_request.forEach((item_remove: any) => {
                  delete item[item_remove]
                })
              })
              Array.prototype.push.apply(this.data_sample_contract, element.sign_config);
            }
          })

          this.spinner.show();

          this.isCheckRelease = true;
          this.data_sample_contract = this.data_sample_contract.filter((element:any) => typeof element.name !== 'undefined');

          this.data_sample_contract.forEach((element: any) => {
            if(this.datasForm.arrDifPage[Number(element.page)-1] == 'max'){
              element.coordinate_x = element.coordinate_x - this.datasForm.difX;
            }
          })

          this.setValueForContractNo(this.data_sample_contract);
          this.contractService.getContractSample(this.data_sample_contract).subscribe((data) => {
            if(this.validData() == true){
              this.contractService.getDataPreRelease(this.datasForm.contract_id).subscribe((contract: any) => {
                this.contractService.addContractRelease(contract).subscribe((res: any) => {
                });
              });
              this.router.navigate(['/main/contract/create/draft']);
              this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            } else {
            this.router.navigate(['/main/contract/create/draft']);
            this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            }
          },
            (error: HttpErrorResponse) => {
              this.spinner.hide();
              return false;
            }, () => {
              this.spinner.hide();
            }
          );
          if (this.save_draft_infor_form && this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
            this.save_draft_infor_form.close_header = false;
            this.save_draft_infor_form.close_modal.close();
          }
        }
      } else if (action == 'next_step') {
        // let coutError = false;
        this.spinner.show();
        this.datasForm.contract_user_sign.forEach((res: any) => {
          res.sign_config.forEach((element: any) => {
            if(element.type == 1) {
              element.name = element.text_attribute_name;
            }
          })
        })

        if(!this.datasForm.contract_no || !this.datasForm.code) {
          if(this.convertToSignConfig().filter((p: any) => p.sign_unit == 'so_tai_lieu')[0]) {
            this.datasForm.contract_no = this.convertToSignConfig().filter((p: any) => p.sign_unit == 'so_tai_lieu')[0].value;
            this.datasForm.code = this.convertToSignConfig().filter((p: any) => p.sign_unit == 'so_tai_lieu')[0].value;
          }
        }
        this.checkNumber(this.datasForm.ceca_push, this.convertToSignConfig().length)
        this.spinner.hide();
      }
    }
  }

  setValueForContractNo(dataSign: any) {
    dataSign.forEach((item:any) => {
      if (item.type === 4) {
        item.value = this.datasForm.contract_no;
      }
    });
  }


  setClass(dataDrag: any) {
    return 'resize-drag';
  }

  async getDefindDataSignEdit(dataSignId: any, dataSignNotId: any, action: any) {
    let dataSample_contract: any[] = [];
    if (dataSignId.length > 0) {
      let data_remove_arr_signId = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "is_have_text", "text_type"];
      dataSignId.forEach((res: any) => {
        if(res.type == 1 || res.type == 5) {
          res.name = res.text_attribute_name;
        }
        data_remove_arr_signId.forEach((itemRemove: any) => {
          delete res[itemRemove];
        })
      })

      let countIsSignId = 0;
      this.spinner.show();

      dataSignId.forEach((element: any) => {
        if(this.datasForm.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datasForm.difX;
        }
      })

      this.setValueForContractNo(dataSignId);
      for (let i = 0; i < dataSignId.length; i++) {
        let id = dataSignId[i].id_have_data;
        delete dataSignId[i].id_have_data;
        await this.contractService.getContractSampleEdit(dataSignId[i], id).toPromise().then((data: any) => {
          dataSample_contract.push(data);
          if(this.validData('release-check') == true){
            this.contractService.getDataPreRelease(this.datasForm.contract_id).subscribe((contract: any) => {
              this.contractService.addContractRelease(contract).subscribe((res: any) => {
              });
            });
          }
        }, (error: HttpErrorResponse) => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi! vui lòng thao tác lại hoặc liên hệ với nhà phát triển để xử lý!', "", 3000);
          countIsSignId++;
        })
        if (countIsSignId > 0) {
          this.spinner.hide();
          break;
        }
      }
    }

    let isErrorNotId = false;
    if (dataSignNotId.length > 0) {
      let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "is_have_text", "id_have_data", "text_type"];
      dataSignNotId.forEach((item: any) => {
        item['font'] = item.font ? item.font : 'Times New Roman';
        item['font_size'] = item.font_size ? item.font_size : 12;
        item['contract_id'] = this.datasForm.contract_id;
        item['document_id'] = this.datasForm.document_id;
        if (item.text_attribute_name) {
          item.name = item.text_attribute_name;
        }
        if (item.sign_unit == 'chu_ky_anh') {
          item['type'] = 2;
        } else if (item.sign_unit == 'chu_ky_so') {
          item['type'] = 3;
        } else if (item.sign_unit == 'so_tai_lieu') {
          item['type'] = 4;
          if (this.datasForm.contract_no) {
            if (!item.name)
              item.name = "";

            if (!item.recipient_id)
              item.recipient_id = "";

            if (!item.status)
              item.status = 0;
          }
        } else if (item.sign_unit == 'text'){
          if(item.text_type == 'currency'){
            item['type'] = 5; }
          else {
            item['type'] = 1;
          }
        }

        data_remove_arr_request.forEach((item_remove: any) => {
          delete item[item_remove]
        })
      })

      dataSignNotId.forEach((element: any) => {
        if(this.datasForm.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datasForm.difX;
        }
      })
      await this.contractService.getContractSample(dataSignNotId).toPromise().then((data) => {
        this.spinner.hide();
      }, error => {
        isErrorNotId = true;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Có lỗi! Vui lòng liên hệ với nhà phát triển để xử lý", "", 3000);
        return false;
      });
    }

    let isSuccess = 0;
    if (dataSignId.length > 0 && dataSample_contract.length != dataSignId.length) {
      isSuccess += 1;
    }

    if (dataSignNotId.length > 0 && isErrorNotId) {
      isSuccess += 1;
    }

    if (isSuccess == 0) {
      // if (action == 'next_step') {
      //   this.step = variable.stepSampleContract.step4;
      //   this.datasForm.stepLast = this.step
      //   this.nextOrPreviousStep(this.step);
      // } else
      if (action == 'save_draft') {
        // this.datasForm.save_draft.sample_contract = false;
        this.stepChangeSampleContractForm.emit('save_draft_sample_contract')
        if (this.datasForm['close_modal']) {
          this.datasForm.close_modal.close('Save click');
        }
        // this.getRemoveCopyRight();
        this.router.navigate(['/main/contract/create/draft']);
        this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
      }
    } else {
      if (this.save_draft_infor_form.close_header && this.save_draft_infor_form.close_modal) {
        this.save_draft_infor_form.close_header = false;
        this.save_draft_infor_form.close_modal.close();
      }
    }
  }


  // forward data component
  nextOrPreviousStep(step: string) {
    this.contractService.checkCurrencyValue(this.datasForm);
    // this.getRemoveCopyRight();
    this.datasForm.stepLast = step;

    this.stepChangeSampleContractForm.emit(step);
  }
  async checkNumber(countCeCa: number, countTimestamp: number) {

    this.orgId = this.userService.getInforUser().organization_id;
    let getNumberContractCreateOrg;
    try {
      getNumberContractCreateOrg = await this.contractService.getDataNotifyOriganzation().toPromise();
    } catch (err) {
      this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin số lượng hợp đồng' + err, '', 3000);
    }
    // if (countCeCa > 0 && (Number(getNumberContractCreateOrg.numberOfCeca) - this.datasForm.ceca_push) < 0) {
    //   this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lần gửi xác nhận BCT. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
    //   return false;
    // } else if (countTimestamp > 0 && (Number(getNumberContractCreateOrg.numberOfTimestamp) - this.convertToSignConfig().length) < 0) {
    //   this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lượng timestamp đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
    //   return false;
    // } else {
        this.stepForm = variable.stepSampleContractForm.step4;
        this.datasForm.stepLast = this.stepForm
        this.nextOrPreviousStep(this.stepForm);
    // }
  }

  validData(isSaveDraft?: any) {
    let data_not_drag = this.datasForm.contract_user_sign.filter((p: any) => p.sign_config.length > 0)[0];

    if (!data_not_drag) {
      this.spinner.hide();
      if(!this.isCheckRelease) {
        this.toastService.showWarningHTMLWithTimeout("Vui lòng chọn ít nhất 1 đối tượng kéo thả!", "", 3000);
      }
      return false;
    } else {
      let count = 0;
      let count_text = 0;
      let count_number = 0;
      let count_text_number = 0;

      let arrSign_organization: any[] = [];
      let arrSign_partner: any[] = [];

      let coordinate_x: number [] = [];
      let coordinate_y: number [] = [];
      let width: number [] = [];
      let height: number [] = [];

      for (let i = 0; i < this.datasForm.contract_user_sign.length; i++) {
        if (this.datasForm.contract_user_sign[i].sign_config.length > 0) {
          for (let j = 0; j < this.datasForm.contract_user_sign[i].sign_config.length; j++) {
            let element = this.datasForm.contract_user_sign[i].sign_config[j];

            if(isSaveDraft && element.sign_unit == 'text'){
              if(element.recipient_id == null && !element.value)
              count++;
              break;
            }
            if (!element.name && !element.recipient && element.sign_unit != 'so_tai_lieu' && element.sign_unit != 'text') {
              count++;
              break
            } else if (element.sign_unit == 'so_tai_lieu') {
              if (element.length > 1) {
                count_number++;
                break;
              } else if(!element.name && !element.value && !this.datasForm.contract_no) {
                count++;
                break;
              }
            } else if (element.sign_unit == 'text') {
              if (!element.text_attribute_name && !element.is_have_text) {
                count_text++;
                break
              } else if (element.is_have_text && !element.value ) {
                count_text_number++;
                break;
              } else if(!element.name && !element.value) {
                count++;
                break;
              }
            } else {

              if(element.email != undefined) {
                let data_sign = {
                  name: element.name,
                  signature_party: element.signature_party,
                  recipient_id: element.recipient_id,
                  email: element.recipient ? element.recipient.email : element.email,
                  sign_unit: element.sign_unit
                }
                if (element.signature_party == "organization" || element.is_type_party == 1)
                  arrSign_organization.push(data_sign);
                else arrSign_partner.push(data_sign);
              } else {
                let data_sign = {
                  name: element.name,
                  signature_party: element.signature_party,
                  recipient_id: element.recipient_id,
                  email: element.recipient ? element.recipient.email : element.email,
                  sign_unit: element.sign_unit
                }
                if (element.signature_party == "organization" || element.is_type_party == 1)
                  arrSign_organization.push(data_sign);
                else arrSign_partner.push(data_sign);
              }
            }

            if(element.coordinate_x) {
              coordinate_x.push(Number(element.coordinate_x));
              coordinate_y.push(Number(element.coordinate_y));
              width.push(Number(element.width));
              height.push(Number(element.height));
            }

          }
          if (count > 0 || count_number > 0 || count_text > 0) {
            break;
          }
        }
      }

       //Trường hợp 1: ô 1 giao ô 2 trong vùng x2 thuộc (x1 đến x1+w); y2 thuộc (y1 đến y1+h) = góc phải dưới
       for(let i = 0; i < coordinate_x.length; i++) {
        for(let j = i+1; j < coordinate_x.length; j++) {
          if(
            (Number(coordinate_x[i]) <= Number(coordinate_x[j]) && Number(coordinate_x[j]) <= (Number(coordinate_x[i]) + Number(width[i])))
            &&
            (Number(coordinate_y[i]) <= Number(coordinate_y[j]) && Number(coordinate_y[j] <= (Number(coordinate_y[i]) + Number(height[i]))))
            // && coordinate_y[i] <= coordinate_y[j] <= (coordinate_y[i] + height[i])
          ) {
            if(!this.isCheckRelease && !isSaveDraft) this.toastService.showErrorHTMLWithTimeout("Vị trị các ô ký không được để trùng hoặc giao nhau","",3000);
            return false;
          }
        }
      }

      //Trường hợp 2: ô 1 giao ô 2 trong vùng x2 thuộc (x1 đến x1+w); y2+h thuộc (y1 đến y1+h) = góc phải trên
      for(let i = 0; i < coordinate_x.length; i++) {
        for(let j = i+1; j < coordinate_x.length; j++) {
          if(
            (Number(coordinate_x[i]) <= Number(coordinate_x[j]) && Number(coordinate_x[j]) <= (Number(coordinate_x[i]) + Number(width[i])))
            &&
            (Number(coordinate_y[i]) <= (Number(coordinate_y[j]) + Number(height[j])) && (Number(coordinate_y[j] + Number(height[j])) <= (Number(coordinate_y[i]) + Number(height[i]))))
              // && coordinate_y[i] <= coordinate_y[j] <= (coordinate_y[i] + height[i])
            ) {
              if(!this.isCheckRelease && !isSaveDraft) this.toastService.showErrorHTMLWithTimeout("Vị trị các ô ký không được để trùng hoặc giao nhau","",3000);
              return false;
            }
          }
      }

      //Trường hợp 3: ô 1 giao ô 2 trong vùng x2+w thuộc (x1 đến x1+w); y2+h thuộc (y1 đến y1+h) = góc trái trên
      for(let i = 0; i < coordinate_x.length; i++) {
        for(let j = i+1; j < coordinate_x.length; j++) {
          if(
            (Number(coordinate_x[j]) <= Number(coordinate_x[i]) && Number(coordinate_x[i]) <= (Number(coordinate_x[j]) + Number(width[j])))
            &&
            (Number(coordinate_y[j]) <= Number(coordinate_y[i]) && Number(coordinate_y[i] <= (Number(coordinate_y[j]) + Number(height[j]))))
          ) {
            if(!this.isCheckRelease && !isSaveDraft) this.toastService.showErrorHTMLWithTimeout("Vị trị các ô ký không được để trùng hoặc giao nhau","",3000);
            return false;
          }
        }
      }

       //Trường hợp 4: ô 1 giao ô 2 trong vùng x2 thuộc (x1 đến x1+w); y2+h thuộc (y1 đến y1+h) = góc phải trên
       for(let i = 0; i < coordinate_x.length; i++) {
        for(let j = i+1; j < coordinate_x.length; j++) {
          if(
            (Number(coordinate_x[j]) <= Number(coordinate_x[i]) && Number(coordinate_x[i]) <= (Number(coordinate_x[j]) + Number(width[j])))
            &&
            (Number(coordinate_y[j]) <= (Number(coordinate_y[i]) + Number(height[i])) && (Number(coordinate_y[i] + Number(height[i])) <= (Number(coordinate_y[j]) + Number(height[j]))))
              // && coordinate_y[i] <= coordinate_y[j] <= (coordinate_y[i] + height[i])
            ) {
              if(!this.isCheckRelease  && !isSaveDraft) this.toastService.showErrorHTMLWithTimeout("Vị trị các ô ký không được để trùng hoặc giao nhau","",3000);
              return false;
            }
          }
      }

      if (this.onContentTextEvent()) {
        if(!this.isCheckRelease  && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout("Trùng tên trường ô text. Vui lòng kiểm tra lại!", "", 3000);
        return false;
      }

      if (count > 0) {
        // alert('Vui lòng chọn người ký cho đối tượng đã kéo thả!')
        this.spinner.hide();
        if(!this.isCheckRelease  && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout("select.signer.obj", "", 3000);
        return false;
      } else if (count_number > 1) {
        this.spinner.hide();
        if(!this.isCheckRelease  && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout("select.signer.obj", "", 3000);
        return false;
      } else if (count_text > 0) {
        this.spinner.hide();
        if(!this.isCheckRelease  && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout("Bạn chưa nhập tên trường cho đối tượng Text!", "", 3000);
        return false;
      } else if (count_text_number > 0) {
        this.spinner.hide();
        if(!this.isCheckRelease  && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout("please_input_text_number_contract", "", 3000);
        return false;
      } else {
        // valid đối tượng ký của tổ chức
        let data_organization = this.list_sign_name.filter((p: any) => p.type_unit == "organization" && p.role != 2);
        let error_organization = 0;
        let nameSign_organization = {
          name: '',
          sign_type: ''
        };
        // valid ký kéo thiếu ô ký cho từng loại ký
        for (const element of data_organization) {
          if (element.sign_type.length > 0) {
            if (element.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6) &&
            arrSign_organization.filter((item: any) => item.email == element.email && item.sign_unit == 'chu_ky_so').length == 0) {
              error_organization++;
              nameSign_organization.name = element.name;
              nameSign_organization.sign_type = 'chu_ky_so';
              break
            }
          }
        }

        // if (error_organization > 0) {
        //   this.spinner.hide();
        //   this.toastService.showWarningHTMLWithTimeout((this.translate.instant('miss.digital.sig'))+ " " + `${nameSign_organization.name}`+ " " + (this.translate.instant('off.org.please')), "", 3000);
        //   return false;
        // }

        // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
        if (arrSign_organization.length < data_organization.length) {
          this.spinner.hide();
          if(!this.isCheckRelease  && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout("Thiếu đối tượng ký của tổ chức, vui lòng chọn đủ người ký!", "", 3000);
          return false;
        }

        // valid đối tượng ký của đối tác
        let data_partner = this.list_sign_name.filter((p: any) => p.type_unit == "partner" && p.role != 2);
        let countError_partner = 0;
        let nameSign_partner = {
          name: '',
          sign_type: ''
        };
        // valid ký kéo thiếu ô ký cho từng loại ký
        for (const element of data_partner) {
          if (element.sign_type.length > 0) {
            if (element.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6) && arrSign_partner.filter((item: any) => item.email == element.email && item.sign_unit == 'chu_ky_so').length == 0) {
              countError_partner++;
              nameSign_partner.name = element.name;
              nameSign_partner.sign_type = 'chu_ky_so';
              break
            }
            if (element.sign_type.some((p: any) => p.id == 1 || p.id == 5) && arrSign_partner.filter((item: any) => item.email == element.email && item.sign_unit == 'chu_ky_anh').length == 0) {
              countError_partner++;
              nameSign_partner.name = element.name;
              nameSign_partner.sign_type = 'chu_ky_anh';
              break
            }
          }
        }

        if (countError_partner > 0) {
          this.spinner.hide();
          if(!this.isCheckRelease && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout(`Thiếu đối tượng ${nameSign_partner.sign_type == 'chu_ky_so' ? 'ký số' : 'ký ảnh'} của đối tác ${nameSign_partner.name}, vui lòng chọn đủ người ký!`, "", 3000);
          return false;
        }


        // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
        if (arrSign_partner.length < data_partner.length) {
          // alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!');
          this.spinner.hide();
          if(!this.isCheckRelease && !isSaveDraft) this.toastService.showWarningHTMLWithTimeout("Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!", "", 3000);
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

  pageNum: number = 1;
  page1: boolean = false;
  pageLast: boolean = true;

  pageRendering:any;
  pageNumPending: any = null;
  firstPage() {
    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, 0);

    this.pageNum = 1;
  }

  lastPage() {
    let canvas: any = document.getElementById('canvas-step3-'+this.pageNumber);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);

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
      let canvas: any = document.getElementById('canvas-step3-'+num);

      let canvas1: any = document.getElementById('pdf-viewer-step-3');

      let pdffull: any = document.getElementById('pdf-full');

      pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top)
    }
  }

  onEnter(event: any) {
    let canvas: any = document.getElementById('canvas-step3-'+event.target.value);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);
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
}
