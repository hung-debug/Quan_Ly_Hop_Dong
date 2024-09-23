import { ToastService } from './../../service/toast.service';
import {Component, Input, OnInit, Output} from '@angular/core';
import {AppService} from 'src/app/service/app.service';
import {Chart} from 'angular-highcharts';
import {TranslateService} from '@ngx-translate/core';
import {ContractService} from 'src/app/service/contract.service';
import {DashboardService} from 'src/app/service/dashboard.service';
import {UserService} from 'src/app/service/user.service';
import {Router} from '@angular/router';
import {UnitService} from 'src/app/service/unit.service';
import {DatePipe} from '@angular/common';
import { RoleService } from 'src/app/service/role.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AccountLinkDialogComponent } from '../dialog/account-link-dialog/account-link-dialog.component';
import { ContractSignatureService } from 'src/app/service/contract-signature.service';
import { sideList } from 'src/app/config/variable';
import { DeleteContractDialogComponent } from './../contract/dialog/delete-contract-dialog/delete-contract-dialog.component';
import { variable } from '../../../app/config/variable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../main.component.scss']
})
export class DashboardComponent implements OnInit {

  translations: any;
  chartCreated: any;
  chartPieCreated: any;
  chartReceived: any;

  menuDashboard: string;
  chartContractCreated: string;
  chartContractReceived: string
  totalCreate: any = 0;

  //filter
  date: any = "";
  filter_from_date: any = "";
  filter_to_date: any = "";
  chartHeight: number = 450;

  user: any;
  numberWaitProcess: any = 0;
  numberExpire: any = 0;
  numberComplete: any = 0;
  numberWaitComplete: any = 0;
  numContractUse: number = 0;
  numContractBuy: number = 0;

  isOrg: string = 'off';
  stateOptions: any[];

  listNotification: any[] = [];
  contractConnectList: any[] = [];
  contractRequestList: any[] = [];
  contractRecipienteList: any[] = [];
  orgList: any[] = [];
  orgListTmp: any[] = [];
  organization_id: any = "";
  contract_signatures: any = 'c';
  signatures: any = 's9';

  consider: any = 'c9';
  secretary: any = 's8';
  coordinates: any = 'c8';

  selectedNodeOrganization: any;
  isQLHD_03: boolean | undefined;
  isQLHD_04: boolean | undefined;
  currentDate: Date;
  daysRemaining: number;
  formattedEndDate: string;
  message: string;
  messageExpired: string;
  endLicense: any;
  countNoti: any = 0;
  notiExpried: any;
  isSoonExp: boolean = false;
  isExp: boolean = false;
  isEkycExp: boolean = false;
  isSmsExp: boolean = false;
  isCecaExp: boolean = false;
  isContractExp: boolean = false;
  OrgId: any;
  enviroment: any = "";
  site: string;
  currentName: any;
  loadData1: boolean = false;
  loadData2: boolean = false;
  step: any;
  endDateService: any;
  //type = 1 => Hop dong don le khong theo mau
  //type = 2 => Hop dong don le theo mau
  //type = 3 => Hop dong theo lo
  type: number = 1;
  stepForm: any;
  stepBatch: any;
  datas: any = {
    stepLast: variable.stepSampleContract.step1,
    save_draft: {
      infor_contract: false,
      determine_signer: false,
      sample_contract: false,
      confirm_infor_contract: false,
    },
    flagDigitalSign: false,
    isUploadNewFile: false,
    countUploadContractFile : 0,
  };

  datasForm: any = {
    stepFormLast: variable.stepSampleContractForm.step1,
    save_draft_form: {
      'infor-contract-form': false,
      'party-contract-form': false,
      'sample-contract-form': false,
      'confirm-contract-form': false,
    },
  };

  datasBatch: any = {
    stepBatchLast: variable.stepSampleContractBatch.step1,
    save_draft_batch: {
      'infor-contract-batch': false,
      'confirm-contract-batch': false,
    },
  };

