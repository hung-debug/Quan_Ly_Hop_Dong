import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { result } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ekyc-dialog-sign',
  templateUrl: './ekyc-dialog-sign.component.html',
  styleUrls: ['./ekyc-dialog-sign.component.scss']
})
export class EkycDialogSignComponent implements OnInit {
  @Input() datas: any;
  personEkyc: any;

  constructor(
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<EkycDialogSignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    private translate: TranslateService,
    private router: Router,
  ) {

  }

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {exact: 480},
    // height: {exact: 640},
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

    this.spinner.show();

    if(this.data.recipientId) {
      const determineCoordination = await this.contractService.getDetermineCoordination(this.data.recipientId).toPromise();
      this.cardId = determineCoordination.recipients[0].card_id;
      this.name = determineCoordination.recipients[0].name;
      
      let ArrRecipientsNew = false

    }
 

    this.contractService.getDataCoordination(this.data.contractId).subscribe(async (response) => {
      this.organizationId =  response.organization_id;

      if(this.title == 0) {
        let formData = {
          "name": "image_ekyc_web_cardId" + new Date().getTime() + ".jpg",
          "content":this.webcamImage.imageAsDataUrl,
          "organizationId": this.organizationId,
        }
  
        this.upFileImageToDb(formData);
  
        this.contractService.detectCCCD(this.webcamImage.imageAsDataUrl, this.data.contractId, this.data.recipientId).subscribe((response) => {
          this.spinner.hide();
          if(response.result_code == 200 && response.action == 'pass') {
            if(this.cardId) {
              if(this.cardId == response.id && this.name.toUpperCase().split(" ").join("") == response.name.toUpperCase().split(" ").join("")) {
                this.flagSuccess == true;
                alert(this.translate.instant('confirm.success'));
                this.dialogRef.close(this.webcamImage.imageAsDataUrl);
              } else if(this.cardId != response.id){
                this.flagSuccess == false;
                this.webcamImage = this.initWebcamImage;
                alert(this.translate.instant('card.id.not.match'));
                // string.replace(/  +/g, ' ');
              } else if(this.name.toUpperCase().split(" ").join("") != response.name.toUpperCase().split(" ").join("")) {
                this.flagSuccess == false;
                this.webcamImage = this.initWebcamImage;
                alert(this.translate.instant('name.not.match'));
              }else{
                this.flagSuccess == false;
                alert(this.translate.instant('invalid.infor'));
              }
            } else {
              alert(this.translate.instant('confirm.success'));
              this.dialogRef.close(this.webcamImage.imageAsDataUrl);
            }
             
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
        if (this.cardId != response.participants[0].recipients[0].card_id) {
          this.toastService.showErrorHTMLWithTimeout('Bạn không có quyền xử lý hợp đồng này!', '', 3000);
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
        let formData = {
          "name": "image_ekyc_web_face" + new Date().getTime() + ".jpg",
          "content":this.webcamImage.imageAsDataUrl,
          "organizationId": this.organizationId,
        }
  
        //up file anh len db
        this.upFileImageToDb(formData);
  
        this.contractService.detectFace(this.data.cccdFront, this.webcamImage.imageAsDataUrl).subscribe((response) => {
          this.spinner.hide();
          if(response.verify_result == 2 && response.face_anti_spoof_status == 'REAL') {
            alert(this.translate.instant('confirm.success'));
            this.dialogRef.close(response.verify_result);
          } else {
            if(response.face_anti_spoof_status == 'FAKE') {
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
    console.info('received webcam image', webcamImage);
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