import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { result } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ContractService } from 'src/app/service/contract.service';
import { ToastService } from 'src/app/service/toast.service';

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
    private toastService: ToastService,
    private activeRoute: ActivatedRoute,
  ) {

  }

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 576},
    // height: {ideal: 750}
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
  public ngOnInit(): void {

    this.initWebcamImage = this.webcamImage;

    //title = 0: nhan dang anh can cuoc cong dan
    //title = 1: nhan dang khuon mat
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
  name:any;
  public async triggerSnapshot(): Promise<void> {
    this.trigger.next();

    this.spinner.show();

    if(this.data.recipientId) {
      const determineCoordination = await this.contractService.getDetermineCoordination(this.data.recipientId).toPromise();

      this.cardId = determineCoordination.recipients[0].card_id;
      this.name = determineCoordination.recipients[0].name;
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
  
        this.contractService.detectCCCD(this.webcamImage.imageAsDataUrl).subscribe((response) => {
          this.spinner.hide();
          if(response.result_code == 200 && response.action == 'pass') {
            if(this.cardId) {
              if(this.cardId == response.id && this.name.toUpperCase().split(" ").join("") == response.name.toUpperCase().split(" ").join("")) {
                this.flagSuccess == true;
                alert("Xác thực thành công");
                this.dialogRef.close(this.webcamImage.imageAsDataUrl);
              } else if(this.cardId != response.id){
                this.flagSuccess == false;
                this.webcamImage = this.initWebcamImage;
                alert("Mã CMT/CCCD không trùng khớp");
              } else if(this.name.toUpperCase().split(" ").join("") != response.name.toUpperCase().split(" ").join("")){
                this.flagSuccess == false;
                this.webcamImage = this.initWebcamImage;
                alert("Họ tên trên CMT/CCCD không trùng khớp với tên người ký");
              }else{
                this.flagSuccess == false;
                alert("Thông tin không hợp lệ");
              }
            } else {
              alert("Xác thực thành công");
              this.dialogRef.close(this.webcamImage.imageAsDataUrl);
            }
             
          } else {
            this.flagSuccess = false;
            this.webcamImage = this.initWebcamImage; 
            alert("Xác thực thất bại "+ response.warning_msg[0]);
          }
         
        }, (error: any) => {
          alert("Nhận dạng căn cước công dân mặt sau lỗi");
        })
      } else {
  
        let formData = {
          "name": "image_ekyc_web_face" + new Date().getTime() + ".jpg",
          "content":this.webcamImage.imageAsDataUrl,
          "organizationId": this.organizationId,
        }
  
        //up file anh len db
        this.upFileImageToDb(formData);
  
        this.contractService.detectFace(this.data.cccdFront, this.webcamImage.imageAsDataUrl).subscribe((response) => {
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

            this.flagSuccess = false;
            this.webcamImage = this.initWebcamImage; 
          }
        }, (error: any) => {
          alert("Nhận dạng căn cước công dân mặt sau lỗi");
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
            this.toastService.showErrorHTMLWithTimeout("Đẩy file ảnh không thành công","",3000);
            return;
          }
        })

      } else {
        this.toastService.showErrorHTMLWithTimeout("Đẩy file ảnh không thành công","",3000);
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