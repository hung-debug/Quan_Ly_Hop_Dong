import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export const variable = {
  stepSampleContract: {
    step_confirm_coordination: 'confirm-coordination',
    step_coordination: 'infor-coordination',
    step1: 'infor-contract',
    step2: 'determine-contract',
    step3: 'sample-contract',
    step4: 'confirm-contract',
  },

  stepSampleContractForm: {
    step1: 'infor-contract-form',
    step2: 'party-contract-form',
    step3: 'sample-contract-form',
    step4: 'confirm-contract-form',
  },

  stepSampleContractBatch: {
    step1: 'infor-contract-batch',
    step2: 'confirm-contract-batch',
  },
};

export const type_signature = [
  {
    id: 1,
    name: 'Ký ảnh và OTP',
    is_otp: false,
  },
  {
    id: 5,
    name: "Ký eKYC",
    is_otp: false
  },
  {
    id: 4,
    name: 'Ký số bằng HSM',
    is_otp: false
  },
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },
  {
    id: 6,
    name: 'Ký bằng chứng thư số server',
    is_otp: false
  },
  {
    id: 7,
    name: 'Ký số bằng USB token Ban Cơ Yếu',
    is_otp: false
  },
  {
    id: 8,
    name: 'Ký số Remote Signing',
    is_otp: false
  }
];

export const type_signature_en = [
  {
    id: 1,
    name: 'Signed by image and OTP',
    is_otp: false,
  },
  {
    id: 5,
    name: "Signed by eKYC",
    is_otp: false
  },
  {
    id: 4,
    name: 'Signed by HSM',
    is_otp: false
  },
  {
    id: 2,
    name: 'Signed by USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Signed by PKI',
    is_otp: false,
  },
  {
    id: 6,
    name: 'Sign by cert',
    is_otp: false
  },
  {
    id: 7,
    name: 'Signed by USB token Ban Cơ Yếu',
    is_otp: false
  },
  {
    id: 8,
    name: 'Signed by Remote Signing',
    is_otp: false
  }

];

export const type_signature_personal_party = [
  {
    id: 1,
    name: 'Ký ảnh và OTP',
    is_otp: false,
  },
  {
    id: 5,
    name: "Ký eKYC",
    is_otp: false
  },
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },
];

export const type_signature_doc = [
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },
  {
    id: 4,
    name: 'Ký số bằng HSM',
    is_otp: false
  },
  {
    id: 6,
    name: 'Ký bằng chứng thư số server',
    is_otp: false
  },
  {
    id: 7,
    name: 'Ký số bằng USB token Ban Cơ Yếu',
    is_otp: false
  },
  {
    id: 8,
    name: 'Ký số Remote Signing',
    is_otp: false
  }
];

export const type_signature_template = [
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },
  {
    id: 4,
    name: 'Ký số bằng HSM',
    is_otp: false
  },

];

export const type_signature_personal_party_template = [
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },
];

export const type_signature_doc_template = [
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 4,
    name: 'Ký số bằng HSM',
    is_otp: false
  },
];

export const clone_load_org_customer = {
  name: '',
  taxCode: '',
  type: 'ORGANIZATION',
  handlers: [
    {
      ordering: 1,
      role: 'SIGNER',
      name: '',
      email: '',
      phone: '',
      signType: [],
      locale : 'vi',
      login_by: 'email',
    }
  ],
};

export const clone_load_personal_customer = {
  name: '',
  email: '',
  phone: '',
  type: 'PERSONAL',
  signType: [],
  locale : 'vi',
  login_by: 'email',
  card_id: '',
}

export const org_customer_clone = {
  name: '',
  taxCode: '',
  type: 'ORGANIZATION',
  handlers: [
    {
      ordering: 1,
      role: 'SIGNER',
      name: '',
      email: '',
      phone: '',
      signType: [],
      locale : 'vi',
      login_by: 'email'
    }
  ],
};

export const personal_customer_clone ={
  name: '',
  email: '',
  phone: '',
  type: 'PERSONAL',
  signType: [],
  locale : 'vi',
  login_by: 'email'
};

