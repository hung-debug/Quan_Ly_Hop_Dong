import {Component, OnInit, Input} from '@angular/core';
import {variable} from "../../../../../config/variable";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Helper} from "../../../../../core/Helper";
import {ContractService} from "../../../../../service/contract.service";

@Component({
  selector: 'app-determine-signer',
  templateUrl: './determine-signer.component.html',
  styleUrls: ['./determine-signer.component.scss']
})
export class DetermineSignerComponent implements OnInit {
  @Input() datas: any;
  @Input() step: any;
  address_step = false;
  addressDetails!: FormGroup;
  // dataDetails: any;

  get address() {
    return this.addressDetails.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService
  ) {
    this.step = variable.stepSampleContract.step2
    // this.datas.addressDetails = this.addressDetails;
  }

  ngOnInit(): void {
    this.datas.dataDetails = this.contractService.objDefaultSampleContract().sign_determine;
    // this.addressDetails = this.formBuilder.group({
    //   city: ['', Validators.required],
    //   address: ['', Validators.required],
    //   pincode: ['', Validators.required]
    // });
  }

  fileChanged(e: any) {
    const file = e.target.files[0];
    if (file) {
      if (e.target.files[0].size <= 5000000) {
        const file_name = file.name;
        const extension = file.name.split('.').pop();
        // tslint:disable-next-line:triple-equals
        if (extension.toLowerCase() == 'pdf') {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = (e) => {
            //@ts-ignore
            const base64result = fileReader.result.toString().split(',')[1];
            const fileInput: any = document.getElementById('file-input');
            fileInput.value = '';
            this.datas.file_content = base64result;
            this.datas.file_name = file_name;
            // this.datas.documents['file_content_docx'] = null;
            // this.pdfSrc = Helper._getUrlPdf(base64result);
          };
        } else {
          alert('Chỉ hỗ trợ file có định dạng PDF')
        }
      } else {
        alert('Yêu cầu file nhỏ hơn 5MB');
      }
    }
  }

  addFile() {
    // @ts-ignore
    document.getElementById('file-input').click();
  }

}
