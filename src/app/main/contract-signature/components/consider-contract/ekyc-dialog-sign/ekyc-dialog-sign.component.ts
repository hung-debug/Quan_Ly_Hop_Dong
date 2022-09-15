import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ContractService } from 'src/app/service/contract.service';

@Component({
  selector: 'app-ekyc-dialog-sign',
  templateUrl: './ekyc-dialog-sign.component.html',
  styleUrls: ['./ekyc-dialog-sign.component.scss']
})
export class EkycDialogSignComponent implements OnInit {

  personEkyc: any;

  constructor(
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<EkycDialogSignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
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
  public ngOnInit(): void {

    console.log("data ", this.data);
    this.initWebcamImage = this.webcamImage;

    if(this.data.title) {
      this.title = 0;
    } else {
      this.title = 1;
      this.data.title = 'Nhận dạng khuôn mặt';
    }

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  cardId: any;
  public triggerSnapshot(): void {
    this.trigger.next();

    console.log(this.webcamImage.imageAsDataUrl);

    this.spinner.show();

    this.contractService.getDetermineCoordination(this.data.recipientId).subscribe((response) => {
      this.cardId = response.recipients[0].card_id;
    })

    if(this.title == 0) {
      this.contractService.detectCCCD(this.webcamImage.imageAsDataUrl).subscribe((response) => {
        this.spinner.hide();
        console.log("response ",response);
        if(response.result_code == 200 && response.action == 'pass') {
          if(this.cardId) {
            if(this.cardId == response.id) {
              this.flagSuccess == true;
              alert("Xác thực thành công");
              this.dialogRef.close(this.webcamImage.imageAsDataUrl);
            } else {
              this.flagSuccess == false;
              this.webcamImage = this.initWebcamImage;
              alert("Mã CMT/CCCD không trùng khớp")
            }
          } else {
            alert("Xác thực thành công");
            this.dialogRef.close(this.webcamImage.imageAsDataUrl);
          }
           
        } else {
          this.flagSuccess = false;
          this.webcamImage = this.initWebcamImage;
          if(response.action == 'manualReview' && response.warning_msg[0].length > 0) {
            alert(response.warning_msg[0]);
          } else {
            alert("Xác thực thất bại");
          }      
        }
       
      })
    } else {
      this.contractService.detectFace(this.data, this.webcamImage.imageAsDataUrl).subscribe((response) => {
        this.spinner.hide();
        if(response.verify_result == 2) {
          alert("Nhận dạng thành công");
          this.dialogRef.close(response.verify_result);
        } else {
          if(response.message.error_message && response.message.error_message != 'undefined') {
            alert(response.message.error_message);
          } else {
            alert("Nhận dạng thất bại")
          }
        }
      })
    }


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
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

}