export var networkList = [
  { id: 1, name: 'MobiFone' },
  { id: 2, name: 'Viettel' },
  // { id: 3, name: 'Vietnamobile' },
  {id: 'bcy', name:'Ban cơ yếu'}
];

// export var networkList1 = [
//   { id: 1, name: 'Mobifone' },
//   { id: 2, name: 'Viettel' },
//   // { id: 3, name: 'Vietnamobile' },
//   {id: '3', name: 'Ban cơ yếu'}
// ];

export var statusList = [
  { id: 0, name: 'Tất cả' },
  { id: 1, name: 'Hoạt động' },
  { id: 2, name: 'Ngừng hoạt động' },
];

export var theThucTinhList = [
  { id: 1, name: 'Theo thời gian' },
  { id: 2, name: 'Theo số lượng tài liệu' },
];

export var loaiGoiDichVuList = [
  { id: 1, name: 'Bình thường' },
  { id: 2, name: 'Khuyến mại' },
];


export var optionsCeCa = [
  { id: 0, name: 'Không' },
  { id: 1, name: 'Có' },
];

export var paidTypeList = [
  {id: 'PRE', name:'Trả trước'},
  {id:'POST', name:'Trả sau'}
]

export var paidStatusList = [
  {id:'UNPAID', name:'Chưa thanh toán'},
  {id:'PAID', name:'Đã thanh toán'}
]

export var fileCeCaOptions = [
  {id: 'NONE', name:'Không đẩy tài liệu nào'},
  {id: 'ALL', name: 'Đẩy toàn bộ tài liệu'},
  {id: 'SELECTION', name: 'Tuỳ biến'}
]

export var sideList = [
  {id:'1', name:'A'}, {id:'2', name:'B'}, {id:'3', name:'C'}, {id:'4', name:'D'},
  {id:'5', name:'E'}, {id:'6', name:'F'}, {id:'7', name:'G'}, {id:'8', name:'H'},
  {id:'9', name:'I'}, {id:'10', name:'J'}, {id:'11', name:'K'}, {id:'12', name:'L'},
  {id:'13', name:'M'}, {id:'14', name:'N'}, {id:'15', name:'O'}, {id:'16', name:'P'},
  {id:'17', name:'Q'}, {id:'18', name:'R'}, {id:'19', name:'S'}, {id:'20', name:'T'},
  {id:'21', name:'U'}, {id:'22', name:'V'}, {id:'23', name:'W'}, {id:'24', name:'X'},
  {id:'25', name:'Y'}, {id:'26', name:'Z'}
]

