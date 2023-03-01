import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';

@Component({
  selector: 'app-multi-sign-list',
  templateUrl: './multi-sign-list.component.html',
  styleUrls: ['./multi-sign-list.component.scss']
})
export class MultiSignListComponent implements OnInit {

  idContract: any [] = [];
  idRecipient: any [] = [];

  datas: any;
  allFileAttachment: any[];
  recipient: any;
  canvasWidth = 0;
  loadingText: string = 'Đang xử lý...';
  isDataObjectSignature: any;
  currentUser: any;

  isDataFileContract: any;
  isDataContract: any;

  data_contract: any;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    //lấy id contract đã tick
    this.route.queryParams.subscribe((params: any) => {
      this.idContract = params.idContract;
      this.idRecipient = params.idRecipient;
    })

    this.getDataContractSignature();

    console.log("id ", this.idContract);
  }

  getDataContractSignature() {
    this.contractService.getDetailContract(this.idContract[0]).subscribe(
      async (rs) => {

        console.log("rs ", rs);
        this.isDataContract = rs[0];
        this.isDataFileContract = rs[1];
        this.isDataObjectSignature = rs[2];

        this.data_contract = {
          is_data_contract: rs[0],
          i_data_file_contract: rs[1],
          is_data_object_signature: rs[2],
        };

        this.datas = this.data_contract;

        console.log("datass ", this.datas);

      },
      (res: any) => {
        // @ts-ignore
        this.handleError();
      }
    );
  }

  processHandleContract() {

  }

  scroll(event: any) {

  }

  convertToSignConfig() {
    if (this.datas && this.isDataObjectSignature && this.isDataObjectSignature.length) {
      return this.datas.is_data_object_signature.filter(
        (item: any) =>
          item.recipient ? (item?.recipient?.email === this.currentUser.email &&
          item?.recipient?.role === this.datas?.roleContractReceived): []
      );
    } else {
      return [];
    }
  }

  getSignSelect(d: any) {

  }

  changeColorDrag(role: any, valueSign: any, isDaKeo?: any) {
    if (isDaKeo && !valueSign.valueSign) {
      return 'ck-da-keo';
    } else if (!valueSign.valueSign) {
      return 'employer-ck';
    } else {
      return '';
    }
  }

  changePosition(d?: any, e?: any, sizeChange?: any, backgroundColor?: string) {
    let style: any = {
      transform:
        'translate(' + d['coordinate_x'] + 'px, ' + d['coordinate_y'] + 'px)',
      position: 'absolute',
      backgroundColor: backgroundColor,
    };
    style.backgroundColor = d.valueSign ? '' : backgroundColor;
   
    if (d['width']) {
      style.width = parseInt(d['width']) + 'px';
    }
    if (d['height']) {
      style.height = parseInt(d['height']) + 'px';
    }

    return style;
  }

}
