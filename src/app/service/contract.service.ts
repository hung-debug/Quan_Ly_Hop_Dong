import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor() {
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
