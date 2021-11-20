import {environment} from "../../../../environments/environment";

export const contractReceiveConsider = {}
export const CONTRACT_RECEIVE_CONSIDER = 1;
export const CONTRACT_RECEIVE_COORDINATOR = 2;
export const CONTRACT_RECEIVE_SIGNATURE = 3;
export const CONTRACT_RECEIVE_SECRETARY = 4;

export const data_signature_contract = {
  // contract_information: {
  //   type_contract: "Hợp đồng thương mại",
  //   name_contract: "Hợp đồng eContract",
  //   number_contract: "123-ABC",
  //   file_content: environment.base64_file_content_demo,
  //   file_attach: [
  //     {file_name: 'hopdong.docx', file_content: 'url_download', id: 1},
  //     {file_name: 'hopdong_1.pdf', file_content: 'url_download', id: 2},
  //   ],
  //   file_related_contract: [
  //     {file_name: 'hopdong_danhan_1.pdf', file_content: 'base64', id: 123},
  //     {file_name: 'hopdong_danhan_2.pdf', file_content: 'base64', id: 456}
  //   ]
  // },
  // contract_related: [
  //   {
  //     name_company: 'CÔNG TY PHẦN MỀM CÔNG NGHỆ CAO',
  //     name_signature: [
  //       {name: "Nguyễn Văn A", id: 111, statusApprove: 'Đã xem xét', responseTime: '08:20 14/11/2021'},
  //       {name: "Phạm Văn L", id: 112, statusApprove: 'Đã ký', responseTime: '08:25 12/11/2021'},
  //       {name: "Đỗ Thành Dương", id: 113, statusApprove: 'Đã ký', responseTime: '08:25 12/11/2021'}
  //     ]
  //   },
  //   {
  //     name_company: 'CÔNG TY CÔNG NGHỆ THÔNG TIN',
  //     name_signature: [
  //       {name: "Thành Dương", id: 114, statusApprove: 'Chưa ký', responseTime: '10:20 14/11/2021'},
  //       {name: "Nguyễn Văn C", id: 115, statusApprove: 'Đang ký', responseTime: '17:05 14/11/2021'},
  //       {name: "Nguyễn Văn Thư", id: 116, statusApprove: 'Đã xem', responseTime: '17:05 14/11/2021'}
  //     ]
  //   }
  // ],
  coordination_complete: false,
  "stepLast": "infor-coordination",
  "file_name": "quan_ly_hd-converted.pdf",
  file_name_attach: "quan_ly_hd.docx",
  "contractFile": {},
  name: "eContract hop dong",
  "code": "123-ABC",
  "type_id": [
    {
      item_id: 2,
      item_text: "Loại hợp đồng B"
    }
  ],
  "contractConnect": [
    {item_id: 1, item_text: 'Hợp đồng A'},
    {item_id: 2, item_text: 'Hợp đồng B'}
  ],
  attachFile: {
    lastModified: 1634125013874,
    lastModifiedDate: 'Wed Oct 13 2021 18:36:53 GMT+0700 (Indochina Time)',
    name: "quan_ly_hd.docx"
  },
  sign_time: 'Wed Nov 17 2021 00:49:23 GMT+0700 (Indochina Time)',
  "dateDeadline": "2021-11-15T13:43:28.476Z",
  notes: "hợp đồng lao động",
  "file_content": environment.base64_file_content_demo,
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
