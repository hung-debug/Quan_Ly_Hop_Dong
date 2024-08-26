import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DashboardService } from 'src/app/service/dashboard.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  //phan quyen
  isQLHD_01: boolean = true; //them moi hop dong don le
  isQLHD_02: boolean = true; //sua hop dong
  isQLHD_03: boolean = true; //xem danh sach hop dong cua toi va to chuc con
  isQLHD_04: boolean = true; //xem danh sach hop dong cua to chuc cua toi
  isQLHD_05: boolean = true; //xem danh sach hop dong cua toi
  isQLHD_06: boolean = true; //tim kiem hop dong
  isQLHD_07: boolean = true; //xem thong tin chi tiet hop dong
  isQLHD_08: boolean = true; //sao chep hop dong
  isQLHD_09: boolean = true; //huy hop dong
  isQLHD_10: boolean = true; //xem lich su hop dong
  isQLHD_11: boolean = true; //tao hop dong lien quan
  isQLHD_12: boolean = true; //xem hop dong lien quan
  isQLHD_13: boolean = true; //chia se hop dong
  isQLHD_14: boolean = true; //tao hop dong don le theo mau
  isQLHD_15: boolean = true; //tao hop dong theo lo

  isQLMHD_01: boolean = true; //them moi mau hop dong
  isQLMHD_02: boolean = true; //sua mau hop dong
  isQLMHD_03: boolean = true; //ngung phat hanh mau hop dong
  isQLMHD_04: boolean = true; //phat hanh mau hop dong
  isQLMHD_05: boolean = true; //chia se mau hop dong
  isQLMHD_06: boolean = true; //tim kiem mau hop dong
  isQLMHD_07: boolean = true; //xoa mau hop dong
  isQLMHD_08: boolean = true; //xem thong tin chi tiet mau hop dong

  isQLTC_01: boolean = true; //them moi to chuc
  isQLTC_02: boolean = true; //sua to chuc
  isQLTC_03: boolean = true; //tim kiem to chuc
  isQLTC_04: boolean = true; //xem thong tin chi tiet to chuc

  isQLND_01: boolean = true; //them moi nguoi dung
  isQLND_02: boolean = true; //sua nguoi dung
  isQLND_03: boolean = true; //tim kiem nguoi dung
  isQLND_04: boolean = true; //xem thong tin chi tiet nguoi dung

  isQLVT_01: boolean = true; //them moi vai tro
  isQLVT_02: boolean = true; //sua vai tro
  isQLVT_03: boolean = true; //xoa vai tro
  isQLVT_04: boolean = true; //tim kiem vai tro
  isQLVT_05: boolean = true; //xem thong tin chi tiet vai tro

  isQLLHD_01: boolean = true; //them moi loai hop dong
  isQLLHD_02: boolean = true; //sua loai hop dong
  isQLLHD_03: boolean = true; //xoa loai hop dong
  isQLLHD_04: boolean = true; //tim kiem loai hop dong
  isQLLHD_05: boolean = true; //xem thong tin chi tiet loai hop dong

  QLDSCTS_01: boolean = true; //them moi chung thu so
  QLDSCTS_02: boolean = true; //sua thong tin chung thu so
  QLDSCTS_03: boolean = true; //xem thong tin chung thu so
  QLDSCTS_04: boolean = true; //tim kiem thong tin


  isBaoCaoChiTiet: boolean = true; // báo cáo chi tiết tài liệu
  isBaoCaoSapHetHieuLuc: boolean = true; // báo cáo tài liệu sắp hết hiệu lực
  isBaoCaoTrangThaiXuLy: boolean = true; // báo cáo tài liệu trạng thái xử lý
  isBaoCaoSoLuongTrangThai: boolean = true; // báo cáo số lượng tài liệu theo trạng thái
  isBaoCaoSoLuongLoai: boolean = true; // báo cáo số lượng tài liệu theo loại
  isBaoCaoHopDongNhan: boolean = true; //báo cáo tài liệu nhận
  isBaoCaoHopDongEcontractMsale: boolean = true; // báo cáo tài liệu số lượng tài liệu eContract-mSale
  isBaoCaoTrangThaiGuiSms: boolean = true; //báo cáo trạng thái gửi Sms
  isBaoCaoTrangThaiGuiEmail: boolean = true; //báo cáo trạng thái gửi Email
  isBaoCaoEKYC: boolean = true; // báo cáo xác thực ekyc

  isConfigSms: boolean = true; //cấu hình sms
  isConfigSoonExpireDay: boolean = true; // cấu hình ngày sắp hết hạn
  isConfigBrandname: boolean = true; // cấu hình brandname
  isConfigMailServer: boolean = true; //cấu hình mail server

  toggled = false;
  _hasBackgroundImage = true;

  subMenus: any = [];

  contract_signatures: any = "c";

  private reloadSidebarSubject = new Subject<void>();

  reloadSidebar$ = this.reloadSidebarSubject.asObservable();

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  toggle() {
    this.toggled = !this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }
  menus: any[] = [];
  getMenuList() {
    this.menus = [];

    if (this.isQLHD_01 || this.isQLHD_14 || this.isQLHD_15) {
      this.menus.push({
        title: 'menu.contract.add',
        active: false,
        type: 'button',
        href: '/main/form-contract/add',
        id: 0,
        isActive: true
      });
    }
    this.menus.push(
      {
        title: 'menu.dashboard',
        icon: '/assets/img/home_icon.svg',
        iconFill: '/assets/img/home_icon_v2.svg',
        iconDefault: '/assets/img/home_icon.svg',
        active: false,
        type: 'simple',
        href: '/main/dashboard',
        id: 1,
        isActive: true
      },
    );

    const currentUserC = JSON.parse(localStorage.getItem('currentUser') || '');

    this.userService.getUserById(currentUserC.customer.info.id).subscribe(
      (data) => {
        this.roleService.getRoleById(data?.role_id).subscribe(
          (data) => {
            let listRole: any[];
            listRole = data.permissions;

            this.isQLHD_01 = listRole.some(
              (element) => element.code == 'QLHD_01'
            );
            this.isQLHD_02 = listRole.some(
              (element) => element.code == 'QLHD_02'
            );
            this.isQLHD_03 = listRole.some(
              (element) => element.code == 'QLHD_03'
            );
            this.isQLHD_04 = listRole.some(
              (element) => element.code == 'QLHD_04'
            );
            this.isQLHD_05 = true;
            this.isQLHD_06 = listRole.some(
              (element) => element.code == 'QLHD_06'
            );
            this.isQLHD_07 = listRole.some(
              (element) => element.code == 'QLHD_07'
            );
            this.isQLHD_08 = listRole.some(
              (element) => element.code == 'QLHD_08'
            );
            this.isQLHD_09 = listRole.some(
              (element) => element.code == 'QLHD_09'
            );
            this.isQLHD_10 = listRole.some(
              (element) => element.code == 'QLHD_10'
            );
            this.isQLHD_11 = listRole.some(
              (element) => element.code == 'QLHD_11'
            );
            this.isQLHD_12 = listRole.some(
              (element) => element.code == 'QLHD_12'
            );
            this.isQLHD_13 = listRole.some(
              (element) => element.code == 'QLHD_13'
            );
            this.isQLHD_14 = listRole.some(
              (element) => element.code == 'QLHD_14'
            );
            this.isQLHD_15 = listRole.some(
              (element) => element.code == 'QLHD_15'
            );

            this.isQLMHD_01 = listRole.some(
              (element) => element.code == 'QLMHD_01'
            );
            this.isQLMHD_02 = listRole.some(
              (element) => element.code == 'QLMHD_02'
            );
            this.isQLMHD_03 = listRole.some(
              (element) => element.code == 'QLMHD_03'
            );
            this.isQLMHD_04 = listRole.some(
              (element) => element.code == 'QLMHD_04'
            );
            this.isQLMHD_05 = listRole.some(
              (element) => element.code == 'QLMHD_05'
            );
            this.isQLMHD_06 = listRole.some(
              (element) => element.code == 'QLMHD_06'
            );
            this.isQLMHD_07 = listRole.some(
              (element) => element.code == 'QLMHD_07'
            );
            this.isQLMHD_08 = listRole.some(
              (element) => element.code == 'QLMHD_08'
            );

            this.isQLTC_01 = listRole.some(
              (element) => element.code == 'QLTC_01'
            );
            this.isQLTC_02 = listRole.some(
              (element) => element.code == 'QLTC_02'
            );
            this.isQLTC_03 = listRole.some(
              (element) => element.code == 'QLTC_03'
            );
            this.isQLTC_04 = listRole.some(
              (element) => element.code == 'QLTC_04'
            );

            this.isQLND_01 = listRole.some(
              (element) => element.code == 'QLND_01'
            );
            this.isQLND_02 = listRole.some(
              (element) => element.code == 'QLND_02'
            );
            this.isQLND_03 = listRole.some(
              (element) => element.code == 'QLND_03'
            );
            this.isQLND_04 = listRole.some(
              (element) => element.code == 'QLND_04'
            );

            this.isQLVT_01 = listRole.some(
              (element) => element.code == 'QLVT_01'
            );
            this.isQLVT_02 = listRole.some(
              (element) => element.code == 'QLVT_02'
            );
            this.isQLVT_03 = listRole.some(
              (element) => element.code == 'QLVT_03'
            );
            this.isQLVT_04 = listRole.some(
              (element) => element.code == 'QLVT_04'
            );
            this.isQLVT_05 = listRole.some(
              (element) => element.code == 'QLVT_05'
            );

            this.isQLLHD_01 = listRole.some(
              (element) => element.code == 'QLLHD_01'
            );
            this.isQLLHD_02 = listRole.some(
              (element) => element.code == 'QLLHD_02'
            );
            this.isQLLHD_03 = listRole.some(
              (element) => element.code == 'QLLHD_03'
            );
            this.isQLLHD_04 = listRole.some(
              (element) => element.code == 'QLLHD_04'
            );
            this.isQLLHD_05 = listRole.some(
              (element) => element.code == 'QLLHD_05'
            );
            this.QLDSCTS_01 = listRole.some(
              (element) => element.code == 'QLDSCTS_01'
            );
            this.QLDSCTS_02 = listRole.some(
              (element) => element.code == 'QLDSCTS_02'
            );
            this.QLDSCTS_03 = listRole.some(
              (element) => element.code == 'QLDSCTS_03'
            );
            this.QLDSCTS_04 = listRole.some(
              (element) => element.code == 'QLDSCTS_04'
            );

            this.isBaoCaoChiTiet = listRole.some(
              (element) => element.code == 'BAOCAO_CHITIET'
            )

            this.isBaoCaoSapHetHieuLuc = listRole.some(
              (element) => element.code == 'BAOCAO_SAPHETHIEULUC'
            )

            this.isBaoCaoTrangThaiXuLy = listRole.some(
              (element) => element.code == 'BAOCAO_TRANGTHAIXULY'
            )

            this.isBaoCaoSoLuongTrangThai = listRole.some(
              (element) => element.code == 'BAOCAO_SOLUONG_TRANGTHAI'
            )

            this.isBaoCaoHopDongEcontractMsale = listRole.some(
              (element) => element.code == 'BAOCAO_SOLUONG_HOPDONG_ECONTRACT_MSALE'
            )

            this.isBaoCaoTrangThaiGuiSms = listRole.some(
              (element) => element.code == 'BAOCAO_TRANGTHAIGUI_SMS'
            )

            this.isBaoCaoTrangThaiGuiEmail = listRole.some(
              (element) => element.code == 'BAOCAO_TRANGTHAIGUI_EMAIL'
            )

            this.isBaoCaoEKYC = listRole.some(
              (element) => element.code == 'BAOCAO_EKYC'
            )

            this.isBaoCaoSoLuongLoai = listRole.some((element) => element.code == 'BAOCAO_SOLUONG_LOAIHOPDONG');

            this.isBaoCaoHopDongNhan = listRole.some((element) => element.code == 'BAOCAO_HOPDONG_NHAN');

            this.isConfigSms = listRole.some((element) => element.code == 'CAUHINH_SMS');

            this.isConfigSoonExpireDay = listRole.some((element) => element.code == 'CAUHINH_NGAYSAPHETHAN');

            this.isConfigBrandname = listRole.some((element) => element.code == 'CAUHINH_BRANDNAME');

            this.isConfigMailServer = listRole.some((element) => element.code == 'CAUHINH_MAILSERVER');

            this.buildMenu(currentUserC);
          },
          (error) => {
            this.toastService.showErrorHTMLWithTimeout('Lấy thông tin phân quyền','',3000);
            this.router.navigate(['/login'])
          }
        );
      },
      (error) => {
        setTimeout(() => this.router.navigate(['/login']));
        this.toastService.showErrorHTMLWithTimeout(
          'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!',
          '',
          3000
        );

      }
    );

    this.menus =  this.menus.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));

    return this.menus;
  }

  buildMenu(currentUserC: any) {


    if (
      this.isQLHD_02 ||
      this.isQLHD_03 ||
      this.isQLHD_04 ||
      this.isQLHD_05 ||
      this.isQLHD_06 ||
      this.isQLHD_07 ||
      this.isQLHD_08 ||
      this.isQLHD_09 ||
      this.isQLHD_10 ||
      this.isQLHD_11 ||
      this.isQLHD_12
    ) {
      let submenusCreate: any[] = [];
      submenusCreate.push(
        {
          title: 'contract.status.draft',
          active: false,
          href: '/main/contract/create/draft',
        },
        {
          title: 'contract.status.processing',
          active: false,
          href: '/main/contract/create/processing',
        },
        {
          title: 'contract.status.expire',
          active: false,
          href: '/main/contract/create/expire',
        },
        {
          title: 'contract.status.overdue',
          active: false,
          href: '/main/contract/create/overdue',
        },
        {
          title: 'contract.status.fail',
          active: false,
          href: '/main/contract/create/fail',
        },
        {
          title: 'contract.status.cancel',
          active: false,
          href: '/main/contract/create/cancel',
        },
        {
          title: 'contract.status.complete',
          active: false,
          href: '/main/contract/create/complete',
        },
        {
          title: 'contract.status.liquidated',
          active: false,
          href: '/main/contract/create/liquidated',
        }
      );

      if (currentUserC.customer.info.organizationChange == 1) {
        submenusCreate.push({
          title: 'Hoàn thành ĐV cũ',
          active: false,
          href: '/main/contract/create/past-complete',
        });
      }

      this.menus.push({
        title: 'menu.contract.create.list',
        icon: '/assets/img/processing_icon.svg',
        iconFill: '/assets/img/processing_icon_v2.svg',
        iconDefault: '/assets/img/processing_icon.svg',
        active: false,
        activeDrop: false,
        type: 'dropdown',
        href: '#',
        submenus: submenusCreate,
        id: 2,
        isActive: true
      });
    }

    let submenusReceive: any[] = [];
    submenusReceive.push(
      {
        title: 'contract.status.wait-processing',
        active: false,
        href: '/main/'+this.contract_signatures+'/receive/wait-processing',
      },
      {
        title: 'contract.status.processed',
        active: false,
        href: '/main/'+this.contract_signatures+'/receive/processed',
      },
      {
        title: 'contract.status.share',
        active: false,
        href: '/main/'+this.contract_signatures+'/receive/share',
      }
    );

    this.menus.push({
      title: 'menu.contract.receive.list',
      icon: '/assets/img/document-download.svg',
      iconFill: '/assets/img/document-download_v2.svg',
      iconDefault: '/assets/img/document-download.svg',
      active: false,
      activeDrop: false,
      type: 'dropdown',
      href: '#',
      submenus: submenusReceive,
      id: 3,
      isActive: true
    });

    if (
      this.isQLMHD_01 ||
      this.isQLMHD_02 ||
      this.isQLMHD_03 ||
      this.isQLMHD_04 ||
      this.isQLMHD_05 ||
      this.isQLMHD_06 ||
      this.isQLMHD_07 ||
      this.isQLMHD_08
    ) {
      this.menus.push({
        title: 'menu.contract.template',
        icon: '/assets/img/document-normal.svg',
        iconFill: '/assets/img/document-normal_v2.svg',
        iconDefault: '/assets/img/document-normal.svg',
        active: false,
        type: 'simple',
        href: '/main/contract-template',
        id: 4,
        isActive: true
      });
    }

    if(this.isQLTC_01 || this.isQLTC_02 || this.isQLTC_03 || this.isQLTC_04 ||
      this.isQLND_01 || this.isQLND_02 || this.isQLND_03 || this.isQLND_04 ||
      this.isQLVT_01 || this.isQLVT_02 || this.isQLVT_03 || this.isQLVT_04 || this.isQLVT_05)
      {
        let submenusUserManage: any[] = [];
        submenusUserManage.push(
          {
            title: 'menu.organization.list',
            active: false,
            href: '/main/unit',
          },
          {
            title: 'menu.user.list',
            active: false,
            href: '/main/user',
          },
          {
            title: 'menu.role.list',
            active: false,
            href: '/main/role',
          }
        )
        this.menus.push({
          title: 'menu.manager.user',
          icon: '/assets/img/user-tag.svg',
          iconFill: '/assets/img/user-tag_v2.svg',
          iconDefault: '/assets/img/user-tag.svg',
          active: false,
          activeDrop: false,
          type: 'dropdown',
          href: '#',
          submenus: submenusUserManage,
          id: 5,
        });
      }

    // if (this.isQLTC_01 || this.isQLTC_02 || this.isQLTC_03 || this.isQLTC_04) {
    //   this.menus.push({
    //     title: 'menu.organization.list',
    //     icon: '/assets/img/db_user_group.svg',
    //     active: false,
    //     type: 'simple',
    //     href: '/main/unit',
    //     id: 5,
    //   });
    // }
    // if (this.isQLND_01 || this.isQLND_02 || this.isQLND_03 || this.isQLND_04) {
    //   this.menus.push({
    //     title: 'menu.user.list',
    //     icon: '/assets/img/db_user.svg',
    //     active: false,
    //     type: 'simple',
    //     href: '/main/user',
    //     id: 6,
    //   });
    // }
    // if (this.isQLVT_01 || this.isQLVT_02 || this.isQLVT_03 || this.isQLVT_04 || this.isQLVT_05) {
    //   this.menus.push({
    //     title: 'menu.role.list',
    //     icon: '/assets/img/db_role.svg',
    //     active: false,
    //     type: 'simple',
    //     href: '/main/role',
    //     id: 7,
    //   });
    // }

    this.menus.push({
      title: 'menu.customer.list',
      icon: '/assets/img/profile-2user.svg',
      iconFill: '/assets/img/profile-2user_v2.svg',
      iconDefault: '/assets/img/profile-2user.svg',
      active: false,
      type: 'simple',
      href: '/main/customer',
      id: 11,
      isActive: true
    })

    if(this.isQLLHD_01 || this.isQLLHD_02 || this.isQLLHD_03 || this.isQLLHD_04 || this.isQLLHD_05 ||
      this.isConfigSms || this.isConfigSoonExpireDay || this.isConfigBrandname || this.isConfigMailServer ||
      this.QLDSCTS_01 || this.QLDSCTS_02 || this.QLDSCTS_03 || this.QLDSCTS_04)
      {
        let submenusConfig: any[] = [];
        submenusConfig.push(
          {
            title: 'menu.contract.type.list',
            active: false,
            href: '/main/contract-type',
          },
          {
            title: 'menu.config-sms-email',
            active: false,
            href: '/main/config-sms-email',
          },
          {
            title: 'certificate.list',
            active: false,
            href: '/main/digital-certificate',
          }
        )
        this.menus.push({
          title: 'menu.config',
          icon: '/assets/img/setting-3.svg',
          iconFill: '/assets/img/setting-3_v2.svg',
          iconDefault: '/assets/img/setting-3.svg',
          active: false,
          activeDrop: false,
          type: 'dropdown',
          href: '#',
          submenus: submenusConfig,
          id: 6,
        });
      }

      this.menus.push({
        title: 'contract.folder',
        icon: '/assets/img/folder-2.svg',
        iconFill: '/assets/img/folder-2_v2.svg',
        iconDefault: '/assets/img/folder-2.svg',
        active: false,
        type: 'simple',
        href: '/main/contract-folder',
        id: 12,
        isActive: true
      })

    // if (this.isQLLHD_01 || this.isQLLHD_02 || this.isQLLHD_03 || this.isQLLHD_04 || this.isQLLHD_05)
    // {
    //   this.menus.push({
    //     title: 'menu.contract.type.list',
    //     icon: '/assets/img/db_contract_type.svg',
    //     active: false,
    //     type: 'simple',
    //     href: '/main/contract-type',
    //     id: 8,
    //   });
    // }


    let submenusReport: any[] = [];

    if(this.isBaoCaoChiTiet) {
      submenusReport.push({
        title: 'report.detail.contract',
        active: false,
        href: '/main/report/detail',
      })
    }
    if(this.isBaoCaoSapHetHieuLuc) {
      submenusReport.push({
        title: 'report.expires-soon.contract',
        active: false,
        href: '/main/report/soon-expire',
      })
    }

    if(this.isBaoCaoTrangThaiXuLy) {
      submenusReport.push( {
        title: 'report.processing.status.contract',
        active: false,
        href: '/main/report/status-contract',
      })
    }

    if(this.isBaoCaoSoLuongTrangThai) {
      submenusReport.push(
        {
          title: 'report.number.contracts.status',
          active: false,
          href: '/main/report/contract-number-follow-status',
        }
      )
    }

    if(this.isBaoCaoSoLuongLoai) {
      submenusReport.push({
        title:'report.number.contracts.type',
        active: false,
        href: '/main/report/contract-number-follow-type'
      })
    }

    if(this.isBaoCaoHopDongNhan) {
      submenusReport.push({
        title:'report.contract.receive',
        active: false,
        href: '/main/report/contract-receive'
      })
    }

    if(this.isBaoCaoHopDongEcontractMsale && environment.flag == 'NB'){
      submenusReport.push({
        title: 'report.number.econtract.msale',
        active: false,
        href: '/main/report/contract-number-econtract-mSale',
      })
    }

    if(this.isBaoCaoTrangThaiGuiSms) {
      submenusReport.push({
        title: 'report.status.send.sms',
        active: false,
        href: '/main/report/status-send-sms'
      })
    }

    if(this.isBaoCaoTrangThaiGuiEmail) {
      submenusReport.push({
        title: 'report.contract.send.email',
        active: false,
        href: '/main/report/status-send-email'
      })
    }

    if(this.isBaoCaoEKYC) {
      submenusReport.push({
        title: 'report.ekyc',
        active: false,
        href: '/main/report/status-ekyc'
      })
    }


    if(this.isBaoCaoChiTiet || this.isBaoCaoSapHetHieuLuc || this.isBaoCaoSapHetHieuLuc || this.isBaoCaoTrangThaiXuLy || this.isBaoCaoSoLuongLoai || this.isBaoCaoHopDongNhan || this.isBaoCaoSoLuongTrangThai || this.isBaoCaoTrangThaiGuiSms || this.isBaoCaoTrangThaiGuiEmail || this.isBaoCaoEKYC) {
      this.menus.push({
        title: 'report',
        icon: '/assets/img/status-up.svg',
        iconFill: '/assets/img/status-up_v2.svg',
        iconDefault: '/assets/img/status-up.svg',
        active: false,
        activeDrop: false,
        type: 'dropdown',
        href: '#',
        submenus: submenusReport,
        id: 10,
        isActive: true
      })
    }

    this.menus.push({
      title: 'menu.check.sign.digital',
      icon: '/assets/img/check.svg',
      iconFill: '/assets/img/check_v2.svg',
      iconDefault: '/assets/img/check.svg',
      active: false,
      type: 'simple',
      href: '/main/check-sign-digital',
      id: 9,
      isActive: true
    });
    // if (this.QLDSCTS_01 || this.QLDSCTS_02 || this.QLDSCTS_03 || this.QLDSCTS_04) {
    //   this.menus.push({
    //     title: 'certificate.list',
    //     icon: '/assets/img/icon-document.svg',
    //     active: false,
    //     type: 'simple',
    //     href: '/main/digital-certificate',
    //     id: 6,
    //   });
    // }

    // if(this.isConfigSms || this.isConfigSoonExpireDay) {
    //   this.menus.push({
    //     title: 'menu.config-sms-email',
    //     icon: '/assets/img/email-sms.svg',
    //     active: false,
    //     type: 'simple',
    //     href: '/main/config-sms-email',
    //     id: 9,
    //   })
    // }


    //xu ly highlight
    this.menus.forEach((element: any) => {
      element.active = false;
      if (element.href != '#') {
        if (this.router.url.includes(element.href)) {
          element.active = true;
          element.icon = element.iconFill;
        }
      } else {
        this.subMenus = element.submenus;
        if (element.id == 2 && this.router.url === '/main/dashboard') {
          element.activeDrop = true;
          element.active = true;
          element.isActive = false;
        } else {
          element.activeDrop = false;
          element.active = false;
        }

        this.subMenus.forEach((elementSub: any) => {
          if (this.router.url.includes(elementSub.href)) {
            element.activeDrop = true;
            element.active = true;
            elementSub.active = true;
            element.icon = element.iconFill;
          } else {
            elementSub.active = false;
          }
        });
      }
    });

    this.menus = [];

  }

  getSubMenuList(menuParent: any) {
    this.menus.forEach((element: any) => {
      if (element === menuParent) {
        return element.submenus;
      }
    });
  }

  triggerReloadSidebar() {
    this.reloadSidebarSubject.next();
  }

  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
