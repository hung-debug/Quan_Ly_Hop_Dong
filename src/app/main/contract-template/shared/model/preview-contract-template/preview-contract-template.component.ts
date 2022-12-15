import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-preview-contract-template',
  templateUrl: './preview-contract-template.component.html',
  styleUrls: ['./preview-contract-template.component.scss']
})
export class PreviewContractTemplateComponent implements OnInit {

  datasBatch: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.datasBatch = this.data;

    console.log("datas batch ", this.datasBatch);
  }

  convertToSignConfig() {
    if (
      this.datasBatch &&
      this.datasBatch.is_data_object_signature &&
      this.datasBatch.is_data_object_signature.length
    ) {
      console.log("th1 ", this.datasBatch.is_data_object_signature);
      return this.datasBatch.is_data_object_signature;
    } else {
      console.log("th2");
      return [];
    }
  }

}
