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
    id: 4,
    name: 'Ký số bằng HSM',
    is_otp: false
  },
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

export var networkList = [
  { id: 1, name: 'Mobifone' },
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
  { id: 2, name: 'Theo số lượng hợp đồng' },
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
  {id: 'NONE', name:'Không đẩy HĐ nào'},
  {id: 'ALL', name: 'Đẩy toàn bộ hợp đồng'},
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

export var roleList = [
  {
    //Nhóm chức năng quản lý hợp đồng
    label: 'Nhóm chức năng quản lý hợp đồng',
    value: 'QLHD',
    items: [
      //Thêm mới hợp đồng đơn lẻ không theo mẫu
      { label: 'Thêm mới hợp đồng đơn lẻ không theo mẫu', value: 'QLHD_01' },
      //Thêm mới hợp đồng đơn lẻ theo mẫu
      { label: 'Thêm mới hợp đồng đơn lẻ theo mẫu', value: 'QLHD_14' },
      //Thêm mới hợp đồng theo lô
      { label: 'Thêm mới hợp đồng theo lô', value: 'QLHD_15' },
      //Sửa hợp đồng
      { label: 'Sửa hợp đồng', value: 'QLHD_02' },
      //Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con
      {
        label: 'Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con',
        value: 'QLHD_03',
      },
      //Xem danh sách hợp đồng của tổ chức của tôi
      { label: 'Xem danh sách hợp đồng của tổ chức của tôi', value: 'QLHD_04' },
      //Xem danh sách hợp đồng của tôi
      // { label: 'Xem danh sách hợp đồng của tôi', value: 'QLHD_05' },
      //Tìm kiếm hợp đồng
      { label: 'Tìm kiếm hợp đồng', value: 'QLHD_06' },
      //Xem thông tin chi tiết hợp đồng
      { label: 'Xem thông tin chi tiết hợp đồng', value: 'QLHD_07' },
      //Sao chép hợp đồng
      { label: 'Sao chép hợp đồng', value: 'QLHD_08' },
      //Hủy hợp đồng
      { label: 'Hủy hợp đồng', value: 'QLHD_09' },
      //Xem lịch sử hợp đồng
      { label: 'Xem lịch sử hợp đồng', value: 'QLHD_10' },
      //Tạo hợp đồng liên quan
      { label: 'Tạo hợp đồng liên quan', value: 'QLHD_11' },
      //Xem hợp đồng liên quan
      { label: 'Xem hợp đồng liên quan', value: 'QLHD_12' },
      //Chia sẻ hợp đồng
      { label: 'Chia sẻ hợp đồng', value: 'QLHD_13' },
    ],
  },
  {
    //Nhóm chức năng quản lý mẫu hợp đồng
    label: "Nhóm chức năng quản lý mẫu hợp đồng", value: "QLMHD",
    items: [
      //Thêm mới mẫu hợp đồng
      { label: "Thêm mới mẫu hợp đồng", value: "QLMHD_01"},
      //Sửa mẫu hợp đồng
      { label: "Sửa mẫu hợp đồng", value: "QLMHD_02"},
      //Ngừng phát hành mẫu hợp đồng
      { label: "Ngừng phát hành mẫu hợp đồng", value: "QLMHD_03"},
      //Phát hành mẫu hợp đồng
      { label: "Phát hành mẫu hợp đồng", value: "QLMHD_04"},
      //Chia sẻ mẫu hợp đồng
      { label: "Chia sẻ mẫu hợp đồng", value: "QLMHD_05"},
      //Tìm kiếm mẫu hợp đồng
      { label: "Tìm kiếm mẫu hợp đồng", value: "QLMHD_06"},
      //Xóa mẫu hợp đồng
      { label: "Xóa mẫu hợp đồng", value: "QLMHD_07"},
      //Xem thông tin chi tiết mẫu hợp đồng
      { label: "Xem thông tin chi tiết mẫu hợp đồng", value: "QLMHD_08"},
    ]
  },
  {
    //Nhóm chức năng quản lý tổ chức
    label: 'Nhóm chức năng quản lý tổ chức',
    value: 'QLTC',
    items: [
      //Thêm mới tổ chức
      { label: 'Thêm mới tổ chức', value: 'QLTC_01' },
      //Sửa tổ chức
      { label: 'Sửa tổ chức', value: 'QLTC_02' },
      //Tìm kiếm tổ chức
      { label: 'Tìm kiếm tổ chức', value: 'QLTC_03' },
      //Xem thông tin chi tiết tổ chức
      { label: 'Xem thông tin chi tiết tổ chức', value: 'QLTC_04' },
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
    //Nhóm chức năng quản lý vai trò
    label: 'Nhóm chức năng quản lý vai trò',
    value: 'QLVT',
    items: [
      //Thêm mới vai trò
      { label: 'Thêm mới vai trò', value: 'QLVT_01' },
      //Sửa vai trò
      { label: 'Sửa vai trò', value: 'QLVT_02' },
      //Xóa vai trò
      { label: 'Xóa vai trò', value: 'QLVT_03' },
      //Tìm kiếm vai trò
      { label: 'Tìm kiếm vai trò', value: 'QLVT_04' },
      //Xem thông tin chi tiết vai trò
      { label: 'Xem thông tin chi tiết vai trò', value: 'QLVT_05' },
    ],
  },
  {
    //Nhóm chức năng quản lý loại hợp đồng
    label: 'Nhóm chức năng quản lý loại hợp đồng',
    value: 'QLLHD',
    items: [
      //Thêm mới loại hợp đồng
      { label: 'Thêm mới loại hợp đồng', value: 'QLLHD_01' },
      //Sửa loại hợp đồng
      { label: 'Sửa loại hợp đồng', value: 'QLLHD_02' },
      //Xóa loại hợp đồng
      { label: 'Xóa loại hợp đồng', value: 'QLLHD_03' },
      //Tìm kiếm loại hợp đồng
      { label: 'Tìm kiếm loại hợp đồng', value: 'QLLHD_04' },
      //Xem thông tin chi tiết loại hợp đồng
      { label: 'Xem thông tin chi tiết loại hợp đồng', value: 'QLLHD_05' },
    ],
  },

  //Nhóm chức năng báo cáo
  {
    label: 'Nhóm chức năng báo cáo',
    value: 'QLBC',
    items: [
      //Báo cáo chi tiết
      {label: 'Báo cáo chi tiết',value:'BAOCAO_CHITIET'},

      {label: 'Báo cáo sắp hết hiệu lực',value:'BAOCAO_SAPHETHIEULUC'},
      {label: 'Báo cáo trạng thái xử lý',value:'BAOCAO_TRANGTHAIXULY'},
      {label: 'Báo cáo số lượng theo trạng thái', value:'BAOCAO_SOLUONG_TRANGTHAI'},
      {label: 'Báo cáo số lượng theo loại hợp đồng',value:'BAOCAO_SOLUONG_LOAIHOPDONG'}
    ]

  }
];

export var roleList_en = [
  {
    //Nhóm chức năng quản lý hợp đồng
    label: 'Contract management functional group',
    value: 'QLHD',
    items: [
      //Thêm mới hợp đồng đơn lẻ không theo mẫu
      { label: 'Create non-formal single contract', value: 'QLHD_01' },
      //Thêm mới hợp đồng đơn lẻ theo mẫu
      { label: 'Create single contract form', value: 'QLHD_14' },
      //Thêm mới hợp đồng theo lô
      { label: 'Create  batch contract', value: 'QLHD_15' },
      //Sửa hợp đồng
      { label: 'Edit contract', value: 'QLHD_02' },
      //Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con
      {
        label: 'View a list of contracts for my organization and its suborganization',
        value: 'QLHD_03',
      },
      //Xem danh sách hợp đồng của tổ chức của tôi
      { label: 'View a list of my organization contract', value: 'QLHD_04' },
      //Xem danh sách hợp đồng của tôi
      // { label: 'Xem danh sách hợp đồng của tôi', value: 'QLHD_05' },
      //Tìm kiếm hợp đồng
      { label: 'Contract search', value: 'QLHD_06' },
      //Xem thông tin chi tiết hợp đồng
      { label: 'View contract details', value: 'QLHD_07' },
      //Sao chép hợp đồng
      { label: 'Copy contract', value: 'QLHD_08' },
      //Hủy hợp đồng
      { label: 'Cancel contract', value: 'QLHD_09' },
      //Xem lịch sử hợp đồng
      { label: 'View contract history', value: 'QLHD_10' },
      //Tạo hợp đồng liên quan
      { label: 'Create related contract', value: 'QLHD_11' },
      //Xem hợp đồng liên quan
      { label: 'View related contract', value: 'QLHD_12' },
      //Chia sẻ hợp đồng
      { label: 'Share contract', value: 'QLHD_13' },
    ],
  },
  {
    //Nhóm chức năng quản lý mẫu hợp đồng
    label: "Functional group to manage contract template", value: "QLMHD",
    items: [
      //Thêm mới mẫu hợp đồng
      { label: "Create contract template", value: "QLMHD_01"},
      //Sửa mẫu hợp đồng
      { label: "Edit contract template", value: "QLMHD_02"},
      //Ngừng phát hành mẫu hợp đồng
      { label: "Stop releasing contract template", value: "QLMHD_03"},
      //Phát hành mẫu hợp đồng
      { label: "Release of contract template", value: "QLMHD_04"},
      //Chia sẻ mẫu hợp đồng
      { label: "Share contract template", value: "QLMHD_05"},
      //Tìm kiếm mẫu hợp đồng
      { label: "Search contract template", value: "QLMHD_06"},
      //Xóa mẫu hợp đồng
      { label: "Delete contract template", value: "QLMHD_07"},
      //Xem thông tin chi tiết mẫu hợp đồng
      { label: "View contract detail", value: "QLMHD_08"},
    ]
  },
  {
    //Nhóm chức năng quản lý tổ chức
    label: 'Organizational management functional group',
    value: 'QLTC',
    items: [
      //Thêm mới tổ chức
      { label: 'Create organization', value: 'QLTC_01' },
      //Sửa tổ chức
      { label: 'Edit organization', value: 'QLTC_02' },
      //Tìm kiếm tổ chức
      { label: 'Search organization', value: 'QLTC_03' },
      //Xem thông tin chi tiết tổ chức
      { label: 'View organization detail', value: 'QLTC_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý người dùng
    label: 'User management function group',
    value: 'QLND',
    items: [
      //Thêm mới người dùng
      { label: 'Creat user', value: 'QLND_01' },
      //Sửa người dùng
      { label: 'Edit user', value: 'QLND_02' },
      //Tìm kiếm người dùng
      { label: 'Search user', value: 'QLND_03' },
      //Xem thông tin chi tiết người dùng
      { label: 'View user detail', value: 'QLND_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý vai trò
    label: 'Role management functional group',
    value: 'QLVT',
    items: [
      //Thêm mới vai trò
      { label: 'Create role', value: 'QLVT_01' },
      //Sửa vai trò
      { label: 'Edit role ', value: 'QLVT_02' },
      //Xóa vai trò
      { label: 'Delete role', value: 'QLVT_03' },
      //Tìm kiếm vai trò
      { label: 'Tìm kiếm vai trò', value: 'QLVT_04' },
      //Xem thông tin chi tiết vai trò
      { label: 'View role detail', value: 'QLVT_05' },
    ],
  },
  {
    //Nhóm chức năng quản lý loại hợp đồng
    label: 'Functional group to manage contract type',
    value: 'QLLHD',
    items: [
      //Thêm mới loại hợp đồng
      { label: 'Create contract type', value: 'QLLHD_01' },
      //Sửa loại hợp đồng
      { label: 'Edit contract type', value: 'QLLHD_02' },
      //Xóa loại hợp đồng
      { label: 'Delete contract type', value: 'QLLHD_03' },
      //Tìm kiếm loại hợp đồng
      { label: 'Search contract type', value: 'QLLHD_04' },
      //Xem thông tin chi tiết loại hợp đồng
      { label: 'View contract type detail', value: 'QLLHD_05' },
    ],
  },
   //Nhóm chức năng báo cáo
  //  {
  //   label: 'Reporting function group',
  //   value: 'QLBC',
  //   items: [
  //     //Báo cáo chi tiết
  //     {label: 'Detailed report',value:'BAOCAO_CHITIET'},
      
  //     {label: 'The report is about to expire',value:'BAOCAO_SAPHETHIEULUC'},
  //     {label: 'Processing status report',value:'BAOCAO_TRANGTHAIXULY'},
  //     {label: 'Report quantity by status', value:'BAOCAO_SOLUONG_TRANGTHAI'},
  //     {label: 'Report quantity by contract type',value:'BAOCAO_SOLUONG_LOAIHOPDONG'}
  //   ]

  // }
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

export const chu_ky_anh = "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"

export const chu_ky_so = "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";