  constructor(
    private appService: AppService,
    private dashboardService: DashboardService,
    public translate: TranslateService,
    private userService: UserService,
    private unitService: UnitService,
    private router: Router,
    public datepipe: DatePipe,
    private toastService: ToastService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private contractService : ContractService,
    private contractSignature: ContractSignatureService,
    private contractServiceV1: ContractService,
    public isContractService: ContractService,
  ) {
    this.stateOptions = [
      {label: "my.contract", value: 'off'},
      {label: "org.contract", value: 'on'},
    ];
    // Tính toán ngày kết thúc (hiện tại)
    let endDate = new Date();
    // Tính toán ngày bắt đầu (7 ngày trước ngày kết thúc)
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    // Gán giá trị mặc định cho biến date

    this.date = [startDate, endDate];
  }

  lang: any;
  ngOnInit(): void {

    this.enviroment = environment;
    if (environment.flag == 'NB') {
      this.site = 'NB';
    } else if (environment.flag == 'KD') {
      this.site = 'KD';
    }

    this.appService.setTitle("menu.dashboard");
    this.appService.setSubTitle("");
    this.search();
    let count = localStorage.getItem('countNoti')
    let userId = this.userService.getAuthCurrentUser().id;
    this.userService.getUserById(userId).subscribe(
      data => {
        this.currentName = data.name       
        //lay id role
        if (environment.flag == 'KD' && !data.is_required_sso && environment.usedSSO) {
          this.openAccountLinkDialog(data)
        }
        this.roleService.getRoleById(data?.role_id).subscribe(
          data => {
            let listRole: any[];
            listRole = data.permissions;
            this.isQLHD_03 = listRole.some(element => element.code == 'QLHD_03');
            this.isQLHD_04 = listRole.some(element => element.code == 'QLHD_04');
        }, error => {
        });
        this.OrgId = data.organization.id;
        this.userService.getOrgIdChildren(this.OrgId).subscribe(dataOrg => {
                   
          this.endDateService = dataOrg.endLicense
          let countNotiWarning: number = localStorage.getItem('countNoti') as any
          countNotiWarning++;
          localStorage.setItem("countNoti",countNotiWarning.toString())
          if(count == '0'){
            countNotiWarning++;
            localStorage.setItem("countNoti",countNotiWarning.toString())
            this.currentDate = new Date();
            this.endLicense = new Date(dataOrg.endLicense);
            this.daysRemaining = Math.floor((new Date(this.endLicense).getTime() - this.currentDate.getTime()) / (1000 * 60 * 60 * 24));
            // this.daysRemaining = Math.abs(this.daysRemaining)
            this.validateExpDateAndPackageNumber(dataOrg.numberOfEkyc, dataOrg.numberOfSms, dataOrg.numberOfContractsCanCreate, dataOrg.numberOfCeca, this.daysRemaining, this.currentDate, this.endLicense)

          }
        })

    }, error => {}
    )
    console.log("this.endDateService",this.endDateService);
    
    this.user = this.userService.getInforUser();

    if(localStorage.getItem('lang') == 'vi') {
      this.lang = 'vi';
    } else if(localStorage.getItem('lang') == 'en') {
      this.lang = 'en';
    }

    this.unitService.getUnitList('', '').subscribe(data => {
      if(localStorage.getItem('lang') == 'vi')
        this.orgListTmp.push({name: "Tất cả", id: ""});
      else if(localStorage.getItem('lang') == 'en')
        this.orgListTmp.push({name: "All", id: ""});

      //sap xep theo path de cho to chuc cha len tren
      let dataUnit = data.entities.sort((a: any, b: any) => a.path.toString().localeCompare(b.path.toString()));
      for (var i = 0; i < dataUnit.length; i++) {
        this.orgListTmp.push(dataUnit[i]);
      }

      this.unitService.getNumberContractUseOriganzation(this.userService.getInforUser().organization_id).toPromise().then(
        data => {
          this.search()
          this.numContractUse = data.contract;
          this.loadData1 = true;
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã dùng', "", 3000);
        }
      )

      //lay so luong hop dong da mua
      this.unitService.getNumberContractBuyOriganzation(this.userService.getInforUser().organization_id).toPromise().then(
        data => {
          this.numContractBuy = data.contract;
          this.loadData2 = true;
          this.search()
        }, error => {
          this.toastService.showErrorHTMLWithTimeout('Lỗi lấy số lượng hợp đồng đã mua', "", 3000);
        }
      )

      this.orgList = this.orgListTmp;
      this.convertData();
      this.getDataPieChart();
    });
  }

