// import { locale } from 'date-fns/locale/en-US';
import { Component, Inject, OnInit, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ContractService } from "../../../../../service/contract.service";
import { ToastService } from "../../../../../service/toast.service";
import { NgxSpinnerService } from "ngx-spinner";
import { parttern, parttern_input } from 'src/app/config/parttern';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forward-contract',
  templateUrl: './forward-contract.component.html',
  styleUrls: ['./forward-contract.component.scss']
})
export class ForwardContractComponent implements OnInit {
  myForm: FormGroup;
  datas: any;
  currentUser: any;
  isReqPhone: boolean = false;
  isReqCardId: boolean = false;

  isReqCardIdToken: boolean = false;
  isReqCardIdHsm: boolean = false;
  site: string;
  login: string;
  type: any = 0;
  locale: string;
  isVietnamese: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialog: MatDialog,
    private fbd: FormBuilder,
    private contractService: ContractService,
    public dialogRef: MatDialogRef<ForwardContractComponent>,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
  ) {
  }


  ngOnInit(): void {
    this.datas = this.data;
    this.login = "email";
    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }

    if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
      this.type = 1;
    } else
      this.type = 0;

    this.getCurrentUser();
    this.myForm = this.fbd.group({
      name: this.fbd.control("", [Validators.required]),
      email: this.fbd.control("", [Validators.required]),
      phone: "",
      card_id: "",
    });
    
    
    // this.locale = this.datas?.dataContract?.is_data_contract?.participants[0]?.recipients[0]?.locale;
    const currentRecipientData = this.getTargetRecipientData(this.datas?.recipientId);
    this.locale = currentRecipientData?.locale ? currentRecipientData?.locale: 'vi';

    for (const d of this.datas.dataContract.is_data_contract.participants) {
      for (const q of d.recipients) {
        if (q.email == this.currentUser.customer.info.email && q.status == 1) {
          let data_sign_cka = q.sign_type.filter((p: any) => p.id == 1)[0];

          //Chữ ký eKYC
          let data_sign_ekyc = q.sign_type.filter((p: any) => p.id == 5)[0];

          //Chữ ký HSM
          let data_sign_cardIdHsm = q.sign_type.filter((p: any) => p.id == 4)[0];

          //Chữ ký usb token
          let data_sign_cardIdToken = q.sign_type.filter((p: any) => p.id == 2)[0];

          if (data_sign_cka) {
            this.isReqPhone = true;
          }
          if (data_sign_ekyc) {
            this.isReqCardId = true;
          }

          if (data_sign_cardIdHsm) {
            this.isReqCardIdHsm = true;
          }

          if (data_sign_cardIdToken) {
            this.isReqCardIdToken = true;
          }

          break
        }
      }
      if (this.isReqPhone || this.isReqCardId) break;
    }
  }

  getTargetRecipientData(targetId : number){
    if (this.datas?.dataContract?.is_data_contract?.participants?.length) {
      const participants = this.datas?.dataContract?.is_data_contract?.participants;
      for (const participant of participants) {
        for (const recipient of participant.recipients) {
          if (targetId == recipient.id) {
            return recipient;
          }
        }
      }
    }
  }

  changeTypeSign(e: any,) {
    this.login = e.target.value;
    
  }

  setLocale(lang: string) {
    this.locale = lang;
  }

  dropdownButtonText = '';
  async onSubmit() {
    const updatedInfo = await this.contractService.getInforPersonProcess(this.datas.recipientId).toPromise()
    let isInRecipient = false;

    if (this.datas?.dataContract?.is_data_contract?.participants?.length) {
      const participants = this.datas?.dataContract?.is_data_contract?.participants;
      
      for (const participant of participants) {
        for (const recipient of participant.recipients) {
          if (updatedInfo.name == recipient.name) {
            isInRecipient = true;
          }
        }
      }
    }

    if (!isInRecipient) {
      
      this.toastService.showErrorHTMLWithTimeout(
        'Bạn không có quyền xử lý hợp đồng này do tên không trùng khớp!',
        '',
        3000
      );
      if (this.type == 1) {
        this.router.navigate(['/login']);
        this.dialogRef.close();
        this.spinner.hide();
        return
      } else {
        this.router.navigate(['/main/dashboard']);
        this.dialogRef.close();
        this.spinner.hide();
        return
      }
    }

    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '').customer.info;
    this.contractService.getDetermineCoordination(this.datas.recipientId).subscribe(async (response) => {
      const ArrRecipients = response.recipients.filter((ele: any) => ele.id);

      let ArrRecipientsNew = false
      ArrRecipients.map((item: any) => {
        if (item.email === this.currentUser.email) {
          ArrRecipientsNew = true
          return
        }
      });
      

      if (!ArrRecipientsNew) {

        this.toastService.showErrorHTMLWithTimeout(
          'Bạn không có quyền xử lý hợp đồng này!',
          '',
          3000
        );
        if (this.type == 1) {
          this.router.navigate(['/login']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        } else {
          this.router.navigate(['/main/dashboard']);
          this.dialogRef.close();
          this.spinner.hide();
          return
        }
      };
      
      if (!String(this.myForm.value.name)) {
        // this.datas.is_content == 'forward_contract' ? 'Chuyển tiếp' : 'Ủy quyền'
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập tên người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
        return;
      }
      if (this.login == 'email' && !String(this.myForm.value.email)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập email người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
        return;
      } else if (this.login == 'email' && !String(this.myForm.value.email).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập đúng định dạng email', '', 3000);
        return;
      }
      if (this.isReqPhone && !String(this.myForm.value.phone)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập số điện thoại người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
        return;
      } else if (this.myForm.value.phone && !String(this.myForm.value.phone).toLowerCase().match(parttern.phone)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập đúng định dạng số điện thoại', '', 3000);
        return;
      }
      if (this.isReqCardId && !String(this.myForm.value.card_id)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập CMT/CCCD người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
        return;
      } else if (this.isReqCardId && this.myForm.value.card_id && !String(this.myForm.value.card_id).toLowerCase().match(parttern.card_id9) && !String(this.myForm.value.card_id).toLowerCase().match(parttern.card_id12)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập đúng định dạng CMT/CCCD', '', 3000);
        return;
      }
      //Mã số thuế hsm
      else if (this.isReqCardIdHsm && !String(this.myForm.value.card_id)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập mã số thuế người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
        return;
      } else if (this.isReqCardIdHsm && this.myForm.value.card_id && !String(this.myForm.value.card_id).toLowerCase().match(parttern.cardid)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập đúng định dạng mã số thuế', '', 3000);
        return;
      }
      //Thông tin trong usb token
      else if (this.isReqCardIdToken && !String(this.myForm.value.card_id)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập thông tin trong usb token của người ' + (this.datas.is_content == 'forward_contract' ? 'chuyển tiếp' : 'ủy quyền'), '', 3000);
        return;
      } else if (this.isReqCardIdToken && this.myForm.value.card_id && (!String(this.myForm.value.card_id).toLowerCase().match(parttern_input.taxCode_form) && !String(this.myForm.value.card_id).toLowerCase().match(parttern.card_id9)) && !String(this.myForm.value.card_id).toLowerCase().match(parttern.card_id12)) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập đúng định dạng mã số thuế/CMT/CCCD', '', 3000);
        return;
      }

      if (!this.checkCanSwitchContract()) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập email ngoài luồng hợp đồng', '', 3000);
        return;
      }
      if (this.myForm.value.phone && !this.checkCanSwitchContractPhone()) {
        this.toastService.showWarningHTMLWithTimeout('Vui lòng nhập số điện thoại ngoài luồng hợp đồng', '', 3000);
        return;
      }

      // this.checkCanSwitchContractPhone();


      if (this.currentUser) {
        this.spinner.show();
        let coutError = 0;
        let id_recipient_signature = null;
        for (const d of this.datas.dataContract.is_data_contract.participants) {
          for (const q of d.recipients) {
            if (q.email == this.currentUser.email && q.status == 1) {
              id_recipient_signature = q.id;
              break
            }
          }
          if (id_recipient_signature) break;
        }

        await this.contractService.getCheckSignatured(id_recipient_signature).toPromise().then((res: any) => {
          if (res && res.status == 2) {
            this.toastService.showErrorHTMLWithTimeout('contract_signature_success', "", 3000);
            coutError++;
            this.spinner.hide();
          }
        }, (error) => {
          coutError++;
          this.spinner.hide();
          this.toastService.showErrorHTMLWithTimeout('error_check_signature', "", 3000);
        })

        

        

        if (coutError == 0) {
          //is_replace: false = giữ lại uỷ quyền
          const dataAuthorize = {
            email: this.myForm.value.email.toLowerCase(),
            full_name: this.myForm.value.name,
            phone: this.myForm.value.phone,
            card_id: this.myForm.value.card_id,
            role: this.data.role_coordination ? this.data.role_coordination : this.datas.dataContract.roleContractReceived,
            recipient_id: this.datas.recipientId,
            is_replace: false,
            login_by: this.login,
            locale: this.locale
          };
          
          

          if (this.login == 'phone') {
            dataAuthorize.email = dataAuthorize.phone
          }

          await this.contractService.processAuthorizeContract(dataAuthorize).toPromise().then(
            data => {
              if (!data.success) {
                if (data.message == 'Tax code has existed') {
                  this.spinner.hide();
                  this.toastService.showWarningHTMLWithTimeout('taxcode.out', '', 3000);
                }
              } else {
                this.toastService.showSuccessHTMLWithTimeout((this.datas.is_content == 'forward_contract' ? 'Chuyển tiếp' : 'Ủy quyền') + ' thành công!'
                  , "", 3000);
                this.dialogRef.close();
                this.spinner.hide();
                this.router.navigate(['/main/form-contract/detail/forward/' + this.datas?.dataContract?.is_data_contract?.id]);

                // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                // this.router.navigate(['/main/form-contract/detail/' + this.datas?.dataContract?.is_data_contract?.id],
                // {
                //   queryParams: {
                //     'filter_code': data.filter_code, 
                //   },
                //   skipLocationChange: true
                // });
                // });
              }
            }, error => {
              this.spinner.hide();
              this.toastService.showErrorHTMLWithTimeout('Có lỗi! Vui lòng liên hệ nhà phát triển để được xử lý', "", 3000);
            }
          )

        }

      }
    })
  }

  getCurrentUser(): any {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
  }

  checkCanSwitchContract() {
    if (this.datas?.dataContract?.is_data_contract?.participants?.length) {
      for (const participant of this.datas.dataContract.is_data_contract.participants) {
        for (const recipient of participant.recipients) {
          if (this.myForm.value.email == recipient.email && recipient.status != 4) {
            return false;
          }
        }
      }
    }
    return true;
  }

  checkCanSwitchContractPhone() {
    if (this.datas?.dataContract?.is_data_contract?.participants?.length) {
      for (const participant of this.datas.dataContract.is_data_contract.participants) {
        for (const recipient of participant.recipients) {
          if (this.myForm.value.phone == recipient.phone && recipient.status !== 4 ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  checkCanSwitchContractCardId() {
    if (this.datas?.dataContract?.is_data_contract?.participants?.length) {
      for (const participant of this.datas.dataContract.is_data_contract.participants) {
        for (const recipient of participant.recipients) {
          if (!this.isReqCardId) {
            if (this.datas.recipientId != recipient.id && this.myForm.value.card_id == recipient.card_id) {
              return false;
            }
          } else {
            if (this.myForm.value.card_id == recipient.card_id) {
              return false;
            }
          }

        }
      }
    }
    return true;
  }

  t() {
    
  }

}
