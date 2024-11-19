import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  QueryList,
  ElementRef,
  OnDestroy,
  AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { variable } from "../../../../../config/variable";
import { Helper } from "../../../../../core/Helper";
import * as $ from 'jquery';

import interact from 'interactjs'
import { ContractService } from "../../../../../service/contract.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "../../../../../service/toast.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { UnitService } from 'src/app/service/unit.service';
import { UserService } from 'src/app/service/user.service';
import { CheckZoomService } from 'src/app/service/check-zoom.service';
import { DetectCoordinateService } from 'src/app/service/detect-coordinate.service';
import { environment } from 'src/environments/environment';

interface DropdownOption {
  value: number;
  text: string;
}
@Component({
  selector: 'app-sample-contract',
  templateUrl: './sample-contract.component.html',
  styleUrls: ['./sample-contract.component.scss']
})
export class SampleContractComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() datas: any;
  @Input() step: any;
  @ViewChild('itemElement') itemElement: QueryList<ElementRef> | undefined
  @Output() stepChangeSampleContract = new EventEmitter<string>();
  @Input() save_draft_infor: any;
  pdfSrc: any;
  thePDF: any = null;
  pageNumber = 1;
  canvasWidth = 0;
  arrPage: any = [];
  objDrag: any = {};
  scale: any;
  orgId: any;
  objPdfProperties: any = {
    pages: [],
  };
  difX: number = 0;

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
  arrDifPage: any = [];

  listSignNameClone: any = [];
  data_sample_contract: any = [];

  list_font: any;

  selectedFont: any = "";
  size: any;

  sum: number[] = [];
  top: any[] = [];

  textSign: boolean = false;

  imageSign: number = 2;
  digitalSign: number = 3;
  textUnit: number = 1;
  isOnTheLeft: boolean = true
  options: DropdownOption[] = [
    { value: 1, text: 'Option 1 Option 1 Option 1 Option 1 Option 1 Option 1 Option 1 Option 1 ' },
    { value: 2, text: 'Option 2' },
    { value: 3, text: 'Option 3' },
    // Add more options here
  ];
  isDropdownVisibleChuKySo: boolean = false;
  selectedOption: DropdownOption | undefined;
  showDropdown: boolean = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router,
    private checkZoomService: CheckZoomService,
    private userService: UserService,
    private detectCoordinateService: DetectCoordinateService
  ) {
    this.step = variable.stepSampleContract.step3
  }

  temp: any[];

  ngOnInit() {
    this.onResize();
    this.spinner.hide();

    this.list_font = ["Arial", "Calibri", "Times New Roman"];
    // xu ly du lieu doi tuong ky voi hop dong sao chep va hop dong sua
    if (this.datas.is_action_contract_created && !this.datas.contract_user_sign && (this.router.url.includes("edit"))) {
      // ham chuyen doi hinh thuc ky type => sign_unit
      // ham update du lieu hop dong sua
      this.getDataSignUpdateAction();
      this.datas.contract_user_sign = this.contractService.getDataFormatContractUserSign();
      this.setDataSignContract();
    }

    if (!this.datas.contract_user_sign) {
      this.datas.contract_user_sign = this.contractService.getDataFormatContractUserSign();
    } else {
      // Lay du lieu doi tuong ky cua buoc 2
      this.defindDataContract();
    }
    this.scale = 1;
    if (this.datas.is_determine_clone && this.datas.is_determine_clone.length > 0) {
      let data_user_sign = [...this.datas.is_determine_clone];
      this.getListNameSign(data_user_sign);
    }
    if (!this.signCurent) {
      this.signCurent = {
        width: 0,
        height: 0
      }
    }
    if (!this.datas.isDocx) {
      if (this.datas.is_action_contract_created) {
        if (this.datas.uploadFileContractAgain) {
          this.pdfSrc = Helper._getUrlPdf(this.datas.file_content);
        } else {
          let fileContract_1 = this.datas.i_data_file_contract.filter((p: any) => p.type == 1)[0];
          let fileContract_2 = this.datas.i_data_file_contract.filter((p: any) => p.type == 2)[0];
          if (fileContract_2) {
            this.pdfSrc = fileContract_2.path;
          } else {
            this.pdfSrc = fileContract_1.path;
          }
        }
      } else {
        this.pdfSrc = Helper._getUrlPdf(this.datas.file_content);
      }
    } else {
      this.pdfSrc = this.datas.convertedContractFileUrl
    }
    this.getPage();

    //Xac dinh vung cho tha vao
    interact('.dropzone').dropzone({
      //@ts-ignore
      accept: null,
      overlap: 1,
    })

    interact('.not-out-drop').on('dragend', this.showEventInfo).draggable({


      // @ts-ignore
      // styleCursor: true,

      listeners: { move: this.dragMoveListener, onend: this.showEventInfo },
      inertia: true,

      modifiers: [
        interact.modifiers.restrictRect({
          restriction: '.drop-zone',
          endOnly: true
        })
      ]
    })

    // //phong to thu nho o ky
    interact('.not-out-drop').on('resizeend', this.resizeSignature).resizable({
      edges: { right: true, bottom: true},

      listeners: {
        move: this.resizableListener, onend: this.resizeSignature
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: '.drop-zone'
        }),
        // minimum size
        interact.modifiers.restrictSize({
          // min: { width: 180, height: 60 }
        })
      ],
      inertia: true,
    })

    // // // event resize element
    // // //keo o ky
    interact('.resize-drag').on('dragend', this.showEventInfo).draggable({
      listeners: {
        move: this.dragMoveListener,
        onend: this.showEventInfo
      },
      inertia: true,
      autoScroll: true,
      modifiers: []
    })

    interact('.resize-drag').resizable({
      edges: { left: false, right: false, bottom: false, top: false },
    })

    interact.addDocument(document);


    if (this.datas.participants && this.datas.participants[0].recipients[0].fields.length > 0) {
      const font = this.datas.participants[0].recipients[0].fields[0].font;
      const font_size = this.datas.participants[0].recipients[0].fields[0].font_size;

      if (font && !this.datas.font) {
        this.datas.font = font;
        this.selectedFont = this.datas.font;

        this.datas.size = font_size;
        this.size = this.datas.size;
      }

    }

    if (!this.datas.font) {
      this.datas.font = "Times New Roman";
      this.selectedFont = this.datas.font;

      this.datas.size = 13;
      this.size = this.datas.size;
    }


    this.synchronized1(this.imageSign);
    this.synchronized2(this.digitalSign);
    this.synchronized1(this.textUnit);

    this.checkDifferent();
  }

  toggleDropdownChuKySo() {
    this.isDropdownVisibleChuKySo = !this.isDropdownVisibleChuKySo;
  }

  selectOption(option: DropdownOption) {
    this.selectedOption = option;
    this.showDropdown = false;

    // Perform any other actions based on the selected option
  }
  setX(){
    this.datas.isFirstLoadDrag = true;
    let i = 0;
    this.datas.contract_user_sign.forEach((element: any) => {
      if(element.sign_unit == "chu_ky_so") {
        let type = element.type;
        for (let i = 0; i < type.length; i++) {
          type[i].sign_config.forEach((item: any) => {
            if (this.arrDifPage[Number(item.page) - 1] == 'max') {
              const htmlElement: HTMLElement | null = document.getElementById(item.id);
              if (htmlElement) {
                var oldX = Number(htmlElement.getAttribute('data-x'));
                if (oldX) {
                  var newX = oldX + this.difX;
                  htmlElement.setAttribute('data-x', newX.toString());
                }
              }
              item.coordinate_x += this.difX;
            }
          }) 
        }
      } else {
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
      }
    })
  }

  synchronized1(numberSign: number) {
    for(let i = 0; i < this.datas.is_determine_clone.length; i++) {
      const clone = this.datas.is_determine_clone[i];

      for(let j = 0; j < this.datas.contract_user_sign[numberSign].sign_config.length; j++) {
        const signImage = this.datas.contract_user_sign[numberSign].sign_config[j];

        for(let k = 0; k < clone.recipients.length; k++) {
          if(clone.recipients[k].id == signImage.recipient_id) {
             this.datas.contract_user_sign[numberSign].sign_config[j].email = clone.recipients[k].email;
             this.datas.contract_user_sign[numberSign].sign_config[j].phone = clone.recipients[k].phone;
             if(this.datas.contract_user_sign[numberSign].sign_config[j].recipient) {
               this.datas.contract_user_sign[numberSign].sign_config[j].recipient.email = clone.recipients[k].email;
               this.datas.contract_user_sign[numberSign].sign_config[j].recipient.phone = clone?.recipients[k]?.phone;
             }
             this.datas.contract_user_sign[numberSign].sign_config[j].name = clone.recipients[k].name;
          }
        }
      }
    }
  }

  synchronized2(numberSign: number) {
    for (let i = 0; i < this.datas.is_determine_clone.length; i++) {
      const clone = this.datas.is_determine_clone[i];
  
      for (let j = 0; j < this.datas.contract_user_sign[numberSign].type.length; j++) {
        const signImage = this.datas.contract_user_sign[numberSign].type[j];
  
        signImage.sign_config.forEach((item: any) => {
          for (let k = 0; k < clone.recipients.length; k++) {
            if (clone.recipients[k].id === item.recipient_id) {
              item.email = clone.recipients[k].email;
              item.phone = clone.recipients[k].phone;
              if (item.recipient) {
                item.recipient.email = clone.recipients[k].email;
                item.recipient.phone = clone.recipients[k].phone;
              }
              item.name = clone.recipients[k].name;
            }
          }
        });
      }
    }
  }

  checkDifferent() {
    //Lấy tất cả recipientId trong clone
    const recipientIds = this.datas.is_determine_clone.flatMap((item:any) => item.recipients.map((recipient:any) => recipient.id));

    //Check mảng sign_config có id recipient trên thì giữ lại; còn lại xoá hết
    for(let i = 0; i < 4; i++) {
      if(this.datas.contract_user_sign[i].sign_unit == "chu_ky_so") {
        for(let j = 0; j < this.datas.contract_user_sign[i].type.length; j++) {      
          this.datas.contract_user_sign[i].type.forEach((element: any) => {
            element.sign_config.forEach((item: any) => {
              const sign_config = item;
              if(sign_config.recipient_id && !recipientIds.includes(sign_config.recipient_id) && sign_config.sign_unit != 'text_currency') {
                this.datas.contract_user_sign[i].sign_config.splice(j,1);
              }
            })
          })
        }
      } else {
        for(let j = 0; j < this.datas.contract_user_sign[i].sign_config.length; j++) {
          const sign_config = this.datas.contract_user_sign[i].sign_config[j];
          if(sign_config.recipient_id && !recipientIds.includes(sign_config.recipient_id) && sign_config.sign_unit != 'text_currency') {
            this.datas.contract_user_sign[i].sign_config.splice(j,1);
          }
        }
      }
    }
  }

  onResize(e?: any) {
    this.checkZoomService.onResize();
  }

  getDataSignUpdateAction() {
    let dataPosition: any[] = [];
    let dataNotPosition: any[] = [];


    this.datas.is_determine_clone.forEach((element: any) => {
      element.recipients.forEach((item: any) => {
        let data_duplicate = this.datas.is_data_object_signature.filter((p: any) => p.recipient_id == item.id)[0];
        if (item.fields && item.fields.length && item.fields.length > 0) {
          item.fields.forEach((res: any) => {
            res['id_have_data'] = res.id;
            res['is_type_party'] = element.type;
            res['role'] = res.recipient.role;
            if (res.type == 1) {
              res['sign_unit'] = 'text';
            }
            if (res.type == 2) {
              res['sign_unit'] = 'chu_ky_anh'
            }
            if (res.type == 3) {
              res['sign_unit'] = 'chu_ky_so'
            }
            if (res.type == 4) {
              res['sign_unit'] = 'so_tai_lieu'
            }
            if(res.type == 5) {
              res['sign_unit'] = 'text'
              res['text_type']='currency'
            }
            // res.name = res.recipient.name;
            res.recipient.email = data_duplicate ? data_duplicate.recipient.email : res.recipient.email;
            res.email = res.recipient.email;
            res.recipient.phone = data_duplicate ? data_duplicate.recipient.phone : res.recipient.phone;
            res.phone = res.recipient.phone;
            dataPosition.push(res);
          })
        } else {
          item['is_type_party'] = this.datas.is_determine_clone.type;
          item['role'] = item.role;
          dataNotPosition.push(item)
        }
      })
    })

    // check data object have contract number (not assign object)
    let is_obj_contract_number = this.datas.is_data_object_signature.filter((p: any) => !p.recipient_id && !p.recipient && p.type == 4 && this.datas.contract_no);

    if (is_obj_contract_number) {
      for(let i = 0; i < is_obj_contract_number.length; i++) {
        let item = _.cloneDeep(is_obj_contract_number[i]);
        item.is_type_party = is_obj_contract_number[i].type;
        item.sign_unit = 'so_tai_lieu';
        item.id_have_data = is_obj_contract_number[i].id;
        dataPosition.push(item);
      }
    }

    this.dataSignPosition = [...dataPosition, ...dataNotPosition];
    this.dataSignPosition.forEach((res: any) => {
      if (res.sign_unit == 'text') {
        res['text_attribute_name'] = res.name;
      }
    })
  }

  setDataSignContract() {
    let data_sign_config_cks = this.dataSignPosition.filter((p: any) => p.sign_unit == 'chu_ky_so');
    let data_sign_config_cka = this.dataSignPosition.filter((p: any) => p.sign_unit == 'chu_ky_anh');
    let data_sign_config_text = this.dataSignPosition.filter((p: any) => p.sign_unit == 'text');
    var data_sign_config_num_document = this.dataSignPosition.filter((p: any) => p.sign_unit == 'so_tai_lieu');

    this.datas.contract_user_sign.forEach((element: any) => {
      if (element.sign_unit == 'so_tai_lieu') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_num_document);
      } else if (element.sign_unit == 'text') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_text);
      } else if (element.sign_unit == 'chu_ky_anh') {
        Array.prototype.push.apply(element.sign_config, data_sign_config_cka);
      } if (element.sign_unit == 'chu_ky_so') {
        let targetObject1 = element.type.find((item: any) => item.sign_unit === "chu_ky_so_con_dau_va_thong_tin");
        let targetObject2 = element.type.find((item: any) => item.sign_unit === "chu_ky_so_con_dau");
        let targetObject3 = element.type.find((item: any) => item.sign_unit === "chu_ky_so_thong_tin");

        data_sign_config_cks.forEach((data: any) => {
            if (data.type_image_signature === 3) {
                data.sign_unit = 'chu_ky_so_con_dau_va_thong_tin'
                targetObject1.sign_config.push(data);
            }

            if (data.type_image_signature === 2) {
              data.height = data.height + 10;
              data.width = data.width + 10;
              data.sign_unit = 'chu_ky_so_con_dau'
              targetObject2.sign_config.push(data);
            }

            if (data.type_image_signature === 1) {
              data.sign_unit = 'chu_ky_so_thong_tin'
              targetObject3.sign_config.push(data);
            }
        });
      }

    })
  }

  defindDataContract() {
    let dataDetermine: {
      role: Boolean | number;
      id: any; sign_type: any; name: string; email: string; phone: any;
    }[] = [];
    this.datas.is_determine_clone.forEach((res: any) => {
      res.recipients.forEach((element: any) => {
        let isObj = {
          id: element.id,
          sign_type: element.sign_type,
          name: element.name,
          email: element.email,
          phone: element.phone,
          role: element.role
        }
        dataDetermine.push(isObj);
      })
    })

    // lay du lieu vi tri va toa do ky cua buoc 3 da thao tac
    let dataContractUserSign: any[] = [];
    this.datas.contract_user_sign.forEach((res: any) => {
      if(res.sign_unit == "chu_ky_so") {
        res.type.forEach((resItem: any) => {
          if (resItem.sign_config.length !== 0) {
            resItem.sign_config.forEach((element: any) => {
              dataContractUserSign.push(element)
            })
          }
        })
      } else {
        if (res.sign_config.length > 0) {
          res.sign_config.forEach((element: any) => {
            dataContractUserSign.push(element)
          })
        }
      }
    })
    // xoa fields khi chuyen sang loai ky ko support gan nhieu o ky
    dataDetermine.forEach((data: any) => {
      dataContractUserSign.forEach((element: any) => {
        if (element.recipient_id == data.id) {
          const signTypeId = data?.sign_type[0]?.id;
    
          const filteredItems = dataContractUserSign.filter((item: any) => 
            item.recipient_id == data.id && 
            item.sign_unit.includes('chu_ky_so')
          );
          const condition1 = filteredItems.filter(item => ![2, 3, 4, 6].includes(signTypeId)).length > 1;
          const condition2 = filteredItems.filter(item => signTypeId == 3).length > 15;
          element.isSupportMultiSignatureBox = !(condition1 || condition2);
        }
      });
    });
    // xoa fields khi chuyen sang loai ky ko support gan nhieu o ky
    let isContractSign: any[] = [];
    if(!this.datas.isDeleteField){
      for (const d of dataContractUserSign) {
        for (const data of dataDetermine) {
          if (((d.sign_unit == 'chu_ky_anh' && data.sign_type.some((q: any) => q.id == 1 || q.id == 5) && d.recipient_id == data.id) ||
            ((d.sign_unit == 'text' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6))) && d.recipient_id == data.id) ||
            ((d.sign_unit == 'so_tai_lieu' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6))) && d.recipient_id == data.id) ||
            (d.sign_unit.includes('chu_ky_so') && data.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6 || p.id == 7 || p.id == 8) && d.recipient_id == data.id)) &&
             this.datas.isUploadNewFile == false) {
            isContractSign.push(d); // mảng get dữ liệu không bị thay đổi
          }
        }
      }
    }


    // Get những dữ liệu bị thay đổi
    let dataDiffirent: any[] = [];

    dataDiffirent = dataContractUserSign.filter((d: any) => !dataDetermine.some((data: any) =>
      (((d.sign_unit == 'chu_ky_anh' && data.sign_type.some((q: any) => q.id == 1 || q.id == 5) && d.recipient_id == data.id) ||
      ((d.sign_unit == 'text' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6))) && d.recipient_id == data.id) ||
      ((d.sign_unit == 'so_tai_lieu' && (data.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6))) && d.recipient_id == data.id) ||
      (d.sign_unit.includes('chu_ky_so') && data.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6 || p.id == 7 || p.id == 8) && d.recipient_id == data.id))
    ))
    || dataDetermine.some((data: any) => d.sign_unit.includes('chu_ky_so') && d.isSupportMultiSignatureBox == false && d.recipient_id == data.id)
    )
    // xoa nhung du lieu doi tuong bi thay doi
    if (dataDiffirent.length > 0) {
      this.datas.contract_user_sign.forEach((res: any) => {
        if(res.sign_unit == "chu_ky_so") {
          res.type.forEach((resItem: any) => {
            if (resItem.sign_config.length > 0) {
              /*
              * begin xóa đối tượng ký đã bị thay đổi dữ liệu
              */
              resItem.sign_config.forEach((element: any, index: number) => {
                if (dataDiffirent.some((p: any) => p.id == element.id && p.recipient_id == element.recipient_id && p.id_have_data && p.id_have_data == element.id_have_data)) {
                  if (dataDetermine.some((p: any) => p.id == element.recipient_id)) {
                    this.removeDataSignChange(element.id_have_data);
                    // res.sign_config = []
                    delete resItem.sign_config[index]
                  }
                } else if (dataDiffirent.some((p: any) => p.id == element.id && p.recipient_id == element.recipient_id)) {
                  if (dataDetermine.some((p: any) => p.id == element.recipient_id)) {
                    // res.sign_config = []
                    delete resItem.sign_config[index]
                  }
                }
              })
              /*
              end
              */
              resItem.sign_config = resItem.sign_config.filter((val: any) =>
                isContractSign.some((data: any) =>
                  ((val.recipient ? val.recipient.email as any : val.email as any) === (data.recipient ? data.recipient.email as any : data.email as any) ||
                  (val.recipient ? val.recipient.phone as any : val.phone as any) === (data.recipient ? data.recipient.phone as any : data.phone as any)) &&
                  val.sign_unit == data.sign_unit &&
                  val.recipient_id == data.recipient_id
                ));
              // res.sign_config = isContractSign;
              resItem.sign_config.forEach((items: any) => {
                items.id = items.id + '1';
              })
            }
          })
        } else {
          if (res.sign_config.length > 0) {
            /*
            * begin xóa đối tượng ký đã bị thay đổi dữ liệu
            */
            res.sign_config.forEach((element: any, index: number) => {
              if (dataDiffirent.some((p: any) => p.id == element.id && p.recipient_id == element.recipient_id && p.id_have_data && p.id_have_data == element.id_have_data)) {
                if (dataDetermine.some((p: any) => p.id == element.recipient_id)) {
                  this.removeDataSignChange(element.id_have_data);
                  // res.sign_config = []
                  delete res.sign_config[index]
                }
              } else if (dataDiffirent.some((p: any) => p.id == element.id && p.recipient_id == element.recipient_id)) {
                if (dataDetermine.some((p: any) => p.id == element.recipient_id)) {
                  // res.sign_config = []
                  delete res.sign_config[index]
                }
              }
            })
            /*
            end
            */
            res.sign_config = res.sign_config.filter((val: any) =>
              isContractSign.some((data: any) =>
                ((val.recipient ? val.recipient.email as any : val.email as any) === (data.recipient ? data.recipient.email as any : data.email as any) ||
                (val.recipient ? val.recipient.phone as any : val.phone as any) === (data.recipient ? data.recipient.phone as any : data.phone as any)) &&
                val.sign_unit == data.sign_unit &&
                val.recipient_id == data.recipient_id
              ));
            // res.sign_config = isContractSign;
            res.sign_config.forEach((items: any) => {
              items.id = items.id + '1';
            })
          }
        }
      })
    } else if (isContractSign.length == 0 && this.datas.isDeleteField) {
      this.datas.contract_user_sign.forEach((res: any) => {
        if(res.sign_unit == "chu_ky_so") {
          res.type.forEach((resItem: any) => {
            if (resItem.sign_config.length > 0) {
              resItem.sign_config.forEach((item: any) => {
                if (item.id_have_data) {
                  this.removeDataSignChange(item.id_have_data).then();
                }
              })
              resItem.sign_config = [];
            }
          })
        } else {
          if (res.sign_config.length > 0) {
            res.sign_config.forEach((element: any) => {
              if (element.id_have_data) {
                this.removeDataSignChange(element.id_have_data).then();
              }
            })
            res.sign_config = [];
          }
        }
      })
      this.datas.is_data_object_signature = [];
    } else if (this.datas.pagePdfFileNew < this.datas.pagePdfFileOld && !this.datas.isDeleteField) {
      this.datas.contract_user_sign.forEach((item: any, index: number) => {
        if(item.sign_unit == "chu_ky_so") {
          item.type.forEach((resItem: any) => {
            if (resItem.sign_config.length > 0) {
              resItem.sign_config.forEach((element: any) => {
                if (element.id_have_data && element.page > this.datas.pagePdfFileNew) {
                  this.removeDataSignChange(element.id_have_data).then();
                  resItem.sign_config = resItem.sign_config.filter((item: any) => item.page <= this.datas.pagePdfFileNew)
                } else if (element.page > this.datas.pagePdfFileNew) {
                  resItem.sign_config = resItem.sign_config.filter((item: any) => item.page <= this.datas.pagePdfFileNew)
                }
              })
            }
          })
        } else {
          if (item.sign_config.length > 0) {
            item.sign_config.forEach((element: any) => {
              if (element.id_have_data && element.page > this.datas.pagePdfFileNew) {
                this.removeDataSignChange(element.id_have_data).then();
                item.sign_config = item.sign_config.filter((item: any) => item.page <= this.datas.pagePdfFileNew)
              } else if (element.page > this.datas.pagePdfFileNew) {
                item.sign_config = item.sign_config.filter((item: any) => item.page <= this.datas.pagePdfFileNew)
              }
            })
          }
        }
      })
    }


    if (this.datas.contract_no) {
      this.datas.contract_user_sign.forEach((res: any) => {
        if (res.sign_config.length > 0) {
          if (res.sign_unit == 'so_tai_lieu') {
            res.sign_config.forEach((element: any) => {
              element.name = null;
              element.email = null;
              element.phone = null;
            })
          }
        }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.step == 'sample-contract') {
      this.next('save_draft');
    }
  }

  // xoá dữ liệu bị thay đổi
  async removeDataSignChange(data: any) {
    this.spinner.show();
    await this.contractService.deleteInfoContractSignature(data).toPromise().then((res: any) => {
      this.spinner.hide();
    }, (error: HttpErrorResponse) => {
      this.spinner.hide();
      this.toastService.showErrorHTMLWithTimeout(`Đã xảy ra lỗi!`, "", "3000");
    })
  }

  getListNameSign(data_user_sign: any) {
    data_user_sign.forEach((element: any) => {
      if (element.type == 1 || element.type == 5) {
        element.recipients.forEach((item: any) => {
          if (item.role == 3 || item.role == 4 || item.role == 2) {
            item['type_unit'] = 'organization';
            item['selected'] = false;
            // item['is_disable'] = false;
            item['is_disable'] = !element?.sign_type?.some((p: any) => (p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6));
            this.list_sign_name.push(item);
          }
        })
      } else if (element.type == 2 || element.type == 3) {
        element.recipients.forEach((item: any) => {
          if (item.role == 3 || item.role == 4 || item.role == 2) {
            item['type_unit'] = 'partner'
            item['selected'] = false;
            item['is_disable'] = false;
            // item['type'] = element.type;
            item['text_type']='default'
            this.list_sign_name.push(item);
          }
        })
      }
    })
    if(this.datas.isDeleteField){
      this.list_sign_name.forEach((res: any) => {
        res.fields = [];
      })
    }
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

      // this.objSignInfo.width = event.rect.width;
      // this.objSignInfo.height = event.rect.height;

      this.signCurent.width = event.rect.width;
      this.signCurent.height = event.rect.height;
      if (this.signCurent.sign_unit == 'chu_ky_so_con_dau_va_thong_tin' || this.signCurent.sign_unit == 'chu_ky_anh'){
        this.signCurent.width <= 180 ? this.signCurent.width = 180 : this.signCurent.width = event.rect.width;
        this.signCurent.height <= 66 ? this.signCurent.height = 66 : this.signCurent.height = event.rect.height;
        this.objSignInfo.width = this.signCurent.width
        this.objSignInfo.height = this.signCurent.height
      } else if (this.signCurent.sign_unit == 'chu_ky_so_thong_tin') {
        this.signCurent.width <= 120 ? this.signCurent.width = 120 : this.signCurent.width = event.rect.width;
        this.signCurent.height <= 66 ? this.signCurent.height = 66 : this.signCurent.height = event.rect.height;
        this.objSignInfo.width = this.signCurent.width
        this.objSignInfo.height = this.signCurent.height
      } else if (this.signCurent.sign_unit == 'chu_ky_so_con_dau') {
        this.signCurent.width <= 66 ? this.signCurent.width = 66 : this.signCurent.width = event.rect.width;
        this.signCurent.height <= 66 ? this.signCurent.height = 66 : this.signCurent.height = event.rect.height;
        this.objSignInfo.width = this.signCurent.width
        this.objSignInfo.height = this.signCurent.height
      } else {
        this.objSignInfo.width = event.rect.width;
        this.objSignInfo.height = event.rect.height;
      }
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

  coordinate_x: any[] = [];
  coordinate_y: any[] = [];
  width: any[] = [];
  height: any[] = [];

  // elementSoHopDong: boolean = false;

  // Hàm showEventInfo là event khi thả (nhả click chuột) đối tượng ký vào canvas, sẽ chạy vào hàm.
  showEventInfo = (event: any) => {
    let canvasElement: HTMLElement | null;
    if (event.relatedTarget && event.relatedTarget.id) {
      canvasElement = document.getElementById(event.relatedTarget.id);

      let canvasInfo: any = canvasElement ? canvasElement.getBoundingClientRect() : '';

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
          if (element.sign_unit === 'chu_ky_so') {
            for (let i = 0; i < element.type.length; i++) {
              if (element.type[i].id == id) {
                let _obj: any = {
                  sign_unit: element.type[i].sign_unit,
                  name: element.type[i].name,
                  text_attribute_name: element.type[i].text_attribute_name,
                  required: 1,
                  font: element.type[i].font,
                  font_size: element.type[i].font_size
                };
                if (element.type[i].sign_config.length == 0) {
                  _obj['id'] = 'signer-' + index + '-index-0_' + element.type[i].id; // Add id for the signature in the contract
                } else {
                  _obj['id'] = 'signer-' + index + '-index-' + (element.type[i].sign_config.length) + '_' + element.type[i].id;
                }
                element.type[i]['sign_config'].push(_obj);
              }
            }
          }

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
        // lay doi tuong vua duoc keo moi vao hop dong
        this.signCurent = this.convertToSignConfig().filter((p: any) => !p.position && !p.coordinate_x && !p.coordinate_y)[0];
      } else {
        // doi tuong da duoc keo tha vao hop dong
        this.signCurent = this.convertToSignConfig().filter((p: any) => p.id == id)[0];
      }

      if (this.signCurent) {
        if (!this.objDrag[this.signCurent['id']]) {
          this.objDrag[this.signCurent['id']] = {};
        }
        this.isMove = false;

        let layerX = this.detectCoordinateService.detectX(event, rect_location, canvasInfo, this.canvasWidth, this.pageNumber)
        let layerY = this.detectCoordinateService.detectY(event, rect_location, canvasInfo);
        // //END

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

        // lay lai danh sach signer sau khi keo vao hop dong
        this.datas.contract_user_sign.forEach((res: any) => {
          if(res.sign_unit == 'chu_ky_so') {
            for (let i = 0; i < res.type.length; i++) {
              if (res.type[i].sign_config.length > 0) {
                let arrSignConfigItem = res.type[i].sign_config;
                arrSignConfigItem.forEach((element: any) => {
                  if (element.id == this.signCurent['id']) {
                    let _arrPage = event.relatedTarget.id.split("-");
                    // gán hình thức kéo thả => disable element trong list sign
                    name_accept_signature = res.type[i].sign_unit;
                    // hiển thị ô nhập tên trường khi kéo thả đối tượng Text
                    if (res.type[i].sign_unit == 'text') {
                      this.isEnableText = true;
                      setTimeout(() => {
                        //@ts-ignore
                        document.getElementById('text-input-element').focus();
                      }, 10)
                    } else this.isEnableText = false;

                    if (res.type[i].sign_unit == 'so_tai_lieu') {
                      // let flag = false;

                      if (this.soHopDong && this.soHopDong.role == 4) {
                        element.name = this.soHopDong.name;

                        element.signature_party = this.soHopDong.type_unit;
                        element.recipient_id = this.soHopDong.id;
                        element.status = this.soHopDong.status;
                        element.type = this.soHopDong.type;
                        element.email = this.soHopDong.email;
                        element.phone = this.soHopDong.phone;
                      } else if (res.type[i].sign_config.length > 0) {
                        this.soHopDong = {

                        };

                        for (let i = 0; i < res.type[i].sign_config.length; i++) {
                          let element1 = res.type[i].sign_config[i];

                          if (element1.name) {
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

                        if (this.soHopDong && this.soHopDong.name) {
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

                    // element['number'] = _arrPage[_arrPage.length - 1];
                    element['page'] = _arrPage[_arrPage.length - 1];
                    element['position'] = this.signCurent['position'];
                    element['coordinate_x'] = this.signCurent['coordinate_x'];
                    element['coordinate_y'] = this.signCurent['coordinate_y'];
                    element['dif_x'] = this.signCurent['dif_x'];
                    if (!this.objDrag[this.signCurent['id']].count) {
                      // element['width'] = this.datas.configs.e_document.format_signature_image.signature_width;
                      if (res.type[i].sign_unit == 'text' || res.type[i].sign_unit == 'so_tai_lieu') {
                        if (res.type[i].sign_unit == 'so_tai_lieu' && this.datas.contract_no) {
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
                          if(res.type[i].sign_unit == "chu_ky_so_con_dau") {
                            element['width'] = '66';
                            element['height'] = '66';
                          } else if (res.type[i].sign_unit == "chu_ky_so_thong_tin") {
                            element['width'] = '120';
                            element['height'] = '66';
                          } else {
                            element['width'] = '180';
                            element['height'] = '66';
                          }
                        }
                      }

                      this.objSignInfo.width = element['height'];
                      this.objSignInfo.height = element['width'];
                      this.objSignInfo.text_attribute_name = '';
                      this.list_sign_name.forEach((item: any) => {
                        item['selected'] = false;
                      })
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
            }
          } else {
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
                    // let flag = false;

                    if (this.soHopDong && this.soHopDong.role == 4) {
                      element.name = this.soHopDong.name;

                      element.signature_party = this.soHopDong.type_unit;
                      element.recipient_id = this.soHopDong.id;
                      element.status = this.soHopDong.status;
                      element.type = this.soHopDong.type;
                      element.email = this.soHopDong.email;
                      element.phone = this.soHopDong.phone;
                    } else if (res.sign_config.length > 0) {
                      this.soHopDong = {

                      };

                      for (let i = 0; i < res.sign_config.length; i++) {
                        let element1 = res.sign_config[i];

                        if (element1.name) {
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

                      if (this.soHopDong && this.soHopDong.name) {
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

                    this.objSignInfo.width = element['height'];
                    this.objSignInfo.height = element['width'];
                    this.objSignInfo.text_attribute_name = '';
                    this.list_sign_name.forEach((item: any) => {
                      item['selected'] = false;
                    })
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
  countDuplicate: any = 0;
  getCheckSignature(isSignType: any, listSelect?: string) {
    let assignSign = this.convertToSignConfig();
    if(isSignType == 'chu_ky_so_con_dau_va_thong_tin' || isSignType == 'chu_ky_so_con_dau' || isSignType == 'chu_ky_so_thong_tin') {
      isSignType = 'chu_ky_so'
    }
    let arrSign : any = [];
    this.list_sign_name.forEach((element: any) => {
      if (this.convertToSignConfig().some((p: any) => (
        (element.login_by == 'phone' ? (p.recipient ? p.recipient.phone : p.phone) == element.phone :
        ((p.recipient ? p.recipient.email : p.email) == element.email)) && (p.sign_unit == isSignType || p.sign_unit.includes('chu_ky_so'))) ||
        (isSignType == 'so_tai_lieu' && (p.recipient ? p?.recipient?.email : p.email ? p?.recipient?.phone : p.phone) && p.sign_unit == 'so_tai_lieu'))) {
        if (isSignType != 'text') {
          if (isSignType == 'so_tai_lieu') {
            // element.is_disable = (element.role != 4 || (this.datas.contract_no && element.role == 4));
            if (this.datas.contract_no) {
              element.is_disable = true;
            } else {
              // element.is_disable = !(element.sign_type.some((p: any) => [2,4,6].includes(p.id)) || element.role == 4)
              element.is_disable = !element.sign_type.some(((p: any) => p.id == 2 || p.id == 4 || p.id == 6) || element.role == 4)
            }
          }else if (isSignType.includes('chu_ky_so')) {
            if(element.sign_type[0]?.id == 3) {
              let count = assignSign.filter((sign: any) => sign.recipient_id === element.id).length;
              if(count >= 15) {
                element.is_disable = true;
              } else {
                element.is_disable = false;
              }
            } else {
              element.is_disable = !element.sign_type.some(((p: any) => p.id == 2 || p.id == 4 || p.id == 6) || element.role != 4) || element.sign_type.some((p:any) => element.role == 4 && ![2,4,6].includes(p.id))
            }
            //element.is_disable = !element.sign_type.some(p: any) => (p.id == 2 || p.id == 4 || p.id == 6)
            // if(element.sign_type.some((p:any) => [2,4,6].includes(p.id))){
            //   element.is_disable = !element.sign_type.some((p: any) => (p.id == 2 || p.id == 4 || p.id == 6))
            // }
            
          } else if (isSignType == 'chu_ky_anh') {
            element.is_disable = !(element.sign_type.some((p: any) => p.id == 1 || p.id == 5) && element.role != 2);
          } else {
            element.is_disable = true
          }
        } else if (isSignType == 'text') {
          element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6 ) || (element.role == 4 && element.sign_type.some((p: any) => p.id != 8 && p.id != 3 && p.id != 7))); // ô text chỉ có ký usb token/hsm mới được chỉ định hoặc là văn thư
        }
      } else {
        if (isSignType == 'chu_ky_anh') {
          element.is_disable = !(element.sign_type.some((p: any) => p.id == 1 || p.id == 5) && element.role != 2);
        } else if (isSignType.includes('chu_ky_so')) {
          if(element.sign_type[0]?.id == 3) {
            let count = assignSign.filter((sign: any) => sign.recipient_id === element.id).length;
            if(count >= 15) {
              element.is_disable = true;
            } else {
              element.is_disable = false;
            }
          } else {
            element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6 || p.id == 7 || p.id == 8) && element.role != 2);
          }
        } else if (isSignType == 'text') {
          element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6 ) || (element.role == 4 && element.sign_type.some((p: any) => p.id != 8 && p.id != 3 && p.id != 7))); // ô text chỉ có ký usb token/hsm mới được chỉ định hoặc là văn thư

          // element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4)); // disable van thu chon. nguoi nhap.
        } else {
          if (this.datas.contract_no) {
            element.is_disable = true;
          } else {
            element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4 || p.id == 6) || (element.role == 4 && element.sign_type.some((p: any) => p.id != 8 && p.id != 3 && p.id != 7)))
            // element.is_disable = !(element.sign_type.some((p: any) => p.id == 2 || p.id == 4))
          }
        }
        // element.is_disable = (element.role != 4 || (this.datas.contract_no && element.role == 4));
      }
      // }

      if (listSelect) {
        element.selected = listSelect && element.name == listSelect;
      }
    })
  }

  getConditionFiledSign(element: any, isSignType: string) {
    if ((element.fields && element.fields.length && element.fields.length > 0) &&
      (element.sign_type.some((id: number) => [1, 5].includes(id)) && isSignType == 'chu_ky_anh') || (element.sign_type.some((id: number) => [2, 3, 4].includes(id)) && isSignType == 'chu_ky_so') || (isSignType == 'text' && (element.sign_type.some((id: number) => id == 2) || element.role == 4) || (isSignType == 'so_tai_lieu' && (element.role != 4 || (this.datas.contract_no && element.role == 4))))) {
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
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    // // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

  }

  setWidth(d: any) {
    return {
      'width.px': (this.widthDrag)
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

        for (let i = 0; i <= this.pageNumber; i++) {
          this.top[i] = 0;

          if (i < this.pageNumber)
            this.sum[i] = 0;
        }

        for (let i = 1; i <= this.pageNumber; i++) {
          let canvas: any = document.getElementById('canvas-step3-' + i);
          this.top[i] = canvas.height;
        }

        for (let i = 0; i < this.pageNumber; i++) {
          this.top[i + 1] += this.top[i];
          this.sum[i] = this.top[i + 1];
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

        if(this.router.url.includes('edit') && !this.datas.isFirstLoadDrag) this.setX();
        this.datas.arrDifPage = this.arrDifPage;
        this.datas.difX = Math.max(...canvasWidth) - Math.min(...canvasWidth);
      }, 100)
    })
  }

  eventMouseover() {
    if (!this.datas.isView) {
      this.objDrag = {};
      let count_total = 0;
      this.datas.contract_user_sign.forEach((element: any) => {
        if(element.sign_unit == "chu_ky_so") {
          let type = element.type;
          for (let i = 0; i < type.length; i++) {
            type[i].sign_config.forEach((item: any) => {
              if (item['position']) {
                this.objDrag[item.id] = {
                  count: 2
                }
                count_total++;
              }
            }) 
          }
        } else {
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

    return 'resize-drag';
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
      }, 1000)

      setTimeout(() => {
        clearInterval(interval)
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
    (d.sign_unit != 'chu_ky_anh' && d.sign_unit != 'chu_ky_so' && d.sign_unit != 'chu_ky_so_con_dau_va_thong_tin' && d.sign_unit != 'chu_ky_so_con_dau' && d.sign_unit != 'chu_ky_so_thong_tin') ?
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
      "min-width": d.sign_unit == 'chu_ky_so_thong_tin' ? "120px" : "66px",
      "min-height": "66px"
    }
    if (d['width']) {
      style.width = parseInt(d['width']) + "px";
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + "px";
    }
    if (this.datas.contract_no && d.sign_unit == 'so_tai_lieu') {
      style.padding = '6px';
    }
    return style
  }

  changePositionSignature(d?: any, e?: any, sizeChange?: any) {
      // new-signature-box-style-v2
      let style: any = {
        "transform": 'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
        "position": "absolute",
        "backgroundColor": '#FFFFFF',
        "border": "1px dashed #6B6B6B",
        "border-radius": "6px",
        "min-width": "180px",
        "min-height": "66px"
      }
      if (d['width']) {
        style.width = parseInt(d['width']) + "px";
      }
      if (d['height']) {
        style.height = parseInt(d['height']) + "px";
      }
      if (this.datas.contract_no && d.sign_unit == 'so_tai_lieu') {
        style.padding = '6px';
      }
      return style
  }

  getAddSignUnit() {
    this.datas.is_data_object_signature.forEach((element: any) => {
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
      // this.objSignInfo.width = set_id.width;
      // this.objSignInfo.height = set_id.width;
      signElement = document.getElementById(this.objSignInfo.id);
    } else
      signElement = document.getElementById(this.objSignInfo.id);
    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];

      if (isObjSign) {
        this.isEnableSelect = false;
        this.objSignInfo.traf_x = d.coordinate_x;
        this.objSignInfo.traf_y = d.coordinate_y;

        this.objSignInfo.width = parseInt(d.height);
        this.objSignInfo.height = parseInt(d.width);

        if (isObjSign.font) {
          this.objSignInfo.font = isObjSign.font;
        } else {
          this.objSignInfo.font = 'Times New Roman';
        }

        if (isObjSign.font_size) {
          this.objSignInfo.font_size = isObjSign.font_size;
        } else {
          this.objSignInfo.font_size = 13;
        }

        this.isEnableText = d.sign_unit == 'text';
        this.isChangeText = d.sign_unit == 'so_tai_lieu';
        if (this.isEnableText) {
          this.objSignInfo.text_attribute_name = d.text_attribute_name;
        }

        if (this.router.url.includes("edit")) {
          if (d.recipient)
            this.getCheckSignature(d.sign_unit, d.recipient.name);
          else
            this.getCheckSignature(d.sign_unit, d.name);
        } else {
          this.getCheckSignature(d.sign_unit, d.name);
        }

        if (!d.name) {
          //@ts-ignore
          document.getElementById('select-dropdown').value = "";
        } else {
          if (d.recipient_id) {
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

  // Hàm remove đối tượng đã được kéo thả vào trong file tài liệu canvas
  async onCancel(e: any, data: any) {
    let dataHaveId = true;
    this.isChangeText = false;
    this.soHopDong = {
    };
    
    // const objIndex = this.list_sign_name.findIndex((obj: any) => obj.id == data.recipient_id);
    // if (objIndex != -1 ) {
    //   this.list_sign_name[objIndex].is_disable = false;
    // }

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
      this.datas.contract_user_sign.forEach((element: any, user_sign_index: any) => {
        if(element.sign_unit === 'chu_ky_so') {
          for (let i = 0; i < element.type.length; i++) {
            if (element.type[i].sign_config.length > 0) {
              element.type[i].sign_config = element.type[i].sign_config.filter((item: any) => item.id != data.id)
              element.type[i].sign_config.forEach((itemSign: any, sign_config_index: any) => {
                itemSign['id'] = 'signer-' + user_sign_index + '-index-' + sign_config_index + '_' + element.type[i].id;
              })
            }
          }
        } else {
          if (element.sign_config.length > 0) {
            element.sign_config = element.sign_config.filter((item: any) => item.id != data.id)
            element.sign_config.forEach((itemSign: any, sign_config_index: any) => {
              itemSign['id'] = 'signer-' + user_sign_index + '-index-' + sign_config_index + '_' + element.id;
            })
          }
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
      if (this.datas.is_action_contract_created) {
        if ((element.recipient && ![2, 3].includes(element.recipient.status)) || (!element.recipient && ![2, 3].includes(element.status))) {
          arrSignConfig = arrSignConfig.concat(element.sign_config);
        }
      } else arrSignConfig = arrSignConfig.concat(element.sign_config);

      if ((element.sign_unit === 'chu_ky_so') && element.type) {
        element.type.forEach((subConfig: { sign_config: any; }) => {
            arrSignConfig = arrSignConfig.concat(subConfig.sign_config);
        });
      }
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
    if(this.datas.isDeleteField){
      this.datas.isDeleteField = false;
    }
  }

  // edit location doi tuong ky

  soHopDong: any;
  changePositionSign(e: any, locationChange: any, property: any) {
    // if(property != 'text') {
    //   const objIndex = this.list_sign_name.findIndex((obj: any) => obj.id == e.target.value);
    //   this.list_sign_name[objIndex].is_disable = true;
    // }

    let signElement = document.getElementById(this.objSignInfo.id);

    if (signElement) {
      let isObjSign = this.convertToSignConfig().filter((p: any) => p.id == this.objSignInfo.id)[0];

      if (isObjSign) {

        if (property == 'location') {
          if (locationChange == 'x') {
            isObjSign.coordinate_x = parseInt(e);
            signElement.setAttribute("data-x", isObjSign.coordinate_x);
          } else {

            //set lại page
            // let page = 0;
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

            // isObjSign.type = data_name.type ? data_name.type : (data_name.fields ? data_name?.fields[0]?.type : '');
            // signElement.setAttribute("type", isObjSign.type);

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

          if ((data_name.role == 4 || (idTypeSign == 2 || idTypeSign == 4 || idTypeSign == 6)) && this.isChangeText) {
            //

            this.soHopDong = data_name;

            //Gán lại tất cả số tài liệu cho một người ký
            this.datas.contract_user_sign.forEach((res: any) => {
              if (res.sign_config.length > 0) {
                let arrSignConfigItem: any = "";

                if (res.sign_unit == 'so_tai_lieu' || this.datas.contract_no) {
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
    } else {
      return Math.round(this.objSignInfo.traf_x) - 1;
    }
  }

  getTrafY() {
    return Math.round(this.objSignInfo.traf_y)
  }


  back(e: any, step?: any) {
    this.isDropdownVisibleChuKySo = false;
    this.nextOrPreviousStep(step);
  }

  async next(action: string) {
    this.isDropdownVisibleChuKySo = false;
    if (action == 'next_step' && !this.validData()) {
      if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {

        this.save_draft_infor.close_header = false;
        this.save_draft_infor.close_modal.close();
      }

      return;
    } else {
      if (action == 'save_draft') {
        if (this.datas.is_action_contract_created && this.router.url.includes("edit")) {
          let isHaveFieldId: any[] = [];
          let isNotFieldId: any[] = [];
          //
          let isUserSign_clone = _.cloneDeep(this.datas.contract_user_sign)
          isUserSign_clone.forEach((res: any) => {
            if(res.sign_unit == "chu_ky_so") {
              res.type.forEach((element: any) => {
                element.sign_config.forEach((item: any) => {
                  if(item.sign_unit == "chu_ky_so_con_dau") {
                    item.width = item.width - 10;
                    item.height = item.height - 10;
                  }
                  if (item.id_have_data) {
                    item.type = 3
                    isHaveFieldId.push(item)
                  } else isNotFieldId.push(item);
                  if (item.name && item.text_attribute_name) {
                    item.name = item.text_attribute_name
                  }
                })
              })
            } else {
              res.sign_config.forEach((element: any) => {
                if (element.id_have_data) {
                  isHaveFieldId.push(element)
                } else isNotFieldId.push(element);
                if (element.name && element.text_attribute_name) {
                  element.name = element.text_attribute_name
                }
              })
            }
          })
          this.getDefindDataSignEdit(isHaveFieldId, isNotFieldId, action);
        } else {
          this.data_sample_contract = [];
          let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', "value", "text_type"];
          let isContractUserSign_clone = _.cloneDeep(this.datas.contract_user_sign)
          isContractUserSign_clone.forEach((element: any) => {
            if(element.sign_unit == "chu_ky_so") {
              element.type.forEach((res: any) => {
                res.sign_config.forEach((item: any) => {
                  item['font'] = item.font ? item.font : 'Times New Roman';
                  item['font_size'] =  item.size ? item.size : 13;
                  item['contract_id'] = this.datas.contract_id;
                  item['document_id'] = this.datas.document_id;
                  if (item.text_attribute_name) {
                    item.name = item.text_attribute_name;
                  }

                  if (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin') {
                    item['type'] = 3;
                    item['type_image_signature'] = 3;
                  } else if (item.sign_unit == 'chu_ky_so_con_dau') {
                    item.width = item.width - 10;
                    item.height = item.height - 10;              
                    item['type'] = 3;
                    item['type_image_signature'] = 2;
                  } else if (item.sign_unit == 'chu_ky_so_thong_tin') {
                    item['type'] = 3;
                    item['type_image_signature'] = 1;
                  }

                  data_remove_arr_request.forEach((item_remove: any) => {
                    delete item[item_remove];
                  });
                })

                Array.prototype.push.apply(
                  this.data_sample_contract,
                  res.sign_config
                );
              })
            }

            if (element.sign_config.length > 0) {
              element.sign_config.forEach((item: any) => {
                item['font'] = this.datas.font;
                item['font_size'] = this.datas.size;
                item['contract_id'] = this.datas.contract_id;
                item['document_id'] = this.datas.document_id;
                if (item.text_attribute_name) {
                  item.name = item.text_attribute_name;
                }
                if (item.sign_unit == 'chu_ky_anh') {
                  item['type'] = 2;
                } else if (item.sign_unit == 'chu_ky_so') {
                  item['type'] = 3;
                } else if (item.sign_unit == 'so_tai_lieu') {
                  item['type'] = 4;
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

          this.data_sample_contract.forEach((element: any) => {
            if(this.datas.arrDifPage[Number(element.page)-1] == 'max'){
              element.coordinate_x = element.coordinate_x - this.datas.difX;
            }
          })
          this.contractService.getContractSample(this.data_sample_contract).subscribe((data) => {
            if(this.validData('release-check') == true){
              this.contractService.getDataPreRelease(this.datas.contract_id).subscribe((contract: any) => {
                this.contractService.addContractRelease(contract).subscribe((res: any) => {
                });
              });
              this.router.navigate(['/main/contract/create/draft']);
              this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
            } else {
            this.router.navigate(['/main/contract/create/draft']);
            this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);}
          },
            (error: HttpErrorResponse) => {
              this.spinner.hide();
              return false;
            }, () => {
              this.spinner.hide();
            }
          );
          if (this.save_draft_infor && this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
            this.save_draft_infor.close_header = false;
            this.save_draft_infor.close_modal.close();
          }
        }
      } else if (action == 'next_step') {
        this.checkNumber(this.datas.ceca_push, this.convertToSignConfig().length)
      }
    }
  }

  async getDefindDataSignEdit(dataSignId: any, dataSignNotId: any, action: any) {
    let dataSample_contract: any[] = [];

    if (dataSignId.length > 0) {
      let data_remove_arr_signId = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit','text_type'];
      dataSignId.forEach((res: any) => {
        data_remove_arr_signId.forEach((itemRemove: any) => {
          delete res[itemRemove];
        })
      })

      let countIsSignId = 0;
      this.spinner.show();

      dataSignId.forEach((element: any) => {
        if(this.datas.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datas.difX;
        }
      })
      for (let i = 0; i < dataSignId.length; i++) {
        let id = dataSignId[i].id_have_data;
        delete dataSignId[i].id_have_data;
        await this.contractService.getContractSampleEdit(dataSignId[i], id).toPromise().then((data: any) => {
          dataSample_contract.push(data);
          if(this.validData('release-check') == true){
            this.contractService.getDataPreRelease(this.datas.contract_id).subscribe((contract: any) => {
              this.contractService.addContractRelease(contract).subscribe((res: any) => {
              });
            });
          }
        }, (error: HttpErrorResponse) => {
          this.toastService.showErrorHTMLWithTimeout("Vui lòng liên hệ đội hỗ trợ để được xử lý", "", 3000);
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
      let data_remove_arr_request = ['id', 'sign_unit', 'position', 'left', 'top', 'text_attribute_name', 'sign_type', 'signature_party', 'is_type_party', 'role', 'recipient', 'email', 'is_disable', 'selected', 'type_unit', 'value', 'text_type'];
      dataSignNotId.forEach((item: any) => {
        item['font'] = this.datas.font;
        item['font_size'] = this.datas.size;
        item['contract_id'] = this.datas.contract_id;
        item['document_id'] = this.datas.document_id;
        if (item.text_attribute_name) {
          item.name = item.text_attribute_name;
        }
        if (item.sign_unit == 'chu_ky_anh') {
          item['type'] = 2;
        } else if (item.sign_unit == 'so_tai_lieu') {
          item['type'] = 4;
        } else if(item.sign_unit == 'text'){
          if(item.text_type == 'currency'){
            item['type'] = 5; } else {
            item['type'] = 1;}
        } else if (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin') {
          item['type'] = 3;
          item['type_image_signature'] = 3;
        } else if (item.sign_unit == 'chu_ky_so_con_dau') {
          item['type'] = 3;
          item['type_image_signature'] = 2;
        } else if (item.sign_unit == 'chu_ky_so_thong_tin') {
          item['type'] = 3;
          item['type_image_signature'] = 1;
        }

        data_remove_arr_request.forEach((item_remove: any) => {
          delete item[item_remove]
        })
      })

      dataSignNotId.forEach((element: any) => {
        if(this.datas.arrDifPage[Number(element.page)-1] == 'max'){
          element.coordinate_x = element.coordinate_x - this.datas.difX;
        }
      })
      await this.contractService.getContractSample(dataSignNotId).toPromise().then((data) => {
        this.spinner.hide();
      }, error => {
        isErrorNotId = true;
        this.spinner.hide();
        this.toastService.showErrorHTMLWithTimeout("Vui lòng liên hệ đội hỗ trợ để được xử lý", "", 3000);
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
      if (action == 'save_draft') {
        this.datas.save_draft.sample_contract = false;
        this.stepChangeSampleContract.emit('save_draft_sample_contract')
        if (this.datas['close_modal']) {
          this.datas.close_modal.close('Save click');
        }
        // this.getRemoveCopyRight();
        this.router.navigate(['/main/contract/create/draft']);
        this.toastService.showSuccessHTMLWithTimeout("no.push.contract.draft.success", "", 3000);
      }
    } else {
      if (this.save_draft_infor.close_header && this.save_draft_infor.close_modal) {
        this.save_draft_infor.close_header = false;
        this.save_draft_infor.close_modal.close();
      }
    }
  }

  // forward data component
  nextOrPreviousStep(step: string) {
    // this.getRemoveCopyRight();
    this.datas.stepLast = step;

    this.stepChangeSampleContract.emit(step);
  }

  async checkNumber(countCeCa: number, countTimestamp: number) {

    this.orgId = this.userService.getInforUser().organization_id;

    let getNumberContractCreateOrg;
    try {
      getNumberContractCreateOrg = await this.contractService.getDataNotifyOriganzation().toPromise();
    } catch (err) {
      this.toastService.showErrorHTMLWithTimeout('Lỗi lấy thông tin số lượng tài liệu' + err, '', 3000);
    }

    // if (countCeCa > 0 && (Number(getNumberContractCreateOrg.numberOfCeca) - this.datas.ceca_push) < 0) {
    //   this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lần gửi xác nhận BCT. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
    //   return false;
    // } else if (countTimestamp > 0 && (Number(getNumberContractCreateOrg.numberOfTimestamp) - this.convertToSignConfig().length) < 0) {
    //   this.toastService.showErrorHTMLWithTimeout('Tổ chức đã sử dụng hết số lượng timestamp đã mua. Liên hệ với Admin để tiếp tục sử dụng dịch vụ', "", 3000);
    //   return false;
    // } else {
      this.step = variable.stepSampleContract.step4;
      this.datas.stepLast = this.step
      this.nextOrPreviousStep(this.step);
    // }
  }

  dataTextDuplicate: any = []
  onContentTextEvent() {
    let arrCheckTextContent = [];
    this.dataTextDuplicate = []
    let dataTextDuplicate = []
    dataTextDuplicate = this.datas.contract_user_sign.filter((p: any) => p.sign_unit == "text")[0];
    for (let i = 0; i < dataTextDuplicate.sign_config.length; i++) {
      if (dataTextDuplicate.sign_config[i].text_attribute_name) {
        arrCheckTextContent.push({
          value: dataTextDuplicate.sign_config[i].text_attribute_name,
          page:  dataTextDuplicate.sign_config[i].page,
        });
      }
    }
    var valueSoFar = Object.create(null);
    for (var k = 0; k < arrCheckTextContent.length; ++k) {
      var value: any = arrCheckTextContent[k].value;
      if (value in valueSoFar) {
        arrCheckTextContent.filter((item: any) => value == item.value).forEach((element: any) => {
          this.dataTextDuplicate.push(element.page.toString())
        })
        this.dataTextDuplicate = [...new Set(this.dataTextDuplicate)]
        return true;
      }
      valueSoFar[value] = true;
    }
    return false;
  }

  validData(isSaveDraft?: any) {
    let data_not_drag = this.datas.contract_user_sign.find((item: any) => {
      if (item.sign_unit === 'chu_ky_so') {
          return item.type.find((subItem: any) => subItem.sign_config.length > 0);
      }
      return item.sign_config.length > 0;
    });

    if (!data_not_drag) {
      this.spinner.hide();
      if(!isSaveDraft)
      this.toastService.showWarningHTMLWithTimeout("Vui lòng chọn ít nhất 1 đối tượng kéo thả!", "", 3000);
      return false;
    } else {
      let count = 0;
      let count_text = 0;
      let count_type_text = 0;
      let count_number = 0;
      let count_text_number = 0;
      let arrSign_organization: any[] = [];
      let arrSign_partner: any[] = [];

      let coordinate_x: number[] = [];
      let coordinate_y: number[] = [];
      let width: number[] = [];
      let height: number[] = [];
      let currentElement: any;
      let boxElements: any = [];
      for (let i = 0; i < this.datas.contract_user_sign.length; i++) {
        if (this.datas.contract_user_sign[i].sign_config.length > 0) {
          for (let j = 0; j < this.datas.contract_user_sign[i].sign_config.length; j++) {
            let element = this.datas.contract_user_sign[i].sign_config[j];
            if (!element.name && element.sign_unit != 'so_tai_lieu') { // element.sign_unit != 'so_tai_lieu'
              // if(isSaveDraft && element.sign_unit == 'text'){
              //   currentElement = element
              //   break;
              // }
              currentElement = element
              count++;
              break
            } else if (element.sign_unit == 'so_tai_lieu' && element.length > 1) {
              count_number++;
              currentElement = element
              break;
            } else if (element.sign_unit == 'so_tai_lieu' && !this.datas.contract_no && (!element.email && !element.phone)) {
              count++;
              currentElement = element
              break
            } else if (element.sign_unit == 'text' && !element.text_attribute_name && !isSaveDraft) {
              if (element.text_type == 'currency') {
                count_text++;
                currentElement = element
                break;
              } else {
                count_text++;
                currentElement = element
                break
              }
            }
            // else if (element.sign_unit == 'text' && !element.text_type  && !isSaveDraft){
            //   count_type_text++;
            //   currentElement = element
            //   break
            // }
             else {
              let data_sign = {
                name: element.name,
                signature_party: element.signature_party,
                recipient_id: element.recipient_id,
                email: element.email || (element.recipient && element.recipient.email) || "",
                phone: element.phone || (element.recipient && element.recipient.phone) || "",
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
          if (count > 0 || count_text > 0 || count_number > 0) break
        }
        if (this.datas.contract_user_sign[i].sign_unit === 'chu_ky_so') {
          let itemType = this.datas.contract_user_sign[i].type;
          for (let j = 0; j < itemType.length; j++) {
            let signConfigArray = itemType[j].sign_config;

            for (let n = 0; n < signConfigArray.length; n++) {
              let element = signConfigArray[n];
              if (!element.name && element.sign_unit != 'so_tai_lieu') { // element.sign_unit != 'so_tai_lieu'
                // if(isSaveDraft && element.sign_unit == 'text'){
                //   currentElement = element
                //   break;
                // }
                currentElement = element
                count++;
                break
              } else if (element.sign_unit == 'so_tai_lieu' && element.length > 1) {
                count_number++;
                currentElement = element
                break;
              } else if (element.sign_unit == 'so_tai_lieu' && !this.datas.contract_no && (!element.email && !element.phone)) {
                count++;
                currentElement = element
                break
              } else if (element.sign_unit == 'text' && !element.text_attribute_name && !isSaveDraft) {
                if (element.text_type == 'currency') {
                  count_text++;
                  currentElement = element
                  break;
                } else {
                  count_text++;
                  currentElement = element
                  break
                }
              }
              // else if (element.sign_unit == 'text' && !element.text_type  && !isSaveDraft){
              //   count_type_text++;
              //   currentElement = element
              //   break
              // }
              else {
                let data_sign = {
                  name: element.name,
                  signature_party: element.signature_party,
                  recipient_id: element.recipient_id,
                  email: element.email || (element.recipient && element.recipient.email) || "",
                  phone: element.phone || (element.recipient && element.recipient.phone) || "",
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

            if (count > 0 || count_text > 0 || count_number > 0) break
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
              if (boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit.includes('chu_ky')) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                if ((!boxElements[i].text_type && !boxElements[j].text_type)
                ) {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                          (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                  (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                  (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
              (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                  (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
            }
            return false;
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
              if (boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit.includes('chu_ky')) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                if ((!boxElements[i].text_type && !boxElements[j].text_type)
                ) {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                          (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                  (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                  (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
              (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                  (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
            }
            return false;
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
              if (boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit.includes('chu_ky')) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                if ((!boxElements[i].text_type && !boxElements[j].text_type)
                ) {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                          (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                  (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                  (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
              (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                  (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
            }
            return false;
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
              if (boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit.includes('chu_ky')) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô ký không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "text" ) {
                if ((!boxElements[i].text_type && !boxElements[j].text_type)
                ) {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô text không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
                } else if ((boxElements[i].text_type == "currency" && boxElements[j].text_type == "currency") ||
                          (boxElements[j].text_type == "currency" && boxElements[i].text_type == "currency"))
                {
                  this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
                }
              }
              if (boxElements[i].sign_unit == boxElements[j].sign_unit && boxElements[i].sign_unit == "so_tai_lieu") {
                this.toastService.showErrorHTMLWithTimeout("Vị trí các ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((boxElements[i].sign_unit.includes('chu_ky') && ((boxElements[j].sign_unit == "text" && !boxElements[j].text_type))) ||
                  (boxElements[j].sign_unit.includes('chu_ky') && ((boxElements[i].sign_unit == "text" && !boxElements[i].text_type) ))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô text hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].sign_unit.includes('chu_ky') && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (boxElements[j].sign_unit.includes('chu_ky') && boxElements[i].sign_unit == "so_tai_lieu"))  {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số tài liệu hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000)
              }
              if ((boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky')) ||
                  (boxElements[i].text_type == 'currency' && boxElements[j].sign_unit.includes('chu_ky'))) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô ký không được để trùng ô số hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }

              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text"))  && boxElements[j].sign_unit == "so_tai_lieu") ||
                  (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].sign_unit == "so_tai_lieu")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((((!boxElements[i].text_type && boxElements[i].sign_unit == "text")) && boxElements[j].text_type == "currency") ||
              (((!boxElements[j].text_type && boxElements[j].sign_unit == "text")) && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô text và ô số không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
              if ((boxElements[i].sign_unit == "so_tai_lieu" && boxElements[j].text_type == "currency") ||
                  (boxElements[j].sign_unit == "so_tai_lieu" && boxElements[i].text_type == "currency")) {
                this.toastService.showErrorHTMLWithTimeout("Vị trí ô số và ô số tài liệu không được để trùng hoặc giao nhau" + ` (trang ${boxElements[i].page})`,"",3000);
              }
            }
            return false;
          }
        }
      }

      if (this.onContentTextEvent()) {
        if(!isSaveDraft) this.toastService.showWarningHTMLWithTimeout(`Trùng tên trường ô text. Vui lòng kiểm tra lại! (trang ${this.dataTextDuplicate})`, "", 3000);
        return false;
      }

      if (count > 0) {
        if(!isSaveDraft)
        this.toastService.showWarningHTMLWithTimeout(`Vui lòng chọn người ký cho đối tượng đã kéo thả! (trang ${currentElement.page})`, "", 3000);
        return false;
      } else if (count_number > 1) {
        if(!isSaveDraft)
        this.toastService.showWarningHTMLWithTimeout("Tài liệu chỉ được phép có 1 số tài liệu!", "", 3000);
        return false;
      } else if (count_text > 0) {
        if(!isSaveDraft)
        this.toastService.showWarningHTMLWithTimeout(`Thiếu tên trường cho đối tượng nhập Text! (trang ${currentElement.page})`, "", 3000);
        return false;
      } else {
        let data_organization = this.list_sign_name.filter((p: any) => p.type_unit == "organization" && p.role != 2);
        let error_organization = 0;
        let nameSign_organization = {
          name: '',
          sign_type: ''
        };

        if (environment.flag == "KD") {
          // valid ký kéo thiếu ô ký cho từng loại ký
          for (const element of data_organization) {
            if (element.sign_type.length > 0) {
              if (element.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6 || p.id == 7 || p.id == 8) && arrSign_organization.filter((item: any) => ((item.email && item.email == element.email) || (item.phone && item.phone == element.phone)) &&
              (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin' || item.sign_unit == 'chu_ky_so_con_dau' || item.sign_unit == 'chu_ky_so_thong_tin')).length == 0) {
                error_organization++;
                nameSign_organization.name = element.name;
                nameSign_organization.sign_type = 'chu_ky_so';
                break
              }
            }
          }
          if (error_organization > 0) {
            this.spinner.hide();
            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout((this.translate.instant('miss.digital.sig')) + " " + `${nameSign_organization.name}` + " " + (this.translate.instant('off.org.please')), "", 3000);
            return false;
          }
          // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.off.org.please
          if (arrSign_organization.length < data_organization.length) {
            this.spinner.hide();
            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout("Thiếu đối tượng ký của tổ chức, vui lòng chọn đủ người ký!", "", 3000);
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
              if (element.sign_type.some((p: any) => p.id == 2 || p.id == 3 || p.id == 4 || p.id == 6 || p.id == 7 || p.id == 8) && arrSign_partner.filter((item: any) => ((item.email && item.email == element.email) || (item.phone && item.phone == element.phone)) 
                && (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin' || item.sign_unit == 'chu_ky_so_con_dau' || item.sign_unit == 'chu_ky_so_thong_tin')).length == 0) {
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
            this.toastService.showWarningHTMLWithTimeout(`Thiếu đối tượng ${nameSign_partner.sign_type == 'chu_ky_so' ? 'ký số' : 'ký ảnh hoặc eKYC'} của đối tác ${nameSign_partner.name}, vui lòng chọn đủ người ký!`, "", 3000);
            return false;
          }

          // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
          if (arrSign_partner.length < data_partner.length) {
            // alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!');
            this.spinner.hide();

            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout("Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!", "", 3000);
            return false;
          }
        } else {
          // valid ký kéo thiếu ô ký cho từng loại ký
          for (const element of data_organization) {
            if (element.sign_type.length > 0) {
              if (element.sign_type.some((p: any) => [3,7,8].includes(p.id) || ([2,4,6].includes(p.id) && element.role !==4)) &&
              arrSign_organization.filter((item: any) => ((item.email && item.email == element.email) || (item.phone && item.phone == element.phone))
              && (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin' || item.sign_unit == 'chu_ky_so_con_dau' || item.sign_unit == 'chu_ky_so_thong_tin')).length == 0) {
                error_organization++;
                nameSign_organization.name = element.name;
                nameSign_organization.sign_type = 'chu_ky_so';
                break
              }
            }
          }
          if (error_organization > 0) {
            this.spinner.hide();
            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout((this.translate.instant('miss.digital.sig')) + " " + `${nameSign_organization.name}` + " " + (this.translate.instant('off.org.please')), "", 3000);
            return false;
          }
          // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.off.org.please
          if (arrSign_organization.length < data_organization.length || !this.validateVanThuData(arrSign_organization, data_organization)) {
            this.spinner.hide();
            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout("Thiếu đối tượng ký của tổ chức, vui lòng chọn đủ người ký!", "", 3000);
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
              if (element.sign_type.some((p: any) => [3,7,8].includes(p.id) || ([2,4,6].includes(p.id) && element.role !==4)) && arrSign_partner.filter((item: any) => ((element.email && item.email == element.email) || (element.phone && item.phone == element.phone)) &&
              (item.sign_unit == 'chu_ky_so_con_dau_va_thong_tin' || item.sign_unit == 'chu_ky_so_con_dau' || item.sign_unit == 'chu_ky_so_thong_tin')).length == 0) {
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
            this.toastService.showWarningHTMLWithTimeout(`Thiếu đối tượng ${nameSign_partner.sign_type == 'chu_ky_so' ? 'ký số' : 'ký ảnh hoặc eKYC'} của đối tác ${nameSign_partner.name}, vui lòng chọn đủ người ký!`, "", 3000);
            return false;
          }


          // valid khi kéo kiểu ký vào ít hơn list danh sách đối tượng ký.
          if (arrSign_partner.length < data_partner.length || !this.validateVanThuData(arrSign_partner, data_partner)) {
            // alert('Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!');
            this.spinner.hide();

            if(!isSaveDraft)
            this.toastService.showWarningHTMLWithTimeout("Thiếu đối tượng ký của đối tác, vui lòng chọn đủ người ký!", "", 3000);
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
    let canvas: any = document.getElementById('canvas-step3-' + this.pageNumber);

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
      let canvas: any = document.getElementById('canvas-step3-' + num);

      let canvas1: any = document.getElementById('pdf-viewer-step-3');

      let pdffull: any = document.getElementById('pdf-full');

      pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top)
    }
  }

  onEnter(event: any) {
    let canvas: any = document.getElementById('canvas-step3-' + event.target.value);

    let canvas1: any = document.getElementById('pdf-viewer-step-3');

    let pdffull: any = document.getElementById('pdf-full');

    pdffull.scrollTo(0, canvas.getBoundingClientRect().top - canvas1.getBoundingClientRect().top);
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
    let canvasLast: any = document.getElementById('canvas-step3-' + this.pageNumber);
    let step3: any = document.getElementById('pdf-viewer-step-3');
    if (event.srcElement.scrollTop < Number(canvasLast.getBoundingClientRect().top - step3.getBoundingClientRect().top)) {
      this.pageLast = true;
    } else {
      this.pageLast = false;
    }

    let scrollTop = Number(event.srcElement.scrollTop);

    this.pageNum = Number(Math.floor(event.srcElement.scrollTop / canvas1.height) + 1);

    for (let i = 0; i < this.sum.length; i++) {
      if (this.sum[i] < scrollTop && scrollTop < this.sum[i + 1]) {
        this.pageNum = Number(i + 2);
      }
    }
  }

  swapStampPosition() {
    this.isOnTheLeft = !this.isOnTheLeft
  }
}
