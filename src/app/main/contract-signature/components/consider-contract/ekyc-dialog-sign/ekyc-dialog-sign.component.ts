import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-ekyc-dialog-sign',
  templateUrl: './ekyc-dialog-sign.component.html',
  styleUrls: ['./ekyc-dialog-sign.component.scss']
})
export class EkycDialogSignComponent implements OnInit {
  @Input() datas: any;
  personEkyc: any;
  width: number = 100;

  constructor(
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<EkycDialogSignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    private translate: TranslateService,
    private router: Router,
    private deviceSerce: DeviceDetectorService
  ) {

  }

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: {exact: 640},
    height: {exact: 640},
    // facingMode: 'environment'
    
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  title: number = -1;

  flagSuccess: boolean = false;

  initWebcamImage: any;
  contractId: number;
  organizationId: any;
  type: any = 0;
  public ngOnInit(): void {
    if (sessionStorage.getItem('type') || sessionStorage.getItem('loginType')) {
      this.type = 1;
    } else
      this.type = 0;

    if(window.innerWidth > window.innerHeight) {
      this.width=window.innerHeight
    } else
      this.width = window.innerWidth;
     
    if(this.width > 768){
      this.width = 0.5*window.innerWidth;
    }

    this.initWebcamImage = this.webcamImage;

    //title = 0: nhan dang anh can cuoc cong dan
    //title = 1: nhan dang khuon mat
    if(this.data.title) {
      this.title = 0;
    } else {
      this.title = 1;
      this.data.title = 'face.recog';
    }

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  cardId: any;
  name:any;
  currentUser: any;
  public async triggerSnapshot(): Promise<void> {
    this.trigger.next();
  }

  public async confirmData(): Promise<void>{
    this.spinner.show();

    if(this.data.recipientId) {
      const determineCoordination = await this.contractService.getDetermineCoordination(this.data.recipientId).toPromise();
      this.cardId = determineCoordination.recipients[0].card_id;
      this.name = determineCoordination.recipients[0].name;
    }
 
    // this.contractService.getDataCoordination(this.data.contractId).subscribe(async (response) => {
    //   this.organizationId =  response.organization_id;

    //   if(this.title == 0) {
    //     let formData = {
    //       "name": "image_ekyc_web_cardId" + new Date().getTime() + ".jpg",
    //       "content":this.webcamImage.imageAsDataUrl,
    //       "organizationId": this.organizationId,
    //     }
  
    //     this.upFileImageToDb(formData);
  
    //     this.contractService.detectCCCD(this.webcamImage.imageAsDataUrl, this.data.contractId, this.data.recipientId).subscribe((response) => {
    //       this.spinner.hide();
    //       if(response.result_code == 200 && (response.action == 'pass' || (response.action == 'manualReview' && this.checkWarning(response.warning)))) {
    //         if(this.cardId) {
    //           if(this.cardId == response.id && this.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "") == response.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
    //             this.flagSuccess == true;
    //             alert(this.translate.instant('confirm.success'));
    //             this.dialogRef.close(this.webcamImage.imageAsDataUrl);
    //           } else if(this.cardId != response.id){
    //             this.flagSuccess == false;
    //             this.webcamImage = this.initWebcamImage;
    //             alert(this.translate.instant('card.id.not.match'));
    //             // string.replace(/  +/g, ' ');
    //           } else if(this.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "") != response.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
    //             this.flagSuccess == false;
    //             this.webcamImage = this.initWebcamImage;
    //             alert(this.translate.instant('name.not.match'));
    //           }else{
    //             this.flagSuccess == false;
    //             alert(this.translate.instant('invalid.infor'));
    //           }
    //         } else {
    //           alert(this.translate.instant('confirm.success'));
    //           this.dialogRef.close(this.webcamImage.imageAsDataUrl);
    //         }
             
    //       } else {
    //         this.flagSuccess = false;
    //         this.webcamImage = this.initWebcamImage;
            
    //         if(response.warning_msg?.length > 0)
    //           alert(this.translate.instant('confirm.fail')+ response.warning_msg[0]);
    //         else if(response.reason_for_action?.length > 0)
    //           alert(this.translate.instant('image.not.clear'));
    //         else
    //           alert(this.translate.instant('confirm.fail'));
    //       }
         
    //     }, (error: any) => {
    //       alert(this.translate.instant('card.id.fail'));
    //     })
    //   } else {
    //     let formData = {
    //       "name": "image_ekyc_web_face" + new Date().getTime() + ".jpg",
    //       "content":this.webcamImage.imageAsDataUrl,
    //       "organizationId": this.organizationId,
    //     }
  
    //     //up file anh len db
    //     this.upFileImageToDb(formData);
  
    //     this.contractService.detectFace(this.data.cccdFront, this.webcamImage.imageAsDataUrl,this.data.contractId, this.data.recipientId).subscribe(async (response) => {
    //       this.spinner.hide();
    //       if(response.verify_result == 2 && response.face_anti_spoof_status.status == 'REAL') {
    //         alert(this.translate.instant('confirm.success'));

    //         //call api trừ ekyc
    //         await this.contractService.decreaseNumberOfEkyc(this.organizationId).toPromise();

    //         this.dialogRef.close(response.verify_result);
    //       } else {
    //         if(response.face_anti_spoof_status.status == 'FAKE') {
    //           alert(this.translate.instant('face.fail'));
    //         } else if(response.message.error_message && response.message.error_message != 'undefined') {
    //           alert(response.message.error_message);
    //         } else {
    //           alert(this.translate.instant('confirm.fail'))
    //         }

    //         this.flagSuccess = false;
    //         this.webcamImage = this.initWebcamImage; 
    //       }
    //     }, (error: any) => {
    //       alert(this.translate.instant('confirm.fail'))
    //     })
    //   }
  
    // })

    const img = new Image();
    img.onload = () => {
      this.callAPI(img);
    };
    img.src = this.webcamImage.imageAsDataUrl;
  }

  callAPI(img: any) {
    this.contractService.getDataCoordination(this.data.contractId).subscribe(async (response) => {
      this.organizationId =  response.organization_id;

      if(this.title == 0) {
        let formData = {
          "name": "image_ekyc_web_cardId" + new Date().getTime() + ".jpg",
          "content":this.webcamImage.imageAsDataUrl,
          "organizationId": this.organizationId,
          signType: 'eKYC',
          ocrResponseName: this.name ? this.name : response.participants[0].name
        }
  
        this.upFileImageToDb(formData);
  
        this.contractService.detectCCCD(this.webcamImage.imageAsDataUrl, this.data.contractId, this.data.recipientId,img,this.deviceSerce).subscribe((response) => {
          this.spinner.hide();
          if(response.result_code == 200 && (response.action == 'pass' || (response.action == 'manualReview' && this.checkWarning(response.warning)))) {
            if(this.cardId) {
              if(this.cardId == response.id && this.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "") == response.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                this.flagSuccess == true;
                alert(this.translate.instant('confirm.success'));
                this.dialogRef.close(this.webcamImage.imageAsDataUrl);
              } else if(this.cardId != response.id){
                if (response.id_type == 1){
                  this.flagSuccess == false;
                  this.webcamImage = this.initWebcamImage
                  alert(this.translate.instant('Bạn đang chụp mặt sau CCCD. Vui lòng chụp lại mặt trước của CCCD'));
                } else if( this.data.id == 0 && (this.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "") != response.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
                  this.flagSuccess == false;
                  this.webcamImage = this.initWebcamImage;
                  alert(this.translate.instant('name.not.match'));
                }
              } else if(this.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "") != response.name.toUpperCase().split(" ").join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                this.flagSuccess == false;
                this.webcamImage = this.initWebcamImage;
                alert(this.translate.instant('name.not.match'));
              }else{
                this.flagSuccess == false;
                this.webcamImage = this.initWebcamImage;
                alert(this.translate.instant('invalid.infor'));
              }
            } else if (this.data.id == 1 && response.result_code == 200 && !isNaN(response.id)) {
              this.flagSuccess == false;
              this.webcamImage = this.initWebcamImage
              alert(this.translate.instant('error.recognition.back.cccd'));
            } else {
              alert(this.translate.instant('confirm.success'));
              this.dialogRef.close(this.webcamImage.imageAsDataUrl);
            }  
          } else if (this.data.id == 1 && response.result_code == 403) {
            this.flagSuccess == false;
            this.webcamImage = this.initWebcamImage;
            alert(this.translate.instant('Giấy tờ không hợp lệ. Vui lòng chụp lại mặt sau của CCCD'))
          } else if (this.data.id == 0 && response.result_code == 403) {
            this.flagSuccess == false;
            this.webcamImage = this.initWebcamImage;
            alert(this.translate.instant('Giấy tờ không hợp lệ. Vui lòng chụp lại mặt trước của CCCD'))
          } else {
            this.flagSuccess = false;
            this.webcamImage = this.initWebcamImage;
            
            if(response.warning_msg?.length > 0)
              alert(this.translate.instant('confirm.fail')+ response.warning_msg[0]);
            else if(response.reason_for_action?.length > 0)
              alert(this.translate.instant('image.not.clear'));
            else
              alert(this.translate.instant('confirm.fail'));
          }
         
        }, (error: any) => {
          alert(this.translate.instant('card.id.fail'));
        })
      } else {
        let formData = {
          "name": "image_ekyc_web_face" + new Date().getTime() + ".jpg",
          "content":this.webcamImage.imageAsDataUrl,
          "organizationId": this.organizationId,
          signType: 'eKYC',
          ocrResponseName: this.name
        }
  
        //up file anh len db
        this.upFileImageToDb(formData);
  
        this.contractService.detectFace(this.data.cccdFront, this.webcamImage.imageAsDataUrl,this.data.contractId, this.data.recipientId,img,this.deviceSerce).subscribe(async (response) => {
          this.spinner.hide();
          if(response.verify_result == 2 && response.face_anti_spoof_status.status == 'REAL') {
            alert(this.translate.instant('confirm.success'));

            //call api trừ ekyc
            await this.contractService.decreaseNumberOfEkyc(this.organizationId).toPromise();

            this.dialogRef.close(response.verify_result);
          } else {
            if(response.face_anti_spoof_status.status == 'FAKE') {
              alert(this.translate.instant('face.fail'));
            } else if(response.message.error_message && response.message.error_message != 'undefined') {
              alert(response.message.error_message);
            } else {
              alert(this.translate.instant('confirm.fail'))
            }

            this.flagSuccess = false;
            this.webcamImage = this.initWebcamImage; 
          }
        }, (error: any) => {
          alert(this.translate.instant('confirm.fail'))
        })
      }
  
    })
  }

  checkWarning(warning: any) {
    if(warning.length > 0) {
      for (let i = 0; i < warning.length; i++) {
        if (warning[i].includes("giay_to_co_do_phan_giai_thap")) {
          return true;
        }
        if (warning[i].includes("giay_to_bi_mo")) {
          return true;
        }
        if (warning[i].includes("giay_to_bi_choi_sang")) {
          return true;
        }
      }
    }
  
    return false;
  }

  upFileImageToDb(formData: any) {
     //up file anh len db
     this.contractService.uploadFileImageBase64Signature(formData).subscribe((responseImage) => {
      if(responseImage.success == true) {
        let body = {
          "name":responseImage.file_object.filename,
          "type": 7,
          "path":responseImage.file_object.file_path,
          "filename":responseImage.file_object.filename,
          "bucket": responseImage.file_object.bucket,
          "internal": 1,
          "ordering": 1,
          "status": 1,
          "contract_id": this.data.contractId,
        }

        this.contractService.addDocumentEkyc(body).subscribe((response) => {
          if(!response.id) {
            this.toastService.showErrorHTMLWithTimeout('push.image.fail','',3000);
            return;
          }
        })

      } else {
        this.toastService.showErrorHTMLWithTimeout('push.image.fail',"",3000);
        return;
      }
    })

  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

}