  getNotiMessage(isSoonExp: boolean, isExp: boolean, isEkycExp: boolean, isSmsExp: boolean, isCecaExp: boolean, isContractExp: boolean){
    let messageSoonExp = ""
    let messageExp = ""
    let messageEkycExp = ""
    let messageCecaExp = ""
    let messageSmsExp = ""
    let messageContractExp = ""
    let numberExpMessage = ""
    let numberExpArr = []
    if (isSoonExp){
      messageSoonExp = `Thời gian sử dụng dịch vụ sẽ hết hạn vào ngày ${moment(this.endLicense).format("DD/MM/YYYY")},
      Quý khách vui lòng đóng phí duy trì dịch vụ hàng năm để tiếp tục sử dụng sau ngày ${moment(this.endLicense).format("DD/MM/YYYY")}. Trân trọng cảm ơn!`
    }
    if (isExp){
      messageExp = `Thời gian sử dụng dịch vụ đã hết.
      Quý khách vui lòng đóng phí duy trì dịch vụ hàng năm để tiếp tục sử dụng sau ngày ${moment(this.endLicense).format("DD/MM/YYYY")}. Trân trọng cảm ơn!`
    }
    if (isContractExp){
      messageContractExp = "Hợp đồng"
      numberExpArr.push(messageContractExp)
    }
    if (isEkycExp){
      messageEkycExp = "eKYC"
      numberExpArr.push(messageEkycExp)
    }
    if (isSmsExp){
      messageSmsExp = "SMS"
      numberExpArr.push(messageSmsExp)
    }
    if (isCecaExp){
      messageCecaExp = "Xác thực CeCA"
      numberExpArr.push(messageCecaExp)
    }

    numberExpMessage = (isEkycExp || isSmsExp || isCecaExp || isContractExp) ? "Số lượng " + numberExpArr.toString().replaceAll(",","/") + " sắp hết.<br>": ""
    return this.toastService.showWarningHTMLWithTimeout(numberExpMessage + (messageSoonExp ? messageSoonExp :  messageExp),"",9000)
  }

  validateExpDateAndPackageNumber(numberOfEkyc: any, numberOfSms: any, numberOfContractsCanCreate: any, numberOfCeca: any, daysRemaining: any, currentDate: any, endLicense: any){
    if(environment.flag == 'KD'){
      if (daysRemaining < 60 && daysRemaining > 0){
        this.isSoonExp = true
      }
      if (new Date(currentDate) > new Date(endLicense)){
        this.isExp = true
      }
      if (numberOfEkyc < 30 && numberOfEkyc > 0){
        this.isEkycExp = true
      }
      if (numberOfSms < 30 && numberOfSms > 0) {
        this.isSmsExp = true
      }
      if (numberOfContractsCanCreate < 30 && numberOfContractsCanCreate > 0) {
        this.isContractExp = true
      }
      if (numberOfCeca < 30 && numberOfCeca > 0) {
        this.isCecaExp = true
      }
      this.getNotiMessage(this.isSoonExp, this.isExp, this.isEkycExp, this.isSmsExp, this.isCecaExp, this.isContractExp)
    }
  }

