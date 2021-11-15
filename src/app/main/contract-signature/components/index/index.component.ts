import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {SignContractComponent} from "../sign-contract/sign-contract.component";
import {AddContractComponent} from "../contract-coordination/add-contract/add-contract.component";
import {variable} from "../../../../config/variable";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('ContractSign') SignContractComponent: SignContractComponent;
  @ViewChild('AddContract') AddContractComponent: AddContractComponent;
  @Input() datas: any;
  // @Input() datas: any = {
  //   step: variable.stepSampleContract.step_coordination,
  //   contract: {},
  //   action_title: 'Điều phối'
  // }


  data_contract: any = {
    contract_information: {
      type_contract: "Hợp đồng thương mại",
      name_contract: "Hợp đồng eContract",
      number_contract: "123-ABC",
      file_content: environment.base64_file_content_demo,
      file_attach: [
        {file_name: 'hopdong.docx', file_content: 'url_download', id: 1},
        {file_name: 'hopdong_1.pdf', file_content: 'url_download', id: 2},
      ],
      file_related_contract: [
        {file_name: 'hopdong_danhan_1.pdf', file_content: 'base64', id: 123},
        {file_name: 'hopdong_danhan_2.pdf', file_content: 'base64', id: 456}
      ]
    },
    contract_related: [
      {
        name_company: 'CÔNG TY PHẦN MỀM CÔNG NGHỆ CAO',
        name_signature: [
          {name: "Nguyễn Văn A", id: 111, statusApprove: 'Đã xem xét', responseTime: '08:20 14/11/2021'},
          {name: "Phạm Văn L", id: 112, statusApprove: 'Đã ký', responseTime: '08:25 12/11/2021'},
          {name: "Đỗ Thành Dương", id: 113, statusApprove: 'Đã ký', responseTime: '08:25 12/11/2021'}
        ]
      },
      {
        name_company: 'CÔNG TY CÔNG NGHỆ THÔNG TIN',
        name_signature: [
          {name: "Thành Dương", id: 114, statusApprove: 'Chưa ký', responseTime: '10:20 14/11/2021'},
          {name: "Nguyễn Văn C", id: 115, statusApprove: 'Đang ký', responseTime: '17:05 14/11/2021'},
          {name: "Nguyễn Văn Thư", id: 116, statusApprove: 'Đã xem', responseTime: '17:05 14/11/2021'}
        ]
      }
    ],
    "stepLast": "confirm-contract",
    "file_name": "quan_ly_hd-converted.pdf",
    "contractFile": {},
    "contractName": "eContract hop dong",
    "contractNumber": "",
    "contractType": "",
    "contractConnect": "",
    "dateDeadline": "2021-11-15T13:43:28.476Z",
    "comment": "",
    "file_content": "",
    "userForm": {
      "order": 1,
      "name": "CÔNG TY PHẦN MỀM CÔNG NGHỆ CAO",
      "userViews": [
        {
          "order": 1,
          "name": "Nguyễn Văn A",
          "email": "nguyenvana@gmail.com"
        }
      ],
      "userSigns": [
        {
          "order": 1,
          "name": "Phạm Văn L",
          "email": "phamvanl@gmail.com",
          "signType": [
            {
              "item_id": 1,
              "item_text": "Ký ảnh"
            }
          ],
          "isOtp": true,
          "phone": "0966458258",
          "id": "kiK5kw5wA6",
          "selected": false,
          "sign_unit": "organization",
          "is_disable": true
        },
        {
          "order": 1,
          "name": "Đỗ Thành Dương",
          "email": "dothanhduonglbt.0710@gmail.com",
          "signType": [
            {
              "item_id": 2,
              "item_text": "Ký số bằng USB token"
            },
            {
              "item_id": 3,
              "item_text": "Ký số bằng sim KPI"
            }
          ],
          "isOtp": true,
          "phone": "0979889156",
          "id": "2M5c50ooXx",
          "selected": false,
          "sign_unit": "organization",
          "is_disable": false
        }
      ],
      "userDocs": [
        {
          "order": 1,
          "name": "Phạm Thị H",
          "email": "phamthih@gmail.com",
          "signType": [
            {
              "item_id": 1,
              "item_text": "Ký ảnh"
            }
          ]
        }
      ]
    },
    "partnerForm": {
      "partnerArrs": [
        {
          "order": 1,
          "type": 1,
          "name": "CÔNG TY CÔNG NGHỆ THÔNG TIN",
          "partnerLeads": [
            {
              "order": 1,
              "name": "Thành Dương",
              "email": "thanhduongdtd@gmail.com"
            }
          ],
          "partnerViews": [
            {
              "order": 1,
              "name": "Phạm Thị A",
              "email": "aphamthi@gmail.com"
            }
          ],
          "partnerSigns": [
            {
              "order": 1,
              "name": "Nguyễn Văn C",
              "email": "nguyenvanc@gmail.com",
              "signType": [
                {
                  "item_id": 2,
                  "item_text": "Ký số bằng USB token"
                },
                {
                  "item_id": 3,
                  "item_text": "Ký số bằng sim KPI"
                }
              ],
              "isOtp": true,
              "phone": "0987195158",
              "id": "yF7UyVazOc",
              "selected": true,
              "sign_unit": "partner",
              "is_disable": false
            }
          ],
          "partnerDocs": [
            {
              "order": 1,
              "name": "Nguyễn Văn Thư",
              "email": "nguyenvanthu@gmail.com",
              "signType": [
                {
                  "item_id": 1,
                  "item_text": "Ký ảnh"
                }
              ]
            }
          ],
          "partnerUsers": []
        }
      ]
    },
    "contract_user_sign": [
      {
        "id": "ra9rYTu5BC",
        "sign_unit": "so_tai_lieu",
        "sign_config": [],
        "name": ""
      },
      {
        "id": "MrCFYdO05h",
        "sign_unit": "text",
        "sign_config": [
          {
            "sign_unit": "text",
            "name": "Phạm Văn L",
            "text_attribute_name": "Địa chỉ",
            "id": "signer-1-index-0_MrCFYdO05h",
            "dataset_x": 319.5,
            "dataset_y": 27,
            "position": "46,535,181,620",
            "left": 320,
            "top": "27",
            "number": "1",
            "offsetWidth": "135",
            "offsetHeight": "28",
            "signature_party": "organization"
          }
        ],
        "name": ""
      },
      {
        "id": "7TkBJBx3ne",
        "sign_unit": "chu_ky_anh",
        "sign_config": [
          {
            "sign_unit": "chu_ky_anh",
            "name": "Phạm Văn L",
            "id": "signer-2-index-0_7TkBJBx3ne",
            "dataset_x": 45.5,
            "dataset_y": 172,
            "position": "63,554,198,639",
            "left": 46,
            "top": "172",
            "number": "1",
            "offsetWidth": 135,
            "offsetHeight": 85,
            "signature_party": "organization"
          }
        ],
        "name": ""
      },
      {
        "id": "wdoQ2956af",
        "sign_unit": "chu_ky_so",
        "sign_config": [
          {
            "sign_unit": "chu_ky_so",
            "name": "Đỗ Thành Dương",
            "id": "signer-3-index-0_wdoQ2956af",
            "dataset_x": 445.5,
            "dataset_y": 265,
            "position": "385,466,504,541",
            "left": 446,
            "top": "265",
            "number": "1",
            "offsetWidth": 119,
            "offsetHeight": 74,
            "signature_party": "organization"
          },
          {
            "sign_unit": "chu_ky_so",
            "name": "Nguyễn Văn C",
            "id": "signer-3-index-1_wdoQ2956af",
            "dataset_x": 234.5,
            "dataset_y": 94,
            "position": "264,638,367,702",
            "left": 235,
            "top": "94",
            "number": "1",
            "offsetWidth": 103,
            "offsetHeight": 64,
            "signature_party": "partner"
          }
        ],
        "name": ""
      }
    ]
  }


  // data_contract: any = {
  //   contract_information: {
  //     type_contract: "Hợp đồng thương mại",
  //     name_contract: "Hợp đồng giao dịch phần mềm ứng dụng",
  //     number_contract: "123-ABC",
  //     file_content: environment.base64_file_content_demo,
  //     file_attach: [
  //       {file_name: 'hopdong.docx', file_content: 'url_download', id: 1},
  //       {file_name: 'hopdong_1.pdf', file_content: 'url_download', id: 2},
  //     ],
  //     file_related_contract: [
  //       {file_name: 'hopdong_danhan_1.pdf', file_content: 'base64', id: 123},
  //       {file_name: 'hopdong_danhan_2.pdf', file_content: 'base64', id: 456}
  //     ]
  //   },
  //   contract_related: [
  //     {
  //       name_company: 'Công ty cổ phần công nghệ cao Việt Nam',
  //       name_signature: [
  //         {name: "Nguyễn Văn A", id: 111, statusApprove: 'Đã xem xét', responseTime: '08:20 14/11/2021'},
  //         {name: "Nguyễn Văn B", id: 112, statusApprove: 'Đã ký', responseTime: '08:25 12/11/2021'}
  //       ]
  //     },
  //     {
  //       name_company: 'Công ty VHCSOFT',
  //       name_signature: [
  //         {name: "Nguyễn Văn C", id: 113, statusApprove: 'Chưa ký', responseTime: '10:20 14/11/2021'},
  //         {name: "Đỗ Thành ABC", id: 114, statusApprove: 'Đang ký', responseTime: '17:05 14/11/2021'}
  //       ]
  //     }
  //   ],
  //   contract_user_sign: [
  //     {
  //       "id": "123",
  //       "sign_unit": "so_tai_lieu",
  //       "sign_config": [
  //         {
  //           "sign_unit": "so_tai_lieu",
  //           "id": "signer-0-index-0_123",
  //           "dataset_x": 44,
  //           "dataset_y": 2953.3333333333335,
  //           "position": "317,235,497,265",
  //           "left": 44,
  //           "name": "Đỗ Thành Dương",
  //           "top": "570",
  //           "number": "4",
  //           "offsetWidth": "135",
  //           "offsetHeight": "28",
  //           "signType": "organization"
  //         }
  //       ]
  //     },
  //     {
  //       "id": "456",
  //       "sign_unit": "text",
  //       "sign_config": [
  //         {
  //           "sign_unit": "text",
  //           "id": "signer-1-index-0_456",
  //           "dataset_x": 316.5,
  //           "dataset_y": 2910.3333333333335,
  //           "position": "149,0,284,85",
  //           "left": 317,
  //           "top": "527",
  //           "name": "Đỗ Thành Lâm",
  //           "number": "4",
  //           "offsetWidth": "135",
  //           "offsetHeight": "28",
  //           "signType": "organization"
  //         }
  //       ]
  //     },
  //     {
  //       "id": "789",
  //       "sign_unit": "chu_ky_anh",
  //       "sign_config": [
  //         {
  //           "sign_unit": "chu_ky_anh",
  //           "id": "signer-2-index-0_789",
  //           "dataset_x": 149,
  //           "dataset_y": 3090.3330891927085,
  //           "position": "148,8,283,93",
  //           "left": 149,
  //           "name": "Phạm Văn Lâm",
  //           "top": "707",
  //           "number": "4",
  //           "offsetWidth": 106,
  //           "offsetHeight": 66,
  //           "signType": "partner"
  //         },
  //         {
  //           "sign_unit": "chu_ky_anh",
  //           "id": "signer-2-index-1_789",
  //           "dataset_x": 448,
  //           "dataset_y": 2404.6665852864585,
  //           "position": "390,663,570,765",
  //           "left": 448,
  //           "name": "Lê Anh Tuấn",
  //           "top": "21",
  //           "number": "4",
  //           "offsetWidth": 100,
  //           "offsetHeight": 50,
  //           "signType": "partner"
  //         }
  //       ]
  //     },
  //     {
  //       "id": "101",
  //       "sign_unit": "chu_ky_so",
  //       "sign_config": [
  //         {
  //           "sign_unit": "chu_ky_so",
  //           "id": "signer-3-index-0_101",
  //           "dataset_x": 407.5,
  //           "dataset_y": 3084.9998372395835,
  //           "position": "409,14,544,99",
  //           "left": 408,
  //           "top": "702",
  //           "name": "Giang Văn Thế",
  //           "number": "4",
  //           "offsetWidth": 135,
  //           "offsetHeight": 85,
  //           "signType": "organization"
  //         },
  //         {
  //           "sign_unit": "chu_ky_so",
  //           "id": "signer-3-index-1_101",
  //           "dataset_x": 48.5,
  //           "dataset_y": 2555.6665852864585,
  //           "position": "43,645,223,747",
  //           "left": 49,
  //           "top": "172",
  //           "name": "Phạm Văn Luân",
  //           "number": "4",
  //           "offsetWidth": 135,
  //           "offsetHeight": 85,
  //           "signType": "organization"
  //         }
  //       ]
  //     }
  //   ]
  // }

  constructor() { }

  ngOnInit(): void {
    let data_coordination = localStorage.getItem('data_coordinates_contract');
    if (data_coordination) {
      this.datas = JSON.parse(data_coordination).data_coordinates;
    }
    // this.datas = this.datas.concat(this.data_contract.contract_information);
    this.datas = Object.assign(this.datas, this.data_contract);
  }

  dieuPhoiHd() {
    // this.datas.step = "confirm-coordination";
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

}
