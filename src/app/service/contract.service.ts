import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor() {
  }

  objDefaultSampleContract() {
    // return [
    //   {
    //     id: "123",
    //     sign_unit: "so_tai_lieu",
    //     sign_config: [
    //       {
    //         sign_unit: "so_tai_lieu",
    //         id: "signer-0-index-0_123",
    //         dataset_x: 306,
    //         dataset_y: 157,
    //         position: "53,370,233,400",
    //         left: 306,
    //         top: "157",
    //         number: "1",
    //         offsetWidth: "135",
    //         offsetHeight: "28"
    //       }
    //     ]
    //   },
    //   {
    //     id: "456",
    //     sign_unit: "text",
    //     sign_config: [
    //       {
    //         sign_unit: "text",
    //         id: "signer-1-index-0_456",
    //         dataset_x: 52.5,
    //         dataset_y: 392,
    //         position: "53,371,193,400",
    //         left: 53,
    //         top: "392",
    //         number: "1",
    //         offsetWidth: 139.82142857142844,
    //         offsetHeight: 29
    //       }
    //     ]
    //   },
    //   {
    //     id: "789",
    //     sign_unit: "chu_ky_anh",
    //     sign_config: [
    //       {
    //         sign_unit: "chu_ky_anh",
    //         id: "signer-2-index-0_789",
    //         dataset_x: 277,
    //         dataset_y: 610,
    //         position: "62,305,181,380",
    //         left: 277,
    //         top: "610",
    //         number: "1",
    //         offsetWidth: 119,
    //         offsetHeight: 74
    //       }
    //     ]
    //   },
    //   {
    //     id: "101",
    //     sign_unit: "chu_ky_so",
    //     sign_config: [
    //       {
    //         sign_unit: "chu_ky_so",
    //         id: "signer-3-index-0_101",
    //         dataset_x: 52.5,
    //         dataset_y: 847.6666666666666,
    //         position: "53,0,154,64",
    //         left: 53,
    //         top: "53",
    //         number: "2",
    //         offsetWidth: 101,
    //         offsetHeight: 63.59259259259261
    //       }
    //     ]
    //   }
    // ]





    return [
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