  array_empty: any = [];
  list: any[];
  convertData(){
    this.array_empty=[];
    this.orgList.forEach((element: any, index: number) => {

      let is_edit = false;
      let dataChildren = this.findChildren(element);
      let data:any="";
      data = {
        label: element.name,
        data: element.id,
        expanded: true,
        children: dataChildren
      };

      this.array_empty.push(data);
      //this.removeElementFromStringArray(element.id);
    })
    this.list = this.array_empty
  }

  findChildren(element:any){
    let dataChildren:any[]=[];
    let arrCon = this.orgList.filter((p: any) => p.parent_id == element.id);

    arrCon.forEach((elementCon: any, indexCOn: number) => {
      let is_edit = false;

      dataChildren.push(
      {
        label: elementCon.name,
        data: elementCon.id,
        expanded: false,
        children: this.findChildren(elementCon)
      });
      this.removeElementFromStringArray(elementCon.id);
    })
    return dataChildren;
  }

  removeElementFromStringArray(element: string) {
    this.orgList.forEach((value,index)=>{
        if(value.id==element){
          this.orgList.splice(index,1);
        }

    });
  }

  openLink(link: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([link]);
    });
  }


  detailContract(id: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/form-contract/detail/' + id]);
    });
  }
  
  processContract(item: any){
    if(item.participant.contract.status == 20 && item.role == 3 && item.status == 1){
      this.contractServiceV1.getStatusSignImageOtp(item.id).subscribe(
        (data) => {       
          if (!data.locked) {
            this.router.navigate(
              [
                'main/' +
                this.contract_signatures +
                '/' +
                this.signatures +
                '/' +
                item.participant.contract.id,
              ],
              {
                queryParams: {
                  recipientId: item.id,
                },
              }
            );
          } else {
            this.toastService.showErrorHTMLWithTimeout(
              'Bạn đã nhập sai OTP 5 lần liên tiếp.<br>Quay lại sau ' +
              this.datepipe.transform(data.nextAttempt, 'dd/MM/yyyy HH:mm'),
              '',
              3000
            );
          }
        },
        (error) => {
          this.toastService.showErrorHTMLWithTimeout('Có lỗi', '', 3000);
        }
      );
    } else if(item.participant.contract.status == 20 && item.role == 4 && item.status == 1){
      this.router.navigate(['main/c/s8/' + item.participant.contract.id], {
        queryParams: {
          recipientId: item.id,
        },
      });
    } else if(item.participant.contract.status == 20 && item.role == 1 && item.status == 1){
      this.isContractService.getListDataCoordination(item.participant.contract.id).subscribe(
        (res: any) => {
          if (res) {
            if (localStorage.getItem('data_coordinates_contract_id')) {
              localStorage.removeItem('data_coordinates_contract_id');
            }
            localStorage.setItem(
              'data_coordinates_contract_id',
              JSON.stringify({ data_coordinates_id: res.id })
            );
  
            this.router.navigate(
              ['main/c/' + this.coordinates + '/' + item.participant.contract.id],
              {
              }
            );
          }
        },
        (res: any) => {
          alert('Vui lòng liên hệ đội hỗ trợ để được xử lý!');
        }
      );
    } else if(item.participant.contract.status == 20 && item.role == 2 && item.status == 1) {
      this.router.navigate(['main/c/c9/' + item.participant.contract.id], {
        queryParams: { 
          recipientId: item.id 
        },
      });
    }
  }

  openLinkNotification(link: any, id: any) {
    window.location.href = link.replace('&type=1', '').replace('&type=', '').replace('?id','?recipientId').replace('contract-signature','c').replace('signatures','s9').replace('consider','c9').replace('secretary','s8').replace('coordinates','c8');

    this.dashboardService.updateViewNotification(id).subscribe(data => {
    });
  }

  searchCountCreate() {
    if (this.date != "" && this.date[0] != 0) {
      this.date.forEach((key: any, v: any) => {
        if (v == 0 && key) {
          this.filter_from_date = this.datepipe.transform(key, 'yyyy-MM-dd');
        } else if (v == 1 && key) {
          this.filter_to_date = this.datepipe.transform(key, 'yyyy-MM-dd');
        }
      });
    }
    this.organization_id = this.selectedNodeOrganization?this.selectedNodeOrganization.data:"";
    this.dashboardService.countContractCreate(this.isOrg, this.organization_id, this.filter_from_date, this.filter_to_date).subscribe(data => {
      let newData = Object.assign( {}, data)

      newData.isOrg = this.isOrg;
      newData.organization_id = this.organization_id;
      newData.from_date = this.filter_from_date;
      newData.to_date = this.filter_to_date;

      this.totalCreate = newData.total_process + newData.total_signed + newData.total_reject + newData.total_cancel + newData.total_expires;

      let numContractHeight = document.getElementById('num-contract')?.offsetHeight || 0;
      let numContractBodyHeight = document.getElementById('num-contract-body')?.offsetHeight || 0;
      let notiHeight = document.getElementById('noti')?.offsetHeight || 450;

      this.chartHeight = numContractHeight + notiHeight + numContractBodyHeight - 37;

      if(localStorage.getItem('lang') == 'vi' || sessionStorage.getItem('lang') == 'vi')
        this.createChart("Đang xử lý","Hoàn thành","Từ chối","Huỷ bỏ", "Quá hạn", "Số lượng", newData);
      else if(localStorage.getItem('lang') == 'en' || sessionStorage.getItem('lang') == 'en')
        this.createChart("Processing","Complete","Reject","Cancel","Out of date", "Number", newData);

      if (this.loadData1 &&  this.loadData2) {
        this.createPieChart(this.numContractUse, this.numContractBuy - this.numContractUse)
      }
    });
  }

  createChart(arg0: string, arg1: string, arg2: string, arg3: string, arg4: string,so_luong: string, data: any) {
    this.chartCreated = new Chart({
      colors: ['#639AED', '#FAC485', '#F56B6E', '#50E0AC', '#8B8B8B'],
      chart: {
        type: 'column',
        style: {
          fontFamily: 'inherit',
        },
        height: 350
      },
      title: {
        text: this.chartContractCreated,
        style: {
          fontSize: '16px',
          fontWeight: '500',
        },
        verticalAlign: 'bottom',
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: [
          arg0, arg1, arg2, arg3, arg4
        ],
        labels: {
          style: {
            fontSize: '13px'
          },
          formatter: function () {
            var link = "";

            if (this.value == arg0) {
              link = "/main/contract/create/processing"
            } else if (this.value == arg1) {
              link = "/main/contract/create/complete"
            } else if (this.value == arg2) {
              link = "/main/contract/create/fail"
            } else if (this.value == arg3) {
              link = "/main/contract/create/cancel"
            } else if (this.value == arg4) {
              link = "/main/contract/create/overdue"
            }
            link = link + "?isOrg=" + data.isOrg + "&organization_id=" + data.organization_id + "&filter_from_date=" + data.from_date + "&filter_to_date=" + data.to_date;
            return '<a style="cursor: pointer; color: #00186D; text-decoration: none"; href="' + link + '">' + this.value + '</a>';
          },
          useHTML: true
        }
      },
      yAxis: [{
        title: {
          text: so_luong
        },
        allowDecimals: false,
      }],

      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          },
        },
        column: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                var link = "";
                if (this.x == 0) {
                  link = "/main/contract/create/processing"
                } else if (this.x == 1) {
                  link = "/main/contract/create/complete"
                } else if (this.x == 2) {
                  link = "/main/contract/create/fail"
                } else if (this.x == 3) {
                  link = "/main/contract/create/cancel"
                } else if (this.x == 4) {
                  link = "/main/contract/create/overdue"
                }
                window.location.href = link + "?isOrg=" + data.isOrg + "&organization_id=" + data.organization_id + "&filter_from_date=" + data.from_date + "&filter_to_date=" + data.to_date;
              }
            }
          },
        }
      },


      series: [
        {
          type: 'column',
          colorByPoint: true,
          name: this.translate.instant('contract.number'),
          data: [
            [this.translate.instant('sys.processing'), data.total_process],
            [this.translate.instant('contract.status.complete'), data.total_signed],
            [this.translate.instant('contract.status.fail'), data.total_reject],
            [this.translate.instant('contract.status.cancel'), data.total_cancel],
            [this.translate.instant('contract.status.overdue'), data.total_expires]
          ]
        }]
    });
  }

  getDataPieChart(){

    let numContractHeight = document.getElementById('num-contract')?.offsetHeight || 0;
    let numContractBodyHeight = document.getElementById('num-contract-body')?.offsetHeight || 0;
    let notiHeight = document.getElementById('noti')?.offsetHeight || 450;
    this.chartHeight = numContractHeight + notiHeight + numContractBodyHeight - 37;
    let numContractUnUsed = this.numContractBuy - this.numContractUse;

  }


  createPieChart(numContractUse: any, numContractUnUsed: any) {
    this.chartPieCreated = new Chart({
      colors: ['#4495F5','#CED3FF'],
      chart: {
        type: 'pie',
        style: {
          fontFamily: 'Roboto'
        },
        height: 350,
        events: {
          render: function (this: any) {
            const chart = this;
            const textX = chart.plotLeft + (chart.series[0].center[0]);
            const textY = chart.plotTop + (chart.series[0].center[1]);

            // Check if centerText exists, remove if it does
            if (chart.centerText) {
              chart.centerText.destroy();
            }

            chart.centerText = chart.renderer.text(numContractUse, textX, textY)
              .css({
                fill: '#001A4D',
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'ROBOTO',
              })
              .add();

            chart.centerText.attr({
              x: textX - chart.centerText.getBBox().width / 2,
            });

            const numberContract = numContractUse + numContractUnUsed;
            const secondTextY = textY + 30;

            // Check if numContract exists, remove if it does
            if (chart.numContract) {
              chart.numContract.destroy();
            }

            chart.numContract = chart.renderer.text('TỔNG: ' + numberContract, textX, secondTextY)
              .css({
                fill: '#001A4D',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'ROBOTO',
              })
              .add();

            chart.numContract.attr({
              x: textX - chart.numContract.getBBox().width / 2,
            });
          }
        }
      },
      title: {
        text: this.chartContractCreated,
        style: {
          fontSize: '16px',
          fontWeight: '500',
        },
        verticalAlign: 'bottom',
      },
      credits: {
        enabled: false
      },
      legend: {
          enabled: false
      },
      series: [
        {
          type: 'pie',
          innerSize: '75%',
          name: this.translate.instant('contract.number'),
          data: [
            [this.translate.instant('package.used'), numContractUse],
            [this.translate.instant('package.unused'), numContractUnUsed],
          ]
        }
      ]
    });
  }

  getNumberContractBoxHeight(){
    let chartHeight = document.getElementById('chart-column')?.offsetHeight || 0;
    let numContractBodyHeight = document.getElementById('num-contract-body')?.offsetHeight || 450;
    let numContractHeight = document.getElementById('num-contract')?.offsetHeight || 0;
    let notiHeight = chartHeight - numContractBodyHeight - numContractHeight;

    return {
      'height': notiHeight + 'px',
      'overflow': 'auto'
    };
  }
  sortParticipant(list: any) {
    // return list.sort((beforeItem: any, afterItem: any) => beforeItem.type - afterItem.type);
    return list;
  }

  getNameOrganization(item: any, index: any) {
    // if(item.type == 3 && item.recipients.length > 0)
    //   return sideList[index].name + " : " + item.recipients[0].name;
    return sideList[index].name + " : " + item.name;
  }

  search() {
    this.searchCountCreate();

    this.dashboardService.countContractReceived("", "").subscribe(data => {

      this.numberWaitProcess = data.processing;
      this.numberComplete = data.processed;
      this.numberExpire = data.prepare_expires;
      this.numberWaitComplete = data.waiting;
    });

    this.dashboardService.getNotification('', '', '', 5, '').subscribe(data => {
      this.listNotification = data.entities;
    });

    this.dashboardService.getNotification(0, '', '', 1, '').subscribe(data => {


    });
    this.contractService.getContractList('off','','','','','','',0,'',1,'','','').subscribe(data => {
      this.contractConnectList = data.entities;
    })
    this.contractSignature.getContractMyProcessList('','','','','',1,'',4,'','','').subscribe(data => {
      this.contractRequestList = data.entities;  
      this.contractRecipienteList.forEach((item: any) => {

      })

    })
  }
  
  clickOpenDraft(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/main/contract/create/draft']);
    });
  }
  
  clickAddContract(type: number){
    if (type === 1) {
      this.router.navigate([
        '/main/form-contract/add',
      ]);
    } else if (type === 2) {
      this.router.navigate([
        '/main/form-contract/add-form',
      ]);
    } else if (type === 3) {
      this.router.navigate([
        '/main/form-contract/add-batch'
      ]);
    }
  }

  openEdit(id: number) {
    setTimeout(() => {
      void this.router.navigate(['main/form-contract/edit/' + id]);
    }, 100)
  }

  deleteContract(id: any) {
    let data: any = "";

    if (sessionStorage.getItem('lang') == 'vi' || !sessionStorage.getItem('lang')) {
      data = {
        title: 'XÁC NHẬN XÓA HỢP ĐỒNG',
        id: id
      };
    } else if (sessionStorage.getItem('lang') == 'en') {
      data = {
        title: 'CONTRACT DELETE CONFIRMATION',
        id: id
      };
    }

    // @ts-ignore
    const dialogRef = this.dialog.open(DeleteContractDialogComponent, {
      width: '480px',
      backdrop: 'static',
      keyboard: false,
      data,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      let is_data = result
    })
  }

  openAccountLinkDialog(userData: any) {
    // @ts-ignore
    const dialogRef: any = this.dialog.open(AccountLinkDialogComponent, {
      width: '498px',
    // @ts-ignore
      backdrop: 'static',
      data: userData,
      disableClose: true,
      autoFocus: false
    })
  }

  addCenterText() {
    const series = this.chartPieCreated.series[0];
    const centerX = series.center[0];
    const centerY = series.center[1];

    this.chartPieCreated.renderer.text('Center Text', centerX, centerY)
      .css({
        color: '#000', // Change color as needed
        fontSize: '16px' // Change font size as needed
      })
      .attr({
        zIndex: 5
      })
      .add();
  }

  changeType(e: any) {
    if (this.type == 1) {
      this.step = variable.stepSampleContract.step1;
      this.appService.setSubTitle("add.contract.one.not.template");
    } else if (this.type == 2) {
      this.stepForm = variable.stepSampleContractForm.step1;
      this.appService.setSubTitle("add.contract.one.template");
    } else if (this.type == 3) {
      this.stepBatch = variable.stepSampleContractBatch.step1;
      this.appService.setSubTitle("role.contract-template.create-batch");
    }
    if (this.type == 1) {
      this.datas = {
        stepLast: variable.stepSampleContract.step1,
        save_draft: {
          infor_contract: false,
          determine_signer: false,
          sample_contract: false,
          confirm_infor_contract: false,
        },
      };
    } else if (this.type == 2) {
      this.datasForm = {
        stepFormLast: variable.stepSampleContractForm.step1,
        save_draft_form: {
          'infor-contract-form': false,
          'party-contract-form': false,
          'sample-contract-form': false,
          'confirm-contract-form': false,
        },
      };
    }
  }
}