export var roleList =
[
  {
    //Nhóm chức năng quản lý tài liệu
    label: 'role.contract.list',
    value: 'QLHD',
    items: [
      //Thêm mới tài liệu đơn lẻ không theo mẫu
      { label: 'add.contract.one.not.template', value: 'QLHD_01' },
      //Thêm mới tài liệu đơn lẻ theo mẫu
      { label: 'add.contract.one.template', value: 'QLHD_14' },
      //Thêm mới tài liệu theo lô
      { label: 'add.contract.batch', value: 'QLHD_15' },
      //Sửa tài liệu
      { label: 'fix.contract', value: 'QLHD_02' },
      //Xem danh sách tài liệu của tổ chức của tôi và tổ chức con
      {
        label: 'view.list.contracts.me.and.child',
        value: 'QLHD_03',
      },
      //Xem danh sách tài liệu của tổ chức của tôi
      { label: 'view.list.contracts.me', value: 'QLHD_04' },
      //Xem danh sách tài liệu của tôi
      //Tìm kiếm tài liệu
      { label: 'search.contract', value: 'QLHD_06' },
      //Xem thông tin chi tiết tài liệu
      { label: 'role.contract.view.detail', value: 'QLHD_07' },
      //Sao chép tài liệu
      { label: 'contract.copy', value: 'QLHD_08' },
      //Hủy tài liệu
      { label: 'contract.cancel', value: 'QLHD_09' },
      //Xem lịch sử tài liệu
      { label: 'role.contract.view.history', value: 'QLHD_10' },
      //Tạo tài liệu liên quan
      { label: 'role.contract.create.connect', value: 'QLHD_11' },
      //Xem tài liệu liên quan
      { label: 'contract.connect.view', value: 'QLHD_12' },
      //Chia sẻ tài liệu
      { label: 'contract.share', value: 'QLHD_13' },
      //Thanh lý tài liệu,
      { label: 'contract.liquidation', value: 'QLHD_16'}
    ],
  },
  {
    //Nhóm chức năng quản lý mẫu tài liệu
    label: 'role.contract-template.list', value: "QLMHD",
    items: [
      //Thêm mới mẫu tài liệu
      { label: 'contract-template.add', value: "QLMHD_01"},
      //Sửa mẫu tài liệu
      { label: 'role.contract-template.edit', value: "QLMHD_02"},
      //Ngừng phát hành mẫu tài liệu
      { label: 'role.contract-template.stop', value: "QLMHD_03"},
      //Phát hành mẫu tài liệu
      { label: 'role.contract-template.start', value: "QLMHD_04"},
      //Chia sẻ mẫu tài liệu
      { label: 'role.contract-template.share', value: "QLMHD_05"},
      //Tìm kiếm mẫu tài liệu
      { label: 'role.contract-template.filter', value: "QLMHD_06"},
      //Xóa mẫu tài liệu
      { label: 'role.contract-template.delete', value: "QLMHD_07"},
      //Xem thông tin chi tiết mẫu tài liệu
      { label: 'role.contract-template.view.detail', value: "QLMHD_08"},
      { label: 'role.contract-template.copy', value: 'QLMHD_09' },
    ]
  },
  {
    //Nhóm chức năng quản lý tổ chức
    label: 'role.unit.list',
    value: 'QLTC',
    items: [
      //Thêm mới tổ chức
      { label: 'unit.add', value: 'QLTC_01' },
      //Sửa tổ chức
      { label: 'role.unit.edit', value: 'QLTC_02' },
      //Tìm kiếm tổ chức
      { label: 'role.unit.filter', value: 'QLTC_03' },
      //Xem thông tin chi tiết tổ chức
      { label: 'role.unit.view.detail', value: 'QLTC_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý người dùng
    label: 'role.user.list',
    value: 'QLND',
    items: [
      //Thêm mới người dùng
      { label: 'user.add', value: 'QLND_01' },
      //Sửa người dùng
      { label: 'role.user.edit', value: 'QLND_02' },
      //Tìm kiếm người dùng
      { label: 'role.user.filter', value: 'QLND_03' },
      //Xem thông tin chi tiết người dùng
      { label: 'role.user.view.detail', value: 'QLND_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý vai trò
    label: 'role.list.v2',
    value: 'QLVT',
    items: [
      //Thêm mới vai trò
      { label: 'role.add', value: 'QLVT_01' },
      //Sửa vai trò
      { label: 'role.edit', value: 'QLVT_02' },
      //Xóa vai trò
      { label: 'role.delete', value: 'QLVT_03' },
      //Tìm kiếm vai trò
      { label: 'role.filter', value: 'QLVT_04' },
      //Xem thông tin chi tiết vai trò
      { label: 'role.view.detail', value: 'QLVT_05' },
    ],
  },
  {
    //Nhóm chức năng quản lý loại tài liệu
    label: 'role.contract-type.list',
    value: 'QLLHD',
    items: [
      //Thêm mới loại tài liệu
      { label: 'role.contract-type.add', value: 'QLLHD_01' },
      //Sửa loại tài liệu
      { label: 'role.contract-type.edit', value: 'QLLHD_02' },
      //Xóa loại tài liệu
      { label: 'role.contract-type.delete', value: 'QLLHD_03' },
      //Tìm kiếm loại tài liệu
      { label: 'role.contract-type.filter', value: 'QLLHD_04' },
      //Xem thông tin chi tiết loại tài liệu
      { label: 'role.contract-type.view.detail', value: 'QLLHD_05' },
    ],
  },

  //Nhóm chức năng báo cáo
  {
    label: 'role.group.report',
    value: 'QLBC',
    items: [
      //Báo cáo chi tiết
      {label: 'role.report.detail',value:'BAOCAO_CHITIET'},

      //Báo cáo sắp hết hiệu lực
      {label: 'role.soon.expire.time',value:'BAOCAO_SAPHETHIEULUC'},

      //Báo cáo trạng thái xử lý
      {label: 'role.processing.status.contract',value:'BAOCAO_TRANGTHAIXULY'},

      //Báo cáo số lượng trạng thái
      {label: 'role.number.status', value:'BAOCAO_SOLUONG_TRANGTHAI'},

      //Báo cáo số lượng theo loại tài liệu
      {label: 'role.contract.type.quantity',value:'BAOCAO_SOLUONG_LOAIHOPDONG'},

      //Báo cáo tài liệu nhận
      {label: 'role.contract.receive', value:'BAOCAO_HOPDONG_NHAN'},

      //Báo cáo trạng thái gửi Sms
      {label: 'role.report.history.send.sms', value:'BAOCAO_TRANGTHAIGUI_SMS'},

      //Báo cáo trạng thái gửi Email
      {label: 'role.report.history.send.email', value:'BAOCAO_TRANGTHAIGUI_EMAIL'},
      
      //Báo cáo xác thực eKYC
      {label: 'report.ekyc', value:'BAOCAO_EKYC'}
    ]

  },

  //Nhóm chức năng quản lý danh sách chứng thư số
  {
    label:'role.cerificate.list',
    value:'QLDSCTS',
    items: [
      //Thêm mới chứng thư số
      { label: 'role.cerificate.add', value: 'QLDSCTS_01' },
      //Sửa chứng thư số
      { label: 'role.cerificate.update', value: 'QLDSCTS_02' },
      //Xem thông tin chi tiết chứng thư số
      { label: 'role.cerificate.detail', value: 'QLDSCTS_03' },
      //Tìm kiếm chứng thư số
      { label: 'role.cerificate.filter', value: 'QLDSCTS_04' },
    ]
  },

  //Nhóm chức năng cấu hình SMS/Email
  {
    label:'role.config.sms.email',
    value:'QLCH',
    items: [

        //Cấu hình sms
        {label:'config.sms',value:'CAUHINH_SMS'},

        //Cấu hình ngày sắp hết hạn
        {label:'config.day.expiration',value:'CAUHINH_NGAYSAPHETHAN'},
        
        //Cấu hình brandname
        {label:'config.brandname.role',value:'CAUHINH_BRANDNAME'},
        
        // Cấu hình mail server
        {label:'config.email.server.role', value: 'CAUHINH_MAILSERVER'},

    ]
  }
]

export var roleListNB =
[
  {
    //Nhóm chức năng quản lý tài liệu
    label: 'role.contract.list',
    value: 'QLHD',
    items: [
      //Thêm mới tài liệu đơn lẻ không theo mẫu
      { label: 'add.contract.one.not.template', value: 'QLHD_01' },
      //Thêm mới tài liệu đơn lẻ theo mẫu
      { label: 'add.contract.one.template', value: 'QLHD_14' },
      //Thêm mới tài liệu theo lô
      { label: 'add.contract.batch', value: 'QLHD_15' },
      //Sửa tài liệu
      { label: 'fix.contract', value: 'QLHD_02' },
      //Xem danh sách tài liệu của tổ chức của tôi và tổ chức con
      {
        label: 'view.list.contracts.me.and.child',
        value: 'QLHD_03',
      },
      //Xem danh sách tài liệu của tổ chức của tôi
      { label: 'view.list.contracts.me', value: 'QLHD_04' },
      //Xem danh sách tài liệu của tôi
      //Tìm kiếm tài liệu
      { label: 'search.contract', value: 'QLHD_06' },
      //Xem thông tin chi tiết tài liệu
      { label: 'role.contract.view.detail', value: 'QLHD_07' },
      //Sao chép tài liệu
      { label: 'contract.copy', value: 'QLHD_08' },
      //Hủy tài liệu
      { label: 'contract.cancel', value: 'QLHD_09' },
      //Xem lịch sử tài liệu
      { label: 'role.contract.view.history', value: 'QLHD_10' },
      //Tạo tài liệu liên quan
      { label: 'role.contract.create.connect', value: 'QLHD_11' },
      //Xem tài liệu liên quan
      { label: 'contract.connect.view', value: 'QLHD_12' },
      //Chia sẻ tài liệu
      { label: 'contract.share', value: 'QLHD_13' },
      //Thanh lý tài liệu,
      { label: 'contract.liquidation', value: 'QLHD_16'}
    ],
  },
  {
    //Nhóm chức năng quản lý mẫu tài liệu
    label: 'role.contract-template.list', value: "QLMHD",
    items: [
      //Thêm mới mẫu tài liệu
      { label: 'contract-template.add', value: "QLMHD_01"},
      //Sửa mẫu tài liệu
      { label: 'role.contract-template.edit', value: "QLMHD_02"},
      //Ngừng phát hành mẫu tài liệu
      { label: 'role.contract-template.stop', value: "QLMHD_03"},
      //Phát hành mẫu tài liệu
      { label: 'role.contract-template.start', value: "QLMHD_04"},
      //Chia sẻ mẫu tài liệu
      { label: 'role.contract-template.share', value: "QLMHD_05"},
      //Tìm kiếm mẫu tài liệu
      { label: 'role.contract-template.filter', value: "QLMHD_06"},
      //Xóa mẫu tài liệu
      { label: 'role.contract-template.delete', value: "QLMHD_07"},
      //Xem thông tin chi tiết mẫu tài liệu
      { label: 'role.contract-template.view.detail', value: "QLMHD_08"},
      { label: 'role.contract-template.copy', value: 'QLMHD_09' },
    ]
  },
  {
    //Nhóm chức năng quản lý tổ chức
    label: 'role.unit.list',
    value: 'QLTC',
    items: [
      //Thêm mới tổ chức
      { label: 'unit.add', value: 'QLTC_01' },
      //Sửa tổ chức
      { label: 'role.unit.edit', value: 'QLTC_02' },
      //Tìm kiếm tổ chức
      { label: 'role.unit.filter', value: 'QLTC_03' },
      //Xem thông tin chi tiết tổ chức
      { label: 'role.unit.view.detail', value: 'QLTC_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý người dùng
    label: 'role.user.list',
    value: 'QLND',
    items: [
      //Thêm mới người dùng
      { label: 'user.add', value: 'QLND_01' },
      //Sửa người dùng
      { label: 'role.user.edit', value: 'QLND_02' },
      //Tìm kiếm người dùng
      { label: 'role.user.filter', value: 'QLND_03' },
      //Xem thông tin chi tiết người dùng
      { label: 'role.user.view.detail', value: 'QLND_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý vai trò
    label: 'role.list.v2',
    value: 'QLVT',
    items: [
      //Thêm mới vai trò
      { label: 'role.add', value: 'QLVT_01' },
      //Sửa vai trò
      { label: 'role.edit', value: 'QLVT_02' },
      //Xóa vai trò
      { label: 'role.delete', value: 'QLVT_03' },
      //Tìm kiếm vai trò
      { label: 'role.filter', value: 'QLVT_04' },
      //Xem thông tin chi tiết vai trò
      { label: 'role.view.detail', value: 'QLVT_05' },
    ],
  },
  {
    //Nhóm chức năng quản lý loại tài liệu
    label: 'role.contract-type.list',
    value: 'QLLHD',
    items: [
      //Thêm mới loại tài liệu
      { label: 'role.contract-type.add', value: 'QLLHD_01' },
      //Sửa loại tài liệu
      { label: 'role.contract-type.edit', value: 'QLLHD_02' },
      //Xóa loại tài liệu
      { label: 'role.contract-type.delete', value: 'QLLHD_03' },
      //Tìm kiếm loại tài liệu
      { label: 'role.contract-type.filter', value: 'QLLHD_04' },
      //Xem thông tin chi tiết loại tài liệu
      { label: 'role.contract-type.view.detail', value: 'QLLHD_05' },
    ],
  },

  //Nhóm chức năng báo cáo
  {
    label: 'role.group.report',
    value: 'QLBC',
    items: [
      //Báo cáo chi tiết
      {label: 'role.report.detail',value:'BAOCAO_CHITIET'},

      //Báo cáo sắp hết hiệu lực
      {label: 'role.soon.expire.time',value:'BAOCAO_SAPHETHIEULUC'},

      //Báo cáo trạng thái xử lý
      {label: 'role.processing.status.contract',value:'BAOCAO_TRANGTHAIXULY'},

      //Báo cáo số lượng trạng thái
      {label: 'role.number.status', value:'BAOCAO_SOLUONG_TRANGTHAI'},

      //Báo cáo số lượng theo loại tài liệu
      {label: 'role.contract.type.quantity',value:'BAOCAO_SOLUONG_LOAIHOPDONG'},

      //Báo cáo tài liệu nhận
      {label: 'role.contract.receive', value:'BAOCAO_HOPDONG_NHAN'},

      //Báo cáo số lượng tài liệu econtract-mSale
      {label: 'role.number.contract.econtract.msale', value:'BAOCAO_SOLUONG_HOPDONG_ECONTRACT_MSALE'},
      //Báo cáo trạng thái gửi Sms
      {label: 'role.report.history.send.sms', value:'BAOCAO_TRANGTHAIGUI_SMS'},
      //Báo cáo trạng thái gửi Email
      {label: 'role.report.history.send.email', value:'BAOCAO_TRANGTHAIGUI_EMAIL'},
      //Báo cáo xác thực eKYC
      {label: 'report.ekyc', value:'BAOCAO_EKYC'}
    ]

  },

  //Nhóm chức năng quản lý danh sách chứng thư số
  {
    label:'role.cerificate.list',
    value:'QLDSCTS',
    items: [
      //Thêm mới chứng thư số
      { label: 'role.cerificate.add', value: 'QLDSCTS_01' },
      //Sửa chứng thư số
      { label: 'role.cerificate.update', value: 'QLDSCTS_02' },
      //Xem thông tin chi tiết chứng thư số
      { label: 'role.cerificate.detail', value: 'QLDSCTS_03' },
      //Tìm kiếm chứng thư số
      { label: 'role.cerificate.filter', value: 'QLDSCTS_04' },
    ]
  },

  //Nhóm chức năng cấu hình SMS/Email
  {
    label:'role.config.sms.email',
    value:'QLCH',
    items: [

        //Cấu hình sms
        {label:'config.sms',value:'CAUHINH_SMS'},

        //Cấu hình ngày sắp hết hạn
        {label:'config.day.expiration',value:'CAUHINH_NGAYSAPHETHAN'},
        
        //Cấu hình brandname
        {label:'config.brandname.role',value:'CAUHINH_BRANDNAME'},
        
        // Cấu hình mail server
        {label:'config.email.server.role', value: 'CAUHINH_MAILSERVER'},

    ]
  }
]

export var adminRoleList = [
  {
    //Nhóm chức năng quản lý tổ chức
    label: 'Nhóm chức năng quản lý tổ chức',
    value: 'QLTC',
    items: [
      //Thêm mới tổ chức
      { label: 'Thêm mới tổ chức', value: 'QLTC_01' },
      //Sửa tổ chức
      { label: 'Sửa tổ chức', value: 'QLTC_02' },
      //Thêm mới gói dịch vụ cho tổ chức
      { label: 'Thêm mới gói dịch vụ cho tổ chức', value: 'QLTC_03' },
      //Sửa gói dịch vụ cho tổ chức
      { label: 'Sửa gói dịch vụ cho tổ chức', value: 'QLTC_04' },
      //Theo dõi các gói dịch vụ
      { label: 'Theo dõi các gói dịch vụ', value: 'QLTC_05' },
      //Hủy gói dịch vụ của tổ chức
      { label: 'Hủy gói dịch vụ của tổ chức', value: 'QLTC_06' },
      //Xóa tổ chức
      { label: 'Xóa tổ chức', value: 'QLTC_07' },
      //Kích hoạt tổ chức
      { label: 'Kích hoạt tổ chức', value: 'QLTC_08' },
      //Tìm kiếm tổ chức
      { label: 'Tìm kiếm tổ chức', value: 'QLTC_09' },
      //Xem thông tin chi tiết tổ chức
      { label: 'Xem thông tin chi tiết tổ chức', value: 'QLTC_10' },
    ],
  },
  {
    //Nhóm chức năng quản lý người dùng
    label: 'Nhóm chức năng quản lý người dùng',
    value: 'QLND',
    items: [
      //Thêm mới người dùng
      { label: 'Thêm mới người dùng', value: 'QLND_01' },
      //Sửa người dùng
      { label: 'Sửa người dùng', value: 'QLND_02' },
      //Tìm kiếm người dùng
      { label: 'Tìm kiếm người dùng', value: 'QLND_03' },
      //Xem thông tin chi tiết người dùng
      { label: 'Xem thông tin chi tiết người dùng', value: 'QLND_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý gói dịch vụ
    label: 'Nhóm chức năng quản lý gói dịch vụ',
    value: 'QLGDV',
    items: [
      //Thêm mới gói dịch vụ
      { label: 'Thêm mới gói dịch vụ', value: 'QLGDV_01' },
      //Sửa gói dịch vụ
      { label: 'Sửa gói dịch vụ', value: 'QLGDV_02' },
      //Tìm kiếm gói dịch vụ
      { label: 'Tìm kiếm gói dịch vụ', value: 'QLGDV_03' },
      //Xem thông tin chi tiết gói dịch vụ
      { label: 'Xem thông tin chi tiết gói dịch vụ', value: 'QLGDV_04' },
      //Xóa gói dịch vụ
      { label: 'Xóa gói dịch vụ', value: 'QLGDV_05' },
    ],
  },
  {
    //Nhóm chức năng quản lý thông báo
    label: 'Nhóm chức năng quản lý thông báo',
    value: 'QLTB',
    items: [
      //Xem thông báo
      { label: 'Xem thông báo', value: 'QLTB_01' },
    ],
  },
];

export const contractTypes = [
  {
    id: 1,
    label: 'menu.contract.create.list',
    selectable: false,
    children: [
      {
        id: 1,
        label: 'contract.status.draft',
        status: 0
      },
      {
        id: 2,
        label: 'contract.status.processing',
        status: 20
      },
      {
        id: 3,
        label: 'contract.status.expire',
        status: 33
      },
      {
        id: 4,
        label: 'contract.status.overdue',
        status: 34
      },
      {
        id: 5,
        label: 'contract.status.fail',
        status: 31
      },
      {
        id: 6,
        label: 'contract.status.cancel',
        status: 32
      },
      {
        id: 7,
        label: 'contract.status.complete',
        status: 30
      },
      {
        id: 8,
        label: 'contract.status.liquidated',
        status: 40
      }
    ]
  },
  {
    id: 2,
    label: 'menu.contract.receive.list',
    selectable: false,
    children: [
      {
        id: 1,
        label: 'contract.status.wait-processing',
        status: 1
      },
      {
        id: 2,
        label: 'contract.status.processed',
        status: 4
      },
      {
        id:3,
        label: 'contract.status.share',
        status: -1
      }
    ]
  }
]

// v1
// export const chu_ky_anh = "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"
// export const chu_ky_so = "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";

// v2
export const chu_ky_anh = "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"
export const chu_ky_so = "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"
