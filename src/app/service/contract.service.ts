import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor() { }

  objDefaultSampleContract() {
    return {
      contract_user_sign: [
        {
          sign_unit: 'so_tai_lieu',
          sign_config: [
            {
              dataset_x: 0,
              dataset_y: 0,
              id: "",
              left: 0,
              name: "",
              number: "",
              offsetHeight: 30,
              offsetWidth: 180,
              position: "",
              sign_unit: "so_tai_lieu",
              top: 0
            }
          ]
        },
        {
          sign_unit: 'text',
          sign_config: [
            {
              dataset_x: 0,
              dataset_y: 0,
              id: "",
              left: 0,
              name: "",
              number: "",
              offsetHeight: 30,
              offsetWidth: 180,
              position: "",
              sign_unit: "text",
              top: 0
            }
          ]
        },
        {
          sign_unit: 'chu_ky_so',
          sign_config: [
            {
              dataset_x: 0,
              dataset_y: 0,
              id: "",
              left: 0,
              name: "",
              number: "",
              offsetHeight: 102,
              offsetWidth: 180,
              position: "",
              sign_unit: "chu_ky_so",
              top: 0
            }
          ]
        },
        {
          sign_unit: 'chu_ky_anh',
          sign_config: [
            {
              dataset_x: 0,
              dataset_y: 0,
              id: "",
              left: 0,
              name: "",
              number: "",
              offsetHeight: 102,
              offsetWidth: 180,
              position: "",
              sign_unit: "chu_ky_so",
              top: 0
            }
          ]
        }



      ]
    }
  }
}
