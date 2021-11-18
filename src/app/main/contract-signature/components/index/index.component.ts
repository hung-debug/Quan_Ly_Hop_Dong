import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {SignContractComponent} from "../sign-contract/sign-contract.component";
import {AddContractComponent} from "../contract-coordination/add-contract/add-contract.component";
import {variable} from "../../../../config/variable";
import {environment} from "../../../../../environments/environment";
import {UserService} from "../../../../service/user.service";
import {ContractSignatureService} from "../../../../service/contract-signature.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('ContractSign') SignContractComponent: SignContractComponent;
  @ViewChild('AddContract') AddContractComponent: AddContractComponent;
  datas: any;
  data_contract: any;
  // @Input() datas: any = {
  //   step: variable.stepSampleContract.step_coordination,
  //   contract: {},
  //   action_title: 'Điều phối'
  // }

  constructor(
    private contractSignatureService: ContractSignatureService
  ) {
  }


  /*data_contract: any = {
    contract_information: {
      type_contract: "Hợp đồng thương mại",
      name_contract: "Hợp đồng giao dịch phần mềm ứng dụng",
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
        name_company: 'VHCSOFT',
        name_signature: [
          {name: "Nguyễn Văn A", id: 111, statusApprove: 'Đã xem xét', responseTime: '08:20 14/11/2021'},
          {name: "Nguyễn Văn B", id: 112, statusApprove: 'Đã ký', responseTime: '08:25 12/11/2021'}
        ]
      },
      {
        name_company: 'TÊN ĐỐI TÁC',
        name_signature: [
          {name: "Nguyễn Văn C", id: 113, statusApprove: 'Chưa ký', responseTime: '10:20 14/11/2021'},
          {name: "Đỗ Thành ABC", id: 114, statusApprove: 'Đang ký', responseTime: '17:05 14/11/2021'}
        ]
      }
    ],

    "stepLast": "sample-contract",
    "file_name": "quan_ly_hd-converted.pdf",
    "contractFile": {},
    "contractName": "Hợp đồng eContract",
    "contractNumber": "123-ABC",
    "contractType": [
      {
        "item_id": 2,
        "item_text": "Loại hợp đồng B"
      }
    ],
    "contractConnect": [
      {
        "item_id": 1,
        "item_text": "Hợp đồng A"
      }
    ],
    "dateDeadline": "2021-11-14T08:35:52.465Z",
    "comment": "note",
    "file_content": "",
    "userForm": {
      "order": 1,
      "name": "CÔNG TY CỔ PHẦN PHẦN MỀM CÔNG NGHỆ CAO VIỆT NAM",
      "userViews": [
        {
          "order": 1,
          "name": "Đỗ Thành Dương",
          "email": "dothanhduongpro@gmail.com"
        }
      ],
      "userSigns": [
        {
          "order": 1,
          "name": "Nguyễn Văn A",
          "email": "nguyenvanapro@gmail.com",
          "signType": [
            {
              "item_id": 1,
              "item_text": "Ký ảnh"
            }
          ],
          "isOtp": true,
          "phone": "0979889156",
          "id": "8iOvX5ByTm",
          "selected": false,
          "sign_unit": "organization",
          "is_disable": false
        },
        {
          "order": 1,
          "name": "Phạm Văn CV",
          "email": "cvpv@gmail.com",
          "signType": [
            {
              "item_id": 3,
              "item_text": "Ký số bằng sim KPI"
            }
          ],
          "isOtp": true,
          "phone": "0979889999",
          "id": "x5bgDGPGHE",
          "selected": false,
          "sign_unit": "organization",
          "is_disable": true
        }
      ],
      "userDocs": [
        {
          "order": 1,
          "name": "Phạm Văn Thế",
          "email": "thepv@gmail.com",
          "signType": [
            {
              "item_id": 2,
              "item_text": "Ký số bằng USB token"
            }
          ]
        }
      ]
    },
    "partnerForm": {
      "order": 1,
      "name": "CÔNG TY CỔ PHẦN VHCSOFT",
      "partnerArrs": [
        {
          "order": 1,
          "type": 1,
          "name": "Công ty cổ phần công nghệ cao VHCSOFT",
          "partnerLeads": [
            {
              "order": 1,
              "name": "Đỗ Thành Dương",
              "email": "duongdt@gmail.com"
            }
          ],
          "partnerViews": [
            {
              "order": 1,
              "name": "Nguyễn Thị A",
              "email": "ant@gmail.com"
            }
          ],
          "partnerSigns": [
            {
              "order": 1,
              "name": "Lê Anh Tuấn",
              "email": "leanhtuan@gmail.com",
              "signType": [
                {
                  "item_id": 1,
                  "item_text": "Ký ảnh"
                }
              ],
              "isOtp": true,
              "phone": "0979889156",
              "id": "Totr14X4W9",
              "selected": false,
              "sign_unit": "partner",
              "is_disable": false
            }
          ],
          "partnerDocs": [
            {
              "order": 1,
              "name": "Nguyễn Thị ABC",
              "email": "abc@gmail.com",
              "signType": [
                {
                  "item_id": 4,
                  "item_text": "Ký số bằng HSM"
                }
              ]
            }
          ],
          "partnerUsers": []
        }
      ]
    },

    contract_user_sign: [
      {
        "id": "123",
        "sign_unit": "so_tai_lieu",
        "sign_config": [
          {
            "sign_unit": "so_tai_lieu",
            "id": "signer-0-index-0_123",
            "dataset_x": 44,
            "dataset_y": 2953.3333333333335,
            "position": "317,235,497,265",
            "left": 44,
            "name": "Đỗ Thành Dương",
            "top": "570",
            "number": "4",
            "offsetWidth": "135",
            "offsetHeight": "28",
            "signType": "organization"
          }
        ]
      },
      {
        "id": "456",
        "sign_unit": "text",
        "sign_config": [
          {
            "sign_unit": "text",
            "id": "signer-1-index-0_456",
            "dataset_x": 316.5,
            "dataset_y": 2910.3333333333335,
            "position": "149,0,284,85",
            "left": 317,
            "top": "527",
            "name": "Đỗ Thành Lâm",
            "number": "4",
            "offsetWidth": "135",
            "offsetHeight": "28",
            "signType": "organization"
          }
        ]
      },
      {
        "id": "789",
        "sign_unit": "chu_ky_anh",
        "sign_config": [
          {
            "sign_unit": "chu_ky_anh",
            "id": "signer-2-index-0_789",
            "dataset_x": 149,
            "dataset_y": 3090.3330891927085,
            "position": "148,8,283,93",
            "left": 149,
            "name": "Phạm Văn Lâm",
            "top": "707",
            "number": "4",
            "offsetWidth": 106,
            "offsetHeight": 66,
            "signType": "partner"
          },
          {
            "sign_unit": "chu_ky_anh",
            "id": "signer-2-index-1_789",
            "dataset_x": 448,
            "dataset_y": 2404.6665852864585,
            "position": "390,663,570,765",
            "left": 448,
            "name": "Lê Anh Tuấn",
            "top": "21",
            "number": "4",
            "offsetWidth": 100,
            "offsetHeight": 50,
            "signType": "partner"
          }
        ]
      },
      {
        "id": "101",
        "sign_unit": "chu_ky_so",
        "sign_config": [
          {
            "sign_unit": "chu_ky_so",
            "id": "signer-3-index-0_101",
            "dataset_x": 407.5,
            "dataset_y": 3084.9998372395835,
            "position": "409,14,544,99",
            "left": 408,
            "top": "702",
            "name": "Giang Văn Thế",
            "number": "4",
            "offsetWidth": 135,
            "offsetHeight": 85,
            "signType": "organization"
          },
          {
            "sign_unit": "chu_ky_so",
            "id": "signer-3-index-1_101",
            "dataset_x": 48.5,
            "dataset_y": 2555.6665852864585,
            "position": "43,645,223,747",
            "left": 49,
            "top": "172",
            "name": "Phạm Văn Luân",
            "number": "4",
            "offsetWidth": 135,
            "offsetHeight": 85,
            "signType": "organization"
          }
        ]
      }
    ]
  }*/


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

  ngOnInit(): void {
    this.contractSignatureService.getContractDetail().subscribe(response => {
      this.data_contract = response;
      let data_coordination = localStorage.getItem('data_coordinates_contract');
      if (data_coordination) {
        this.datas = JSON.parse(data_coordination).data_coordinates;
      }
      // this.datas = this.datas.concat(this.data_contract.contract_information);
      this.datas = Object.assign(this.datas, this.data_contract);
    });
  }

  dieuPhoiHd() {
    // this.datas.step = "confirm-coordination";
    this.datas.step = variable.stepSampleContract.step_confirm_coordination;
  }

}
