import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { RoleService } from 'src/app/service/role.service';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

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

  isQLDC_01: boolean = true; //them moi chung thu so
  isQLDC_02: boolean = true; //sua thong tin chung thu so
  isQLDC_03: boolean = true; //tim kiem thong tin
  isQLDC_04: boolean = true; //xem thong tin chung thu so

  isBaoCaoChiTiet: boolean = true;
  isBaoCaoSapHetHieuLuc: boolean = true;
  isBaoCaoTrangThaiXuLy: boolean = true;
  isBaoCaoSoLuongTrangThai: boolean = true;

  toggled = false;
  _hasBackgroundImage = true;

  subMenus: any = [];

  contract_signatures: any = "c";

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private toastService: ToastService,
    private router: Router,
    private dashboardService: DashboardService
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
    this.menus = [
      {
        title: 'menu.dashboard',
        icon: '/assets/img/db_home.svg',
        active: false,
        type: 'simple',
        href: '/main/dashboard',
        id: 0,
      },
    ];

    const currentUserC = JSON.parse(localStorage.getItem('currentUser') || '');
    console.log(currentUserC.customer.info.organizationChange);
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
            this.isQLDC_01 = listRole.some(
              (element) => element.code == 'isQLDC_01'
            );
            this.isQLDC_02 = listRole.some(
              (element) => element.code == 'isQLDC_02'
            );
            this.isQLDC_03 = listRole.some(
              (element) => element.code == 'isQLDC_03'
            );
            this.isQLDC_04 = listRole.some(
              (element) => element.code == 'isQLDC_04'
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

            this.buildMenu(currentUserC);
          },
          (error) => {
            // this.toastService.showErrorHTMLWithTimeout(
            //   'Lấy thông tin phân quyền',
            //   '',
            //   3000
            // );
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
    if (this.isQLHD_01 || this.isQLHD_14 || this.isQLHD_15) {
      this.menus.push({
        title: 'menu.contract.add',
        active: false,
        type: 'button',
        href: '/main/form-contract/add',
        id: 1,
      });
    }

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
        icon: '/assets/img/db_processing.svg',
        active: false,
        activeDrop: false,
        type: 'dropdown',
        href: '#',
        submenus: submenusCreate,
        id: 2,
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
      icon: '/assets/img/db_processing.svg',
      active: false,
      activeDrop: false,
      type: 'dropdown',
      href: '#',
      submenus: submenusReceive,
      id: 3,
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
        title: 'menu.contract.template.list',
        icon: '/assets/img/db_processing.svg',
        active: false,
        type: 'simple',
        href: '/main/contract-template',
        id: 4,
      });
    }

    if (this.isQLTC_01 || this.isQLTC_02 || this.isQLTC_03 || this.isQLTC_04) {
      this.menus.push({
        title: 'menu.organization.list',
        icon: '/assets/img/db_user_group.svg',
        active: false,
        type: 'simple',
        href: '/main/unit',
        id: 5,
      });
    }
    if (this.isQLND_01 || this.isQLND_02 || this.isQLND_03 || this.isQLND_04) {
      this.menus.push({
        title: 'menu.user.list',
        icon: '/assets/img/db_user.svg',
        active: false,
        type: 'simple',
        href: '/main/user',
        id: 6,
      });
    }
    if (
      this.isQLVT_01 ||
      this.isQLVT_02 ||
      this.isQLVT_03 ||
      this.isQLVT_04 ||
      this.isQLVT_05
    ) {
      this.menus.push({
        title: 'menu.role.list',
        icon: '/assets/img/db_role.svg',
        active: false,
        type: 'simple',
        href: '/main/role',
        id: 7,
      });
    }
    if (
      this.isQLLHD_01 ||
      this.isQLLHD_02 ||
      this.isQLLHD_03 ||
      this.isQLLHD_04 ||
      this.isQLLHD_05
    ) {
      this.menus.push({
        title: 'menu.contract.type.list',
        icon: '/assets/img/db_contract_type.svg',
        active: false,
        type: 'simple',
        href: '/main/contract-type',
        id: 8,
      });
    }

    this.menus.push({
      title: 'menu.check.sign.digital',
      icon: '/assets/img/check_sign_digital.svg',
      active: false,
      type: 'simple',
      href: '/main/check-sign-digital',
      id: 9,
    });

    let submenusReport: any[] = [];

    if(this.isBaoCaoChiTiet) {
      console.log("vao day ");
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


    if(this.isBaoCaoChiTiet || this.isBaoCaoSapHetHieuLuc || this.isBaoCaoSapHetHieuLuc || this.isBaoCaoSoLuongTrangThai || this.isBaoCaoTrangThaiXuLy) {
      this.menus.push({
        title: 'report',
        icon: '/assets/img/analytics1.svg',
        active: false,
        activeDrop: false,
        type: 'dropdown',
        href: '#',
        submenus: submenusReport,
        id: 10,
      })
    }
    if (this.isQLND_01 || this.isQLND_02 || this.isQLND_03 || this.isQLND_04) {
      this.menus.push({
        title: 'certificate.list',
        icon: '/assets/img/icon-document.svg',
        active: false,
        type: 'simple',
        href: '/main/digital-certificate',
        id: 6,
      });
    }

    // this.menus.push({
    //   title: 'menu.config-sms-email',
    //   icon: '/assets/img/email-sms.svg',
    //   active: false,
    //   type: 'simple',
    //   href: '/main/config-sms-email',
    //   id: 9,
    // })

    // this.menus.push({
    //   title: 'customer.list',
    //   icon: '/assets/img/email-sms.svg',
    //   active: false,
    //   type:'simple',
    //   href: '/main/customer',
    // })


    //xu ly highlight
    this.menus.forEach((element: any) => {
      element.active = false;
      if (element.href != '#') {
        if (this.router.url.includes(element.href)) {
          element.active = true;
        }
      } else {
        this.subMenus = element.submenus;
        element.activeDrop = false;
        element.active = false;
        this.subMenus.forEach((elementSub: any) => {
          if (this.router.url.includes(elementSub.href)) {
            element.activeDrop = true;
            element.active = true;
            elementSub.active = true;
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
        console.log(element);
        console.log(element.submenus);
        return element.submenus;
      }
    });
  }

  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
