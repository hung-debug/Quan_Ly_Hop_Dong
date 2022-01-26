import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  //phan quyen
  isQLHD_01:boolean=true;   //them moi hop dong don le
  isQLHD_02:boolean=true;   //sua hop dong
  isQLHD_03:boolean=true;   //xem danh sach hop dong cua toi va to chuc con
  isQLHD_04:boolean=true;   //xem danh sach hop dong cua to chuc cua toi
  isQLHD_05:boolean=true;   //xem danh sach hop dong cua toi
  isQLHD_06:boolean=true;   //tim kiem hop dong
  isQLHD_07:boolean=true;   //xem thong tin chi tiet hop dong
  isQLHD_08:boolean=true;   //sao chep hop dong
  isQLHD_09:boolean=true;   //huy hop dong
  isQLHD_10:boolean=true;   //xem lich su hop dong
  isQLHD_11:boolean=true;   //tao hop dong lien quan
  isQLHD_12:boolean=true;   //xem hop dong lien quan
  isQLHD_13:boolean=true;   //chia se hop dong

  isQLMHD_01:boolean=true;  //them moi mau hop dong
  isQLMHD_02:boolean=true;  //sua mau hop dong
  isQLMHD_03:boolean=true;  //tao hop dong don le theo mau hop dong
  isQLMHD_04:boolean=true;  //tao hop dong theo lo theo hop dong
  isQLMHD_05:boolean=true;  //ngung phat hanh mau hop dong
  isQLMHD_06:boolean=true;  //phat hanh mau hop dong
  isQLMHD_07:boolean=true;  //chia se mau hop dong
  isQLMHD_08:boolean=true;  //tim kiem mau hop dong
  isQLMHD_09:boolean=true;  //xoa mau hop dong
  isQLMHD_10:boolean=true;  //xem thong tin chi tiet mau hop dong
  
  isQLTC_01:boolean=true;   //them moi to chuc
  isQLTC_02:boolean=true;   //sua to chuc
  isQLTC_03:boolean=true;   //tim kiem to chuc
  isQLTC_04:boolean=true;   //xem thong tin chi tiet to chuc

  isQLND_01:boolean=true;   //them moi nguoi dung
  isQLND_02:boolean=true;   //sua nguoi dung
  isQLND_03:boolean=true;   //tim kiem nguoi dung
  isQLND_04:boolean=true;   //xem thong tin chi tiet nguoi dung

  isQLVT_01:boolean=true;   //them moi vai tro
  isQLVT_02:boolean=true;   //sua vai tro
  isQLVT_03:boolean=true;   //xoa vai tro
  isQLVT_04:boolean=true;   //tim kiem vai tro
  isQLVT_05:boolean=true;   //xem thong tin chi tiet vai tro

  isQLLHD_01:boolean=true;  //them moi loai hop dong
  isQLLHD_02:boolean=true;  //sua loai hop dong
  isQLLHD_03:boolean=true;  //xoa loai hop dong
  isQLLHD_04:boolean=true;  //tim kiem loai hop dong
  isQLLHD_05:boolean=true;  //xem thong tin chi tiet loai hop dong

  toggled = false;
  _hasBackgroundImage = true;
  menus:any[] = [
    {
      title: 'menu.dashboard',
      icon: '/assets/img/db_home.svg',
      active: false,
      type: 'simple',
      href: '/main/dashboard'
    },
    // {
    //   title: 'menu.contract.add',
    //   active: false,
    //   type: 'button',
    //   href: '/main/form-contract/add'
    // },
    // {
    //   title: 'menu.contract.create.list',
    //   icon: '/assets/img/db_processing.svg',
    //   active: false,
    //   type: 'dropdown',
    //   href: '#',
    //   submenus: [
    //     {
    //       title: 'contract.status.draft',
    //       active: false,
    //       href: '/main/contract/create/draft'
    //     },
    //     {
    //       title: 'contract.status.processing',
    //       active: false,
    //       href: '/main/contract/create/processing'
    //     },
    //     {
    //       title: 'contract.status.expire',
    //       active: false,
    //       href: '/main/contract/create/expire'
    //     },
    //     {
    //       title: 'contract.status.overdue',
    //       active: false,
    //       href: '/main/contract/create/overdue'
    //     },
    //     {
    //       title: 'contract.status.fail',
    //       active: false,
    //       href: '/main/contract/create/fail'
    //     },
    //     {
    //       title: 'contract.status.cancel',
    //       active: false,
    //       href: '/main/contract/create/cancel'
    //     },
    //     {
    //       title: 'contract.status.complete',
    //       active: false,
    //       href: '/main/contract/create/complete'
    //     }
    //   ]
    // },
    // {
    //   title: 'menu.contract.receive.list',
    //   icon: '/assets/img/db_processing.svg',
    //   active: false,
    //   type: 'dropdown',
    //   href: '#',
    //   submenus: [
    //     {
    //       title: 'contract.status.wait-processing',
    //       active: false,
    //       href: '/main/contract-signature/receive/wait-processing'
    //     },
    //     {
    //       title: 'contract.status.processed',
    //       active: false,
    //       href: '/main/contract-signature/receive/processed'
    //     },
    //     {
    //       title: 'contract.status.share',
    //       active: false,
    //       href: '/main/contract-signature/receive/share'
    //     }
    //   ]
    // },
    // {
    //   title: 'menu.contract.template.list',
    //   icon: '/assets/img/db_processing.svg',
    //   active: false,
    //   type: 'simple',
    //   href: '/main/contract-template'
    // },
    // {
    //   title: 'menu.user.list',
    //   icon: '/assets/img/db_user.svg',
    //   active: false,
    //   type: 'simple',
    //   href: '/main/user'
    // },
    // {
    //   title: 'menu.organization.list',
    //   icon: '/assets/img/db_user_group.svg',
    //   active: false,
    //   type: 'simple',
    //   href: '/main/unit'
    // },
    // {
    //   title: 'menu.role.list',
    //   icon: '/assets/img/db_role.svg',
    //   active: false,
    //   type: 'simple',
    //   href: '/main/role'
    // },
    // {
    //   title: 'menu.contract.type.list',
    //   icon: '/assets/img/db_contract_type.svg',
    //   active: false,
    //   type: 'simple',
    //   href: '/main/contract-type'
    // }
  ];
  
  
  constructor() {
    if(this.isQLHD_01 || this.isQLMHD_03 || this.isQLMHD_04){
      this.menus.push({
        title: 'menu.contract.add',
        active: false,
        type: 'button',
        href: '/main/form-contract/add'
      });
    }
    if(this.isQLHD_02 || this.isQLHD_03 || this.isQLHD_04 || this.isQLHD_05 || this.isQLHD_06 || 
      this.isQLHD_07 || this.isQLHD_08 || this.isQLHD_09 || this.isQLHD_10 || this.isQLHD_11 || this.isQLHD_12){
      let submenusCreate:any[]=[];
      submenusCreate.push({
        title: 'contract.status.draft',
        active: false,
        href: '/main/contract/create/draft'
      },
      {
        title: 'contract.status.processing',
        active: false,
        href: '/main/contract/create/processing'
      },
      {
        title: 'contract.status.expire',
        active: false,
        href: '/main/contract/create/expire'
      },
      {
        title: 'contract.status.overdue',
        active: false,
        href: '/main/contract/create/overdue'
      },
      {
        title: 'contract.status.fail',
        active: false,
        href: '/main/contract/create/fail'
      },
      {
        title: 'contract.status.cancel',
        active: false,
        href: '/main/contract/create/cancel'
      },
      {
        title: 'contract.status.complete',
        active: false,
        href: '/main/contract/create/complete'
      });

      this.menus.push({
        title: 'menu.contract.create.list',
        icon: '/assets/img/db_processing.svg',
        active: false,
        type: 'dropdown',
        href: '#',
        submenus: submenusCreate
      });
    }

    let submenusReceive:any[]=[];
    submenusReceive.push({
      title: 'contract.status.wait-processing',
      active: false,
      href: '/main/contract-signature/receive/wait-processing'
    },
    {
      title: 'contract.status.processed',
      active: false,
      href: '/main/contract-signature/receive/processed'
    },
    {
      title: 'contract.status.share',
      active: false,
      href: '/main/contract-signature/receive/share'
    });
    
    this.menus.push(
      {
      title: 'menu.contract.receive.list',
      icon: '/assets/img/db_processing.svg',
      active: false,
      type: 'dropdown',
      href: '#',
      submenus: submenusReceive
    });

    if(this.isQLTC_01 || this.isQLTC_02 || this.isQLTC_03 || this.isQLTC_04){
      this.menus.push({
        title: 'menu.organization.list',
        icon: '/assets/img/db_user_group.svg',
        active: false,
        type: 'simple',
        href: '/main/unit'
      });
    }
    if(this.isQLND_01 || this.isQLND_02 || this.isQLND_03 || this.isQLND_04){
      this.menus.push({
        title: 'menu.user.list',
        icon: '/assets/img/db_user.svg',
        active: false,
        type: 'simple',
        href: '/main/user'
      });
    }
    if(this.isQLVT_01 || this.isQLVT_02 || this.isQLVT_03 || this.isQLVT_04 || this.isQLVT_05){
      this.menus.push({
        title: 'menu.role.list',
        icon: '/assets/img/db_role.svg',
        active: false,
        type: 'simple',
        href: '/main/role'
      });
    }
    if(this.isQLLHD_01 || this.isQLLHD_02 || this.isQLLHD_03 || this.isQLLHD_04 || this.isQLLHD_05){
      this.menus.push({
        title: 'menu.contract.type.list',
        icon: '/assets/img/db_contract_type.svg',
        active: false,
        type: 'simple',
        href: '/main/contract-type'
      });
    }

    // this.menus.push({
    //   title: 'menu.check.sign.digital',
    //   icon: '/assets/img/check_sign_digital.svg',
    //   active: false,
    //   type: 'simple',
    //   href: '/main/check-sign-digital'
    // },)
  }

  toggle() {
    this.toggled = ! this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    return this.menus;
  }

  getSubMenuList(menuParent:any) {
    this.menus.forEach((element:any) => {
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
