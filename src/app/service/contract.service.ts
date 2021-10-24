import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http: HttpClient) { }

  public getContractList(): Observable<any> {
    return this.http.get("/assets/data.json");
  }

  objDefaultSampleContract() {
    return {
      file_content: "base64",
      sign_determine: [
        {
          title: 'Người xem xét',
          id: 'nguoi_xem_xet_1',
          property_name: [
            {
              name: 'Họ tên',
              value: ''
            },
            {
              name: 'Email',
              value: ''
            }
          ]
        },
        {
          title: 'Người ký',
          id: 'nguoi_ky_1',
          property_name: [
            {
              name: 'Họ tên',
              value: ''
            },
            {
              name: 'Email',
              value: ''
            },
            {
              name: 'Loại ký',
              value: ''
            },
            {
              name: 'Số điện thoại',
              value: ''
            }
          ]
        }
      ],

      // contract_user_sign: [
      //   {
      //     "id": "123",
      //     "sign_unit": "so_tai_lieu",
      //     "sign_config": [
      //       {
      //         "sign_unit": "so_tai_lieu",
      //         "id": "signer-0-index-0_123",
      //         "dataset_x": 44,
      //         "dataset_y": 2953.3333333333335,
      //         "position": "317,235,497,265",
      //         "left": 44,
      //         "top": "570",
      //         "number": "4",
      //         "offsetWidth": "135",
      //         "offsetHeight": "28"
      //       }
      //     ]
      //   },
      //   {
      //     "id": "456",
      //     "sign_unit": "text",
      //     "sign_config": [
      //       {
      //         "sign_unit": "text",
      //         "id": "signer-1-index-0_456",
      //         "dataset_x": 316.5,
      //         "dataset_y": 2910.3333333333335,
      //         "position": "149,0,284,85",
      //         "left": 317,
      //         "top": "527",
      //         "number": "4",
      //         "offsetWidth": "135",
      //         "offsetHeight": "28"
      //       }
      //     ]
      //   },
      //   {
      //     "id": "789",
      //     "sign_unit": "chu_ky_anh",
      //     "sign_config": [
      //       {
      //         "sign_unit": "chu_ky_anh",
      //         "id": "signer-2-index-0_789",
      //         "dataset_x": 149,
      //         "dataset_y": 3090.3330891927085,
      //         "position": "148,8,283,93",
      //         "left": 149,
      //         "top": "707",
      //         "number": "4",
      //         "offsetWidth": 135,
      //         "offsetHeight": 85
      //       },
      //       {
      //         "sign_unit": "chu_ky_anh",
      //         "id": "signer-2-index-1_789",
      //         "dataset_x": 448,
      //         "dataset_y": 2404.6665852864585,
      //         "position": "390,663,570,765",
      //         "left": 448,
      //         "top": "21",
      //         "number": "4",
      //         "offsetWidth": 135,
      //         "offsetHeight": 85
      //       }
      //     ]
      //   },
      //   {
      //     "id": "101",
      //     "sign_unit": "chu_ky_so",
      //     "sign_config": [
      //       {
      //         "sign_unit": "chu_ky_so",
      //         "id": "signer-3-index-0_101",
      //         "dataset_x": 407.5,
      //         "dataset_y": 3084.9998372395835,
      //         "position": "409,14,544,99",
      //         "left": 408,
      //         "top": "702",
      //         "number": "4",
      //         "offsetWidth": 135,
      //         "offsetHeight": 85
      //       },
      //       {
      //         "sign_unit": "chu_ky_so",
      //         "id": "signer-3-index-1_101",
      //         "dataset_x": 48.5,
      //         "dataset_y": 2555.6665852864585,
      //         "position": "43,645,223,747",
      //         "left": 49,
      //         "top": "172",
      //         "number": "4",
      //         "offsetWidth": 135,
      //         "offsetHeight": 85
      //       }
      //     ]
      //   }
      // ]


      contract_user_sign: [
        {
          id: '123',
          sign_unit: 'so_tai_lieu',
          sign_config: "[]"
        },
        {
          id: '456',
          sign_unit: 'text',
          sign_config: "[]"
        },
        {
          id: '789',
          sign_unit: 'chu_ky_anh',
          sign_config: "[]"
        },
        {
          id: '101',
          sign_unit: 'chu_ky_so',
          sign_config: "[]"
        },
      ]
    }


  }



}
